/**
 * @fileoverview Plugin Virtue - Constants and Configuration
 * 
 * This file contains all static game content and configuration values.
 * 
 * Why centralize constants:
 * - Single source of truth for game balance
 * - Easy to tune without hunting through code
 * - Clear separation of data from logic
 * - Testable (can mock constants for edge cases)
 * 
 * Design Philosophy:
 * 
 * 1. Franklin's Virtues:
 *    - Original 13 virtues from Franklin's autobiography (1791)
 *    - Exact descriptions preserved for historical accuracy
 *    - Clustered into 5 categories for DNA profiling
 *    - Keywords for rule-based detection (refined daily by LLM)
 * 
 * 2. Point Values:
 *    - Self-report (10) > Observed (5): Encourages conscious practice
 *    - Streak bonus: Capped at +50 to prevent inflation
 *    - All-13 bonus (50): Significant reward for daily completion
 *    - Balanced for 100-1000 point range per month
 * 
 * 3. Badge Progression:
 *    - Beginner (1 day) → Week (7) → Month (30) → Year (365)
 *    - Skill-based (all-13 in one day) for variety
 *    - Platform badges (Discord-specific achievements)
 *    - Total: ~20 badges for long-term engagement
 * 
 * 4. Detection Rules:
 *    - Initial ruleset based on common chat patterns
 *    - Self-referential patterns filtered out (anti-gaming)
 *    - Confidence scores 0.3-0.9 (tunable via LLM refinement)
 *    - Rules stored in cache (not here) so LLM can modify them
 * 
 * 5. Gamification Balance:
 *    - Synergies: 5-15 bonus (10-30% boost for combos)
 *    - Challenges: 100-500 rewards (multi-day quests)
 *    - Mentorship: 20% share (encourages community)
 *    - Seasonal: 1.5-2x multipliers (limited time events)
 */

import type { Virtue, VirtueDetectionRule, Badge, VirtueUserData, VirtueCluster } from './types';

// ============================================================================
// Franklin's 13 Virtues (Historical, 1791)
// ============================================================================

export const VIRTUES: Virtue[] = [
  {
    id: 'temperance',
    name: 'Temperance',
    description: 'Eat not to dullness; drink not to elevation.',
    cluster: 'self-control',
    keywords: ['temperance', 'moderation', 'restraint', 'self-control']
  },
  {
    id: 'silence',
    name: 'Silence',
    description: 'Speak not but what may benefit others or yourself; avoid trifling conversation.',
    cluster: 'wisdom',
    keywords: ['silence', 'listening', 'thoughtful', 'held tongue']
  },
  {
    id: 'order',
    name: 'Order',
    description: 'Let all your things have their places; let each part of your business have its time.',
    cluster: 'discipline',
    keywords: ['order', 'organized', 'planned', 'structured', 'tidy']
  },
  {
    id: 'resolution',
    name: 'Resolution',
    description: 'Resolve to perform what you ought; perform without fail what you resolve.',
    cluster: 'courage',
    keywords: ['resolution', 'committed', 'determined', 'followed through']
  },
  {
    id: 'frugality',
    name: 'Frugality',
    description: 'Make no expense but to do good to others or yourself; waste nothing.',
    cluster: 'discipline',
    keywords: ['frugality', 'frugal', 'saved', 'budget', 'thrifty']
  },
  {
    id: 'industry',
    name: 'Industry',
    description: 'Lose no time; be always employed in something useful; cut off unnecessary actions.',
    cluster: 'courage',
    keywords: ['industry', 'productive', 'working hard', 'diligent', 'focused']
  },
  {
    id: 'sincerity',
    name: 'Sincerity',
    description: 'Use no hurtful deceit; think innocently and justly; speak accordingly.',
    cluster: 'wisdom',
    keywords: ['sincerity', 'honest', 'truthful', 'genuine', 'frank']
  },
  {
    id: 'justice',
    name: 'Justice',
    description: 'Wrong none by doing injuries, or omitting the benefits that are your duty.',
    cluster: 'compassion',
    keywords: ['justice', 'fair', 'helped', 'right thing', 'stood up']
  },
  {
    id: 'moderation',
    name: 'Moderation',
    description: 'Avoid extremes; forbear resenting injuries so much as you think they deserve.',
    cluster: 'self-control',
    keywords: ['moderation', 'balanced', 'calm', 'measured', 'patient']
  },
  {
    id: 'cleanliness',
    name: 'Cleanliness',
    description: 'Tolerate no uncleanliness in body, clothes, or habitation.',
    cluster: 'discipline',
    keywords: ['cleanliness', 'clean', 'hygiene', 'neat', 'tidy']
  },
  {
    id: 'tranquility',
    name: 'Tranquility',
    description: 'Be not disturbed at trifles, or at accidents common or unavoidable.',
    cluster: 'self-control',
    keywords: ['tranquility', 'peaceful', 'calm', 'unbothered', 'serene']
  },
  {
    id: 'chastity',
    name: 'Chastity',
    description: 'Rarely use venery but for health or offspring; never to dullness or weakness.',
    cluster: 'self-control',
    keywords: ['chastity', 'faithful', 'loyal', 'devoted']
  },
  {
    id: 'humility',
    name: 'Humility',
    description: 'Imitate Jesus and Socrates.',
    cluster: 'wisdom',
    keywords: ['humility', 'humble', 'modest', 'admitted mistake', 'learning']
  }
];

