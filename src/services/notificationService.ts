import type { IAgentRuntime } from '@elizaos/core';
import { Service } from '@elizaos/core';
import { VirtueService } from './virtueService';
import { BADGES, CACHE_KEYS } from '../constants';

export class NotificationService extends Service {
  static serviceType = 'virtue_notification';
  
  capabilityDescription = 'Sends virtue tracking notifications and milestone alerts';

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new NotificationService(runtime);
    runtime.logger.info({ src: 'plugin:virtue', agentId: runtime.agentId }, 'NotificationService started');
    return service;
  }

  async stop(): Promise<void> {
    this.runtime.logger.info({ src: 'plugin:virtue', agentId: this.runtime.agentId }, 'NotificationService stopped');
  }

  // ============================================================================
  // Daily Reminders
  // ============================================================================

  async sendDailyReminder(entityId: string): Promise<boolean> {
    try {
      const virtueService = this.runtime.getService<VirtueService>('virtue');
      if (!virtueService) return false;

      const userData = await virtueService.getUserData(entityId);
      
      // Check if reminders are enabled
      if (!userData.reminderEnabled) return false;

      const message = `🌅 Good day! Don't forget to practice Franklin's virtues today.

Your current streak: **${userData.streaks.current} days** 🔥

Try to log at least one virtue practice today to maintain your progress!`;

      return await this.sendDM(entityId, message);
    } catch (error) {
      this.runtime.logger.error({
        src: 'plugin:virtue',
        context: 'sendDailyReminder',
        entityId,
        error: error instanceof Error ? error.message : String(error)
      }, 'Failed to send daily reminder');
      return false;
    }
  }

  // ============================================================================
  // Milestone Notifications
  // ============================================================================

  async notifyStreakMilestone(entityId: string, streakDays: number): Promise<void> {
    const milestones = [7, 14, 21, 30, 60, 90, 100, 365];
    
    if (!milestones.includes(streakDays)) return;

    let message = `🎉 **Milestone Achieved!** 🎉\n\n`;
    message += `You've maintained a **${streakDays}-day streak**! `;
    
    if (streakDays === 7) {
      message += `One week of consistent practice — you're building a powerful habit! 💪`;
    } else if (streakDays === 30) {
      message += `A full month! Franklin himself would be proud! 🎖️`;
    } else if (streakDays === 100) {
      message += `100 days! You've truly embodied the spirit of self-improvement! 🏆`;
    } else if (streakDays === 365) {
      message += `A FULL YEAR! You are a master of virtue practice! 👑`;
    } else {
      message += `Keep up the amazing work!`;
    }

    await this.sendDM(entityId, message);
  }

  async notifyBadgeUnlock(entityId: string, badgeIds: string[]): Promise<void> {
    if (badgeIds.length === 0) return;

    const badgeNames = badgeIds.map(id => {
      const badge = BADGES.find(b => b.id === id);
      return badge ? `**${badge.name}**: ${badge.description}` : id;
    });

    const message = `🏅 **New Badge${badgeIds.length > 1 ? 's' : ''} Unlocked!** 🏅\n\n${badgeNames.join('\n')}\n\nKeep practicing to unlock more!`;

    await this.sendDM(entityId, message);
  }

  async notifyLeaderboardChange(entityId: string, oldRank: number, newRank: number): Promise<void> {
    // Only notify for top 10 or significant jumps
    if (newRank > 10 && Math.abs(oldRank - newRank) < 5) return;

    let message = '';
    
    if (newRank < oldRank) {
      message = `📈 You moved up the leaderboard!\n\nNew rank: **#${newRank}** (was #${oldRank})`;
      
      if (newRank <= 3) {
        const medals = ['🥇', '🥈', '🥉'];
        message += `\n\n${medals[newRank - 1]} You're now in the top 3!`;
      }
    } else if (newRank > oldRank && oldRank <= 10) {
      message = `📉 Heads up! Your leaderboard rank changed from #${oldRank} to #${newRank}.\n\nKeep practicing to climb back up!`;
    }

    if (message) {
      await this.sendDM(entityId, message);
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private async sendDM(entityId: string, content: string): Promise<boolean> {
    try {
      await this.runtime.emitEvent('SEND_DM', {
        entityId,
        content: { text: content }
      });
      return true;
    } catch (error) {
      this.runtime.logger.warn({
        src: 'plugin:virtue',
        entityId,
        error: error instanceof Error ? error.message : String(error)
      }, 'Failed to send DM');
      return false;
    }
  }
}

