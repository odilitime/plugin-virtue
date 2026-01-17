# Plugin Virtue – Architecture & Design Decisions

This document explains **WHY** things are built the way they are.

---

## Table of Contents

1. [Core Design Philosophy](#core-design-philosophy)
2. [Data Architecture](#data-architecture)
3. [Detection System](#detection-system)
4. [Gamification Balance](#gamification-balance)
5. [Anti-Gaming Measures](#anti-gaming-measures)
6. [Privacy & GDPR](#privacy--gdpr)
7. [Scalability](#scalability)
8. [Code Organization](#code-organization)

---

## Core Design Philosophy

### Why Hybrid Rule-Based + LLM?

**Problem:** Need to detect virtuous behavior in every chat message.

| Approach | Cost | Latency | Accuracy |
|----------|------|---------|----------|
| LLM per message | $1-10/day/server | 200-500ms | 95%+ |
| Pure rules | $0 | <1ms | 80% |
| **Hybrid** | ~$0.10/day | <1ms | 90%+ improving |

**Solution:**
- Rule-based detection on every message (fast, cheap)
- Daily LLM task refines rules based on outcomes (self-improving)

**Files:**
- `evaluators/virtueObserver.ts` – Rule-based detection
- `tasks/ruleRefinementWorker.ts` – Daily LLM refinement

### Why Bootstrap Dependency?

The plugin depends on `@elizaos/plugin-bootstrap` for `TaskService`:

- Provides infrastructure for repeating tasks
- Handles task scheduling and execution
- Avoids reinventing task management

**Initialization order:**
1. Register task workers (names must exist before tasks reference them)
2. Initialize detection rules (if not exist)
3. Create repeating tasks (rule refinement: 24h, community report: 7d)

---

## Data Architecture

### Why Cache-Based Storage?

**Decision:** Use `runtime.getCache/setCache` instead of database tables.

| Factor | Cache | Database |
|--------|-------|----------|
| Complexity | Simple | Schema migrations |
| Speed | In-memory | Network latency |
| Scale limit | ~1000 users | Millions |
| Queries | Key-value only | SQL joins |

**When to migrate:** >5000 users, complex analytics needed, memory >10GB.

### Cache Key Schema

```
virtue:user:v1:${entityId}        # User data (versioned for migration)
virtue:leaderboard:${worldId}     # Per-world rankings
virtue:rules:${agentId}           # Detection rules (per-agent learning)
virtue:cooldown:${entityId}       # Observation cooldowns
virtue:privacy:${entityId}        # Privacy settings
virtue:mentorship:${worldId}      # Mentor-mentee pairs
virtue:challenges:${worldId}      # Active challenges
```

**Why versioned keys (`:v1:`)?**
- Enables schema migrations without breaking existing users
- Change structure in v2, read v1 and migrate on-demand

**Why per-world leaderboards?**
- Each Discord server is a separate community
- Prevents one mega-community from dominating

**Why per-agent rules?**
- Each agent learns from its own community
- Rules adapt to communication style

---

## Detection System

### Rule Structure

```typescript
interface VirtueDetectionRule {
  virtueId: string;
  keywords: string[];        // Simple phrases to match
  excludePatterns: string[]; // Filter out gaming attempts
  contextClues: string[];    // 'isReply', 'mentionsOther'
  confidence: number;        // 0.3 - 0.9
}
```

**Why simple keywords (no regex)?**
- LLM can safely add/remove keywords
- No risk of ReDoS attacks
- Easy to audit and understand

**Why exclude patterns?**
- Prevents "I am so humble" gaming
- Filters self-referential claims
- Real virtue is demonstrated, not claimed

### Confidence Calculation

```
confidence = base_confidence × (1 + 0.1 × extra_matches)
```

**Why this formula?**
- Multiple keyword matches increase confidence
- Caps at 0.95 to never be "certain"
- Base confidence from rule (0.3-0.9)

### Rule Refinement Process

1. Fetch current rules
2. Collect recent detection outcomes (7 days)
3. LLM analyzes accuracy, proposes changes
4. Validate proposals (no regex, reasonable values)
5. Apply safe changes to rules
6. Log changelog for audit

**Constraints on LLM changes:**
- Add/remove keywords only (simple strings)
- Adjust confidence (0.3-0.9 range)
- No new virtues, no regex patterns

---

## Gamification Balance

### Point Economics

| Source | Points | Rationale |
|--------|--------|-----------|
| Self-report | 10 | Requires self-awareness |
| Observed | 5 | Passive, less valuable |
| Streak/day | +5 | Habit reinforcement |
| Streak cap | +50 | Prevents runaway inflation |
| All-13 | +100 | ~38% bonus, feels special |

**Monthly Earnings:**
- Casual (1/day): 300-450 pts
- Engaged (5/day): 1,500-2,000 pts
- Hardcore (all-13/day): 6,000-8,000 pts

**Result:** 20x range between casual and hardcore. Rewards dedication without making casual players feel hopeless.

### Badge Progression

| Tier | Streak | % Reach |
|------|--------|---------|
| Beginner | 1 day | 100% |
| Week Warrior | 7 days | ~30% |
| Monthly Master | 30 days | ~10% |
| Century Club | 100 days | ~3% |
| Year of Virtue | 365 days | <1% |

**Why this curve?**
- Rapid early progression hooks users
- Long-term goals for engaged users
- Most users earn 2-5 badges (achievable)

### Synergy Design

```typescript
{
  id: 'franklins_triangle',
  virtues: ['humility', 'industry', 'frugality'],
  bonus: 40  // Highest bonus - Franklin's favorites
}
```

**Why 3-virtue combos?**
- 2 is too easy (accidental)
- 4+ is too hard (discouraging)
- 3 requires intentional planning

---

## Anti-Gaming Measures

### Self-Referential Filtering

**Problem:** User says "I am so humble" to farm points.

**Solution:** Exclude patterns filter self-claims:

```typescript
excludePatterns: [
  'i am humble', 'i practice humility', 'i was humble'
]
```

**Philosophy:** True virtue is demonstrated, not claimed.

### Duplicate Handling

| Scenario | Behavior |
|----------|----------|
| Self + Self same day | Positive message, no extra points |
| Observed + Observed | Silent ignore |
| Observed → Self | Upgrade (+5 pts difference) |

**Why allow upgrade?**
- Rewards self-awareness after autonomous behavior
- 10 pts total = same as pure self-report
- Fair: credit for both observation and conscious practice

### Cooldown System

**Rule:** Max 1 observed award per user per hour.

**Why per-user (not per-virtue)?**
- User could cycle through 13 virtues (13 awards/hour)
- Per-user is more robust
- Simpler implementation

**Why 1 hour?**
- Prevents gaming by spam
- Still allows 24 potential awards/day
- Real virtuous actions are spaced out

---

## Privacy & GDPR

### Data Minimization

**Stored:**
- Check-in history (date + virtue + source + points)
- Badges, streaks, timezone
- Reminder preference

**NOT stored:**
- Message content
- IP addresses
- Personal information beyond entityId

### User Rights

| Right | Implementation |
|-------|----------------|
| Access | `EXPORT_DATA` action → JSON download |
| Deletion | `DELETE_MY_DATA` → removes all cache keys |
| Opt-out | `SET_PRIVACY` → disables observation |

**Why separate privacy cache key?**
- Checked on every message (hot path)
- Smaller data structure = faster reads

---

## Scalability

### Current Limits

- ✅ Up to 1,000 users per world
- ✅ Up to 10 worlds per agent
- ✅ ~10MB per user × 10,000 users = 100GB (feasible)

### Database Migration Path

When to migrate:
- >5,000 active users
- Need cross-world leaderboards
- Complex analytics required
- Memory >10GB

**Future schema:**

```sql
CREATE TABLE virtue_users (
  id UUID PRIMARY KEY,
  entity_id TEXT NOT NULL,
  world_id TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  total_points INTEGER DEFAULT 0
);

CREATE TABLE virtue_checkins (
  user_id UUID REFERENCES virtue_users(id),
  virtue_id TEXT NOT NULL,
  source TEXT NOT NULL,
  points INTEGER NOT NULL,
  date DATE NOT NULL
) PARTITION BY RANGE (date);

CREATE INDEX idx_leaderboard ON virtue_users(world_id, total_points DESC);
```

### Horizontal Scaling

**Current:** Single agent instance.

**Future challenges:**
1. Cache invalidation (user data in-memory)
2. Cooldown synchronization
3. Leaderboard consistency

**Solutions:**
1. Redis for shared cache
2. Distributed locks
3. Eventual consistency for leaderboards

---

## Code Organization

### Services (8)

| Service | Responsibility |
|---------|----------------|
| VirtueService | Core tracking, streaks, badges, DNA |
| NotificationService | DM reminders, milestone alerts |
| SeasonalEventsService | Event activation, multipliers |
| VirtueSynergyService | Combo detection, bonuses |
| VirtueChallengeService | Quest tracking, rewards |
| MentorshipService | Mentor-mentee relationships |
| HistoricalComparisonService | Legend comparisons |
| VirtueRemixService | AI suggestions |

**Why 8 services?**
- Single responsibility principle
- Testable in isolation
- Can be disabled/replaced individually

### Actions (19)

Split into categories for clarity:
- Core tracking (6)
- Settings (3)
- Social (5)
- Data (2)
- Admin (3)

**Why 19 actions vs 1 mega-action?**
- Clear intent per command
- Better validation
- Easier to add/remove features

### Evaluators (1)

Only `virtueObserver` – runs on every message.

**Why only 1?**
- Evaluators are expensive (run on every message)
- Single evaluator handles all detection
- Rule-based matching is fast

### Task Workers (3)

| Worker | Interval | Purpose |
|--------|----------|---------|
| RuleRefinement | 24h | LLM improves detection |
| CommunityReport | 7d | Weekly insights |
| DailyReminder | per-user | Opt-in notifications |

---

## Summary

### Design Trade-offs

| Decision | Pro | Con | Revisit When |
|----------|-----|-----|--------------|
| Cache storage | Simple, fast | Limited scale | >5K users |
| Rule-based detection | Fast, cheap | Less accurate | Quality drops |
| Per-user cooldown | Anti-gaming | Might miss legitimate | Complaints |
| Streak cap +50 | Fair economy | Demotivates veterans | Churn >30 days |

### Key Principles

1. **Performance First** – Rule-based detection, LLM only for refinement
2. **Privacy by Design** – Minimal data, full opt-outs
3. **Fair Economy** – Caps and curves prevent inflation
4. **Self-Improving** – AI learns better patterns over time
5. **Scalability Path** – Clear migration when needed
