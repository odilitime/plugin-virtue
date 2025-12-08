/**
 * @fileoverview VirtueService - Core virtue tracking engine
 * 
 * This service manages all virtue tracking business logic including:
 * - Check-in processing (self-report and observed)
 * - Streak calculation with timezone support
 * - Badge evaluation and awarding
 * - Leaderboard management
 * - DNA profile generation
 * 
 * Design Decisions:
 * 
 * 1. Why cache-based storage:
 *    - Fast reads/writes for frequent operations
 *    - Suitable for 100-1000 users per world
 *    - Can migrate to Redis/DB later without API changes
 * 
 * 2. Why timezone per-user:
 *    - Streaks must respect local day boundaries
 *    - User in Australia shouldn't lose streak due to UTC midnight
 *    - Stored in user data, used in all date calculations
 * 
 * 3. Why separate self-report vs observed:
 *    - Different point values (10 vs 5)
 *    - Self-report can upgrade observed same day
 *    - Tracked in VirtueCheckIn.source for analytics
 * 
 * 4. Why cap streak bonus at +50:
 *    - Prevents runaway point inflation for long-term users
 *    - Keeps new users competitive
 *    - Streak is still valuable but not overwhelming
 * 
 * 5. Why integrate other services in check-in:
 *    - Single transaction: All bonuses calculated together
 *    - Notifications sent immediately on milestone
 *    - Mentor points shared in real-time
 *    - Better UX than delayed updates
 */

import type { IAgentRuntime, UUID } from '@elizaos/core';
import { Service } from '@elizaos/core';
import type {
  VirtueUserData,
  VirtueCheckIn,
  VirtueStreakInfo,
  Leaderboard,
  LeaderboardEntry,
  VirtueDNA,
  VirtueCluster
} from '../types';
import {
  VIRTUES,
  VIRTUE_CLUSTERS,
  POINTS,
  BADGES,
  ARCHETYPES,
  CACHE_KEYS
} from '../constants';
import { toLocalDate, getPreviousDay } from '../utils/formatting';
import { logError, withRetry } from '../utils/errorHandler';

export class VirtueService extends Service {
  static serviceType = 'virtue';
  
