import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';
import { VIRTUES } from '../constants';
import { toLocalDate } from '../utils/formatting';

export const viewProgressAction: Action = {
  name: 'VIEW_PROGRESS',
  similes: ['SHOW_PROGRESS', 'MY_PROGRESS', 'VIRTUE_PROGRESS', 'MY_VIRTUES'],
  description: 'View your virtue progress (weekly card via DM)',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('progress') || text.includes('my virtues') || text.includes('show my');
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
      
      // Generate weekly card (last 7 days)
      const today = new Date();
      const weekDates: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        weekDates.push(toLocalDate(date, userData.timezone));
      }
      
      // Build progress card
      let card = `## 📊 Your Virtue Progress\n\n`;
      card += `🔥 **Streak:** ${userData.streaks.current} days (Best: ${userData.streaks.longest})\n`;
      card += `⭐ **Points:** ${userData.totalPoints}\n`;
      card += `🏅 **Badges:** ${userData.badges.length}\n\n`;
      
      card += `### This Week\n\n`;
      
      // Create virtue grid
      for (const virtue of VIRTUES) {
        let row = `**${virtue.name}**: `;
        for (const date of weekDates) {
          const checkIn = userData.checkIns[date]?.[virtue.id];
          if (checkIn) {
            row += checkIn.source === 'self-report' ? '✅ ' : '⭐ ';
          } else {
            row += '⬜ ';
          }
        }
        card += row + '\n';
      }
      
      card += `\n✅ = Self-report | ⭐ = Observed | ⬜ = Not logged\n`;
      
      // Try to send via DM
      try {
        await runtime.emitEvent('SEND_DM', {
          entityId: message.entityId,
          content: { text: card }
        });
        
        const publicResponse = `I've sent your virtue progress card via DM! 📊`;
        
        if (callback) {
          await callback({
            text: publicResponse,
            actions: ['VIEW_PROGRESS'],
            source: message.content.source
          });
        }
        
        return {
          text: publicResponse,
          success: true,
          data: { sentViaDM: true }
        };
      } catch {
        // DM failed, send publicly
        if (callback) {
          await callback({
            text: card,
            actions: ['VIEW_PROGRESS'],
            source: message.content.source
          });
        }
        
        return {
          text: card,
          success: true,
          data: { sentViaDM: false }
        };
      }
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'viewProgress',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error viewing progress');
      
      const text = 'Sorry, I couldn\'t retrieve your progress. Please try again.';
      
      if (callback) {
        await callback({
          text,
          actions: ['VIEW_PROGRESS_ERROR'],
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
          text: 'Show my virtue progress',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: 'I\'ve sent your virtue progress card via DM! 📊',
          actions: ['VIEW_PROGRESS']
        }
      }
    ]
  ]
};

