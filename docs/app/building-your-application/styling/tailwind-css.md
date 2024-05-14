---
title: Tailwind CSS
description: 使用 Tailwind CSS 为您的 Next.js 应用程序添加样式。
---

{/* 此文档的内容在应用和页面路由器之间共享。您可以使用 `<PagesOnly>Content</PagesOnly>` 组件添加特定于页面路由器的内容。任何共享的内容都不应被包装在组件中。 */}

<PagesOnly>

<details open>
  <summary>示例</summary>

- [With Tailwind CSS](https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss)

</details>

</PagesOnly>

[Tailwind CSS](https://tailwindcss.com/) 是一个实用优先的 CSS 框架，与 Next.js 配合得非常好。

## 安装 Tailwind

安装 Tailwind CSS 包并运行 `init` 命令以生成 `tailwind.config.js` 和 `postcss.config.js` 文件：

```bash filename="终端"
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 配置 Tailwind

在 `tailwind.config.js` 中，添加将使用 Tailwind CSS 类名的文件路径：

```js filename="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // 注意添加了 `app` 目录。
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // 或者如果使用 `src` 目录：
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

您不需要修改 `postcss.config.js`。

<AppOnly>

## 导入样式

将 [Tailwind CSS 指令](https://tailwindcss.com/docs/functions-and-directives#directives) 添加到应用程序中的 [全局样式表](/docs/app/building-your-application/styling/css-modules#全局样式)，例如：

```css filename="app/globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;
```

在 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#根布局必需)（`app/layout.tsx`）中，导入 `globals.css` 样式表以将样式应用到应用程序的每个路由。

```tsx filename="app/layout.tsx" switcher
import type { Metadata } from 'next'

// 这些样式应用于应用程序的每个路由
import './globals.css'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: '由 create next app 生成',
}

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
// 这些样式应用于应用程序的每个路由
import './globals.css'

export const metadata = {
  title: 'Create Next App',
  description: '由 create next app 生成',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## 使用类

安装 Tailwind CSS 并添加全局样式后，您可以在应用程序中使用 Tailwind 的实用类。

```tsx filename="app/page.tsx" switcher
export default function Page() {
  return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
}
```

```jsx filename="app/page.js" switcher
export default function Page() {
  return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
}
```

</AppOnly>

<PagesOnly>

## 导入样式

将 [Tailwind CSS 指令](https://tailwindcss.com/docs/functions-and-directives#directives) 添加到应用程序中的 [全局样式表](/docs/pages/building-your-application/styling/css-modules#全局样式)，例如：

```css filename="styles/globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;
```

在 [自定义应用文件](/docs/pages/building-your-application/routing/custom-app)（`pages/_app.js`）中，导入 `globals.css` 样式表以将样式应用到应用程序的每个路由。

```## _app.tsx 文件

```tsx filename="pages/_app.tsx" switcher
// 这些样式应用于应用程序中的每个路由
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

## _app.js 文件

```jsx filename="pages/_app.js" switcher
// 这些样式应用于应用程序中的每个路由
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

## 使用类

在安装了 Tailwind CSS 并添加了全局样式之后，你可以在应用程序中使用 Tailwind 的实用类。

```tsx filename="pages/index.tsx" switcher
export default function Page() {
  return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
}
```

```jsx filename="pages/index.js" switcher
export default function Page() {
  return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
}
```

</PagesOnly>

## 与 Turbopack 的使用

从 Next.js 13.1 开始，[Turbopack](https://turbo.build/pack/docs/features/css#tailwind-css) 支持 Tailwind CSS 和 PostCSS。