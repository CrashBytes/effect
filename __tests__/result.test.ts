import { describe, it, expect } from 'vitest'
import { ok, err, isOk, isErr, map, mapErr, flatMap, unwrap, unwrapOr, tryCatch, tryCatchAsync } from '../src'

describe('Result', () => {
  describe('ok / err', () => {
    it('creates Ok result', () => {
      const r = ok(42)
      expect(r).toEqual({ ok: true, value: 42 })
    })

    it('creates Err result', () => {
      const r = err('fail')
      expect(r).toEqual({ ok: false, error: 'fail' })
    })
  })

  describe('isOk / isErr', () => {
    it('identifies Ok', () => {
      expect(isOk(ok(1))).toBe(true)
      expect(isOk(err('x'))).toBe(false)
    })

    it('identifies Err', () => {
      expect(isErr(err('x'))).toBe(true)
      expect(isErr(ok(1))).toBe(false)
    })
  })

  describe('map', () => {
    it('maps Ok value', () => {
      expect(map(ok(2), x => x * 3)).toEqual(ok(6))
    })

    it('passes through Err', () => {
      expect(map(err('e'), x => x)).toEqual(err('e'))
    })
  })

  describe('mapErr', () => {
    it('maps Err value', () => {
      expect(mapErr(err('e'), e => e.toUpperCase())).toEqual(err('E'))
    })

    it('passes through Ok', () => {
      expect(mapErr(ok(1), e => e)).toEqual(ok(1))
    })
  })

  describe('flatMap', () => {
    it('chains Ok results', () => {
      const r = flatMap(ok(2), x => ok(x * 3))
      expect(r).toEqual(ok(6))
    })

    it('short-circuits on Err', () => {
      const r = flatMap(err('e') as any, x => ok(x))
      expect(r).toEqual(err('e'))
    })
  })

  describe('unwrap', () => {
    it('unwraps Ok', () => {
      expect(unwrap(ok(42))).toBe(42)
    })

    it('throws on Err', () => {
      expect(() => unwrap(err(new Error('fail')))).toThrow('fail')
    })
  })

  describe('unwrapOr', () => {
    it('returns value for Ok', () => {
      expect(unwrapOr(ok(42), 0)).toBe(42)
    })

    it('returns default for Err', () => {
      expect(unwrapOr(err('e'), 0)).toBe(0)
    })
  })

  describe('tryCatch', () => {
    it('catches success', () => {
      expect(tryCatch(() => 42)).toEqual(ok(42))
    })

    it('catches thrown error', () => {
      const r = tryCatch(() => { throw new Error('boom') })
      expect(isErr(r)).toBe(true)
      if (!r.ok) expect(r.error.message).toBe('boom')
    })

    it('wraps non-Error throws', () => {
      const r = tryCatch(() => { throw 'string error' })
      expect(isErr(r)).toBe(true)
      if (!r.ok) expect(r.error.message).toBe('string error')
    })
  })

  describe('tryCatchAsync', () => {
    it('catches async success', async () => {
      const r = await tryCatchAsync(async () => 42)
      expect(r).toEqual(ok(42))
    })

    it('catches async error', async () => {
      const r = await tryCatchAsync(async () => { throw new Error('async boom') })
      expect(isErr(r)).toBe(true)
      if (!r.ok) expect(r.error.message).toBe('async boom')
    })
  })
})
