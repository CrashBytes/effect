import type { StructuredError } from './types'

export class AppError extends Error implements StructuredError {
  readonly code: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>

  constructor(options: StructuredError) {
    super(options.message)
    this.name = 'AppError'
    this.code = options.code
    this.cause = options.cause
    this.context = options.context
  }

  toJSON(): StructuredError {
    return {
      code: this.code,
      message: this.message,
      cause: this.cause,
      context: this.context,
    }
  }
}

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError
}
