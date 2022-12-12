export const isPromise = <T>(val: any): val is Promise<T> => {
  return val instanceof Promise
}

export const DEFAULT_TIMEOUT: number = 333

export const sleep = (timeOut: number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, timeOut)
  })
}