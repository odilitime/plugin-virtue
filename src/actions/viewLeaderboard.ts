import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';

export const viewLeaderboardAction: Action = {
  name: 'VIEW_LEADERBOARD',
  similes: ['SHOW_LEADERBOARD', 'VIRTUE_LEADERBOARD', 'TOP_VIRTUES', 'RANKINGS'],
  description: 'View the community virtue leaderboard',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('leaderboard') || text.includes('rankings') || text.includes('top');
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
      
      // Get world ID from room
      if (!message.roomId) {
        throw new Error('No room context for leaderboard');
      }
      
      const room = await runtime.getRoom(message.roomId);
      if (!room?.worldId) {
        throw new Error('No world context for leaderboard');
      }
      
      const leaderboard = await virtueService.getLeaderboard(room.worldId);
      
      if (!leaderboard || leaderboard.entries.length === 0) {
        const text = 'No leaderboard entries yet. Be the first to practice a virtue!';
        
        if (callback) {
          await callback({
            text,
            actions: ['VIEW_LEADERBOARD'],
            source: message.content.source
          });
        }
        
        return {
          text,
          success: true,
          data: { entries: [] }
        };
      }
      
      // Build leaderboard text
      let leaderboardText = `## 🏆 Virtue Leaderboard\n\n`;
      
      // Top 3 for public message
      const top3 = leaderboard.entries.slice(0, 3);
      for (const entry of top3) {
        const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉';
        leaderboardText += `${medal} **${entry.displayName}** - ${entry.points} pts (${entry.streak} day streak, ${entry.badges} badges)\n`;
      }
      
      // Full leaderboard for DM
      let fullLeaderboard = `## 🏆 Full Virtue Leaderboard\n\n`;
      for (const entry of leaderboard.entries) {
        const prefix = entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`;
        fullLeaderboard += `${prefix} **${entry.displayName}** - ${entry.points} pts (${entry.streak}d, ${entry.badges}🏅)\n`;
      }
      
      // Send public top 3
      if (callback) {
        await callback({
          text: leaderboardText + (leaderboard.entries.length > 3 ? '\n_Check your DM for the full leaderboard_' : ''),
          actions: ['VIEW_LEADERBOARD'],
          source: message.content.source
        });
      }
      
      // Try to send full leaderboard via DM if more than 3 entries
      if (leaderboard.entries.length > 3) {
        try {
          await runtime.emitEvent('SEND_DM', {
            entityId: message.entityId,
            content: { text: fullLeaderboard }
          });
        } catch {
          // DM failed, that's okay
        }
      }
      
      return {
        text: leaderboardText,
        success: true,
        data: {
          entries: leaderboard.entries,
          updatedAt: leaderboard.updatedAt
        }
      };
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'viewLeaderboard',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error viewing leaderboard');
      
      const text = 'Sorry, I couldn\'t retrieve the leaderboard. Please try again.';
      
      if (callback) {
        await callback({
          text,
          actions: ['VIEW_LEADERBOARD_ERROR'],
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
          text: 'Show the virtue leaderboard',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '🏆 Virtue Leaderboard\n\n🥇 **Alice** - 1250 pts\n🥈 **Bob** - 890 pts\n🥉 **Carol** - 675 pts',
          actions: ['VIEW_LEADERBOARD']
        }
      }
    ]
  ]
};

