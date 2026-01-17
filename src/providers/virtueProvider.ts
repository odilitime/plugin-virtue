import type { Provider, IAgentRuntime, Memory, State } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';

export const virtueProvider: Provider = {
  name: 'VIRTUE_CONTEXT',
  description: 'Provides virtue tracking context for the agent',
  dynamic: true,
  
  get: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State
  ): Promise<{ text: string; values: Record<string, any> }> => {
    try {
      const virtueService = runtime.getService<VirtueService>('virtue');
      if (!virtueService) {
        return { text: '', values: {} };
      }
      
      const userData = await virtueService.getUserData(message.entityId);
      
      // Build context summary
      const summary = `[VIRTUE CONTEXT]
User: ${message.entityId}
Current Streak: ${userData.streaks.current} days
Total Points: ${userData.totalPoints}
Badges: ${userData.badges.length}
[/VIRTUE CONTEXT]`;
      
      return {
        text: summary,
        values: {
          virtueStreak: userData.streaks.current,
          virtuePoints: userData.totalPoints,
          virtueBadges: userData.badges.length,
          virtueTimezone: userData.timezone
        }
      };
    } catch {
      return { text: '', values: {} };
    }
  }
};

