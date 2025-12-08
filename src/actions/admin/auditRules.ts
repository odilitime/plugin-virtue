import type { Action, ActionResult, IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';
import { CACHE_KEYS } from '../../constants';
import type { RuleChangelogEntry } from '../../types';

export const auditRulesAction: Action = {
  name: 'ADMIN_AUDIT_RULES',
  similes: ['VIEW_RULE_CHANGES', 'RULE_HISTORY'],
  description: 'Admin: View rule refinement changelog',
  
  validate: async (runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
    const text = message.content.text?.toLowerCase() || '';
    if (!text.includes('audit') && !text.includes('rule')) return false;
    
    // Check if user is admin
    try {
      const role = await runtime.getUserServerRole(message.entityId);
      return role === 'ADMIN' || role === 'MODERATOR';
    } catch {
      return false;
    }
  },
  
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state?: State,
    _options?: any,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      const changelog = await runtime.getCache<RuleChangelogEntry[]>(
        CACHE_KEYS.RULES_CHANGELOG(runtime.agentId)
      ) || [];
      
      if (changelog.length === 0) {
        const text = 'No rule changes yet. The refinement task will update rules automatically.';
        
        if (callback) {
          await callback({
            text,
            actions: ['ADMIN_AUDIT_RULES'],
            source: message.content.source
          });
        }
        
        return { text, success: true, data: { changelog: [] } };
      }
      
      // Build changelog report
      let report = `## 🔍 Rule Refinement Changelog\n\n`;
      
      for (const entry of changelog.slice(0, 10)) {
        const date = new Date(entry.timestamp).toLocaleDateString();
        report += `**${date}**\n`;
        for (const change of entry.changes) {
          report += `- ${change.virtueId}: ${change.action} → "${change.newValue}"\n`;
          report += `  _${change.reasoning}_\n`;
        }
        report += '\n';
      }
      
      // Try to send via DM
      try {
        await runtime.emitEvent('SEND_DM', {
          entityId: message.entityId,
          content: { text: report }
        });
        
        const publicResponse = '✅ I\'ve sent the rule audit log via DM!';
        
        if (callback) {
          await callback({
            text: publicResponse,
            actions: ['ADMIN_AUDIT_RULES'],
            source: message.content.source
          });
        }
        
        return {
          text: publicResponse,
          success: true,
          data: { changelog, sentViaDM: true }
        };
      } catch {
        // DM failed, send summary
        const text = `📊 Rule changes: ${changelog.length} entries in changelog`;
        
        if (callback) {
          await callback({
            text,
            actions: ['ADMIN_AUDIT_RULES'],
            source: message.content.source
          });
        }
        
        return {
          text,
          success: true,
          data: { changelog, sentViaDM: false }
        };
      }
    } catch (error) {
      runtime.logger.error({
        src: 'plugin:virtue',
        action: 'adminAuditRules',
        error: error instanceof Error ? error.message : String(error)
      }, 'Error auditing rules');
      
      const text = 'Sorry, I encountered an error retrieving the rule audit log.';
      
      if (callback) {
        await callback({
          text,
          actions: ['ADMIN_AUDIT_RULES_ERROR'],
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
          text: 'Audit virtue rules',
          actions: []
        }
      },
      {
        name: '{{agentName}}',
        content: {
          text: '✅ I\'ve sent the rule audit log via DM!',
          actions: ['ADMIN_AUDIT_RULES']
        }
      }
    ]
  ]
};

