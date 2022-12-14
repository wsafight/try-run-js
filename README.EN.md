# try-run-js

An error code wrapper with a retry mechanism that supports passing in Promise or functions

## Install

```bash
npm install try-run-js
```

or

```bash
yarn install try-run-js
```

## Usage

### parameter

| parameter                 | desc                | type                 | default                     |
| :----------------- | :----------------- | :----------------- | :----------------------- |
| promiseOrFun       | promise or function    | Function ｜ Promsie | -                        |
| options.retryTime  | number of retries        | number             | 0                        |
| options.timeout    | Timeout or timeout function (the parameter is the number of retries) | number  ｜(time: number) => number  ｜ time: number) => Promise<any>  | 333 |

```ts
import tryRun, { tryRunForTuple } from "try-run-js";

const { result } = await tryRun(Promise.resolve(12));
// => result 12

const { error } = await tryRun(Promise.reject(12));
// => error 12

// The first is the error, the second is the result
const [_error, tupleResult] = await tryRunForTuple(Promise.resolve(12));
// => tupleResult 12

const [tupleError, _tupleResult] = await tryRunForTuple(Promise.reject(12));
// => tupleError 12
```

```ts
let index = 0;
const { result } = await tryRun<any>(() => {
  index++;
  // The result will be returned on the third run
  if (index === 3) {
    return Promise.resolve(222);
  }
  return Promise.reject(12);
}, {
  retryTime: 3,
});
// 222

const options = {
  // retry 3 times
  retryTime: 3,
  // Retry after every 3s
  timeout: 3000,
};

// It is also possible to pass functions
options.timeout = (time: number) => {
  // The current number of retries * 1000
  // 1000 the first time, 2000 the second time, and so on
  return time * 1000;
};

// You can also use async functions
options.timeout =  (time: number) => {
  return new Promise(resolve => [
    requestAnimationFrame(() => {
      resolve()
    })
  ])
};

const { result: styleResult, error } = await tryRun(() => {
  const dom = document.getElementById("ppt");
  // If the dom node does not exist, an error will be reported at this time, and the function has an error retry mechanism
  return dom.style;
}, options);

if (error) {
  // Handling error triggers ...
  return;
}

// get style result
styleResult;
```

## Changelog
- 0.0.12 Fix default value error
- 0.0.11 Code optimization
- 0.0.10 The return value of the tryRun function is set to null on error
- 0.0.9 Add timeout to return Promise
- 0.0.8 Remove the return type setting and separate it into two functions tryRun and tryRunForTuple
- 0.0.7 Fixed a bug that would also wait after the last retry
- 0.0.5 complete docs
- 0.0.4 To complete the basic functions, the function can be used in places that may go wrong and need to be retried