// ============================================================================
// Virtue Clusters (for DNA profiling)
// ============================================================================

export const VIRTUE_CLUSTERS: Record<VirtueCluster, string[]> = {
  'self-control': ['temperance', 'moderation', 'tranquility', 'chastity'],
  'wisdom': ['silence', 'sincerity', 'humility'],
  'discipline': ['order', 'frugality', 'cleanliness'],
  'courage': ['resolution', 'industry'],
  'compassion': ['justice']
};

// ============================================================================
// Points Configuration
// ============================================================================

export const POINTS = {
  SELF_REPORT: 10,
  OBSERVED: 5,
  STREAK_BONUS_PER_DAY: 5,
  STREAK_BONUS_CAP: 50,
  WEEKLY_COMPLETION_BONUS: 100,
};

// ============================================================================
// Initial Detection Rules
// ============================================================================

export const INITIAL_DETECTION_RULES: VirtueDetectionRule[] = [
  {
    virtueId: 'humility',
    keywords: ['my mistake', 'i was wrong', 'my bad', 'i apologize', 'sorry about that', 'i should have'],
    contextClues: [],
    excludePatterns: [
      'you should', 'they should', 'he was wrong', 'she was wrong',
      'i am humble', 'i practice humility'
    ],
    confidence: 0.7
  },
  {
    virtueId: 'justice',
    keywords: ['let me help', 'i can help', 'try this', 'here is how', 'hope this helps', 'you could try'],
    contextClues: ['isReply'],
    excludePatterns: ['i helped', 'i am helpful', 'i practice justice'],
    confidence: 0.6
  },
  {
    virtueId: 'tranquility',
    keywords: ['no worries', "it's okay", 'no problem', 'all good', "don't worry", 'it happens'],
    contextClues: [],
    excludePatterns: ['i am calm', 'i stayed calm', 'i practice tranquility'],
    confidence: 0.6
  },
  {
    virtueId: 'sincerity',
    keywords: ['to be honest', 'honestly', 'truthfully', 'i really think', 'my honest opinion'],
    contextClues: [],
    excludePatterns: ['i am honest', 'i am sincere', 'i practice sincerity'],
    confidence: 0.5
  },
  {
    virtueId: 'order',
    keywords: ['i organized', 'i planned', 'i scheduled', 'i sorted', 'i structured'],
    contextClues: [],
    excludePatterns: ['i am organized', 'i practice order'],
    confidence: 0.5
  },
  {
    virtueId: 'industry',
    keywords: ['finished the', 'completed the', 'got it done', 'shipped', 'launched', 'deployed'],
    contextClues: [],
    excludePatterns: ['i am productive', 'i work hard', 'i practice industry'],
    confidence: 0.5
  },
  {
    virtueId: 'moderation',
    keywords: ["let's find middle ground", 'both sides', 'i understand your point', 'fair point'],
    contextClues: [],
    excludePatterns: ['i am moderate', 'i practice moderation'],
    confidence: 0.5
  },
  {
    virtueId: 'resolution',
    keywords: ['i committed', 'i promised', 'i will do', 'count on me', 'i got this'],
    contextClues: [],
    excludePatterns: ['i am determined', 'i practice resolution'],
    confidence: 0.4
  },
  {
    virtueId: 'frugality',
    keywords: ['saved money', 'found cheaper', 'reused', 'recycled', 'cut costs'],
    contextClues: [],
    excludePatterns: ['i am frugal', 'i practice frugality'],
    confidence: 0.4
  },
  {
    virtueId: 'silence',
    keywords: ['listened to', 'heard them out', 'let them speak', "didn't interrupt"],
    contextClues: [],
    excludePatterns: ['i am quiet', 'i practice silence'],
    confidence: 0.4
  },
  {
    virtueId: 'cleanliness',
    keywords: ['cleaned up', 'tidied', 'organized my space', 'decluttered'],
    contextClues: [],
    excludePatterns: ['i am clean', 'i practice cleanliness'],
    confidence: 0.4
  },
  {
    virtueId: 'temperance',
    keywords: ['had just enough', "didn't overdo", 'stopped myself', 'in moderation'],
    contextClues: [],
    excludePatterns: ['i am temperate', 'i practice temperance'],
    confidence: 0.4
  },
  {
    virtueId: 'chastity',
    keywords: ['stayed faithful', 'loyal to', 'devoted to'],
    contextClues: [],
    excludePatterns: ['i am chaste', 'i practice chastity'],
    confidence: 0.3
  }
];

