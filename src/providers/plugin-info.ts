/**
 * Plugin Information Providers for Virtue Plugin
 */

import type { IAgentRuntime, Provider, ProviderResult, Memory, State } from '@elizaos/core';

export const virtueInstructionsProvider: Provider = {
  name: 'virtueInstructions',
  description: 'Instructions for the virtue ethics plugin',
  dynamic: true,

  get: async (runtime: IAgentRuntime, _message: Memory, _state: State): Promise<ProviderResult> => {
    const instructions = `
# Virtue Plugin Capabilities

## What This Plugin Does

The virtue plugin guides agent behavior through ethical principles and virtue-based decision making.

## Features

- **Ethical Framework**: Apply virtue ethics to decisions
- **Value Alignment**: Ensure actions match values
- **Moral Reasoning**: Process ethical dilemmas
- **Integrity Maintenance**: Stay true to principles

## Core Virtues

- **Honesty**: Truthfulness in all communications
- **Kindness**: Compassion and helpfulness
- **Fairness**: Just and equitable treatment
- **Wisdom**: Good judgment in decisions
- **Integrity**: Consistency of character

## Best Practices

1. **Principle First**: Let values guide actions
2. **Transparency**: Be open about reasoning
3. **Consistency**: Apply principles uniformly
4. **Reflection**: Consider ethical implications
`;

    return {
      text: instructions.trim(),
      data: { pluginName: 'virtue' },
    };
  },
};

export const virtueSettingsProvider: Provider = {
  name: 'virtueSettings',
  description: 'Current virtue configuration',
  dynamic: true,

  get: async (runtime: IAgentRuntime, _message: Memory, _state: State): Promise<ProviderResult> => {
    return {
      text: `# Virtue Plugin Settings\n\n- **Status**: Enabled\n- **Ethics Framework**: Virtue-based`,
      data: { pluginEnabled: true },
      values: { pluginEnabled: 'true' },
    };
  },
};

