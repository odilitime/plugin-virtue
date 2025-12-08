import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { ModelType } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';
import { normalizeTimezone } from '../utils/validator';

export const setTimezoneAction: Action = {
  name: 'SET_TIMEZONE',
  similes: ['UPDATE_TIMEZONE', 'CHANGE_TIMEZONE', 'MY_TIMEZONE'],
  description: 'Set your timezone for accurate streak calculation',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('timezone') || text.includes('time zone');
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
      
      // Extract timezone from message
      const prompt = `Extract the timezone from this message: "${message.content.text}"

Examples:
- "Set my timezone to America/New_York" -> America/New_York
- "Change timezone to PST" -> America/Los_Angeles
- "I'm in EST" -> America/New_York

Return ONLY the timezone in IANA format (e.g., America/New_York, Europe/London, Asia/Tokyo), or "unknown" if unclear.`;
      
      const response = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 50
      });
      
      const timezoneInput = response.trim();
      const timezone = normalizeTimezone(timezoneInput);
      
      if (!timezone) {
        const text = `I couldn't recognize that timezone. Please use a format like:
- "Set my timezone to America/New_York"
- "Set my timezone to Europe/London"
- "Set my timezone to Asia/Tokyo"

Or use abbreviations like EST, PST, GMT.`;
        
        if (callback) {
          await callback({
            text,
            actions: ['SET_TIMEZONE'],
            source: message.content.source
          });
        }
        
        return {
          text,
          success: false,
          data: { error: 'invalid_timezone' }
        };
      }
      
      // Update user timezone
      const userData = await virtueService.getUserData(message.entityId);
      userData.timezone = timezone;
      
      // Recalculate streaks with new timezone
      userData.streaks = virtueService.calculateStreak(userData.checkIns, timezone);
      
      await virtueService.saveUserData(message.entityId, userData);
      
      const text = `✅ Timezone set to **${timezone}**. Your streaks have been recalculated based on your local time.`;
      
      if (callback) {
        await callback({
          text,
          actions: ['SET_TIMEZONE'],
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
        src: 'plugin:virtue',
        action: 'setTimezone',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error setting timezone');
      
      const text = 'Sorry, I encountered an error setting your timezone. Please try again.';
      
      if (callback) {
        await callback({
          text,
          actions: ['SET_TIMEZONE_ERROR'],
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
          text: 'Set my timezone to America/New_York',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ Timezone set to **America/New_York**.',
          actions: ['SET_TIMEZONE']
        }
      }
    ]
  ]
};

