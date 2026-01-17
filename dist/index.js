var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/constants.ts
var constants_exports = {};
__export(constants_exports, {
  ARCHETYPES: () => ARCHETYPES,
  BADGES: () => BADGES,
  CACHE_KEYS: () => CACHE_KEYS,
  CHANGELOG_MAX_ENTRIES: () => CHANGELOG_MAX_ENTRIES,
  COOLDOWN_PERIOD_MS: () => COOLDOWN_PERIOD_MS,
  ERROR_LOG_MAX_ENTRIES: () => ERROR_LOG_MAX_ENTRIES,
  INITIAL_DETECTION_RULES: () => INITIAL_DETECTION_RULES,
  LEADERBOARD_MAX_ENTRIES: () => LEADERBOARD_MAX_ENTRIES,
  PLATFORM_BADGES: () => PLATFORM_BADGES,
  POINTS: () => POINTS,
  VIRTUES: () => VIRTUES,
  VIRTUE_CLUSTERS: () => VIRTUE_CLUSTERS
});
var VIRTUES, VIRTUE_CLUSTERS, POINTS, INITIAL_DETECTION_RULES, BADGES, PLATFORM_BADGES, ARCHETYPES, CACHE_KEYS, COOLDOWN_PERIOD_MS, CHANGELOG_MAX_ENTRIES, LEADERBOARD_MAX_ENTRIES, ERROR_LOG_MAX_ENTRIES;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    VIRTUES = [
      {
        id: "temperance",
        name: "Temperance",
        description: "Eat not to dullness; drink not to elevation.",
        cluster: "self-control",
        keywords: ["temperance", "moderation", "restraint", "self-control"]
      },
      {
        id: "silence",
        name: "Silence",
        description: "Speak not but what may benefit others or yourself; avoid trifling conversation.",
        cluster: "wisdom",
        keywords: ["silence", "listening", "thoughtful", "held tongue"]
      },
      {
        id: "order",
        name: "Order",
        description: "Let all your things have their places; let each part of your business have its time.",
        cluster: "discipline",
        keywords: ["order", "organized", "planned", "structured", "tidy"]
      },
      {
        id: "resolution",
        name: "Resolution",
        description: "Resolve to perform what you ought; perform without fail what you resolve.",
        cluster: "courage",
        keywords: ["resolution", "committed", "determined", "followed through"]
      },
      {
        id: "frugality",
        name: "Frugality",
        description: "Make no expense but to do good to others or yourself; waste nothing.",
        cluster: "discipline",
        keywords: ["frugality", "frugal", "saved", "budget", "thrifty"]
      },
      {
        id: "industry",
        name: "Industry",
        description: "Lose no time; be always employed in something useful; cut off unnecessary actions.",
        cluster: "courage",
        keywords: ["industry", "productive", "working hard", "diligent", "focused"]
      },
      {
        id: "sincerity",
        name: "Sincerity",
        description: "Use no hurtful deceit; think innocently and justly; speak accordingly.",
        cluster: "wisdom",
        keywords: ["sincerity", "honest", "truthful", "genuine", "frank"]
      },
      {
        id: "justice",
        name: "Justice",
        description: "Wrong none by doing injuries, or omitting the benefits that are your duty.",
        cluster: "compassion",
        keywords: ["justice", "fair", "helped", "right thing", "stood up"]
      },
      {
        id: "moderation",
        name: "Moderation",
        description: "Avoid extremes; forbear resenting injuries so much as you think they deserve.",
        cluster: "self-control",
        keywords: ["moderation", "balanced", "calm", "measured", "patient"]
      },
      {
        id: "cleanliness",
        name: "Cleanliness",
        description: "Tolerate no uncleanliness in body, clothes, or habitation.",
        cluster: "discipline",
        keywords: ["cleanliness", "clean", "hygiene", "neat", "tidy"]
      },
      {
        id: "tranquility",
        name: "Tranquility",
        description: "Be not disturbed at trifles, or at accidents common or unavoidable.",
        cluster: "self-control",
        keywords: ["tranquility", "peaceful", "calm", "unbothered", "serene"]
      },
      {
        id: "chastity",
        name: "Chastity",
        description: "Rarely use venery but for health or offspring; never to dullness or weakness.",
        cluster: "self-control",
        keywords: ["chastity", "faithful", "loyal", "devoted"]
      },
      {
        id: "humility",
        name: "Humility",
        description: "Imitate Jesus and Socrates.",
        cluster: "wisdom",
        keywords: ["humility", "humble", "modest", "admitted mistake", "learning"]
      }
    ];
    VIRTUE_CLUSTERS = {
      "self-control": ["temperance", "moderation", "tranquility", "chastity"],
      "wisdom": ["silence", "sincerity", "humility"],
      "discipline": ["order", "frugality", "cleanliness"],
      "courage": ["resolution", "industry"],
      "compassion": ["justice"]
    };
    POINTS = {
      SELF_REPORT: 10,
      OBSERVED: 5,
      STREAK_BONUS_PER_DAY: 5,
      STREAK_BONUS_CAP: 50,
      WEEKLY_COMPLETION_BONUS: 100
    };
    INITIAL_DETECTION_RULES = [
      {
        virtueId: "humility",
        keywords: ["my mistake", "i was wrong", "my bad", "i apologize", "sorry about that", "i should have"],
        contextClues: [],
        excludePatterns: [
          "you should",
          "they should",
          "he was wrong",
          "she was wrong",
          "i am humble",
          "i practice humility"
        ],
        confidence: 0.7
      },
      {
        virtueId: "justice",
        keywords: ["let me help", "i can help", "try this", "here is how", "hope this helps", "you could try"],
        contextClues: ["isReply"],
        excludePatterns: ["i helped", "i am helpful", "i practice justice"],
        confidence: 0.6
      },
      {
        virtueId: "tranquility",
        keywords: ["no worries", "it's okay", "no problem", "all good", "don't worry", "it happens"],
        contextClues: [],
        excludePatterns: ["i am calm", "i stayed calm", "i practice tranquility"],
        confidence: 0.6
      },
      {
        virtueId: "sincerity",
        keywords: ["to be honest", "honestly", "truthfully", "i really think", "my honest opinion"],
        contextClues: [],
        excludePatterns: ["i am honest", "i am sincere", "i practice sincerity"],
        confidence: 0.5
      },
      {
        virtueId: "order",
        keywords: ["i organized", "i planned", "i scheduled", "i sorted", "i structured"],
        contextClues: [],
        excludePatterns: ["i am organized", "i practice order"],
        confidence: 0.5
      },
      {
        virtueId: "industry",
        keywords: ["finished the", "completed the", "got it done", "shipped", "launched", "deployed"],
        contextClues: [],
        excludePatterns: ["i am productive", "i work hard", "i practice industry"],
        confidence: 0.5
      },
      {
        virtueId: "moderation",
        keywords: ["let's find middle ground", "both sides", "i understand your point", "fair point"],
        contextClues: [],
        excludePatterns: ["i am moderate", "i practice moderation"],
        confidence: 0.5
      },
      {
        virtueId: "resolution",
        keywords: ["i committed", "i promised", "i will do", "count on me", "i got this"],
        contextClues: [],
        excludePatterns: ["i am determined", "i practice resolution"],
        confidence: 0.4
      },
      {
        virtueId: "frugality",
        keywords: ["saved money", "found cheaper", "reused", "recycled", "cut costs"],
        contextClues: [],
        excludePatterns: ["i am frugal", "i practice frugality"],
        confidence: 0.4
      },
      {
        virtueId: "silence",
        keywords: ["listened to", "heard them out", "let them speak", "didn't interrupt"],
        contextClues: [],
        excludePatterns: ["i am quiet", "i practice silence"],
        confidence: 0.4
      },
      {
        virtueId: "cleanliness",
        keywords: ["cleaned up", "tidied", "organized my space", "decluttered"],
        contextClues: [],
        excludePatterns: ["i am clean", "i practice cleanliness"],
        confidence: 0.4
      },
      {
        virtueId: "temperance",
        keywords: ["had just enough", "didn't overdo", "stopped myself", "in moderation"],
        contextClues: [],
        excludePatterns: ["i am temperate", "i practice temperance"],
        confidence: 0.4
      },
      {
        virtueId: "chastity",
        keywords: ["stayed faithful", "loyal to", "devoted to"],
        contextClues: [],
        excludePatterns: ["i am chaste", "i practice chastity"],
        confidence: 0.3
      }
    ];
    BADGES = [
      {
        id: "beginner",
        name: "Beginner",
        description: "Logged your first virtue",
        condition: (data) => Object.keys(data.checkIns).length > 0
      },
      {
        id: "week_warrior",
        name: "Week Warrior",
        description: "Maintained a 7-day streak",
        condition: (data) => data.streaks.current >= 7 || data.streaks.longest >= 7
      },
      {
        id: "monthly_master",
        name: "Monthly Master",
        description: "Maintained a 30-day streak",
        condition: (data) => data.streaks.current >= 30 || data.streaks.longest >= 30
      },
      {
        id: "franklins_heir",
        name: "Franklin's Heir",
        description: "All 13 virtues in a single day",
        condition: (data) => {
          return Object.values(data.checkIns).some(
            (dayCheckIns) => Object.keys(dayCheckIns).length >= 13
          );
        }
      },
      {
        id: "century_club",
        name: "Century Club",
        description: "100-day streak achieved",
        condition: (data) => data.streaks.current >= 100 || data.streaks.longest >= 100
      },
      {
        id: "year_of_virtue",
        name: "Year of Virtue",
        description: "365-day streak - a full year!",
        condition: (data) => data.streaks.current >= 365 || data.streaks.longest >= 365
      }
    ];
    PLATFORM_BADGES = {
      discord: [
        {
          id: "discord_peacekeeper",
          name: "Discord Peacekeeper",
          description: "De-escalated conflicts and maintained tranquility",
          requiredVirtues: { tranquility: 5, moderation: 3 }
        },
        {
          id: "discord_helper",
          name: "Discord Helper",
          description: "Consistently helped community members",
          requiredVirtues: { justice: 10, industry: 5 }
        },
        {
          id: "discord_mentor",
          name: "Discord Mentor",
          description: "Guided others with wisdom and sincerity",
          requiredVirtues: { wisdom: 8, sincerity: 5, humility: 5 }
        }
      ],
      github: [
        {
          id: "github_contributor",
          name: "Open Source Benefactor",
          description: "Made significant contributions to community projects",
          requiredVirtues: { industry: 10, justice: 5 }
        }
      ]
    };
    ARCHETYPES = {
      "self-control": "The Stoic",
      "wisdom": "The Sage",
      "discipline": "The Strategist",
      "courage": "The Champion",
      "compassion": "The Guardian"
    };
    CACHE_KEYS = {
      USER_DATA: (entityId) => `virtue:user:v1:${entityId}`,
      LEADERBOARD: (worldId) => `virtue:leaderboard:${worldId}`,
      RULES: (agentId) => `virtue:rules:${agentId}`,
      RULES_CHANGELOG: (agentId) => `virtue:rules:changelog:${agentId}`,
      COOLDOWN: (entityId) => `virtue:cooldown:${entityId}`,
      PRIVACY: (entityId) => `virtue:privacy:${entityId}`,
      CONFIG: (worldId) => `virtue:config:${worldId}`,
      INSIGHTS: (worldId, weekId) => `virtue:insights:${worldId}:${weekId}`,
      ERRORS: (agentId) => `virtue:errors:${agentId}`
    };
    COOLDOWN_PERIOD_MS = 60 * 60 * 1e3;
    CHANGELOG_MAX_ENTRIES = 100;
    LEADERBOARD_MAX_ENTRIES = 100;
    ERROR_LOG_MAX_ENTRIES = 100;
  }
});

// src/services/seasonalEventsService.ts
var seasonalEventsService_exports = {};
__export(seasonalEventsService_exports, {
  SeasonalEventsService: () => SeasonalEventsService
});
import { Service } from "@elizaos/core";
var SeasonalEventsService;
var init_seasonalEventsService = __esm({
  "src/services/seasonalEventsService.ts"() {
    "use strict";
    init_constants();
    SeasonalEventsService = class _SeasonalEventsService extends Service {
      static serviceType = "virtue_seasonal_events";
      capabilityDescription = "Manages seasonal virtue events and challenges";
      static async start(runtime) {
        const service = new _SeasonalEventsService(runtime);
        await service.initializeDefaultEvents();
        runtime.logger.info({ src: "plugin:virtue", agentId: runtime.agentId }, "SeasonalEventsService started");
        return service;
      }
      async stop() {
        this.runtime.logger.info({ src: "plugin:virtue", agentId: this.runtime.agentId }, "SeasonalEventsService stopped");
      }
      async initializeDefaultEvents() {
        const existingEvents = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("seasonal_events")
        );
        if (existingEvents) return;
        const defaultEvents = [
          {
            id: "thanksgiving_gratitude",
            name: "Thanksgiving Gratitude",
            startDate: new Date((/* @__PURE__ */ new Date()).getFullYear(), 10, 20).toISOString().split("T")[0],
            // Nov 20
            endDate: new Date((/* @__PURE__ */ new Date()).getFullYear(), 10, 30).toISOString().split("T")[0],
            // Nov 30
            virtueId: "justice",
            // Closest to gratitude/giving
            pointMultiplier: 2,
            badge: "thanksgiving_2024"
          },
          {
            id: "new_year_resolution",
            name: "New Year Resolution Challenge",
            startDate: new Date((/* @__PURE__ */ new Date()).getFullYear() + 1, 0, 1).toISOString().split("T")[0],
            // Jan 1
            endDate: new Date((/* @__PURE__ */ new Date()).getFullYear() + 1, 0, 7).toISOString().split("T")[0],
            // Jan 7
            virtueId: "resolution",
            pointMultiplier: 1.5,
            badge: "new_year_2025"
          },
          {
            id: "spring_renewal",
            name: "Spring Renewal",
            startDate: new Date((/* @__PURE__ */ new Date()).getFullYear(), 2, 20).toISOString().split("T")[0],
            // Mar 20
            endDate: new Date((/* @__PURE__ */ new Date()).getFullYear(), 2, 31).toISOString().split("T")[0],
            // Mar 31
            virtueId: "cleanliness",
            pointMultiplier: 1.5,
            badge: "spring_renewal"
          }
        ];
        await this.runtime.setCache(CACHE_KEYS.CONFIG("seasonal_events"), defaultEvents);
      }
      // ============================================================================
      // Event Queries
      // ============================================================================
      async getActiveEvents() {
        const events = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("seasonal_events")
        ) || [];
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        return events.filter(
          (event) => event.startDate <= today && event.endDate >= today
        );
      }
      async getEventForVirtue(virtueId) {
        const activeEvents = await this.getActiveEvents();
        return activeEvents.find((e) => e.virtueId === virtueId) || null;
      }
      async getPointMultiplier(virtueId) {
        const event = await this.getEventForVirtue(virtueId);
        return event ? event.pointMultiplier : 1;
      }
      // ============================================================================
      // Event Management
      // ============================================================================
      async addEvent(event) {
        const events = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("seasonal_events")
        ) || [];
        events.push(event);
        await this.runtime.setCache(CACHE_KEYS.CONFIG("seasonal_events"), events);
      }
      async removeEvent(eventId) {
        const events = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("seasonal_events")
        ) || [];
        const filtered = events.filter((e) => e.id !== eventId);
        await this.runtime.setCache(CACHE_KEYS.CONFIG("seasonal_events"), filtered);
      }
    };
  }
});

