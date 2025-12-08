import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { ModelType } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';
import { findVirtueByName } from '../utils/validator';
import { VIRTUES, BADGES } from '../constants';

export const checkInVirtueAction: Action = {
  name: 'CHECK_IN_VIRTUE',
  similes: ['LOG_VIRTUE', 'REPORT_VIRTUE', 'PRACTICE_VIRTUE'],
  description: 'Log when you practice a virtue (self-report check-in)',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    
    // Look for virtue-related keywords
    const virtueKeywords = ['practice', 'practiced', 'virtue', 'logged', 'temperance', 'silence', 'order',
      'resolution', 'frugality', 'industry', 'sincerity', 'justice', 'moderation',
      'cleanliness', 'tranquility', 'chastity', 'humility'];
    
    return virtueKeywords.some(keyword => text.includes(keyword));
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
      
      // Extract virtue name from message using LLM
      const prompt = `Extract the virtue name from this message. User said: "${message.content.text}"

Available virtues: ${VIRTUES.map(v => v.name).join(', ')}

Return ONLY the virtue name, or "none" if no virtue is mentioned.`;
      
      const response = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt,
        temperature: 0.3,
        maxTokens: 50
      });
      
      const virtueName = response.trim();
      const virtueId = findVirtueByName(virtueName);
      
      if (!virtueId) {
        const text = `I couldn't identify which virtue you practiced. Try: "I practiced temperance today" or "I practiced ${VIRTUES[0].name.toLowerCase()}"`;
        
        if (callback) {
          await callback({
            text,
            actions: ['CHECK_IN_VIRTUE'],
            source: message.content.source
          });
        }
        
        return {
          text,
          success: false,
          data: { error: 'virtue_not_found' }
        };
      }
      
      // Record the check-in
      const result = await virtueService.recordCheckIn(
        message.entityId,
        virtueId,
        'self-report'
      );
      
      // Update leaderboard if not duplicate
      if (!result.isDuplicate) {
        const userData = await virtueService.getUserData(message.entityId);
        if (message.roomId) {
          const room = await runtime.getRoom(message.roomId);
          if (room?.worldId) {
            await virtueService.updateLeaderboard(
              room.worldId,
              message.entityId,
              userData.totalPoints,
              userData.streaks.current,
              userData.badges.length
            );
          }
        }
      }
      
      // Build response
      let responseText = result.message;
      
      // Add badge notifications
      if (result.newBadges.length > 0) {
        const badgeNames = result.newBadges.map(id => 
          BADGES.find(b => b.id === id)?.name || id
        );
        responseText += `\n\n🏅 New badge${result.newBadges.length > 1 ? 's' : ''}: **${badgeNames.join(', ')}**!`;
      }
      
      // Public response (brief)
      if (callback) {
        await callback({
          text: responseText,
          actions: ['CHECK_IN_VIRTUE'],
          source: message.content.source
        });
      }
      
      return {
        text: responseText,
        success: true,
        data: {
          virtueId,
          points: result.points,
          isDuplicate: result.isDuplicate,
          newBadges: result.newBadges
        }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'checkInVirtue',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error checking in virtue');
      
      const text = 'Sorry, I encountered an error logging your virtue. Please try again.';
      
      if (callback) {
        await callback({
          text,
          actions: ['CHECK_IN_VIRTUE_ERROR'],
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
          text: 'I practiced temperance today',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: 'Logged **Temperance**! +10 pts',
          actions: ['CHECK_IN_VIRTUE']
        }
      }
    ],
    [
      {
        name: '{{userName}}',
        content: {
          text: 'I practiced humility by admitting my mistake',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: 'Logged **Humility**! +10 pts (+5 streak bonus!)',
          actions: ['CHECK_IN_VIRTUE']
        }
      }
    ]
  ]
};

