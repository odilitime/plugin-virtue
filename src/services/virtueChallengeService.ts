import type { IAgentRuntime } from '@elizaos/core';
import { Service } from '@elizaos/core';
import { CACHE_KEYS } from '../constants';

export interface VirtueChallenge {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requirements: {
    type: 'streak' | 'count' | 'synergy' | 'specific_virtues';
    target: number | string[];
    virtueId?: string;
  };
  rewards: {
    points: number;
    badge?: string;
  };
  participants: string[];
  completions: string[];
}

const DEFAULT_CHALLENGES: VirtueChallenge[] = [
  {
    id: 'week_of_wisdom',
    name: 'Week of Wisdom',
    description: 'Practice all 3 wisdom virtues (Silence, Sincerity, Humility) for 7 consecutive days',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    requirements: {
      type: 'streak',
      target: 7,
      virtueId: 'wisdom_cluster'
    },
    rewards: {
      points: 150,
      badge: 'wisdom_master'
    },
    participants: [],
    completions: []
  },
  {
    id: 'centurion',
    name: 'The Centurion',
    description: 'Log 100 total virtue check-ins',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    requirements: {
      type: 'count',
      target: 100
    },
    rewards: {
      points: 200,
      badge: 'centurion'
    },
    participants: [],
    completions: []
  },
  {
    id: 'synergy_seeker',
    name: 'Synergy Seeker',
    description: 'Unlock 3 different virtue synergies',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    requirements: {
      type: 'synergy',
      target: 3
    },
    rewards: {
      points: 100,
      badge: 'synergy_master'
    },
    participants: [],
    completions: []
  }
];

export class VirtueChallengeService extends Service {
  static serviceType = 'virtue_challenge';
  
  capabilityDescription = 'Manages time-limited virtue challenges and quests';

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new VirtueChallengeService(runtime);
    await service.initializeChallenges();
    runtime.logger.info({ src: 'plugin:virtue' }, 'VirtueChallengeService started');
    return service;
  }

  async stop(): Promise<void> {
    this.runtime.logger.info({ src: 'plugin:virtue' }, 'VirtueChallengeService stopped');
  }

  private async initializeChallenges(): Promise<void> {
    const existing = await this.runtime.getCache<VirtueChallenge[]>(
      CACHE_KEYS.CONFIG('challenges')
    );
    
    if (!existing) {
      await this.runtime.setCache(CACHE_KEYS.CONFIG('challenges'), DEFAULT_CHALLENGES);
    }
  }

  async getActiveChallenges(): Promise<VirtueChallenge[]> {
    const challenges = await this.runtime.getCache<VirtueChallenge[]>(
      CACHE_KEYS.CONFIG('challenges')
    ) || DEFAULT_CHALLENGES;
    
    const today = new Date().toISOString().split('T')[0];
    
    return challenges.filter(c => 
      c.startDate <= today && c.endDate >= today
    );
  }

  async joinChallenge(challengeId: string, entityId: string): Promise<boolean> {
    const challenges = await this.runtime.getCache<VirtueChallenge[]>(
      CACHE_KEYS.CONFIG('challenges')
    ) || [];
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return false;
    
    if (!challenge.participants.includes(entityId)) {
      challenge.participants.push(entityId);
      await this.runtime.setCache(CACHE_KEYS.CONFIG('challenges'), challenges);
    }
    
    return true;
  }

  async checkChallengeProgress(
    entityId: string,
    userData: any
  ): Promise<{ completed: string[]; rewards: number }> {
    const challenges = await this.getActiveChallenges();
    const completed: string[] = [];
    let totalRewards = 0;
    
    for (const challenge of challenges) {
      // Skip if not participating
      if (!challenge.participants.includes(entityId)) continue;
      
      // Skip if already completed
      if (challenge.completions.includes(entityId)) continue;
      
      // Check completion
      const isComplete = await this.checkRequirement(challenge, userData);
      
      if (isComplete) {
        completed.push(challenge.id);
        totalRewards += challenge.rewards.points;
        
        // Mark as completed
        challenge.completions.push(entityId);
        const allChallenges = await this.runtime.getCache<VirtueChallenge[]>(
          CACHE_KEYS.CONFIG('challenges')
        ) || [];
        const idx = allChallenges.findIndex(c => c.id === challenge.id);
        if (idx >= 0) {
          allChallenges[idx] = challenge;
          await this.runtime.setCache(CACHE_KEYS.CONFIG('challenges'), allChallenges);
        }
      }
    }
    
    return { completed, rewards: totalRewards };
  }

  private async checkRequirement(challenge: VirtueChallenge, userData: any): Promise<boolean> {
    switch (challenge.requirements.type) {
      case 'count': {
        const totalCheckIns = Object.values(userData.checkIns).reduce((sum: number, day: any) => 
          sum + Object.keys(day).length, 0
        );
        return totalCheckIns >= (challenge.requirements.target as number);
      }
      
      case 'streak': {
        return userData.streaks.current >= (challenge.requirements.target as number);
      }
      
      case 'synergy': {
        // Would need to track synergies unlocked
        return false; // Placeholder
      }
      
      case 'specific_virtues': {
        const required = challenge.requirements.target as string[];
        return required.every(virtueId => 
          Object.values(userData.checkIns).some((day: any) => day[virtueId])
        );
      }
      
      default:
        return false;
    }
  }

  async createChallenge(challenge: VirtueChallenge): Promise<void> {
    const challenges = await this.runtime.getCache<VirtueChallenge[]>(
      CACHE_KEYS.CONFIG('challenges')
    ) || [];
    
    challenges.push(challenge);
    await this.runtime.setCache(CACHE_KEYS.CONFIG('challenges'), challenges);
  }
}

