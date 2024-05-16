---
title: CSS 模块和全局样式
nav_title: CSS 模块
description: 使用 CSS 模块、全局样式和外部样式表为 Next.js 应用程序添加样式。
---
# CSS 模块

<PagesOnly>

<details open>
  <summary>示例</summary>

- [基础 CSS 示例](https://github.com/vercel/next.js/tree/canary/examples/basic-css)

</details>

</PagesOnly>

Next.js 支持不同类型的样式表，包括：

- [CSS 模块](#css-模块)
- [全局样式](#全局样式)
- [外部样式表](#外部样式表)

## CSS 模块

Next.js 内置支持使用 `.module.css` 扩展名的 CSS 模块。

CSS 模块通过自动创建一个唯一的类名来局部作用域 CSS。这允许您在不同文件中使用相同的类名，而不必担心冲突。这种行为使 CSS 模块成为包含组件级 CSS 的理想方式。

## 示例

<AppOnly>
CSS 模块可以导入到 `app` 目录中的任何文件：

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

例如，考虑在 `components/` 文件夹中的一个可复用的 `Button` 组件：

首先，创建 `components/Button.module.css` 并包含以下内容：

```css filename="Button.module.css"
/*
您不需要担心 .error {} 与任何其他 `.css` 或 `.module.css` 文件冲突！*/
.error {
  color: white;
  background-color: red;
}
```

然后，创建 `components/Button.js`，导入并使用上述 CSS 文件：

```jsx filename="components/Button.js"
import styles from './Button.module.css'

export function Button() {
  return (
    <button
      type="button"
      // 注意 "error" 类是如何作为属性访问导入的 `styles` 对象的。
      className={styles.error}
    >
      Destroy
    </button>
  )
}
```

</PagesOnly>

CSS 模块**仅对具有 `.module.css` 和 `.module.sass` 扩展名的文件启用**。

在生产环境中，所有 CSS 模块文件将自动合并为**多个最小化和代码拆分**的 `.css` 文件。
这些 `.css` 文件代表您应用程序中的热门执行路径，确保为您的应用程序加载的 CSS 最小化，以便进行绘制。

须知：

## 全局样式

<AppOnly>
全局样式可以导入到 `app` 目录中的任何布局、页面或组件。

> **须知**：这与 `pages` 目录不同，在 `pages` 目录中，您只能在 `_app.js` 文件中导入全局样式。

例如，考虑一个名为 `app/global.css` 的样式表：

```css
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

在根布局（`app/layout.js`）中，导入 `global.css` 样式表以将样式应用到应用程序的每个路由：

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

</AppOnly>

<PagesOnly>

要向您的应用程序添加样式表，请在 `pages/_app.js` 中导入 CSS 文件。

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
然后，[`导入`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) `styles.css` 文件。

```jsx filename="pages/_app.js"
import '../styles.css'

// 在新的 `pages/_app.js` 文件中需要这个默认导出。
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

这些样式（`styles.css`）将应用于应用程序的所有页面和组件。
由于样式表的全局性质，为了避免冲突，您**只能将其导入到 [`pages/_app.js`](/docs/pages/building-your-application/routing/custom-app) 内**。

在开发中，以这种方式表达样式表允许您在编辑它们时进行热重载样式——这意味着您可以保持应用程序状态。

在生产环境中，所有 CSS 文件将自动合并为一个压缩的 `.css` 文件。CSS 合并的顺序将与 CSS 导入到 `_app.js` 文件中的顺序相匹配。特别要注意包含自己 CSS 的导入 JS 模块；JS 模块的 CSS 将按照导入 CSS 文件的相同排序规则进行合并。例如：

```jsx
import '../styles.css'
// ErrorBoundary 中的 CSS 依赖于 styles.css 中的全局 CSS，
// 因此我们在 styles.css 之后导入它。
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

外部包发布的样式表可以在 `app` 目录的任何地方导入，包括共同定位的组件：

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

> **须知**：外部样式表必须直接从 npm 包导入，或下载并与你的代码库共同定位。你不能使用 `<link rel="stylesheet" />`。

</AppOnly>

<PagesOnly>

Next.js 允许你从 JavaScript 文件导入 CSS 文件。
这是可能的，因为 Next.js 扩展了 [`import`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) 的概念，超越了 JavaScript。

### 从 `node_modules` 导入样式

自 Next.js **9.5.4** 起，在你的应用程序的任何地方导入 `node_modules` 中的 CSS 文件都是允许的。

对于全局样式表，如 `bootstrap` 或 `nprogress`，你应该在 `pages/_app.js` 内部导入文件。
例如：

```jsx filename="pages/_app.js"
import 'bootstrap/dist/css/bootstrap.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

对于第三方组件所需的 CSS，你可以在你的组件中这样做。
例如：

```jsx filename="components/example-dialog.js"
import { useState } from 'react'
import { Dialog } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'

function ExampleDialog(props) {
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
        <p>你好。我是一个对话框</p>
      </Dialog>
    </div>
  )
}
```

</PagesOnly>

> **注意**：以上内容为Markdown格式的代码示例，实际使用时请根据具体项目结构和需求进行调整。

## 排序和合并

Next.js 在生产构建中通过自动分块（合并）样式表来优化 CSS。CSS 的顺序由您将样式表导入到应用程序代码中的顺序决定。

例如，`base-button.module.css` 会在 `page.module.css` 之前排序，因为 `<BaseButton>` 是在 `<Page>` 中首先被导入的：

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

为了保持一个可预测的顺序，我们建议：

- 只在单个 JS/TS 文件中导入一个 CSS 文件。
  - 如果使用全局类名，按照您希望应用的顺序在同一个文件中导入全局样式。
- 优先使用 CSS Modules 而不是全局样式。
  - 使用一致的命名约定为您的 CSS Modules。例如，使用 `<name>.module.css` 而不是 `<name>.tsx`。
- 将共享的样式提取到一个单独的共享组件中。
- 如果使用 [Tailwind](/docs/app/building-your-application/styling/tailwind-css)，请在文件顶部导入样式表，最好在 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required) 中。

> **须知：** CSS 排序在开发模式下的行为不同，始终确保检查预览部署以验证生产构建中的最终 CSS 顺序。


## 附加特性

Next.js 包含一些附加特性，以改善添加样式的编写体验：

- 在使用 `next dev` 进行本地运行时，本地样式表（无论是全局还是 CSS Modules）将利用 [Fast Refresh](/docs/architecture/fast-refresh) 功能，以便在保存编辑时立即反映更改。
- 在使用 `next build` 构建生产版本时，CSS 文件将被打包成较少的压缩 `.css` 文件，以减少检索样式所需的网络请求数量。
- 如果禁用了 JavaScript，样式仍然会在生产构建中加载（`next start`）。然而，为了启用 [Fast Refresh](/docs/architecture/fast-refresh)，`next dev` 仍然需要 JavaScript。