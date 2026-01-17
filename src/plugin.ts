/**
 * @fileoverview Plugin Virtue - Benjamin Franklin's Virtue Tracker
 * 
 * This plugin implements Franklin's famous virtue tracking system with modern gamification.
 * 
 * Design Philosophy:
 * - Rule-based observation (no LLM per message for performance)
 * - Self-improving AI (daily LLM refinement of detection rules)
 * - Privacy-first (GDPR compliant with opt-outs)
 * - Platform-agnostic (works on Discord, Telegram, Twitter)
 * - Multi-layered gamification (streaks, synergies, challenges, mentorship)
 * 
 * Architecture Decisions:
 * - Cache-based storage: Suitable for 100-1000 users, can migrate to DB later
 * - Versioned user data (v1): Enables future migrations without data loss
 * - Bootstrap dependency: Leverages existing TaskService for periodic tasks
 * - Service-based architecture: Clean separation of concerns, testable
 */

import type { Plugin, IAgentRuntime } from '@elizaos/core';
import { VirtueService } from './services/virtueService';
import { NotificationService } from './services/notificationService';
import { SeasonalEventsService } from './services/seasonalEventsService';
import { VirtueSynergyService } from './services/virtuesynergyService';
import { VirtueChallengeService } from './services/virtueChallengeService';
import { MentorshipService } from './services/mentorshipService';
import { HistoricalComparisonService } from './services/historicalComparisonService';
import { VirtueRemixService } from './services/virtueRemixService';
import { checkInVirtueAction } from './actions/checkInVirtue';
import { viewProgressAction } from './actions/viewProgress';
import { viewLeaderboardAction } from './actions/viewLeaderboard';
import { setTimezoneAction } from './actions/setTimezone';
import { setReminderAction } from './actions/setReminder';
import { viewCharacterSheetAction } from './actions/viewCharacterSheet';
import { shareProgressAction } from './actions/shareProgress';
import { viewEventsAction } from './actions/viewEvents';
import { viewSynergiesAction } from './actions/viewSynergies';
import { viewChallengesAction } from './actions/viewChallenges';
import { joinChallengeAction } from './actions/joinChallenge';
import { becomeMentorAction } from './actions/becomeMentor';
import { compareHistoryAction } from './actions/compareHistory';
import { getSuggestionsAction } from './actions/getSuggestions';
import { setPrivacyAction } from './actions/setPrivacy';
import { deleteMyDataAction } from './actions/deleteMyData';
import { exportDataAction } from './actions/exportData';
import { resetStreakAction } from './actions/admin/resetStreak';
import { awardBadgeAction } from './actions/admin/awardBadge';
import { auditRulesAction } from './actions/admin/auditRules';
import { virtueObserverEvaluator } from './evaluators/virtueObserver';
import { ruleRefinementWorker } from './tasks/ruleRefinementWorker';
import { communityReportWorker } from './tasks/communityReportWorker';
import { dailyReminderWorker } from './tasks/dailyReminderWorker';
import { virtueProvider } from './providers/virtueProvider';
import { printBanner } from './banner';
import { CACHE_KEYS, INITIAL_DETECTION_RULES } from './constants';

/**
 * Ensures a repeating task exists in the database
 * 
 * Why this approach:
 * - Idempotent: Safe to call multiple times (checks existence first)
 * - Uses Bootstrap's TaskService: Leverages existing infrastructure
 * - 'repeat' tag: TaskService automatically re-queues after execution
 * - updateInterval metadata: TaskService uses this to schedule next run
 * 
 * @param runtime - Agent runtime instance
 * @param taskName - Unique task identifier (e.g., 'VIRTUE_RULE_REFINEMENT')
 * @param options - Task configuration (interval, description)
 */
