---
title: CSS模块和全局样式
nav_title: CSS模块
description: 使用CSS模块、全局样式和外部样式表为您的Next.js应用程序添加样式。
---

{/* 本文档的内容在应用程序和页面路由器之间共享。您可以使用 `<PagesOnly>Content</PagesOnly>` 组件添加特定于页面路由器的内容。任何共享的内容都不应被包装在组件中。 */}

<PagesOnly>

<details open>
  <summary>示例</summary>

- [基础CSS示例](https://github.com/vercel/next.js/tree/canary/examples/basic-css)

</details>

</PagesOnly>

Next.js支持不同类型的样式表，包括：

- [CSS模块](#css-modules)
- [全局样式](#global-styles)
- [外部样式表](#external-stylesheets)

## CSS模块

Next.js内置支持使用 `.module.css` 扩展名的CSS模块。

CSS模块通过自动创建一个唯一的类名来局部作用域CSS。这允许您在不同文件中使用相同的类名，而不必担心冲突。这种行为使CSS模块成为包含组件级CSS的理想方式。

## 示例

<AppOnly>
CSS模块可以导入到 `app` 目录中的任何文件：

```tsx filename="app/dashboard/layout.tsx" switcher
import styles from './styles.module.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section className={styles.dashboard}>{children}</section>
}
```

```jsx filename="app/dashboard/layout.js" switcher
import styles from './styles.module.css'

export default function DashboardLayout({ children }) {
  return <section className={styles.dashboard}>{children}</section>
}
```

```css filename="app/dashboard/styles.module.css"
.dashboard {
  padding: 24px;
}
```

</AppOnly>

<PagesOnly>

例如，考虑在 `components/` 文件夹中的一个可重用的 `Button` 组件：

首先，创建 `components/Button.module.css` 并包含以下内容：

```css filename="Button.module.css"
/*
您不需要担心 .error {} 与任何其他 `.css` 或 `.module.css` 文件冲突！*/
.error {
  color: white;
  background-color: red;
}
```

然后，创建 `components/Button.js`，导入并使用上述CSS文件：

```jsx filename="components/Button.js"
import styles from './Button.module.css'

export function Button() {
  return (
    <button
      type="button"
      // 注意 "error" 类是如何作为导入的 `styles` 对象的属性访问的。
      className={styles.error}
    >
      Destroy
    </button>
  )
}
```

</PagesOnly>

CSS模块**仅对具有 `.module.css` 和 `.module.sass` 扩展名的文件启用**。

在生产环境中，所有CSS模块文件将自动合并为**多个最小化和代码拆分**的 `.css` 文件。
这些 `.css` 文件代表您应用程序中的热门执行路径，确保为您的应用程序加载最少的CSS以进行绘制。

## 全局样式

<AppOnly>
全局样式可以导入到 `app` 目录中的任何布局、页面或组件。

> **好要知道**：这与 `pages` 目录不同，您只能在 `_app.js` 文件中导入全局样式。

例如，考虑一个名为 `app/global.css` 的样式表：

```css
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

在根布局（`app/layout.js`）中，导入 `global.css` 样式表以将样式应用于应用程序的每个路由：

```tsx filename="app/layout.tsx" switcher
// 这些样式应用于应用程序的每个路由
import './global.css'

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
import './global.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

</AppOnly>## 应用专用样式

<AppOnly>

在 `app` 目录中的任何地方，包括共存组件，都可以导入外部包发布的样式表：

```tsx filename="app/layout.tsx" switcher
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

> **须知**：外部样式表必须直接从 npm 包导入，或者下载并与你的代码库共存。你不能使用 `<link rel="stylesheet" />`。

</AppOnly>

## 页面专用样式

<PagesOnly>

要向你的应用添加样式表，需要在 `pages/_app.js` 中导入 CSS 文件。

例如，考虑以下名为 `styles.css` 的样式表：

```css filename="styles.css"
body {
  font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica',
    'Arial', sans-serif;
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

如果尚未存在，请创建一个 [`pages/_app.js` 文件](/docs/pages/building-your-application/routing/custom-app)。
然后，[`import`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) `styles.css` 文件。

```jsx filename="pages/_app.js"
import '../styles.css'

// 这个默认导出在新的 `pages/_app.js` 文件中是必需的。
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

这些样式（`styles.css`）将应用于你应用中的所有页面和组件。
由于样式表的全局性质，为了避免冲突，你**只能**在 [`pages/_app.js`](/docs/pages/building-your-application/routing/custom-app) **内部导入它们**。

在开发中，以这种方式表达样式表可以让你在编辑它们时热重载样式，这意味着你可以保持应用状态。

在生产环境中，所有 CSS 文件将自动合并为一个压缩的 `.css` 文件。CSS 被合并的顺序将与 CSS 在 `_app.js` 文件中导入的顺序相匹配。特别要注意包含自己 CSS 的导入 JS 模块；JS 模块的 CSS 将按照导入 CSS 文件的相同排序规则进行合并。例如：

```jsx
import '../styles.css'
// ErrorBoundary 中的 CSS 依赖于 styles.css 中的全局 CSS，
// 所以我们在 styles.css 之后导入它。
import ErrorBoundary from '../components/ErrorBoundary'

export default function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
```

</PagesOnly>

## 外部样式表

<AppOnly>

在 `app` 目录中的任何地方，包括共存组件，都可以导入外部包发布的样式表：

```tsx filename="app/layout.tsx" switcher
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

> **须知**：外部样式表必须直接从 npm 包导入，或者下载并与你的代码库共存。你不能使用 `<link rel="stylesheet" />`。

</AppOnly>

<PagesOnly>

Next.js 允许你从 JavaScript 文件中导入 CSS 文件。
这是因为 Next.js 扩展了 [`import`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) 的概念，使其不仅限于 JavaScript。

### 从 `node_modules` 导入样式

从 Next.js **9.5.4** 开始，在你的应用中的任何地方导入 `node_modules` 中的 CSS 文件都是允许的。

对于全局样式表，如 `bootstrap` 或 `nprogress`，你应该在 `pages/_app.js` 内部导入文件。
例如：

```jsx filename="pages/_app.js"
import 'bootstrap/dist/css/bootstrap.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

对于# 对话框

在 Next.js 中，对话框是一种常见的模式，用于在页面上显示模态内容。以下是如何使用 Tailwind CSS 和 React 实现对话框的示例：

```jsx
import { useState } from 'react'
import { Dialog, VisuallyHidden } from '@headlessui/react'
import 'dialog.css' // 导入你的对话框样式

export default function DialogComponent() {
  const [showDialog, setShowDialog] = useState(false)

  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  return (
    <div>
      <button onClick={open}>打开对话框</button>
      <Dialog isOpen={showDialog} onDismiss={close}>
        <button className="close-button" onClick={close}>
          <VisuallyHidden>关闭</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        <p>你好。我是一个对话框。</p>
      </Dialog>
    </div>
  )
}
```

## 仅页面

### 排序和合并

Next.js 在生产构建中通过自动分块（合并）样式表来优化 CSS。CSS 的顺序由你在应用程序代码中导入样式表的顺序决定。

例如，`base-button.module.css` 会在 `page.module.css` 之前排序，因为 `<BaseButton>` 是在 `<Page>` 中首先导入的：

```tsx filename="base-button.tsx" switcher
import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

```jsx filename="base-button.js" switcher
import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

```tsx filename="page.ts" switcher
import { BaseButton } from './base-button'
import styles from './page.module.css'

export function Page() {
  return <BaseButton className={styles.primary} />
}
```

```jsx filename="page.js" switcher
import { BaseButton } from './base-button'
import styles from './page.module.css'

export function Page() {
  return <BaseButton className={styles.primary} />
}
```

为了保持可预测的顺序，我们建议：

- 只在单个 JS/TS 文件中导入一个 CSS 文件。
  - 如果使用全局类名，在同一个文件中按你希望应用的顺序导入全局样式。
- 优先使用 CSS Modules 而不是全局样式。
  - 使用一致的命名约定为你的 CSS Modules。例如，使用 `<name>.module.css` 而不是 `<name>.tsx`。
- 将共享样式提取到一个单独的共享组件中。
- 如果使用 [Tailwind](/docs/app/building-your-application/styling/tailwind-css)，请在文件顶部导入样式表，最好在 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required) 中。

> **须知：** CSS 排序在开发模式下的行为不同，始终确保检查预览部署以验证生产构建中的最终 CSS 顺序。

## 仅应用

### 排序和合并

Next.js 在生产构建中通过自动分块（合并）样式表来优化 CSS。CSS 的顺序由你在应用程序代码中导入样式表的顺序决定。

例如，`base-button.module.css` 会在 `page.module.css` 之前排序，因为 `<BaseButton>` 是在 `<Page>` 中首先导入的：

```tsx filename="base-button.tsx" switcher
import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

```jsx filename="base-button.js" switcher
import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

```tsx filename="page.ts" switcher
import { BaseButton } from './base-button'
import styles from './page.module.css'

export function Page() {
  return <BaseButton className={styles.primary} />
}
```

```jsx filename="page.js" switcher
import { BaseButton } from './base-button'
import styles from './page.module.css'

export function Page() {
  return <BaseButton className={styles.primary} />
}
```

为了保持可预测的顺序，我们建议：

- 只在单个 JS/TS 文件中导入一个 CSS 文件。
  - 如果使用全局类名，在同一个文件中按你希望应用的顺序导入全局样式。
- 优先使用 CSS Modules 而不是全局样式。
  - 使用一致的命名约定为你的 CSS Modules。例如，使用 `<name>.module.css` 而不是 `<name>.tsx`。
- 提取共享样式到一个单独的共享组件中。
- 如果使用 [Tailwind](/docs/app/building-your-application/styling/tail