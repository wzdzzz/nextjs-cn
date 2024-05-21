---
title: 从 Vite 迁移到 Next.js
description: 了解如何将现有的 React 应用程序从 Vite 迁移到 Next.js。
---
# 从 Vite 迁移到 Next.js
本指南将帮助你将现有的 Vite 应用程序迁移到 Next.js。

## 为什么选择切换？

你可能想要从 Vite 切换到 Next.js 的几个原因：

### 初始页面加载时间慢

如果你使用 [Vite 的默认 React 插件](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) 构建了你的应用程序，你的应用程序就是一个纯粹的客户端应用程序。仅客户端应用程序，也称为单页应用程序（SPAs），通常会遇到初始页面加载时间慢的问题。这由几个原因引起：

1. 浏览器需要等待 React 代码和整个应用程序捆绑包下载并运行后，你的代码才能发送请求加载一些数据。
2. 你的应用程序代码随着每个新功能和额外依赖项的添加而增长。

### 没有自动代码分割

通过代码分割可以某种程度上管理慢速加载的问题。然而，如果你尝试手动进行代码分割，往往会使性能变得更差。手动代码分割时，很容易不经意地引入网络瀑布效应。Next.js 在其路由器中内置了自动代码分割。

### 网络瀑布效应

应用程序性能不佳的一个常见原因是，应用程序进行顺序的客户端-服务器请求以获取数据。SPA 中数据获取的一个常见模式是最初呈现一个占位符，然后在组件挂载后获取数据。不幸的是，这意味着一个获取数据的子组件不能在父组件完成加载自己的数据之前开始获取数据。

虽然 Next.js 支持客户端数据获取，但它还允许你将数据获取转移到服务器上，这可以消除客户端-服务器瀑布效应。

### 快速和有意识的加载状态

通过内置的 [通过 React Suspense 流式传输](/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense) 支持，你可以更有意识地决定你想要首先加载的 UI 的哪些部分以及以什么顺序，而不引入网络瀑布效应。