// src/services/virtuesynergyService.ts
var virtuesynergyService_exports = {};
__export(virtuesynergyService_exports, {
  VirtueSynergyService: () => VirtueSynergyService
});
import { Service as Service2 } from "@elizaos/core";
var DEFAULT_SYNERGIES, VirtueSynergyService;
var init_virtuesynergyService = __esm({
  "src/services/virtuesynergyService.ts"() {
    "use strict";
    init_constants();
    DEFAULT_SYNERGIES = [
      {
        id: "balanced_life",
        name: "Balanced Life",
        virtues: ["temperance", "moderation", "tranquility"],
        bonus: 25,
        description: "Mastery of self-control brings inner peace"
      },
      {
        id: "wise_leader",
        name: "Wise Leader",
        virtues: ["wisdom", "justice", "humility"],
        bonus: 30,
        description: "True leadership requires wisdom, fairness, and humility"
      },
      {
        id: "productive_perfectionist",
        name: "Productive Perfectionist",
        virtues: ["industry", "order", "resolution"],
        bonus: 25,
        description: "Organized hard work with determination"
      },
      {
        id: "honest_diplomat",
        name: "Honest Diplomat",
        virtues: ["sincerity", "moderation", "silence"],
        bonus: 20,
        description: "Truthful communication with measured restraint"
      },
      {
        id: "franklins_triangle",
        name: "Franklin's Triangle",
        virtues: ["humility", "industry", "frugality"],
        bonus: 40,
        description: "The three pillars Franklin valued most"
      },
      {
        id: "stoic_core",
        name: "Stoic Core",
        virtues: ["tranquility", "moderation", "resolution"],
        bonus: 30,
        description: "The foundation of stoic philosophy"
      }
    ];
    VirtueSynergyService = class _VirtueSynergyService extends Service2 {
      static serviceType = "virtue_synergy";
      capabilityDescription = "Detects and rewards virtue synergy combinations";
      static async start(runtime) {
        const service = new _VirtueSynergyService(runtime);
        await service.initializeSynergies();
        runtime.logger.info({ src: "plugin:virtue" }, "VirtueSynergyService started");
        return service;
      }
      async stop() {
        this.runtime.logger.info({ src: "plugin:virtue" }, "VirtueSynergyService stopped");
      }
      async initializeSynergies() {
        const existing = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("synergies")
        );
        if (!existing) {
          await this.runtime.setCache(CACHE_KEYS.CONFIG("synergies"), DEFAULT_SYNERGIES);
        }
      }
      async checkSynergies(checkInsToday) {
        const practicedVirtues = Object.keys(checkInsToday);
        const synergies = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("synergies")
        ) || DEFAULT_SYNERGIES;
        const unlocked = [];
        let bonusPoints = 0;
        for (const synergy of synergies) {
          const hasAll = synergy.virtues.every((v) => practicedVirtues.includes(v));
          if (hasAll) {
            unlocked.push(synergy.id);
            bonusPoints += synergy.bonus;
          }
        }
        return { synergies: unlocked, bonusPoints };
      }
      async getSynergyInfo(synergyId) {
        const synergies = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("synergies")
        ) || DEFAULT_SYNERGIES;
        return synergies.find((s) => s.id === synergyId) || null;
      }
      async getAllSynergies() {
        return await this.runtime.getCache(
          CACHE_KEYS.CONFIG("synergies")
        ) || DEFAULT_SYNERGIES;
      }
      async addCustomSynergy(synergy) {
        const synergies = await this.getAllSynergies();
        synergies.push(synergy);
        await this.runtime.setCache(CACHE_KEYS.CONFIG("synergies"), synergies);
      }
    };
  }
});

// src/services/virtueChallengeService.ts
var virtueChallengeService_exports = {};
__export(virtueChallengeService_exports, {
  VirtueChallengeService: () => VirtueChallengeService
});
import { Service as Service3 } from "@elizaos/core";
var DEFAULT_CHALLENGES, VirtueChallengeService;
var init_virtueChallengeService = __esm({
  "src/services/virtueChallengeService.ts"() {
    "use strict";
    init_constants();
    DEFAULT_CHALLENGES = [
      {
        id: "week_of_wisdom",
        name: "Week of Wisdom",
        description: "Practice all 3 wisdom virtues (Silence, Sincerity, Humility) for 7 consecutive days",
        startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        requirements: {
          type: "streak",
          target: 7,
          virtueId: "wisdom_cluster"
        },
        rewards: {
          points: 150,
          badge: "wisdom_master"
        },
        participants: [],
        completions: []
      },
      {
        id: "centurion",
        name: "The Centurion",
        description: "Log 100 total virtue check-ins",
        startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        requirements: {
          type: "count",
          target: 100
        },
        rewards: {
          points: 200,
          badge: "centurion"
        },
        participants: [],
        completions: []
      },
      {
        id: "synergy_seeker",
        name: "Synergy Seeker",
        description: "Unlock 3 different virtue synergies",
        startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        requirements: {
          type: "synergy",
          target: 3
        },
        rewards: {
          points: 100,
          badge: "synergy_master"
        },
        participants: [],
        completions: []
      }
    ];
    VirtueChallengeService = class _VirtueChallengeService extends Service3 {
      static serviceType = "virtue_challenge";
      capabilityDescription = "Manages time-limited virtue challenges and quests";
      static async start(runtime) {
        const service = new _VirtueChallengeService(runtime);
        await service.initializeChallenges();
        runtime.logger.info({ src: "plugin:virtue" }, "VirtueChallengeService started");
        return service;
      }
      async stop() {
        this.runtime.logger.info({ src: "plugin:virtue" }, "VirtueChallengeService stopped");
      }
      async initializeChallenges() {
        const existing = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("challenges")
        );
        if (!existing) {
          await this.runtime.setCache(CACHE_KEYS.CONFIG("challenges"), DEFAULT_CHALLENGES);
        }
      }
      async getActiveChallenges() {
        const challenges = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("challenges")
        ) || DEFAULT_CHALLENGES;
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        return challenges.filter(
          (c) => c.startDate <= today && c.endDate >= today
        );
      }
      async joinChallenge(challengeId, entityId) {
        const challenges = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("challenges")
        ) || [];
        const challenge = challenges.find((c) => c.id === challengeId);
        if (!challenge) return false;
        if (!challenge.participants.includes(entityId)) {
          challenge.participants.push(entityId);
          await this.runtime.setCache(CACHE_KEYS.CONFIG("challenges"), challenges);
        }
        return true;
      }
      async checkChallengeProgress(entityId, userData) {
        const challenges = await this.getActiveChallenges();
        const completed = [];
        let totalRewards = 0;
        for (const challenge of challenges) {
          if (!challenge.participants.includes(entityId)) continue;
          if (challenge.completions.includes(entityId)) continue;
          const isComplete = await this.checkRequirement(challenge, userData);
          if (isComplete) {
            completed.push(challenge.id);
            totalRewards += challenge.rewards.points;
            challenge.completions.push(entityId);
            const allChallenges = await this.runtime.getCache(
              CACHE_KEYS.CONFIG("challenges")
            ) || [];
            const idx = allChallenges.findIndex((c) => c.id === challenge.id);
            if (idx >= 0) {
              allChallenges[idx] = challenge;
              await this.runtime.setCache(CACHE_KEYS.CONFIG("challenges"), allChallenges);
            }
          }
        }
        return { completed, rewards: totalRewards };
      }
      async checkRequirement(challenge, userData) {
        switch (challenge.requirements.type) {
          case "count": {
            const totalCheckIns = Object.values(userData.checkIns).reduce(
              (sum, day) => sum + Object.keys(day).length,
              0
            );
            return totalCheckIns >= challenge.requirements.target;
          }
          case "streak": {
            return userData.streaks.current >= challenge.requirements.target;
          }
          case "synergy": {
            return false;
          }
          case "specific_virtues": {
            const required = challenge.requirements.target;
            return required.every(
              (virtueId) => Object.values(userData.checkIns).some((day) => day[virtueId])
            );
          }
          default:
            return false;
        }
      }
      async createChallenge(challenge) {
        const challenges = await this.runtime.getCache(
          CACHE_KEYS.CONFIG("challenges")
        ) || [];
        challenges.push(challenge);
        await this.runtime.setCache(CACHE_KEYS.CONFIG("challenges"), challenges);
      }
    };
  }
});

// src/services/notificationService.ts
var notificationService_exports = {};
__export(notificationService_exports, {
  NotificationService: () => NotificationService
});
import { Service as Service4 } from "@elizaos/core";
var NotificationService;
var init_notificationService = __esm({
  "src/services/notificationService.ts"() {
    "use strict";
    init_constants();
    NotificationService = class _NotificationService extends Service4 {
      static serviceType = "virtue_notification";
      capabilityDescription = "Sends virtue tracking notifications and milestone alerts";
      static async start(runtime) {
        const service = new _NotificationService(runtime);
        runtime.logger.info({ src: "plugin:virtue", agentId: runtime.agentId }, "NotificationService started");
        return service;
      }
      async stop() {
        this.runtime.logger.info({ src: "plugin:virtue", agentId: this.runtime.agentId }, "NotificationService stopped");
      }
      // ============================================================================
      // Daily Reminders
      // ============================================================================
      async sendDailyReminder(entityId) {
        try {
          const virtueService = this.runtime.getService("virtue");
          if (!virtueService) return false;
          const userData = await virtueService.getUserData(entityId);
          if (!userData.reminderEnabled) return false;
          const message = `\u{1F305} Good day! Don't forget to practice Franklin's virtues today.

Your current streak: **${userData.streaks.current} days** \u{1F525}

Try to log at least one virtue practice today to maintain your progress!`;
          return await this.sendDM(entityId, message);
        } catch (error) {
          this.runtime.logger.error({
            src: "plugin:virtue",
            context: "sendDailyReminder",
            entityId,
            error: error instanceof Error ? error.message : String(error)
          }, "Failed to send daily reminder");
          return false;
        }
      }
      // ============================================================================
      // Milestone Notifications
      // ============================================================================
      async notifyStreakMilestone(entityId, streakDays) {
        const milestones = [7, 14, 21, 30, 60, 90, 100, 365];
        if (!milestones.includes(streakDays)) return;
        let message = `\u{1F389} **Milestone Achieved!** \u{1F389}

`;
        message += `You've maintained a **${streakDays}-day streak**! `;
        if (streakDays === 7) {
          message += `One week of consistent practice \u2014 you're building a powerful habit! \u{1F4AA}`;
        } else if (streakDays === 30) {
          message += `A full month! Franklin himself would be proud! \u{1F396}\uFE0F`;
        } else if (streakDays === 100) {
          message += `100 days! You've truly embodied the spirit of self-improvement! \u{1F3C6}`;
        } else if (streakDays === 365) {
          message += `A FULL YEAR! You are a master of virtue practice! \u{1F451}`;
        } else {
          message += `Keep up the amazing work!`;
        }
        await this.sendDM(entityId, message);
      }
      async notifyBadgeUnlock(entityId, badgeIds) {
        if (badgeIds.length === 0) return;
        const badgeNames = badgeIds.map((id) => {
          const badge = BADGES.find((b) => b.id === id);
          return badge ? `**${badge.name}**: ${badge.description}` : id;
        });
        const message = `\u{1F3C5} **New Badge${badgeIds.length > 1 ? "s" : ""} Unlocked!** \u{1F3C5}

${badgeNames.join("\n")}

Keep practicing to unlock more!`;
        await this.sendDM(entityId, message);
      }
      async notifyLeaderboardChange(entityId, oldRank, newRank) {
        if (newRank > 10 && Math.abs(oldRank - newRank) < 5) return;
        let message = "";
        if (newRank < oldRank) {
          message = `\u{1F4C8} You moved up the leaderboard!

New rank: **#${newRank}** (was #${oldRank})`;
          if (newRank <= 3) {
            const medals = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
            message += `

${medals[newRank - 1]} You're now in the top 3!`;
          }
        } else if (newRank > oldRank && oldRank <= 10) {
          message = `\u{1F4C9} Heads up! Your leaderboard rank changed from #${oldRank} to #${newRank}.

Keep practicing to climb back up!`;
        }
        if (message) {
          await this.sendDM(entityId, message);
        }
      }
      // ============================================================================
      // Helper Methods
      // ============================================================================
      async sendDM(entityId, content) {
        try {
          await this.runtime.emitEvent("SEND_DM", {
            entityId,
            content: { text: content }
          });
          return true;
        } catch (error) {
          this.runtime.logger.warn({
            src: "plugin:virtue",
            entityId,
            error: error instanceof Error ? error.message : String(error)
          }, "Failed to send DM");
          return false;
        }
      }
    };
  }
});

// src/services/mentorshipService.ts
var mentorshipService_exports = {};
__export(mentorshipService_exports, {
  MentorshipService: () => MentorshipService
});
import { Service as Service5 } from "@elizaos/core";
var MentorshipService;
var init_mentorshipService = __esm({
  "src/services/mentorshipService.ts"() {
    "use strict";
    init_constants();
    MentorshipService = class _MentorshipService extends Service5 {
      static serviceType = "virtue_mentorship";
      capabilityDescription = "Manages mentor-mentee relationships and point sharing";
      static async start(runtime) {
        const service = new _MentorshipService(runtime);
        runtime.logger.info({ src: "plugin:virtue" }, "MentorshipService started");
        return service;
      }
      async stop() {
        this.runtime.logger.info({ src: "plugin:virtue" }, "MentorshipService stopped");
      }
      // ============================================================================
      // Mentorship Management
      // ============================================================================
      async createMentorship(mentorId, menteeId) {
        const pair = {
          mentorId,
          menteeId,
          startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          totalPointsShared: 0,
          status: "active"
        };
        const allPairs = await this.getAllMentorships();
        allPairs.push(pair);
        await this.runtime.setCache(CACHE_KEYS.CONFIG("mentorships"), allPairs);
        return pair;
      }
      async getMentorships(entityId) {
        const allPairs = await this.getAllMentorships();
        return {
          asMentor: allPairs.filter((p) => p.mentorId === entityId && p.status === "active"),
          asMentee: allPairs.filter((p) => p.menteeId === entityId && p.status === "active")
        };
      }
      async endMentorship(mentorId, menteeId) {
        const allPairs = await this.getAllMentorships();
        const pair = allPairs.find(
          (p) => p.mentorId === mentorId && p.menteeId === menteeId && p.status === "active"
        );
        if (pair) {
          pair.status = "completed";
          await this.runtime.setCache(CACHE_KEYS.CONFIG("mentorships"), allPairs);
          return true;
        }
        return false;
      }
      // ============================================================================
      // Point Sharing (20% to mentor)
      // ============================================================================
      async shareMenteePoints(menteeId, pointsEarned) {
        const { asMentee } = await this.getMentorships(menteeId);
        if (asMentee.length === 0) return;
        const mentorShare = Math.floor(pointsEarned * 0.2);
        for (const pair of asMentee) {
          try {
            const virtueService = this.runtime.getService("virtue");
            if (!virtueService) continue;
            const mentorData = await virtueService.getUserData(pair.mentorId);
            mentorData.totalPoints += mentorShare;
            await virtueService.saveUserData(pair.mentorId, mentorData);
            const allPairs = await this.getAllMentorships();
            const currentPair = allPairs.find(
              (p) => p.mentorId === pair.mentorId && p.menteeId === pair.menteeId
            );
            if (currentPair) {
              currentPair.totalPointsShared += mentorShare;
              await this.runtime.setCache(CACHE_KEYS.CONFIG("mentorships"), allPairs);
            }
            await this.notifyMentor(pair.mentorId, mentorShare, menteeId);
          } catch (error) {
            this.runtime.logger.error({
              src: "plugin:virtue",
              error: error instanceof Error ? error.message : String(error)
            }, "Failed to share mentee points");
          }
        }
      }
      async notifyMentor(mentorId, points, menteeId) {
        try {
          await this.runtime.emitEvent("SEND_DM", {
            entityId: mentorId,
            content: {
              text: `\u{1F393} Your mentee earned virtue points! You received ${points} pts (20% mentor bonus)`
            }
          });
        } catch {
        }
      }
      async getAllMentorships() {
        return await this.runtime.getCache(
          CACHE_KEYS.CONFIG("mentorships")
        ) || [];
      }
    };
  }
});

