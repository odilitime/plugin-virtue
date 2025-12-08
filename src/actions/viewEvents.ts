import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { SeasonalEventsService } from '../services/seasonalEventsService';
import { VIRTUES } from '../constants';

export const viewEventsAction: Action = {
  name: 'VIEW_EVENTS',
  similes: ['SHOW_EVENTS', 'SEASONAL_EVENTS', 'VIRTUE_EVENTS'],
  description: 'View active seasonal virtue events',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('event') || text.includes('seasonal') || text.includes('challenge');
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: any,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const seasonalService = runtime.getService<SeasonalEventsService>('virtue_seasonal_events');
      if (!seasonalService) {
        throw new Error('Seasonal events service not available');
      }
      
      const activeEvents = await seasonalService.getActiveEvents();
      
      if (activeEvents.length === 0) {
        const text = 'No active seasonal events right now. Check back soon for new challenges! 🎯';
        
        if (callback) {
          await callback({
            text,
            actions: ['VIEW_EVENTS'],
            source: message.content.source
          });
        }
        
        return {
          text,
          success: true,
          data: { events: [] }
        };
      }
      
      let eventsText = '🎉 **Active Seasonal Events** 🎉\n\n';
      
      for (const event of activeEvents) {
        const virtue = VIRTUES.find(v => v.id === event.virtueId);
        eventsText += `**${event.name}**\n`;
        eventsText += `📅 Until: ${event.endDate}\n`;
        eventsText += `🌟 Featured Virtue: **${virtue?.name}**\n`;
        eventsText += `⚡ Bonus: ${event.pointMultiplier}x points\n`;
        if (event.badge) {
          eventsText += `🏅 Exclusive Badge: ${event.badge}\n`;
        }
        eventsText += `\n`;
      }
      
      eventsText += `Practice the featured virtues to earn bonus points!`;
      
      if (callback) {
        await callback({
          text: eventsText,
          actions: ['VIEW_EVENTS'],
          source: message.content.source
        });
      }
      
      return {
        text: eventsText,
        success: true,
        data: { events: activeEvents }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'viewEvents',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error viewing events');
      
      const text = 'Sorry, I couldn\'t retrieve the seasonal events.';
      
      if (callback) {
        await callback({
          text,
          actions: ['VIEW_EVENTS_ERROR'],
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
          text: 'What seasonal events are active?',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '🎉 **Active Seasonal Events**...',
          actions: ['VIEW_EVENTS']
        }
      }
    ]
  ]
};

