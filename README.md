# try-run-js

Read this in other languages: [English](https://github.com/wsafight/try-run-js/blob/main/README.EN.md)

具有重试机制的错误代码包装器，支持传入 Promise 或函数

开发历程可以参考博客 [从 await-to-js 到 try-run-js](https://github.com/wsafight/personBlog/issues/52)


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

| 参数                       | 说明                                  | 类型                       | 默认值  |
| :----------------------- | :---------------------------------- | :----------------------- | :--- |
| promiseOrFun                      | promsie 或者函数  | Function ｜ Promsie                      | -  |
| options.retryTime                | 重试次数    | number                | 0  |
| options.timeout                      | 超时时间或超时函数（参数为重试次数）              | number | (time: number) => number                   | 333   |
| options.returnType | 返回的数据类型  | 'tuple'｜ 'record' | 'record' |

```ts
import tryRun from 'try-run-js'
```

### setReturnType 设置返回类型

```ts
import {
  setReturnType
} from 'try-run-js'

// 使用元组
setReturnType('tuple')

// 使用对象
setReturnType('record')
```

// 导入兼容的组件
import { CompatibleRAnimate as ReactCssAnimate } from "rc-css-animate";
```

## 升级日志
- 1.0.1 优化性能，去除不必要的 prefixCls 处理
- 1.0.0 分离 className 和 animateCls,提供 style 配置
- 0.0.4 支持全局配置 prefix
- 0.0.3 基本可用，支持 RAnimate 以及 CompatibleRAnimate 组件