// src/index.ts
init_constants();

// src/services/virtueService.ts
init_constants();
import { Service as Service6 } from "@elizaos/core";

// src/utils/formatting.ts
function toLocalDate(date, timezone) {
  try {
    return date.toLocaleDateString("en-CA", { timeZone: timezone });
  } catch {
    return date.toLocaleDateString("en-CA", { timeZone: "UTC" });
  }
}
function getPreviousDay(dateStr, timezone) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return toLocalDate(date, timezone);
}

// src/utils/errorHandler.ts
init_constants();
async function logError(runtime, context, error, entityId) {
  try {
    const errorLog = await runtime.getCache(CACHE_KEYS.ERRORS(runtime.agentId)) || [];
    errorLog.unshift({
      timestamp: Date.now(),
      context,
      error: error instanceof Error ? error.message : String(error),
      entityId
    });
    if (errorLog.length > ERROR_LOG_MAX_ENTRIES) {
      errorLog.length = ERROR_LOG_MAX_ENTRIES;
    }
    await runtime.setCache(CACHE_KEYS.ERRORS(runtime.agentId), errorLog);
    runtime.logger.error({
      src: "plugin:virtue",
      context,
      error: error instanceof Error ? error.message : String(error),
      entityId
    }, `Virtue plugin error: ${context}`);
  } catch (logError2) {
    runtime.logger.error({
      src: "plugin:virtue",
      context: "error-logging-failed",
      originalError: error instanceof Error ? error.message : String(error),
      logError: logError2 instanceof Error ? logError2.message : String(logError2)
    }, "Failed to log error");
  }
}
async function withRetry(fn, retries = 3, backoffMs = 1e3) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs * Math.pow(2, i)));
      }
    }
  }
  throw lastError || new Error("Unknown error in withRetry");
}

