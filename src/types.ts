export type Ok<T> = { readonly ok: true; readonly value: T }
export type Err<E> = { readonly ok: false; readonly error: E }
export type Result<T, E = Error> = Ok<T> | Err<E>

export interface RetryOptions {
  maxAttempts: number
  delayMs?: number
  backoff?: 'fixed' | 'linear' | 'exponential'
  onRetry?: (error: unknown, attempt: number) => void
}

export interface TimeoutOptions {
  ms: number
  message?: string
}

export interface StructuredError {
  code: string
  message: string
  cause?: unknown
  context?: Record<string, unknown>
}
