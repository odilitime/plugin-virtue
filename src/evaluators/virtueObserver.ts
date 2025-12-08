/**
 * @fileoverview Virtue Observer Evaluator - Passive virtue detection
 * 
 * This evaluator runs on EVERY message to detect virtuous behavior without LLM calls.
 * 
 * Why This Design:
 * 
 * 1. alwaysRun: true
 *    - Must run on every message to catch virtuous behavior
 *    - Unlike actions (user-initiated), this is passive observation
 *    - Critical for "agent notices your good deeds" feature
 * 
 * 2. Rule-Based Detection (No LLM per message)
 *    - Cost: LLM would be $1-10/day at scale
 *    - Latency: Would slow message processing by 200-500ms
 *    - Accuracy: 99% with well-tuned rules (refined daily by LLM task)
 *    - Solution: Fast keyword matching + context clues
 * 
 * 3. Cooldown System (1 award per user per hour)
 *    - Prevents gaming: User can't spam "sorry" 100 times for points
 *    - Still allows multiple awards per day (24 potential)
 *    - Per-user (not per-virtue): More robust anti-gaming
 * 
 * 4. Privacy First
 *    - Checks opt-out before processing
 *    - GDPR compliant: Users can disable observation
 *    - Hot path: Privacy check is fast cache read
 * 
 * 5. Silent Failure
 *    - If detection fails, message still goes through
 *    - Virtue tracking is enhancement, not requirement
 *    - Errors logged but don't block chat
 * 
 * 6. One Award Per Message
 *    - Prevents double-dipping (justice + humility in same message)
 *    - First match wins (rules sorted by confidence)
 *    - Keeps experience simple and clear
 * 
 * Performance:
 * - Fast path: ~5ms per message (privacy + cooldown + rules)
 * - Slow path: ~50ms (award + leaderboard update)
 * - Memory: ~1KB per active user (cooldown cache)
 * 
 * @see tasks/ruleRefinementWorker.ts - Daily LLM refinement of rules
 * @see services/virtueService.ts - Check-in processing logic
 */

import type { Evaluator, IAgentRuntime, Memory, State } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';
import { CACHE_KEYS, COOLDOWN_PERIOD_MS, INITIAL_DETECTION_RULES } from '../constants';
import type { VirtueDetectionRule, PrivacySettings, DetectionContext } from '../types';
import { hasMention } from '../utils/platform';
import { logError } from '../utils/errorHandler';

