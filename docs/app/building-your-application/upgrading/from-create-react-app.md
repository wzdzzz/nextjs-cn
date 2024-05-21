---
title: 从 Create React App 迁移到 Next.js
description: 学习如何将现有的 React 应用程序从 Create React App 迁移到 Next.js。
---
# 从 Create React App 迁移到 Next.js
本指南将帮助您将现有的 Create React App 网站迁移到 Next.js。

## 为什么转换？

您可能想要从 Create React App 转换到 Next.js 的几个原因：

### 初始页面加载时间慢

Create React App 仅使用客户端 React。仅客户端应用程序，也称为单页应用程序（SPA），通常会遇到初始页面加载时间慢的问题。这有几个原因：

1. 浏览器需要等待 React 代码和整个应用程序捆绑包下载并运行后，您的代码才能发送请求加载数据。
2. 随着您添加的每个新功能和依赖项，您的应用程序代码也会增长。

### 没有自动代码分割

通过代码分割可以部分管理慢速加载时间的问题。然而，如果您尝试手动进行代码分割，往往会使性能变得更糟。手动代码分割时，很容易不经意地引入网络瀑布流。Next.js 提供了内置于其路由器中的自动代码分割。

### 网络瀑布流

应用程序进行顺序的客户端-服务器请求以获取数据是性能不佳的常见原因之一。在 SPA 中获取数据的一个常见模式是最初呈现一个占位符，然后在组件挂载后获取数据。不幸的是，这意味着直到父组件完成加载自己的数据后，获取数据的子组件才能开始获取。

虽然 Next.js 支持客户端获取数据，但它还允许您将数据获取转移到服务器上，这可以消除客户端-服务器瀑布流。

### 快速和有意图的加载状态

通过内置的 [React Suspense 流式处理](/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense) 支持，您可以更有意图地决定您希望 UI 的哪些部分首先加载以及加载顺序，而不会引入网络瀑布流。

