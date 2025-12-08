import type { IAgentRuntime } from '@elizaos/core';
import { Service } from '@elizaos/core';
import { ModelType } from '@elizaos/core';
import type { VirtueUserData } from '../types';
import { VIRTUES } from '../constants';

export class VirtueRemixService extends Service {
  static serviceType = 'virtue_remix';
  
  capabilityDescription = 'Provides LLM-powered personalized virtue suggestions';

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new VirtueRemixService(runtime);
    runtime.logger.info({ src: 'plugin:virtue' }, 'VirtueRemixService started');
    return service;
  }

  async stop(): Promise<void> {
    this.runtime.logger.info({ src: 'plugin:virtue' }, 'VirtueRemixService stopped');
  }

  // ============================================================================
  // Personalized Suggestions
  // ============================================================================

  async generateSuggestions(userData: VirtueUserData): Promise<{
    focusVirtues: string[];
    reasoning: string;
    practicalTips: string[];
  }> {
    // Analyze user's practice patterns
    const virtueCount: Record<string, number> = {};
    for (const dayCheckIns of Object.values(userData.checkIns)) {
      for (const [virtueId] of Object.entries(dayCheckIns)) {
        virtueCount[virtueId] = (virtueCount[virtueId] || 0) + 1;
      }
    }

    // Build context for LLM
    const practicedsorted = Object.entries(virtueCount)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => {
        const virtue = VIRTUES.find(v => v.id === id);
        return `${virtue?.name}: ${count} times`;
      });

    const unpracticed = VIRTUES
      .filter(v => !virtueCount[v.id])
      .map(v => v.name);

    const prompt = `You are a virtue cultivation coach analyzing a user's practice history.

**User's Practice History:**
${practicedsorted.join('\n')}

**Unpracticed Virtues:**
${unpracticed.join(', ') || 'None - practicing all virtues!'}

**Current Streak:** ${userData.streaks.current} days

Based on this user's patterns, suggest 3 virtues they should focus on next and why. Consider:
1. Virtues they haven't practiced recently
2. Complementary virtues that work well together
3. Their current strengths and growth areas

Return your response in this exact JSON format:
{
  "focusVirtues": ["virtue1", "virtue2", "virtue3"],
  "reasoning": "Brief explanation of why these virtues",
  "practicalTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    try {
      const response = await this.runtime.useModel(ModelType.TEXT_LARGE, {
        prompt,
        temperature: 0.7,
        maxTokens: 500
      });

      // Parse response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate focus virtues exist
        const validVirtues = parsed.focusVirtues.filter((name: string) =>
          VIRTUES.some(v => v.name.toLowerCase() === name.toLowerCase())
        );

        return {
          focusVirtues: validVirtues.slice(0, 3),
          reasoning: parsed.reasoning || 'Personalized for your practice patterns',
          practicalTips: (parsed.practicalTips || []).slice(0, 3)
        };
      }
    } catch (error) {
      this.runtime.logger.error({
        src: 'plugin:virtue',
        error: error instanceof Error ? error.message : String(error)
      }, 'Failed to generate virtue suggestions');
    }

    // Fallback: suggest unpracticed virtues
    return this.generateFallbackSuggestions(virtueCount);
  }

  private generateFallbackSuggestions(virtueCount: Record<string, number>): {
    focusVirtues: string[];
    reasoning: string;
    practicalTips: string[];
  } {
    // Find least practiced virtues
    const leastPracticed = VIRTUES
      .map(v => ({ name: v.name, count: virtueCount[v.id] || 0 }))
      .sort((a, b) => a.count - b.count)
      .slice(0, 3);

    return {
      focusVirtues: leastPracticed.map(v => v.name),
      reasoning: 'These virtues could use more attention in your practice.',
      practicalTips: [
        'Set a specific time each day to practice',
        'Journal about your experiences',
        'Find an accountability partner'
      ]
    };
  }
}

