---
title: 错误处理
description: 在你的 Next.js 应用中处理错误。
---

本文档解释了你如何处理 Next.js 应用中的开发、服务器端和客户端错误。

## 开发中的错误处理

在你的 Next.js 应用的开发阶段，如果出现运行时错误，你将遇到一个 **覆盖层**。它是一个覆盖在网页上的模态框。它 **仅在** 使用 `next dev` 通过 `pnpm dev`、`npm run dev`、`yarn dev` 或 `bun dev` 运行开发服务器时可见，并且不会在生产环境中显示。修复错误将自动关闭覆盖层。

以下是覆盖层的一个示例：

{/* TODO UPDATE SCREENSHOT */}
![开发模式下覆盖层的示例](https://assets.vercel.com/image/upload/v1645118290/docs-assets/static/docs/error-handling/overlay.png)

## 处理服务器错误

Next.js 默认提供一个静态的 500 页面来处理你应用中发生的服务器端错误。你也可以通过创建一个 `pages/500.js` 文件来[自定义这个页面](/docs/pages/building-your-application/routing/custom-error#customizing-the-500-page)。

在你应用中拥有一个 500 页面并不会向应用用户显示具体的错误。

你还可以使用 [404 页面](/docs/pages/building-your-application/routing/custom-error#404-page) 来处理特定的运行时错误，如 `文件未找到`。
## 处理客户端错误

React [错误边界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) 是一种优雅处理客户端 JavaScript 错误的方法，这样应用程序的其他部分可以继续工作。除了防止页面崩溃外，它还允许您提供自定义的回退组件，甚至记录错误信息。

要为您的 Next.js 应用程序使用错误边界，您必须创建一个类组件 `ErrorBoundary` 并在 `pages/_app.js` 文件中包装 `Component` 属性。这个组件将负责：

- 在抛出错误后渲染一个回退 UI
- 提供一种重置应用程序状态的方法
- 记录错误信息

您可以通过扩展 `React.Component` 来创建一个 `ErrorBoundary` 类组件。例如：

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    // 定义一个状态变量来跟踪是否发生了错误
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    // 更新状态以便下一次渲染将显示回退 UI

    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    // 您可以在这里使用自己的错误记录服务
    console.log({ error, errorInfo })
  }
  render() {
    // 检查是否抛出了错误
    if (this.state.hasError) {
      // 您可以渲染任何自定义的回退 UI
      return (
        <div>
          <h2>哎呀，出错了！</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            再试一次？
          </button>
        </div>
      )
    }

    // 如果没有错误，返回子组件

    return this.props.children
  }
}

export default ErrorBoundary
```

`ErrorBoundary` 组件跟踪一个 `hasError` 状态。这个状态变量的值是一个布尔值。当 `hasError` 的值为 `true` 时，`ErrorBoundary` 组件将渲染一个回退 UI。否则，它将渲染子组件。

创建 `ErrorBoundary` 组件后，在 `pages/_app.js` 文件中导入它，以包装 Next.js 应用程序中的 `Component` 属性。

```jsx
// 导入 ErrorBoundary 组件
import ErrorBoundary from '../components/ErrorBoundary'

function MyApp({ Component, pageProps }) {
  return (
    // 用 ErrorBoundary 组件包装 Component 属性
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default MyApp
```

您可以在 React 的文档中了解更多关于 [错误边界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) 的信息。

### 报告错误

要监控客户端错误，请使用像 [Sentry](https://github.com/vercel/next.js/tree/canary/examples/with-sentry)、Bugsnag 或 Datadog 这样的服务。