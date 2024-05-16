---
title: 仪器化
description: 学习如何在 Next.js 应用中使用仪器化在服务器启动时运行代码
related:
  title: 了解更多关于仪器化
  links:
    - app/api-reference/file-conventions/instrumentation
    - app/api-reference/next-config-js/instrumentationHook
---

# 仪器化
仪器化是使用代码将监控和日志工具集成到您的应用程序中的过程。这使您能够跟踪应用程序的性能和行为，并在生产中调试问题。

## 约定

要设置仪器化，请在项目的**根目录**中创建 `instrumentation.ts|js` 文件（如果使用了一个，则在 [`src`](/docs/app/building-your-application/configuring/src-directory) 文件夹内）。

然后，在文件中导出一个 `register` 函数。当启动新的 Next.js 服务器实例时，将**仅调用一次**此函数。

例如，要使用 Next.js 与 [OpenTelemetry](https://opentelemetry.io/) 和 [@vercel/otel](https://vercel.com/docs/observability/otel-overview)：

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

查看 [Next.js 与 OpenTelemetry 示例](https://github.com/vercel/next.js/tree/canary/examples/with-opentelemetry) 以获取完整实现。

> **须知**
>
> - 此功能为**实验性**。要使用它，您必须通过在 `next.config.js` 中定义 [`experimental.instrumentationHook = true;`](/docs/app/api-reference/next-config-js/instrumentationHook) 明确选择加入。
> - `instrumentation` 文件应在项目的根目录中，而不是在 `app` 或 `pages` 目录内。如果您正在使用 `src` 文件夹，则将文件放置在 `src` 中，与 `pages` 和 `app` 并列。
> - 如果您使用 [`pageExtensions` 配置选项](/docs/app/api-reference/next-config-js/pageExtensions) 添加后缀，您还需要更新 `instrumentation` 文件名以匹配。
## 示例

### 导入具有副作用的文件

有时，您可能会因为其引起的副作用而希望在代码中导入某个文件。例如，您可能会导入一个定义了一组全局变量的文件，但从未在代码中显式使用该导入的文件。尽管如此，您仍然可以访问包所声明的全局变量。

我们建议您在 `register` 函数中使用 JavaScript `import` 语法导入文件。以下示例演示了在 `register` 函数中基本使用 `import` 的方法：

```ts filename="instrumentation.ts" switcher
export async function register() {
  await import('package-with-side-effect')
}
```

```js filename="instrumentation.js" switcher
export async function register() {
  await import('package-with-side-effect')
}
```

> **须知：**
>
> 我们建议您在 `register` 函数内部导入文件，而不是在文件顶部导入。通过这种方式，您可以将所有副作用集中在代码中的一个地方，避免在文件顶部全局导入时产生任何意外后果。

### 导入特定运行时的代码

Next.js 在所有环境中调用 `register`，因此重要的是要有条件地导入任何不支持特定运行时的代码（例如 [Edge 或 Node.js](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)）。您可以使用 `NEXT_RUNTIME` 环境变量来获取当前环境：

```ts filename="instrumentation.ts" switcher
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation-edge')
  }
}
```

```js filename="instrumentation.js" switcher
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation-edge')
  }
}
```