// src/services/virtueService.ts
var VirtueService = class _VirtueService extends Service6 {
  static serviceType = "virtue";
  capabilityDescription = "Manages virtue tracking, streaks, badges, and leaderboards for Franklin's Virtue Tracker";
  static async start(runtime) {
    const service = new _VirtueService(runtime);
    runtime.logger.info({ src: "plugin:virtue", agentId: runtime.agentId }, "VirtueService started");
    return service;
  }
  async stop() {
    this.runtime.logger.info({ src: "plugin:virtue", agentId: this.runtime.agentId }, "VirtueService stopped");
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
  async getUserData(entityId) {
    const cacheKey = CACHE_KEYS.USER_DATA(entityId);
    return withRetry(async () => {
      const cached = await this.runtime.getCache(cacheKey);
      if (cached) return cached;
      const newUser = {
        entityId,
        timezone: "UTC",
        // Default until user sets their timezone
        checkIns: {},
        // Empty check-in history
        streaks: { current: 0, longest: 0, lastDate: null },
        totalPoints: 0,
        badges: [],
        reminderEnabled: false
        // Opt-in for reminders (privacy-first)
      };
      await this.runtime.setCache(cacheKey, newUser);
      return newUser;
    });
  }
  async saveUserData(entityId, data) {
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
  async recordCheckIn(entityId, virtueId, source) {
    try {
      const userData = await this.getUserData(entityId);
      const today = toLocalDate(/* @__PURE__ */ new Date(), userData.timezone);
      if (!userData.checkIns[today]) {
        userData.checkIns[today] = {};
      }
      const existingCheckIn = userData.checkIns[today][virtueId];
      if (existingCheckIn) {
        if (source === "observed") {
          return {
            points: 0,
            isDuplicate: true,
            message: "",
            // Silent for observed to avoid spam
            newBadges: []
          };
        }
        if (existingCheckIn.source === "self-report") {
          const virtue3 = VIRTUES.find((v) => v.id === virtueId);
          return {
            points: 0,
            isDuplicate: true,
            message: `Already logged **${virtue3?.name}** today \u2014 nice consistency! \u2728`,
            newBadges: []
          };
        }
        const additionalPoints = POINTS.SELF_REPORT - POINTS.OBSERVED;
        existingCheckIn.source = "self-report";
        existingCheckIn.points += additionalPoints;
        userData.totalPoints += additionalPoints;
        await this.saveUserData(entityId, userData);
        const virtue2 = VIRTUES.find((v) => v.id === virtueId);
        return {
          points: additionalPoints,
          isDuplicate: false,
          message: `Upgraded **${virtue2?.name}** to self-report! +${additionalPoints} pts`,
          newBadges: []
        };
      }
      let points = source === "self-report" ? POINTS.SELF_REPORT : POINTS.OBSERVED;
      const multiplier = await this.getSeasonalMultiplier(virtueId);
      points = Math.floor(points * multiplier);
      userData.checkIns[today][virtueId] = {
        virtueId,
        source,
        timestamp: Date.now(),
        points
      };
      userData.totalPoints += points;
      userData.streaks = this.calculateStreak(userData.checkIns, userData.timezone);
      const streakBonus = Math.min(
        userData.streaks.current * POINTS.STREAK_BONUS_PER_DAY,
        POINTS.STREAK_BONUS_CAP
      );
      userData.totalPoints += streakBonus;
      if (Object.keys(userData.checkIns[today]).length === 13) {
        userData.totalPoints += POINTS.WEEKLY_COMPLETION_BONUS;
      }
      const synergyResult = await this.checkSynergies(userData.checkIns[today]);
      if (synergyResult.bonusPoints > 0) {
        userData.totalPoints += synergyResult.bonusPoints;
      }
      const newBadges = await this.evaluateBadges(userData);
      await this.saveUserData(entityId, userData);
      await this.checkMilestones(entityId, userData, newBadges);
      await this.checkChallengeProgress(entityId, userData);
      await this.shareMentorshipPoints(entityId, points + streakBonus + synergyResult.bonusPoints);
      const virtue = VIRTUES.find((v) => v.id === virtueId);
      let message = `Logged **${virtue?.name}**! +${points} pts`;
      if (streakBonus > 0) message += ` (+${streakBonus} streak bonus!)`;
      if (synergyResult.bonusPoints > 0) {
        message += `
\u{1F517} Synergy bonus! +${synergyResult.bonusPoints} pts`;
      }
      return {
        points: points + streakBonus + synergyResult.bonusPoints,
        isDuplicate: false,
        message,
        newBadges
      };
    } catch (error) {
      await logError(this.runtime, "recordCheckIn", error, entityId);
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
  calculateStreak(checkIns, timezone, now = /* @__PURE__ */ new Date()) {
    const localNow = toLocalDate(now, timezone);
    const yesterday = this.getYesterday(localNow, timezone);
    const dates = Object.keys(checkIns).sort().reverse();
    if (dates.length === 0) {
      return { current: 0, longest: 0, lastDate: null };
    }
    const lastDate = dates[0];
    if (lastDate !== localNow && lastDate !== yesterday) {
      return {
        current: 0,
        longest: this.calculateLongestStreak(dates),
        lastDate
      };
    }
    let current = 0;
    let expectedDate = lastDate;
    for (const date of dates) {
      if (date === expectedDate) {
        current++;
        expectedDate = getPreviousDay(expectedDate, timezone);
      } else {
        break;
      }
    }
    const longest = Math.max(current, this.calculateLongestStreak(dates));
    return { current, longest, lastDate };
  }
  getYesterday(dateStr, timezone) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    return toLocalDate(date, timezone);
  }
  calculateLongestStreak(sortedDates) {
    if (sortedDates.length === 0) return 0;
    let longest = 1;
    let current = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = (prev.getTime() - curr.getTime()) / (1e3 * 60 * 60 * 24);
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
  async evaluateBadges(userData) {
    const newBadges = [];
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
  async updateLeaderboard(worldId, entityId, newPoints, streak, badges) {
    try {
      const cacheKey = CACHE_KEYS.LEADERBOARD(worldId);
      const leaderboard = await this.runtime.getCache(cacheKey) || {
        worldId,
        updatedAt: 0,
        entries: []
      };
      let entry = leaderboard.entries.find((e) => e.entityId === entityId);
      if (entry) {
        entry.points = newPoints;
        entry.streak = streak;
        entry.badges = badges;
      } else {
        const entity = await this.runtime.getEntity(entityId);
        entry = {
          entityId,
          displayName: entity?.names?.[0] || "Unknown",
          points: newPoints,
          rank: 0,
          streak,
          badges
        };
        leaderboard.entries.push(entry);
      }
      leaderboard.entries.sort((a, b) => b.points - a.points);
      let currentRank = 1;
      let previousPoints = -1;
      for (let i = 0; i < leaderboard.entries.length; i++) {
        if (leaderboard.entries[i].points !== previousPoints) {
          currentRank = i + 1;
        }
        leaderboard.entries[i].rank = currentRank;
        previousPoints = leaderboard.entries[i].points;
      }
      leaderboard.entries = leaderboard.entries.slice(0, 100);
      leaderboard.updatedAt = Date.now();
      await withRetry(() => this.runtime.setCache(cacheKey, leaderboard));
    } catch (error) {
      await logError(this.runtime, "updateLeaderboard", error, entityId);
    }
  }
  async getLeaderboard(worldId) {
    try {
      const cacheKey = CACHE_KEYS.LEADERBOARD(worldId);
      return await this.runtime.getCache(cacheKey);
    } catch (error) {
      await logError(this.runtime, "getLeaderboard", error);
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
  calculateDNA(userData) {
    const virtueCount = {};
    for (const dayCheckIns of Object.values(userData.checkIns)) {
      for (const [virtueId] of Object.entries(dayCheckIns)) {
        virtueCount[virtueId] = (virtueCount[virtueId] || 0) + 1;
      }
    }
    const sorted = Object.entries(virtueCount).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0]?.[0] || "humility";
    const secondary = sorted[1]?.[0] || "justice";
    const practicedVirtues = sorted.filter(([_, count]) => count > 0);
    const growth = practicedVirtues.length > 0 ? practicedVirtues[practicedVirtues.length - 1][0] : "temperance";
    const clusterScores = {};
    for (const [cluster, virtues] of Object.entries(VIRTUE_CLUSTERS)) {
      const score = virtues.reduce((sum, v) => sum + (virtueCount[v] || 0), 0) / virtues.length;
      clusterScores[cluster] = Math.round(score * 10) / 10;
    }
    const topCluster = Object.entries(clusterScores).sort((a, b) => b[1] - a[1])[0]?.[0];
    const archetype = ARCHETYPES[topCluster] || "The Seeker";
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
  deriveTraits(clusterScores, virtueCount) {
    const traits = [];
    if (clusterScores["self-control"] > 5) traits.push("Composed");
    if (clusterScores["wisdom"] > 5) traits.push("Thoughtful");
    if (clusterScores["discipline"] > 5) traits.push("Organized");
    if (clusterScores["courage"] > 5) traits.push("Determined");
    if (clusterScores["compassion"] > 5) traits.push("Empathetic");
    if (virtueCount["humility"] > 10) traits.push("Humble");
    if (virtueCount["industry"] > 10) traits.push("Industrious");
    return traits.slice(0, 4);
  }
  // ============================================================================
  // Seasonal Events
  // ============================================================================
  async getSeasonalMultiplier(virtueId) {
    try {
      const { SeasonalEventsService: SeasonalEventsService2 } = await Promise.resolve().then(() => (init_seasonalEventsService(), seasonalEventsService_exports));
      const seasonalService = this.runtime.getService("virtue_seasonal_events");
      if (!seasonalService) return 1;
      return await seasonalService.getPointMultiplier(virtueId);
    } catch {
      return 1;
    }
  }
  // ============================================================================
  // Synergy & Challenge Integration
  // ============================================================================
  async checkSynergies(checkInsToday) {
    try {
      const { VirtueSynergyService: VirtueSynergyService2 } = await Promise.resolve().then(() => (init_virtuesynergyService(), virtuesynergyService_exports));
      const synergyService = this.runtime.getService("virtue_synergy");
      if (!synergyService) return { synergies: [], bonusPoints: 0 };
      return await synergyService.checkSynergies(checkInsToday);
    } catch {
      return { synergies: [], bonusPoints: 0 };
    }
  }
  async checkChallengeProgress(entityId, userData) {
    try {
      const { VirtueChallengeService: VirtueChallengeService2 } = await Promise.resolve().then(() => (init_virtueChallengeService(), virtueChallengeService_exports));
      const challengeService = this.runtime.getService("virtue_challenge");
      if (!challengeService) return;
      const result = await challengeService.checkChallengeProgress(entityId, userData);
      if (result.rewards > 0) {
        userData.totalPoints += result.rewards;
        await this.saveUserData(entityId, userData);
        const { NotificationService: NotificationService2 } = await Promise.resolve().then(() => (init_notificationService(), notificationService_exports));
        const notificationService = this.runtime.getService("virtue_notification");
        if (notificationService) {
          for (const challengeId of result.completed) {
            await notificationService.sendDM(
              entityId,
              `\u{1F3C6} Challenge Completed! You earned ${result.rewards} bonus points!`
            );
          }
        }
      }
    } catch (error) {
      this.runtime.logger.debug({
        src: "plugin:virtue",
        context: "checkChallengeProgress",
        error: error instanceof Error ? error.message : String(error)
      }, "Failed to check challenge progress");
    }
  }
  // ============================================================================
  // Mentorship Integration
  // ============================================================================
  async shareMentorshipPoints(entityId, points) {
    try {
      const { MentorshipService: MentorshipService2 } = await Promise.resolve().then(() => (init_mentorshipService(), mentorshipService_exports));
      const mentorshipService = this.runtime.getService("virtue_mentorship");
      if (!mentorshipService) return;
      await mentorshipService.shareMenteePoints(entityId, points);
    } catch (error) {
      this.runtime.logger.debug({
        src: "plugin:virtue",
        context: "shareMentorshipPoints",
        error: error instanceof Error ? error.message : String(error)
      }, "Failed to share mentorship points");
    }
  }
  // ============================================================================
  // Milestone Notifications
  // ============================================================================
  async checkMilestones(entityId, userData, newBadges) {
    try {
      const { NotificationService: NotificationService2 } = await Promise.resolve().then(() => (init_notificationService(), notificationService_exports));
      const notificationService = this.runtime.getService("virtue_notification");
      if (!notificationService) return;
      const streakMilestones = [7, 14, 21, 30, 60, 90, 100, 365];
      if (streakMilestones.includes(userData.streaks.current)) {
        await notificationService.notifyStreakMilestone(entityId, userData.streaks.current);
      }
      if (newBadges.length > 0) {
        await notificationService.notifyBadgeUnlock(entityId, newBadges);
      }
    } catch (error) {
      this.runtime.logger.debug({
        src: "plugin:virtue",
        context: "checkMilestones",
        error: error instanceof Error ? error.message : String(error)
      }, "Failed to check milestones");
    }
  }
};

// src/plugin.ts
init_notificationService();
init_seasonalEventsService();
init_virtuesynergyService();
init_virtueChallengeService();
init_mentorshipService();

// src/services/historicalComparisonService.ts
import { Service as Service7 } from "@elizaos/core";
var HISTORICAL_FIGURES = [
  {
    id: "franklin",
    name: "Benjamin Franklin",
    description: "The original virtue tracker - disciplined, industrious, and humble",
    virtueProfile: {
      temperance: 90,
      silence: 60,
      order: 85,
      resolution: 80,
      frugality: 95,
      industry: 100,
      sincerity: 75,
      justice: 85,
      moderation: 70,
      cleanliness: 80,
      tranquility: 65,
      chastity: 70,
      humility: 90
    },
    archetype: "The Strategist",
    level: 50
  },
  {
    id: "aurelius",
    name: "Marcus Aurelius",
    description: "Stoic emperor - master of tranquility, moderation, and wisdom",
    virtueProfile: {
      temperance: 95,
      silence: 85,
      order: 70,
      resolution: 85,
      frugality: 60,
      industry: 75,
      sincerity: 80,
      justice: 95,
      moderation: 100,
      cleanliness: 65,
      tranquility: 100,
      chastity: 80,
      humility: 90
    },
    archetype: "The Stoic",
    level: 55
  },
  {
    id: "gandhi",
    name: "Mahatma Gandhi",
    description: "Peaceful revolutionary - exemplar of justice, temperance, and humility",
    virtueProfile: {
      temperance: 100,
      silence: 70,
      order: 65,
      resolution: 95,
      frugality: 90,
      industry: 80,
      sincerity: 95,
      justice: 100,
      moderation: 85,
      cleanliness: 85,
      tranquility: 95,
      chastity: 95,
      humility: 100
    },
    archetype: "The Guardian",
    level: 60
  }
];
var HistoricalComparisonService = class _HistoricalComparisonService extends Service7 {
  static serviceType = "virtue_historical";
  capabilityDescription = "Compares user progress with historical figures";
  static async start(runtime) {
    const service = new _HistoricalComparisonService(runtime);
    runtime.logger.info({ src: "plugin:virtue" }, "HistoricalComparisonService started");
    return service;
  }
  async stop() {
    this.runtime.logger.info({ src: "plugin:virtue" }, "HistoricalComparisonService stopped");
  }
  // ============================================================================
  // Comparison Analysis
  // ============================================================================
  compareToFigure(userData, figureId) {
    const figure = HISTORICAL_FIGURES.find((f) => f.id === figureId);
    if (!figure) return null;
    const userVirtueCounts = {};
    for (const dayCheckIns of Object.values(userData.checkIns)) {
      for (const [virtueId] of Object.entries(dayCheckIns)) {
        userVirtueCounts[virtueId] = (userVirtueCounts[virtueId] || 0) + 1;
      }
    }
    let similaritySum = 0;
    let virtueCount = 0;
    const strengths = [];
    const gaps = [];
    for (const [virtueId, figureCount] of Object.entries(figure.virtueProfile)) {
      const userCount = userVirtueCounts[virtueId] || 0;
      const maxCount = Math.max(figureCount, userCount, 1);
      const similarity = Math.min(figureCount, userCount) / maxCount * 100;
      similaritySum += similarity;
      virtueCount++;
      if (userCount >= figureCount * 0.8) {
        strengths.push(virtueId);
      }
      if (userCount < figureCount * 0.5) {
        gaps.push(virtueId);
      }
    }
    const overallSimilarity = Math.round(similaritySum / virtueCount);
    let message = "";
    if (overallSimilarity >= 80) {
      message = `You're remarkably similar to ${figure.name}! Keep up the excellent practice.`;
    } else if (overallSimilarity >= 60) {
      message = `You're on a good path to matching ${figure.name}'s virtue profile.`;
    } else if (overallSimilarity >= 40) {
      message = `You're making progress toward ${figure.name}'s level of virtue cultivation.`;
    } else {
      message = `You're beginning your journey. ${figure.name} practiced for many years - keep going!`;
    }
    return {
      figure,
      similarity: overallSimilarity,
      strengths: strengths.slice(0, 3),
      gaps: gaps.slice(0, 3),
      message
    };
  }
  getAllFigures() {
    return HISTORICAL_FIGURES;
  }
  findClosestMatch(userData) {
    let bestMatch = HISTORICAL_FIGURES[0];
    let bestSimilarity = 0;
    for (const figure of HISTORICAL_FIGURES) {
      const comparison = this.compareToFigure(userData, figure.id);
      if (comparison && comparison.similarity > bestSimilarity) {
        bestSimilarity = comparison.similarity;
        bestMatch = figure;
      }
    }
    return { figure: bestMatch, similarity: bestSimilarity };
  }
};

// src/services/virtueRemixService.ts
init_constants();
import { Service as Service8 } from "@elizaos/core";
import { ModelType } from "@elizaos/core";
var VirtueRemixService = class _VirtueRemixService extends Service8 {
  static serviceType = "virtue_remix";
  capabilityDescription = "Provides LLM-powered personalized virtue suggestions";
  static async start(runtime) {
    const service = new _VirtueRemixService(runtime);
    runtime.logger.info({ src: "plugin:virtue" }, "VirtueRemixService started");
    return service;
  }
  async stop() {
    this.runtime.logger.info({ src: "plugin:virtue" }, "VirtueRemixService stopped");
  }
  // ============================================================================
  // Personalized Suggestions
  // ============================================================================
  async generateSuggestions(userData) {
    const virtueCount = {};
    for (const dayCheckIns of Object.values(userData.checkIns)) {
      for (const [virtueId] of Object.entries(dayCheckIns)) {
        virtueCount[virtueId] = (virtueCount[virtueId] || 0) + 1;
      }
    }
    const practicedsorted = Object.entries(virtueCount).sort((a, b) => b[1] - a[1]).map(([id, count]) => {
      const virtue = VIRTUES.find((v) => v.id === id);
      return `${virtue?.name}: ${count} times`;
    });
    const unpracticed = VIRTUES.filter((v) => !virtueCount[v.id]).map((v) => v.name);
    const prompt = `You are a virtue cultivation coach analyzing a user's practice history.

**User's Practice History:**
${practicedsorted.join("\n")}

**Unpracticed Virtues:**
${unpracticed.join(", ") || "None - practicing all virtues!"}

**Current Streak:** ${userData.streaks.current} days

Based on this user's patterns, suggest 3 virtues they should focus on next and why. Consider:
1. Virtues they haven't practiced recently
2. Complementary virtues that work well together
3. Their current strengths and growth areas

Return your response in this exact JSON format:
{
  "focusVirtues": ["virtue1", "virtue2", "virtue3"],
  "reasoning": "Brief explanation of why these virtues",
  "practicalTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;
    try {
      const response = await this.runtime.useModel(ModelType.TEXT_LARGE, {
        prompt,
        temperature: 0.7,
        maxTokens: 500
      });
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const validVirtues = parsed.focusVirtues.filter(
          (name) => VIRTUES.some((v) => v.name.toLowerCase() === name.toLowerCase())
        );
        return {
          focusVirtues: validVirtues.slice(0, 3),
          reasoning: parsed.reasoning || "Personalized for your practice patterns",
          practicalTips: (parsed.practicalTips || []).slice(0, 3)
        };
      }
    } catch (error) {
      this.runtime.logger.error({
        src: "plugin:virtue",
        error: error instanceof Error ? error.message : String(error)
      }, "Failed to generate virtue suggestions");
    }
    return this.generateFallbackSuggestions(virtueCount);
  }
  generateFallbackSuggestions(virtueCount) {
    const leastPracticed = VIRTUES.map((v) => ({ name: v.name, count: virtueCount[v.id] || 0 })).sort((a, b) => a.count - b.count).slice(0, 3);
    return {
      focusVirtues: leastPracticed.map((v) => v.name),
      reasoning: "These virtues could use more attention in your practice.",
      practicalTips: [
        "Set a specific time each day to practice",
        "Journal about your experiences",
        "Find an accountability partner"
      ]
    };
  }
};

// src/actions/checkInVirtue.ts
import { ModelType as ModelType2 } from "@elizaos/core";

// src/utils/validator.ts
init_constants();
function isValidTimezone(timezone) {
  try {
    Intl.DateTimeFormat(void 0, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}
function normalizeTimezone(input) {
  const normalized = input.trim();
  if (isValidTimezone(normalized)) {
    return normalized;
  }
  const abbreviations = {
    "EST": "America/New_York",
    "PST": "America/Los_Angeles",
    "CST": "America/Chicago",
    "MST": "America/Denver",
    "GMT": "UTC",
    "UTC": "UTC"
  };
  const upper = normalized.toUpperCase();
  if (abbreviations[upper] && isValidTimezone(abbreviations[upper])) {
    return abbreviations[upper];
  }
  return null;
}
function findVirtueByName(name) {
  const normalized = name.toLowerCase().trim();
  const exactMatch = VIRTUES.find((v) => v.id === normalized || v.name.toLowerCase() === normalized);
  if (exactMatch) return exactMatch.id;
  const partialMatch = VIRTUES.find(
    (v) => v.id.includes(normalized) || v.name.toLowerCase().includes(normalized) || v.keywords.some((k) => k.toLowerCase().includes(normalized))
  );
  if (partialMatch) return partialMatch.id;
  return null;
}
function isValidRuleProposal(action, value) {
  if (action === "adjust_confidence") {
    const val = parseFloat(value);
    return !isNaN(val) && val >= 0.3 && val <= 0.9;
  }
  if (action === "add_keyword" || action === "add_exclude" || action === "remove_keyword" || action === "remove_exclude") {
    const str = String(value);
    if (/[\\^$.*+?()[\]{}|]/.test(str)) return false;
    if (str.length > 50) return false;
    return true;
  }
  return false;
}

// src/actions/checkInVirtue.ts
init_constants();
var checkInVirtueAction = {
  name: "CHECK_IN_VIRTUE",
  similes: ["LOG_VIRTUE", "REPORT_VIRTUE", "PRACTICE_VIRTUE"],
  description: "Log when you practice a virtue (self-report check-in)",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    const virtueKeywords = [
      "practice",
      "practiced",
      "virtue",
      "logged",
      "temperance",
      "silence",
      "order",
      "resolution",
      "frugality",
      "industry",
      "sincerity",
      "justice",
      "moderation",
      "cleanliness",
      "tranquility",
      "chastity",
      "humility"
    ];
    return virtueKeywords.some((keyword) => text.includes(keyword));
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      const prompt = `Extract the virtue name from this message. User said: "${message.content.text}"

Available virtues: ${VIRTUES.map((v) => v.name).join(", ")}

Return ONLY the virtue name, or "none" if no virtue is mentioned.`;
      const response = await runtime.useModel(ModelType2.TEXT_SMALL, {
        prompt,
        temperature: 0.3,
        maxTokens: 50
      });
      const virtueName = response.trim();
      const virtueId = findVirtueByName(virtueName);
      if (!virtueId) {
        const text = `I couldn't identify which virtue you practiced. Try: "I practiced temperance today" or "I practiced ${VIRTUES[0].name.toLowerCase()}"`;
        if (callback) {
          await callback({
            text,
            actions: ["CHECK_IN_VIRTUE"],
            source: message.content.source
          });
        }
        return {
          text,
          success: false,
          data: { error: "virtue_not_found" }
        };
      }
      const result = await virtueService.recordCheckIn(
        message.entityId,
        virtueId,
        "self-report"
      );
      if (!result.isDuplicate) {
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
      }
      let responseText = result.message;
      if (result.newBadges.length > 0) {
        const badgeNames = result.newBadges.map(
          (id) => BADGES.find((b) => b.id === id)?.name || id
        );
        responseText += `

\u{1F3C5} New badge${result.newBadges.length > 1 ? "s" : ""}: **${badgeNames.join(", ")}**!`;
      }
      if (callback) {
        await callback({
          text: responseText,
          actions: ["CHECK_IN_VIRTUE"],
          source: message.content.source
        });
      }
      return {
        text: responseText,
        success: true,
        data: {
          virtueId,
          points: result.points,
          isDuplicate: result.isDuplicate,
          newBadges: result.newBadges
        }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "checkInVirtue",
        error: error instanceof Error ? error.message : String(error)
      }, "Error checking in virtue");
      const text = "Sorry, I encountered an error logging your virtue. Please try again.";
      if (callback) {
        await callback({
          text,
          actions: ["CHECK_IN_VIRTUE_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "I practiced temperance today",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "Logged **Temperance**! +10 pts",
          actions: ["CHECK_IN_VIRTUE"]
        }
      }
    ],
    [
      {
        name: "{{userName}}",
        content: {
          text: "I practiced humility by admitting my mistake",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "Logged **Humility**! +10 pts (+5 streak bonus!)",
          actions: ["CHECK_IN_VIRTUE"]
        }
      }
    ]
  ]
};

// src/actions/viewProgress.ts
init_constants();
var viewProgressAction = {
  name: "VIEW_PROGRESS",
  similes: ["SHOW_PROGRESS", "MY_PROGRESS", "VIRTUE_PROGRESS", "MY_VIRTUES"],
  description: "View your virtue progress (weekly card via DM)",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("progress") || text.includes("my virtues") || text.includes("show my");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      const userData = await virtueService.getUserData(message.entityId);
      const today = /* @__PURE__ */ new Date();
      const weekDates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        weekDates.push(toLocalDate(date, userData.timezone));
      }
      let card = `## \u{1F4CA} Your Virtue Progress

`;
      card += `\u{1F525} **Streak:** ${userData.streaks.current} days (Best: ${userData.streaks.longest})
`;
      card += `\u2B50 **Points:** ${userData.totalPoints}
`;
      card += `\u{1F3C5} **Badges:** ${userData.badges.length}

`;
      card += `### This Week

`;
      for (const virtue of VIRTUES) {
        let row = `**${virtue.name}**: `;
        for (const date of weekDates) {
          const checkIn = userData.checkIns[date]?.[virtue.id];
          if (checkIn) {
            row += checkIn.source === "self-report" ? "\u2705 " : "\u2B50 ";
          } else {
            row += "\u2B1C ";
          }
        }
        card += row + "\n";
      }
      card += `
\u2705 = Self-report | \u2B50 = Observed | \u2B1C = Not logged
`;
      try {
        await runtime.emitEvent("SEND_DM", {
          entityId: message.entityId,
          content: { text: card }
        });
        const publicResponse = `I've sent your virtue progress card via DM! \u{1F4CA}`;
        if (callback) {
          await callback({
            text: publicResponse,
            actions: ["VIEW_PROGRESS"],
            source: message.content.source
          });
        }
        return {
          text: publicResponse,
          success: true,
          data: { sentViaDM: true }
        };
      } catch {
        if (callback) {
          await callback({
            text: card,
            actions: ["VIEW_PROGRESS"],
            source: message.content.source
          });
        }
        return {
          text: card,
          success: true,
          data: { sentViaDM: false }
        };
      }
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "viewProgress",
        error: error instanceof Error ? error.message : String(error)
      }, "Error viewing progress");
      const text = "Sorry, I couldn't retrieve your progress. Please try again.";
      if (callback) {
        await callback({
          text,
          actions: ["VIEW_PROGRESS_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Show my virtue progress",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "I've sent your virtue progress card via DM! \u{1F4CA}",
          actions: ["VIEW_PROGRESS"]
        }
      }
    ]
  ]
};

// src/actions/viewLeaderboard.ts
var viewLeaderboardAction = {
  name: "VIEW_LEADERBOARD",
  similes: ["SHOW_LEADERBOARD", "VIRTUE_LEADERBOARD", "TOP_VIRTUES", "RANKINGS"],
  description: "View the community virtue leaderboard",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("leaderboard") || text.includes("rankings") || text.includes("top");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      if (!message.roomId) {
        throw new Error("No room context for leaderboard");
      }
      const room = await runtime.getRoom(message.roomId);
      if (!room?.worldId) {
        throw new Error("No world context for leaderboard");
      }
      const leaderboard = await virtueService.getLeaderboard(room.worldId);
      if (!leaderboard || leaderboard.entries.length === 0) {
        const text = "No leaderboard entries yet. Be the first to practice a virtue!";
        if (callback) {
          await callback({
            text,
            actions: ["VIEW_LEADERBOARD"],
            source: message.content.source
          });
        }
        return {
          text,
          success: true,
          data: { entries: [] }
        };
      }
      let leaderboardText = `## \u{1F3C6} Virtue Leaderboard

`;
      const top3 = leaderboard.entries.slice(0, 3);
      for (const entry of top3) {
        const medal = entry.rank === 1 ? "\u{1F947}" : entry.rank === 2 ? "\u{1F948}" : "\u{1F949}";
        leaderboardText += `${medal} **${entry.displayName}** - ${entry.points} pts (${entry.streak} day streak, ${entry.badges} badges)
`;
      }
      let fullLeaderboard = `## \u{1F3C6} Full Virtue Leaderboard

`;
      for (const entry of leaderboard.entries) {
        const prefix = entry.rank <= 3 ? ["\u{1F947}", "\u{1F948}", "\u{1F949}"][entry.rank - 1] : `#${entry.rank}`;
        fullLeaderboard += `${prefix} **${entry.displayName}** - ${entry.points} pts (${entry.streak}d, ${entry.badges}\u{1F3C5})
`;
      }
      if (callback) {
        await callback({
          text: leaderboardText + (leaderboard.entries.length > 3 ? "\n_Check your DM for the full leaderboard_" : ""),
          actions: ["VIEW_LEADERBOARD"],
          source: message.content.source
        });
      }
      if (leaderboard.entries.length > 3) {
        try {
          await runtime.emitEvent("SEND_DM", {
            entityId: message.entityId,
            content: { text: fullLeaderboard }
          });
        } catch {
        }
      }
      return {
        text: leaderboardText,
        success: true,
        data: {
          entries: leaderboard.entries,
          updatedAt: leaderboard.updatedAt
        }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "viewLeaderboard",
        error: error instanceof Error ? error.message : String(error)
      }, "Error viewing leaderboard");
      const text = "Sorry, I couldn't retrieve the leaderboard. Please try again.";
      if (callback) {
        await callback({
          text,
          actions: ["VIEW_LEADERBOARD_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Show the virtue leaderboard",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u{1F3C6} Virtue Leaderboard\n\n\u{1F947} **Alice** - 1250 pts\n\u{1F948} **Bob** - 890 pts\n\u{1F949} **Carol** - 675 pts",
          actions: ["VIEW_LEADERBOARD"]
        }
      }
    ]
  ]
};

// src/actions/setTimezone.ts
import { ModelType as ModelType3 } from "@elizaos/core";
var setTimezoneAction = {
  name: "SET_TIMEZONE",
  similes: ["UPDATE_TIMEZONE", "CHANGE_TIMEZONE", "MY_TIMEZONE"],
  description: "Set your timezone for accurate streak calculation",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("timezone") || text.includes("time zone");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      const prompt = `Extract the timezone from this message: "${message.content.text}"

Examples:
- "Set my timezone to America/New_York" -> America/New_York
- "Change timezone to PST" -> America/Los_Angeles
- "I'm in EST" -> America/New_York

Return ONLY the timezone in IANA format (e.g., America/New_York, Europe/London, Asia/Tokyo), or "unknown" if unclear.`;
      const response = await runtime.useModel(ModelType3.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 50
      });
      const timezoneInput = response.trim();
      const timezone = normalizeTimezone(timezoneInput);
      if (!timezone) {
        const text2 = `I couldn't recognize that timezone. Please use a format like:
- "Set my timezone to America/New_York"
- "Set my timezone to Europe/London"
- "Set my timezone to Asia/Tokyo"

Or use abbreviations like EST, PST, GMT.`;
        if (callback) {
          await callback({
            text: text2,
            actions: ["SET_TIMEZONE"],
            source: message.content.source
          });
        }
        return {
          text: text2,
          success: false,
          data: { error: "invalid_timezone" }
        };
      }
      const userData = await virtueService.getUserData(message.entityId);
      userData.timezone = timezone;
      userData.streaks = virtueService.calculateStreak(userData.checkIns, timezone);
      await virtueService.saveUserData(message.entityId, userData);
      const text = `\u2705 Timezone set to **${timezone}**. Your streaks have been recalculated based on your local time.`;
      if (callback) {
        await callback({
          text,
          actions: ["SET_TIMEZONE"],
          source: message.content.source
        });
      }
      return {
        text,
        success: true,
        data: { timezone }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "setTimezone",
        error: error instanceof Error ? error.message : String(error)
      }, "Error setting timezone");
      const text = "Sorry, I encountered an error setting your timezone. Please try again.";
      if (callback) {
        await callback({
          text,
          actions: ["SET_TIMEZONE_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Set my timezone to America/New_York",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 Timezone set to **America/New_York**.",
          actions: ["SET_TIMEZONE"]
        }
      }
    ]
  ]
};

