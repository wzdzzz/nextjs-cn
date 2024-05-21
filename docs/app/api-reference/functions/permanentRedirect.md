---
title: permanentRedirect
description: permanentRedirect 函数的 API 参考。
related:
  links:
    - app/api-reference/functions/redirect
---

`permanentRedirect` 函数允许您将用户重定向到另一个 URL。`permanentRedirect` 可以在 Server Components、Client Components、[路由处理器](/docs/app/building-your-application/routing/route-handlers)和[服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)中使用。

在流式传输上下文中使用时，这将插入一个 meta 标签以在客户端上发出重定向。在服务器操作中使用时，它将向调用者提供 303 HTTP 重定向响应。否则，它将向调用者提供 308（永久）HTTP 重定向响应。

如果资源不存在，您可以使用 [`notFound` 函数](/docs/app/api-reference/functions/not-found)代替。

> **须知**：如果您更喜欢返回 307（临时）HTTP 重定向而不是 308（永久），您可以使用 [`redirect` 函数](/docs/app/api-reference/functions/redirect)代替。

## 参数

`permanentRedirect` 函数接受两个参数：

```js
permanentRedirect(path, type)
```

| 参数   | 类型                                                           | 描述                                                     |
| ------ | ------------------------------------------------------------- | -------------------------------------------------------- |
| `path` | `string`                                                      | 要重定向到的 URL。可以是相对路径或绝对路径。           |
| `type` | `'replace'`（默认）或 `'push'`（在服务器操作中的默认值） | 要执行的重定向类型。                                   |

默认情况下，`permanentRedirect` 将在 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中使用 `push`（向浏览器历史记录栈中添加新条目）并在其他地方使用 `replace`（替换浏览器历史记录栈中的当前 URL）。您可以通过指定 `type` 参数来覆盖此行为。

在 Server Components 中使用时，`type` 参数无效。

## 返回值

`permanentRedirect` 不返回任何值。

## 示例

调用 `permanentRedirect()` 函数会抛出一个 `NEXT_REDIRECT` 错误并终止在其被抛出的路由段的渲染。

```jsx filename="app/team/[id]/page.js"
import { permanentRedirect } from 'next/navigation'

async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    permanentRedirect('/login')
  }

  // ...
}
```

> **须知**：`permanentRedirect` 不需要您使用 `return permanentRedirect()`，因为它使用了 TypeScript [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never) 类型。