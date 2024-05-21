---
title: useSelectedLayoutSegment
description: useSelectedLayoutSegment 钩子的 API 参考。
---

`useSelectedLayoutSegment` 是一个 **客户端组件** 钩子，允许您读取从调用它的布局起**一级以下的**活动路由段。

它对于导航用户界面非常有用，比如父布局内的标签页，这些标签页会根据活动的子段改变样式。

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>活动段：{segment}</p>
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>活动段：{segment}</p>
}
```

> **须知**：
>
> - 由于 `useSelectedLayoutSegment` 是一个 [客户端组件](/docs/app/building-your-application/rendering/client-components) 钩子，而布局默认是 [服务器组件](/docs/app/building-your-application/rendering/server-components)，`useSelectedLayoutSegment` 通常通过导入到布局中的客户端组件来调用。
> - `useSelectedLayoutSegment` 只返回下一级的段。要返回所有活动的段，请参阅 [`useSelectedLayoutSegments`](/docs/app/api-reference/functions/use-selected-layout-segments)

## 参数

```tsx
const segment = useSelectedLayoutSegment(parallelRoutesKey?: string)
```

`useSelectedLayoutSegment` 可选地接受一个 [`parallelRoutesKey`](/docs/app/building-your-application/routing/parallel-routes#useselectedlayoutsegments)，它允许您读取该插槽内活动的路由段。

## 返回值

`useSelectedLayoutSegment` 返回活动段的字符串或不存在时返回 `null`。

例如，给定下面的布局和访问的 URL，返回的段将是：

| 布局                    | 访问的 URL                     | 返回的段    |
| ------------------------- | ------------------------------ | ------------ |
| `app/layout.js`           | `/`                            | `null`      |
| `app/layout.js`           | `/dashboard`                   | `'dashboard'` |
| `app/dashboard/layout.js` | `/dashboard`                   | `null`      |
| `app/dashboard/layout.js` | `/dashboard/settings`          | `'settings'` |
| `app/dashboard/layout.js` | `/dashboard/analytics`         | `'analytics'` |
| `app/dashboard/layout.js` | `/dashboard/analytics/monthly` | `'analytics'` |
## 示例

### 创建一个活动链接组件

您可以使用 `useSelectedLayoutSegment` 来创建一个活动链接组件，该组件根据活动段改变样式。例如，在博客侧边栏中的特色帖子列表：

```tsx filename="app/blog/blog-nav-link.tsx" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

// 这个 *客户端* 组件将被导入到博客布局中
export default function BlogNavLink({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  // 导航到 `/blog/hello-world` 将返回 'hello-world'
  // 作为所选布局段
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      // 根据链接是否活动更改样式
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```jsx filename="app/blog/blog-nav-link.js" switcher
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

// 这个 *客户端* 组件将被导入到博客布局中
export default function BlogNavLink({ slug, children }) {
  // 导航到 `/blog/hello-world` 将返回 'hello-world'
  // 作为所选布局段
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      // 根据链接是否活动更改样式
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```tsx filename="app/blog/layout.tsx" switcher
// 将客户端组件导入到父级布局（服务器组件）中
import { BlogNavLink } from './blog-nav-link'
import getFeaturedPosts from './get-featured-posts'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

```jsx filename="app/blog/layout.js" switcher
// 将客户端组件导入到父级布局（服务器组件）中
import { BlogNavLink } from './blog-nav-link'
import getFeaturedPosts from './get-featured-posts'

export default async function Layout({ children }) {
  const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

## 版本历史

| 版本   | 变化                                 |
| ------ | ------------------------------------ |
| `v13.0.0` | 引入了 `useSelectedLayoutSegment`。 |