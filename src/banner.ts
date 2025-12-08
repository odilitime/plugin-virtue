/**
 * Beautiful plugin settings banner with custom ASCII art
 */

import type { IAgentRuntime } from '@elizaos/core';

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  magenta: '\x1b[35m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
};

export interface BannerOptions {
  pluginName: string;
  description?: string;
  runtime: IAgentRuntime;
}

function line(content: string): string {
  const len = content.replace(/\x1b\[[0-9;]*m/g, '').length;
  if (len > 78) return content.slice(0, 78);
  return content + ' '.repeat(78 - len);
}

export function printBanner(options: BannerOptions): void {
  const { runtime } = options;
  const R = ANSI.reset, D = ANSI.dim, B = ANSI.bold;
  const c1 = ANSI.magenta, G = ANSI.brightGreen, Y = ANSI.brightYellow, M = ANSI.brightMagenta;
  const C = ANSI.brightCyan, W = ANSI.brightWhite;

  const top = `${c1}╔${'═'.repeat(78)}╗${R}`;
  const mid = `${c1}╠${'═'.repeat(78)}╣${R}`;
  const bot = `${c1}╚${'═'.repeat(78)}╝${R}`;
  const row = (s: string) => `${c1}║${R}${line(s)}${c1}║${R}`;

  const lines: string[] = [''];
  lines.push(top);
  lines.push(row(` ${B}Character: ${runtime.character.name}${R}`));
  lines.push(mid);
  lines.push(row(`${Y}  ╔═══╗     ╔═══╗     ╔═══╗     ╔═══╗     ╔═══╗     ╔═══╗${R}`));
  lines.push(row(`${Y}  ║ ${W}V${Y} ║     ║ ${W}I${Y} ║     ║ ${W}R${Y} ║     ║ ${W}T${Y} ║     ║ ${W}U${Y} ║     ║ ${W}E${Y} ║${R}`));
  lines.push(row(`${Y}  ╚═══╝     ╚═══╝     ╚═══╝     ╚═══╝     ╚═══╝     ╚═══╝${R}`));
  lines.push(row(`${D}          Benjamin Franklin's Virtue Tracker${R}`));
  lines.push(mid);
  lines.push(row(`${M} This plugin implements Franklin's 13 virtues with modern gamification:${R}`));
  lines.push(row(``));
  lines.push(row(`   ${C}📅${R} Daily Virtue Check-ins    ${C}🏆${R} Streaks & Leaderboards`));
  lines.push(row(`   ${C}🎯${R} Virtue Challenges         ${C}🤝${R} Mentorship System`));
  lines.push(row(`   ${C}⭐${R} Badges & Achievements     ${C}📈${R} Progress Tracking`));
  lines.push(row(`   ${C}🎮${R} Seasonal Events           ${C}🔄${R} Self-Improving AI Rules`));
  lines.push(row(`   ${C}🔒${R} GDPR Privacy Controls    ${C}📊${R} Historical Comparisons`));
  lines.push(row(``));
  lines.push(row(`   ${G}✓${R} ${D}No configuration required — virtues run automatically!${R}`));
  lines.push(bot);
  lines.push('');

  console.log(lines.join('\n'));
}