// src/actions/setReminder.ts
var setReminderAction = {
  name: "SET_REMINDER",
  similes: ["TOGGLE_REMINDER", "REMINDER", "DAILY_REMINDER"],
  description: "Toggle daily virtue logging reminders",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("remind") && (text.includes("virtue") || text.includes("daily") || text.includes("log"));
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      const userData = await virtueService.getUserData(message.entityId);
      userData.reminderEnabled = !userData.reminderEnabled;
      await virtueService.saveUserData(message.entityId, userData);
      const text = userData.reminderEnabled ? "\u2705 Daily virtue reminders enabled! I'll send you a DM reminder each day." : "\u23F8\uFE0F Daily virtue reminders disabled.";
      if (callback) {
        await callback({
          text,
          actions: ["SET_REMINDER"],
          source: message.content.source
        });
      }
      return {
        text,
        success: true,
        data: { reminderEnabled: userData.reminderEnabled }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "setReminder",
        error: error instanceof Error ? error.message : String(error)
      }, "Error setting reminder");
      const text = "Sorry, I encountered an error updating your reminder settings. Please try again.";
      if (callback) {
        await callback({
          text,
          actions: ["SET_REMINDER_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Remind me to log virtues daily",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 Daily virtue reminders enabled!",
          actions: ["SET_REMINDER"]
        }
      }
    ]
  ]
};

// src/actions/viewCharacterSheet.ts
init_constants();
function calculateLevel(points) {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}
function renderAttributeBar(name, value, max) {
  const filled = Math.round(value / max * 10);
  const empty = 10 - filled;
  const bar = "\u2588".repeat(filled) + "\u2591".repeat(empty);
  const percent = Math.round(value / max * 100);
  return `**${name}** [${bar}] ${percent}%`;
}
var viewCharacterSheetAction = {
  name: "VIEW_CHARACTER_SHEET",
  similes: ["SHOW_CHARACTER", "MY_CHARACTER", "CHARACTER_STATS", "VIRTUE_STATS"],
  description: "View your RPG-style virtue character sheet",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("character") || text.includes("stats") || text.includes("sheet");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      const userData = await virtueService.getUserData(message.entityId);
      const dna = virtueService.calculateDNA(userData);
      const level = calculateLevel(userData.totalPoints);
      let sheet = `## \u{1F4DC} Virtue Character Sheet

`;
      sheet += `**Class:** ${dna.archetype}
`;
      sheet += `**Level:** ${level} (${userData.totalPoints} pts)

`;
      sheet += `### Attributes
`;
      sheet += renderAttributeBar("Self-Control", dna.clusterScores["self-control"] || 0, 10) + "\n";
      sheet += renderAttributeBar("Wisdom", dna.clusterScores["wisdom"] || 0, 10) + "\n";
      sheet += renderAttributeBar("Discipline", dna.clusterScores["discipline"] || 0, 10) + "\n";
      sheet += renderAttributeBar("Courage", dna.clusterScores["courage"] || 0, 10) + "\n";
      sheet += renderAttributeBar("Compassion", dna.clusterScores["compassion"] || 0, 10) + "\n\n";
      sheet += `### Stats
`;
      sheet += `\u{1F525} **Streak:** ${userData.streaks.current} days (Best: ${userData.streaks.longest})
`;
      sheet += `\u{1F3C5} **Badges:** ${userData.badges.length} earned
`;
      const primaryVirtue = VIRTUES.find((v) => v.id === dna.primary);
      const growthVirtue = VIRTUES.find((v) => v.id === dna.growth);
      sheet += `\u{1F4C8} **Primary Virtue:** ${primaryVirtue?.name || "None"}
`;
      sheet += `\u{1F331} **Growth Area:** ${growthVirtue?.name || "None"}

`;
      if (dna.traits.length > 0) {
        sheet += `### Traits
`;
        for (const trait of dna.traits) {
          sheet += `\u2022 ${trait}
`;
        }
      }
      try {
        await runtime.emitEvent("SEND_DM", {
          entityId: message.entityId,
          content: { text: sheet }
        });
        const publicResponse = `I've sent your character sheet via DM! \u{1F4DC}`;
        if (callback) {
          await callback({
            text: publicResponse,
            actions: ["VIEW_CHARACTER_SHEET"],
            source: message.content.source
          });
        }
        return {
          text: publicResponse,
          success: true,
          data: { sentViaDM: true, dna }
        };
      } catch {
        if (callback) {
          await callback({
            text: sheet,
            actions: ["VIEW_CHARACTER_SHEET"],
            source: message.content.source
          });
        }
        return {
          text: sheet,
          success: true,
          data: { sentViaDM: false, dna }
        };
      }
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "viewCharacterSheet",
        error: error instanceof Error ? error.message : String(error)
      }, "Error viewing character sheet");
      const text = "Sorry, I couldn't generate your character sheet. Please try again.";
      if (callback) {
        await callback({
          text,
          actions: ["VIEW_CHARACTER_SHEET_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Show my character sheet",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "I've sent your character sheet via DM! \u{1F4DC}",
          actions: ["VIEW_CHARACTER_SHEET"]
        }
      }
    ]
  ]
};

// src/actions/shareProgress.ts
init_constants();
var shareProgressAction = {
  name: "SHARE_PROGRESS",
  similes: ["SHARE_VIRTUES", "SHOW_PROGRESS_PUBLIC"],
  description: "Share your virtue progress publicly",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("share") && (text.includes("progress") || text.includes("virtue"));
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      const userData = await virtueService.getUserData(message.entityId);
      const dna = virtueService.calculateDNA(userData);
      let card = `## \u{1F4CA} <@${message.entityId}>'s Virtue Journey

`;
      card += `**Class:** ${dna.archetype} | **Level:** ${Math.floor(Math.sqrt(userData.totalPoints / 100)) + 1}
`;
      card += `\u{1F525} ${userData.streaks.current}-day streak | \u2B50 ${userData.totalPoints} points | \u{1F3C5} ${userData.badges.length} badges

`;
      const virtueCount = {};
      for (const dayCheckIns of Object.values(userData.checkIns)) {
        for (const [virtueId] of Object.entries(dayCheckIns)) {
          virtueCount[virtueId] = (virtueCount[virtueId] || 0) + 1;
        }
      }
      const top3 = Object.entries(virtueCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
      if (top3.length > 0) {
        card += `**Top Virtues:**
`;
        for (const [virtueId, count] of top3) {
          const virtue = VIRTUES.find((v) => v.id === virtueId);
          card += `\u2022 ${virtue?.name}: ${count} practices
`;
        }
      }
      if (callback) {
        await callback({
          text: card,
          actions: ["SHARE_PROGRESS"],
          source: message.content.source
        });
      }
      return {
        text: card,
        success: true,
        data: { userData, dna }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "shareProgress",
        error: error instanceof Error ? error.message : String(error)
      }, "Error sharing progress");
      const text = "Sorry, I couldn't share your progress. Please try again.";
      if (callback) {
        await callback({
          text,
          actions: ["SHARE_PROGRESS_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Share my virtue progress",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u{1F4CA} Your Virtue Journey...",
          actions: ["SHARE_PROGRESS"]
        }
      }
    ]
  ]
};

// src/actions/viewEvents.ts
init_constants();
var viewEventsAction = {
  name: "VIEW_EVENTS",
  similes: ["SHOW_EVENTS", "SEASONAL_EVENTS", "VIRTUE_EVENTS"],
  description: "View active seasonal virtue events",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("event") || text.includes("seasonal") || text.includes("challenge");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const seasonalService = runtime.getService("virtue_seasonal_events");
      if (!seasonalService) {
        throw new Error("Seasonal events service not available");
      }
      const activeEvents = await seasonalService.getActiveEvents();
      if (activeEvents.length === 0) {
        const text = "No active seasonal events right now. Check back soon for new challenges! \u{1F3AF}";
        if (callback) {
          await callback({
            text,
            actions: ["VIEW_EVENTS"],
            source: message.content.source
          });
        }
        return {
          text,
          success: true,
          data: { events: [] }
        };
      }
      let eventsText = "\u{1F389} **Active Seasonal Events** \u{1F389}\n\n";
      for (const event of activeEvents) {
        const virtue = VIRTUES.find((v) => v.id === event.virtueId);
        eventsText += `**${event.name}**
`;
        eventsText += `\u{1F4C5} Until: ${event.endDate}
`;
        eventsText += `\u{1F31F} Featured Virtue: **${virtue?.name}**
`;
        eventsText += `\u26A1 Bonus: ${event.pointMultiplier}x points
`;
        if (event.badge) {
          eventsText += `\u{1F3C5} Exclusive Badge: ${event.badge}
`;
        }
        eventsText += `
`;
      }
      eventsText += `Practice the featured virtues to earn bonus points!`;
      if (callback) {
        await callback({
          text: eventsText,
          actions: ["VIEW_EVENTS"],
          source: message.content.source
        });
      }
      return {
        text: eventsText,
        success: true,
        data: { events: activeEvents }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "viewEvents",
        error: error instanceof Error ? error.message : String(error)
      }, "Error viewing events");
      const text = "Sorry, I couldn't retrieve the seasonal events.";
      if (callback) {
        await callback({
          text,
          actions: ["VIEW_EVENTS_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "What seasonal events are active?",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u{1F389} **Active Seasonal Events**...",
          actions: ["VIEW_EVENTS"]
        }
      }
    ]
  ]
};

// src/actions/viewSynergies.ts
init_constants();
var viewSynergiesAction = {
  name: "VIEW_SYNERGIES",
  similes: ["SHOW_SYNERGIES", "VIRTUE_COMBOS", "SYNERGY_BONUSES"],
  description: "View available virtue synergy combinations",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("synerg") || text.includes("combo") && text.includes("virtue");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const synergyService = runtime.getService("virtue_synergy");
      if (!synergyService) {
        throw new Error("Synergy service not available");
      }
      const synergies = await synergyService.getAllSynergies();
      let text = `## \u{1F517} Virtue Synergy Combinations

`;
      text += `Practice multiple virtues in one day to unlock bonus points!

`;
      for (const synergy of synergies) {
        const virtueNames = synergy.virtues.map(
          (id) => VIRTUES.find((v) => v.id === id)?.name || id
        );
        text += `**${synergy.name}** (+${synergy.bonus} pts)
`;
        text += `${synergy.description}
`;
        text += `Requires: ${virtueNames.join(", ")}

`;
      }
      text += `\u2728 Combine virtues to maximize your points!`;
      if (callback) {
        await callback({
          text,
          actions: ["VIEW_SYNERGIES"],
          source: message.content.source
        });
      }
      return {
        text,
        success: true,
        data: { synergies }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "viewSynergies",
        error: error instanceof Error ? error.message : String(error)
      }, "Error viewing synergies");
      const text = "Sorry, I couldn't retrieve the synergy combinations.";
      if (callback) {
        await callback({
          text,
          actions: ["VIEW_SYNERGIES_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Show virtue synergies",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u{1F517} Virtue Synergy Combinations...",
          actions: ["VIEW_SYNERGIES"]
        }
      }
    ]
  ]
};

