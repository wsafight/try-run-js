import {
  getReturnType,
  ReturnType,
  setReturnType
} from "./return-type"
import { DEFAULT_TIMEOUT, isPromise, sleep } from "./utils"

interface TryRunResultRecord<T> {
  result?: T
  error?: Error
}

type TryRunResultTuple<T> = [Error, undefined] | [null, T]
interface TryRunOptions {
  retryTime?: number
  timeout?: number | ((time: number) => number)
  returnType?: ReturnType
}

const runPromise = <T>(
  promise: Promise<T>,
  returnType: ReturnType
): Promise<TryRunResultRecord<T> | TryRunResultTuple<T>> => {
  return promise
    .then((data: T) => {
      if (returnType === 'tuple') {
        return [null, data] as TryRunResultTuple<T>
      } else {
        return { result: data } as TryRunResultRecord<T>
      }
    })
    .catch((error: Error) => {
      if (returnType === 'tuple') {
        return [error, undefined] as TryRunResultTuple<T>
      } else {
        return { error } as TryRunResultRecord<T>
      }
    })
}

const DEFAULT_OPTIONS: TryRunOptions = {
  retryTime: 0,
  timeout: DEFAULT_TIMEOUT
}

const tryRun = async <T>(
  promiseOrFun: Promise<T> | Function,
  options?: TryRunOptions
): Promise<any> => {

  const runParamIsPromise = isPromise(promiseOrFun)
  const runParamIsFun = typeof promiseOrFun === 'function'

  let { returnType } = options || {}

  if (!returnType) {
    returnType = getReturnType() || 'record'
  }

  const isTupleResult: boolean = returnType === 'tuple'

  if (!runParamIsFun && !runParamIsPromise) {
    const paramsError = new Error('first params must is a function or promise')
    if (returnType === 'tuple') {
      return [paramsError, undefined] as TryRunResultTuple<T>
    }
    return { error: paramsError } as TryRunResultRecord<T>
  }

  const { retryTime = 0, timeout = DEFAULT_TIMEOUT } = {
    ...DEFAULT_OPTIONS,
    ...options
  }

  if (runParamIsPromise) {
    return runPromise(promiseOrFun as Promise<T>, returnType)
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
      if (retryTime > 0 && currentTime > retryTime) {
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

  if (isSuccess) {
    return isTupleResult ? [null, result] : { result }
  }

  return isTupleResult ? [error!, undefined] : { error: error! }
}

export {
  tryRun,
  setReturnType
}

export default tryRun