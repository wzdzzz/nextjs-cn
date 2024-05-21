---
title: 静态导出
description: Next.js 支持以静态站点或单页应用程序 (SPA) 启动，随后可选择性升级以使用需要服务器的功能。
---

# 静态导出
Next.js 支持以静态站点或单页应用程序 (SPA) 启动，随后可选择性升级以使用需要服务器的功能。

运行 `next build` 时，Next.js 会为每个路由生成一个 HTML 文件。通过将严格的 SPA 分解为单独的 HTML 文件，Next.js 可以避免在客户端加载不必要的 JavaScript 代码，减少打包大小并实现更快的页面加载。

由于 Next.js 支持这种静态导出，它可以部署和托管在任何能够提供 HTML/CSS/JS 静态资源的 Web 服务器上。

<PagesOnly>

> **须知**：我们建议使用应用路由以增强静态导出支持。

</PagesOnly>


## 配置

要启用静态导出，请在 `next.config.js` 中更改输出模式：

```js filename="next.config.js" highlight={5}
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',

  // 可选：更改链接 `/me` -> `/me/` 并发出 `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // 可选：防止自动 `/me` -> `/me/`，而是保留 `href`
  // skipTrailingSlashRedirect: true,

  // 可选：更改输出目录 `out` -> `dist`
  // distDir: 'dist',
}

module.exports = nextConfig
```

运行 `next build` 后，Next.js 将生成一个 `out` 文件夹，其中包含您的应用程序的 HTML/CSS/JS 资源。

<PagesOnly>

您可以利用 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 和 [`getStaticPaths`](/docs/pages/building-your-application/data-fetching/get-static-paths) 为 `pages` 目录中的每个页面（或更多 [动态路由](/docs/app/building-your-application/routing/dynamic-routes)）生成一个 HTML 文件。

</PagesOnly>

<AppOnly>


```
## 支持的特性

Next.js 的核心设计是为了支持静态导出。

### 服务器组件

当你运行 `next build` 来生成静态导出时，`app` 目录内使用的服务器组件将在构建期间运行，类似于传统的静态站点生成。

生成的组件将被渲染为初始页面加载的静态 HTML 和客户端路由导航的静态有效载荷。使用静态导出时，你的服务器组件通常不需要做任何更改，除非它们使用了 [动态服务器函数](#不支持的特性)。

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  // 这个 fetch 将在 `next build` 期间在服务器上运行
  const res = await fetch('https://api.example.com/...')
  const data = await res.json()

  return <main>...</main>
}
```

### 客户端组件

如果你想在客户端执行数据获取，可以使用客户端组件和 [SWR](https://github.com/vercel/swr) 来缓存请求。

```tsx filename="app/other/page.tsx" switcher
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const { data, error } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/1`,
    fetcher
  )
  if (error) return 'Failed to load'
  if (!data) return 'Loading...'

  return data.title
}
```

```jsx filename="app/other/page.js" switcher
'use client'

import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Page() {
  const { data, error } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/1`,
    fetcher
  )
  if (error) return 'Failed to load'
  if (!data) return 'Loading...'

  return data.title
}
```

由于路由转换发生在客户端，这表现得像传统的 SPA。例如，以下索引路由允许你在客户端导航到不同的帖子：

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <h1>索引页面</h1>
      <hr />
      <ul>
        <li>
          <Link href="/post/1">帖子 1</Link>
        </li>
        <li>
          <Link href="/post/2">帖子 2</Link>
        </li>
      </ul>
    </>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <h1>索引页面</h1>
      <p>
        <Link href="/other">其他页面</Link>
      </p>
    </>
  )
}
```

</AppOnly>

<PagesOnly>
## 支持的特性

构建静态网站所需的大多数核心 Next.js 特性都得到了支持，包括：

- 使用 `getStaticPaths` 时的[动态路由](/docs/app/building-your-application/routing/dynamic-routes)
- 使用 `next/link` 进行预取
- 预加载 JavaScript
- [动态导入](/docs/pages/building-your-application/optimizing/lazy-loading)
- 任何样式选项（例如 CSS Modules, styled-jsx）
- [客户端数据获取](/docs/pages/building-your-application/data-fetching/client-side)
- [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)
- [`getStaticPaths`](/docs/pages/building-your-application/data-fetching/get-static-paths)

</PagesOnly>

### 图像优化

通过 `next/image` 实现的[图像优化](/docs/app/building-your-application/optimizing/images)可以通过在 `next.config.js` 中定义自定义图像加载器与静态导出一起使用。例如，您可以使用 Cloudinary 等服务来优化图像：

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },
}

module.exports = nextConfig
```

这个自定义加载器将定义如何从远程源获取图像。例如，以下加载器将构建 Cloudinary 的 URL：

```ts filename="my-loader.ts" switcher
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://res.cloudinary.com/demo/image/upload/${params.join(
    ','
  )}${src}`
}
```

```js filename="my-loader.js" switcher
export default function cloudinaryLoader({ src, width, quality }) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://res.cloudinary.com/demo/image/upload/${params.join(
    ','
  )}${src}`
}
```

然后，您可以在应用程序中使用 `next/image`，为 Cloudinary 中的图像定义相对路径：

```tsx filename="app/page.tsx" switcher
import Image from 'next/image'

export default function Page() {
  return <Image alt="turtles" src="/turtles.jpg" width={300} height={300} />
}
```

```jsx filename="app/page.js" switcher
import Image from 'next/image'

