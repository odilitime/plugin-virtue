import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueChallengeService } from '../services/virtueChallengeService';

export const viewChallengesAction: Action = {
  name: 'VIEW_CHALLENGES',
  similes: ['SHOW_CHALLENGES', 'VIRTUE_CHALLENGES', 'ACTIVE_QUESTS'],
  description: 'View active virtue challenges and quests',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('challenge') || text.includes('quest');
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: any,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const challengeService = runtime.getService<VirtueChallengeService>('virtue_challenge');
      if (!challengeService) {
        throw new Error('Challenge service not available');
      }
      
      const challenges = await challengeService.getActiveChallenges();
      
      if (challenges.length === 0) {
        const text = 'No active challenges right now. Check back soon! 🎯';
        
        if (callback) {
          await callback({
            text,
            actions: ['VIEW_CHALLENGES'],
            source: message.content.source
          });
        }
        
        return {
          text,
          success: true,
          data: { challenges: [] }
        };
      }
      
      let text = `## 🏆 Active Virtue Challenges\n\n`;
      
      for (const challenge of challenges) {
        text += `**${challenge.name}**\n`;
        text += `${challenge.description}\n`;
        text += `⏰ Ends: ${challenge.endDate}\n`;
        text += `🎁 Reward: ${challenge.rewards.points} points`;
        if (challenge.rewards.badge) {
          text += ` + ${challenge.rewards.badge} badge`;
        }
        text += `\n`;
        text += `👥 ${challenge.participants.length} joined, ${challenge.completions.length} completed\n\n`;
      }
      
      text += `Type "Join challenge [name]" to participate!`;
      
      if (callback) {
        await callback({
          text,
          actions: ['VIEW_CHALLENGES'],
          source: message.content.source
        });
      }
      
      return {
        text,
        success: true,
        data: { challenges }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'viewChallenges',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error viewing challenges');
      
      const text = 'Sorry, I couldn\'t retrieve the challenges.';
      
      if (callback) {
        await callback({
          text,
          actions: ['VIEW_CHALLENGES_ERROR'],
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
          text: 'Show active challenges',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '🏆 Active Virtue Challenges...',
          actions: ['VIEW_CHALLENGES']
        }
      }
    ]
  ]
};

