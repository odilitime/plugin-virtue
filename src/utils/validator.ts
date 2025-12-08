import { VIRTUES } from '../constants';

export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

export function normalizeTimezone(input: string): string | null {
  const normalized = input.trim();
  if (isValidTimezone(normalized)) {
    return normalized;
  }
  
  // Try common abbreviations
  const abbreviations: Record<string, string> = {
    'EST': 'America/New_York',
    'PST': 'America/Los_Angeles',
    'CST': 'America/Chicago',
    'MST': 'America/Denver',
    'GMT': 'UTC',
    'UTC': 'UTC',
  };
  
  const upper = normalized.toUpperCase();
  if (abbreviations[upper] && isValidTimezone(abbreviations[upper])) {
    return abbreviations[upper];
  }
  
  return null;
}

export function findVirtueByName(name: string): string | null {
  const normalized = name.toLowerCase().trim();
  
  // Exact match
  const exactMatch = VIRTUES.find(v => v.id === normalized || v.name.toLowerCase() === normalized);
  if (exactMatch) return exactMatch.id;
  
  // Partial match
  const partialMatch = VIRTUES.find(v => 
    v.id.includes(normalized) || 
    v.name.toLowerCase().includes(normalized) ||
    v.keywords.some(k => k.toLowerCase().includes(normalized))
  );
  if (partialMatch) return partialMatch.id;
  
  return null;
}

export function sanitizeCacheKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9:_-]/g, '_');
}

export function isValidRuleProposal(action: string, value: any): boolean {
  if (action === 'adjust_confidence') {
    const val = parseFloat(value);
    return !isNaN(val) && val >= 0.3 && val <= 0.9;
  }
  
  if (action === 'add_keyword' || action === 'add_exclude' || action === 'remove_keyword' || action === 'remove_exclude') {
    const str = String(value);
    // No regex special chars
    if (/[\\^$.*+?()[\]{}|]/.test(str)) return false;
    // Max length
    if (str.length > 50) return false;
    return true;
  }
  
  return false;
}

