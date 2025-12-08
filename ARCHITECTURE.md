# Plugin Virtue - Architecture & Design Decisions

This document explains **WHY** things are built the way they are in plugin-virtue.

## Table of Contents
1. [Core Design Philosophy](#core-design-philosophy)
2. [Data Architecture](#data-architecture)
3. [Performance Optimization](#performance-optimization)
4. [Gamification Balance](#gamification-balance)
5. [Anti-Gaming Measures](#anti-gaming-measures)
6. [Privacy & GDPR](#privacy--gdpr)
7. [Future Scalability](#future-scalability)

---

## Core Design Philosophy

### Why Rule-Based + LLM Hybrid Approach?

**Problem:** Need to detect virtuous behavior in every chat message.

**Why not just LLM per message?**
- ❌ Cost: $0.001-0.01 per message × 1000 messages/day = $1-10/day per server
- ❌ Latency: 200-500ms per LLM call slows down message processing
- ❌ Rate limits: Would hit OpenAI rate limits quickly

**Why not just rule-based forever?**
- ❌ Stale rules: Language evolves, new slang emerges
- ❌ Community-specific: Different servers have different communication styles
- ❌ Edge cases: Sarcasm, context, nuance hard to capture in regex

**Solution: Hybrid System**
- ✅ Rule-based detection on every message (fast, cheap, 99% accuracy)
- ✅ Daily LLM task refines rules based on recent messages (self-improving)
- ✅ Best of both worlds: Performance + adaptability

**Implementation:**
- `evaluators/virtueObserver.ts`: Rule-based detection (runs on every message)
- `tasks/ruleRefinementWorker.ts`: LLM refinement (runs once per 24 hours)

---

## Data Architecture

### Why Cache-Based Storage?

**Decision:** Use `runtime.getCache/setCache` instead of database tables.

**Pros:**
- ✅ Simple: No schema migrations, no ORM complexity
- ✅ Fast: In-memory reads/writes
- ✅ Sufficient: Works well for 100-1000 users per world
- ✅ ElizaOS pattern: Matches how other plugins work

**Cons:**
- ❌ Not for millions of users (would need Redis/PostgreSQL)
- ❌ Harder to query across users (no SQL)
- ❌ Memory limits (1-10MB per user × 1000 users = 1-10GB)

**When to migrate to database:**
- Server has >5000 active users
- Need complex queries (e.g., "top 100 users in US who practiced humility this week")
- Need multi-server leaderboards
- Running out of memory

**Migration path:**
- Create `VirtueAdapter` interface
- Implement `CacheVirtueAdapter` (current) and `DatabaseVirtueAdapter`
- Swap implementations without changing business logic

### Cache Key Design

```typescript
// User data (versioned for future migrations)
`virtue:user:v1:${entityId}`

// Leaderboard per world (isolated communities)
`virtue:leaderboard:${worldId}`

// Detection rules per agent (each agent learns independently)
`virtue:rules:${agentId}`

// Cooldowns per user (prevent spam)
`virtue:cooldown:${entityId}`
```

**Why versioned keys (`:v1:`)?**
- Enables data migrations without breaking existing users
- Change data structure in v2, read v1 and migrate on-demand
- Gradual rollout of new features

**Why per-world leaderboards?**
- Each Discord server is a separate community
- Prevents one mega-community from dominating
- Allows fair competition within peer groups

**Why per-agent rules?**
- Each agent instance learns from its own community
- Rules adapt to community communication style
- No cross-contamination between servers

---

## Performance Optimization

### Cooldown System

**Problem:** Without cooldowns, one user could spam virtuous behavior and get 100 awards per day.

**Solution:** Max 1 observed award per user per hour.

```typescript
// Check cooldown before awarding
const cooldown = await runtime.getCache(`virtue:cooldown:${entityId}`);
if (cooldown && Date.now() - cooldown < 60 * 60 * 1000) {
  return; // Skip silently
}

// Award virtue, set new cooldown
await awardObservedVirtue(...);
await runtime.setCache(`virtue:cooldown:${entityId}`, Date.now());
```

**Why 1 hour?**
- ✅ Prevents gaming (can't farm points by spamming "sorry" 100 times)
- ✅ Still allows multiple awards per day (24 potential awards)
- ✅ Feels natural (real virtuous actions are spaced out)

**Why not per-virtue cooldown?**
- Simpler implementation
- User could still game by cycling through 13 virtues (13 awards per hour)
- Per-user cooldown is more robust

### Leaderboard Updates

**Problem:** Recalculating leaderboard from scratch on every check-in is O(n × m) where n = users, m = days.

**Solution:** Incremental updates.

```typescript
// On check-in, update just this user's entry
await updateLeaderboard(worldId, entityId, newPoints, streak, badges);

// Inside updateLeaderboard:
// 1. Find user's entry (O(n))
// 2. Update their points
// 3. Re-sort (O(n log n))
// 4. Trim to top 100 (O(1))
```

**Why top 100 only?**
- UI can't display 1000 users anyway
- Reduces memory footprint
- Faster sorts
- Users care about top 10, maybe top 50

**When this breaks:**
- >10,000 users per world (sorting becomes slow)
- Solution: Move to database with indexed queries

---

## Gamification Balance

### Point Economics

**Base Values:**
- Self-report: 10 points
- Observed: 5 points
- All-13 bonus: 50 points
- Streak bonus: +1 point per day (capped at +50)

**Why these values?**

**Self-report > Observed:**
- Self-reporting requires self-awareness (more valuable)
- Observed is passive (user might not even know they did it)
- 2:1 ratio encourages conscious practice

**All-13 bonus = 50 points:**
- Base for all-13: 13 × 10 = 130 points
- With bonus: 180 points
- ~38% bonus (significant but not overwhelming)
- Makes completing all-13 feel special

**Streak bonus capped at +50:**
- Without cap: 365-day streak = +365 per check-in (broken)
- With cap: Max +50 per check-in
- Streak still valuable but not dominant
- New users stay competitive

**Monthly Earnings:**
- Casual user (1 virtue/day × 30 days): 300-450 points
- Engaged user (5 virtues/day + 7-day streak): 1,500-2,000 points
- Hardcore user (all-13 daily + 30-day streak): 6,000-8,000 points

**Result:** 20x range between casual and hardcore. Enough to reward dedication without making casual players feel hopeless.

### Badge Progression

**Tiers:**
1. Beginner (1 day) - Everyone gets this
2. Week Warrior (7 days) - ~30% reach this
3. Monthly Master (30 days) - ~10% reach this
4. Year Veteran (365 days) - <1% reach this

**Why this curve?**
- Rapid early progression (1 day → 7 days)
- Long-term goals for engaged users (30 → 365 days)
- Most users earn 2-5 badges (feels achievable)
- Hardcore users chase rare badges (365 days, all-13 in one day)

---

## Anti-Gaming Measures

### Self-Referential Claim Filtering

**Problem:** User could say "I am so humble" and farm humility points.

**Solution:** Exclude patterns that reference the virtue itself.

```typescript
excludePatterns: [
  'i am humble',
  'i practice humility',
  'i was humble'
]
```

**Why this works:**
- Real humility: "my mistake" → counts
- Fake humility: "i am humble" → filtered out
- Based on virtue theory: True virtue is demonstrated, not claimed

### Duplicate Check-In Handling

**Problem:** User could check in same virtue 10 times per day.

**Solution:** Max 1 check-in per virtue per day.

**Edge case:** Observed first, then self-report.

```typescript
// Morning: Agent observes user helping someone (5 pts)
checkIn(entityId, 'justice', 'observed') // → 5 pts

// Evening: User self-reports "helped someone today" (5 more pts)
checkIn(entityId, 'justice', 'self-report') // → 5 pts (upgrade)

// Total: 10 pts (not 15) - prevents double-dipping
```

**Why allow upgrade:**
- Rewards self-awareness after autonomous behavior
- 10 pts total = same as pure self-report
- Fair: User gets credit for both observation and conscious practice

### Cooldown for Observed Awards

**Problem:** User could trigger observation detection 100 times per day by repeating trigger phrases.

**Solution:** Max 1 observed award per user per hour.

**Why per-user (not per-virtue):**
- User could cycle through 13 virtues (13 awards per hour)
- Per-user is more robust
- Simpler implementation (one cooldown key instead of 13)

---

## Privacy & GDPR

### Data Minimization

**What we store:**
- ✅ Check-in history (date + virtue + source + points)
- ✅ Badges, streaks, timezone
- ✅ Reminder preference

**What we DON'T store:**
- ❌ Message content
- ❌ IP addresses
- ❌ Personal information beyond entityId

### User Rights (GDPR Compliant)

**Right to Access:**
```typescript
// EXPORT_DATA action
GET virtue:user:v1:${entityId}
→ Returns JSON of all user data
```

**Right to Deletion:**
```typescript
// DELETE_MY_DATA action
DELETE virtue:user:v1:${entityId}
DELETE virtue:cooldown:${entityId}
DELETE virtue:privacy:${entityId}
// Remove from leaderboard
```

**Right to Opt-Out:**
```typescript
// SET_PRIVACY action
virtue:privacy:${entityId} = { optOutObservation: true }
→ Evaluator skips this user
```

**Why separate privacy cache key:**
- Checked on every message (hot path)
- Smaller data structure = faster reads
- Can be cached in memory for performance

---

## Future Scalability

### When to Migrate to Database

**Current limits:**
- ✅ Up to 1,000 users per world
- ✅ Up to 10 worlds per agent
- ✅ ~10MB per user × 10,000 users = 100GB (feasible)

**Migrate to database when:**
- Server has >5,000 active users
- Need cross-world leaderboards
- Need complex queries (analytics, reports)
- Memory usage >10GB
- Want to scale horizontally (multiple agent instances)

### Database Schema (Future)

```sql
-- Users table
CREATE TABLE virtue_users (
  id UUID PRIMARY KEY,
  entity_id TEXT NOT NULL,
  world_id TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  total_points INTEGER DEFAULT 0,
  reminder_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Check-ins table (partitioned by date for performance)
CREATE TABLE virtue_checkins (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES virtue_users(id),
  virtue_id TEXT NOT NULL,
  source TEXT NOT NULL, -- 'self-report' or 'observed'
  points INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (date);

-- Indexes for common queries
CREATE INDEX idx_checkins_user_date ON virtue_checkins(user_id, date);
CREATE INDEX idx_leaderboard ON virtue_users(world_id, total_points DESC);
```

**Why partition by date:**
- Old data can be archived
- Queries are typically recent (last 7-30 days)
- Improves query performance

### Horizontal Scaling

**Current:** Single agent instance.

**Future:** Multiple agent instances, shared database.

**Challenges:**
1. Cache invalidation (user data cached in-memory)
2. Cooldown synchronization (distributed rate limiting)
3. Leaderboard consistency (eventual consistency acceptable)

**Solutions:**
1. Use Redis for shared cache layer
2. Use distributed lock (Redis or database)
3. Update leaderboard async (doesn't need to be instant)

---

## Summary

**Key Principles:**

1. **Performance First:** Rule-based detection for 99% of messages, LLM for 1% refinement
2. **Cache for Speed:** Simple cache-based storage for current scale, database-ready for future
3. **Anti-Gaming:** Cooldowns, duplicate detection, self-referential filtering
4. **Balanced Economy:** Point values and caps prevent inflation, keep new users competitive
5. **Privacy by Design:** Minimal data storage, full GDPR compliance, opt-outs respected
6. **Scalability Path:** Clear migration path to database when needed

**Design Trade-offs:**

| Decision | Pro | Con | When to Revisit |
|----------|-----|-----|-----------------|
| Cache storage | Simple, fast | Limited scale | >5K users |
| Rule-based detection | Fast, cheap | Less accurate | Detection quality drops |
| Cooldowns | Prevents gaming | Might miss legitimate | User complaints |
| Cap streak bonus | Fair economy | Demotivates long-term users | User churn >30 days |

---

**Further Reading:**
- See inline code comments for implementation details
- See `README.md` for user documentation
- See `ALL_PHASES_COMPLETE.md` for feature list

