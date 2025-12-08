import type { IAgentRuntime } from '@elizaos/core';
import { Service } from '@elizaos/core';
import type { VirtueUserData } from '../types';

interface HistoricalFigure {
  id: string;
  name: string;
  description: string;
  virtueProfile: Record<string, number>; // Estimated check-ins per virtue
  archetype: string;
  level: number;
}

const HISTORICAL_FIGURES: HistoricalFigure[] = [
  {
    id: 'franklin',
    name: 'Benjamin Franklin',
    description: 'The original virtue tracker - disciplined, industrious, and humble',
    virtueProfile: {
      temperance: 90,
      silence: 60,
      order: 85,
      resolution: 80,
      frugality: 95,
      industry: 100,
      sincerity: 75,
      justice: 85,
      moderation: 70,
      cleanliness: 80,
      tranquility: 65,
      chastity: 70,
      humility: 90
    },
    archetype: 'The Strategist',
    level: 50
  },
  {
    id: 'aurelius',
    name: 'Marcus Aurelius',
    description: 'Stoic emperor - master of tranquility, moderation, and wisdom',
    virtueProfile: {
      temperance: 95,
      silence: 85,
      order: 70,
      resolution: 85,
      frugality: 60,
      industry: 75,
      sincerity: 80,
      justice: 95,
      moderation: 100,
      cleanliness: 65,
      tranquility: 100,
      chastity: 80,
      humility: 90
    },
    archetype: 'The Stoic',
    level: 55
  },
  {
    id: 'gandhi',
    name: 'Mahatma Gandhi',
    description: 'Peaceful revolutionary - exemplar of justice, temperance, and humility',
    virtueProfile: {
      temperance: 100,
      silence: 70,
      order: 65,
      resolution: 95,
      frugality: 90,
      industry: 80,
      sincerity: 95,
      justice: 100,
      moderation: 85,
      cleanliness: 85,
      tranquility: 95,
      chastity: 95,
      humility: 100
    },
    archetype: 'The Guardian',
    level: 60
  }
];

export class HistoricalComparisonService extends Service {
  static serviceType = 'virtue_historical';
  
  capabilityDescription = 'Compares user progress with historical figures';

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new HistoricalComparisonService(runtime);
    runtime.logger.info({ src: 'plugin:virtue' }, 'HistoricalComparisonService started');
    return service;
  }

  async stop(): Promise<void> {
    this.runtime.logger.info({ src: 'plugin:virtue' }, 'HistoricalComparisonService stopped');
  }

  // ============================================================================
  // Comparison Analysis
  // ============================================================================

  compareToFigure(userData: VirtueUserData, figureId: string): {
    figure: HistoricalFigure;
    similarity: number;
    strengths: string[];
    gaps: string[];
    message: string;
  } | null {
    const figure = HISTORICAL_FIGURES.find(f => f.id === figureId);
    if (!figure) return null;

    // Calculate user's virtue counts
    const userVirtueCounts: Record<string, number> = {};
    for (const dayCheckIns of Object.values(userData.checkIns)) {
      for (const [virtueId] of Object.entries(dayCheckIns)) {
        userVirtueCounts[virtueId] = (userVirtueCounts[virtueId] || 0) + 1;
      }
    }

    // Calculate similarity (0-100)
    let similaritySum = 0;
    let virtueCount = 0;

    const strengths: string[] = [];
    const gaps: string[] = [];

    for (const [virtueId, figureCount] of Object.entries(figure.virtueProfile)) {
      const userCount = userVirtueCounts[virtueId] || 0;
      const maxCount = Math.max(figureCount, userCount, 1);
      const similarity = (Math.min(figureCount, userCount) / maxCount) * 100;
      
      similaritySum += similarity;
      virtueCount++;

      // Identify strengths (within 20% of figure)
      if (userCount >= figureCount * 0.8) {
        strengths.push(virtueId);
      }

      // Identify gaps (less than 50% of figure)
      if (userCount < figureCount * 0.5) {
        gaps.push(virtueId);
      }
    }

    const overallSimilarity = Math.round(similaritySum / virtueCount);

    let message = '';
    if (overallSimilarity >= 80) {
      message = `You're remarkably similar to ${figure.name}! Keep up the excellent practice.`;
    } else if (overallSimilarity >= 60) {
      message = `You're on a good path to matching ${figure.name}'s virtue profile.`;
    } else if (overallSimilarity >= 40) {
      message = `You're making progress toward ${figure.name}'s level of virtue cultivation.`;
    } else {
      message = `You're beginning your journey. ${figure.name} practiced for many years - keep going!`;
    }

    return {
      figure,
      similarity: overallSimilarity,
      strengths: strengths.slice(0, 3),
      gaps: gaps.slice(0, 3),
      message
    };
  }

  getAllFigures(): HistoricalFigure[] {
    return HISTORICAL_FIGURES;
  }

  findClosestMatch(userData: VirtueUserData): {
    figure: HistoricalFigure;
    similarity: number;
  } {
    let bestMatch = HISTORICAL_FIGURES[0];
    let bestSimilarity = 0;

    for (const figure of HISTORICAL_FIGURES) {
      const comparison = this.compareToFigure(userData, figure.id);
      if (comparison && comparison.similarity > bestSimilarity) {
        bestSimilarity = comparison.similarity;
        bestMatch = figure;
      }
    }

    return { figure: bestMatch, similarity: bestSimilarity };
  }
}

