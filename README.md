# @elizaos/plugin-virtue

Benjamin Franklin's Virtue Tracker - A gamified self-improvement plugin for ElizaOS.

## Overview

This plugin implements Benjamin Franklin's famous virtue tracking system with modern gamification:

- **Self-reporting**: Users check in when they practice virtues
- **Passive observation**: Agent recognizes virtuous behavior in chat
- **Gamification**: Points, streaks, badges, and leaderboards
- **Visualizations**: Progress charts, heatmaps, and character sheets
- **Self-improving**: LLM-powered rule refinement over time

## Franklin's 13 Virtues

1. **Temperance** - Eat not to dullness; drink not to elevation
2. **Silence** - Speak not but what may benefit others or yourself
3. **Order** - Let all your things have their places
4. **Resolution** - Resolve to perform what you ought
5. **Frugality** - Make no expense but to do good
6. **Industry** - Lose no time; be always employed
7. **Sincerity** - Use no hurtful deceit
8. **Justice** - Wrong none by doing injuries
9. **Moderation** - Avoid extremes
10. **Cleanliness** - Tolerate no uncleanliness
11. **Tranquility** - Be not disturbed at trifles
12. **Chastity** - Rarely use venery but for health
13. **Humility** - Imitate Jesus and Socrates

## Installation

Add to your agent's character file:

```json
{
  "plugins": ["@elizaos/plugin-virtue"]
}
```

## Commands

### User Commands

**Virtue Tracking:**
- "I practiced temperance today" - Check in a virtue (self-report)
- "Show my virtue progress" - View weekly card with 13x7 grid (via DM)
- "Show the virtue leaderboard" - Community rankings with top 10
- "Show my character sheet" - RPG-style stats with DNA profile & archetypes
- "Share my virtue progress" - Share progress publicly in channel
- "What seasonal events are active?" - View active seasonal challenges
- "Show virtue synergies" - View virtue combination bonuses
- "Show active challenges" - View time-limited quests
- "Join challenge [name]" - Participate in a challenge
- "Become mentor to @user" - Mentor another user (earn 20% of their points)
- "Compare me to Benjamin Franklin" - Historical comparison
- "What virtues should I practice?" - AI-powered personalized suggestions

**Settings:**
- "Set my timezone to America/New_York" - Configure timezone for accurate streaks
- "Remind me to log virtues daily" - Toggle daily DM reminders
- "Opt out of virtue observation" - Disable passive observation

**Privacy & Data:**
- "Export my virtue data" - Download your data as JSON (GDPR)
- "Delete my virtue data" - Remove all your data (GDPR right to be forgotten)

### Admin Commands
- "Reset streak for @user" - Reset a user's streak (preserves longest)
- "Award badge week_warrior to @user" - Manually award a badge
- "Audit virtue rules" - View complete rule refinement changelog

## Features

### Points System
- **Self-report**: 10 points per virtue
- **Observed virtue**: 5 points (agent recognizes your behavior)
- **Daily streak bonus**: +5 points per day (caps at +50)
- **Weekly all-13 completion**: +100 bonus
- **Seasonal event multipliers**: Up to 2x points during special events

### Badges
- **Beginner**: First check-in
- **Week Warrior**: 7-day streak
- **Monthly Master**: 30-day streak
- **Franklin's Heir**: All 13 virtues in one day
- **Century Club**: 100-day streak
- **Year of Virtue**: 365-day streak
- **Platform Badges**: Discord Peacekeeper, Helper, Mentor (coming soon)

### Character Sheet (RPG Style)
Your virtue stats as an RPG character:
- **Level** based on total points (Level = √(points/100))
- **Attribute bars**: Self-Control, Wisdom, Discipline, Courage, Compassion
- **DNA Profile archetypes**: The Stoic, The Sage, The Strategist, The Champion, The Guardian
- **Personal traits**: Composed, Thoughtful, Organized, Determined, etc.

