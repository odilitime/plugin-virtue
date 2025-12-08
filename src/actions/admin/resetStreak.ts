import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../../services/virtueService';
import { ModelType } from '@elizaos/core';

export const resetStreakAction: Action = {
  name: 'ADMIN_RESET_STREAK',
  similes: ['RESET_USER_STREAK', 'CLEAR_STREAK'],
  description: 'Admin: Reset a user\'s virtue streak',
  
  validate: async (runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    if (!text.includes('reset') || !text.includes('streak')) return false;
    
    // Check if user is admin
    try {
      const role = await runtime.getUserServerRole(message.entityId);
      return role === 'ADMIN' || role === 'MODERATOR';
    } catch {
      return false;
    }
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
      
      // Extract target user ID using LLM
      const prompt = `Extract the user ID or mention from this admin command: "${message.content.text}"
      
Return ONLY the user ID (without @ symbol), or "none" if not found.`;
      
      const response = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 50
      });
      
      const targetEntityId = response.trim().replace('@', '');
      
      if (targetEntityId === 'none' || !targetEntityId) {
        const text = 'Please specify a user: `reset streak for @username`';
        
        if (callback) {
          await callback({
            text,
            actions: ['ADMIN_RESET_STREAK'],
            source: message.content.source
          });
        }
        
        return { text, success: false };
      }
      
      // Reset streak
      const userData = await virtueService.getUserData(targetEntityId);
      userData.streaks = { current: 0, longest: userData.streaks.longest, lastDate: null };
      await virtueService.saveUserData(targetEntityId, userData);
      
      const text = `✅ Reset streak for <@${targetEntityId}>. Longest streak (${userData.streaks.longest}) preserved.`;
      
      if (callback) {
        await callback({
          text,
          actions: ['ADMIN_RESET_STREAK'],
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
        src: 'plugin:virtue',
        action: 'adminResetStreak',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error resetting streak');
      
      const text = 'Sorry, I encountered an error resetting the streak.';
      
      if (callback) {
        await callback({
          text,
          actions: ['ADMIN_RESET_STREAK_ERROR'],
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
          text: 'Reset streak for @alice',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ Reset streak for @alice',
          actions: ['ADMIN_RESET_STREAK']
        }
      }
    ]
  ]
};