// src/actions/viewChallenges.ts
var viewChallengesAction = {
  name: "VIEW_CHALLENGES",
  similes: ["SHOW_CHALLENGES", "VIRTUE_CHALLENGES", "ACTIVE_QUESTS"],
  description: "View active virtue challenges and quests",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("challenge") || text.includes("quest");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const challengeService = runtime.getService("virtue_challenge");
      if (!challengeService) {
        throw new Error("Challenge service not available");
      }
      const challenges = await challengeService.getActiveChallenges();
      if (challenges.length === 0) {
        const text2 = "No active challenges right now. Check back soon! \u{1F3AF}";
        if (callback) {
          await callback({
            text: text2,
            actions: ["VIEW_CHALLENGES"],
            source: message.content.source
          });
        }
        return {
          text: text2,
          success: true,
          data: { challenges: [] }
        };
      }
      let text = `## \u{1F3C6} Active Virtue Challenges

`;
      for (const challenge of challenges) {
        text += `**${challenge.name}**
`;
        text += `${challenge.description}
`;
        text += `\u23F0 Ends: ${challenge.endDate}
`;
        text += `\u{1F381} Reward: ${challenge.rewards.points} points`;
        if (challenge.rewards.badge) {
          text += ` + ${challenge.rewards.badge} badge`;
        }
        text += `
`;
        text += `\u{1F465} ${challenge.participants.length} joined, ${challenge.completions.length} completed

`;
      }
      text += `Type "Join challenge [name]" to participate!`;
      if (callback) {
        await callback({
          text,
          actions: ["VIEW_CHALLENGES"],
          source: message.content.source
        });
      }
      return {
        text,
        success: true,
        data: { challenges }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "viewChallenges",
        error: error instanceof Error ? error.message : String(error)
      }, "Error viewing challenges");
      const text = "Sorry, I couldn't retrieve the challenges.";
      if (callback) {
        await callback({
          text,
          actions: ["VIEW_CHALLENGES_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Show active challenges",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u{1F3C6} Active Virtue Challenges...",
          actions: ["VIEW_CHALLENGES"]
        }
      }
    ]
  ]
};

// src/actions/joinChallenge.ts
import { ModelType as ModelType4 } from "@elizaos/core";
var joinChallengeAction = {
  name: "JOIN_CHALLENGE",
  similes: ["ENTER_CHALLENGE", "ACCEPT_QUEST"],
  description: "Join a virtue challenge or quest",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("join") && text.includes("challenge");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const challengeService = runtime.getService("virtue_challenge");
      if (!challengeService) {
        throw new Error("Challenge service not available");
      }
      const activeChallenges = await challengeService.getActiveChallenges();
      const challengeNames = activeChallenges.map((c) => c.name).join(", ");
      const prompt = `Extract the challenge name from this message: "${message.content.text}"

Available challenges: ${challengeNames}

Return ONLY the exact challenge name, or "none" if not found.`;
      const response = await runtime.useModel(ModelType4.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 50
      });
      const challengeName = response.trim();
      const challenge = activeChallenges.find(
        (c) => c.name.toLowerCase() === challengeName.toLowerCase()
      );
      if (!challenge) {
        const text2 = `Challenge not found. Active challenges: ${challengeNames}`;
        if (callback) {
          await callback({
            text: text2,
            actions: ["JOIN_CHALLENGE"],
            source: message.content.source
          });
        }
        return { text: text2, success: false };
      }
      const joined = await challengeService.joinChallenge(challenge.id, message.entityId);
      const text = joined ? `\u2705 Joined **${challenge.name}**!

${challenge.description}

Good luck! \u{1F3AF}` : `You're already participating in **${challenge.name}**!`;
      if (callback) {
        await callback({
          text,
          actions: ["JOIN_CHALLENGE"],
          source: message.content.source
        });
      }
      return {
        text,
        success: true,
        data: { challengeId: challenge.id, joined }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "joinChallenge",
        error: error instanceof Error ? error.message : String(error)
      }, "Error joining challenge");
      const text = "Sorry, I encountered an error joining the challenge.";
      if (callback) {
        await callback({
          text,
          actions: ["JOIN_CHALLENGE_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Join challenge Week of Wisdom",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 Joined **Week of Wisdom**!",
          actions: ["JOIN_CHALLENGE"]
        }
      }
    ]
  ]
};

// src/actions/becomeMentor.ts
import { ModelType as ModelType5 } from "@elizaos/core";
var becomeMentorAction = {
  name: "BECOME_MENTOR",
  similes: ["MENTOR_USER", "BE_MENTOR"],
  description: "Become a mentor to another user (earn 20% of their points)",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("mentor") && (text.includes("become") || text.includes("be"));
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const mentorshipService = runtime.getService("virtue_mentorship");
      if (!mentorshipService) {
        throw new Error("Mentorship service not available");
      }
      const prompt = `Extract the username or user ID from this message: "${message.content.text}"
      
Return ONLY the username/ID (without @), or "none" if not found.`;
      const response = await runtime.useModel(ModelType5.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 50
      });
      const menteeId = response.trim().replace("@", "");
      if (menteeId === "none" || !menteeId) {
        const text2 = "Please specify who you want to mentor: `Become mentor to @username`";
        if (callback) {
          await callback({
            text: text2,
            actions: ["BECOME_MENTOR"],
            source: message.content.source
          });
        }
        return { text: text2, success: false };
      }
      const pair = await mentorshipService.createMentorship(message.entityId, menteeId);
      const text = `\u2705 You are now mentoring <@${menteeId}>!

\u{1F393} As a mentor, you'll earn **20% of their virtue points** as they practice.

Guide them on their virtue journey and watch your own points grow!`;
      if (callback) {
        await callback({
          text,
          actions: ["BECOME_MENTOR"],
          source: message.content.source
        });
      }
      try {
        await runtime.emitEvent("SEND_DM", {
          entityId: menteeId,
          content: {
            text: `\u{1F393} <@${message.entityId}> is now your virtue mentor! They'll support your practice journey.`
          }
        });
      } catch {
      }
      return {
        text,
        success: true,
        data: { pair }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "becomeMentor",
        error: error instanceof Error ? error.message : String(error)
      }, "Error creating mentorship");
      const text = "Sorry, I encountered an error setting up the mentorship.";
      if (callback) {
        await callback({
          text,
          actions: ["BECOME_MENTOR_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Become mentor to @alice",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 You are now mentoring @alice!",
          actions: ["BECOME_MENTOR"]
        }
      }
    ]
  ]
};

// src/actions/compareHistory.ts
init_constants();
var compareHistoryAction = {
  name: "COMPARE_HISTORY",
  similes: ["COMPARE_FRANKLIN", "HISTORICAL_COMPARISON"],
  description: "Compare your virtue practice to historical figures",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("compare") && (text.includes("franklin") || text.includes("aurelius") || text.includes("historical"));
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      const historicalService = runtime.getService("virtue_historical");
      if (!virtueService || !historicalService) {
        throw new Error("Required services not available");
      }
      const userData = await virtueService.getUserData(message.entityId);
      const text = message.content.text?.toLowerCase() || "";
      let figureId = "franklin";
      if (text.includes("aurelius")) figureId = "aurelius";
      if (text.includes("gandhi")) figureId = "gandhi";
      const comparison = historicalService.compareToFigure(userData, figureId);
      if (!comparison) {
        const text2 = "Figure not found. Available: Franklin, Aurelius, Gandhi";
        if (callback) {
          await callback({
            text: text2,
            actions: ["COMPARE_HISTORY"],
            source: message.content.source
          });
        }
        return { text: text2, success: false };
      }
      let responseText = `## \u{1F4DC} Comparison with ${comparison.figure.name}

`;
      responseText += `${comparison.figure.description}

`;
      responseText += `**Overall Similarity:** ${comparison.similarity}%

`;
      if (comparison.strengths.length > 0) {
        responseText += `**Your Strengths:**
`;
        for (const virtueId of comparison.strengths) {
          const virtue = VIRTUES.find((v) => v.id === virtueId);
          responseText += `\u2705 ${virtue?.name}
`;
        }
        responseText += `
`;
      }
      if (comparison.gaps.length > 0) {
        responseText += `**Growth Opportunities:**
`;
        for (const virtueId of comparison.gaps) {
          const virtue = VIRTUES.find((v) => v.id === virtueId);
          responseText += `\u{1F4C8} ${virtue?.name}
`;
        }
        responseText += `
`;
      }
      responseText += `_${comparison.message}_`;
      if (callback) {
        await callback({
          text: responseText,
          actions: ["COMPARE_HISTORY"],
          source: message.content.source
        });
      }
      return {
        text: responseText,
        success: true,
        data: { comparison }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "compareHistory",
        error: error instanceof Error ? error.message : String(error)
      }, "Error comparing history");
      const text = "Sorry, I couldn't generate the historical comparison.";
      if (callback) {
        await callback({
          text,
          actions: ["COMPARE_HISTORY_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Compare me to Benjamin Franklin",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u{1F4DC} Comparison with Benjamin Franklin...",
          actions: ["COMPARE_HISTORY"]
        }
      }
    ]
  ]
};

// src/actions/getSuggestions.ts
var getSuggestionsAction = {
  name: "GET_SUGGESTIONS",
  similes: ["VIRTUE_SUGGESTIONS", "RECOMMEND_VIRTUES", "WHAT_TO_PRACTICE"],
  description: "Get AI-powered personalized virtue suggestions",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return (text.includes("suggest") || text.includes("recommend") || text.includes("what should")) && (text.includes("virtue") || text.includes("practice"));
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      const remixService = runtime.getService("virtue_remix");
      if (!virtueService || !remixService) {
        throw new Error("Required services not available");
      }
      const userData = await virtueService.getUserData(message.entityId);
      const suggestions = await remixService.generateSuggestions(userData);
      let responseText = `## \u{1F3AF} Personalized Virtue Suggestions

`;
      responseText += `**Focus on these virtues next:**
`;
      for (const virtue of suggestions.focusVirtues) {
        responseText += `\u2022 ${virtue}
`;
      }
      responseText += `
`;
      responseText += `**Why:** ${suggestions.reasoning}

`;
      if (suggestions.practicalTips.length > 0) {
        responseText += `**Practical Tips:**
`;
        for (const tip of suggestions.practicalTips) {
          responseText += `\u{1F4A1} ${tip}
`;
        }
      }
      if (callback) {
        await callback({
          text: responseText,
          actions: ["GET_SUGGESTIONS"],
          source: message.content.source
        });
      }
      return {
        text: responseText,
        success: true,
        data: { suggestions }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "getSuggestions",
        error: error instanceof Error ? error.message : String(error)
      }, "Error getting suggestions");
      const text = "Sorry, I couldn't generate personalized suggestions right now.";
      if (callback) {
        await callback({
          text,
          actions: ["GET_SUGGESTIONS_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "What virtues should I practice next?",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u{1F3AF} Personalized Virtue Suggestions...",
          actions: ["GET_SUGGESTIONS"]
        }
      }
    ]
  ]
};

// src/actions/setPrivacy.ts
init_constants();
var setPrivacyAction = {
  name: "SET_PRIVACY",
  similes: ["PRIVACY_SETTINGS", "OPT_OUT", "PRIVACY"],
  description: "Configure your virtue tracking privacy settings",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("privacy") || text.includes("opt out") || text.includes("opt-out");
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const text = message.content.text?.toLowerCase() || "";
      const privacy = await runtime.getCache(
        CACHE_KEYS.PRIVACY(message.entityId)
      ) || {};
      const optOutObservation = text.includes("opt out") && text.includes("observation");
      const optOutLeaderboard = text.includes("opt out") && text.includes("leaderboard");
      const optOutInsights = text.includes("opt out") && text.includes("insights");
      if (optOutObservation) {
        privacy.optOutObservation = true;
      }
      if (optOutLeaderboard) {
        privacy.optOutLeaderboard = true;
      }
      if (optOutInsights) {
        privacy.optOutCommunityInsights = true;
      }
      await runtime.setCache(CACHE_KEYS.PRIVACY(message.entityId), privacy);
      let responseText = "\u2705 Privacy settings updated:\n";
      if (privacy.optOutObservation) responseText += "\u2022 Opted out of passive observation\n";
      if (privacy.optOutLeaderboard) responseText += "\u2022 Opted out of leaderboard\n";
      if (privacy.optOutCommunityInsights) responseText += "\u2022 Opted out of community insights\n";
      if (callback) {
        await callback({
          text: responseText,
          actions: ["SET_PRIVACY"],
          source: message.content.source
        });
      }
      return {
        text: responseText,
        success: true,
        data: { privacy }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "setPrivacy",
        error: error instanceof Error ? error.message : String(error)
      }, "Error setting privacy");
      const text = "Sorry, I encountered an error updating your privacy settings.";
      if (callback) {
        await callback({
          text,
          actions: ["SET_PRIVACY_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Opt out of virtue observation",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 Privacy settings updated",
          actions: ["SET_PRIVACY"]
        }
      }
    ]
  ]
};

// src/actions/deleteMyData.ts
init_constants();
var deleteMyDataAction = {
  name: "DELETE_MY_DATA",
  similes: ["DELETE_VIRTUE_DATA", "REMOVE_DATA", "FORGET_ME"],
  description: "Delete all your virtue tracking data (GDPR compliance)",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return (text.includes("delete") || text.includes("remove")) && (text.includes("data") || text.includes("virtue"));
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      await runtime.deleteCache(CACHE_KEYS.USER_DATA(message.entityId));
      await runtime.deleteCache(CACHE_KEYS.PRIVACY(message.entityId));
      await runtime.deleteCache(CACHE_KEYS.COOLDOWN(message.entityId));
      const text = "\u2705 All your virtue data has been deleted. Your progress, badges, and settings have been removed.";
      if (callback) {
        await callback({
          text,
          actions: ["DELETE_MY_DATA"],
          source: message.content.source
        });
      }
      return {
        text,
        success: true,
        data: { deleted: true }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "deleteMyData",
        error: error instanceof Error ? error.message : String(error)
      }, "Error deleting user data");
      const text = "Sorry, I encountered an error deleting your data. Please try again.";
      if (callback) {
        await callback({
          text,
          actions: ["DELETE_MY_DATA_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Delete my virtue data",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 All your virtue data has been deleted.",
          actions: ["DELETE_MY_DATA"]
        }
      }
    ]
  ]
};