### Seasonal Events
Time-limited challenges with bonus rewards:
- **Thanksgiving Gratitude** (Nov 20-30): 2x points for Justice
- **New Year Resolution** (Jan 1-7): 1.5x points for Resolution
- **Spring Renewal** (Mar 20-31): 1.5x points for Cleanliness
- Custom events can be configured per community

### Notifications
- **Daily reminders**: Opt-in DM reminders to practice virtues
- **Milestone alerts**: Notifications at 7, 14, 30, 100, 365 day streaks
- **Badge unlocks**: Instant notification when you earn a new badge
- **Leaderboard changes**: Alerts for top 10 rank changes

### Virtue Synergies (Phase 3) 🔗
Unlock bonus points by practicing complementary virtues together:
- **Balanced Life**: Temperance + Moderation + Tranquility (+25 pts)
- **Wise Leader**: Wisdom + Justice + Humility (+30 pts)
- **Productive Perfectionist**: Industry + Order + Resolution (+25 pts)
- **Honest Diplomat**: Sincerity + Moderation + Silence (+20 pts)
- **Franklin's Triangle**: Humility + Industry + Frugality (+40 pts)
- **Stoic Core**: Tranquility + Moderation + Resolution (+30 pts)

### Virtue Challenges (Phase 3) 🏆
Time-limited quests with special rewards:
- **Week of Wisdom**: 7-day wisdom streak (150 pts + badge)
- **The Centurion**: 100 total check-ins (200 pts + badge)
- **Synergy Seeker**: Unlock 3 synergies (100 pts + badge)

Challenges track progress automatically and award bonus points upon completion!

### Mentorship System (Phase 4) 🎓
Guide others on their virtue journey:
- **Become a Mentor**: Support another user's practice
- **Earn 20% Bonus**: Automatically receive 20% of your mentee's points
- **Build Community**: Foster virtue cultivation together

### Historical Comparisons (Phase 4) 📜
Compare your practice to legendary figures:
- **Benjamin Franklin**: Disciplined, industrious, humble
- **Marcus Aurelius**: Stoic emperor, master of tranquility
- **Mahatma Gandhi**: Peaceful revolutionary, exemplar of justice

Get similarity scores, identify your strengths, and see growth opportunities!

### AI Suggestions (Phase 4) 🤖
Let AI guide your practice:
- **Personalized Recommendations**: Based on your unique patterns
- **Strategic Focus**: Which virtues to practice next
- **Practical Tips**: Actionable advice for improvement

## Privacy & GDPR Compliance

The plugin includes comprehensive privacy controls:

- **Opt-out options**: Disable passive observation, leaderboard inclusion, or community insights
- **Data deletion**: Complete removal of all virtue tracking data on request
- **Data export**: Download all your data in JSON format
- **Privacy by default**: No data is shared beyond the configured world/server

## Architecture Highlights

- **Self-Improving**: LLM-powered rule refinement runs daily to improve virtue detection accuracy
- **Rule-Based Detection**: No LLM calls per message - fast keyword/pattern matching with cooldowns
- **Bootstrap Integration**: Uses TaskService for periodic tasks (rule refinement, community reports)
- **Timezone-Aware**: Streak calculations respect user's local timezone
- **Error Resilient**: Retry logic, graceful degradation, comprehensive error logging
- **Platform-Agnostic**: Works on Discord, Telegram, Twitter with platform-specific optimizations

## Future Roadmap

- Virtue Synergy Bonuses - Extra points for complementary virtue combinations
- Mentorship System - Mentors earn 20% of mentee's points
- Historical Comparisons - Compare your progress to Benjamin Franklin or Marcus Aurelius
- Custom Virtue Sets - Communities can define their own virtues
- Seasonal Events - Time-limited community challenges with bonus rewards
- Visualization Charts - Heatmaps, timelines, and progress graphs
- API Webhooks - Integration points for third-party apps

## Development

```bash
# Build the plugin
cd packages/plugin-virtue
bun run build

# Watch mode
bun run dev

# Run tests
bun run test
```

## Contributing

Contributions welcome! Please ensure:
- All tests pass
- Code follows TypeScript best practices
- New features include appropriate actions/evaluators/services
- Privacy and security considerations are addressed

## License

MIT

