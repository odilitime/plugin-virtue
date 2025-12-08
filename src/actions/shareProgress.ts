import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';
import { VIRTUES } from '../constants';
import { toLocalDate } from '../utils/formatting';

export const shareProgressAction: Action = {
  name: 'SHARE_PROGRESS',
  similes: ['SHARE_VIRTUES', 'SHOW_PROGRESS_PUBLIC'],
  description: 'Share your virtue progress publicly',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('share') && (text.includes('progress') || text.includes('virtue'));
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
      const dna = virtueService.calculateDNA(userData);
      
      // Build shareable progress card
      let card = `## 📊 <@${message.entityId}>'s Virtue Journey\n\n`;
      card += `**Class:** ${dna.archetype} | **Level:** ${Math.floor(Math.sqrt(userData.totalPoints / 100)) + 1}\n`;
      card += `🔥 ${userData.streaks.current}-day streak | ⭐ ${userData.totalPoints} points | 🏅 ${userData.badges.length} badges\n\n`;
      
      // Top 3 virtues
      const virtueCount: Record<string, number> = {};
      for (const dayCheckIns of Object.values(userData.checkIns)) {
        for (const [virtueId] of Object.entries(dayCheckIns)) {
          virtueCount[virtueId] = (virtueCount[virtueId] || 0) + 1;
        }
      }
      
      const top3 = Object.entries(virtueCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      if (top3.length > 0) {
        card += `**Top Virtues:**\n`;
        for (const [virtueId, count] of top3) {
          const virtue = VIRTUES.find(v => v.id === virtueId);
          card += `• ${virtue?.name}: ${count} practices\n`;
        }
      }
      
      if (callback) {
        await callback({
          text: card,
          actions: ['SHARE_PROGRESS'],
          source: message.content.source
        });
      }
      
      return {
        text: card,
        success: true,
        data: { userData, dna }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'shareProgress',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error sharing progress');
      
      const text = 'Sorry, I couldn\'t share your progress. Please try again.';
      
      if (callback) {
        await callback({
          text,
          actions: ['SHARE_PROGRESS_ERROR'],
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
          text: 'Share my virtue progress',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '📊 Your Virtue Journey...',
          actions: ['SHARE_PROGRESS']
        }
      }
    ]
  ]
};

