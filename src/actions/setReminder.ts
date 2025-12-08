import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';

export const setReminderAction: Action = {
  name: 'SET_REMINDER',
  similes: ['TOGGLE_REMINDER', 'REMINDER', 'DAILY_REMINDER'],
  description: 'Toggle daily virtue logging reminders',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('remind') && (text.includes('virtue') || text.includes('daily') || text.includes('log'));
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: any,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const virtueService = runtime.getService<VirtueService>('virtue');
      if (!virtueService) {
        throw new Error('Virtue service not available');
      }
      
      const userData = await virtueService.getUserData(message.entityId);
      
      // Toggle reminder
      userData.reminderEnabled = !userData.reminderEnabled;
      await virtueService.saveUserData(message.entityId, userData);
      
      const text = userData.reminderEnabled
        ? '✅ Daily virtue reminders enabled! I\'ll send you a DM reminder each day.'
        : '⏸️ Daily virtue reminders disabled.';
      
      if (callback) {
        await callback({
          text,
          actions: ['SET_REMINDER'],
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
        src: 'plugin:virtue',
        action: 'setReminder',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error setting reminder');
      
      const text = 'Sorry, I encountered an error updating your reminder settings. Please try again.';
      
      if (callback) {
        await callback({
          text,
          actions: ['SET_REMINDER_ERROR'],
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
        name: '{{userName}}',
        content: {
          text: 'Remind me to log virtues daily',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ Daily virtue reminders enabled!',
          actions: ['SET_REMINDER']
        }
      }
    ]
  ]
};

