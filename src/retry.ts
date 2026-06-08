import type { RetryOptions } from './types'

function getDelay(options: RetryOptions, attempt: number): number {
  const base = options.delayMs ?? 100
  switch (options.backoff ?? 'fixed') {
    case 'fixed': return base
    case 'linear': return base * attempt
    case 'exponential': return base * Math.pow(2, attempt - 1)
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (e) {
      lastError = e
      if (attempt < options.maxAttempts) {
        options.onRetry?.(e, attempt)
        await sleep(getDelay(options, attempt))
      }
    }
  }
  throw lastError
}
