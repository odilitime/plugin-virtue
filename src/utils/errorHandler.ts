import type { IAgentRuntime } from '@elizaos/core';
import { CACHE_KEYS, ERROR_LOG_MAX_ENTRIES } from '../constants';

export interface ErrorLogEntry {
  timestamp: number;
  context: string;
  error: string;
  entityId?: string;
}

export async function logError(
  runtime: IAgentRuntime,
  context: string,
  error: Error | string,
  entityId?: string
): Promise<void> {
  try {
    const errorLog = await runtime.getCache<ErrorLogEntry[]>(CACHE_KEYS.ERRORS(runtime.agentId)) || [];
    
    errorLog.unshift({
      timestamp: Date.now(),
      context,
      error: error instanceof Error ? error.message : String(error),
      entityId
    });
    
    // Trim to max entries
    if (errorLog.length > ERROR_LOG_MAX_ENTRIES) {
      errorLog.length = ERROR_LOG_MAX_ENTRIES;
    }
    
    await runtime.setCache(CACHE_KEYS.ERRORS(runtime.agentId), errorLog);
    
    runtime.logger.error({
      src: 'plugin:virtue',
      context,
      error: error instanceof Error ? error.message : String(error),
      entityId
    }, `Virtue plugin error: ${context}`);
  } catch (logError) {
    // If logging fails, at least log to console
    runtime.logger.error({
      src: 'plugin:virtue',
      context: 'error-logging-failed',
      originalError: error instanceof Error ? error.message : String(error),
      logError: logError instanceof Error ? logError.message : String(logError)
    }, 'Failed to log error');
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  backoffMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError || new Error('Unknown error in withRetry');
}

