import type { TaskWorker, IAgentRuntime, Task } from '@elizaos/core';
import { ModelType } from '@elizaos/core';
import type { VirtueDetectionRule, RuleProposal, RuleChangelogEntry } from '../types';
import { CACHE_KEYS, CHANGELOG_MAX_ENTRIES } from '../constants';
import { isValidRuleProposal } from '../utils/validator';
import { logError } from '../utils/errorHandler';

export const ruleRefinementWorker: TaskWorker = {
  name: 'VIRTUE_RULE_REFINEMENT',
  
  execute: async (
    runtime: IAgentRuntime,
    options: Record<string, unknown>,
    task: Task
  ): Promise<void> => {
    try {
      runtime.logger.info({
        src: 'plugin:virtue',
        task: 'ruleRefinement',
        agentId: runtime.agentId
      }, 'Starting rule refinement task');
      
      // 1. Fetch current rules
      const rules = await runtime.getCache<VirtueDetectionRule[]>(
        CACHE_KEYS.RULES(runtime.agentId)
      );
      
      if (!rules || rules.length === 0) {
        runtime.logger.debug({ src: 'plugin:virtue' }, 'No rules to refine');
        return;
      }
      
      // 2. Build prompt for LLM
      const prompt = buildRefinementPrompt(rules);
      
      // 3. Call LLM for suggestions
      const response = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt,
        temperature: 0.3,
        maxTokens: 2000
      });
      
      // 4. Parse and validate proposed changes
      const proposals = parseRuleProposals(response);
      const validProposals = validateProposals(proposals, rules);
      
      if (validProposals.length === 0) {
        runtime.logger.debug({ src: 'plugin:virtue' }, 'No valid proposals from refinement');
        return;
      }
      
      // 5. Apply valid changes
      const updatedRules = applyProposals(rules, validProposals);
      
      // 6. Save updated rules
      await runtime.setCache(CACHE_KEYS.RULES(runtime.agentId), updatedRules);
      
      // 7. Log changelog entry
      await appendChangelog(runtime, task.id || 'unknown', validProposals);
      
      runtime.logger.info({
        src: 'plugin:virtue',
        proposalCount: validProposals.length
      }, 'Rule refinement completed');
      
    } catch (error) {
      await logError(runtime, 'ruleRefinement', error as Error);
    }
  }
};

function buildRefinementPrompt(rules: VirtueDetectionRule[]): string {
  let prompt = `You are reviewing virtue detection rules for a community bot.

## Current Rules
`;
  
  for (const rule of rules) {
    prompt += `\n### ${rule.virtueId}
- Keywords: ${rule.keywords.join(', ')}
- Exclude: ${rule.excludePatterns.join(', ')}
- Confidence: ${rule.confidence}
`;
  }
  
  prompt += `\n## Your Task
Analyze the rules and suggest improvements. You may ONLY:
1. Add/remove keywords (simple phrases, no regex)
2. Add/remove exclude patterns (simple phrases)
3. Adjust confidence scores (between 0.3 and 0.9)

You may NOT:
- Add regex patterns
- Create new virtues
- Change virtue IDs or names

## Response Format (JSON ONLY)
Return a JSON object with this exact structure:
{
  "proposals": [
    {
      "virtueId": "humility",
      "action": "add_keyword",
      "value": "my fault",
      "reasoning": "Common in apologies"
    }
  ]
}

Return ONLY the JSON object, no other text.`;
  
  return prompt;
}

function parseRuleProposals(response: string): RuleProposal[] {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.proposals || [];
  } catch {
    return [];
  }
}

function validateProposals(
  proposals: RuleProposal[],
  currentRules: VirtueDetectionRule[]
): RuleProposal[] {
  return proposals.filter(p => {
    // Must reference existing virtue
    if (!currentRules.find(r => r.virtueId === p.virtueId)) return false;
    
    // Must be valid proposal
    if (!isValidRuleProposal(p.action, p.value)) return false;
    
    return true;
  });
}

function applyProposals(
  rules: VirtueDetectionRule[],
  proposals: RuleProposal[]
): VirtueDetectionRule[] {
  const updatedRules = JSON.parse(JSON.stringify(rules)) as VirtueDetectionRule[];
  
  for (const proposal of proposals) {
    const rule = updatedRules.find(r => r.virtueId === proposal.virtueId);
    if (!rule) continue;
    
    switch (proposal.action) {
      case 'add_keyword':
        if (!rule.keywords.includes(String(proposal.value))) {
          rule.keywords.push(String(proposal.value));
        }
        break;
        
      case 'remove_keyword':
        rule.keywords = rule.keywords.filter(k => k !== proposal.value);
        break;
        
      case 'add_exclude':
        if (!rule.excludePatterns.includes(String(proposal.value))) {
          rule.excludePatterns.push(String(proposal.value));
        }
        break;
        
      case 'remove_exclude':
        rule.excludePatterns = rule.excludePatterns.filter(p => p !== proposal.value);
        break;
        
      case 'adjust_confidence':
        rule.confidence = Number(proposal.value);
        break;
    }
  }
  
  return updatedRules;
}

async function appendChangelog(
  runtime: IAgentRuntime,
  taskId: string,
  proposals: RuleProposal[]
): Promise<void> {
  try {
    const changelog = await runtime.getCache<RuleChangelogEntry[]>(
      CACHE_KEYS.RULES_CHANGELOG(runtime.agentId)
    ) || [];
    
    changelog.unshift({
      timestamp: Date.now(),
      taskId,
      changes: proposals.map(p => ({
        virtueId: p.virtueId,
        action: p.action,
        oldValue: null,
        newValue: p.value,
        reasoning: p.reasoning
      }))
    });
    
    // Trim to max entries
    if (changelog.length > CHANGELOG_MAX_ENTRIES) {
      changelog.length = CHANGELOG_MAX_ENTRIES;
    }
    
    await runtime.setCache(
      CACHE_KEYS.RULES_CHANGELOG(runtime.agentId),
      changelog
    );
  } catch (error) {
    runtime.logger.error({
      src: 'plugin:virtue',
      context: 'appendChangelog',
      error: error instanceof Error ? error.message : String(error)
    }, 'Failed to append changelog');
  }
}

