import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { ModelType } from '@elizaos/core';
import { MentorshipService } from '../services/mentorshipService';

export const becomeMentorAction: Action = {
  name: 'BECOME_MENTOR',
  similes: ['MENTOR_USER', 'BE_MENTOR'],
  description: 'Become a mentor to another user (earn 20% of their points)',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('mentor') && (text.includes('become') || text.includes('be'));
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: any,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const mentorshipService = runtime.getService<MentorshipService>('virtue_mentorship');
      if (!mentorshipService) {
        throw new Error('Mentorship service not available');
      }
      
      // Extract mentee user
      const prompt = `Extract the username or user ID from this message: "${message.content.text}"
      
Return ONLY the username/ID (without @), or "none" if not found.`;
      
      const response = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt,
        temperature: 0.2,
        maxTokens: 50
      });
      
      const menteeId = response.trim().replace('@', '');
      
      if (menteeId === 'none' || !menteeId) {
        const text = 'Please specify who you want to mentor: `Become mentor to @username`';
        
        if (callback) {
          await callback({
            text,
            actions: ['BECOME_MENTOR'],
            source: message.content.source
          });
        }
        
        return { text, success: false };
      }
      
      // Create mentorship
      const pair = await mentorshipService.createMentorship(message.entityId, menteeId);
      
      const text = `✅ You are now mentoring <@${menteeId}>!

🎓 As a mentor, you'll earn **20% of their virtue points** as they practice.

Guide them on their virtue journey and watch your own points grow!`;
      
      if (callback) {
        await callback({
          text,
          actions: ['BECOME_MENTOR'],
          source: message.content.source
        });
      }
      
      // Notify mentee
      try {
        await runtime.emitEvent('SEND_DM', {
          entityId: menteeId,
          content: {
            text: `🎓 <@${message.entityId}> is now your virtue mentor! They'll support your practice journey.`
          }
        });
      } catch {
        // Silent failure
      }
      
      return {
        text,
        success: true,
        data: { pair }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'becomeMentor',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error creating mentorship');
      
      const text = 'Sorry, I encountered an error setting up the mentorship.';
      
      if (callback) {
        await callback({
          text,
          actions: ['BECOME_MENTOR_ERROR'],
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
          text: 'Become mentor to @alice',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ You are now mentoring @alice!',
          actions: ['BECOME_MENTOR']
        }
      }
    ]
  ]
};