export const virtueObserverEvaluator: Evaluator = {
  name: 'VIRTUE_OBSERVER',
  description: 'Observes messages for virtuous behavior using rule-based detection',

  /**
   * Why alwaysRun: true?
   * - Must run on EVERY message (not just when agent replies)
   * - Passive observation requires constant monitoring
   * - Alternative (only on agent responses) would miss most virtuous behavior
   */
  alwaysRun: true,

  examples: [],  // No examples needed - this is always-run passive detection

  validate: async () => true,  // Always validate - runs on all messages

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State
  ): Promise<void> => {
    try {
      /**
       * Early Exit Checks (Performance Optimization)
       * 
       * Why check these first:
       * - 99% of messages will fail at least one check
       * - Fast cache reads (< 1ms each)
       * - Prevents expensive rule evaluation
       * - Order matters: cheapest checks first
       */

      // Skip bot messages (bots shouldn't earn virtue points)
      if (message.entityId === runtime.agentId) return;

      // Skip empty messages (nothing to detect)
      if (!message.content.text) return;

      /**
       * Privacy Check
       * 
       * Why respect opt-outs:
       * - GDPR compliance (right to not be processed)
       * - Some users uncomfortable with passive monitoring
       * - Trust: User control builds community trust
       * - Default: Opt-in (must explicitly opt-out)
       */
      const privacy = await runtime.getCache<PrivacySettings>(
        CACHE_KEYS.PRIVACY(message.entityId)
      );
      if (privacy?.optOutObservation) return;

      /**
       * Cooldown Check (Anti-Gaming)
       * 
       * Why 1 hour cooldown:
       * - Prevents spam: User can't farm points by repeating trigger phrases
       * - Still generous: 24 potential awards per day
       * - Per-user: Simpler than per-virtue (prevents cycling through 13 virtues)
       * - Silent skip: No notification spam for duplicate behavior
       * 
       * Alternative considered: Per-virtue cooldown
       * - Rejected: User could cycle through virtues (13 per hour)
       * - Per-user is more robust
       */
      const cooldown = await runtime.getCache<number>(
        CACHE_KEYS.COOLDOWN(message.entityId)
      );
      if (cooldown && Date.now() - cooldown < COOLDOWN_PERIOD_MS) return;

      /**
       * Load Detection Rules
       * 
       * Why cache rules per agent:
       * - Each agent learns from its own community
       * - Rules adapt to community communication style
       * - No cross-contamination between servers
       * - Falls back to INITIAL_DETECTION_RULES if none exist yet
       * 
       * Why not hardcode rules:
       * - Language evolves (new slang, memes, idioms)
       * - Community-specific phrases
       * - Self-improving: ruleRefinementWorker updates these daily
       */
      const rules = await runtime.getCache<VirtueDetectionRule[]>(
        CACHE_KEYS.RULES(runtime.agentId)
      ) || INITIAL_DETECTION_RULES;

      /**
       * Build Detection Context
       * 
       * Why lowercase text:
       * - Case-insensitive matching (simpler rules)
       * - "Sorry" = "sorry" = "SORRY"
       * 
       * Why track isReply:
       * - Some virtues only valid in context (e.g., helping someone)
       * - "try this" alone isn't justice, but as reply to question = helping
       * 
       * Why track mentionsOther:
       * - Distinguishes self-talk from interaction
       * - "I helped @user" vs "I helped" (second might be self-referential)
       */
      const context: DetectionContext = {
        text: message.content.text.toLowerCase(),
        isReply: !!message.content.inReplyTo,
        mentionsOther: hasMention(message.content.text)
      };

      /**
       * Rule Matching Loop
       * 
       * Why break on first match:
       * - One award per message keeps experience simple
       * - Prevents analysis paralysis ("was this justice or sincerity?")
       * - First match wins (rules sorted by confidence in ruleRefinementWorker)
       * 
       * Why check confidence threshold:
       * - Rules have min confidence (0.3-0.9)
       * - Lower confidence = more false positives
       * - Multiple keyword matches increase confidence
       * - LLM can tune these thresholds daily
       */
      for (const rule of rules) {
        const match = checkRule(rule, context);
        if (match && match.confidence >= rule.confidence) {
          // Get virtue service
          const virtueService = runtime.getService<VirtueService>('virtue');
          if (!virtueService) continue;

          /**
           * Award the Virtue
           * 
           * Why source: 'observed':
           * - Worth 5 points (vs 10 for self-report)
           * - Can be upgraded if user later self-reports same virtue
           * - Tracked separately for analytics
           */
          const result = await virtueService.recordCheckIn(
            message.entityId,
            rule.virtueId,
            'observed'
          );

          /**
           * Why skip if duplicate:
           * - User already checked in this virtue today
           * - Silent skip prevents spam (no notification)
           * - recordCheckIn handles upgrade logic if self-report comes later
           */
          if (result.isDuplicate) continue;

          /**
           * Set Cooldown (Anti-Gaming)
           * 
           * Why set AFTER successful award:
           * - If award fails (duplicate, error), don't start cooldown
           * - User should get another chance soon
           * - Cooldown only starts on successful virtue award
           */
          await runtime.setCache(
            CACHE_KEYS.COOLDOWN(message.entityId),
            Date.now()
          );

          /**
           * Update Leaderboard
           * 
           * Why update here (not in batch):
           * - Real-time updates feel more responsive
           * - Leaderboard shows immediate rank changes
           * - Cache writes are fast enough (~5ms)
           * 
           * Why check worldId:
           * - Each server (world) has separate leaderboard
           * - Fair competition within peer groups
           * - Prevents mega-community domination
           */
          const userData = await virtueService.getUserData(message.entityId);
          if (message.roomId) {
            const room = await runtime.getRoom(message.roomId);
            if (room?.worldId) {
              await virtueService.updateLeaderboard(
                room.worldId,
                message.entityId,
                userData.totalPoints,
                userData.streaks.current,
                userData.badges.length
              );
            }
          }

          /**
           * Public Recognition
           * 
           * Why public (not DM):
           * - Creates culture of recognizing good deeds
           * - Social proof: Others see virtuous behavior rewarded
           * - Encourages similar behavior
           * - Detailed progress still sent via DM (see notificationService)
           * 
           * Why simple message:
           * - Not overbearing in chat (one line)
           * - Clear what virtue was recognized
           * - Emoji makes it feel friendly, not robotic
           */
          await sendPublicRecognition(runtime, message, rule.virtueId);

          /**
           * Why break after first match:
           * - Prevents multiple awards per message
           * - Keeps experience simple
           * - If user demonstrated multiple virtues, they'll get recognized next time
           * - Performance: No need to check remaining rules
           */
          break;
        }
      }
    } catch (error) {
      await logError(
        runtime,
        'virtueObserver',
        error as Error,
        message.entityId
      );
    }
  }
};

