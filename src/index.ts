import { isPromise, sleep } from "./utils"

interface TryRunResult<T> {
  result?: T
  error?: any
}

interface TryRunOptions {
  retryTime: number
  timeOut: number
}

const runPromise = <T, U = Error>(
  promise: Promise<T>,
): Promise<TryRunResult<T>> => {
  return promise
    .then((data: T) => ({ result: data }))
    .catch((error: U) => ({ error }))
}


const tryRun = async <T>(
  promise: Promise<T> | Function,
  options: TryRunOptions
): Promise<TryRunResult<T>> => {
  if (isPromise<T>(promise)) {
    return runPromise(promise)
  }

  if (typeof promise === 'function') {
    const { retryTime, timeOut } = options

    let currentTime: number = 0
    let isSuccess: boolean = false
  
    let result
    let error

    while (currentTime < retryTime && !isSuccess) {
      try {
        result = await promise()
        isSuccess = true
      } catch(err) {
        error = err
        currentTime++
        await sleep(timeOut)
      }
    }
    return isSuccess ? { result } : { error }
  }

  return { error: new Error('promise paras must is function or promise') }
}

export {
  tryRun
}

export default tryRun