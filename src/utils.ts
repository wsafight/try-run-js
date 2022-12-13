const isObject = (val: any): val is Object => val !== null &&
  (typeof val === 'object' || typeof val === 'function')

export const isPromise = <T>(val: any): val is Promise<T> => {
  return val instanceof Promise || (
    isObject(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

export const DEFAULT_TIMEOUT: number = 333

export const sleep = (timeOut: number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, timeOut)
  })
}