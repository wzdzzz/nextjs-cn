---
title: instrumentation.js
description: API 参考，用于 instrumentation.js 文件。
related:
  title: 了解更多关于 Instrumentation
  links:
    - app/building-your-application/optimizing/instrumentation
---

`instrumentation.js|ts` 文件用于将监控和日志工具集成到您的应用程序中。这使您能够跟踪应用程序的性能和行为，并在生产环境中调试问题。

要使用它，将文件放置在应用程序的 **根目录** 或者如果使用了一个，放置在 [`src` 文件夹](/docs/app/building-your-application/configuring/src-directory) 内部。

## 配置选项

Instrumentation 目前是实验性功能，要使用 `instrumentation` 文件，您必须通过在 `next.config.js` 中定义 [`experimental.instrumentationHook = true;`](/docs/app/api-reference/next-config-js/instrumentationHook) 来明确选择加入：

```js filename="next.config.js"
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
}
```

## 导出

### `register` (必需)

该文件导出了一个 `register` 函数，当初始化一个新的 Next.js 服务器实例时，该函数被调用 **一次** 。`register` 可以是一个异步函数。

```ts filename="instrumentation.ts" switcher
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

```js filename="instrumentation.js" switcher
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

## 版本历史

| 版本   | 变更                                                   |
| --------- | ------------------------------------------------------- |
| `v14.0.4` | 对 `instrumentation` 的 Turbopack 支持                 |
| `v13.2.0` | 将 `instrumentation` 作为实验性功能引入               |