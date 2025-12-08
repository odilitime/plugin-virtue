import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { CACHE_KEYS } from '../constants';

export const deleteMyDataAction: Action = {
  name: 'DELETE_MY_DATA',
  similes: ['DELETE_VIRTUE_DATA', 'REMOVE_DATA', 'FORGET_ME'],
  description: 'Delete all your virtue tracking data (GDPR compliance)',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return (text.includes('delete') || text.includes('remove')) && 
           (text.includes('data') || text.includes('virtue'));
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: any,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      // Delete all user data
      await runtime.deleteCache(CACHE_KEYS.USER_DATA(message.entityId));
      await runtime.deleteCache(CACHE_KEYS.PRIVACY(message.entityId));
      await runtime.deleteCache(CACHE_KEYS.COOLDOWN(message.entityId));
      
      const text = '✅ All your virtue data has been deleted. Your progress, badges, and settings have been removed.';
      
      if (callback) {
        await callback({
          text,
          actions: ['DELETE_MY_DATA'],
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
        src: 'plugin:virtue',
        action: 'deleteMyData',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error deleting user data');
      
      const text = 'Sorry, I encountered an error deleting your data. Please try again.';
      
      if (callback) {
        await callback({
          text,
          actions: ['DELETE_MY_DATA_ERROR'],
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
          text: 'Delete my virtue data',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ All your virtue data has been deleted.',
          actions: ['DELETE_MY_DATA']
        }
      }
    ]
  ]
};