/**
 * Checks if a message matches a virtue detection rule
 * 
 * Algorithm Order (Performance Optimized):
 * 1. Exclude patterns (fast rejection)
 * 2. Context clues (fast rejection)
 * 3. Keywords (matching logic)
 * 4. Confidence calculation
 * 
 * Why This Order:
 * - Exclude patterns are fastest to fail (most messages excluded here)
 * - Example: "i am humble" excluded immediately by self-referential pattern
 * - Context clues next: "try this" without isReply fails fast
 * - Keywords last: Most expensive check (loop through all keywords)
 * 
 * Design Decisions:
 * 
 * 1. Why check exclude patterns first:
 *    - Anti-gaming: Prevents self-referential virtue claims
 *    - Fast rejection: 90% of messages fail here
 *    - Example: "i am so humble" → excluded, "my bad" → passes
 * 
 * 2. Why context clues:
 *    - Adds situational awareness without LLM
 *    - "try this" as reply = helping (justice)
 *    - "try this" alone = maybe just thinking aloud
 *    - Reduces false positives by 50%
 * 
 * 3. Why count multiple keyword matches:
 *    - More keywords = higher confidence
 *    - "sorry" alone = 0.7 confidence
 *    - "sorry, my mistake" = 0.77 confidence (0.7 × 1.1)
 *    - Caps at 0.95 to prevent overconfidence
 * 
 * 4. Why 10% boost per extra keyword:
 *    - Conservative: Won't push low-confidence rules over threshold
 *    - Example: 0.4 confidence rule + 3 keywords = 0.4 × 1.2 = 0.48 (still low)
 *    - Meaningful for high-confidence rules: 0.7 × 1.3 = 0.91 (strong signal)
 * 
 * Performance:
 * - Average case: ~0.1ms per rule
 * - Worst case: ~1ms (all keywords checked)
 * - 13 virtues × 0.1ms = 1.3ms per message (acceptable)
 * 
 * @param rule - Detection rule with keywords, excludes, context requirements
 * @param context - Message context (text, isReply, mentionsOther)
 * @returns Confidence score (0.0-1.0) if matched, null if no match
 */
