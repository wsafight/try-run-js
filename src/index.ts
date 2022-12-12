import { isPromise, sleep } from "./utils"

interface TryRunResult<T> {
  result?: T
  error?: any
}

interface TryRunOptions {
  retryTime?: number
  timeOut?: number
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
  timeOut: 500
}

const tryRun = async <T>(
  promiseOrFun: Promise<T> | Function,
  options?: TryRunOptions
): Promise<TryRunResult<T>> => {

  if (isPromise<T>(promiseOrFun)) {
    return runPromise(promiseOrFun)
  }

  if (typeof promiseOrFun === 'function') {
    const { retryTime = 0, timeOut = 500 } = {
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
        await sleep(timeOut)
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