这使您能够构建加载速度更快的页面，并消除 [布局偏移](https://vercel.com/blog/how-core-web-vitals-affect-seo)。

### 选择数据获取策略

根据您的需求，Next.js 允许您在页面和组件基础上选择您的数据获取策略。您可以决定在构建时获取，在服务器上的请求时获取，或在客户端获取。例如，您可以在构建时从您的 CMS 获取数据并呈现您的博客文章，然后可以有效地在 CDN 上进行缓存。

### 中间件

[Next.js 中间件](/docs/app/building-your-application/routing/middleware) 允许您在请求完成之前在服务器上运行代码。这在避免用户访问仅经过身份验证的页面时出现未经身份验证的内容闪烁特别有用，方法是将用户重定向到登录页面。中间件还适用于实验和 [国际化](/docs/app/building-your-application/routing/internationalization)。

### 内置优化

[图片](/docs/app/building-your-application/optimizing/images)、[字体](/docs/app/building-your-application/optimizing/fonts) 和 [第三方脚本](/docs/app/building-your-application/optimizing/scripts) 通常对应用程序的性能有显著影响。Next.js 提供了自动为您优化这些的内置组件。

## 迁移步骤

我们进行此迁移的目标是尽快获得一个可工作的 Next.js 应用程序，这样您就可以逐步采用 Next.js 功能。首先，我们将保持它作为一个纯粹的客户端应用程序（SPA），而不迁移您现有的路由器。这有助于最小化在迁移过程中遇到问题的机会并减少合并冲突。
### 安装 Next.js 依赖

首先，你需要将 `next` 安装为依赖项：

```bash filename="终端"
npm install next@latest
```

### 创建 Next.js 配置文件

在你的项目根目录创建一个 `next.config.mjs` 文件。这个文件将包含你的 [Next.js 配置选项](/docs/app/api-reference/next-config-js)。

```js filename="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 输出一个单页应用程序 (SPA)。
  distDir: './dist', // 将构建输出目录更改为 `./dist/`。
}

export default nextConfig
```

### 更新 TypeScript 配置

如果你正在使用 TypeScript，你需要更新你的 `tsconfig.json` 文件，以使它与 Next.js 兼容：

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "strictNullChecks": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "./dist/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

你可以在 [Next.js 文档](/docs/app/building-your-application/configuring/typescript#typescript-plugin) 中找到更多关于配置 TypeScript 的信息。
### 第 4 步：创建根布局

Next.js [App Router](/docs/app) 应用程序必须包含一个 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required) 文件，这是一个 [React Server Component](/docs/app/building-your-application/rendering/server-components)，将包裹你应用程序中的所有页面。此文件定义在 `app` 目录的顶层。

在 CRA 应用程序中，与根布局文件最接近的等效项是 `index.html` 文件，其中包含你的 `<html>`、`<head>` 和 `<body>` 标签。

在这一步中，你将把你的 `index.html` 文件转换成一个根布局文件：

1. 在你的 `src` 目录中创建一个新的 `app` 目录。
2. 在那个 `app` 目录内创建一个新的 `layout.tsx` 文件：

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

> **须知**：布局文件可以使用 `.js`、`.jsx` 或 `.tsx` 扩展名。

将你的 `index.html` 文件的内容复制到之前创建的 `<RootLayout>` 组件中，同时将 `body.div#root` 和 `body.script` 标签替换为 `<div id="root">{children}</div>`：

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
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
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

> **须知**：我们将忽略 [清单文件](/docs/app/api-reference/file-conventions/metadata)、除了 favicon 之外的额外图标，以及 [测试配置](/docs/app/building-your-application/testing)，但如果这些是需求，Next.js 也支持这些选项。
### 第5步：元数据

Next.js 默认包含了 [meta charset](https://developer.mozilla.org/docs/Web/HTML/Element/meta#charset) 和 [meta viewport](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) 标签，因此你可以安全地从 `<head>` 中移除这些标签：

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
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
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

任何 [元数据文件](/docs/app/building-your-application/optimizing/metadata#file-based-metadata)，如 `favicon.ico`、`icon.png`、`robots.txt`，只要你将它们放置在 `app` 目录的顶层，它们就会被自动添加到应用程序的 `<head>` 标签中。将 [所有支持的文件](/docs/app/building-your-application/optimizing/metadata#file-based-metadata) 移动到 `app` 目录后，你可以安全地删除它们的 `<link>` 标签：

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>React App</title>
        <meta name="description" content="Web site created..." />
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
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

最后，Next.js 可以使用 [元数据 API](/docs/app/building-your-application/optimizing/metadata) 管理你最后的 `<head>` 标签。将你最终的元数据信息移动到一个导出的 [`metadata` 对象](/docs/app/api-reference/functions/generate-metadata#metadata-object) 中：

```tsx filename="app/layout.tsx" switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
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
  title: 'React App',
  description: 'Web site created with Next.js.',
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

通过上述更改，你从在 `index.html` 中声明所有内容转变为使用 Next.js 内置的基于约定的方法 ([元数据 API](/docs/app/building-your-application/optimizing/metadata))。这种方法使你能够更轻松地提高你的页面的 SEO 和网络共享性。
### 第6步：样式

像Create React App一样，Next.js内置了对[CSS Modules](/docs/app/building-your-application/styling/css-modules)的支持。

如果你正在使用全局CSS文件，请将其导入到你的`app/layout.tsx`文件中：

```tsx filename="app/layout.tsx" switcher
import '../index.css'

// ...
```

如果你正在使用Tailwind，你需要安装`postcss`和`autoprefixer`：

```bash filename="终端"
npm install postcss autoprefixer
```

然后，在项目根目录创建一个`postcss.config.js`文件：

```js filename="postcss.config.js"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
### 第7步：创建入口页面

在 Next.js 中，你可以通过创建一个 `page.tsx` 文件来声明你的应用程序的入口点。在 CRA 中，这个文件的最接近等价物是你的 `src/index.tsx` 文件。在这一步中，你将设置你的应用程序的入口点。

**在你的 `app` 目录中创建一个 `[[...slug]]` 目录。**

由于本指南的目标是首先将我们的 Next.js 设置为 SPA（单页应用程序），你需要你的页面入口点捕获应用程序的所有可能路由。为此，在 `app` 目录中创建一个新的 `[[...slug]]` 目录。

这个目录被称为[可选的全捕获路由段](/docs/app/building-your-application/routing/dynamic-routes#optional-catch-all-segments)。Next.js 使用基于文件系统的路由器，其中[目录用于定义路由](/docs/app/building-your-application/routing/defining-routes#creating-routes)。这个特殊目录将确保你的应用程序的所有路由都将被定向到其包含的 `page.tsx` 文件。

**在 `app/[[...slug]]` 目录中创建一个新的 `page.tsx` 文件，内容如下：**

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

这个文件是一个[服务器组件](/docs/app/building-your-application/rendering/server-components)。当你运行 `next build` 时，该文件被预渲染为静态资源。它不需要任何动态代码。

这个文件导入了我们的全局 CSS，并告诉 [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) 我们只打算生成一个路由，即 `/` 上的索引路由。

现在，让我们移动我们的 CRA 应用程序的其余部分，它将仅在客户端运行。

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

这个文件是一个[客户端组件](/docs/app/building-your-application/rendering/client-components)，由 `'use client'` 指令定义。客户端组件仍然在服务器上[预渲染为 HTML](/docs/app/building-your-application/rendering/client-components#how-are-client-components-rendered)，然后发送到客户端。

由于我们想要一个仅在客户端启动的应用程序，我们可以配置 Next.js 以禁用从 `App` 组件向下的预渲染。

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
### 第8步：更新静态图像导入

Next.js 处理静态图像导入的方式与 CRA（Create React App）略有不同。在 CRA 中，导入一个图像文件会返回其公共 URL 的字符串：

```tsx filename="App.tsx"
import image from './img.png'

export default function App() {
  return <img src={image} />
}
```

在 Next.js 中，静态图像导入返回一个对象。然后，该对象可以直接与 Next.js 的 [`<Image>` 组件](/docs/app/api-reference/components/image) 使用，或者您可以使用对象的 `src` 属性与现有的 `<img>` 标签一起使用。

`<Image>` 组件具有 [自动图像优化](/docs/app/building-your-application/optimizing/images) 的额外好处。`<Image>` 组件会自动根据图像的尺寸设置生成的 `<img>` 的 `width` 和 `height` 属性。这可以防止图像加载时发生布局偏移。然而，如果您的应用程序中包含的图像只有一个维度被样式化，而另一个没有被样式化为 `auto`，这可能会导致问题。当没有被样式化为 `auto` 时，该维度将默认为 `<img>` 维度属性的值，这可能会导致图像出现扭曲。

保留 `<img>` 标签将减少您的应用程序中的更改量，并防止上述问题。然后，您可以选择稍后迁移到 `<Image>` 组件，通过 [配置加载器](/docs/app/building-your-application/optimizing/images#loaders) 或移动到具有自动图像优化的默认 Next.js 服务器，以利用优化图像的优势。

**将从 `/public` 导入的图像的绝对导入路径转换为相对导入：**

```tsx
// 之前
import logo from '/logo.png'

// 之后
import logo from '../public/logo.png'
```

**将图像的 `src` 属性而不是整个图像对象传递给您的 `<img>` 标签：**

```tsx
// 之前
<img src={logo} />

// 之后
<img src={logo.src} />
```

或者，您可以参考基于文件名的公共 URL 来引用图像资产。例如，`public/logo.png` 将为您的应用程序在 `/logo.png` 处提供图像，这将是 `src` 值。

> **警告：** 如果您使用的是 TypeScript，您在访问 `src` 属性时可能会遇到类型错误。您现在可以安全地忽略这些错误。它们将在本指南结束时被修复。

### 第9步：迁移环境变量

Next.js 支持与 CRA 类似的 `.env` [环境变量](/docs/app/building-your-application/configuring/environment-variables)。

主要的区别是在客户端公开环境变量时使用的前缀。将所有带有 `REACT_APP_` 前缀的环境变量更改为 `NEXT_PUBLIC_`。

### 第10步：更新 `package.json` 中的脚本

现在您应该能够运行您的应用程序来测试您是否成功迁移到 Next.js。但在此之前，您需要使用 Next.js 相关的命令更新 `package.json` 中的 `scripts`，并在您的 `.gitignore` 文件中添加 `.next`、`next-env.d.ts` 和 `dist`：

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

现在运行 `npm run dev`，并打开 [`http://localhost:3000`](http://localhost:3000)。您应该看到您的应用程序现在正在 Next.js 上运行。

### 第11步：清理

现在您可以从 Create React App 相关的工件中清理您的代码库：

- 删除 `src/index.tsx`
- 删除 `public/index.html`
- 删除 `reportWebVitals` 设置
- 卸载 CRA 依赖项（`react-scripts`）
## 打包器兼容性

Create React App 和 Next.js 默认都使用 webpack 进行打包。

当将您的 CRA 应用程序迁移到 Next.js 时，您可能有一个自定义的 webpack 配置想要迁移。Next.js 支持提供 [自定义 webpack 配置](/docs/app/api-reference/next-config-js/webpack)。

此外，Next.js 通过 `next dev --turbo` 支持 [Turbopack](/docs/app/api-reference/next-config-js/turbo) 以提高您的本地开发性能。Turbopack 还支持一些 [webpack 加载器](/docs/app/api-reference/next-config-js/turbo)，以实现兼容性和逐步采用。

## 下一步

如果一切按计划进行，您现在应该有一个作为单页应用程序运行的 Next.js 应用程序。然而，您还没有充分利用 Next.js 的大部分优势，但您现在可以开始进行增量更改以获得所有优势。以下是您可能想要接下来做的事情：

- 从 React Router 迁移到 [Next.js App Router](/docs/app/building-your-application/routing) 以获得：
  - 自动代码分割
  - [流式服务器渲染](/docs/app/building-your-application/routing/loading-ui-and-streaming)
  - [React 服务器组件](/docs/app/building-your-application/rendering/server-components)
- 使用 `<Image>` 组件 [优化图片](/docs/app/building-your-application/optimizing/images)
- 使用 `next/font` [优化字体](/docs/app/building-your-application/optimizing/fonts)
- 使用 `<Script>` 组件 [优化第三方脚本](/docs/app/building-your-application/optimizing/scripts)
- [更新您的 ESLint 配置以支持 Next.js 规则](/docs/app/building-your-application/configuring/eslint)

> **须知：** 使用静态导出 [目前不支持](https://github.com/vercel/next.js/issues/54393) 使用 `useParams` 钩子。