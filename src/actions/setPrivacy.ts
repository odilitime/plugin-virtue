import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { CACHE_KEYS } from '../constants';
import type { PrivacySettings } from '../types';

export const setPrivacyAction: Action = {
  name: 'SET_PRIVACY',
  similes: ['PRIVACY_SETTINGS', 'OPT_OUT', 'PRIVACY'],
  description: 'Configure your virtue tracking privacy settings',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('privacy') || text.includes('opt out') || text.includes('opt-out');
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: any,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const text = message.content.text?.toLowerCase() || '';
      
      // Get current privacy settings
      const privacy = await runtime.getCache<PrivacySettings>(
        CACHE_KEYS.PRIVACY(message.entityId)
      ) || {};
      
      // Parse intent
      const optOutObservation = text.includes('opt out') && text.includes('observation');
      const optOutLeaderboard = text.includes('opt out') && text.includes('leaderboard');
      const optOutInsights = text.includes('opt out') && text.includes('insights');
      
      // Update settings
      if (optOutObservation) {
        privacy.optOutObservation = true;
      }
      if (optOutLeaderboard) {
        privacy.optOutLeaderboard = true;
      }
      if (optOutInsights) {
        privacy.optOutCommunityInsights = true;
      }
      
      await runtime.setCache(CACHE_KEYS.PRIVACY(message.entityId), privacy);
      
      let responseText = '✅ Privacy settings updated:\n';
      if (privacy.optOutObservation) responseText += '• Opted out of passive observation\n';
      if (privacy.optOutLeaderboard) responseText += '• Opted out of leaderboard\n';
      if (privacy.optOutCommunityInsights) responseText += '• Opted out of community insights\n';
      
      if (callback) {
        await callback({
          text: responseText,
          actions: ['SET_PRIVACY'],
          source: message.content.source
        });
      }
      
      return {
        text: responseText,
        success: true,
        data: { privacy }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'setPrivacy',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error setting privacy');
      
      const text = 'Sorry, I encountered an error updating your privacy settings.';
      
      if (callback) {
        await callback({
          text,
          actions: ['SET_PRIVACY_ERROR'],
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
          text: 'Opt out of virtue observation',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ Privacy settings updated',
          actions: ['SET_PRIVACY']
        }
      }
    ]
  ]
};