// src/actions/exportData.ts
var exportDataAction = {
  name: "EXPORT_DATA",
  similes: ["EXPORT_VIRTUE_DATA", "DOWNLOAD_DATA", "GET_DATA"],
  description: "Export your virtue tracking data as JSON",
  validate: async (_runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("export") && (text.includes("data") || text.includes("virtue"));
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      const userData = await virtueService.getUserData(message.entityId);
      const dna = virtueService.calculateDNA(userData);
      const exportData = {
        exported: (/* @__PURE__ */ new Date()).toISOString(),
        userData,
        dnaProfile: dna,
        version: 1
      };
      const jsonData = JSON.stringify(exportData, null, 2);
      try {
        await runtime.emitEvent("SEND_DM", {
          entityId: message.entityId,
          content: {
            text: `Here's your virtue data export:
\`\`\`json
${jsonData.slice(0, 1500)}${jsonData.length > 1500 ? "...\n(truncated)" : ""}
\`\`\``
          }
        });
        const publicResponse = "\u2705 I've sent your data export via DM!";
        if (callback) {
          await callback({
            text: publicResponse,
            actions: ["EXPORT_DATA"],
            source: message.content.source
          });
        }
        return {
          text: publicResponse,
          success: true,
          data: { exportData, sentViaDM: true }
        };
      } catch {
        const text = "\u2705 Data export prepared. Contact an admin to retrieve it.";
        if (callback) {
          await callback({
            text,
            actions: ["EXPORT_DATA"],
            source: message.content.source
          });
        }
        return {
          text,
          success: true,
          data: { exportData, sentViaDM: false }
        };
      }
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "exportData",
        error: error instanceof Error ? error.message : String(error)
      }, "Error exporting data");
      const text = "Sorry, I encountered an error exporting your data.";
      if (callback) {
        await callback({
          text,
          actions: ["EXPORT_DATA_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Export my virtue data",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 I've sent your data export via DM!",
          actions: ["EXPORT_DATA"]
        }
      }
    ]
  ]
};

// src/actions/admin/resetStreak.ts
import { ModelType as ModelType6 } from "@elizaos/core";
var resetStreakAction = {
  name: "ADMIN_RESET_STREAK",
  similes: ["RESET_USER_STREAK", "CLEAR_STREAK"],
  description: "Admin: Reset a user's virtue streak",
  validate: async (runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    if (!text.includes("reset") || !text.includes("streak")) return false;
    try {
      const role = await runtime.getUserServerRole(message.entityId);
      return role === "ADMIN" || role === "MODERATOR";
    } catch {
      return false;
    }
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      const prompt = `Extract the user ID or mention from this admin command: "${message.content.text}"
      
Return ONLY the user ID (without @ symbol), or "none" if not found.`;
      const response = await runtime.useModel(ModelType6.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 50
      });
      const targetEntityId = response.trim().replace("@", "");
      if (targetEntityId === "none" || !targetEntityId) {
        const text2 = "Please specify a user: `reset streak for @username`";
        if (callback) {
          await callback({
            text: text2,
            actions: ["ADMIN_RESET_STREAK"],
            source: message.content.source
          });
        }
        return { text: text2, success: false };
      }
      const userData = await virtueService.getUserData(targetEntityId);
      userData.streaks = { current: 0, longest: userData.streaks.longest, lastDate: null };
      await virtueService.saveUserData(targetEntityId, userData);
      const text = `\u2705 Reset streak for <@${targetEntityId}>. Longest streak (${userData.streaks.longest}) preserved.`;
      if (callback) {
        await callback({
          text,
          actions: ["ADMIN_RESET_STREAK"],
          source: message.content.source
        });
      }
      return {
        text,
        success: true,
        data: { targetEntityId, resetStreak: true }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "adminResetStreak",
        error: error instanceof Error ? error.message : String(error)
      }, "Error resetting streak");
      const text = "Sorry, I encountered an error resetting the streak.";
      if (callback) {
        await callback({
          text,
          actions: ["ADMIN_RESET_STREAK_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Reset streak for @alice",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 Reset streak for @alice",
          actions: ["ADMIN_RESET_STREAK"]
        }
      }
    ]
  ]
};

// src/actions/admin/awardBadge.ts
init_constants();
import { ModelType as ModelType7 } from "@elizaos/core";
var awardBadgeAction = {
  name: "ADMIN_AWARD_BADGE",
  similes: ["GIVE_BADGE", "GRANT_BADGE"],
  description: "Admin: Manually award a badge to a user",
  validate: async (runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    if (!text.includes("award") && !text.includes("give")) return false;
    if (!text.includes("badge")) return false;
    try {
      const role = await runtime.getUserServerRole(message.entityId);
      return role === "ADMIN" || role === "MODERATOR";
    } catch {
      return false;
    }
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        throw new Error("Virtue service not available");
      }
      const prompt = `Extract the user ID and badge name from this admin command: "${message.content.text}"

Available badges: ${BADGES.map((b) => b.id).join(", ")}

Return in format: userID|badgeId
Example: alice123|week_warrior

Or return "none" if unclear.`;
      const response = await runtime.useModel(ModelType7.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 100
      });
      const parts = response.trim().split("|");
      if (parts.length !== 2 || parts[0] === "none") {
        const text2 = `Please specify user and badge: \`award badge week_warrior to @username\`

Available badges: ${BADGES.map((b) => b.name).join(", ")}`;
        if (callback) {
          await callback({
            text: text2,
            actions: ["ADMIN_AWARD_BADGE"],
            source: message.content.source
          });
        }
        return { text: text2, success: false };
      }
      const [targetEntityId, badgeId] = parts;
      const badge = BADGES.find((b) => b.id === badgeId);
      if (!badge) {
        const text2 = `Unknown badge: ${badgeId}. Available: ${BADGES.map((b) => b.id).join(", ")}`;
        if (callback) {
          await callback({
            text: text2,
            actions: ["ADMIN_AWARD_BADGE"],
            source: message.content.source
          });
        }
        return { text: text2, success: false };
      }
      const userData = await virtueService.getUserData(targetEntityId);
      if (!userData.badges.includes(badge.id)) {
        userData.badges.push(badge.id);
        await virtueService.saveUserData(targetEntityId, userData);
      }
      const text = `\u2705 Awarded **${badge.name}** badge to <@${targetEntityId}>!`;
      if (callback) {
        await callback({
          text,
          actions: ["ADMIN_AWARD_BADGE"],
          source: message.content.source
        });
      }
      return {
        text,
        success: true,
        data: { targetEntityId, badgeId }
      };
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "adminAwardBadge",
        error: error instanceof Error ? error.message : String(error)
      }, "Error awarding badge");
      const text = "Sorry, I encountered an error awarding the badge.";
      if (callback) {
        await callback({
          text,
          actions: ["ADMIN_AWARD_BADGE_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Award badge week_warrior to @alice",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 Awarded **Week Warrior** badge to @alice!",
          actions: ["ADMIN_AWARD_BADGE"]
        }
      }
    ]
  ]
};

// src/actions/admin/auditRules.ts
init_constants();
var auditRulesAction = {
  name: "ADMIN_AUDIT_RULES",
  similes: ["VIEW_RULE_CHANGES", "RULE_HISTORY"],
  description: "Admin: View rule refinement changelog",
  validate: async (runtime, message, _state) => {
    const text = message.content.text?.toLowerCase() || "";
    if (!text.includes("audit") && !text.includes("rule")) return false;
    try {
      const role = await runtime.getUserServerRole(message.entityId);
      return role === "ADMIN" || role === "MODERATOR";
    } catch {
      return false;
    }
  },
  handler: async (runtime, message, _state, _options, callback) => {
    try {
      const changelog = await runtime.getCache(
        CACHE_KEYS.RULES_CHANGELOG(runtime.agentId)
      ) || [];
      if (changelog.length === 0) {
        const text = "No rule changes yet. The refinement task will update rules automatically.";
        if (callback) {
          await callback({
            text,
            actions: ["ADMIN_AUDIT_RULES"],
            source: message.content.source
          });
        }
        return { text, success: true, data: { changelog: [] } };
      }
      let report = `## \u{1F50D} Rule Refinement Changelog

`;
      for (const entry of changelog.slice(0, 10)) {
        const date = new Date(entry.timestamp).toLocaleDateString();
        report += `**${date}**
`;
        for (const change of entry.changes) {
          report += `- ${change.virtueId}: ${change.action} \u2192 "${change.newValue}"
`;
          report += `  _${change.reasoning}_
`;
        }
        report += "\n";
      }
      try {
        await runtime.emitEvent("SEND_DM", {
          entityId: message.entityId,
          content: { text: report }
        });
        const publicResponse = "\u2705 I've sent the rule audit log via DM!";
        if (callback) {
          await callback({
            text: publicResponse,
            actions: ["ADMIN_AUDIT_RULES"],
            source: message.content.source
          });
        }
        return {
          text: publicResponse,
          success: true,
          data: { changelog, sentViaDM: true }
        };
      } catch {
        const text = `\u{1F4CA} Rule changes: ${changelog.length} entries in changelog`;
        if (callback) {
          await callback({
            text,
            actions: ["ADMIN_AUDIT_RULES"],
            source: message.content.source
          });
        }
        return {
          text,
          success: true,
          data: { changelog, sentViaDM: false }
        };
      }
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        action: "adminAuditRules",
        error: error instanceof Error ? error.message : String(error)
      }, "Error auditing rules");
      const text = "Sorry, I encountered an error retrieving the rule audit log.";
      if (callback) {
        await callback({
          text,
          actions: ["ADMIN_AUDIT_RULES_ERROR"],
          source: message.content.source
        });
      }
      return {
        text,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  examples: [
    [
      {
        name: "{{userName}}",
        content: {
          text: "Audit virtue rules",
          actions: []
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "\u2705 I've sent the rule audit log via DM!",
          actions: ["ADMIN_AUDIT_RULES"]
        }
      }
    ]
  ]
};

// src/evaluators/virtueObserver.ts
init_constants();

// src/utils/platform.ts
function hasMention(text) {
  if (!text) return false;
  return /@\w+/.test(text);
}

// src/evaluators/virtueObserver.ts
var virtueObserverEvaluator = {
  name: "VIRTUE_OBSERVER",
  description: "Observes messages for virtuous behavior using rule-based detection",
  /**
   * Why alwaysRun: true?
   * - Must run on EVERY message (not just when agent replies)
   * - Passive observation requires constant monitoring
   * - Alternative (only on agent responses) would miss most virtuous behavior
   */
  alwaysRun: true,
  examples: [],
  // No examples needed - this is always-run passive detection
  validate: async () => true,
  // Always validate - runs on all messages
  handler: async (runtime, message, _state) => {
    try {
      if (message.entityId === runtime.agentId) return;
      if (!message.content.text) return;
      const privacy = await runtime.getCache(
        CACHE_KEYS.PRIVACY(message.entityId)
      );
      if (privacy?.optOutObservation) return;
      const cooldown = await runtime.getCache(
        CACHE_KEYS.COOLDOWN(message.entityId)
      );
      if (cooldown && Date.now() - cooldown < COOLDOWN_PERIOD_MS) return;
      const rules = await runtime.getCache(
        CACHE_KEYS.RULES(runtime.agentId)
      ) || INITIAL_DETECTION_RULES;
      const context = {
        text: message.content.text.toLowerCase(),
        isReply: !!message.content.inReplyTo,
        mentionsOther: hasMention(message.content.text)
      };
      for (const rule of rules) {
        const match = checkRule(rule, context);
        if (match && match.confidence >= rule.confidence) {
          const virtueService = runtime.getService("virtue");
          if (!virtueService) continue;
          const result = await virtueService.recordCheckIn(
            message.entityId,
            rule.virtueId,
            "observed"
          );
          if (result.isDuplicate) continue;
          await runtime.setCache(
            CACHE_KEYS.COOLDOWN(message.entityId),
            Date.now()
          );
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
          await sendPublicRecognition(runtime, message, rule.virtueId);
          break;
        }
      }
    } catch (error) {
      await logError(
        runtime,
        "virtueObserver",
        error,
        message.entityId
      );
    }
  }
};
function checkRule(rule, context) {
  const text = context.text;
  for (const exclude of rule.excludePatterns) {
    if (text.includes(exclude.toLowerCase())) {
      return null;
    }
  }
  for (const clue of rule.contextClues) {
    if (clue === "isReply" && !context.isReply) return null;
    if (clue === "mentionsOther" && !context.mentionsOther) return null;
  }
  let matchCount = 0;
  for (const keyword of rule.keywords) {
    if (text.includes(keyword.toLowerCase())) {
      matchCount++;
    }
  }
  if (matchCount === 0) return null;
  const confidence = Math.min(
    rule.confidence * (1 + 0.1 * (matchCount - 1)),
    0.95
    // Never fully certain
  );
  return { confidence };
}
async function sendPublicRecognition(runtime, message, virtueId) {
  try {
    const { VIRTUES: VIRTUES2 } = await Promise.resolve().then(() => (init_constants(), constants_exports));
    const virtue = VIRTUES2.find((v) => v.id === virtueId);
    if (!virtue) return;
    const text = `\u2728 <@${message.entityId}> demonstrated **${virtue.name}** \u2014 nice work!`;
    await runtime.emitEvent("SEND_MESSAGE", {
      roomId: message.roomId,
      content: { text }
    });
  } catch (error) {
    runtime.logger.debug({
      src: "plugin:virtue",
      action: "sendPublicRecognition",
      error: error instanceof Error ? error.message : String(error)
    }, "Failed to send public recognition");
  }
}

// src/tasks/ruleRefinementWorker.ts
init_constants();
import { ModelType as ModelType8 } from "@elizaos/core";
var ruleRefinementWorker = {
  name: "VIRTUE_RULE_REFINEMENT",
  execute: async (runtime, options, task) => {
    try {
      runtime.logger.info({
        src: "plugin:virtue",
        task: "ruleRefinement",
        agentId: runtime.agentId
      }, "Starting rule refinement task");
      const rules = await runtime.getCache(
        CACHE_KEYS.RULES(runtime.agentId)
      );
      if (!rules || rules.length === 0) {
        runtime.logger.debug({ src: "plugin:virtue" }, "No rules to refine");
        return;
      }
      const prompt = buildRefinementPrompt(rules);
      const response = await runtime.useModel(ModelType8.TEXT_LARGE, {
        prompt,
        temperature: 0.3,
        maxTokens: 2e3
      });
      const proposals = parseRuleProposals(response);
      const validProposals = validateProposals(proposals, rules);
      if (validProposals.length === 0) {
        runtime.logger.debug({ src: "plugin:virtue" }, "No valid proposals from refinement");
        return;
      }
      const updatedRules = applyProposals(rules, validProposals);
      await runtime.setCache(CACHE_KEYS.RULES(runtime.agentId), updatedRules);
      await appendChangelog(runtime, task.id || "unknown", validProposals);
      runtime.logger.info({
        src: "plugin:virtue",
        proposalCount: validProposals.length
      }, "Rule refinement completed");
    } catch (error) {
      await logError(runtime, "ruleRefinement", error);
    }
  }
};
function buildRefinementPrompt(rules) {
  let prompt = `You are reviewing virtue detection rules for a community bot.

## Current Rules
`;
  for (const rule of rules) {
    prompt += `
### ${rule.virtueId}
- Keywords: ${rule.keywords.join(", ")}
- Exclude: ${rule.excludePatterns.join(", ")}
- Confidence: ${rule.confidence}
`;
  }
  prompt += `
## Your Task
Analyze the rules and suggest improvements. You may ONLY:
1. Add/remove keywords (simple phrases, no regex)
2. Add/remove exclude patterns (simple phrases)
3. Adjust confidence scores (between 0.3 and 0.9)

You may NOT:
- Add regex patterns
- Create new virtues
- Change virtue IDs or names

## Response Format (JSON ONLY)
Return a JSON object with this exact structure:
{
  "proposals": [
    {
      "virtueId": "humility",
      "action": "add_keyword",
      "value": "my fault",
      "reasoning": "Common in apologies"
    }
  ]
}

Return ONLY the JSON object, no other text.`;
  return prompt;
}
function parseRuleProposals(response) {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.proposals || [];
  } catch {
    return [];
  }
}
function validateProposals(proposals, currentRules) {
  return proposals.filter((p) => {
    if (!currentRules.find((r) => r.virtueId === p.virtueId)) return false;
    if (!isValidRuleProposal(p.action, p.value)) return false;
    return true;
  });
}
function applyProposals(rules, proposals) {
  const updatedRules = JSON.parse(JSON.stringify(rules));
  for (const proposal of proposals) {
    const rule = updatedRules.find((r) => r.virtueId === proposal.virtueId);
    if (!rule) continue;
    switch (proposal.action) {
      case "add_keyword":
        if (!rule.keywords.includes(String(proposal.value))) {
          rule.keywords.push(String(proposal.value));
        }
        break;
      case "remove_keyword":
        rule.keywords = rule.keywords.filter((k) => k !== proposal.value);
        break;
      case "add_exclude":
        if (!rule.excludePatterns.includes(String(proposal.value))) {
          rule.excludePatterns.push(String(proposal.value));
        }
        break;
      case "remove_exclude":
        rule.excludePatterns = rule.excludePatterns.filter((p) => p !== proposal.value);
        break;
      case "adjust_confidence":
        rule.confidence = Number(proposal.value);
        break;
    }
  }
  return updatedRules;
}
async function appendChangelog(runtime, taskId, proposals) {
  try {
    const changelog = await runtime.getCache(
      CACHE_KEYS.RULES_CHANGELOG(runtime.agentId)
    ) || [];
    changelog.unshift({
      timestamp: Date.now(),
      taskId,
      changes: proposals.map((p) => ({
        virtueId: p.virtueId,
        action: p.action,
        oldValue: null,
        newValue: p.value,
        reasoning: p.reasoning
      }))
    });
    if (changelog.length > CHANGELOG_MAX_ENTRIES) {
      changelog.length = CHANGELOG_MAX_ENTRIES;
    }
    await runtime.setCache(
      CACHE_KEYS.RULES_CHANGELOG(runtime.agentId),
      changelog
    );
  } catch (error) {
    runtime.logger.error({
      src: "plugin:virtue",
      context: "appendChangelog",
      error: error instanceof Error ? error.message : String(error)
    }, "Failed to append changelog");
  }
}

