# 安装

系统要求：

- [Node.js 18.17](https://nodejs.org/) 或更高版本。
- 支持macOS，Windows（包括WSL）和Linux。

## 自动安装

我们建议使用 [`create-next-app`](/docs/app/api-reference/create-next-app) 开始一个新的Next.js应用程序，它会自动为您设置一切。要创建项目，请运行：

```bash filename="Terminal"
npx create-next-app@latest
```

在安装过程中，您将看到以下提示：

```txt filename="Terminal"
您的项目名称是什么？my-app
您想使用TypeScript吗？否 / 是
您想使用ESLint吗？否 / 是
您想使用Tailwind CSS吗？否 / 是
您想使用 `src/` 目录吗？否 / 是
您想使用应用路由器吗？（推荐）否 / 是
您想自定义默认导入别名 (@/*) 吗？否 / 是
您想配置哪个导入别名？@/*
```

提示结束后，`create-next-app` 将创建一个以您的项目名称命名的文件夹，并安装所需的依赖项。

如果您是Next.js的新手，请查看 [项目结构](/docs/getting-started/project-structure) 文档，以了解应用程序中所有可能的文件和文件夹的概述。

> **须知**：
>
> - Next.js现在默认包含 [TypeScript](/docs/app/building-your-application/configuring/typescript)，[ESLint](/docs/app/building-your-application/configuring/eslint) 和 [Tailwind CSS](/docs/app/building-your-application/styling/tailwind-css) 配置。
> - 您可以选择在项目的根目录中使用 [`src` 目录](/docs/app/building-your-application/configuring/src-directory) 来将应用程序的代码与配置文件分开。

## 手动安装

要手动创建一个新的Next.js应用程序，请安装所需的软件包：

```bash filename="Terminal"
npm install next@latest react@latest react-dom@latest
```

打开您的 `package.json` 文件，并添加以下 `scripts`：

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

- `dev`：运行 [`next dev`](/docs/app/api-reference/next-cli#development) 以在开发模式下启动Next.js。
- `build`：运行 [`next build`](/docs/app/api-reference/next-cli#build) 以构建应用程序以供生产使用。
- `start`：运行 [`next start`](/docs/app/api-reference/next-cli#production) 以启动Next.js生产服务器。
- `lint`：运行 [`next lint`](/docs/app/api-reference/next-cli#lint) 以设置Next.js的内置ESLint配置。

### 创建目录

Next.js 使用文件系统路由，这意味着你的应用程序中的路由是由你的文件结构决定的。

#### `app` 目录

对于新应用程序，我们建议使用 [App Router](/docs/app)。此路由器允许你使用 React 的最新特性，并且是基于社区反馈对 [Pages Router](/docs/pages) 的演进。

创建一个 `app/` 文件夹，然后添加一个 `layout.tsx` 和 `page.tsx` 文件。当用户访问应用程序的根目录（`/`）时，这些文件将被渲染。

![App Folder Structure](https://nextjs.org/_next/image?url=/docs/light/app-getting-started.png&w=3840&q=75)

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
  )
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

最后，创建一个主页 `app/page.tsx` 并添加一些初始内容：

```tsx filename="app/page.tsx" switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

```jsx filename="app/page.js" switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

> **须知**：如果你忘记创建 `layout.tsx`，Next.js 在运行开发服务器时会自动创建此文件，使用命令 `next dev`。

了解更多关于 [使用 App Router](/docs/app/building-your-application/routing/defining-routes)。

#### `pages` 目录（可选）

如果你更倾向于使用 Pages Router 而不是 App Router，你可以在项目的根目录创建一个 `pages/` 文件夹。

然后，在 `pages` 文件夹中添加一个 `index.tsx` 文件。这将是你的主页（`/`）：

```tsx filename="pages/index.tsx" switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

接下来，在 `pages/` 中添加一个 `_app.tsx` 文件以定义全局布局。了解更多关于 [自定义 App 文件](/docs/pages/building-your-application/routing/custom-app)。

```tsx filename="pages/_app.tsx" switcher
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

```jsx filename="pages/_app.js" switcher
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

最后，在 `pages/` 中添加一个 `_document.tsx` 文件以控制服务器的初始响应。了解更多关于 [自定义 Document 文件](/docs/pages/building-your-application/routing/custom-document)。

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

了解更多关于 [使用 Pages Router](/docs/pages/building-your-application/routing/pages-and-layouts)。

> **须知**：尽管你可以在同一个项目中使用两种路由器，`app` 中的路由将优先于 `pages`。我们建议你在新项目中只使用一种路由器，以避免混淆。

#### `public` 文件夹（可选）

创建一个 `public` 文件夹来存储静态资源，如图片、字体等。`public` 目录中的文件可以通过你的代码从基础 URL（`/`）开始引用。

## 运行开发服务器

1. 运行 `npm run dev` 启动开发服务器。
2. 访问 `http://localhost:3000` 查看你的应用程序。
3. 编辑 `app/page.tsx`（或 `pages/index.tsx`）文件并保存，以在浏览器中看到更新的结果。