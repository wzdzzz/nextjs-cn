---
title: notFound
description: notFound 函数的 API 参考。
---

`notFound` 函数允许你在路由段内渲染 [`not-found 文件`](/docs/app/api-reference/file-conventions/not-found) 并注入一个 `<meta name="robots" content="noindex" />` 标签。

## `notFound()`

调用 `notFound()` 函数会抛出一个 `NEXT_NOT_FOUND` 错误并终止在其抛出的路由段的渲染。指定一个 [**not-found** 文件](/docs/app/api-reference/file-conventions/not-found) 允许你通过在段内渲染一个未找到用户界面来优雅地处理此类错误。

```jsx filename="app/user/[id]/page.js"
import { notFound } from 'next/navigation'

async function fetchUser(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const user = await fetchUser(params.id)

  if (!user) {
    notFound()
  }

  // ...
}
```

> **须知**：由于使用了 TypeScript 的 [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never) 类型，`notFound()` 不需要你使用 `return notFound()`。

## 版本历史

| 版本   | 变化                |
| --------- | ---------------------- |
| `v13.0.0` | 引入了 `notFound`。 |