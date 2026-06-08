import { describe, it, expect } from 'vitest'
import { timeout, TimeoutError } from '../src'

describe('timeout', () => {
  it('resolves before timeout', async () => {
    const result = await timeout(() => Promise.resolve('ok'), { ms: 100 })
    expect(result).toBe('ok')
  })

  it('throws TimeoutError when exceeded', async () => {
    const slow = () => new Promise(resolve => setTimeout(resolve, 200))
    await expect(timeout(slow, { ms: 10 })).rejects.toThrow(TimeoutError)
  })

  it('uses custom message', async () => {
    const slow = () => new Promise(resolve => setTimeout(resolve, 200))
    await expect(timeout(slow, { ms: 10, message: 'too slow' })).rejects.toThrow('too slow')
  })

  it('propagates function errors', async () => {
    const failing = () => Promise.reject(new Error('inner'))
    await expect(timeout(failing, { ms: 100 })).rejects.toThrow('inner')
  })
})
