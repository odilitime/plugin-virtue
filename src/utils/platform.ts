/**
 * @fileoverview Platform Detection Utilities
 * 
 * Why Platform Abstraction:
 * - Plugin is platform-agnostic (works on Discord, Telegram, Twitter)
 * - Platform-specific features (Discord timestamps, embeds) need detection
 * - Future: Add more platforms without changing core logic
 * 
 * Design Decisions:
 * 1. Why string matching on message.content.source
 *    - Simple and reliable
 *    - Source is set by elizaOS client adapters
 *    - Alternative: Enum or constant
 *    - Rejected: Would require changes to elizaOS core
 * 
 * 2. Why 'unknown' fallback
 *    - Graceful degradation if platform unrecognized
 *    - Code works, just doesn't use platform-specific features
 *    - Better than throwing errors
 * 
 * 3. Why hasMention uses regex
 *    - Works across all platforms (@username format is universal)
 *    - Fast (compiled once)
 *    - Simple pattern: @ followed by word characters
 */

import type { Memory } from '@elizaos/core';

export type Platform = 'discord' | 'telegram' | 'twitter' | 'unknown';

/**
 * Detects which platform a message came from
 * 
 * Why lowercase comparison:
 * - message.content.source might have inconsistent casing
 * - 'Discord' vs 'discord' should both work
 * 
 * Why includes (not equals):
 * - Source might be 'discord-client' or 'telegram-bot'
 * - Flexible matching handles variations
 * 
 * @param message - elizaOS message object
 * @returns Platform identifier or 'unknown'
 */
export function getPlatform(message: Memory): Platform {
  const source = message.content.source?.toLowerCase();
  if (source?.includes('discord')) return 'discord';
  if (source?.includes('telegram')) return 'telegram';
  if (source?.includes('twitter')) return 'twitter';
  return 'unknown';
}

/**
 * Checks if message is from Discord
 * 
 * Why helper function (not just getPlatform === 'discord'):
 * - Clearer intent: isDiscord(msg) vs getPlatform(msg) === 'discord'
 * - Common pattern: Discord has many special features
 * - Future: Could add Discord-specific checks (guild vs DM, etc.)
 */
export function isDiscord(message: Memory): boolean {
  return getPlatform(message) === 'discord';
}

/**
 * Checks if text contains @mentions
 * 
 * Why this matters:
 * - Virtue detection context clue: "I helped @user" vs "I helped"
 * - First is clearly helping someone (justice)
 * - Second might be self-referential claim
 * 
 * Why regex (not string.includes('@')):
 * - '@' alone could be email or other context
 * - '@\w+' ensures it's actually a mention format
 * - Works across platforms (Discord, Telegram, Twitter all use @username)
 * 
 * @param text - Message text to check
 * @returns true if text contains @username pattern
 */
export function hasMention(text: string | undefined): boolean {
  if (!text) return false;
  return /@\w+/.test(text);
}

