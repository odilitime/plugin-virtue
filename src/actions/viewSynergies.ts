import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueSynergyService } from '../services/virtuesynergyService';
import { VIRTUES } from '../constants';

export const viewSynergiesAction: Action = {
  name: 'VIEW_SYNERGIES',
  similes: ['SHOW_SYNERGIES', 'VIRTUE_COMBOS', 'SYNERGY_BONUSES'],
  description: 'View available virtue synergy combinations',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('synerg') || (text.includes('combo') && text.includes('virtue'));
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: any,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const synergyService = runtime.getService<VirtueSynergyService>('virtue_synergy');
      if (!synergyService) {
        throw new Error('Synergy service not available');
      }
      
      const synergies = await synergyService.getAllSynergies();
      
      let text = `## 🔗 Virtue Synergy Combinations\n\n`;
      text += `Practice multiple virtues in one day to unlock bonus points!\n\n`;
      
      for (const synergy of synergies) {
        const virtueNames = synergy.virtues.map(id => 
          VIRTUES.find(v => v.id === id)?.name || id
        );
        
        text += `**${synergy.name}** (+${synergy.bonus} pts)\n`;
        text += `${synergy.description}\n`;
        text += `Requires: ${virtueNames.join(', ')}\n\n`;
      }
      
      text += `✨ Combine virtues to maximize your points!`;
      
      if (callback) {
        await callback({
          text,
          actions: ['VIEW_SYNERGIES'],
          source: message.content.source
        });
      }
      
      return {
        text,
        success: true,
        data: { synergies }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'viewSynergies',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error viewing synergies');
      
      const text = 'Sorry, I couldn\'t retrieve the synergy combinations.';
      
      if (callback) {
        await callback({
          text,
          actions: ['VIEW_SYNERGIES_ERROR'],
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
          text: 'Show virtue synergies',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '🔗 Virtue Synergy Combinations...',
          actions: ['VIEW_SYNERGIES']
        }
      }
    ]
  ]
};

