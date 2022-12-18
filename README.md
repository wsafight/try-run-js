# try-run-js

Read this in other languages:
[English](https://github.com/wsafight/try-run-js/blob/main/README.EN.md)

具有重试机制的错误代码包装器，支持传入 Promise 或函数

开发历程可以参考博客
[从 await-to-js 到 try-run-js](https://github.com/wsafight/personBlog/issues/52)

## 安装

```bash
npm install try-run-js
```

或者

```bash
yarn install try-run-js
```

## 用法

### 参数

| 参数                 | 说明                 | 类型                 | 默认值                      |
| :----------------- | :----------------- | :----------------- | :----------------------- |
| promiseOrFun       | promsie 或者函数       | Function ｜ Promsie | -                        |
| options.retryTime  | 重试次数               | number             | 0                        |
| options.timeout    | 超时时间或超时函数（参数为重试次数） | number  ｜(time: number) => number  ｜ time: number) => Promise<any>  | 333 |

```ts
import tryRun, { tryRunForTuple } from "try-run-js";

const { result } = await tryRun(Promise.resolve(12));
// => result 12

const { error } = await tryRun(Promise.reject(12));
// => error 12

// 第一个为错误，第二个是结果
const [_error, tupleResult] = await tryRunForTuple(Promise.resolve(12), {
  // 返回信息为元组
});
// => tupleResult 12

const [tupleError, _tupleResult] = await tryRunForTuple(Promise.reject(12));
// => tupleError 12
```

```ts
let index = 0;
const { result } = await tryRun<any>(() => {
  index++;
  // 第三次运行时候会返回结果
  if (index === 3) {
    return Promise.resolve(222);
  }
  return Promise.reject(12);
}, {
  retryTime: 3,
});
// 222

const options = {
  // 重试 3 次
  retryTime: 3,
  // 每次 3s 之后重试
  timeout: 3000,
};

// 也可以传递函数
options.timeout = (time: number): number => {
  // 当前第几次重试 * 1000
  // 第一次 1000，第二次 2000，依此类推
  return time * 1000;
};

// 也可以使用异步函数
options.timeout =  (time: number) => {
  return new Promise(resolve => [
    requestAnimationFrame(() => {
      resolve()
    })
  ])
};

const { result: styleResult, error } = await tryRun(() => {
  const dom = document.getElementById("ppt");
  // dom 节点不存在此时会报错，函数有错误重试机制
  return dom.style;
}, options);

if (error) {
  // 处理错误触发 ...
  return;
}

// 获取样式结果
styleResult;
```

## 升级日志
- 0.0.11 代码优化
- 0.0.10 tryRun 函数出错时返回值设定为 null
- 0.0.9 添加 timeout 可以返回 Promise
- 0.0.8 去除 return-type 设置，分离为 tryRun 和 tryRunForTuple 两个函数
- 0.0.7 修复最后一次重试后也会等待的 bug
- 0.0.5 完成文档
- 0.0.4 完成基本功能，函数可以用在可能出错的地方需要重试的地方
