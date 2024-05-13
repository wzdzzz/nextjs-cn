---
title: 安装
description: 使用 `create-next-app` 创建一个新的 Next.js 应用程序。设置 TypeScript、样式，并配置您的 `next.config.js` 文件。
related:
  title: 下一步
  description: 了解您的 Next.js 项目中的文件和文件夹。
  links:
    - getting-started/project-structure
---

系统要求：

- [Node.js 18.17](https://nodejs.org/) 或更高版本。
- 支持 macOS、Windows（包括 WSL）和 Linux。

## 自动安装

我们建议使用 [`create-next-app`](/docs/app/api-reference/create-next-app) 开始一个新的 Next.js 应用程序，它会自动为您设置一切。要创建一个项目，请运行：

```bash filename="终端"
npx create-next-app@latest
```

在安装过程中，您将看到以下提示：

```txt filename="终端"
您的项目名称是什么？my-app
您想使用 TypeScript 吗？否 / 是
您想使用 ESLint 吗？否 / 是
您想使用 Tailwind CSS 吗？否 / 是
您想使用 `src/` 目录吗？否 / 是
您想使用 App Router 吗？（推荐）否 / 是
您想自定义默认导入别名 (@/*) 吗？否 / 是
您想配置哪个导入别名？@/*
```

提示完成后，`create-next-app` 将创建一个以您的项目名称命名的文件夹并安装所需的依赖项。

如果您是 Next.js 的新手，请查看 [项目结构](/docs/getting-started/project-structure) 文档，以了解应用程序中所有可能的文件和文件夹的概述。

> **须知**：
>
> - Next.js 现在默认包含 [TypeScript](/docs/app/building-your-application/configuring/typescript)、[ESLint](/docs/app/building-your-application/configuring/eslint) 和 [Tailwind CSS](/docs/app/building-your-application/styling/tailwind-css) 配置。
> - 您可以选择在项目的根目录中使用 [`src` 目录](/docs/app/building-your-application/configuring/src-directory) 来将应用程序的代码与配置文件分开。

## 手动安装

要手动创建一个新的 Next.js 应用程序，请安装所需的包：

```bash filename="终端"
npm install next@latest react@latest react-dom@latest
```

打开您的 `package.json` 文件并添加以下 `scripts`：

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

这些脚本引用了开发应用程序的不同阶段：

- `dev`：运行 [`next dev`](/docs/app/api-reference/next-cli#development) 以开发模式启动 Next.js。
- `build`：运行 [`next build`](/docs/app/api-reference/next-cli#build) 构建生产环境的应用程序。
- `start`：运行 [`next start`](/docs/app/api-reference/next-cli#production) 启动 Next.js 生产服务器。
- `lint`：运行 [`next lint`](/docs/app/api-reference/next-cli#lint) 设置 Next.js 的内置 ESLint 配置。

### 创建目录

Next.js 使用文件系统路由，这意味着应用程序中的路由由您的文件结构决定。

#### `app` 目录

对于新应用程序，我们建议使用 [App Router](/docs/app)。这个路由器允许您使用 React 的最新特性，并且是基于社区反馈对 [Pages Router](/docs/pages) 的演进。

创建一个 `app/` 文件夹，然后添加一个 `layout.tsx` 和 `page.tsx` 文件。当用户访问应用程序的根目录 (`/`) 时，这些文件将被渲染。

<Image
alt="App 文件夹结构"
srcLight="/docs/light/app-getting-started.png"
srcDark="/docs/dark/app-getting-started.png"
width="1600"
height="363"
/>

在 `app/layout.tsx` 内创建一个 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)，包含必需的 `<html>` 和 `<body>` 标签：

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

最后，创建一个主页 `app/page.tsx` 并添加一些初始