---
title: 安装
description: 使用 `create-next-app` 创建一个新的 Next.js 应用程序。设置 TypeScript，样式，并配置你的 `next.config.js` 文件。
related:
  title: 下一步
  description: 了解你的 Next.js 项目中的文件和文件夹。
  links:
    - getting-started/project-structure
---
# 安装

系统要求：

- [Node.js 18.17](https://nodejs.org/) 或更高版本。
- 支持 macOS、Windows（包括 WSL）和 Linux。

## 自动安装

我们建议使用 [`create-next-app`](/docs/app/api-reference/create-next-app) 开始一个新的 Next.js 应用，它会自动为你设置好一切。要创建一个项目，请运行：

```bash filename="终端"
npx create-next-app@latest
```

在安装过程中，你将看到以下提示：

```txt filename="终端"
你的项目名称是什么？my-app
你想使用 TypeScript 吗？否 / 是
你想使用 ESLint 吗？否 / 是
你想使用 Tailwind CSS 吗？否 / 是
你想使用 `src/` 目录吗？否 / 是
你想使用 App Router 吗？（推荐）否 / 是
你想自定义默认导入别名 (@/*) 吗？否 / 是
你想要配置的导入别名是什么？@/*
```

提示结束后，`create-next-app` 将创建一个以你的项目名称命名的文件夹并安装所需的依赖。

如果你是 Next.js 的新手，请查看 [项目结构](/docs/getting-started/project-structure) 文档，了解应用程序中所有可能的文件和文件夹的概览。

> **须知**：
>
> - Next.js 现在默认包含 [TypeScript](/docs/app/building-your-application/configuring/typescript)，[ESLint](/docs/app/building-your-application/configuring/eslint) 和 [Tailwind CSS](/docs/app/building-your-application/styling/tailwind-css) 配置。
> - 你可以选择在项目的根目录中使用 [`src` 目录](/docs/app/building-your-application/configuring/src-directory) 来将应用程序的代码与配置文件分开。

## 手动安装

要手动创建一个新的 Next.js 应用，请安装所需的包：

```bash filename="终端"
npm install next@latest react@latest react-dom@latest
```

打开你的 `package.json` 文件，并添加以下 `scripts`：

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

这些脚本指的是开发应用程序的不同阶段：

- `dev`：运行 [`next dev`](/docs/app/api-reference/next-cli#development) 以开发模式启动 Next.js。
- `build`：运行 [`next build`](/docs/app/api-reference/next-cli#build) 构建生产环境的应用程序。
- `start`：运行 [`next start`](/docs/app/api-reference/next-cli#production) 启动 Next.js 生产服务器。
- `lint`：运行 [`next lint`](/docs/app/api-reference/next-cli#lint) 设置 Next.js 的内置 ESLint 配置。

### 创建目录

Next.js 使用文件系统路由，这意味着你的应用程序中的路由是由你的文件结构决定的。

#### `app` 目录

对于新应用程序，我们建议使用 [App Router](/docs/app)。这个路由器允许你使用 React 的最新特性，并且是基于社区反馈对 [Pages Router](/docs/pages) 的演进。

创建一个 `app/` 文件夹，然后添加一个 `layout.tsx` 和 `page.tsx` 文件。当用户访问你的应用程序的根目录 (`/`) 时，这些文件将被渲染。

<Image
  alt="App Folder Structure"
  srcLight="/docs/light/app-getting-started.png"
  srcDark="/docs/dark/app-getting-started.png"
  width="1600"
  height="363"
/>

在 `app/layout.tsx` 内部创建一个 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)，包含必需的 `<html>` 和 `<body>` 标签：

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

最后，创建一个首页 `app/page.tsx` 并添加一些初始内容：

```tsx filename="app/page.tsx" switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

> **须知**：如果你忘记创建 `layout.tsx`，当你使用 `next dev` 运行开发服务器时，Next.js 会自动创建这个文件。

了解更多关于[使用 App Router](/docs/app/building-your-application/routing/defining-routes)。

#### `pages` 目录（可选）

如果你更喜欢使用 Pages Router 而不是 App Router，你可以在项目的根目录下创建一个 `pages/` 目录。

然后，在 `pages` 文件夹内添加一个 `index.tsx` 文件。这将是你的首页（`/`）：

```tsx filename="pages/index.tsx" switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

接下来，在 `pages/` 内添加一个 `_app.tsx` 文件来定义全局布局。了解更多关于[自定义 App 文件](/docs/pages/building-your-application/routing/custom-app)。

```tsx filename="pages/_app.tsx" switcher
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

最后，在 `pages/` 内添加一个 `_document.tsx` 文件来控制服务器的初始响应。了解更多关于[自定义 Document 文件](/docs/pages/building-your-application/routing/custom-document)。

```tsx filename="pages/_document.tsx" switcher
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

了解更多关于[使用 Pages Router](/docs/pages/building-your-application/routing/pages-and-layouts)。

> **须知**：尽管你可以在同一个项目中使用两种路由器，`app` 中的路由将优先于 `pages`。我们建议在你的新项目中只使用一个路由器，以避免混淆。

#### `public` 文件夹（可选）

创建一个 `public` 文件夹来存储静态资源，如图片、字体等。`public` 目录中的文件可以通过你的代码引用，从基础 URL（`/`）开始。

## 运行开发服务器

1. 运行 `npm run dev` 来启动开发服务器。
2. 访问 `http://localhost:3000` 来查看你的应用程序。
3. 编辑 `app/page.tsx`（或 `pages/index.tsx`）文件并保存，然后在浏览器中查看更新后的结果。