import type { TaskWorker, IAgentRuntime, Task } from '@elizaos/core';
import { NotificationService } from '../services/notificationService';
import { VirtueService } from '../services/virtueService';
import { CACHE_KEYS } from '../constants';
import { logError } from '../utils/errorHandler';

export const dailyReminderWorker: TaskWorker = {
  name: 'VIRTUE_DAILY_REMINDER',
  
  execute: async (
    runtime: IAgentRuntime,
    options: Record<string, unknown>,
    task: Task
  ): Promise<void> => {
    try {
      runtime.logger.info({
        src: 'plugin:virtue',
        task: 'dailyReminder',
        agentId: runtime.agentId
      }, 'Starting daily reminder task');
      
      const notificationService = runtime.getService<NotificationService>('virtue_notification');
      const virtueService = runtime.getService<VirtueService>('virtue');
      
      if (!notificationService || !virtueService) {
        runtime.logger.warn({ src: 'plugin:virtue' }, 'Required services not available');
        return;
      }
      
      // Get all users with reminders enabled
      // Note: In production, you'd want a way to list all users
      // For now, this is a stub that would be triggered per-user
      
      const entityId = options.entityId as string;
      if (entityId) {
        await notificationService.sendDailyReminder(entityId);
      }
      
      runtime.logger.info({
        src: 'plugin:virtue',
        entityId
      }, 'Daily reminder sent');
      
    } catch (error) {
      await logError(runtime, 'dailyReminder', error as Error);
    }
  }
};

