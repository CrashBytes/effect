import { describe, it, expect, vi } from 'vitest'
import { retry } from '../src'

describe('retry', () => {
  it('returns on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const result = await retry(fn, { maxAttempts: 3 })
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on failure then succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValue('ok')
    const result = await retry(fn, { maxAttempts: 3, delayMs: 1 })
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('throws after max attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'))
    await expect(retry(fn, { maxAttempts: 2, delayMs: 1 })).rejects.toThrow('fail')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('calls onRetry callback', async () => {
    const onRetry = vi.fn()
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok')
    await retry(fn, { maxAttempts: 2, delayMs: 1, onRetry })
    expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1)
  })

  it('supports exponential backoff', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok')
    const start = Date.now()
    await retry(fn, { maxAttempts: 2, delayMs: 10, backoff: 'exponential' })
    expect(Date.now() - start).toBeGreaterThanOrEqual(9)
  })
})