export default function Page() {
  return <Image alt="turtles" src="/turtles.jpg" width={300} height={300} />
}
```

<AppOnly>

### 路由处理器

路由处理器在运行 `next build` 时将呈现静态响应。仅支持 `GET` HTTP 动词。这可以用来从缓存或未缓存的数据生成静态 HTML、JSON、TXT 或其他文件。例如：

```ts filename="app/data.json/route.ts" switcher
export async function GET() {
  return Response.json({ name: 'Lee' })
}
```

```js filename="app/data.json/route.js" switcher
export async function GET() {
  return Response.json({ name: 'Lee' })
}
```

上面的文件 `app/data.json/route.ts` 将在 `next build` 期间渲染为静态文件，生成包含 `{ name: 'Lee' }` 的 `data.json`。

如果您需要从传入的请求中读取动态值，您不能使用静态导出。

### 浏览器 API

客户端组件在 `next build` 期间预先渲染为 HTML。由于像 `window`、`localStorage` 和 `navigator` 这样的[Web API](https://developer.mozilla.org/docs/Web/API) 在服务器上不可用，您需要仅在浏览器中运行时安全地访问这些 API。例如：

```jsx
'use client';

import { useEffect } from 'react';

export default function ClientComponent() {
  useEffect(() => {
    // 现在您可以访问 `window`
    console.log(window.innerHeight);
  }, [])

  return ...;
}
```

</AppOnly>

须知：以上内容为 Next.js 官方文档的翻译，仅供学习和参考，不包含任何额外的文本或解释。
## 不支持的特性

需要 Node.js 服务器或在构建过程中无法计算的动态逻辑的特性是 **不支持的**：

<AppOnly>

- [动态路由](/docs/app/building-your-application/routing/dynamic-routes) 带有 `dynamicParams: true`
- [动态路由](/docs/app/building-your-application/routing/dynamic-routes) 没有 `generateStaticParams()`
- 依赖请求的 [路由处理器](/docs/app/building-your-application/routing/route-handlers)
- [Cookies](/docs/app/api-reference/functions/cookies)
- [重写](/docs/app/api-reference/next-config-js/rewrites)
- [重定向](/docs/app/api-reference/next-config-js/redirects)
- [头部](/docs/app/api-reference/next-config-js/headers)
- [中间件](/docs/app/building-your-application/routing/middleware)
- [增量静态再生](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
- 默认 `loader` 的 [图片优化](/docs/app/building-your-application/optimizing/images)
- [草稿模式](/docs/app/building-your-application/configuring/draft-mode)

尝试在 `next dev` 中使用这些特性中的任何一个都会导致错误，类似于在根布局中将 [`dynamic`](/docs/app/api-reference/file-conventions/route-segment-config#dynamic) 选项设置为 `error`。

```jsx
export const dynamic = 'error'
```

</AppOnly>

<PagesOnly>

- [国际化路由](/docs/pages/building-your-application/routing/internationalization)
- [API 路由](/docs/pages/building-your-application/routing/api-routes)
- [重写](/docs/pages/api-reference/next-config-js/rewrites)
- [重定向](/docs/pages/api-reference/next-config-js/redirects)
- [头部](/docs/pages/api-reference/next-config-js/headers)
- [中间件](/docs/pages/building-your-application/routing/middleware)
- [增量静态再生](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)
- 默认 `loader` 的 [图片优化](/docs/pages/building-your-application/optimizing/images)
- [草稿模式](/docs/pages/building-your-application/configuring/draft-mode)
- [`getStaticPaths` 带有 `fallback: true`](/docs/pages/api-reference/functions/get-static-paths#fallback-true)
- [`getStaticPaths` 带有 `fallback: 'blocking'`](/docs/pages/api-reference/functions/get-static-paths#fallback-blocking)
- [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)

</PagesOnly>

## 部署

通过静态导出，Next.js 可以部署和托管在任何能够提供 HTML/CSS/JS 静态资源的 Web 服务器上。

运行 `next build` 时，Next.js 会将静态导出生成到 `out` 文件夹中。例如，假设您有以下路由：

- `/`
- `/blog/[id]`

运行 `next build` 后，Next.js 将生成以下文件：

- `/out/index.html`
- `/out/404.html`
- `/out/blog/post-1.html`
- `/out/blog/post-2.html`

如果您使用的是像 Nginx 这样的静态主机，您可以配置从传入请求到正确文件的重写：

```nginx filename="nginx.conf"
server {
  listen 80;
  server_name acme.com;

  root /var/www/out;

  location / {
      try_files $uri $uri.html $uri/ =404;
  }

  # 当 `trailingSlash: false` 时这是必要的。
  # 当 `trailingSlash: true` 时，您可以省略此配置。
  location /blog/ {
      rewrite ^/blog/(.*)$ /blog/$1.html break;
  }

  error_page 404 /404.html;
  location = /404.html {
      internal;
  }
}
```
## 版本历史

| 版本   | 变更                                                                                                                   |
| ------ | ----------------------------------------------------------------------------------------------------------------------- |
| `v14.0.0` | `next export` 已被移除，取而代之的是 `"output": "export"`                                                           |
| `v13.4.0` | App Router（稳定版）增加了增强的静态导出支持，包括使用 React Server Components 和 Route Handlers。 |
| `v13.3.0` | `next export` 已弃用，并被 `"output": "export"` 替换                                                                   |