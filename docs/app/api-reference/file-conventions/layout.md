---
title: layout.js
description: layout.js 文件的 API 参考。
---

**布局** 是在路由之间共享的 UI。

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

**根布局** 是根 `app` 目录中最顶层的布局。它用于定义 `<html>` 和 `<body>` 标签以及其他全局共享的 UI。

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


## Props

### `children` (必需)

布局组件应该接受并使用一个 `children` 属性。在渲染过程中，`children` 将被填充为布局所包装的路由段。这些主要是子 [布局](/docs/app/building-your-application/routing/pages)（如果存在）或 [页面](/docs/app/building-your-application/routing/pages) 的组件，但在适用时也可能是其他特殊文件，如 [Loading](/docs/app/building-your-application/routing/loading-ui-and-streaming) 或 [Error](/docs/app/building-your-application/routing/error-handling)。

### `params` (可选)

从根段到该布局的动态路由参数对象。

| 示例                           | URL            | `params`                  |
| --------------------------------- | -------------- | ------------------------- |
| `app/dashboard/[team]/layout.js`  | `/dashboard/1` | `{ team: '1' }`           |
| `app/shop/[tag]/[item]/layout.js` | `/shop/1/2`    | `{ tag: '1', item: '2' }` |
| `app/blog/[...slug]/layout.js`    | `/blog/1/2`    | `{ slug: ['1', '2'] }`    |

例如：

```tsx filename="app/shop/[tag]/[item]/layout.tsx" switcher
export default function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    tag: string
    item: string
  }
}) {
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  return <section>{children}</section>
}
```

```jsx filename="app/shop/[tag]/[item]/layout.js" switcher
export default function ShopLayout({ children, params }) {
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  return <section>{children}</section>
}
```


## 须知


### 根布局

- `app` 目录 **必须** 包含一个根 `app/layout.js`。
- 根布局 **必须** 定义 `<html>` 和 `<body>` 标签。
  - 你 **不应** 手动添加如 `<title>` 和 `<meta>` 这样的 `<head>` 标签到根布局中。相反，你应该使用 [元数据 API](/docs/app/api-reference/functions/generate-metadata)，它会自动处理如流式传输和去重 `<head>` 元素等高级需求。
- 你可以使用 [路由组](/docs/app/building-your-application/routing/route-groups) 来创建多个根布局。
  - 导航 **跨越多个根布局** 将导致 **完整的页面加载**（与客户端导航相对）。例如，从使用 `app/(shop)/layout.js` 的 `/cart` 导航到使用 `app/(marketing)/layout.js` 的 `/blog` 将导致完整的页面加载。这 **仅** 适用于多个根布局。
## Layouts 不接收 `searchParams`

与 [页面](/docs/app/api-reference/file-conventions/page) 不同，布局组件 **不接收** `searchParams` 属性。这是因为共享布局在导航期间 [不会重新渲染](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，这可能导致在不同导航之间 `searchParams` 变得过时。

当使用客户端导航时，Next.js 会自动只渲染两个路由之间共同布局下方的页面部分。

例如，在以下目录结构中，`dashboard/layout.tsx` 是 `/dashboard/settings` 和 `/dashboard/analytics` 的共同布局：

<img
  alt="显示一个包含 layout.tsx 文件的 dashboard 文件夹，以及具有各自页面的 settings 和 analytics 文件夹的文件结构"
  src="https://nextjs.org/_next/image?url=/docs/light/shared-dashboard-layout.png&w=3840&q=75"
  srcDark="/docs/dark/shared-dashboard-layout.png"
  width="1600"
  height="687"
/>

当从 `/dashboard/settings` 导航到 `/dashboard/analytics` 时，`/dashboard/analytics` 中的 `page.tsx` 将在服务器上重新渲染，而 `dashboard/layout.tsx` 将 **不会** 重新渲染，因为它是两个路由之间共享的共同 UI。

这种性能优化允许共享布局的页面之间的导航更快，因为只有页面的数据获取和渲染需要运行，而不是可能包括获取自己数据的共享布局的整个路由。

由于 `dashboard/layout.tsx` 不会重新渲染，布局服务器组件中的 `searchParams` 属性在导航后可能会变得 **过时**。

相反，可以使用页面的 [`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional) 属性或客户端组件中的 [`useSearchParams`](/docs/app/api-reference/functions/use-search-params) 钩子，后者在客户端上使用最新的 `searchParams` 重新渲染。

## Layouts 无法访问 `pathname`

布局无法访问 `pathname`。这是因为布局默认是服务器组件，并且在客户端导航期间 [不会重新渲染](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，这可能导致 `pathname` 在导航之间变得过时。为了防止过时，Next.js 需要重新获取路由的所有段，这会失去缓存的好处，并增加导航上的 [RSC 有效载荷](/docs/app/building-your-application/rendering/server-components#what-is-the-react-server-component-payload-rsc) 大小。

相反，你可以将依赖于 pathname 的逻辑提取到客户端组件中，并将其导入到你的布局中。由于客户端组件在导航期间会重新渲染（但不会被重新获取），你可以使用 Next.js 钩子，如 [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) 来访问当前的 pathname，并防止过时。

```tsx filename="app/dashboard/layout.tsx" switcher
import { ClientComponent } from '@/app/ui/ClientComponent'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientComponent />
      {/* 其他布局 UI */}
      <main>{children}</main>
    </>
  )
}
```

```jsx filename="app/dashboard/layout.js" switcher
import { ClientComponent } from '@/app/ui/ClientComponent'

export default function Layout({ children }) {
  return (
    <>
      <ClientComponent />
      {/* 其他布局 UI */}
      <main>{children}</main>
    </>
  )
}
```

常见的 `pathname` 模式也可以使用 [`params`](#params-optional) 属性实现。

有关更多信息，请参见 [示例](/docs/app/building-your-application/routing/layouts-and-templates#examples) 部分。

## 版本历史

| 版本   | 变更              |
| --------- | -------------------- |
| `v13.0.0` | 引入了 `layout`。 |