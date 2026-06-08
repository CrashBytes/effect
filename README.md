# @crashbytes/effect

[![npm version](https://img.shields.io/npm/v/@crashbytes/effect.svg)](https://www.npmjs.com/package/@crashbytes/effect)
[![license](https://img.shields.io/npm/l/@crashbytes/effect.svg)](https://github.com/crashbytes/effect/blob/main/LICENSE)

Result type, retry, timeout, and structured errors for TypeScript. Zero dependencies.

## Installation

```bash
npm install @crashbytes/effect
```

## Quick Start

### Result Type

Represent success and failure without throwing exceptions.

```typescript
import { ok, err, isOk, map, unwrap, tryCatch, tryCatchAsync } from '@crashbytes/effect'
import type { Result } from '@crashbytes/effect'

// Create results
const success = ok(42)       // { ok: true, value: 42 }
const failure = err('fail')  // { ok: false, error: 'fail' }

// Type guards
if (isOk(success)) {
  console.log(success.value) // 42
}

// Transform values
const doubled = map(ok(21), x => x * 2) // ok(42)

// Unwrap with a default
import { unwrapOr } from '@crashbytes/effect'
const value = unwrapOr(failure, 0) // 0

// Wrap throwing functions
const result = tryCatch(() => JSON.parse('{"a":1}'))

// Wrap async functions
const asyncResult = await tryCatchAsync(() => fetch('/api/data').then(r => r.json()))
```

### Retry

Retry async operations with configurable backoff strategies.

```typescript
import { retry } from '@crashbytes/effect'

const data = await retry(
  () => fetch('/api/data').then(r => r.json()),
  {
    maxAttempts: 3,
    delayMs: 1000,
    backoff: 'exponential', // 'fixed' | 'linear' | 'exponential'
    onRetry: (error, attempt) => {
      console.log(`Attempt ${attempt} failed:`, error)
    },
  }
)
```

### Timeout

Wrap promises with a timeout.

```typescript
import { timeout, TimeoutError } from '@crashbytes/effect'

try {
  const result = await timeout(
    () => fetch('/api/slow-endpoint'),
    { ms: 5000, message: 'API call took too long' }
  )
} catch (e) {
  if (e instanceof TimeoutError) {
    console.log('Timed out!')
  }
}
```

### Structured Errors

Create errors with machine-readable codes and contextual metadata.

```typescript
import { AppError, isAppError } from '@crashbytes/effect'

const error = new AppError({
  code: 'USER_NOT_FOUND',
  message: 'User with ID 123 was not found',
  context: { userId: '123' },
})

// Serialize for logging or API responses
console.log(JSON.stringify(error.toJSON()))

// Type guard
if (isAppError(error)) {
  console.log(error.code) // 'USER_NOT_FOUND'
}
```

## API Reference

### Result

| Function | Description |
|---|---|
| `ok(value)` | Create a success result |
| `err(error)` | Create a failure result |
| `isOk(result)` | Type guard for success |
| `isErr(result)` | Type guard for failure |
| `map(result, fn)` | Transform the success value |
| `mapErr(result, fn)` | Transform the error value |
| `flatMap(result, fn)` | Chain result-returning functions |
| `unwrap(result)` | Extract value or throw error |
| `unwrapOr(result, default)` | Extract value or return default |
| `tryCatch(fn)` | Wrap a sync function in a Result |
| `tryCatchAsync(fn)` | Wrap an async function in a Result |

### Retry

| Function | Description |
|---|---|
| `retry(fn, options)` | Retry an async function with backoff |

**RetryOptions:**
- `maxAttempts` - Maximum number of attempts
- `delayMs` - Base delay in milliseconds (default: 100)
- `backoff` - Backoff strategy: `'fixed'`, `'linear'`, or `'exponential'` (default: `'fixed'`)
- `onRetry` - Callback invoked on each retry with the error and attempt number

### Timeout

| Function / Class | Description |
|---|---|
| `timeout(fn, options)` | Wrap a promise with a timeout |
| `TimeoutError` | Error thrown when timeout is exceeded |

**TimeoutOptions:**
- `ms` - Timeout in milliseconds
- `message` - Custom error message

### Structured Errors

| Function / Class | Description |
|---|---|
| `AppError` | Error class with code, message, cause, and context |
| `isAppError(value)` | Type guard for AppError |

### Types

```typescript
type Ok<T> = { readonly ok: true; readonly value: T }
type Err<E> = { readonly ok: false; readonly error: E }
type Result<T, E = Error> = Ok<T> | Err<E>

interface RetryOptions { ... }
interface TimeoutOptions { ... }
interface StructuredError { ... }
```

## License

MIT
