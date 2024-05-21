---
title: not-found.js
description: not-found.js 文件的 API 参考。
---

**not-found** 文件用于在路由段中抛出 [`notFound`](/docs/app/api-reference/functions/not-found) 函数时渲染 UI。除了提供自定义 UI，Next.js 还会为流式响应返回 `200` HTTP 状态码，对于非流式响应返回 `404`。

```tsx filename="app/not-found.tsx" switcher
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>未找到</h2>
      <p>无法找到请求的资源</p>
      <Link href="/">返回首页</Link>
    </div>
  )
}
```

```jsx filename="app/blog/not-found.js" switcher
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>未找到</h2>
      <p>无法找到请求的资源</p>
      <Link href="/">返回首页</Link>
    </div>
  )
}
```

> **须知**：除了捕获预期的 `notFound()` 错误，根目录下的 `app/not-found.js` 文件还处理整个应用程序的任何未匹配 URL。这意味着访问未由您的应用程序处理的 URL 的用户将看到由 `app/not-found.js` 文件导出的 UI。

## Props

`not-found.js` 组件不接受任何属性。

## 数据获取

默认情况下，`not-found` 是一个服务器组件。您可以将其标记为 `async` 以获取和显示数据：

```tsx filename="app/not-found.tsx" switcher
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  const headersList = headers()
  const domain = headersList.get('host')
  const data = await getSiteData(domain)
  return (
    <div>
      <h2>未找到：{data.name}</h2>
      <p>无法找到请求的资源</p>
      <p>
        查看 <Link href="/blog">所有文章</Link>
      </p>
    </div>
  )
}
```

```jsx filename="app/not-found.jsx" switcher
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  const headersList = headers()
  const domain = headersList.get('host')
  const data = await getSiteData(domain)
  return (
    <div>
      <h2>未找到：{data.name}</h2>
      <p>无法找到请求的资源</p>
      <p>
        查看 <Link href="/blog">所有文章</Link>
      </p>
    </div>
  )
}
```

如果您需要使用客户端组件钩子（如 `usePathname`）根据路径显示内容，您必须在客户端获取数据。

## 版本历史

| 版本   | 变更                                             |
| --------- | --------------------------------------------------- |
| `v13.3.0` | 根目录 `app/not-found` 处理全局未匹配 URL。 |
| `v13.0.0` | 引入 `not-found`。                             |