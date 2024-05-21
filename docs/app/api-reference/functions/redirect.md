---
title: 重定向
description: 重定向函数的API参考。
related:
  links:
    - app/api-reference/functions/permanentRedirect
---

`redirect` 函数允许您将用户重定向到另一个URL。`redirect` 可以在 [Server Components](/docs/app/building-your-application/rendering/server-components)、[Route Handlers](/docs/app/building-your-application/routing/route-handlers) 和 [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中使用。

在 [streaming context](/docs/app/building-your-application/routing/loading-ui-and-streaming#what-is-streaming) 中使用时，这将在客户端插入一个 meta 标签以发出重定向。在 Server Action 中使用时，它将向调用者提供 303 HTTP 重定向响应。否则，它将向调用者提供 307 HTTP 重定向响应。

如果资源不存在，您可以使用 [`notFound` 函数](/docs/app/api-reference/functions/not-found) 代替。

> **须知**：
>
> - 在 Server Actions 和 Route Handlers 中，`redirect` 应在 `try/catch` 块之后调用。
> - 如果您希望返回 308（永久）HTTP 重定向而不是 307（临时），您可以使用 [`permanentRedirect` 函数](/docs/app/api-reference/functions/permanentRedirect) 代替。

## 参数

`redirect` 函数接受两个参数：

```js
redirect(path, type)
```

| 参数   | 类型                                                           | 描述                                                     |
| ------ | ------------------------------------------------------------- | -------------------------------------------------------- |
| `path` | `string`                                                      | 要重定向到的URL。可以是相对路径或绝对路径。           |
| `type` | `'replace'`（默认）或 `'push'`（在 Server Actions 中默认） | 要执行的重定向类型。                                   |

默认情况下，`redirect` 将在 [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中使用 `push`（向浏览器历史记录栈中添加新条目）并在其他地方使用 `replace`（替换浏览器历史记录栈中的当前URL）。您可以通过指定 `type` 参数来覆盖此行为。

在 Server Components 中使用时，`type` 参数无效。

## 返回值

`redirect` 不返回任何值。
## 示例

### 服务器组件

调用 `redirect()` 函数会抛出一个 `NEXT_REDIRECT` 错误，并终止在其被抛出的路由段的渲染。

```jsx filename="app/team/[id]/page.js"
import { redirect } from 'next/navigation'

async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    redirect('/login')
  }

  // ...
}
```

> **须知**：`redirect` 不需要你使用 `return redirect()`，因为它使用了 TypeScript 的 [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never) 类型。

### 客户端组件

`redirect` 可以通过服务器操作在客户端组件中使用。如果你需要使用事件处理器来重定向用户，你可以使用 [`useRouter`](/docs/app/api-reference/functions/use-router) 钩子。

```tsx filename="app/client-redirect.tsx" switcher
'use client'

import { navigate } from './actions'

export function ClientRedirect() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>提交</button>
    </form>
  )
}
```

```jsx filename="app/client-redirect.jsx" switcher
'use client'

import { navigate } from './actions'

export function ClientRedirect() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>提交</button>
    </form>
  )
}
```

```ts filename="app/actions.ts" switcher
'use server'

import { redirect } from 'next/navigation'

export async function navigate(data: FormData) {
  redirect(`/posts/${data.get('id')}`)
}
```

```js filename="app/actions.js" switcher
'use server'

import { redirect } from 'next/navigation'

export async function navigate(data) {
  redirect(`/posts/${data.get('id')}`)
}
```

## 常见问题解答

### 为什么 `redirect` 使用 307 和 308？

使用 `redirect()` 时，你可能会注意到使用的是 `307` 表示临时重定向，`308` 表示永久重定向。虽然传统上使用 `302` 表示临时重定向，`301` 表示永久重定向，但许多浏览器在遇到 `302` 时，无论原始请求方法是什么，都会将重定向的请求方法从 `POST` 改为 `GET`。

以下面从 `/users` 重定向到 `/people` 的示例为例，如果你向 `/users` 发送一个 `POST` 请求来创建一个新用户，并遵循 `302` 临时重定向，请求方法将从 `POST` 更改为 `GET`。这没有意义，因为创建一个新用户，你应该向 `/people` 发送一个 `POST` 请求，而不是 `GET` 请求。

引入 `307` 状态码意味着请求方法将保持为 `POST`。

- `302` - 临时重定向，将请求方法从 `POST` 改为 `GET`
- `307` - 临时重定向，将保持请求方法为 `POST`

`redirect()` 方法默认使用 `307`，而不是 `302` 临时重定向，这意味着你的请求将始终作为 `POST` 请求被保留。

[了解更多](https://developer.mozilla.org/docs/Web/HTTP/Redirections) 关于 HTTP 重定向的信息。

## 版本历史

| 版本   | 变更                |
| --------- | ---------------------- |
| `v13.0.0` | 引入了 `redirect`。 |