import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../../services/virtueService';
import { BADGES } from '../../constants';
import { ModelType } from '@elizaos/core';

export const awardBadgeAction: Action = {
  name: 'ADMIN_AWARD_BADGE',
  similes: ['GIVE_BADGE', 'GRANT_BADGE'],
  description: 'Admin: Manually award a badge to a user',
  
  validate: async (runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    if (!text.includes('award') && !text.includes('give')) return false;
    if (!text.includes('badge')) return false;
    
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
      
      // Extract user and badge using LLM
      const prompt = `Extract the user ID and badge name from this admin command: "${message.content.text}"

Available badges: ${BADGES.map(b => b.id).join(', ')}

Return in format: userID|badgeId
Example: alice123|week_warrior

Or return "none" if unclear.`;
      
      const response = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 100
      });
      
      const parts = response.trim().split('|');
      if (parts.length !== 2 || parts[0] === 'none') {
        const text = `Please specify user and badge: \`award badge week_warrior to @username\`\n\nAvailable badges: ${BADGES.map(b => b.name).join(', ')}`;
        
        if (callback) {
          await callback({
            text,
            actions: ['ADMIN_AWARD_BADGE'],
            source: message.content.source
          });
        }
        
        return { text, success: false };
      }
      
      const [targetEntityId, badgeId] = parts;
      const badge = BADGES.find(b => b.id === badgeId);
      
      if (!badge) {
        const text = `Unknown badge: ${badgeId}. Available: ${BADGES.map(b => b.id).join(', ')}`;
        
        if (callback) {
          await callback({
            text,
            actions: ['ADMIN_AWARD_BADGE'],
            source: message.content.source
          });
        }
        
        return { text, success: false };
      }
      
      // Award badge
      const userData = await virtueService.getUserData(targetEntityId);
      if (!userData.badges.includes(badge.id)) {
        userData.badges.push(badge.id);
        await virtueService.saveUserData(targetEntityId, userData);
      }
      
      const text = `✅ Awarded **${badge.name}** badge to <@${targetEntityId}>!`;
      
      if (callback) {
        await callback({
          text,
          actions: ['ADMIN_AWARD_BADGE'],
          source: message.content.source
        });
      }
      
      return {
        text,
        success: true,
        data: { targetEntityId, badgeId }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'adminAwardBadge',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error awarding badge');
      
      const text = 'Sorry, I encountered an error awarding the badge.';
      
      if (callback) {
        await callback({
          text,
          actions: ['ADMIN_AWARD_BADGE_ERROR'],
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
          text: 'Award badge week_warrior to @alice',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ Awarded **Week Warrior** badge to @alice!',
          actions: ['ADMIN_AWARD_BADGE']
        }
      }
    ]
  ]
};

