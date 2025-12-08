import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { VirtueService } from '../services/virtueService';

export const exportDataAction: Action = {
  name: 'EXPORT_DATA',
  similes: ['EXPORT_VIRTUE_DATA', 'DOWNLOAD_DATA', 'GET_DATA'],
  description: 'Export your virtue tracking data as JSON',
  
  validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    return text.includes('export') && (text.includes('data') || text.includes('virtue'));
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
      
      // Build export data
      const exportData = {
        exported: new Date().toISOString(),
        userData,
        dnaProfile: dna,
        version: 1
      };
      
      const jsonData = JSON.stringify(exportData, null, 2);
      
      // Try to send via DM
      try {
        await runtime.emitEvent('SEND_DM', {
          entityId: message.entityId,
          content: { 
            text: `Here's your virtue data export:\n\`\`\`json\n${jsonData.slice(0, 1500)}${jsonData.length > 1500 ? '...\n(truncated)' : ''}\n\`\`\``
          }
        });
        
        const publicResponse = '✅ I\'ve sent your data export via DM!';
        
        if (callback) {
          await callback({
            text: publicResponse,
            actions: ['EXPORT_DATA'],
            source: message.content.source
          });
        }
        
        return {
          text: publicResponse,
          success: true,
          data: { exportData, sentViaDM: true }
        };
      } catch {
        // DM failed, send confirmation only
        const text = '✅ Data export prepared. Contact an admin to retrieve it.';
        
        if (callback) {
          await callback({
            text,
            actions: ['EXPORT_DATA'],
            source: message.content.source
          });
        }
        
        return {
          text,
          success: true,
          data: { exportData, sentViaDM: false }
        };
      }
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'exportData',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error exporting data');
      
      const text = 'Sorry, I encountered an error exporting your data.';
      
      if (callback) {
        await callback({
          text,
          actions: ['EXPORT_DATA_ERROR'],
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
          text: 'Export my virtue data',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ I\'ve sent your data export via DM!',
          actions: ['EXPORT_DATA']
        }
      }
    ]
  ]
};

