import { DEFAULT_TIMEOUT, isPromise, sleep } from "./utils"

interface TryRunResultRecord<T> {
  result?: T
  error?: Error | null
}

type TryRunResultTuple<T> = [any, undefined] | [null, T]
interface TryRunOptions {
  retryTime?: number
  timeout?: number | ((time: number) => number | Promise<any>)
}

const runPromise = <T>(
  promise: Promise<T>,
): Promise<TryRunResultRecord<T>> => {
  return promise
    .then((data: T) => {
      return { result: data } as TryRunResultRecord<T>
    })
    .catch((error: Error) => {
      return { error } as TryRunResultRecord<T>
    })
}

const DEFAULT_OPTIONS: TryRunOptions = {
  retryTime: 0,
  timeout: DEFAULT_TIMEOUT
}

const tryRun = async <T>(
  promiseOrFun: Promise<T> | Function,
  options?: TryRunOptions
): Promise<TryRunResultRecord<T>> => {

  const runParamIsPromise = isPromise(promiseOrFun)
  const runParamIsFun = typeof promiseOrFun === 'function'

  if (!runParamIsFun && !runParamIsPromise) {
    const paramsError = new Error('first params must is a function or promise')
    return { error: paramsError } as TryRunResultRecord<T>
  }

  if (runParamIsPromise) {
    return runPromise(promiseOrFun as Promise<T>)
  }

  const { retryTime = 0, timeout = DEFAULT_TIMEOUT } = {
    ...DEFAULT_OPTIONS,
    ...options
  }

  let currentTime: number = 0
  let isSuccess: boolean = false

  let result
  let error: Error

  while (currentTime <= retryTime && !isSuccess) {
    try {
      result = await promiseOrFun()
      isSuccess = true
    } catch (err) {
      error = err as Error
      currentTime++
      if (retryTime > 0 && currentTime <= retryTime) {
        let finalTimeout: number | Promise<any> = typeof timeout === 'number' ?
          timeout :
          DEFAULT_TIMEOUT
        if (typeof timeout === 'function') {
          finalTimeout = timeout(currentTime)
        }

        if (isPromise(finalTimeout)) {
          await finalTimeout
        } else {
          if (typeof finalTimeout !== 'number') {
            finalTimeout = DEFAULT_TIMEOUT
          }
          await sleep(finalTimeout)
        }

      }
    }
  }

  if (isSuccess) {
    return { result, error: null }
  }

  return { error: error!, result: undefined }
}

const tryRunForTuple = <T>(
  promiseOrFun: Promise<T> | Function,
  options?: TryRunOptions): Promise<TryRunResultTuple<T>> => {
  return tryRun<T>(promiseOrFun, options).then(res => {
    const { result, error } = res
    if (error) {
      return [error, undefined] as [any, undefined]
    }
    return [null, result] as [null, T]
  })
}

export {
  tryRunForTuple,
  tryRun
}

export default tryRun