async function ensureRepeatingTask(
  runtime: IAgentRuntime,
  taskName: string,
  options: { updateInterval: number; description: string }
): Promise<void> {
  try {
    const existingTasks = await runtime.getTasksByName(taskName);

    // Only create if doesn't exist - prevents duplicates on plugin reload
    if (existingTasks.length === 0) {
      await runtime.createTask({
        name: taskName,
        description: options.description,
        tags: ['queue', 'repeat'], // 'repeat' tag tells TaskService to reschedule
        metadata: {
          updatedAt: Date.now(),
          updateInterval: options.updateInterval
        }
      });

      runtime.logger.info({ src: 'plugin:virtue', taskName }, 'Created repeating virtue task');
    }
  } catch (error) {
    // Task creation may fail during early initialization (e.g., agent not yet in DB)
    // This is non-fatal - the task can be created later
    runtime.logger.warn({
      src: 'plugin:virtue',
      taskName,
      error: error instanceof Error ? error.message : String(error)
    }, 'Could not create repeating task (will retry on next init)');
  }
}

/**
 * Plugin Virtue - Benjamin Franklin's Virtue Tracker
 * 
 * Key Features:
 * - Self-reporting: Users manually log virtue practice
 * - Passive observation: AI detects virtuous behavior in chat
 * - Self-improving: Daily LLM task refines detection rules
 * - Gamification: Points, streaks, badges, leaderboards
 * - Social: Mentorship system, challenges, public recognition
 * - Privacy: GDPR compliant with opt-outs and data export
 * 
 * @see README.md for user documentation
 * @see ALL_PHASES_COMPLETE.md for implementation details
 */
