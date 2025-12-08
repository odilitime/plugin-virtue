import type { TaskWorker, IAgentRuntime, Task } from '@elizaos/core';
import { VIRTUES, CACHE_KEYS } from '../constants';
import type { CommunityInsights, VirtueUserData } from '../types';
import { logError } from '../utils/errorHandler';

export const communityReportWorker: TaskWorker = {
  name: 'VIRTUE_COMMUNITY_REPORT',
  
  execute: async (
    runtime: IAgentRuntime,
    options: Record<string, unknown>,
    task: Task
  ): Promise<void> => {
    try {
      runtime.logger.info({
        src: 'plugin:virtue',
        task: 'communityReport',
        agentId: runtime.agentId
      }, 'Starting community report generation');
      
      const worldId = options.worldId as string;
      if (!worldId) {
        runtime.logger.warn({ src: 'plugin:virtue' }, 'No worldId provided for community report');
        return;
      }
      
      // Calculate week ID
      const now = new Date();
      const weekId = getWeekId(now);
      
      // Get leaderboard to find all participants
      const leaderboard = await runtime.getCache(`virtue:leaderboard:${worldId}`);
      if (!leaderboard || !leaderboard.entries) {
        runtime.logger.debug({ src: 'plugin:virtue' }, 'No leaderboard data for community report');
        return;
      }
      
      // Aggregate data across all users
      const virtueCount: Record<string, number> = {};
      const hourCounts: Record<number, number> = {};
      let totalCheckIns = 0;
      let activeUsers = 0;
      
      for (const entry of leaderboard.entries) {
        try {
          const userData = await runtime.getCache<VirtueUserData>(
            CACHE_KEYS.USER_DATA(entry.entityId)
          );
          
          if (!userData) continue;
          
          activeUsers++;
          
          // Count check-ins from last 7 days
          const lastWeekDates = getLast7Days();
          for (const date of lastWeekDates) {
            const dayCheckIns = userData.checkIns[date];
            if (!dayCheckIns) continue;
            
            for (const [virtueId, checkIn] of Object.entries(dayCheckIns)) {
              virtueCount[virtueId] = (virtueCount[virtueId] || 0) + 1;
              totalCheckIns++;
              
              // Track hour of check-in
              const hour = new Date(checkIn.timestamp).getHours();
              hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            }
          }
        } catch (error) {
          // Skip user if error
          continue;
        }
      }
      
      // Calculate insights
      const weeklyTrends: CommunityInsights['weeklyTrends'] = {};
      
      for (const virtue of VIRTUES) {
        const count = virtueCount[virtue.id] || 0;
        const percentPracticed = activeUsers > 0 ? (count / activeUsers) * 100 : 0;
        
        weeklyTrends[virtue.id] = {
          percentPracticed: Math.round(percentPracticed),
          changeFromLastWeek: 0, // TODO: Compare to previous week
          totalCheckIns: count
        };
      }
      
      // Find peak practice times
      const peakPracticeTimes = Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      
      // Find most practiced virtue
      const mostPracticed = Object.entries(virtueCount)
        .sort((a, b) => b[1] - a[1])[0];
      
      const insights: CommunityInsights = {
        weekId,
        weeklyTrends,
        peakPracticeTimes,
        mostImprovedVirtue: mostPracticed?.[0] || 'humility',
        participantCount: activeUsers
      };
      
      // Cache insights
      await runtime.setCache(
        CACHE_KEYS.INSIGHTS(worldId, weekId),
        insights
      );
      
      // Generate report message
      const mostPracticedVirtue = VIRTUES.find(v => v.id === mostPracticed?.[0]);
      let report = `📊 **Weekly Community Virtue Report** 📊\n\n`;
      report += `👥 Active practitioners: ${activeUsers}\n`;
      report += `✅ Total check-ins: ${totalCheckIns}\n`;
      report += `🌟 Most practiced: **${mostPracticedVirtue?.name}** (${mostPracticed?.[1]} times)\n\n`;
      
      if (peakPracticeTimes.length > 0) {
        report += `⏰ Peak practice times:\n`;
        for (const peak of peakPracticeTimes) {
          const time = formatHour(peak.hour);
          report += `- ${time}: ${peak.count} check-ins\n`;
        }
      }
      
      report += `\nKeep up the great work, everyone! 🎯`;
      
      // Post report to world (would need a channel/room context)
      runtime.logger.info({
        src: 'plugin:virtue',
        worldId,
        activeUsers,
        totalCheckIns
      }, 'Community report generated');
      
    } catch (error) {
      await logError(runtime, 'communityReport', error as Error);
    }
  }
};

function getWeekId(date: Date): string {
  const year = date.getFullYear();
  const weekNum = getWeekNumber(date);
  return `${year}-W${weekNum.toString().padStart(2, '0')}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getLast7Days(): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
}

