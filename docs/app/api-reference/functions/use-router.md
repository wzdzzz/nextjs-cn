---
title: useRouter
description: useRouter 钩子的 API 参考。
---

`useRouter` 钩子允许你在 [客户端组件](/docs/app/building-your-application/rendering/client-components) 中以编程方式更改路由。

> **建议：** 除非有特定需求使用 `useRouter`，否则请使用 [`<Link>` 组件](/docs/app/building-your-application/routing/linking-and-navigating#link-component) 进行导航。

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      仪表盘
    </button>
  )
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      仪表盘
    </button>
  )
}
```

## `useRouter()`

- `router.push(href: string, { scroll: boolean })`: 执行客户端导航到提供的路由。在 [浏览器的历史记录](https://developer.mozilla.org/docs/Web/API/History_API) 栈中添加一个新的条目。
- `router.replace(href: string, { scroll: boolean })`: 执行客户端导航到提供的路由，但不在 [浏览器的历史记录栈](https://developer.mozilla.org/docs/Web/API/History_API) 中添加新的条目。
- `router.refresh()`: 刷新当前路由。向服务器发起新的请求，重新获取数据请求，并重新渲染服务器组件。客户端将在不丢失未受影响的客户端 React（例如 `useState`）或浏览器状态（例如滚动位置）的情况下合并更新后的 React 服务器组件负载。
- `router.prefetch(href: string)`: [预取](/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching) 提供的路由，以便更快地进行客户端转换。
- `router.back()`: 在浏览器的历史记录栈中导航回上一个路由。
- `router.forward()`: 在浏览器的历史记录栈中导航到下一页。

> **须知**：
>
> - `<Link>` 组件在视口中可见时会自动预取路由。
> - 如果获取请求被缓存，`refresh()` 可能会重新产生相同的结果。其他动态函数如 `cookies` 和 `headers` 也可能改变响应。

### 从 `next/router` 迁移

- 使用 App Router 时，`useRouter` 钩子应该从 `next/navigation` 导入，而不是 `next/router`
- `pathname` 字符串已被移除，并被 [`usePathname()`](/docs/app/api-reference/functions/use-pathname) 替换
- `query` 对象已被移除，并被 [`useSearchParams()`](/docs/app/api-reference/functions/use-search-params) 替换
- `router.events` 已被替换。[详见下方。](#router-events)

[查看完整的迁移指南](/docs/app/building-your-application/upgrading/app-router-migration)。
## 示例

### 路由器事件

你可以通过组合其他客户端组件钩子，如 `usePathname` 和 `useSearchParams`，来监听页面变化。

```jsx filename="app/components/navigation-events.js"
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log(url)
    // 你现在可以使用当前URL
    // ...
  }, [pathname, searchParams])

  return null
}
```

可以将其导入到布局中。

```jsx filename="app/layout.js" highlight={2,10-12}
import { Suspense } from 'react'
import { NavigationEvents } from './components/navigation-events'

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  )
}
```

> **须知**：`<NavigationEvents>` 被包裹在一个 [`Suspense` 边界](/docs/app/building-your-application/routing/loading-ui-and-streaming#example) 中，因为 [`useSearchParams()`](/docs/app/api-reference/functions/use-search-params) 在 [静态渲染](/docs/app/building-your-application/rendering/server-components#static-rendering-default) 期间会导致客户端渲染到最近的 `Suspense` 边界。[了解更多](/docs/app/api-reference/functions/use-search-params#behavior)。

### 禁用滚动恢复

默认情况下，Next.js 在导航到新路由时会滚动到页面顶部。你可以通过向 `router.push()` 或 `router.replace()` 传递 `scroll: false` 来禁用此行为。

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard', { scroll: false })}
    >
      Dashboard
    </button>
  )
}
```

```jsx filename="app/example-client-component.jsx" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard', { scroll: false })}
    >
      Dashboard
    </button>
  )
}
```

## 版本历史

| 版本   | 变化                                        |
| --------- | ---------------------------------------------- |
| `v13.0.0` | 引入了 `next/navigation` 中的 `useRouter`。 |