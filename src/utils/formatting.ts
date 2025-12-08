export function formatTimestamp(unixSeconds: number, platform: string): string {
  if (platform === 'discord') {
    return `<t:${unixSeconds}:F>`;
  }
  return new Date(unixSeconds * 1000).toLocaleString();
}

export function formatRelativeTime(unixSeconds: number, platform: string): string {
  if (platform === 'discord') {
    return `<t:${unixSeconds}:R>`;
  }
  
  const diff = Date.now() / 1000 - unixSeconds;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function toLocalDate(date: Date, timezone: string): string {
  try {
    return date.toLocaleDateString('en-CA', { timeZone: timezone });
  } catch {
    return date.toLocaleDateString('en-CA', { timeZone: 'UTC' });
  }
}

export function getYesterday(dateStr: string, timezone: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return toLocalDate(date, timezone);
}

export function getPreviousDay(dateStr: string, timezone: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return toLocalDate(date, timezone);
}

