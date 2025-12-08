import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { ModelType } from '@elizaos/core';
import { VirtueChallengeService } from '../services/virtueChallengeService';

export const joinChallengeAction: Action = {
  name: 'JOIN_CHALLENGE',
  similes: ['ENTER_CHALLENGE', 'ACCEPT_QUEST'],
  description: 'Join a virtue challenge or quest',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('join') && text.includes('challenge');
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
      
      // Extract challenge name using LLM
      const activeChallenges = await challengeService.getActiveChallenges();
      const challengeNames = activeChallenges.map(c => c.name).join(', ');
      
      const prompt = `Extract the challenge name from this message: "${message.content.text}"

Available challenges: ${challengeNames}

Return ONLY the exact challenge name, or "none" if not found.`;
      
      const response = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 50
      });
      
      const challengeName = response.trim();
      const challenge = activeChallenges.find(c => 
        c.name.toLowerCase() === challengeName.toLowerCase()
      );
      
      if (!challenge) {
        const text = `Challenge not found. Active challenges: ${challengeNames}`;
        
        if (callback) {
          await callback({
            text,
            actions: ['JOIN_CHALLENGE'],
            source: message.content.source
          });
        }
        
        return { text, success: false };
      }
      
      // Join the challenge
      const joined = await challengeService.joinChallenge(challenge.id, message.entityId);
      
      const text = joined
        ? `✅ Joined **${challenge.name}**!\n\n${challenge.description}\n\nGood luck! 🎯`
        : `You're already participating in **${challenge.name}**!`;
      
      if (callback) {
        await callback({
          text,
          actions: ['JOIN_CHALLENGE'],
          source: message.content.source
        });
      }
      
      return {
        text,
        success: true,
        data: { challengeId: challenge.id, joined }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'joinChallenge',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error joining challenge');
      
      const text = 'Sorry, I encountered an error joining the challenge.';
      
      if (callback) {
        await callback({
          text,
          actions: ['JOIN_CHALLENGE_ERROR'],
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
          text: 'Join challenge Week of Wisdom',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ Joined **Week of Wisdom**!',
          actions: ['JOIN_CHALLENGE']
        }
      }
    ]
  ]
};

