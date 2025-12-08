import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';
import { HistoricalComparisonService } from '../services/historicalComparisonService';
import { VIRTUES } from '../constants';

export const compareHistoryAction: Action = {
  name: 'COMPARE_HISTORY',
  similes: ['COMPARE_FRANKLIN', 'HISTORICAL_COMPARISON'],
  description: 'Compare your virtue practice to historical figures',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('compare') && (text.includes('franklin') || text.includes('aurelius') || text.includes('historical'));
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
      const historicalService = runtime.getService<HistoricalComparisonService>('virtue_historical');
      
      if (!virtueService || !historicalService) {
        throw new Error('Required services not available');
      }
      
      const userData = await virtueService.getUserData(message.entityId);
      
      // Determine which figure to compare to
      const text = message.content.text?.toLowerCase() || '';
      let figureId = 'franklin';
      if (text.includes('aurelius')) figureId = 'aurelius';
      if (text.includes('gandhi')) figureId = 'gandhi';
      
      const comparison = historicalService.compareToFigure(userData, figureId);
      
      if (!comparison) {
        const text = 'Figure not found. Available: Franklin, Aurelius, Gandhi';
        
        if (callback) {
          await callback({
            text,
            actions: ['COMPARE_HISTORY'],
            source: message.content.source
          });
        }
        
        return { text, success: false };
      }
      
      let responseText = `## 📜 Comparison with ${comparison.figure.name}\n\n`;
      responseText += `${comparison.figure.description}\n\n`;
      responseText += `**Overall Similarity:** ${comparison.similarity}%\n\n`;
      
      if (comparison.strengths.length > 0) {
        responseText += `**Your Strengths:**\n`;
        for (const virtueId of comparison.strengths) {
          const virtue = VIRTUES.find(v => v.id === virtueId);
          responseText += `✅ ${virtue?.name}\n`;
        }
        responseText += `\n`;
      }
      
      if (comparison.gaps.length > 0) {
        responseText += `**Growth Opportunities:**\n`;
        for (const virtueId of comparison.gaps) {
          const virtue = VIRTUES.find(v => v.id === virtueId);
          responseText += `📈 ${virtue?.name}\n`;
        }
        responseText += `\n`;
      }
      
      responseText += `_${comparison.message}_`;
      
      if (callback) {
        await callback({
          text: responseText,
          actions: ['COMPARE_HISTORY'],
          source: message.content.source
        });
      }
      
      return {
        text: responseText,
        success: true,
        data: { comparison }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'compareHistory',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error comparing history');
      
      const text = 'Sorry, I couldn\'t generate the historical comparison.';
      
      if (callback) {
        await callback({
          text,
          actions: ['COMPARE_HISTORY_ERROR'],
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
          text: 'Compare me to Benjamin Franklin',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '📜 Comparison with Benjamin Franklin...',
          actions: ['COMPARE_HISTORY']
        }
      }
    ]
  ]
};