// src/tasks/communityReportWorker.ts
init_constants();
var communityReportWorker = {
  name: "VIRTUE_COMMUNITY_REPORT",
  execute: async (runtime, options, task) => {
    try {
      runtime.logger.info({
        src: "plugin:virtue",
        task: "communityReport",
        agentId: runtime.agentId
      }, "Starting community report generation");
      const worldId = options.worldId;
      if (!worldId) {
        runtime.logger.warn({ src: "plugin:virtue" }, "No worldId provided for community report");
        return;
      }
      const now = /* @__PURE__ */ new Date();
      const weekId = getWeekId(now);
      const leaderboard = await runtime.getCache(`virtue:leaderboard:${worldId}`);
      if (!leaderboard || !leaderboard.entries) {
        runtime.logger.debug({ src: "plugin:virtue" }, "No leaderboard data for community report");
        return;
      }
      const virtueCount = {};
      const hourCounts = {};
      let totalCheckIns = 0;
      let activeUsers = 0;
      for (const entry of leaderboard.entries) {
        try {
          const userData = await runtime.getCache(
            CACHE_KEYS.USER_DATA(entry.entityId)
          );
          if (!userData) continue;
          activeUsers++;
          const lastWeekDates = getLast7Days();
          for (const date of lastWeekDates) {
            const dayCheckIns = userData.checkIns[date];
            if (!dayCheckIns) continue;
            for (const [virtueId, checkIn] of Object.entries(dayCheckIns)) {
              virtueCount[virtueId] = (virtueCount[virtueId] || 0) + 1;
              totalCheckIns++;
              const hour = new Date(checkIn.timestamp).getHours();
              hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            }
          }
        } catch (error) {
          continue;
        }
      }
      const weeklyTrends = {};
      for (const virtue of VIRTUES) {
        const count = virtueCount[virtue.id] || 0;
        const percentPracticed = activeUsers > 0 ? count / activeUsers * 100 : 0;
        weeklyTrends[virtue.id] = {
          percentPracticed: Math.round(percentPracticed),
          changeFromLastWeek: 0,
          // TODO: Compare to previous week
          totalCheckIns: count
        };
      }
      const peakPracticeTimes = Object.entries(hourCounts).map(([hour, count]) => ({ hour: parseInt(hour), count })).sort((a, b) => b.count - a.count).slice(0, 3);
      const mostPracticed = Object.entries(virtueCount).sort((a, b) => b[1] - a[1])[0];
      const insights = {
        weekId,
        weeklyTrends,
        peakPracticeTimes,
        mostImprovedVirtue: mostPracticed?.[0] || "humility",
        participantCount: activeUsers
      };
      await runtime.setCache(
        CACHE_KEYS.INSIGHTS(worldId, weekId),
        insights
      );
      const mostPracticedVirtue = VIRTUES.find((v) => v.id === mostPracticed?.[0]);
      let report = `\u{1F4CA} **Weekly Community Virtue Report** \u{1F4CA}

`;
      report += `\u{1F465} Active practitioners: ${activeUsers}
`;
      report += `\u2705 Total check-ins: ${totalCheckIns}
`;
      report += `\u{1F31F} Most practiced: **${mostPracticedVirtue?.name}** (${mostPracticed?.[1]} times)

`;
      if (peakPracticeTimes.length > 0) {
        report += `\u23F0 Peak practice times:
`;
        for (const peak of peakPracticeTimes) {
          const time = formatHour(peak.hour);
          report += `- ${time}: ${peak.count} check-ins
`;
        }
      }
      report += `
Keep up the great work, everyone! \u{1F3AF}`;
      runtime.logger.info({
        src: "plugin:virtue",
        worldId,
        activeUsers,
        totalCheckIns
      }, "Community report generated");
    } catch (error) {
      await logError(runtime, "communityReport", error);
    }
  }
};
function getWeekId(date) {
  const year = date.getFullYear();
  const weekNum = getWeekNumber(date);
  return `${year}-W${weekNum.toString().padStart(2, "0")}`;
}
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
}
function getLast7Days() {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}
function formatHour(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
}

// src/tasks/dailyReminderWorker.ts
var dailyReminderWorker = {
  name: "VIRTUE_DAILY_REMINDER",
  execute: async (runtime, options, task) => {
    try {
      runtime.logger.info({
        src: "plugin:virtue",
        task: "dailyReminder",
        agentId: runtime.agentId
      }, "Starting daily reminder task");
      const notificationService = runtime.getService("virtue_notification");
      const virtueService = runtime.getService("virtue");
      if (!notificationService || !virtueService) {
        runtime.logger.warn({ src: "plugin:virtue" }, "Required services not available");
        return;
      }
      const entityId = options.entityId;
      if (entityId) {
        await notificationService.sendDailyReminder(entityId);
      }
      runtime.logger.info({
        src: "plugin:virtue",
        entityId
      }, "Daily reminder sent");
    } catch (error) {
      await logError(runtime, "dailyReminder", error);
    }
  }
};

// src/providers/virtueProvider.ts
var virtueProvider = {
  name: "VIRTUE_CONTEXT",
  description: "Provides virtue tracking context for the agent",
  dynamic: true,
  get: async (runtime, message, _state) => {
    try {
      const virtueService = runtime.getService("virtue");
      if (!virtueService) {
        return { text: "", values: {} };
      }
      const userData = await virtueService.getUserData(message.entityId);
      const summary = `[VIRTUE CONTEXT]
User: ${message.entityId}
Current Streak: ${userData.streaks.current} days
Total Points: ${userData.totalPoints}
Badges: ${userData.badges.length}
[/VIRTUE CONTEXT]`;
      return {
        text: summary,
        values: {
          virtueStreak: userData.streaks.current,
          virtuePoints: userData.totalPoints,
          virtueBadges: userData.badges.length,
          virtueTimezone: userData.timezone
        }
      };
    } catch {
      return { text: "", values: {} };
    }
  }
};

// src/banner.ts
var ANSI = {
  reset: "\x1B[0m",
  bold: "\x1B[1m",
  dim: "\x1B[2m",
  magenta: "\x1B[35m",
  brightRed: "\x1B[91m",
  brightGreen: "\x1B[92m",
  brightYellow: "\x1B[93m",
  brightBlue: "\x1B[94m",
  brightMagenta: "\x1B[95m",
  brightCyan: "\x1B[96m",
  brightWhite: "\x1B[97m"
};
function line(content) {
  const len = content.replace(/\x1b\[[0-9;]*m/g, "").length;
  if (len > 78) return content.slice(0, 78);
  return content + " ".repeat(78 - len);
}
function printBanner(options) {
  const { runtime } = options;
  const R = ANSI.reset, D = ANSI.dim, B = ANSI.bold;
  const c1 = ANSI.magenta, G = ANSI.brightGreen, Y = ANSI.brightYellow, M = ANSI.brightMagenta;
  const C = ANSI.brightCyan, W = ANSI.brightWhite;
  const top = `${c1}\u2554${"\u2550".repeat(78)}\u2557${R}`;
  const mid = `${c1}\u2560${"\u2550".repeat(78)}\u2563${R}`;
  const bot = `${c1}\u255A${"\u2550".repeat(78)}\u255D${R}`;
  const row = (s) => `${c1}\u2551${R}${line(s)}${c1}\u2551${R}`;
  const lines = [""];
  lines.push(top);
  lines.push(row(` ${B}Character: ${runtime.character.name}${R}`));
  lines.push(mid);
  lines.push(row(`${Y}  \u2554\u2550\u2550\u2550\u2557     \u2554\u2550\u2550\u2550\u2557     \u2554\u2550\u2550\u2550\u2557     \u2554\u2550\u2550\u2550\u2557     \u2554\u2550\u2550\u2550\u2557     \u2554\u2550\u2550\u2550\u2557${R}`));
  lines.push(row(`${Y}  \u2551 ${W}V${Y} \u2551     \u2551 ${W}I${Y} \u2551     \u2551 ${W}R${Y} \u2551     \u2551 ${W}T${Y} \u2551     \u2551 ${W}U${Y} \u2551     \u2551 ${W}E${Y} \u2551${R}`));
  lines.push(row(`${Y}  \u255A\u2550\u2550\u2550\u255D     \u255A\u2550\u2550\u2550\u255D     \u255A\u2550\u2550\u2550\u255D     \u255A\u2550\u2550\u2550\u255D     \u255A\u2550\u2550\u2550\u255D     \u255A\u2550\u2550\u2550\u255D${R}`));
  lines.push(row(`${D}          Benjamin Franklin's Virtue Tracker${R}`));
  lines.push(mid);
  lines.push(row(`${M} This plugin implements Franklin's 13 virtues with modern gamification:${R}`));
  lines.push(row(``));
  lines.push(row(`   ${C}\u{1F4C5}${R} Daily Virtue Check-ins    ${C}\u{1F3C6}${R} Streaks & Leaderboards`));
  lines.push(row(`   ${C}\u{1F3AF}${R} Virtue Challenges         ${C}\u{1F91D}${R} Mentorship System`));
  lines.push(row(`   ${C}\u2B50${R} Badges & Achievements     ${C}\u{1F4C8}${R} Progress Tracking`));
  lines.push(row(`   ${C}\u{1F3AE}${R} Seasonal Events           ${C}\u{1F504}${R} Self-Improving AI Rules`));
  lines.push(row(`   ${C}\u{1F512}${R} GDPR Privacy Controls    ${C}\u{1F4CA}${R} Historical Comparisons`));
  lines.push(row(``));
  lines.push(row(`   ${G}\u2713${R} ${D}No configuration required \u2014 virtues run automatically!${R}`));
  lines.push(bot);
  lines.push("");
  console.log(lines.join("\n"));
}

// src/plugin.ts
init_constants();
async function ensureRepeatingTask(runtime, taskName, options) {
  try {
    const existingTasks = await runtime.getTasksByName(taskName);
    if (existingTasks.length === 0) {
      await runtime.createTask({
        name: taskName,
        description: options.description,
        tags: ["queue", "repeat"],
        // 'repeat' tag tells TaskService to reschedule
        metadata: {
          updatedAt: Date.now(),
          updateInterval: options.updateInterval
        }
      });
      runtime.logger.info({ src: "plugin:virtue", taskName }, "Created repeating virtue task");
    }
  } catch (error) {
    runtime.logger.warn({
      src: "plugin:virtue",
      taskName,
      error: error instanceof Error ? error.message : String(error)
    }, "Could not create repeating task (will retry on next init)");
  }
}
var virtuePlugin = {
  name: "@elizaos/plugin-virtue",
  description: "Benjamin Franklin's Virtue Tracker - gamified self-improvement plugin",
  /**
   * Why depend on bootstrap:
   * - We need TaskService for periodic tasks (rule refinement, community reports)
   * - Bootstrap provides the task scheduling infrastructure
   * - Alternative would be setInterval, but TaskService persists across restarts
   */
  dependencies: ["@elizaos/plugin-bootstrap"],
  async init(_config, runtime) {
    try {
      printBanner({
        pluginName: "@elizaos/plugin-virtue",
        description: "Benjamin Franklin's Virtue Tracker - gamified self-improvement plugin",
        runtime
      });
      runtime.logger.info({ src: "plugin:virtue", agentId: runtime.agentId }, "Initializing virtue plugin");
      runtime.registerTaskWorker(ruleRefinementWorker);
      runtime.registerTaskWorker(communityReportWorker);
      runtime.registerTaskWorker(dailyReminderWorker);
      const existingRules = await runtime.getCache(CACHE_KEYS.RULES(runtime.agentId));
      if (!existingRules) {
        await runtime.setCache(CACHE_KEYS.RULES(runtime.agentId), INITIAL_DETECTION_RULES);
        runtime.logger.debug({ src: "plugin:virtue" }, "Initialized detection rules");
      }
      runtime.initPromise.then(async () => {
        try {
          await ensureRepeatingTask(runtime, "VIRTUE_RULE_REFINEMENT", {
            updateInterval: 24 * 60 * 60 * 1e3,
            // 24 hours
            description: "Refine virtue detection rules via LLM"
          });
          await ensureRepeatingTask(runtime, "VIRTUE_COMMUNITY_REPORT", {
            updateInterval: 7 * 24 * 60 * 60 * 1e3,
            // 7 days
            description: "Generate weekly community virtue insights"
          });
        } catch (error) {
          runtime.logger.warn({
            src: "plugin:virtue",
            error: error instanceof Error ? error.message : String(error)
          }, "Failed to create repeating tasks (non-fatal)");
        }
      });
      runtime.logger.info({ src: "plugin:virtue", agentId: runtime.agentId }, "Virtue plugin initialized successfully");
    } catch (error) {
      runtime.logger.error({
        src: "plugin:virtue",
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error)
      }, "Failed to initialize virtue plugin");
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
export {
  ARCHETYPES,
  BADGES,
  CACHE_KEYS,
  CHANGELOG_MAX_ENTRIES,
  COOLDOWN_PERIOD_MS,
  ERROR_LOG_MAX_ENTRIES,
  INITIAL_DETECTION_RULES,
  LEADERBOARD_MAX_ENTRIES,
  PLATFORM_BADGES,
  POINTS,
  VIRTUES,
  VIRTUE_CLUSTERS,
  VirtueService,
  virtuePlugin as default,
  virtuePlugin
};
//# sourceMappingURL=index.js.map
