# App Router 逐步采用指南

本指南将帮助您：

- [将您的 Next.js 应用程序从版本 12 升级到版本 13](#nextjs版本)
- [升级在 `pages` 和 `app` 目录中均可使用的功能](#升级新特性)
- [逐步将现有应用程序从 `pages` 迁移到 `app`](#从pages迁移到app)

## 升级

### Node.js 版本

最低 Node.js 版本现在是 **v18.17**。有关更多信息，请查看 [Node.js 文档](https://nodejs.org/docs/latest-v18.x/api/)。

### Next.js 版本

要升级到 Next.js 版本 13，请使用您喜欢的包管理器运行以下命令：

```bash filename="终端"
npm install next@latest react@latest react-dom@latest
```

### ESLint 版本

如果您正在使用 ESLint，则需要升级您的 ESLint 版本：

```bash filename="终端"
npm install -D eslint-config-next@latest
```

> **须知**：您可能需要在 VS Code 中重新启动 ESLint 服务器以使 ESLint 的更改生效。打开命令面板 (`cmd+shift+p` 在 Mac 上；`ctrl+shift+p` 在 Windows 上) 并搜索 `ESLint: Restart ESLint Server`。

## 下一步

更新完成后，请查看以下部分以获取后续步骤：

- [升级新特性](#升级新特性)：帮助您升级到新特性的指南，例如改进的 Image 和 Link 组件。
- [从 `pages` 迁移到 `app` 目录](#从pages迁移到app)：逐步指南，帮助您逐步从 `pages` 迁移到 `app` 目录。

## 升级新特性

Next.js 13 引入了新的 [App Router](/docs/app/building-your-application/routing)，具有新特性和约定。新的 Router 可在 `app` 目录中使用，并与 `pages` 目录共存。

升级到 Next.js 13 **不要求** 使用新的 [App Router](/docs/app/building-your-application/routing#the-app-router)。您可以继续使用 `pages` 以及在两个目录中均可使用的新特性，例如更新后的 [Image 组件](#image组件)、[Link 组件](#link组件)、[Script 组件](#script组件) 和 [字体优化](#字体优化)。

### `<Image/>` 组件

Next.js 12 通过临时导入 `next/future/image` 对 Image 组件进行了新的改进。这些改进包括更少的客户端 JavaScript、更简单的扩展和样式化图像的方法、更好的可访问性和原生浏览器懒加载。

在版本 13 中，这种新行为现在已成为 `next/image` 的默认设置。

有两个 codemods 可以帮助您迁移到新的 Image 组件：

- [**`next-image-to-legacy-image` codemod**](/docs/app/building-your-application/upgrading/codemods#next-image-to-legacy-image)：安全且自动地将 `next/image` 导入重命名为 `next/legacy/image`。现有组件将保持相同的行为。
- [**`next-image-experimental` codemod**](/docs/app/building-your-application/upgrading/codemods#next-image-experimental)：危险地添加内联样式并移除未使用的属性。这将改变现有组件的行为以匹配新的默认设置。要使用此 codemod，您需要先运行 `next-image-to-legacy-image` codemod。
### `<Link>` 组件

[`<Link>` 组件](/docs/app/building-your-application/routing/linking-and-navigating#link-component)不再需要手动添加一个 `<a>` 标签作为子元素。这种行为在 [版本 12.2](https://nextjs.org/blog/next-12-2) 中作为实验性选项添加，现在已成为默认设置。在 Next.js 13 中，`<Link>` 总是渲染 `<a>` 并允许你将属性转发到底层标签。

例如：

```jsx
import Link from 'next/link'

// Next.js 12: 必须嵌套 `<a>`，否则将被排除
<Link href="/about">
  <a>About</a>
</Link>

// Next.js 13: `<Link>` 在内部始终渲染 `<a>`
<Link href="/about">
  About
</Link>
```

要将您的链接升级到 Next.js 13，您可以使用 [`new-link` codemod](/docs/app/building-your-application/upgrading/codemods#new-link)。

### `<Script>` 组件

[`next/script`](/docs/app/api-reference/components/script) 的行为已更新，以支持 `pages` 和 `app`，但需要进行一些更改以确保顺利迁移：

- 将您之前在 `_document.js` 中包含的任何 `beforeInteractive` 脚本移动到根布局文件 (`app/layout.tsx`)。
- 实验性的 `worker` 策略尚未在 `app` 中工作，使用此策略标记的脚本将不得不被删除或修改为使用不同的策略（例如 `lazyOnload`）。
- `onLoad`、`onReady` 和 `onError` 处理程序将不在 Server Components 中工作，因此请确保将它们移动到 [Client Component](/docs/app/building-your-application/rendering/server-components) 或完全删除它们。

### 字体优化

以前，Next.js 通过 [内联字体 CSS](/docs/app/building-your-application/optimizing/fonts) 帮助您优化字体。版本 13 引入了新的 [`next/font`](/docs/app/building-your-application/optimizing/fonts) 模块，它使您能够在确保出色的性能和隐私的同时自定义字体加载体验。`next/font` 在 `pages` 和 `app` 目录中都受支持。

虽然 [内联 CSS](/docs/app/building-your-application/optimizing/fonts) 仍然在 `pages` 中有效，但它在 `app` 中不起作用。您应该改用 [`next/font`](/docs/app/building-your-application/optimizing/fonts)。

请参阅 [字体优化](/docs/app/building-your-application/optimizing/fonts) 页面，了解如何使用 `next/font`。
## 从 `pages` 迁移到 `app`

> **🎥 观看:** 学习如何逐步采用 App Router → [YouTube (16分钟)](https://www.youtube.com/watch?v=YQMSietiFm0)。

转向 App Router 可能是第一次使用 Next.js 构建在其上的 React 特性，如 Server Components、Suspense 等。当与 Next.js 的新特性结合使用时，如[特殊文件](/docs/app/building-your-application/routing#file-conventions)和[布局](/docs/app/building-your-application/routing/layouts-and-templates#layouts)，迁移意味着需要学习新的概念、心智模型和行为变化。

我们建议通过将迁移分解为更小的步骤来减少这些更新的组合复杂性。`app` 目录故意设计为可以与 `pages` 目录同时工作，以允许逐步逐页迁移。

- `app` 目录支持嵌套路由和布局。[了解更多](/docs/app/building-your-application/routing)。
- 使用嵌套文件夹来[定义路由](/docs/app/building-your-application/routing/defining-routes)，并使用特殊的 `page.js` 文件使路由段公开可访问。[了解更多](#step-4-migrating-pages)。
- [特殊文件约定](/docs/app/building-your-application/routing#file-conventions)用于为每个路由段创建 UI。最常见的特殊文件是 `page.js` 和 `layout.js`。
  - 使用 `page.js` 定义特定于路由的 UI。
  - 使用 `layout.js` 定义跨多个路由共享的 UI。
  - 特殊文件可以使用 `.js`、`.jsx` 或 `.tsx` 文件扩展名。
- 您可以在 `app` 目录中共同定位其他文件，如组件、样式、测试等。[了解更多](/docs/app/building-your-application/routing)。
- 数据获取函数 `getServerSideProps` 和 `getStaticProps` 已被 `app` 内的[新 API](/docs/app/building-your-application/data-fetching)替换。`getStaticPaths` 已被 [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) 替换。
- `pages/_app.js` 和 `pages/_document.js` 已被单个 `app/layout.js` 根布局替换。[了解更多](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)。
- `pages/_error.js` 已被更细粒度的 `error.js` 特殊文件替换。[了解更多](/docs/app/building-your-application/routing/error-handling)。
- `pages/404.js` 已被 [`not-found.js`](/docs/app/api-reference/file-conventions/not-found) 文件替换。
- `pages/api/*` API 路由已被 [`route.js`](/docs/app/api-reference/file-conventions/route)（路由处理器）特殊文件替换。

### 第 1 步：创建 `app` 目录

更新到最新的 Next.js 版本（需要 13.4 或更高版本）：

```bash
npm install next@latest
```

然后，在项目的根目录（或 `src/` 目录）创建一个新的 `app` 目录。
### 第2步：创建根布局

在 `app` 目录中创建一个新的 `app/layout.tsx` 文件。这是一个[根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)，它将应用于 `app` 内部的所有路由。

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  // 布局必须接受一个 children prop。
  // 这将被填充为嵌套的布局或页面
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({
  // 布局必须接受一个 children prop。
  // 这将被填充为嵌套的布局或页面
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- `app` 目录**必须**包含一个根布局。
- 根布局必须定义 `<html>` 和 `<body>` 标签，因为 Next.js 不会自动创建它们
- 根布局取代了 `pages/_app.tsx` 和 `pages/_document.tsx` 文件。
- 布局文件可以使用 `.js`、`.jsx` 或 `.tsx` 扩展名。

要管理 `<head>` HTML 元素，可以使用[内置的SEO支持](/docs/app/building-your-application/optimizing/metadata)：

```tsx filename="app/layout.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}
```

```jsx filename="app/layout.js" switcher
export const metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}
```

#### 迁移 `_document.js` 和 `_app.js`

如果您有一个现有的 `_app` 或 `_document` 文件，您可以将内容（例如全局样式）复制到根布局（`app/layout.tsx`）。`app/layout.tsx` 中的样式将**不**应用于 `pages/*`。在迁移过程中，您应该保留 `_app`/`_document`，以防止 `pages/*` 路由中断。完全迁移后，您可以安全地删除它们。

如果您正在使用任何 React Context 提供程序，它们将需要被移动到[客户端组件](/docs/app/building-your-application/rendering/client-components)。
# 迁移 `getLayout()` 模式到 Layouts（可选）

Next.js 推荐在 `pages` 目录中的页面组件添加一个 [属性](/docs/pages/building-your-application/routing/pages-and-layouts#layout-pattern#per-page-layouts) 来实现每页布局。这个模式可以用 `app` 目录中对 [嵌套布局](/docs/app/building-your-application/routing/layouts-and-templates#layouts) 的原生支持来替换。

<details>
  <summary>查看前后示例</summary>

**之前**

```jsx filename="components/DashboardLayout.js"
export default function DashboardLayout({ children }) {
  return (
    <div>
      <h2>我的仪表盘</h2>
      {children}
    </div>
  )
}
```

```jsx filename="pages/dashboard/index.js"
import DashboardLayout from '../components/DashboardLayout'

export default function Page() {
  return <p>我的页面</p>
}

Page.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}
```

**之后**

- 从 `pages/dashboard/index.js` 中移除 `Page.getLayout` 属性，并按照 [迁移页面的步骤](#step-4-migrating-pages) 将其迁移到 `app` 目录。

  ```jsx filename="app/dashboard/page.js"
  export default function Page() {
    return <p>我的页面</p>
  }
  ```

- 将 `DashboardLayout` 的内容移动到一个新的 [客户端组件](/docs/app/building-your-application/rendering/client-components) 中，以保留 `pages` 目录的行为。

  ```jsx filename="app/dashboard/DashboardLayout.js"
  'use client' // 这个指令应该在文件顶部，任何导入之前。

  // 这是一个客户端组件
  export default function DashboardLayout({ children }) {
    return (
      <div>
        <h2>我的仪表盘</h2>
        {children}
      </div>
    )
  }
  ```

- 将 `DashboardLayout` 导入到 `app` 目录中新的 `layout.js` 文件。

  ```jsx filename="app/dashboard/layout.js"
  import DashboardLayout from './DashboardLayout'

  // 这是一个服务器组件
  export default function Layout({ children }) {
    return <DashboardLayout>{children}</DashboardLayout>
  }
  ```

- 你可以逐步将 `DashboardLayout.js`（客户端组件）中的非交互部分移动到 `layout.js`（服务器组件）中，以减少发送到客户端的组件 JavaScript 的数量。

</details>

### 第 3 步：迁移 `next/head`

在 `pages` 目录中，使用 `next/head` React 组件来管理 `<head>` HTML 元素，如 `title` 和 `meta`。在 `app` 目录中，`next/head` 被新的 [内置 SEO 支持](/docs/app/building-your-application/optimizing/metadata) 替换。

**之前：**

```tsx filename="pages/index.tsx" switcher
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>我的页面标题</title>
      </Head>
    </>
  )
}
```

```jsx filename="pages/index.js" switcher
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>我的页面标题</title>
      </Head>
    </>
  )
}
```

**之后：**

```tsx filename="app/page.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的页面标题',
}

export default function Page() {
  return '...'
}
```

```jsx filename="app/page.js" switcher
export const metadata = {
  title: '我的页面标题',
}

export default function Page() {
  return '...'
}
```

[查看所有元数据选项](/docs/app/api-reference/functions/generate-metadata)。
### 第 4 步：迁移页面

- 在 [`app` 目录](/docs/app/building-your-application/routing) 中的页面，默认情况下是 [Server Components](/docs/app/building-your-application/rendering/server-components)。这与 `pages` 目录不同，后者的页面是 [Client Components](/docs/app/building-your-application/rendering/client-components)。
- 在 `app` 中，[数据获取](/docs/app/building-your-application/data-fetching) 发生了变化。`getServerSideProps`、`getStaticProps` 和 `getInitialProps` 已被更简单的 API 替换。
- `app` 目录使用嵌套文件夹来 [定义路由](/docs/app/building-your-application/routing/defining-routes)，并且使用特殊的 `page.js` 文件使路由段公开可访问。
- | `pages` 目录 | `app` 目录       | 路由          |
  | ----------------- | --------------------- | -------------- |
  | `index.js`        | `page.js`             | `/`            |
  | `about.js`        | `about/page.js`       | `/about`       |
  | `blog/[slug].js`  | `blog/[slug]/page.js` | `/blog/post-1` |

我们建议将页面的迁移分解为两个主要步骤：

- 第 1 步：将默认导出的页面组件移动到一个新的客户端组件中。
- 第 2 步：将新的客户端组件导入到 `app` 目录中的一个新的 `page.js` 文件中。

> **须知**：这是最简单的迁移路径，因为它与 `pages` 目录的行为最为相似。

**第 1 步：创建一个新的客户端组件**

- 在 `app` 目录中创建一个新的独立文件（例如 `app/home-page.tsx` 或类似），导出一个客户端组件。要定义客户端组件，请在文件顶部（在任何导入之前）添加 `'use client'` 指令。
  - 类似于页面路由器，有一个 [优化步骤](/docs/app/building-your-application/rendering/client-components#full-page-load) 可以在初始页面加载时将客户端组件预渲染为静态 HTML。
- 将 `pages/index.js` 中的默认导出页面组件移动到 `app/home-page.tsx`。

```tsx filename="app/home-page.tsx" switcher
'use client'

// 这是一个客户端组件（与 `pages` 目录中的组件相同）
// 它接收数据作为属性，可以访问状态和效果，并且在初始页面加载时在服务器上预渲染。
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

```


```jsx filename="app/home-page.js" switcher
'use client'

// 这是一个客户端组件。它接收数据作为属性，并且
// 像 `pages` 目录中的页面组件一样具有访问状态和效果的能力。
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

```
# Step 2: Create a new page

- 在 `app` 目录内创建一个新的 `app/page.tsx` 文件。默认情况下，这是一个服务器组件。
- 将 `home-page.tsx` 客户端组件导入到页面中。
- 如果你之前在 `pages/index.js` 中获取数据，将数据获取逻辑直接移动到使用新的 [数据获取 API](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating) 的服务器组件中。有关更多详细信息，请查看 [数据获取升级指南](#step-6-migrating-data-fetching-methods)。

  ```tsx filename="app/page.tsx" switcher
  // 导入你的客户端组件
  import HomePage from './home-page'

  async function getPosts() {
    const res = await fetch('https://...')
    const posts = await res.json()
    return posts
  }

  export default async function Page() {
    // 直接在服务器组件中获取数据
    const recentPosts = await getPosts()
    // 将获取的数据转发到你的客户端组件
    return <HomePage recentPosts={recentPosts} />
  }
  ```

  ```jsx filename="app/page.js" switcher
  // 导入你的客户端组件
  import HomePage from './home-page'

  async function getPosts() {
    const res = await fetch('https://...')
    const posts = await res.json()
    return posts
  }

  export default async function Page() {
    // 直接在服务器组件中获取数据
    const recentPosts = await getPosts()
    // 将获取的数据转发到你的客户端组件
    return <HomePage recentPosts={recentPosts} />
  }
  ```

- 如果你之前的页面使用了 `useRouter`，你需要更新到新的路由钩子。[了解更多](/docs/app/api-reference/functions/use-router)。
- 启动你的开发服务器并访问 [`http://localhost:3000`](http://localhost:3000)。你应该能看到你现有的索引路由，现在通过 app 目录提供服务。
### 第 5 步：迁移路由钩子

已添加新的路由器以支持 `app` 目录中的新行为。

在 `app` 中，您应使用从 `next/navigation` 导入的三个新钩子：[`useRouter()`](/docs/app/api-reference/functions/use-router)、[`usePathname()`](/docs/app/api-reference/functions/use-pathname) 和 [`useSearchParams()`](/docs/app/api-reference/functions/use-search-params)。

- 新的 `useRouter` 钩子从 `next/navigation` 导入，其行为与从 `next/router` 导入的 `pages` 中的 `useRouter` 钩子不同。
  - 从 `next/router` 导入的 [`useRouter` 钩子](/docs/pages/api-reference/functions/use-router) 在 `app` 目录中不受支持，但可以继续在 `pages` 目录中使用。
- 新的 `useRouter` 不返回 `pathname` 字符串。请改用单独的 `usePathname` 钩子。
- 新的 `useRouter` 不返回 `query` 对象。请改用单独的 `useSearchParams` 钩子。
- 您可以一起使用 `useSearchParams` 和 `usePathname` 来监听页面变化。有关更多详细信息，请参见 [Router Events](/docs/app/api-reference/functions/use-router#router-events) 部分。
- 这些新钩子仅支持客户端组件。它们不能在服务器组件中使用。

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ...
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ...
}
```

此外，新的 `useRouter` 钩子有以下变化：

- `isFallback` 已被移除，因为 `fallback` 已被 [替换](#replacing-fallback)。
- `locale`、`locales`、`defaultLocales`、`domainLocales` 值已被移除，因为 `app` 目录中不再需要 Next.js 的内置国际化功能。[了解更多关于 i18n](/docs/app/building-your-application/routing/internationalization)。
- `basePath` 已被移除。替代方案将不会是 `useRouter` 的一部分。尚未实现。
- `asPath` 已被移除，因为 `as` 的概念已从新路由器中移除。
- `isReady` 已被移除，因为它不再必要。在 [静态渲染](/docs/app/building-your-application/rendering/server-components#static-rendering-default) 期间，任何使用 [`useSearchParams()`](/docs/app/api-reference/functions/use-search-params) 钩子的组件将跳过预渲染步骤，而是在客户端运行时渲染。

[查看 `useRouter()` API 参考](/docs/app/api-reference/functions/use-router)。
### 第6步：迁移数据获取方法

`pages` 目录使用 `getServerSideProps` 和 `getStaticProps` 来为页面获取数据。在 `app` 目录中，这些之前的数据获取函数被一个基于 `fetch()` 和 `async` React Server Components 构建的[更简单的API](/docs/app/building-your-application/data-fetching)所取代。

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  // 这个请求应该被缓存，直到手动使它失效。
  // 类似于 `getStaticProps`。
  // `force-cache` 是默认设置，可以省略。
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // 这个请求应该在每次请求时重新获取。
  // 类似于 `getServerSideProps`。
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // 这个请求应该被缓存，并且有10秒的生命周期。
  // 类似于带有 `revalidate` 选项的 `getStaticProps`。
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  // 这个请求应该被缓存，直到手动使它失效。
  // 类似于 `getStaticProps`。
  // `force-cache` 是默认设置，可以省略。
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // 这个请求应该在每次请求时重新获取。
  // 类似于 `getServerSideProps`。
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // 这个请求应该被缓存，并且有10秒的生命周期。
  // 类似于带有 `revalidate` 选项的 `getStaticProps`。
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```
# Server-side Rendering (`getServerSideProps`)

在 `pages` 目录中，`getServerSideProps` 用于在服务器上获取数据，并将属性转发给文件中默认导出的 React 组件。页面的初始 HTML 是从服务器上预渲染的，随后在浏览器中“激活”页面（使其变得可交互）。

```jsx filename="pages/dashboard.js"
// `pages` 目录

export async function getServerSideProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Dashboard({ projects }) {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

在 `app` 目录中，我们可以使用 [Server Components](/docs/app/building-your-application/rendering/server-components) 将数据获取与我们的 React 组件放在一起。这允许我们向客户端发送更少的 JavaScript，同时保持从服务器渲染的 HTML。

通过将 `cache` 选项设置为 `no-store`，我们可以指示获取的数据 [永远不要被缓存](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)。这类似于 `pages` 目录中的 `getServerSideProps`。

```tsx filename="app/dashboard/page.tsx" switcher
// `app` 目录

// 这个函数可以命名为任何名称
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
// `app` 目录

// 这个函数可以命名为任何名称
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```
### 请求对象的访问

在 `pages` 目录中，你可以根据 Node.js HTTP API 检索基于请求的数据。

例如，你可以从 `getServerSideProps` 中获取 `req` 对象，并使用它来检索请求的 cookies 和 headers。

```jsx filename="pages/index.js"
// `pages` 目录

export async function getServerSideProps({ req, query }) {
  const authHeader = req.getHeaders()['authorization'];
  const theme = req.cookies['theme'];

  return { props: { ... }}
}

export default function Page(props) {
  return ...
}
```

`app` 目录公开了新的只读函数来检索请求数据：

- [`headers()`](/docs/app/api-reference/functions/headers): 基于 Web Headers API，可以在 [Server Components](/docs/app/building-your-application/rendering/server-components) 内部使用以检索请求 headers。
- [`cookies()`](/docs/app/api-reference/functions/cookies): 基于 Web Cookies API，可以在 [Server Components](/docs/app/building-your-application/rendering/server-components) 内部使用以检索 cookies。

```tsx filename="app/page.tsx" switcher
// `app` 目录
import { cookies, headers } from 'next/headers'

async function getData() {
  const authHeader = headers().get('authorization')

  return '...'
}

export default async function Page() {
  // 你可以在 Server Components 内部直接或在你的数据获取函数中使用 `cookies()` 或 `headers()`
  const theme = cookies().get('theme')
  const data = await getData()
  return '...'
}
```

```jsx filename="app/page.js" switcher
// `app` 目录
import { cookies, headers } from 'next/headers'

async function getData() {
  const authHeader = headers().get('authorization')

  return '...'
}

export default async function Page() {
  // 你可以在 Server Components 内部直接或在你的数据获取函数中使用 `cookies()` 或 `headers()`
  const theme = cookies().get('theme')
  const data = await getData()
  return '...'
}
```

### 静态站点生成 (`getStaticProps`)

在 `pages` 目录中，`getStaticProps` 函数用于在构建时预渲染页面。这个函数可以用来从外部 API 或直接从数据库获取数据，并将这些数据传递给整个页面，以便在构建期间生成页面时使用。

```jsx filename="pages/index.js"
// `pages` 目录

export async function getStaticProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>)
}
```

在 `app` 目录中，使用 [`fetch()`](/docs/app/api-reference/functions/fetch) 进行数据获取将默认为 `cache: 'force-cache'`，这将缓存请求数据直到手动使它失效。这与 `pages` 目录中的 `getStaticProps` 类似。

```jsx filename="app/page.js"
// `app` 目录

// 这个函数可以命名为任何名称
async function getProjects() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return projects
}

export default async function Index() {
  const projects = await getProjects()

  return projects.map((project) => <div>{project.name}</div>)
}
```
# 动态路径 (`getStaticPaths`)

在 `pages` 目录中，`getStaticPaths` 函数用于定义应在构建时预渲染的动态路径。

```jsx filename="pages/posts/[id].js"
// `pages` 目录
import PostLayout from '@/components/post-layout'

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  return { props: { post } }
}

export default function Post({ post }) {
  return <PostLayout post={post} />
}
```

在 `app` 目录中，`getStaticPaths` 被 [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) 替换。

[`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) 的行为类似于 `getStaticPaths`，但返回路由参数的 API 更简化，并且可以在 [布局](/docs/app/building-your-application/routing/layouts-and-templates) 中使用。`generateStaticParams` 返回的形状是段的数组，而不是嵌套的 `param` 对象数组或解析路径的字符串。

```jsx filename="app/posts/[id]/page.js"
// `app` 目录
import PostLayout from '@/components/post-layout'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getPost(params) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  return post
}

export default async function Post({ params }) {
  const post = await getPost(params)

  return <PostLayout post={post} />
}
```

在 `app` 目录的新模型中，使用 `generateStaticParams` 这个名字比 `getStaticPaths` 更合适。`get` 前缀被更具描述性的 `generate` 替换，这在 `getStaticProps` 和 `getServerSideProps` 不再需要的情况下单独使用更合适。`Paths` 后缀被 `Params` 替换，这对于具有多个动态段的嵌套路由更为合适。

---

**须知**：在使用 `generateStaticParams` 时，确保理解其与 `getStaticPaths` 的差异，以及如何在 `app` 目录中正确应用它。
# Replacing `fallback`

在 `pages` 目录中，`getStaticPaths` 返回的 `fallback` 属性用于定义在构建时未预渲染的页面的行为。此属性可以设置为 `true` 以在生成页面时显示备用页面，`false` 以显示 404 页面，或 `blocking` 以在请求时生成页面。

```jsx filename="pages/posts/[id].js"
// `pages` 目录

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  ...
}

export default function Post({ post }) {
  return ...
}
```

在 `app` 目录中，[`config.dynamicParams` 属性](/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams) 控制了如何处理 [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) 之外的参数：

- **`true`**: (默认) 未包含在 `generateStaticParams` 中的动态段将按需生成。
- **`false`**: 未包含在 `generateStaticParams` 中的动态段将返回 404。

这取代了 `pages` 目录中 `getStaticPaths` 的 `fallback: true | false | 'blocking'` 选项。`dynamicParams` 中不包括 `fallback: 'blocking'` 选项，因为在使用流式传输时 `'blocking'` 和 `true` 之间的差异可以忽略不计。

```jsx filename="app/posts/[id]/page.js"
// `app` 目录

export const dynamicParams = true;

export async function generateStaticParams() {
  return [...]
}

async function getPost(params) {
  ...
}

export default async function Post({ params }) {
  const post = await getPost(params);

  return ...
}
```

当 [`dynamicParams`](/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams) 设置为 `true`（默认值）时，如果请求了一个尚未生成的路由段，它将被服务器渲染并缓存。

# Incremental Static Regeneration (`getStaticProps` with `revalidate`)

在 `pages` 目录中，`getStaticProps` 函数允许您添加一个 `revalidate` 字段，以在一定时间后自动重新生成页面。

```jsx filename="pages/index.js"
// `pages` 目录

export async function getStaticProps() {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60,
  }
}

export default function Index({ posts }) {
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  )
}
```

在 `app` 目录中，使用 [`fetch()`](/docs/app/api-reference/functions/fetch) 进行数据获取时可以使用 `revalidate`，这将为指定的秒数缓存请求。

```jsx filename="app/page.js"
// `app` 目录

async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } })
  const data = await res.json()

  return data.posts
}

export default async function PostList() {
  const posts = await getPosts()

  return posts.map((post) => <div>{post.name}</div>)
}
```
# API Routes

API Routes 在 `pages/api` 目录下继续工作，无需任何更改。然而，它们已经被 `app` 目录中的 [Route Handlers](/docs/app/building-your-application/routing/route-handlers) 所取代。

Route Handlers 允许您使用 Web [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response) API 为给定路由创建自定义请求处理程序。

```ts filename="app/api/route.ts" switcher
export async function GET(request: Request) {}
```

```js filename="app/api/route.js" switcher
export async function GET(request) {}
```

> **须知**：如果您之前使用 API routes 从客户端调用外部 API，现在可以使用 [Server Components](/docs/app/building-your-application/rendering/server-components) 来安全地获取数据。了解更多关于 [data fetching](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating) 的信息。

### Step 7: Styling

在 `pages` 目录中，全局样式表仅限于 `pages/_app.js`。随着 `app` 目录的引入，这一限制已被取消。全局样式可以添加到任何布局、页面或组件中。

- [CSS Modules](/docs/app/building-your-application/styling/css-modules)
- [Tailwind CSS](/docs/app/building-your-application/styling/tailwind-css)
- [Global Styles](/docs/app/building-your-application/styling/css-modules#global-styles)
- [CSS-in-JS](/docs/app/building-your-application/styling/css-in-js)
- [External Stylesheets](/docs/app/building-your-application/styling/css-modules#external-stylesheets)
- [Sass](/docs/app/building-your-application/styling/sass)

#### Tailwind CSS

如果您正在使用 Tailwind CSS，则需要将 `app` 目录添加到您的 `tailwind.config.js` 文件中：

```js filename="tailwind.config.js"
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // <-- 添加这行
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
```

您还需要在 `app/layout.js` 文件中导入您的全局样式：

```jsx filename="app/layout.js"
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

了解更多关于 [使用 Tailwind CSS 进行样式设计](/docs/app/building-your-application/styling/tailwind-css) 的信息。

## Codemods

Next.js 提供了 Codemod 转换，以帮助在功能被弃用时升级您的代码库。查看 [Codemods](/docs/app/building-your-application/upgrading/codemods) 以获取更多信息。