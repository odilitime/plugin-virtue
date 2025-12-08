import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';
import { VIRTUES, BADGES } from '../constants';

function calculateLevel(points: number): number {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

function renderAttributeBar(name: string, value: number, max: number): string {
  const filled = Math.round((value / max) * 10);
  const empty = 10 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = Math.round((value / max) * 100);
  return `**${name}** [${bar}] ${percent}%`;
}

export const viewCharacterSheetAction: Action = {
  name: 'VIEW_CHARACTER_SHEET',
  similes: ['SHOW_CHARACTER', 'MY_CHARACTER', 'CHARACTER_STATS', 'VIRTUE_STATS'],
  description: 'View your RPG-style virtue character sheet',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('character') || text.includes('stats') || text.includes('sheet');
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
      const level = calculateLevel(userData.totalPoints);
      
      // Build character sheet
      let sheet = `## 📜 Virtue Character Sheet\n\n`;
      sheet += `**Class:** ${dna.archetype}\n`;
      sheet += `**Level:** ${level} (${userData.totalPoints} pts)\n\n`;
      
      sheet += `### Attributes\n`;
      sheet += renderAttributeBar('Self-Control', dna.clusterScores['self-control'] || 0, 10) + '\n';
      sheet += renderAttributeBar('Wisdom', dna.clusterScores['wisdom'] || 0, 10) + '\n';
      sheet += renderAttributeBar('Discipline', dna.clusterScores['discipline'] || 0, 10) + '\n';
      sheet += renderAttributeBar('Courage', dna.clusterScores['courage'] || 0, 10) + '\n';
      sheet += renderAttributeBar('Compassion', dna.clusterScores['compassion'] || 0, 10) + '\n\n';
      
      sheet += `### Stats\n`;
      sheet += `🔥 **Streak:** ${userData.streaks.current} days (Best: ${userData.streaks.longest})\n`;
      sheet += `🏅 **Badges:** ${userData.badges.length} earned\n`;
      
      const primaryVirtue = VIRTUES.find(v => v.id === dna.primary);
      const growthVirtue = VIRTUES.find(v => v.id === dna.growth);
      
      sheet += `📈 **Primary Virtue:** ${primaryVirtue?.name || 'None'}\n`;
      sheet += `🌱 **Growth Area:** ${growthVirtue?.name || 'None'}\n\n`;
      
      if (dna.traits.length > 0) {
        sheet += `### Traits\n`;
        for (const trait of dna.traits) {
          sheet += `• ${trait}\n`;
        }
      }
      
      // Try to send via DM
      try {
        await runtime.emitEvent('SEND_DM', {
          entityId: message.entityId,
          content: { text: sheet }
        });
        
        const publicResponse = `I've sent your character sheet via DM! 📜`;
        
        if (callback) {
          await callback({
            text: publicResponse,
            actions: ['VIEW_CHARACTER_SHEET'],
            source: message.content.source
          });
        }
        
        return {
          text: publicResponse,
          success: true,
          data: { sentViaDM: true, dna }
        };
      } catch {
        // DM failed, send publicly
        if (callback) {
          await callback({
            text: sheet,
            actions: ['VIEW_CHARACTER_SHEET'],
            source: message.content.source
          });
        }
        
        return {
          text: sheet,
          success: true,
          data: { sentViaDM: false, dna }
        };
      }
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'viewCharacterSheet',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error viewing character sheet');
      
      const text = 'Sorry, I couldn\'t generate your character sheet. Please try again.';
      
      if (callback) {
        await callback({
          text,
          actions: ['VIEW_CHARACTER_SHEET_ERROR'],
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
          text: 'Show my character sheet',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: 'I\'ve sent your character sheet via DM! 📜',
          actions: ['VIEW_CHARACTER_SHEET']
        }
      }
    ]
  ]
};

