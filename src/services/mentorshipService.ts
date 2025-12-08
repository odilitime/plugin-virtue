import type { IAgentRuntime } from '@elizaos/core';
import { Service } from '@elizaos/core';
import { CACHE_KEYS } from '../constants';
import { VirtueService } from './virtueService';

interface MentorshipPair {
  mentorId: string;
  menteeId: string;
  startDate: string;
  totalPointsShared: number;
  status: 'active' | 'completed' | 'cancelled';
}

export class MentorshipService extends Service {
  static serviceType = 'virtue_mentorship';
  
  capabilityDescription = 'Manages mentor-mentee relationships and point sharing';

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new MentorshipService(runtime);
    runtime.logger.info({ src: 'plugin:virtue' }, 'MentorshipService started');
    return service;
  }

  async stop(): Promise<void> {
    this.runtime.logger.info({ src: 'plugin:virtue' }, 'MentorshipService stopped');
  }

  // ============================================================================
  // Mentorship Management
  // ============================================================================

  async createMentorship(mentorId: string, menteeId: string): Promise<MentorshipPair> {
    const pair: MentorshipPair = {
      mentorId,
      menteeId,
      startDate: new Date().toISOString().split('T')[0],
      totalPointsShared: 0,
      status: 'active'
    };

    const allPairs = await this.getAllMentorships();
    allPairs.push(pair);
    await this.runtime.setCache(CACHE_KEYS.CONFIG('mentorships'), allPairs);

    return pair;
  }

  async getMentorships(entityId: string): Promise<{ asMentor: MentorshipPair[]; asMentee: MentorshipPair[] }> {
    const allPairs = await this.getAllMentorships();
    
    return {
      asMentor: allPairs.filter(p => p.mentorId === entityId && p.status === 'active'),
      asMentee: allPairs.filter(p => p.menteeId === entityId && p.status === 'active')
    };
  }

  async endMentorship(mentorId: string, menteeId: string): Promise<boolean> {
    const allPairs = await this.getAllMentorships();
    const pair = allPairs.find(p => 
      p.mentorId === mentorId && 
      p.menteeId === menteeId && 
      p.status === 'active'
    );

    if (pair) {
      pair.status = 'completed';
      await this.runtime.setCache(CACHE_KEYS.CONFIG('mentorships'), allPairs);
      return true;
    }

    return false;
  }

  // ============================================================================
  // Point Sharing (20% to mentor)
  // ============================================================================

  async shareMenteePoints(menteeId: string, pointsEarned: number): Promise<void> {
    const { asMentee } = await this.getMentorships(menteeId);
    
    if (asMentee.length === 0) return;

    const mentorShare = Math.floor(pointsEarned * 0.2); // 20% to mentor
    
    for (const pair of asMentee) {
      try {
        // Award points to mentor
        const virtueService = this.runtime.getService<VirtueService>('virtue');
        if (!virtueService) continue;

        const mentorData = await virtueService.getUserData(pair.mentorId);
        mentorData.totalPoints += mentorShare;
        await virtueService.saveUserData(pair.mentorId, mentorData);

        // Update pair stats
        const allPairs = await this.getAllMentorships();
        const currentPair = allPairs.find(p => 
          p.mentorId === pair.mentorId && 
          p.menteeId === pair.menteeId
        );
        if (currentPair) {
          currentPair.totalPointsShared += mentorShare;
          await this.runtime.setCache(CACHE_KEYS.CONFIG('mentorships'), allPairs);
        }

        // Notify mentor
        await this.notifyMentor(pair.mentorId, mentorShare, menteeId);
      } catch (error) {
        this.runtime.logger.error({
          src: 'plugin:virtue',
          error: error instanceof Error ? error.message : String(error)
        }, 'Failed to share mentee points');
      }
    }
  }

  private async notifyMentor(mentorId: string, points: number, menteeId: string): Promise<void> {
    try {
      await this.runtime.emitEvent('SEND_DM', {
        entityId: mentorId,
        content: {
          text: `🎓 Your mentee earned virtue points! You received ${points} pts (20% mentor bonus)`
        }
      });
    } catch {
      // Silent failure
    }
  }

  private async getAllMentorships(): Promise<MentorshipPair[]> {
    return await this.runtime.getCache<MentorshipPair[]>(
      CACHE_KEYS.CONFIG('mentorships')
    ) || [];
  }
}

