import type { TimeoutOptions } from './types'

export class TimeoutError extends Error {
  constructor(ms: number, message?: string) {
    super(message ?? `Operation timed out after ${ms}ms`)
    this.name = 'TimeoutError'
  }
}

export async function timeout<T>(fn: () => Promise<T>, options: TimeoutOptions): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(options.ms, options.message))
    }, options.ms)

    fn().then(
      (value) => { clearTimeout(timer); resolve(value) },
      (error) => { clearTimeout(timer); reject(error) }
    )
  })
}
