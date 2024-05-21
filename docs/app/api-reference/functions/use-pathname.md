---
title: usePathname
description: usePathname 钩子的 API 参考。
---

`usePathname` 是一个 **客户端组件** 钩子，允许您读取当前 URL 的 **路径名**。

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'

export default function ExampleClientComponent() {
  const pathname = usePathname()
  return <p>当前路径名: {pathname}</p>
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { usePathname } from 'next/navigation'

export default function ExampleClientComponent() {
  const pathname = usePathname()
  return <p>当前路径名: {pathname}</p>
}
```

`usePathname` 有意要求使用 [客户端组件](/docs/app/building-your-application/rendering/client-components)。重要的是要注意，客户端组件并不是性能优化的退步。它们是 [服务器组件](/docs/app/building-your-application/rendering/server-components) 架构的重要组成部分。

例如，使用 `usePathname` 的客户端组件将在初始页面加载时渲染为 HTML。当导航到新路由时，不需要重新获取此组件。相反，该组件只需下载一次（在客户端 JavaScript 包中），并根据当前状态重新渲染。

> **须知**：
>
> - 从 [服务器组件](/docs/app/building-your-application/rendering/server-components) 中读取当前 URL 是不支持的。这种设计是有意为之，以支持在页面导航中保留布局状态。
> - 兼容性模式：
>   - 当 [回退路由](/docs/pages/api-reference/functions/get-static-paths#fallback-true) 正在渲染，或者 `pages` 目录页面已被 Next.js [自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization) 且路由器尚未准备好时，`usePathname` 可以返回 `null`。
>   - 如果 Next.js 检测到您的项目中同时存在 `app` 和 `pages` 目录，它将自动更新您的类型。

## 参数

```tsx
const pathname = usePathname()
```

`usePathname` 不接受任何参数。

## 返回值

`usePathname` 返回当前 URL 路径名的字符串。例如：

| URL                 | 返回值                   |
| ------------------- | ------------------------ |
| `/`                 | `'/'`                   |
| `/dashboard`        | `'/dashboard'`          |
| `/dashboard?v=2`    | `'/dashboard'`          |
| `/blog/hello-world` | `'/blog/hello-world'`   |

## 示例

### 响应路由变化执行操作

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { usePathname, useSearchParams } from 'next/navigation'

function ExampleClientComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    // 在这里执行操作...
  }, [pathname, searchParams])
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { usePathname, useSearchParams } from 'next/navigation'

function ExampleClientComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    // 在这里执行操作...
  }, [pathname, searchParams])
}
```

| 版本   | 变更                   |
| --------- | ------------------------- |
| `v13.0.0` | 引入了 `usePathname`。 |