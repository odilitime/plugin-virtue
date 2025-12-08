/**
 * @fileoverview Plugin Virtue - Type Definitions
 * 
 * This file defines all TypeScript interfaces and types for the virtue tracking system.
 * 
 * Design Philosophy:
 * 
 * 1. Why Separate source: 'self-report' | 'observed'
 *    - Different behaviors require different point values
 *    - Analytics: Track which source drives engagement
 *    - Upgrade path: Observed can upgrade to self-report same day
 *    - Alternative considered: Single source with "upgraded" flag
 *    - Rejected: Harder to query, less clear semantics
 * 
 * 2. Why Nested checkIns: { [date]: { [virtueId]: CheckIn } }
 *    - Fast lookup: O(1) to check if virtue logged today
 *    - Date-based: Natural fit for streak calculation
 *    - Alternative considered: Flat array of check-ins
 *    - Rejected: O(n) lookup, harder to enforce "one per day" rule
 * 
 * 3. Why Store timezone Per-User
 *    - Streaks respect local day boundaries
 *    - User in Australia shouldn't lose streak due to UTC midnight
 *    - Alternative considered: Server timezone only
 *    - Rejected: Unfair to users in different timezones
 * 
 * 4. Why clusterScores in DNA Profile
 *    - Enables "character class" determination (Stoic, Sage, etc.)
 *    - More interesting than raw virtue counts
 *    - Creates distinct player identities
 *    - Used for personalized suggestions
 * 
 * 5. Why contextClues Array (Not Boolean Flags)
 *    - Extensible: Can add new clues without schema changes
 *    - Composable: Rules can require multiple clues
 *    - Alternative considered: { isReply: boolean, mentionsOther: boolean }
 *    - Rejected: Adding new clue requires type update everywhere
 * 
 * @see constants.ts for actual virtue definitions and game balance values
 * @see services/virtueService.ts for business logic using these types
 */

import type { UUID } from '@elizaos/core';

// ============================================================================
// Virtue Core Types
// ============================================================================

/**
 * Virtue Definition
 * 
 * Why immutable (defined in constants):
 * - Franklin's 13 virtues are historical, shouldn't change
 * - Future: Could allow custom virtues per community
 * - For now: Simplicity over flexibility
 */
export interface Virtue {
  id: string;                // Unique identifier (e.g., 'humility')
  name: string;              // Display name (e.g., 'Humility')
  description: string;       // Franklin's original description
  cluster: VirtueCluster;    // For DNA profiling (groups related virtues)
  keywords: string[];        // For detection (refined daily by LLM)
}

/**
 * Virtue Clusters (for DNA Profiling)
 * 
 * Why these specific clusters:
 * - Based on virtue theory (ancient philosophy + psychology)
 * - Self-control: Temperance, moderation, tranquility, chastity
 * - Wisdom: Silence, sincerity, humility
 * - Discipline: Order, frugality, cleanliness
 * - Courage: Resolution, industry
 * - Compassion: Justice
 * 
 * Why not more clusters:
 * - Too many = diluted, less distinct identities
 * - 5 clusters = manageable, clear archetypes
 */
export type VirtueCluster = 'self-control' | 'wisdom' | 'discipline' | 'courage' | 'compassion';

// ============================================================================
// User Data Types
// ============================================================================

/**
 * Individual Check-In Record
 * 
 * Why track source separately:
 * - Different point values (self-report: 10, observed: 5)
 * - Enables upgrade path (observed → self-report same day)
 * - Analytics: Which source drives more engagement?
 * 
 * Why store points in check-in:
 * - Historical record (if point values change, old check-ins preserve original)
 * - Simplifies recalculations (don't need to re-apply old logic)
 * - Alternative: Calculate points on-the-fly from source
 * - Rejected: Harder to handle point value changes over time
 */
export interface VirtueCheckIn {
  virtueId: string;
  source: 'self-report' | 'observed';  // How was this virtue logged?
  timestamp: number;                    // When (Unix ms)
  points: number;                       // How much earned (preserves historical value)
}

