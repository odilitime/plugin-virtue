# @elizaos/plugin-virtue

Benjamin Franklin's Virtue Tracker – gamified self-improvement for elizaOS.

## Quick Start

```bash
# Add to your character file
{
  "plugins": ["@elizaos/plugin-virtue"]
}
```

## Overview

Track Benjamin Franklin's 13 virtues with modern gamification:

- **Self-reporting** – Check in when you practice virtues
- **Passive observation** – Agent recognizes virtuous behavior in chat
- **Gamification** – Points, streaks, badges, leaderboards
- **RPG elements** – Character classes, DNA profiles, levels
- **Social features** – Mentorship, challenges, historical comparisons
- **AI guidance** – Personalized virtue suggestions

---

## Franklin's 13 Virtues

| # | Virtue | Description |
|---|--------|-------------|
| 1 | **Temperance** | Eat not to dullness; drink not to elevation |
| 2 | **Silence** | Speak not but what may benefit others or yourself |
| 3 | **Order** | Let all your things have their places |
| 4 | **Resolution** | Resolve to perform what you ought |
| 5 | **Frugality** | Make no expense but to do good |
| 6 | **Industry** | Lose no time; be always employed |
| 7 | **Sincerity** | Use no hurtful deceit |
| 8 | **Justice** | Wrong none by doing injuries |
| 9 | **Moderation** | Avoid extremes |
| 10 | **Cleanliness** | Tolerate no uncleanliness |
| 11 | **Tranquility** | Be not disturbed at trifles |
| 12 | **Chastity** | Rarely use venery but for health |
| 13 | **Humility** | Imitate Jesus and Socrates |

---

## Commands

### Virtue Tracking

| Command | Description |
|---------|-------------|
| `I practiced temperance today` | Check in a virtue (self-report) |
| `Show my virtue progress` | View weekly card via DM |
| `Show the virtue leaderboard` | Community rankings (top 10) |
| `Show my character sheet` | RPG-style stats with DNA profile |
| `Share my virtue progress` | Share progress publicly |

### Gamification

| Command | Description |
|---------|-------------|
| `Show virtue synergies` | View combo bonuses |
| `Show active challenges` | View time-limited quests |
| `Join challenge [name]` | Participate in a challenge |
| `What seasonal events are active?` | View active events |

### Social

| Command | Description |
|---------|-------------|
| `Become mentor to @user` | Mentor someone (earn 20% of their points) |
| `Compare me to Benjamin Franklin` | Historical comparison |
| `What virtues should I practice?` | AI-powered suggestions |

### Settings

| Command | Description |
|---------|-------------|
| `Set my timezone to America/New_York` | Configure timezone |
| `Remind me to log virtues daily` | Toggle daily reminders |
| `Opt out of virtue observation` | Disable passive observation |

### Privacy & Data (GDPR)

| Command | Description |
|---------|-------------|
| `Export my virtue data` | Download your data as JSON |
| `Delete my virtue data` | Remove all your data |

### Admin

| Command | Description |
|---------|-------------|
| `Reset streak for @user` | Reset a user's streak |
| `Award badge week_warrior to @user` | Manually award a badge |
| `Audit virtue rules` | View rule refinement changelog |

---

## Points System

| Source | Points | Notes |
|--------|--------|-------|
| Self-report | 10 | Per virtue per day |
| Observed | 5 | Agent detects your behavior |
| Streak bonus | +5/day | Caps at +50 |
| All-13 daily | +100 | Complete all virtues in one day |
| Seasonal multiplier | up to 2x | During special events |
| Synergy bonus | 20-40 | Virtue combinations |
| Challenge reward | 100-200 | Quest completion |
| Mentorship | +20% | Of mentee's points |

**Level Formula:** Level = √(points/100) + 1

---

## Badges

| Badge | Requirement |
|-------|-------------|
| Beginner | First check-in |
| Week Warrior | 7-day streak |
| Monthly Master | 30-day streak |
| Century Club | 100-day streak |
| Year of Virtue | 365-day streak |
| Franklin's Heir | All 13 virtues in one day |

Plus challenge badges, seasonal badges, and platform-specific badges.

---

## Character Classes (Archetypes)

Based on your practice patterns, you'll be assigned an archetype:

| Class | Dominant Cluster |
|-------|------------------|
| **The Stoic** | Self-Control (Temperance, Moderation, Tranquility, Chastity) |
| **The Sage** | Wisdom (Silence, Sincerity, Humility) |
| **The Strategist** | Discipline (Order, Frugality, Cleanliness) |
| **The Champion** | Courage (Resolution, Industry) |
| **The Guardian** | Compassion (Justice) |

---

## Virtue Synergies

Practice complementary virtues in one day for bonus points:

| Synergy | Virtues | Bonus |
|---------|---------|-------|
| Balanced Life | Temperance + Moderation + Tranquility | +25 |
| Wise Leader | Justice + Humility + Silence | +30 |
| Productive Perfectionist | Industry + Order + Resolution | +25 |
| Honest Diplomat | Sincerity + Moderation + Silence | +20 |
| Franklin's Triangle | Humility + Industry + Frugality | +40 |
| Stoic Core | Tranquility + Moderation + Resolution | +30 |

---

## Challenges

Time-limited quests with rewards:

| Challenge | Goal | Reward |
|-----------|------|--------|
| Week of Wisdom | 7-day wisdom streak | 150 pts + badge |
| The Centurion | 100 total check-ins | 200 pts + badge |
| Synergy Seeker | Unlock 3 synergies | 100 pts + badge |

---

## Seasonal Events

Special events with point multipliers:

| Event | Dates | Multiplier |
|-------|-------|------------|
| Thanksgiving Gratitude | Nov 20-30 | 2x Justice |
| New Year Resolution | Jan 1-7 | 1.5x Resolution |
| Spring Renewal | Mar 20-31 | 1.5x Cleanliness |

---

## Historical Comparisons

Compare your virtue profile to legendary figures:

- **Benjamin Franklin** (Level 50) – Industry, Frugality, Temperance
- **Marcus Aurelius** (Level 55) – Tranquility, Moderation, Justice
- **Mahatma Gandhi** (Level 60) – Justice, Humility, Temperance

---

## Privacy

Full GDPR compliance:

- **Opt-out** – Disable observation, leaderboard, or insights
- **Export** – Download all your data as JSON
- **Delete** – Complete data removal on request
- **Minimal storage** – No message content stored

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions and technical details.

### Key Technical Highlights

- **Hybrid detection** – Rule-based for speed, daily LLM for rule refinement
- **Self-improving** – AI learns better detection patterns over time
- **Cache-based** – Fast storage, ready for database migration at scale
- **Platform-agnostic** – Works on Discord, Telegram, Twitter

### Components

| Type | Count |
|------|-------|
| Actions | 19 |
| Services | 8 |
| Evaluators | 1 |
| Task Workers | 3 |
| Providers | 1 |

---

## Development

```bash
cd packages/plugin-virtue
bun run build    # Build
bun run dev      # Watch mode
bun run test     # Run tests
```

---

## License

MIT