这使你能够构建加载速度更快的页面，并消除 [布局偏移](https://vercel.com/blog/how-core-web-vitals-affect-seo)。

### 选择数据获取策略

根据你的需求，Next.js 允许你在页面和组件的基础上选择你的数据获取策略。你可以决定在构建时获取，在服务器上的请求时获取，或者在客户端获取。例如，你可以在构建时从你的 CMS 获取数据并渲染你的博客文章，然后可以有效地在 CDN 上进行缓存。

### 中间件

[Next.js 中间件](/docs/app/building-your-application/routing/middleware) 允许你在请求完成之前在服务器上运行代码。这对于避免在用户访问仅经过身份验证的页面时出现未经身份验证的内容闪烁特别有用，方法是将用户重定向到登录页面。中间件还适用于实验和 [国际化](/docs/app/building-your-application/routing/internationalization)。

### 内置优化

[图片](/docs/app/building-your-application/optimizing/images)、[字体](/docs/app/building-your-application/optimizing/fonts) 和 [第三方脚本](/docs/app/building-your-application/optimizing/scripts) 通常对应用程序的性能有显著影响。Next.js 带有自动优化这些的内置组件。
## 迁移步骤

我们进行这次迁移的目标是尽快获得一个可工作的 Next.js 应用程序，这样您就可以逐步采用 Next.js 的特性。起初，我们将保持它作为一个纯粹的客户端应用程序（SPA），而不迁移您现有的路由。这有助于在迁移过程中最小化遇到问题的机会，并减少合并冲突。

### 第 1 步：安装 Next.js 依赖

您需要做的第一件事是将 `next` 安装为依赖项：

```bash filename="终端"
npm install next@latest
```

### 第 2 步：创建 Next.js 配置文件

在项目的根目录下创建一个 `next.config.mjs`。这个文件将包含您的 [Next.js 配置选项](/docs/app/api-reference/next-config-js)。

```js filename="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 输出为单页应用程序 (SPA)。
  distDir: './dist', // 将构建输出目录更改为 `./dist/`。
}

export default nextConfig
```

> **须知：** 您可以使用 `.js` 或 `.mjs` 作为您的 Next.js 配置文件。

### 第 3 步：更新 TypeScript 配置

如果您正在使用 TypeScript，则需要使用以下更改更新您的 `tsconfig.json` 文件，以使其与 Next.js 兼容。如果您没有使用 TypeScript，您可以跳过这一步。

1. 移除对 `tsconfig.node.json` 的 [项目引用](https://www.typescriptlang.org/tsconfig#references)
2. 将 `./dist/types/**/*.ts` 和 `./next-env.d.ts` 添加到 [`include` 数组](https://www.typescriptlang.org/tsconfig#include)
3. 将 `./node_modules` 添加到 [`exclude` 数组](https://www.typescriptlang.org/tsconfig#exclude)
4. 在 `compilerOptions` 中的 [`plugins` 数组](https://www.typescriptlang.org/tsconfig#plugins) 添加 `{ "name": "next" }`：`"plugins": [{ "name": "next" }]`
5. 将 [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) 设置为 `true`：`"esModuleInterop": true`
6. 将 [`jsx`](https://www.typescriptlang.org/tsconfig#jsx) 设置为 `preserve`：`"jsx": "preserve"`
7. 将 [`allowJs`](https://www.typescriptlang.org/tsconfig#allowJs) 设置为 `true`：`"allowJs": true`
8. 将 [`forceConsistentCasingInFileNames`](https://www.typescriptlang.org/tsconfig#forceConsistentCasingInFileNames) 设置为 `true`：`"forceConsistentCasingInFileNames": true`
9. 将 [`incremental`](https://www.typescriptlang.org/tsconfig#incremental) 设置为 `true`：`"incremental": true`

以下是包含这些更改的 `tsconfig.json` 的示例：

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["./src", "./dist/types/**/*.ts", "./next-env.d.ts"],
  "exclude": ["./node_modules"]
}
```

您可以在 [Next.js 文档](/docs/app/building-your-application/configuring/typescript#typescript-plugin) 中找到有关配置 TypeScript 的更多信息。
### 第 4 步：创建根布局

一个 Next.js [应用路由](/docs/app) 应用程序必须包含一个
[根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)
文件，这是一个 [React 服务器组件](/docs/app/building-your-application/rendering/server-components)
它将包装你应用程序中的所有页面。此文件定义在 `app` 目录的顶层。

在 Vite 应用程序中，根布局文件的最接近等价物是
[`index.html` 文件](https://vitejs.dev/guide/#index-html-and-project-root)，其中包含你的
`<html>`、`<head>` 和 `<body>` 标签。

在这一步中，你将把你的 `index.html` 文件转换成一个根布局文件：

1. 在你的 `src` 目录中创建一个新的 `app` 目录。
2. 在那个 `app` 目录内部创建一个新的 `layout.tsx` 文件：

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return null
}

```


```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return null
}

```

> **须知**：`.js`、`.jsx` 或 `.tsx` 扩展名可用于布局文件。

3. 将你的 `index.html` 文件的内容复制到先前创建的 `<RootLayout>` 组件中，同时
   用 `<div id="root">{children}</div>` 替换 `body.div#root` 和 `body.script` 标签：

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

```


```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

```

4. Next.js 默认已经包含了
   [meta charset](https://developer.mozilla.org/docs/Web/HTML/Element/meta#charset) 和
   [meta viewport](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) 标签，所以你可以安全地从你的 `<head>` 中移除它们：

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

```


```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

```
# 优化元数据

1. 任何[元数据文件](/docs/app/building-your-application/optimizing/metadata#file-based-metadata)，如 `favicon.ico`、`icon.png`、`robots.txt`，只要将它们放置在 `app` 目录的顶层，就会自动添加到应用程序的 `<head>` 标签中。将所有支持的文件移动到 `app` 目录后，您可以安全地删除它们的 `<link>` 标签：

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

```

2. 最后，Next.js 可以使用 [元数据 API](/docs/app/building-your-application/optimizing/metadata) 管理您的最后一个 `<head>` 标签。将您的最终元数据信息移动到一个导出的 [`metadata` 对象](/docs/app/api-reference/functions/generate-metadata#metadata-object) 中：

```tsx filename="app/layout.tsx" switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My App is a...',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

```

```jsx filename="app/layout.js" switcher
export const metadata = {
  title: 'My App',
  description: 'My App is a...',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

```

通过上述更改，您从在 `index.html` 中声明一切转变为使用 Next.js 的基于约定的方法，该方法内置于框架中（[元数据 API](/docs/app/building-your-application/optimizing/metadata)）。这种方法使您能够更轻松地提高您的页面的 SEO 和网络共享性。
### 第 5 步：创建入口页面

在 Next.js 中，你可以通过创建一个 `page.tsx` 文件来声明应用程序的入口点。在 Vite 中，这个文件的最接近等价物是你的 `main.tsx` 文件。在这一步中，你将设置应用程序的入口点。

1. **在你的 `app` 目录中创建一个 `[[...slug]]` 目录。**

由于在本指南中我们首先旨在将 Next.js 设置为 SPA（单页应用程序），你需要你的页面入口点捕获应用程序的所有可能路由。为此，在 `app` 目录中创建一个新的 `[[...slug]]` 目录。

这个目录被称为一个
[可选的全捕获路由段](/docs/app/building-your-application/routing/dynamic-routes#optional-catch-all-segments)。
Next.js 使用基于文件系统的路由器，其中
[目录用于定义路由](/docs/app/building-your-application/routing/defining-routes#creating-routes)。
这个特殊目录将确保应用程序的所有路由都将被定向到其包含的 `page.tsx` 文件。

2. **在 `app/[[...slug]]` 目录中创建一个新的 `page.tsx` 文件，内容如下：**

```tsx filename="app/[[...slug]]/page.tsx" switcher
import '../../index.css'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // 我们将更新这个
}
```

```jsx filename="app/[[...slug]]/page.js" switcher
import '../../index.css'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // 我们将更新这个
}
```

> **须知**：页面文件可以使用 `.js`、`.jsx` 或 `.tsx` 扩展名。

这个文件是一个 [服务器组件](/docs/app/building-your-application/rendering/server-components)。当你运行 `next build` 时，该文件会被预渲染为静态资源。它不需要任何动态代码。

这个文件导入了我们的全局 CSS，并告诉 [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) 我们只会生成一个路由，即 `/` 上的索引路由。

现在，让我们移动我们的 Vite 应用程序的其余部分，它将仅在客户端运行。

```tsx filename="app/[[...slug]]/client.tsx" switcher
'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

```jsx filename="app/[[...slug]]/client.js" switcher
'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

这个文件是一个 [客户端组件](/docs/app/building-your-application/rendering/client-components)，由 `'use client'` 指令定义。客户端组件仍然是在服务器上预渲染为 HTML [然后发送到客户端](/docs/app/building-your-application/rendering/client-components#how-are-client-components-rendered)。

由于我们想要从客户端应用程序开始，我们可以配置 Next.js 以禁用从 `App` 组件向下的预渲染。

```tsx
const App = dynamic(() => import('../../App'), { ssr: false })
```

现在，更新你的入口页面以使用新的组件：

```tsx filename="app/[[...slug]]/page.tsx" switcher
import '../../index.css'
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

```jsx filename="app/[[...slug]]/page.js" switcher
import '../../index.css'
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```
### 步骤 6：更新静态图片导入

Next.js 处理静态图片导入的方式与 Vite 略有不同。在 Vite 中，导入一个图片文件会返回其公共 URL 的字符串：

```tsx filename="App.tsx"
import image from './img.png' // `image` 将是 '/assets/img.2d8efhg.png' 在生产环境中

export default function App() {
  return <img src={image} />
}
```

在 Next.js 中，静态图片导入返回一个对象。然后可以直接使用该对象与 Next.js 的 [`<Image>` 组件](/docs/app/api-reference/components/image)，或者可以使用对象的 `src` 属性与现有的 `<img>` 标签一起使用。

`<Image>` 组件具有 [自动图片优化](/docs/app/building-your-application/optimizing/images) 的额外好处。`<Image>` 组件会自动根据图片的尺寸设置生成的 `<img>` 的 `width` 和 `height` 属性。这可以防止图片加载时发生布局偏移。然而，如果您的应用程序中包含的图片只有一个维度被样式化，而另一个没有被样式化为 `auto`，这可能会导致问题。当没有被样式化为 `auto` 时，该维度将默认为 `<img>` 维度属性的值，这可能会导致图片看起来扭曲。

保留 `<img>` 标签将减少您的应用程序中的更改量，并防止上述问题。然后，您可以选择稍后迁移到 `<Image>` 组件，通过 [配置加载器](/docs/app/building-your-application/optimizing/images#loaders) 或转移到具有自动图片优化的默认 Next.js 服务器，以利用优化图片。

1. **将从 `/public` 导入的图片的绝对导入路径转换为相对导入：**

```tsx
// 之前
import logo from '/logo.png'

// 之后
import logo from '../public/logo.png'
```

2. **将图片的 `src` 属性而不是整个图片对象传递给您的 `<img>` 标签：**

```tsx
// 之前
<img src={logo} />

// 之后
<img src={logo.src} />
```

或者，您可以参考基于文件名的图片资源的公共 URL。例如，`public/logo.png` 将为您的应用程序在 `/logo.png` 处提供图片，这将是 `src` 值。

> **警告：** 如果您使用 TypeScript，您在访问 `src` 属性时可能会遇到类型错误。您现在可以安全地忽略这些错误。它们将在本指南结束时被修复。

### 步骤 7：迁移环境变量

Next.js 支持 `.env` [环境变量](/docs/app/building-your-application/configuring/environment-variables)，类似于 Vite。主要的区别是用于在客户端公开环境变量的前缀。

- 将所有带有 `VITE_` 前缀的环境变量更改为 `NEXT_PUBLIC_`。

Vite 在特殊的 `import.meta.env` 对象上公开了一些内置的环境变量，这些变量不受 Next.js 支持。您需要按以下方式更新它们的使用：

- `import.meta.env.MODE` ⇒ `process.env.NODE_ENV`
- `import.meta.env.PROD` ⇒ `process.env.NODE_ENV === 'production'`
- `import.meta.env.DEV` ⇒ `process.env.NODE_ENV !== 'production'`
- `import.meta.env.SSR` ⇒ `typeof window !== 'undefined'`

Next.js 也不提供内置的 `BASE_URL` 环境变量。然而，如果您需要它，您仍然可以配置它：

1. **在您的 `.env` 文件中添加以下内容：**

```bash filename=".env"
# ...
NEXT_PUBLIC_BASE_PATH="/some-base-path"
```

2. **在您的 `next.config.mjs` 文件中将 [`basePath`](/docs/app/api-reference/next-config-js/basePath) 设置为 `process.env.NEXT_PUBLIC_BASE_PATH`：**

```js filename="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 输出为单页应用程序 (SPA)。
  distDir: './dist', // 将构建输出目录更改为 `./dist/`。
  basePath: process.env.NEXT_PUBLIC_BASE_PATH, // 将基础路径设置为 `/some-base-path`。
}

export default nextConfig
```

3. **更新 `import.meta.env.BASE_URL` 的使用情况，以使用 `process.env.NEXT_PUBLIC_BASE_PATH`**
### 第8步：更新 `package.json` 中的脚本

现在你应该能够运行你的应用程序来测试你是否成功迁移到 Next.js。但在此之前，你需要使用 Next.js 相关的命令更新 `package.json` 中的 `scripts`，并将 `.next` 和 `next-env.d.ts` 添加到你的 `.gitignore`：

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

```txt filename=".gitignore"
# ...
.next
next-env.d.ts
dist
```

现在运行 `npm run dev`，并打开 [`http://localhost:3000`](http://localhost:3000)。你应该能看到你的应用程序现在在 Next.js 上运行。

> **示例：** 查看 [这个 pull request](https://github.com/inngest/vite-to-nextjs/pull/1) 以获取一个 Vite 应用程序迁移到 Next.js 的工作示例。

### 第9步：清理

你现在可以从 Vite 相关的工件中清理你的代码库：

- 删除 `main.tsx`
- 删除 `index.html`
- 删除 `vite-env.d.ts`
- 删除 `tsconfig.node.json`
- 删除 `vite.config.ts`
- 卸载 Vite 依赖项

## 下一步

如果一切按计划进行，你现在应该有一个作为单页应用程序运行的 Next.js 应用程序。然而，你还没有充分利用 Next.js 的大多数优势，但你现在可以开始进行增量更改以获得所有的好处。以下是你可能想要接下来做的事情：

- 从 React Router 迁移到 [Next.js 应用路由器](/docs/app/building-your-application/routing) 以获得：
  - 自动代码拆分
  - [流式服务器渲染](/docs/app/building-your-application/routing/loading-ui-and-streaming)
  - [React 服务器组件](/docs/app/building-your-application/rendering/server-components)
- 使用 `<Image>` 组件 [优化图片](/docs/app/building-your-application/optimizing/images)
- 使用 `next/font` [优化字体](/docs/app/building-your-application/optimizing/fonts)
- 使用 `<Script>` 组件 [优化第三方脚本](/docs/app/building-your-application/optimizing/scripts)
- [更新你的 ESLint 配置以支持 Next.js 规则](/docs/app/building-your-application/configuring/eslint)