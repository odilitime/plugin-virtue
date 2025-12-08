import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';
import { VirtueRemixService } from '../services/virtueRemixService';

export const getSuggestionsAction: Action = {
  name: 'GET_SUGGESTIONS',
  similes: ['VIRTUE_SUGGESTIONS', 'RECOMMEND_VIRTUES', 'WHAT_TO_PRACTICE'],
  description: 'Get AI-powered personalized virtue suggestions',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return (text.includes('suggest') || text.includes('recommend') || text.includes('what should')) && 
           (text.includes('virtue') || text.includes('practice'));
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
      const remixService = runtime.getService<VirtueRemixService>('virtue_remix');
      
      if (!virtueService || !remixService) {
        throw new Error('Required services not available');
      }
      
      const userData = await virtueService.getUserData(message.entityId);
      const suggestions = await remixService.generateSuggestions(userData);
      
      let responseText = `## 🎯 Personalized Virtue Suggestions\n\n`;
      
      responseText += `**Focus on these virtues next:**\n`;
      for (const virtue of suggestions.focusVirtues) {
        responseText += `• ${virtue}\n`;
      }
      responseText += `\n`;
      
      responseText += `**Why:** ${suggestions.reasoning}\n\n`;
      
      if (suggestions.practicalTips.length > 0) {
        responseText += `**Practical Tips:**\n`;
        for (const tip of suggestions.practicalTips) {
          responseText += `💡 ${tip}\n`;
        }
      }
      
      if (callback) {
        await callback({
          text: responseText,
          actions: ['GET_SUGGESTIONS'],
          source: message.content.source
        });
      }
      
      return {
        text: responseText,
        success: true,
        data: { suggestions }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'getSuggestions',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error getting suggestions');
      
      const text = 'Sorry, I couldn\'t generate personalized suggestions right now.';
      
      if (callback) {
        await callback({
          text,
          actions: ['GET_SUGGESTIONS_ERROR'],
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
          text: 'What virtues should I practice next?',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '🎯 Personalized Virtue Suggestions...',
          actions: ['GET_SUGGESTIONS']
        }
      }
    ]
  ]
};

