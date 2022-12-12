import { DEFAULT_TIMEOUT, isPromise, sleep } from "./utils"

interface TryRunResult<T> {
  result?: T
  error?: any
}

interface TryRunOptions {
  retryTime?: number
  timeout?: number | ((time: number) => number)
}

const runPromise = <T, U = Error>(
  promise: Promise<T>,
): Promise<TryRunResult<T>> => {
  return promise
    .then((data: T) => ({ result: data }))
    .catch((error: U) => ({ error }))
}

const DEFAULT_OPTIONS: TryRunOptions = {
  retryTime: 0,
  timeout: DEFAULT_TIMEOUT
}

const tryRun = async <T>(
  promiseOrFun: Promise<T> | Function,
  options?: TryRunOptions
): Promise<TryRunResult<T>> => {

  if (isPromise<T>(promiseOrFun)) {
    return runPromise(promiseOrFun)
  }

  if (typeof promiseOrFun === 'function') {
    const { retryTime = 0, timeout = DEFAULT_TIMEOUT } = {
      ...DEFAULT_OPTIONS,
      ...options
    }

    let currentTime: number = 0
    let isSuccess: boolean = false

    let result
    let error

    while (currentTime <= retryTime && !isSuccess) {
      try {
        result = await promiseOrFun()
        isSuccess = true
      } catch (err) {
        error = err
        currentTime++
      
        if (retryTime > 0) {
          let finalTimeout: number = typeof timeout === 'number' ? timeout : 0
          if (typeof timeout === 'function') {
            finalTimeout = timeout(currentTime)
          }
          if (typeof finalTimeout !== 'number') {
            finalTimeout = DEFAULT_TIMEOUT
          }
          await sleep(finalTimeout)
        }
      }
    }
    return isSuccess ? { result } : { error }
  }

  return { error: new Error('first params must is a function or promise') }
}

export {
  tryRun
}

export default tryRun