---
title: 自定义应用
description: 通过覆盖 Next.js 使用的默认 App 组件，控制页面初始化，并添加一个在所有页面中持久存在的布局。
---

Next.js 使用 `App` 组件来初始化页面。您可以覆盖它并控制页面初始化，并：

- 创建页面更改之间的共享布局
- 向页面注入额外的数据
- [添加全局 CSS](/docs/pages/building-your-application/styling)

## 使用方法

要覆盖默认的 `App`，请按照以下方式创建 `pages/_app` 文件：

```tsx filename="pages/_app.tsx" switcher
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

```jsx filename="pages/_app.jsx" switcher
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

`Component` 属性是活动的 `page`，因此每当您在路由之间导航时，`Component` 将更改为新的 `page`。因此，您发送到 `Component` 的任何属性都将由 `page` 接收。

`pageProps` 是一个对象，其中包含我们的 [数据获取方法](/docs/pages/building-your-application/data-fetching) 为您的页面预加载的初始属性，否则它是一个空对象。

> **须知**
>
> - 如果您的应用程序正在运行，并且您添加了一个自定义的 `App`，则需要重新启动开发服务器。仅在之前不存在 `pages/_app.js` 时才需要。
> - `App` 不支持 Next.js [数据获取方法](/docs/pages/building-your-application/data-fetching)，如 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 或 [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)。

## `App` 中的 `getInitialProps`

在 `App` 中使用 [`getInitialProps`](/docs/pages/api-reference/functions/get-initial-props) 将禁用没有 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 的页面的 [自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization)。

**我们不建议使用此模式。** 相反，考虑逐步采用 App Router，这使您更容易为 [页面和布局](/docs/app/building-your-application/routing/layouts-and-templates) 获取数据。

```tsx filename="pages/_app.tsx" switcher
import App, { AppContext, AppInitialProps, AppProps } from 'next/app'

type AppOwnProps = { example: string }

export default function MyApp({
  Component,
  pageProps,
  example,
}: AppProps & AppOwnProps) {
  return (
    <>
      <p>数据：{example}</p>
      <Component {...pageProps} />
    </>
  )
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context)

  return { ...ctx, example: 'data' }
}
```

```jsx filename="pages/_app.jsx" switcher
import App from 'next/app'

export default function MyApp({ Component, pageProps, example }) {
  return (
    <>
      <p>数据：{example}</p>
      <Component {...pageProps} />
    </>
  )
}

MyApp.getInitialProps = async (context) => {
  const ctx = await App.getInitialProps(context)

  return { ...ctx, example: 'data' }
}
```