---
title: cookies
description: cookies函数的API参考。
related:
  title: Next Steps
  description: 有关下一步操作的更多信息，我们推荐以下部分
  links:
    - app/building-your-application/data-fetching/server-actions-and-mutations
---

`cookies`函数允许您从一个[Server Component](/docs/app/building-your-application/rendering/server-components)读取HTTP传入请求的cookies，或者在[Server Action](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)或[Route Handler](/docs/app/building-your-application/routing/route-handlers)中写入传出请求的cookies。

> **须知**：`cookies()`是一个**[动态函数](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)**，其返回值无法提前知晓。在布局或页面中使用它将使路由在请求时选择**[动态渲染](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)**。

## `cookies().get(name)`

一个方法，它接受一个cookie名称并返回一个包含名称和值的对象。如果没有找到名为`name`的cookie，它返回`undefined`。如果多个cookie匹配，它只会返回第一个匹配项。

```jsx filename="app/page.js"
import { cookies } from 'next/headers'

export default function Page() {
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```


## `cookies().getAll()`

一个类似于`get`的方法，但它返回所有匹配`name`的cookie列表。如果未指定`name`，则返回所有可用的cookie。

```jsx filename="app/page.js"
import { cookies } from 'next/headers'

export default function Page() {
  const cookieStore = cookies()
  return cookieStore.getAll().map((cookie) => (
    <div key={cookie.name}>
      <p>名称：{cookie.name}</p>
      <p>值：{cookie.value}</p>
    </div>
  ))
}
```


## `cookies().has(name)`

一个方法，它接受一个cookie名称并返回一个`boolean`，根据cookie是否存在（`true`）或不存在（`false`）。

```jsx filename="app/page.js"
import { cookies } from 'next/headers'

export default function Page() {
  const cookieStore = cookies()
  const hasCookie = cookieStore.has('theme')
  return '...'
}
```


## `cookies().set(name, value, options)`

一个方法，它接受一个cookie名称、值和选项，并设置传出请求的cookie。

> **须知**：HTTP不允许在开始流式传输后设置cookie，因此您必须在[Server Action](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)或[Route Handler](/docs/app/building-your-application/routing/route-handlers)中使用`.set()`。

```js filename="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function create(data) {
  cookies().set('name', 'lee')
  // 或
  cookies().set('name', 'lee', { secure: true })
  // 或
  cookies().set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
```
## 删除 Cookies

> **须知**：您只能在 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 或 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 中删除 Cookies。

删除 Cookies 有几种选项：

### `cookies().delete(name)`

您可以显式删除给定名称的 Cookies。

```js filename="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function delete(data) {
  cookies().delete('name')
}
```

### `cookies().set(name, '')`

或者，您可以设置一个同名的新 Cookies，值为空。

```js filename="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function delete(data) {
  cookies().set('name', '')
}
```

> **须知**：`.set()` 只在 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 或 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 中可用。

### `cookies().set(name, value, { maxAge: 0 })`

将 `maxAge` 设置为 0 将立即过期 Cookies。

```js filename="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function delete(data) {
  cookies().set('name', 'value', { maxAge: 0 })
}
```

### `cookies().set(name, value, { expires: timestamp })`

将 `expires` 设置为过去的任何值将立即过期 Cookies。

```js filename="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function delete(data) {
  const oneDay = 24 * 60 * 60 * 1000
  cookies().set('name', 'value', { expires: Date.now() - oneDay })
}
```

> **须知**：您只能删除与调用 `.set()` 操作的相同域中的 Cookies。此外，代码必须在与您想要删除的 Cookies 相同的协议（HTTP 或 HTTPS）上执行。

## 版本历史

| 版本   | 变更               |
| --------- | --------------------- |
| `v13.0.0` | 引入了 `cookies`。 |