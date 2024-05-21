---
title: 布局和模板
description: 在Next.js中创建你的第一个共享布局。
---

特殊的文件[layout.js](#layouts)和[template.js](#templates)允许你在[路由](/docs/app/building-your-application/routing/defining-routes#creating-routes)之间创建共享的UI。本页将指导你如何以及何时使用这些特殊文件。

## 布局

布局是在多个路由之间**共享**的UI。在导航时，布局会保留状态，保持交互性，并且不会重新渲染。布局也可以[嵌套](#nesting-layouts)。

你可以通过从一个`layout.js`文件默认导出一个React组件来定义一个布局。该组件应该接受一个`children`属性，该属性将在渲染期间用子布局（如果存在）或页面填充。

例如，布局将与`/dashboard`和`/dashboard/settings`页面共享：

<img
  alt="layout.js特殊文件"
  src="https://nextjs.org/_next/image?url=/docs/light/layout-special-file.png&w=3840&q=75"
  srcDark="/docs/dark/layout-special-file.png"
  width="1600"
  height="606"
/>

```tsx filename="app/dashboard/layout.tsx" switcher
export default function DashboardLayout({
  children, // 将是一个页面或嵌套布局
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {/* 在此处包含共享的UI，例如标题栏或侧边栏 */}
      <nav></nav>

      {children}
    </section>
  )
}
```

```jsx filename="app/dashboard/layout.js" switcher
export default function DashboardLayout({
  children, // 将是一个页面或嵌套布局
}) {
  return (
    <section>
      {/* 在此处包含共享的UI，例如标题栏或侧边栏 */}
      <nav></nav>

      {children}
    </section>
  )
}
```

### 根布局（必需）

根布局在`app`目录的顶层定义，并适用于所有路由。此布局是**必需的**，并且必须包含`html`和`body`标签，允许你修改服务器返回的初始HTML。

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* 布局UI */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 布局UI */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```
### 嵌套布局

默认情况下，文件夹层级中的布局是**嵌套**的，这意味着它们通过它们的`children`属性包装子布局。您可以通过在特定路由段（文件夹）中添加`layout.js`来嵌套布局。

例如，要为`/dashboard`路由创建一个布局，在`dashboard`文件夹中添加一个新的`layout.js`文件：

![嵌套布局](https://nextjs.org/_next/image?url=/docs/light/nested-layout.png&w=3840&q=75)

```tsx filename="app/dashboard/layout.tsx" switcher
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

```jsx filename="app/dashboard/layout.js" switcher
export default function DashboardLayout({ children }) {
  return <section>{children}</section>
}
```

如果您要组合上述两个布局，根布局（`app/layout.js`）将包装仪表板布局（`app/dashboard/layout.js`），后者将包装`app/dashboard/*`内的路由段。

这两个布局将如下嵌套：

![嵌套布局](https://nextjs.org/_next/image?url=/docs/light/nested-layouts-ui.png&w=3840&q=75)

> **须知**：
>
> - 布局可以使用`.js`、`.jsx`或`.tsx`文件扩展名。
> - 只有根布局可以包含`<html>`和`<body>`标签。
> - 当在同一文件夹中定义了`layout.js`和`page.js`文件时，布局将包装页面。
> - 布局默认是[服务器组件](/docs/app/building-your-application/rendering/server-components)，但可以设置为[客户端组件](/docs/app/building-your-application/rendering/client-components)。
> - 布局可以获取数据。查看[数据获取](/docs/app/building-your-application/data-fetching)部分以获取更多信息。
> - 父布局与其子布局之间无法传递数据。然而，您可以在路由中多次获取相同的数据，React将[自动去重请求](/docs/app/building-your-application/caching#request-memoization)而不影响性能。
> - 布局无法访问`pathname`（[了解更多](/docs/app/api-reference/file-conventions/layout)）。但是，导入的客户端组件可以使用[`usePathname`](/docs/app/api-reference/functions/use-pathname)钩子访问路径名。
> - 布局无法访问其下方的路由段。要访问所有路由段，您可以在客户端组件中使用[`useSelectedLayoutSegment`](/docs/app/api-reference/functions/use-selected-layout-segment)或[`useSelectedLayoutSegments`](/docs/app/api-reference/functions/use-selected-layout-segments)。
> - 您可以使用[路由组](/docs/app/building-your-application/routing/route-groups)将特定路由段选择性地包含或排除在共享布局中。
> - 您可以使用[路由组](/docs/app/building-your-application/routing/route-groups)创建多个根布局。[在这里查看示例](/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts)。
> - **从`pages`目录迁移：**根布局取代了[`_app.js`](/docs/pages/building-your-application/routing/custom-app)和[`_document.js`](/docs/pages/building-your-application/routing/custom-document)文件。[查看迁移指南](/docs/app/building-your-application/upgrading/app-router-migration#migrating-_documentjs-and-_appjs)。
## 模板

模板类似于布局，因为它们会包装一个子布局或页面。与跨路由持久存在并保持状态的布局不同，模板在导航时为它们的每个子项创建一个新的实例。这意味着当用户在共享模板的路由之间导航时，会挂载子项的新实例，重新创建DOM元素，客户端组件中的状态**不会被保留**，并且效果会被重新同步。

可能存在需要这些特定行为的情况，而模板会比布局更合适。例如：

- 在导航时重新同步`useEffect`。
- 在导航时重置子客户端组件的状态。

可以通过从`template.js`文件导出一个默认的React组件来定义一个模板。该组件应该接受一个`children`属性。

![template.js 特殊文件](https://nextjs.org/_next/image?url=/docs/light/template-special-file.png&w=3840&q=75)

```tsx filename="app/template.tsx" switcher
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```jsx filename="app/template.js" switcher
export default function Template({ children }) {
  return <div>{children}</div>
}
```

在嵌套方面，`template.js`在布局和其子项之间被渲染。这是一个简化的输出：

```jsx filename="Output"
<Layout>
  {/* 注意模板被赋予了一个唯一的键。 */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```
# Examples

## Metadata

您可以使用[Metadata APIs](/docs/app/building-your-application/optimizing/metadata)修改`<head>`HTML元素，如`title`和`meta`。

可以通过在[`layout.js`](/docs/app/api-reference/file-conventions/layout)或[`page.js`](/docs/app/api-reference/file-conventions/page)文件中导出一个[`metadata`对象](/docs/app/api-reference/functions/generate-metadata#the-metadata-object)或[`generateMetadata`函数](/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)来定义元数据。

```tsx filename="app/page.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js',
}

export default function Page() {
  return '...'
}
```

```jsx filename="app/page.js" switcher
export const metadata = {
  title: 'Next.js',
}

export default function Page() {
  return '...'
}
```

> **须知**：您不应手动添加`<head>`标签，如`<title>`和`<meta>`到根布局中。相反，应使用[Metadata API](/docs/app/api-reference/functions/generate-metadata)，它自动处理高级要求，如流式传输和去重`<head>`元素。

在[API参考](/docs/app/api-reference/functions/generate-metadata)中了解更多可用的元数据选项。

## Active Nav Links

您可以使用[usePathname()](/docs/app/api-reference/functions/use-pathname)钩子来确定导航链接是否处于活动状态。

由于`usePathname()`是一个客户端钩子，您需要将导航链接提取到一个客户端组件中，该组件可以导入到您的布局或模板中：

```tsx filename="app/ui/nav-links.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        首页
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        关于
      </Link>
    </nav>
  )
}
```

```jsx filename="app/ui/nav-links.js" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        首页
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        关于
      </Link>
    </nav>
  )
}
```

```tsx filename="app/layout.tsx" switcher
import { NavLinks } from '@/app/ui/nav-links'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavLinks />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { NavLinks } from '@/app/ui/nav-links'

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavLinks />
        <main>{children}</main>
      </body>
    </html>
  )
}
```