// ============================================================================
// Badges
// ============================================================================

export const BADGES: Badge[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Logged your first virtue',
    condition: (data: VirtueUserData) => Object.keys(data.checkIns).length > 0
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    condition: (data: VirtueUserData) => data.streaks.current >= 7 || data.streaks.longest >= 7
  },
  {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Maintained a 30-day streak',
    condition: (data: VirtueUserData) => data.streaks.current >= 30 || data.streaks.longest >= 30
  },
  {
    id: 'franklins_heir',
    name: "Franklin's Heir",
    description: 'All 13 virtues in a single day',
    condition: (data: VirtueUserData) => {
      return Object.values(data.checkIns).some(dayCheckIns => 
        Object.keys(dayCheckIns).length >= 13
      );
    }
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: '100-day streak achieved',
    condition: (data: VirtueUserData) => data.streaks.current >= 100 || data.streaks.longest >= 100
  },
  {
    id: 'year_of_virtue',
    name: 'Year of Virtue',
    description: '365-day streak - a full year!',
    condition: (data: VirtueUserData) => data.streaks.current >= 365 || data.streaks.longest >= 365
  }
];

// Platform-specific badges (awarded separately based on behavior)
export const PLATFORM_BADGES = {
  discord: [
    {
      id: 'discord_peacekeeper',
      name: 'Discord Peacekeeper',
      description: 'De-escalated conflicts and maintained tranquility',
      requiredVirtues: { tranquility: 5, moderation: 3 }
    },
    {
      id: 'discord_helper',
      name: 'Discord Helper',
      description: 'Consistently helped community members',
      requiredVirtues: { justice: 10, industry: 5 }
    },
    {
      id: 'discord_mentor',
      name: 'Discord Mentor',
      description: 'Guided others with wisdom and sincerity',
      requiredVirtues: { wisdom: 8, sincerity: 5, humility: 5 }
    }
  ],
  github: [
    {
      id: 'github_contributor',
      name: 'Open Source Benefactor',
      description: 'Made significant contributions to community projects',
      requiredVirtues: { industry: 10, justice: 5 }
    }
  ]
};

// ============================================================================
// DNA Archetypes
// ============================================================================

export const ARCHETYPES: Record<string, string> = {
  'self-control': 'The Stoic',
  'wisdom': 'The Sage',
  'discipline': 'The Strategist',
  'courage': 'The Champion',
  'compassion': 'The Guardian'
};

// ============================================================================
// Cache Key Patterns
// ============================================================================

export const CACHE_KEYS = {
  USER_DATA: (entityId: string) => `virtue:user:v1:${entityId}`,
  LEADERBOARD: (worldId: string) => `virtue:leaderboard:${worldId}`,
  RULES: (agentId: string) => `virtue:rules:${agentId}`,
  RULES_CHANGELOG: (agentId: string) => `virtue:rules:changelog:${agentId}`,
  COOLDOWN: (entityId: string) => `virtue:cooldown:${entityId}`,
  PRIVACY: (entityId: string) => `virtue:privacy:${entityId}`,
  CONFIG: (worldId: string) => `virtue:config:${worldId}`,
  INSIGHTS: (worldId: string, weekId: string) => `virtue:insights:${worldId}:${weekId}`,
  ERRORS: (agentId: string) => `virtue:errors:${agentId}`,
};

// ============================================================================
// Constants
// ============================================================================

export const COOLDOWN_PERIOD_MS = 60 * 60 * 1000; // 1 hour
export const CHANGELOG_MAX_ENTRIES = 100;
export const LEADERBOARD_MAX_ENTRIES = 100;
export const ERROR_LOG_MAX_ENTRIES = 100;

