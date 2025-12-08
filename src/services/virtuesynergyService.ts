import type { IAgentRuntime } from '@elizaos/core';
import { Service } from '@elizaos/core';
import { CACHE_KEYS } from '../constants';

interface VirtueSynergy {
  id: string;
  name: string;
  virtues: string[];
  bonus: number;
  description: string;
}

const DEFAULT_SYNERGIES: VirtueSynergy[] = [
  {
    id: 'balanced_life',
    name: 'Balanced Life',
    virtues: ['temperance', 'moderation', 'tranquility'],
    bonus: 25,
    description: 'Mastery of self-control brings inner peace'
  },
  {
    id: 'wise_leader',
    name: 'Wise Leader',
    virtues: ['wisdom', 'justice', 'humility'],
    bonus: 30,
    description: 'True leadership requires wisdom, fairness, and humility'
  },
  {
    id: 'productive_perfectionist',
    name: 'Productive Perfectionist',
    virtues: ['industry', 'order', 'resolution'],
    bonus: 25,
    description: 'Organized hard work with determination'
  },
  {
    id: 'honest_diplomat',
    name: 'Honest Diplomat',
    virtues: ['sincerity', 'moderation', 'silence'],
    bonus: 20,
    description: 'Truthful communication with measured restraint'
  },
  {
    id: 'franklins_triangle',
    name: "Franklin's Triangle",
    virtues: ['humility', 'industry', 'frugality'],
    bonus: 40,
    description: 'The three pillars Franklin valued most'
  },
  {
    id: 'stoic_core',
    name: 'Stoic Core',
    virtues: ['tranquility', 'moderation', 'resolution'],
    bonus: 30,
    description: 'The foundation of stoic philosophy'
  }
];

export class VirtueSynergyService extends Service {
  static serviceType = 'virtue_synergy';
  
  capabilityDescription = 'Detects and rewards virtue synergy combinations';

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new VirtueSynergyService(runtime);
    await service.initializeSynergies();
    runtime.logger.info({ src: 'plugin:virtue' }, 'VirtueSynergyService started');
    return service;
  }

  async stop(): Promise<void> {
    this.runtime.logger.info({ src: 'plugin:virtue' }, 'VirtueSynergyService stopped');
  }

  private async initializeSynergies(): Promise<void> {
    const existing = await this.runtime.getCache<VirtueSynergy[]>(
      CACHE_KEYS.CONFIG('synergies')
    );
    
    if (!existing) {
      await this.runtime.setCache(CACHE_KEYS.CONFIG('synergies'), DEFAULT_SYNERGIES);
    }
  }

  async checkSynergies(checkInsToday: Record<string, any>): Promise<{ synergies: string[]; bonusPoints: number }> {
    const practicedVirtues = Object.keys(checkInsToday);
    const synergies = await this.runtime.getCache<VirtueSynergy[]>(
      CACHE_KEYS.CONFIG('synergies')
    ) || DEFAULT_SYNERGIES;
    
    const unlocked: string[] = [];
    let bonusPoints = 0;
    
    for (const synergy of synergies) {
      // Check if all virtues in synergy were practiced today
      const hasAll = synergy.virtues.every(v => practicedVirtues.includes(v));
      
      if (hasAll) {
        unlocked.push(synergy.id);
        bonusPoints += synergy.bonus;
      }
    }
    
    return { synergies: unlocked, bonusPoints };
  }

  async getSynergyInfo(synergyId: string): Promise<VirtueSynergy | null> {
    const synergies = await this.runtime.getCache<VirtueSynergy[]>(
      CACHE_KEYS.CONFIG('synergies')
    ) || DEFAULT_SYNERGIES;
    
    return synergies.find(s => s.id === synergyId) || null;
  }

  async getAllSynergies(): Promise<VirtueSynergy[]> {
    return await this.runtime.getCache<VirtueSynergy[]>(
      CACHE_KEYS.CONFIG('synergies')
    ) || DEFAULT_SYNERGIES;
  }

  async addCustomSynergy(synergy: VirtueSynergy): Promise<void> {
    const synergies = await this.getAllSynergies();
    synergies.push(synergy);
    await this.runtime.setCache(CACHE_KEYS.CONFIG('synergies'), synergies);
  }
}

