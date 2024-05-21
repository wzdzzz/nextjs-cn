---
title: 页面和布局
description: 使用页面路由创建你的第一个页面和共享布局。
---

页面路由拥有一个基于文件系统的路由，构建在页面的概念之上。

当一个文件被添加到 `pages` 目录时，它会自动作为一个路由可用。

在 Next.js 中，一个 **页面** 是一个从 `.js`、`.jsx`、`.ts` 或 `.tsx` 文件中导出的 [React 组件](https://react.dev/learn/your-first-component)，位于 `pages` 目录中。每个页面都根据其文件名关联到一个路由。

**示例**：如果你创建了 `pages/about.js` 并导出了一个如下的 React 组件，它将在 `/about` 处可访问。

```jsx
export default function About() {
  return <div>About</div>
}
```


## 索引路由

路由会自动将命名为 `index` 的文件路由到目录的根路径。

- `pages/index.js` → `/`
- `pages/blog/index.js` → `/blog`


## 嵌套路由

路由支持嵌套文件。如果你创建了一个嵌套的文件夹结构，文件将自动以相同的方式被路由。

- `pages/blog/first-post.js` → `/blog/first-post`
- `pages/dashboard/settings/username.js` → `/dashboard/settings/username`


## 动态路由页面

Next.js 支持动态路由页面。例如，如果你创建了一个名为 `pages/posts/[id].js` 的文件，那么它将在 `posts/1`、`posts/2` 等处可访问。

> 要了解更多关于动态路由的信息，请查看 [动态路由文档](/docs/pages/building-your-application/routing/dynamic-routes)。


## 布局模式

React 模型允许我们将一个 [页面](/docs/pages/building-your-application/routing/pages-and-layouts) 分解为一系列组件。这些组件中的许多经常在页面之间重复使用。例如，你可能在每个页面上都有相同的导航栏和页脚。

```jsx filename="components/layout.js"
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```


## 示例


### 单个共享布局与自定义 App

如果你的整个应用程序只有一个布局，你可以创建一个 [自定义 App](/docs/pages/building-your-application/routing/custom-app) 并将你的应用程序用布局包装起来。由于 `<Layout />` 组件在换页时会被重复使用，其组件状态将被保留（例如输入值）。

```jsx filename="pages/_app.js"
import Layout from '../components/layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```
### 页面布局

如果你需要多个布局，你可以在你的页面上添加一个 `getLayout` 属性，允许你返回一个 React 组件作为布局。这允许你按 _每页_ 定义布局。由于我们返回的是一个函数，如果需要，我们可以拥有复杂的嵌套布局。

```jsx filename="pages/index.js"

import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'

export default function Page() {
  return (
    /** 你的内容 */
  )
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}
```

```jsx filename="pages/_app.js"
export default function MyApp({ Component, pageProps }) {
  // 如果可用，使用页面级别定义的布局
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

在页面之间导航时，我们希望为单页应用程序 (SPA) 体验 _保持_ 页面状态（输入值、滚动位置等）。

这种布局模式能够使状态保持，因为在页面转换之间维护了 React 组件树。有了组件树，React 可以理解哪些元素发生了变化以保持状态。

> **须知**：这个过程称为 [协调](https://react.dev/learn/preserving-and-resetting-state)，这是 React 理解哪些元素发生了变化的方式。

### 使用 TypeScript

当使用 TypeScript 时，你必须首先为你的页面创建一个新类型，其中包含一个 `getLayout` 函数。然后，你必须为你的 `AppProps` 创建一个新类型，该类型覆盖 `Component` 属性以使用之前创建的类型。

```tsx filename="pages/index.tsx" switcher
import type { ReactElement } from 'react'
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
  return <p>hello world</p>
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}

export default Page
```

```jsx filename="pages/index.js" switcher
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'

const Page = () => {
  return <p>hello world</p>
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}

export default Page
```

```tsx filename="pages/_app.tsx" switcher
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // 如果可用，使用页面级别定义的布局
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

```jsx filename="pages/_app.js" switcher
export default function MyApp({ Component, pageProps }) {
  // 如果可用，使用页面级别定义的布局
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```
### 数据获取

在您的布局中，您可以使用 `useEffect` 或者像 [SWR](https://swr.vercel.app/) 这样的库在客户端获取数据。由于此文件不是 [页面](/docs/pages/building-your-application/routing/pages-and-layouts)，您目前无法使用 `getStaticProps` 或 `getServerSideProps`。

```jsx filename="components/layout.js"
import useSWR from 'swr'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  const { data, error } = useSWR('/api/navigation', fetcher)

  if (error) return <div>加载失败</div>
  if (!data) return <div>正在加载...</div>

  return (
    <>
      <Navbar links={data.links} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```