/**
 * Streak Information
 * 
 * Why track both current and longest:
 * - Current: Active streak (motivates daily practice)
 * - Longest: Historical record (doesn't decrease, motivates to beat it)
 * - lastDate: For streak calculation (checked in today or yesterday?)
 * 
 * Why allow null lastDate:
 * - New users haven't checked in yet
 * - Clearer than empty string or epoch timestamp
 */
export interface VirtueStreakInfo {
  current: number;           // Active streak (0 if broken)
  longest: number;           // Best ever (never decreases)
  lastDate: string | null;   // Last check-in date (YYYY-MM-DD in user's timezone)
}

export interface VirtueUserData {
  entityId: string;
  timezone: string;
  checkIns: {
    [date: string]: {
      [virtueId: string]: VirtueCheckIn;
    };
  };
  streaks: VirtueStreakInfo;
  totalPoints: number;
  badges: string[];
  reminderEnabled: boolean;
  dnaProfile?: VirtueDNA;
}

// ============================================================================
// Detection & Rules Types
// ============================================================================

export interface VirtueDetectionRule {
  virtueId: string;
  keywords: string[];
  contextClues: string[];
  excludePatterns: string[];
  confidence: number;
}

export interface DetectionContext {
  text: string;
  isReply: boolean;
  mentionsOther: boolean;
}

export interface RuleProposal {
  virtueId: string;
  action: 'add_keyword' | 'remove_keyword' | 'add_exclude' | 'remove_exclude' | 'adjust_confidence';
  value: string | number;
  reasoning: string;
}

export interface RuleChangelogEntry {
  timestamp: number;
  taskId: string;
  changes: {
    virtueId: string;
    action: string;
    oldValue: any;
    newValue: any;
    reasoning: string;
  }[];
}

// ============================================================================
// Badge Types
// ============================================================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  condition: (data: VirtueUserData) => boolean;
}

export interface PlatformBadge extends Badge {
  platform: string;
}

// ============================================================================
// DNA Profile Types
// ============================================================================

export interface VirtueDNA {
  primary: string;
  secondary: string;
  growth: string;
  archetype: string;
  clusterScores: Record<string, number>;
  traits: string[];
}

// ============================================================================
// Leaderboard Types
// ============================================================================

export interface LeaderboardEntry {
  entityId: string;
  displayName: string;
  points: number;
  rank: number;
  streak: number;
  badges: number;
}

export interface Leaderboard {
  worldId: string;
  updatedAt: number;
  entries: LeaderboardEntry[];
}

// ============================================================================
// Privacy & Config Types
// ============================================================================

export interface PrivacySettings {
  optOutObservation?: boolean;
  optOutLeaderboard?: boolean;
  optOutCommunityInsights?: boolean;
  allowPublicSharing?: boolean;
  dataRetentionDays?: number;
}

export interface VirtueConfig {
  pointValues: {
    selfReport: number;
    observed: number;
    streakBonusPerDay: number;
    streakBonusCap: number;
    weeklyCompletionBonus: number;
  };
  badgeRequirements: Record<string, any>;
  enabledVirtues: string[];
  customVirtues?: Virtue[];
  seasonalEvents?: SeasonalEvent[];
}

// ============================================================================
// Seasonal Events Types
// ============================================================================

export interface SeasonalEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  virtueId: string;
  pointMultiplier: number;
  badge?: string;
}

// ============================================================================
// Community Insights Types
// ============================================================================

export interface CommunityInsights {
  weekId: string;
  weeklyTrends: {
    [virtueId: string]: {
      percentPracticed: number;
      changeFromLastWeek: number;
      totalCheckIns: number;
    };
  };
  peakPracticeTimes: { hour: number; count: number }[];
  mostImprovedVirtue: string;
  participantCount: number;
}

// ============================================================================
// Detection Outcome Types (for rule refinement)
// ============================================================================

export interface DetectionOutcome {
  messageId: string;
  messageText: string;
  detectedVirtue: string | null;
  confidence: number;
  timestamp: number;
  feedback?: 'correct' | 'incorrect' | 'unsure';
}