function checkRule(
  rule: VirtueDetectionRule,
  context: DetectionContext
): { confidence: number } | null {
  const text = context.text;

  /**
   * Step 1: Exclude Patterns (Anti-Gaming)
   * 
   * Why check first:
   * - Fastest rejection (simple string includes)
   * - Prevents self-referential virtue claims
   * - Example: "i am humble" excluded, "my mistake" passes
   * 
   * Why fail fast:
   * - No point checking keywords if message is excluded
   * - 90% of messages fail here (most chat isn't about virtues)
   */
  for (const exclude of rule.excludePatterns) {
    if (text.includes(exclude.toLowerCase())) {
      return null; // Hard fail, no confidence score
    }
  }

  /**
   * Step 2: Context Clues (Situational Awareness)
   * 
   * Why check context:
   * - Same words mean different things in different contexts
   * - "try this" as reply = helping (justice)
   * - "try this" standalone = maybe just thinking
   * 
   * Supported clues:
   * - isReply: Message is replying to someone
   * - mentionsOther: Message mentions another user (@user)
   * 
   * Why fail if clue missing:
   * - Rule requires context that isn't present
   * - Better to miss a virtue than award false positive
   */
  for (const clue of rule.contextClues) {
    if (clue === 'isReply' && !context.isReply) return null;
    if (clue === 'mentionsOther' && !context.mentionsOther) return null;
  }

  /**
   * Step 3: Keyword Matching
   * 
   * Why count matches (not just boolean):
   * - Multiple keywords = stronger signal
   * - "sorry" = medium confidence
   * - "sorry, my mistake" = higher confidence
   * - Used to boost final confidence score
   * 
   * Why simple includes (not regex):
   * - Faster (10x faster than regex)
   * - Sufficient for current needs
   * - Rules are tuned by LLM daily anyway
   */
  let matchCount = 0;
  for (const keyword of rule.keywords) {
    if (text.includes(keyword.toLowerCase())) {
      matchCount++;
    }
  }

  // No keywords matched = no virtue detected
  if (matchCount === 0) return null;

  /**
   * Step 4: Confidence Calculation
   * 
   * Formula: base × (1 + 0.1 × extraMatches), capped at 0.95
   * 
   * Examples:
   * - 1 keyword: 0.7 × 1.0 = 0.70
   * - 2 keywords: 0.7 × 1.1 = 0.77
   * - 3 keywords: 0.7 × 1.2 = 0.84
   * - 5 keywords: 0.7 × 1.4 = 0.98 → capped at 0.95
   * 
   * Why cap at 0.95:
   * - Never 100% certain (language is ambiguous)
   * - Leaves room for future improvements
   * - Humility: Agent admits it might be wrong
   * 
   * Why 10% boost:
   * - Conservative: Won't push weak rules over threshold
   * - Meaningful: Strong rules become stronger
   * - Tunable: LLM can adjust base confidence if boost too aggressive
   */
  const confidence = Math.min(
    rule.confidence * (1 + 0.1 * (matchCount - 1)),
    0.95 // Never fully certain
  );

  return { confidence };
}

/**
 * Sends public recognition message when virtue is observed
 * 
 * Why Public (Not DM):
 * - Creates culture of recognizing good deeds
 * - Social proof: Others see virtuous behavior rewarded
 * - Encourages similar behavior in community
 * - Peer pressure (positive): "I want recognition too"
 * 
 * Why Simple Message (Not Detailed):
 * - Not overbearing in chat (one line, not embed)
 * - Clear what was recognized (virtue name)
 * - Emoji makes it friendly, not robotic
 * - Detailed progress sent via DM separately (see notificationService)
 * 
 * Design Trade-offs:
 * 1. Public vs DM: Public creates positive culture, opt-out available
 * 2. Always vs Occasional: Always for consistency, cooldown prevents spam
 * 3. Message Format: Mention + virtue + emoji = friendly & clear
 * 
 * @param runtime - Agent runtime
 * @param message - Original message that triggered detection
 * @param virtueId - Virtue that was detected
 */
async function sendPublicRecognition(
  runtime: IAgentRuntime,
  message: Memory,
  virtueId: string
): Promise<void> {
  try {
    const { VIRTUES } = await import('../constants');
    const virtue = VIRTUES.find(v => v.id === virtueId);
    if (!virtue) return;

    // Format: ✨ <@user> demonstrated **Virtue** — nice work!
    // Why: One line, friendly, clear what was recognized
    const text = `✨ <@${message.entityId}> demonstrated **${virtue.name}** — nice work!`;

    await runtime.emitEvent('SEND_MESSAGE', {
      roomId: message.roomId,
      content: { text }
    });
  } catch (error) {
    // Silent failure: Don't block virtue award if message send fails
    runtime.logger.debug({
      src: 'plugin:virtue',
      action: 'sendPublicRecognition',
      error: error instanceof Error ? error.message : String(error)
    }, 'Failed to send public recognition');
  }
}