export const virtuePlugin: Plugin = {
  name: '@elizaos/plugin-virtue',
  description: "Benjamin Franklin's Virtue Tracker - gamified self-improvement plugin",

  /**
   * Why depend on bootstrap:
   * - We need TaskService for periodic tasks (rule refinement, community reports)
   * - Bootstrap provides the task scheduling infrastructure
   * - Alternative would be setInterval, but TaskService persists across restarts
   */
  dependencies: ['@elizaos/plugin-bootstrap'],

  async init(_config: Record<string, string>, runtime: IAgentRuntime) {
    try {
      printBanner({
        pluginName: '@elizaos/plugin-virtue',
        description: "Benjamin Franklin's Virtue Tracker - gamified self-improvement plugin",
        runtime,
      });

      runtime.logger.info({ src: 'plugin:virtue', agentId: runtime.agentId }, 'Initializing virtue plugin');

      /**
       * Step 1: Register task workers
       * 
       * Why register workers first:
       * - Workers must exist before tasks are queued
       * - TaskService looks up workers by name when executing tasks
       * - Registration is idempotent (safe to call multiple times)
       */
      runtime.registerTaskWorker(ruleRefinementWorker);
      runtime.registerTaskWorker(communityReportWorker);
      runtime.registerTaskWorker(dailyReminderWorker);

      /**
       * Step 2: Initialize detection rules
       * 
       * Why initialize rules on first run:
       * - Rules are stored in cache (not in code) so they can be modified by LLM
       * - Check existence first to preserve any refined rules
       * - INITIAL_DETECTION_RULES is just the starting point
       */
      const existingRules = await runtime.getCache(CACHE_KEYS.RULES(runtime.agentId));
      if (!existingRules) {
        await runtime.setCache(CACHE_KEYS.RULES(runtime.agentId), INITIAL_DETECTION_RULES);
        runtime.logger.debug({ src: 'plugin:virtue' }, 'Initialized detection rules');
      }

      /**
       * Step 3: Create repeating tasks (deferred until database is ready)
       * 
       * Why these specific intervals:
       * - 24 hours for rule refinement: Daily is frequent enough to adapt but not spam LLM
       * - 7 days for community report: Weekly matches human reflection cycles
       * 
       * Why use 'repeat' tag:
       * - TaskService automatically re-queues tasks with 'repeat' tag after execution
       * - updateInterval in metadata tells TaskService when to run next
       * 
       * Why use .then() instead of await:
       * - Plugin init must complete for runtime init to finish (avoid deadlock)
       * - Database adapter may not be ready during plugin init phase
       */
      runtime.initPromise.then(async () => {
        try {
          await ensureRepeatingTask(runtime, 'VIRTUE_RULE_REFINEMENT', {
            updateInterval: 24 * 60 * 60 * 1000, // 24 hours
            description: 'Refine virtue detection rules via LLM'
          });

          await ensureRepeatingTask(runtime, 'VIRTUE_COMMUNITY_REPORT', {
            updateInterval: 7 * 24 * 60 * 60 * 1000, // 7 days
            description: 'Generate weekly community virtue insights'
          });
        } catch (error) {
          runtime.logger.warn({
            src: 'plugin:virtue',
            error: error instanceof Error ? error.message : String(error)
          }, 'Failed to create repeating tasks (non-fatal)');
        }
      });

      runtime.logger.info({ src: 'plugin:virtue', agentId: runtime.agentId }, 'Virtue plugin initialized successfully');
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error)
      }, 'Failed to initialize virtue plugin');
      throw error;
    }
  },

  /**
   * Services: 8 total
   * 
   * Why separate services:
   * - VirtueService: Core business logic (single responsibility)
   * - NotificationService: Isolates messaging concerns
   * - SeasonalEventsService: Time-based logic separate from core
   * - VirtueSynergyService: Combo detection is complex enough to warrant separation
   * - VirtueChallengeService: Quest tracking is independent feature
   * - MentorshipService: Social features don't belong in core tracking
   * - HistoricalComparisonService: Pure calculation, no side effects
   * - VirtueRemixService: LLM suggestions isolated from other logic
   * 
   * Each service can be tested independently and has clear boundaries.
   */
  services: [
    VirtueService,
    NotificationService,
    SeasonalEventsService,
    VirtueSynergyService,
    VirtueChallengeService,
    MentorshipService,
    HistoricalComparisonService,
    VirtueRemixService
  ],

  /**
   * Actions: 19 total
   * 
   * Why so many actions:
   * - Each represents a distinct user intent
   * - Grouped logically (tracking, settings, data, admin)
   * - Better than one mega-action because:
   *   1. Clearer validation (each action has specific trigger phrases)
   *   2. Better examples for LLM to learn from
   *   3. More accurate action selection
   *   4. Easier to test and maintain
   */
  actions: [
    // Core user actions: Primary virtue tracking features
    checkInVirtueAction,
    viewProgressAction,
    viewLeaderboardAction,
    viewCharacterSheetAction,
    shareProgressAction,
    viewEventsAction,
    viewSynergiesAction,
    viewChallengesAction,
    joinChallengeAction,
    becomeMentorAction,
    compareHistoryAction,
    getSuggestionsAction,
    // Settings actions: User preferences
    setTimezoneAction,
    setReminderAction,
    setPrivacyAction,
    // Data actions: GDPR compliance
    exportDataAction,
    deleteMyDataAction,
    // Admin actions: Moderation tools
    resetStreakAction,
    awardBadgeAction,
    auditRulesAction
  ],

  /**
   * Evaluators: 1 (virtueObserver)
   * 
   * Why only one evaluator:
   * - Runs on EVERY message (alwaysRun: true)
   * - Uses rule-based detection (fast, no LLM per message)
   * - Cooldowns prevent spam (max 1 award per user per hour)
   * - Single evaluator avoids multiple database lookups per message
   * 
   * Why not use LLM per message:
   * - Cost: Would be expensive at scale
   * - Latency: Would slow down message processing
   * - Accuracy: Rule-based detection is sufficient with self-improvement
   */
  evaluators: [virtueObserverEvaluator],

  /**
   * Providers: 1 (virtueProvider)
   * 
   * Why minimal provider:
   * - Only injects basic context (streak, points, badges)
   * - Keeps prompt size small
   * - Agent doesn't need full virtue history in every message
   * - Detailed info available via actions when needed
   */
  providers: [virtueProvider]
};

export default virtuePlugin;

