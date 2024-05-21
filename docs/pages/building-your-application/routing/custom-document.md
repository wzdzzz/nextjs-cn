---
title: 自定义文档
description: 扩展 Next.js 添加的默认文档标记。
---

自定义的 `Document` 可以更新用于呈现[页面](/docs/pages/building-your-application/routing/pages-and-layouts)的 `<html>` 和 `<body>` 标签。

要覆盖默认的 `Document`，请按照以下示例创建 `pages/_document` 文件：

```tsx filename="pages/_document.tsx" switcher
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

```jsx filename="pages/_document.jsx" switcher
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

> **须知**
>
> - `_document` 仅在服务器上渲染，因此不能在此文件中使用 `onClick` 等事件处理器。
> - `<Html>`、`<Head />`、`<Main />` 和 `<NextScript />` 是正确渲染页面所必需的。

## 注意事项

- 在 `_document` 中使用的 `<Head />` 组件与 [`next/head`](/docs/pages/api-reference/components/head) 不同。此处使用的 `<Head />` 组件仅应用于所有页面共有的 `<head>` 代码。对于其他情况，如 `<title>` 标签，我们建议在页面或组件中使用 [`next/head`](/docs/pages/api-reference/components/head)。
- 在 `<Main />` 外部的 React 组件将不会被浏览器初始化。不要在这里添加应用逻辑或自定义 CSS（如 `styled-jsx`）。如果您需要在所有页面中共享组件（如菜单或工具栏），请阅读 [布局](/docs/pages/building-your-application/routing/pages-and-layouts#layout-pattern)。
- `Document` 当前不支持 Next.js [数据获取方法](/docs/pages/building-your-application/data-fetching)，如 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 或 [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)。
## 自定义 `renderPage`

自定义 `renderPage` 是高级操作，仅用于支持服务器端渲染的库，如 CSS-in-JS。对于内置的 `styled-jsx` 支持，这不是必需的。

**我们不推荐使用这种模式。** 相反，考虑[逐步采用](/docs/app/building-your-application/upgrading/app-router-migration) App Router，这可以让您更轻松地获取[页面和布局](/docs/app/building-your-application/routing/layouts-and-templates)的数据。

```tsx filename="pages/_document.tsx" switcher
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage

    // 同步运行 React 渲染逻辑
    ctx.renderPage = () =>
      originalRenderPage({
        // 有助于包装整个 React 树
        enhanceApp: (App) => App,
        // 有助于在每个页面的基础上包装
        enhanceComponent: (Component) => Component,
      })

    // 运行父级 `getInitialProps`，现在它包含了自定义的 `renderPage`
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

```jsx filename="pages/_document.jsx" switcher
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage

    // 同步运行 React 渲染逻辑
    ctx.renderPage = () =>
      originalRenderPage({
        // 有助于包装整个 React 树
        enhanceApp: (App) => App,
        // 有助于在每个页面的基础上包装
        enhanceComponent: (Component) => Component,
      })

    // 运行父级 `getInitialProps`，现在它包含了自定义的 `renderPage`
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

> **须知**
>
> - `_document` 中的 `getInitialProps` 在客户端转换期间不会被调用。
> - `_document` 的 `ctx` 对象等同于在 [`getInitialProps`](/docs/pages/api-reference/functions/get-initial-props#context-object) 中接收到的对象，另外还包括了 `renderPage`。