import type { IAgentRuntime } from '@elizaos/core';
import { Service } from '@elizaos/core';
import type { SeasonalEvent } from '../types';
import { CACHE_KEYS } from '../constants';

export class SeasonalEventsService extends Service {
  static serviceType = 'virtue_seasonal_events';
  
  capabilityDescription = 'Manages seasonal virtue events and challenges';

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new SeasonalEventsService(runtime);
    
    // Initialize default seasonal events
    await service.initializeDefaultEvents();
    
    runtime.logger.info({ src: 'plugin:virtue', agentId: runtime.agentId }, 'SeasonalEventsService started');
    return service;
  }

  async stop(): Promise<void> {
    this.runtime.logger.info({ src: 'plugin:virtue', agentId: this.runtime.agentId }, 'SeasonalEventsService stopped');
  }

  private async initializeDefaultEvents(): Promise<void> {
    const existingEvents = await this.runtime.getCache<SeasonalEvent[]>(
      CACHE_KEYS.CONFIG('seasonal_events')
    );
    
    if (existingEvents) return;

    const defaultEvents: SeasonalEvent[] = [
      {
        id: 'thanksgiving_gratitude',
        name: 'Thanksgiving Gratitude',
        startDate: new Date(new Date().getFullYear(), 10, 20).toISOString().split('T')[0], // Nov 20
        endDate: new Date(new Date().getFullYear(), 10, 30).toISOString().split('T')[0],   // Nov 30
        virtueId: 'justice', // Closest to gratitude/giving
        pointMultiplier: 2.0,
        badge: 'thanksgiving_2024'
      },
      {
        id: 'new_year_resolution',
        name: 'New Year Resolution Challenge',
        startDate: new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0], // Jan 1
        endDate: new Date(new Date().getFullYear() + 1, 0, 7).toISOString().split('T')[0],   // Jan 7
        virtueId: 'resolution',
        pointMultiplier: 1.5,
        badge: 'new_year_2025'
      },
      {
        id: 'spring_renewal',
        name: 'Spring Renewal',
        startDate: new Date(new Date().getFullYear(), 2, 20).toISOString().split('T')[0], // Mar 20
        endDate: new Date(new Date().getFullYear(), 2, 31).toISOString().split('T')[0],   // Mar 31
        virtueId: 'cleanliness',
        pointMultiplier: 1.5,
        badge: 'spring_renewal'
      }
    ];

    await this.runtime.setCache(CACHE_KEYS.CONFIG('seasonal_events'), defaultEvents);
  }

  // ============================================================================
  // Event Queries
  // ============================================================================

  async getActiveEvents(): Promise<SeasonalEvent[]> {
    const events = await this.runtime.getCache<SeasonalEvent[]>(
      CACHE_KEYS.CONFIG('seasonal_events')
    ) || [];

    const today = new Date().toISOString().split('T')[0];
    
    return events.filter(event => 
      event.startDate <= today && event.endDate >= today
    );
  }

  async getEventForVirtue(virtueId: string): Promise<SeasonalEvent | null> {
    const activeEvents = await this.getActiveEvents();
    return activeEvents.find(e => e.virtueId === virtueId) || null;
  }

  async getPointMultiplier(virtueId: string): Promise<number> {
    const event = await this.getEventForVirtue(virtueId);
    return event ? event.pointMultiplier : 1.0;
  }

  // ============================================================================
  // Event Management
  // ============================================================================

  async addEvent(event: SeasonalEvent): Promise<void> {
    const events = await this.runtime.getCache<SeasonalEvent[]>(
      CACHE_KEYS.CONFIG('seasonal_events')
    ) || [];

    events.push(event);
    await this.runtime.setCache(CACHE_KEYS.CONFIG('seasonal_events'), events);
  }

  async removeEvent(eventId: string): Promise<void> {
    const events = await this.runtime.getCache<SeasonalEvent[]>(
      CACHE_KEYS.CONFIG('seasonal_events')
    ) || [];

    const filtered = events.filter(e => e.id !== eventId);
    await this.runtime.setCache(CACHE_KEYS.CONFIG('seasonal_events'), filtered);
  }
}

