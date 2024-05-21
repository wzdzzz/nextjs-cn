---
title: revalidateTag 函数
description: revalidateTag 函数的 API 参考。
---

`revalidateTag` 允许你按需清除特定缓存标签的[缓存数据](/docs/app/building-your-application/caching)。

> **须知**：
>
> - `revalidateTag` 在 [Node.js 和 Edge 运行时](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)中都可用。
> - 当路径下次被访问时，`revalidateTag` 仅会使缓存失效。这意味着使用动态路由段调用 `revalidateTag` 不会立即触发许多重新验证。失效仅在路径下次被访问时发生。

## 参数

```tsx
revalidateTag(tag: string): void;
```

- `tag`：一个字符串，表示与要重新验证的数据关联的缓存标签。必须小于或等于 256 个字符。此值区分大小写。

你可以像下面这样将标签添加到 `fetch`：

```tsx
fetch(url, { next: { tags: [...] } });
```

## 返回值

`revalidateTag` 不返回任何值。

## 示例

### 服务器操作

```ts filename="app/actions.ts" switcher
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

```js filename="app/actions.js" switcher
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

### 路由处理程序

```ts filename="app/api/revalidate/route.ts" switcher
import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
```

```js filename="app/api/revalidate/route.js" switcher
import { revalidateTag } from 'next/cache'

export async function GET(request) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
```