  capabilityDescription = 'Manages virtue tracking, streaks, badges, and leaderboards for Franklin\'s Virtue Tracker';

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new VirtueService(runtime);
    runtime.logger.info({ src: 'plugin:virtue', agentId: runtime.agentId }, 'VirtueService started');
    return service;
  }

  async stop(): Promise<void> {
    this.runtime.logger.info({ src: 'plugin:virtue', agentId: this.runtime.agentId }, 'VirtueService stopped');
  }

  // ============================================================================
  // User Data Management
  // ============================================================================

  /**
   * Get or initialize user's virtue data
   * 
   * Why use withRetry wrapper:
   * - Cache operations can fail transiently (network issues, etc.)
   * - Exponential backoff prevents thundering herd
   * - 3 retries is sufficient for most transient failures
   * 
   * Why default timezone to UTC:
   * - Safe fallback if user hasn't set timezone
   * - User can change via SET_TIMEZONE action
   * - Streak calculation still works, just not optimized for their location
   * 
   * @param entityId - User's entity ID
   * @returns User's virtue data (initialized if new user)
   */
  async getUserData(entityId: string): Promise<VirtueUserData> {
    const cacheKey = CACHE_KEYS.USER_DATA(entityId);
    
    return withRetry(async () => {
      const cached = await this.runtime.getCache<VirtueUserData>(cacheKey);
      
      if (cached) return cached;
      
      // Initialize new user with sensible defaults
      const newUser: VirtueUserData = {
        entityId,
        timezone: 'UTC', // Default until user sets their timezone
        checkIns: {}, // Empty check-in history
        streaks: { current: 0, longest: 0, lastDate: null },
        totalPoints: 0,
        badges: [],
        reminderEnabled: false // Opt-in for reminders (privacy-first)
      };
      
      await this.runtime.setCache(cacheKey, newUser);
      return newUser;
    });
  }

  async saveUserData(entityId: string, data: VirtueUserData): Promise<void> {
    const cacheKey = CACHE_KEYS.USER_DATA(entityId);
    await withRetry(() => this.runtime.setCache(cacheKey, data));
  }

  // ============================================================================
  // Check-In Logic
  // ============================================================================

  /**
   * Records a virtue check-in (self-report or observed)
   * 
   * Complex Edge Cases Handled:
   * 
   * 1. Duplicate Detection:
   *    - Same virtue can't be logged twice per day
   *    - Prevents gaming the system with repeated check-ins
   *    - BUT: Observed can be upgraded to self-report
   * 
   * 2. Observed → Self-Report Upgrade:
   *    - Agent observes virtue first (5 pts)
   *    - User later self-reports same virtue (adds 5 more pts)
   *    - Total: 15 pts (10 self-report + 5 observed)
   *    - Why: Rewards both autonomous behavior AND conscious practice
   * 
   * 3. Point Calculation Order:
   *    a. Base points (10 or 5)
   *    b. Seasonal multiplier applied
   *    c. Streak bonus added
   *    d. All-13 bonus if applicable
   *    e. Synergy bonuses checked
   *    f. Challenge progress evaluated
   *    g. Mentor share (20%) sent
   *    - Why this order: Multipliers first, then additive bonuses, then side effects
   * 
   * 4. Timezone Handling:
   *    - Uses user's local timezone for "today"
   *    - Prevents timezone gaming (check in at 11:59 UTC, then 12:01 local time)
   *    - Streak calculation respects local day boundaries
   * 
   * @param entityId - User's entity ID
   * @param virtueId - Virtue being logged
   * @param source - 'self-report' or 'observed'
   * @returns Points earned, whether duplicate, message, new badges
   */
  async recordCheckIn(
    entityId: string,
    virtueId: string,
    source: 'self-report' | 'observed'
  ): Promise<{ points: number; isDuplicate: boolean; message: string; newBadges: string[] }> {
    try {
      const userData = await this.getUserData(entityId);
      const today = toLocalDate(new Date(), userData.timezone);
      
      // Initialize day if needed
      if (!userData.checkIns[today]) {
        userData.checkIns[today] = {};
      }
      
      const existingCheckIn = userData.checkIns[today][virtueId];
      
      /**
       * Case 1: Already checked in this virtue today
       * 
       * Three sub-cases:
       * a) Observed + Observed: Silent ignore (no spam)
       * b) Self-report + Self-report: Positive reinforcement message
       * c) Observed + Self-report: Upgrade (add difference in points)
       * 
       * Why these rules:
       * - Prevents double-dipping while encouraging self-awareness
       * - Upgrade path rewards users who consciously practice after autonomous behavior
       * - Silent ignore for observed prevents notification spam
       */
      if (existingCheckIn) {
        // If self-report exists, don't add observed (highest already logged)
        if (source === 'observed') {
          return {
            points: 0,
            isDuplicate: true,
            message: '', // Silent for observed to avoid spam
            newBadges: []
          };
        }
        
        // If trying to self-report again, acknowledge consistency
        if (existingCheckIn.source === 'self-report') {
          const virtue = VIRTUES.find(v => v.id === virtueId);
          return {
            points: 0,
            isDuplicate: true,
            message: `Already logged **${virtue?.name}** today — nice consistency! ✨`,
            newBadges: []
          };
        }
        
        // Upgrade observed to self-report (add the 5 point difference)
        const additionalPoints = POINTS.SELF_REPORT - POINTS.OBSERVED;
        existingCheckIn.source = 'self-report';
        existingCheckIn.points += additionalPoints;
        userData.totalPoints += additionalPoints;
        
        await this.saveUserData(entityId, userData);
        
        const virtue = VIRTUES.find(v => v.id === virtueId);
        return {
          points: additionalPoints,
          isDuplicate: false,
          message: `Upgraded **${virtue?.name}** to self-report! +${additionalPoints} pts`,
          newBadges: []
        };
      }
      
      // Case 2: New check-in
      let points = source === 'self-report' ? POINTS.SELF_REPORT : POINTS.OBSERVED;
      
      // Apply seasonal event multiplier
      const multiplier = await this.getSeasonalMultiplier(virtueId);
      points = Math.floor(points * multiplier);
      
      userData.checkIns[today][virtueId] = {
        virtueId,
        source,
        timestamp: Date.now(),
        points
      };
      
      userData.totalPoints += points;
      
      // Recalculate streak
      userData.streaks = this.calculateStreak(userData.checkIns, userData.timezone);
      
      // Add streak bonus
      const streakBonus = Math.min(
        userData.streaks.current * POINTS.STREAK_BONUS_PER_DAY,
        POINTS.STREAK_BONUS_CAP
      );
      userData.totalPoints += streakBonus;
      
      // Check for weekly completion bonus (all 13 virtues in one day)
      if (Object.keys(userData.checkIns[today]).length === 13) {
        userData.totalPoints += POINTS.WEEKLY_COMPLETION_BONUS;
      }
      
      // Check for synergy bonuses
      const synergyResult = await this.checkSynergies(userData.checkIns[today]);
      if (synergyResult.bonusPoints > 0) {
        userData.totalPoints += synergyResult.bonusPoints;
      }
      
      // Evaluate badges
      const newBadges = await this.evaluateBadges(userData);
      
      await this.saveUserData(entityId, userData);
      
      // Trigger milestone notifications
      await this.checkMilestones(entityId, userData, newBadges);
      
      // Check challenge progress
      await this.checkChallengeProgress(entityId, userData);
      
      // Share points with mentor (20%)
      await this.shareMentorshipPoints(entityId, points + streakBonus + synergyResult.bonusPoints);
      
      const virtue = VIRTUES.find(v => v.id === virtueId);
      let message = `Logged **${virtue?.name}**! +${points} pts`;
      if (streakBonus > 0) message += ` (+${streakBonus} streak bonus!)`;
      if (synergyResult.bonusPoints > 0) {
        message += `\n🔗 Synergy bonus! +${synergyResult.bonusPoints} pts`;
      }
      
      return {
        points: points + streakBonus + synergyResult.bonusPoints,
        isDuplicate: false,
        message,
        newBadges
      };
    } catch (error) {
      await logError(this.runtime, 'recordCheckIn', error as Error, entityId);
      throw error;
    }
  }

  // ============================================================================
  // Streak Calculation
  // ============================================================================

  /**
   * Calculates current and longest streaks from check-in history
   * 
   * Streak Logic:
   * 
   * 1. Streak is Active if:
   *    - Checked in today, OR
   *    - Checked in yesterday (grace period)
   *    Why grace period: Users shouldn't lose streaks due to sleeping patterns
   * 
   * 2. Current Streak:
   *    - Count consecutive days back from last check-in
   *    - Stops at first gap
   *    Why consecutive: Reinforces daily habit formation
   * 
   * 3. Longest Streak:
   *    - Historical record across all time
   *    - Never decreases (even if current breaks)
   *    Why preserve: Shows best performance, motivates to beat it
   * 
   * 4. Timezone Considerations:
   *    - All dates in user's local timezone
   *    - Prevents exploitation (checking in at UTC midnight != local midnight)
   *    - Example: User in Australia at 11:59 PM local → still counts as "today"
   * 
   * Edge Cases Handled:
   * - Empty history: Returns zeros
   * - Single day: Current = 1, longest = 1
   * - Broken streak: Current = 0, longest = historical max
   * - Timezone changes: Recalculated on timezone update
   * 
   * @param checkIns - Complete check-in history
   * @param timezone - User's IANA timezone (e.g., 'America/New_York')
   * @param now - Current date (injectable for testing)
   * @returns Current streak, longest streak, and last check-in date
   */
  calculateStreak(
    checkIns: Record<string, Record<string, VirtueCheckIn>>,
    timezone: string,
    now: Date = new Date()
  ): VirtueStreakInfo {
    const localNow = toLocalDate(now, timezone);
    const yesterday = this.getYesterday(localNow, timezone);
    
    const dates = Object.keys(checkIns).sort().reverse();
    
    if (dates.length === 0) {
      return { current: 0, longest: 0, lastDate: null };
    }
    
    const lastDate = dates[0];
    
    // Check if streak is still active (checked in today or yesterday)
    if (lastDate !== localNow && lastDate !== yesterday) {
      return {
        current: 0,
        longest: this.calculateLongestStreak(dates),
        lastDate
      };
    }
    
    // Count consecutive days backward from last check-in
    let current = 0;
    let expectedDate = lastDate;
    
    for (const date of dates) {
      if (date === expectedDate) {
        current++;
        expectedDate = getPreviousDay(expectedDate, timezone);
      } else {
        break; // Gap found, streak ends
      }
    }
    
    const longest = Math.max(current, this.calculateLongestStreak(dates));
    
    return { current, longest, lastDate };
  }

  private getYesterday(dateStr: string, timezone: string): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    return toLocalDate(date, timezone);
  }

  private calculateLongestStreak(sortedDates: string[]): number {
    if (sortedDates.length === 0) return 0;
    
    let longest = 1;
    let current = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      
      if (Math.abs(diffDays - 1) < 0.1) {
        current++;
      } else {
        longest = Math.max(longest, current);
        current = 1;
      }
    }
    
    return Math.max(longest, current);
  }

  // ============================================================================
  // Badge Evaluation
  // ============================================================================

  async evaluateBadges(userData: VirtueUserData): Promise<string[]> {
    const newBadges: string[] = [];
    
    for (const badge of BADGES) {
      if (userData.badges.includes(badge.id)) continue;
      
      if (badge.condition(userData)) {
        newBadges.push(badge.id);
        userData.badges.push(badge.id);
      }
    }
    
    return newBadges;
  }

  // ============================================================================
  // Leaderboard Management
  // ============================================================================

  async updateLeaderboard(
    worldId: string,
    entityId: string,
    newPoints: number,
    streak: number,
    badges: number
  ): Promise<void> {
    try {
      const cacheKey = CACHE_KEYS.LEADERBOARD(worldId);
      const leaderboard = await this.runtime.getCache<Leaderboard>(cacheKey) || {
        worldId,
        updatedAt: 0,
        entries: []
      };
      
      let entry = leaderboard.entries.find(e => e.entityId === entityId);
      
      if (entry) {
        entry.points = newPoints;
        entry.streak = streak;
        entry.badges = badges;
      } else {
        const entity = await this.runtime.getEntity(entityId as UUID);
        entry = {
          entityId,
          displayName: entity?.names?.[0] || 'Unknown',
          points: newPoints,
          rank: 0,
          streak,
          badges
        };
        leaderboard.entries.push(entry);
      }
      
      // Sort by points descending
      leaderboard.entries.sort((a, b) => b.points - a.points);
      
      // Update ranks with tie handling
      let currentRank = 1;
      let previousPoints = -1;
      for (let i = 0; i < leaderboard.entries.length; i++) {
        if (leaderboard.entries[i].points !== previousPoints) {
          currentRank = i + 1;
        }
        leaderboard.entries[i].rank = currentRank;
        previousPoints = leaderboard.entries[i].points;
      }
      
      // Trim to top 100
      leaderboard.entries = leaderboard.entries.slice(0, 100);
      leaderboard.updatedAt = Date.now();
      
      await withRetry(() => this.runtime.setCache(cacheKey, leaderboard));
    } catch (error) {
      await logError(this.runtime, 'updateLeaderboard', error as Error, entityId);
    }
  }

  async getLeaderboard(worldId: string): Promise<Leaderboard | null> {
    try {
      const cacheKey = CACHE_KEYS.LEADERBOARD(worldId);
      return await this.runtime.getCache<Leaderboard>(cacheKey);
    } catch (error) {
      await logError(this.runtime, 'getLeaderboard', error as Error);
      return null;
    }
  }

  // ============================================================================
  // DNA Profile Calculation
  // ============================================================================

  /**
   * Calculates a user's "Virtue DNA" - their unique virtue personality profile
   * 
   * Algorithm Design:
   * 
   * 1. Primary & Secondary Virtues:
   *    - Most and second-most practiced virtues (by count, not points)
   *    - Why count not points: Consistency matters more than single big days
   *    - Defaults to humility/justice if no data (Franklin's favorites)
   * 
   * 2. Growth Virtue:
   *    - LEAST practiced virtue (among practiced ones)
   *    - Why not unpracticed: Growth implies you've tried but need focus
   *    - Used in suggestions to encourage balance
   * 
   * 3. Virtue Clusters:
   *    - Groups related virtues: self-control, wisdom, discipline, courage, compassion
   *    - Score = average check-ins across cluster virtues
   *    - Why average not sum: Normalizes across clusters with different sizes
   *    - Example: Self-control has 4 virtues, compassion has 1
   * 
   * 4. Archetype:
   *    - Derived from highest-scoring cluster
   *    - "The Stoic" (self-control), "The Sage" (wisdom), etc.
   *    - RPG-style identity for gamification
   *    - Used in character sheet display
   * 
   * 5. Traits:
   *    - Descriptive adjectives based on cluster scores
   *    - Cluster > 5 average → trait earned
   *    - Individual virtues > 10 → special trait
   *    - Capped at 4 traits to keep profile concise
   * 
   * Why This Matters:
   * - Gives users insight into their patterns
   * - More interesting than just "total points"
   * - Creates distinct identities (not everyone is "high score player")
   * - Informs AI suggestions (recommend growth virtue)
   * - Social: Compare DNA with friends, not just leaderboard rank
   * 
   * Future Enhancements:
   * - DNA "compatibility" for matching mentors/mentees
   * - DNA-based matchmaking for virtue challenges
   * - Historical figure matching (your DNA vs Franklin's)
   * 
   * @param userData - User's complete virtue data
   * @returns VirtueDNA profile with primary, secondary, growth, archetype, clusters, traits
   */
  calculateDNA(userData: VirtueUserData): VirtueDNA {
    // Count total check-ins per virtue (all-time)
    const virtueCount: Record<string, number> = {};
    
    for (const dayCheckIns of Object.values(userData.checkIns)) {
      for (const [virtueId] of Object.entries(dayCheckIns)) {
        virtueCount[virtueId] = (virtueCount[virtueId] || 0) + 1;
      }
    }
    
    // Sort by count to find primary/secondary
    const sorted = Object.entries(virtueCount).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0]?.[0] || 'humility'; // Default to Franklin's favorite
    const secondary = sorted[1]?.[0] || 'justice';
    
    // Growth = least practiced (but still practiced at least once)
    const practicedVirtues = sorted.filter(([_, count]) => count > 0);
    const growth = practicedVirtues.length > 0
      ? practicedVirtues[practicedVirtues.length - 1][0]
      : 'temperance';
    
    // Calculate cluster scores (average check-ins per cluster)
    const clusterScores: Record<string, number> = {};
    for (const [cluster, virtues] of Object.entries(VIRTUE_CLUSTERS)) {
      const score = virtues.reduce((sum, v) => sum + (virtueCount[v] || 0), 0) / virtues.length;
      clusterScores[cluster] = Math.round(score * 10) / 10; // Round to 1 decimal
    }
    
    // Determine archetype from top cluster
    const topCluster = Object.entries(clusterScores).sort((a, b) => b[1] - a[1])[0]?.[0];
    const archetype = ARCHETYPES[topCluster] || 'The Seeker';
    
    // Derive personality traits from clusters and specific virtues
    const traits = this.deriveTraits(clusterScores, virtueCount);
    
    return { primary, secondary, growth, archetype, clusterScores, traits };
  }

  /**
   * Derives personality traits from virtue practice patterns
   * 
   * Thresholds:
   * - Cluster > 5: General trait (avg 5 check-ins per virtue in cluster)
   * - Virtue > 10: Special trait (strong focus on specific virtue)
   * 
   * Why these numbers:
   * - 5 is ~1 week of practice (balance of specificity vs accessibility)
   * - 10 is ~2 weeks (shows commitment to specific virtue)
   * - Max 4 traits: Keeps profile readable and distinct
   * 
   * @param clusterScores - Average check-ins per cluster
   * @param virtueCount - Total check-ins per virtue
   * @returns Array of trait strings (max 4)
   */
  private deriveTraits(clusterScores: Record<string, number>, virtueCount: Record<string, number>): string[] {
    const traits: string[] = [];
    
    // Cluster-based traits (general personality)
    if (clusterScores['self-control'] > 5) traits.push('Composed');
    if (clusterScores['wisdom'] > 5) traits.push('Thoughtful');
    if (clusterScores['discipline'] > 5) traits.push('Organized');
    if (clusterScores['courage'] > 5) traits.push('Determined');
    if (clusterScores['compassion'] > 5) traits.push('Empathetic');
    
    // Virtue-specific traits (focused practice)
    if (virtueCount['humility'] > 10) traits.push('Humble');
    if (virtueCount['industry'] > 10) traits.push('Industrious');
    
    // Cap at 4 traits to keep profile concise
    return traits.slice(0, 4);
  }

  // ============================================================================
  // Seasonal Events
  // ============================================================================

  private async getSeasonalMultiplier(virtueId: string): Promise<number> {
    try {
      const { SeasonalEventsService } = await import('./seasonalEventsService');
      const seasonalService = this.runtime.getService<typeof SeasonalEventsService.prototype>('virtue_seasonal_events');
      if (!seasonalService) return 1.0;

      return await (seasonalService as any).getPointMultiplier(virtueId);
    } catch {
      return 1.0;
    }
  }

  // ============================================================================
  // Synergy & Challenge Integration
  // ============================================================================

  private async checkSynergies(checkInsToday: Record<string, any>): Promise<{ synergies: string[]; bonusPoints: number }> {
    try {
      const { VirtueSynergyService } = await import('./virtuesynergyService');
      const synergyService = this.runtime.getService<typeof VirtueSynergyService.prototype>('virtue_synergy');
      if (!synergyService) return { synergies: [], bonusPoints: 0 };

      return await (synergyService as any).checkSynergies(checkInsToday);
    } catch {
      return { synergies: [], bonusPoints: 0 };
    }
  }

  private async checkChallengeProgress(entityId: string, userData: VirtueUserData): Promise<void> {
    try {
      const { VirtueChallengeService } = await import('./virtueChallengeService');
      const challengeService = this.runtime.getService<typeof VirtueChallengeService.prototype>('virtue_challenge');
      if (!challengeService) return;

      const result = await (challengeService as any).checkChallengeProgress(entityId, userData);
      
      if (result.rewards > 0) {
        userData.totalPoints += result.rewards;
        await this.saveUserData(entityId, userData);
        
        // Notify about challenge completion
        const { NotificationService } = await import('./notificationService');
        const notificationService = this.runtime.getService<typeof NotificationService.prototype>('virtue_notification');
        if (notificationService) {
          for (const challengeId of result.completed) {
            await (notificationService as any).sendDM(
              entityId,
              `🏆 Challenge Completed! You earned ${result.rewards} bonus points!`
            );
          }
        }
      }
    } catch (error) {
      // Silent failure
      this.runtime.logger.debug({
        src: 'plugin:virtue',
        context: 'checkChallengeProgress',
        error: error instanceof Error ? error.message : String(error)
      }, 'Failed to check challenge progress');
    }
  }

  // ============================================================================
  // Mentorship Integration
  // ============================================================================

  private async shareMentorshipPoints(entityId: string, points: number): Promise<void> {
    try {
      const { MentorshipService } = await import('./mentorshipService');
      const mentorshipService = this.runtime.getService<typeof MentorshipService.prototype>('virtue_mentorship');
      if (!mentorshipService) return;

      await (mentorshipService as any).shareMenteePoints(entityId, points);
    } catch (error) {
      // Silent failure
      this.runtime.logger.debug({
        src: 'plugin:virtue',
        context: 'shareMentorshipPoints',
        error: error instanceof Error ? error.message : String(error)
      }, 'Failed to share mentorship points');
    }
  }

  // ============================================================================
  // Milestone Notifications
  // ============================================================================

  private async checkMilestones(
    entityId: string,
    userData: VirtueUserData,
    newBadges: string[]
  ): Promise<void> {
    try {
      const { NotificationService } = await import('./notificationService');
      const notificationService = this.runtime.getService<typeof NotificationService.prototype>('virtue_notification');
      if (!notificationService) return;

      // Notify streak milestones
      const streakMilestones = [7, 14, 21, 30, 60, 90, 100, 365];
      if (streakMilestones.includes(userData.streaks.current)) {
        await (notificationService as any).notifyStreakMilestone(entityId, userData.streaks.current);
      }

      // Notify badge unlocks
      if (newBadges.length > 0) {
        await (notificationService as any).notifyBadgeUnlock(entityId, newBadges);
      }
    } catch (error) {
      // Silent failure for notifications
      this.runtime.logger.debug({
        src: 'plugin:virtue',
        context: 'checkMilestones',
        error: error instanceof Error ? error.message : String(error)
      }, 'Failed to check milestones');
    }
  }
}

