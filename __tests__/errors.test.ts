import { describe, it, expect } from 'vitest'
import { AppError, isAppError } from '../src'

describe('AppError', () => {
  it('creates structured error', () => {
    const e = new AppError({ code: 'NOT_FOUND', message: 'not found' })
    expect(e.code).toBe('NOT_FOUND')
    expect(e.message).toBe('not found')
    expect(e.name).toBe('AppError')
    expect(e).toBeInstanceOf(Error)
  })

  it('includes cause and context', () => {
    const cause = new Error('root')
    const e = new AppError({
      code: 'FAIL',
      message: 'failed',
      cause,
      context: { userId: '123' },
    })
    expect(e.cause).toBe(cause)
    expect(e.context).toEqual({ userId: '123' })
  })

  it('serializes to JSON', () => {
    const e = new AppError({ code: 'ERR', message: 'msg' })
    expect(e.toJSON()).toEqual({ code: 'ERR', message: 'msg', cause: undefined, context: undefined })
  })

  it('isAppError type guard', () => {
    expect(isAppError(new AppError({ code: 'X', message: 'x' }))).toBe(true)
    expect(isAppError(new Error('x'))).toBe(false)
    expect(isAppError(null)).toBe(false)
  })
})
