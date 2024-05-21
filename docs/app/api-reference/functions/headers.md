---
title: headers
description: headers函数的API参考。
---

`headers`函数允许您从一个[Server Component](/docs/app/building-your-application/rendering/server-components)中读取HTTP传入请求的头部。

## `headers()`

这个API扩展了[Web Headers API](https://developer.mozilla.org/docs/Web/API/Headers)。它是**只读的**，这意味着您不能`set`/`delete`传出的请求头部。

```tsx filename="app/page.tsx" switcher
import { headers } from 'next/headers'

export default function Page() {
  const headersList = headers()
  const referer = headersList.get('referer')

  return <div>Referer: {referer}</div>
}
```

```jsx filename="app/page.js" switcher
import { headers } from 'next/headers'

export default function Page() {
  const headersList = headers()
  const referer = headersList.get('referer')

  return <div>Referer: {referer}</div>
}
```

> **须知**：
>
> - `headers()`是一个**[动态函数](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)**，其返回值无法提前知晓。在布局或页面中使用它将会使路由在请求时选择**[动态渲染](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)**。

### API参考

```tsx
const headersList = headers()
```

#### 参数

`headers`不接受任何参数。

#### 返回值

`headers`返回一个**只读**的[Web Headers](https://developer.mozilla.org/docs/Web/API/Headers)对象。

- [`Headers.entries()`](https://developer.mozilla.org/docs/Web/API/Headers/entries): 返回一个[`iterator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols)，允许您遍历此对象中包含的所有键/值对。
- [`Headers.forEach()`](https://developer.mozilla.org/docs/Web/API/Headers/forEach): 为这个`Headers`对象中的每个键/值对执行一个提供的函数。
- [`Headers.get()`](https://developer.mozilla.org/docs/Web/API/Headers/get): 返回一个`Headers`对象中给定名称的所有值的[`String`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)序列。
- [`Headers.has()`](https://developer.mozilla.org/docs/Web/API/Headers/has): 返回一个布尔值，说明`Headers`对象是否包含某个特定的头部。
- [`Headers.keys()`](https://developer.mozilla.org/docs/Web/API/Headers/keys): 返回一个[`iterator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols)，允许您遍历此对象中包含的所有键/值对的键。
- [`Headers.values()`](https://developer.mozilla.org/docs/Web/API/Headers/values): 返回一个[`iterator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols)，允许您遍历此对象中包含的所有键/值对的值。
### 示例

#### 与数据获取一起使用

`headers()` 可以与 [Suspense for Data Fetching](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating) 结合使用。

```jsx filename="app/page.js"
import { Suspense } from 'react'
import { headers } from 'next/headers'

async function User() {
  const authorization = headers().get('authorization')
  const res = await fetch('...', {
    headers: { authorization }, // 转发授权头部
  })
  const user = await res.json()

  return <h1>{user.name}</h1>
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <User />
    </Suspense>
  )
}
```

#### IP 地址

`headers()` 可以用来获取客户端的 IP 地址。

```jsx filename="app/page.js"
import { Suspense } from 'react'
import { headers } from 'next/headers'

function IP() {
  const FALLBACK_IP_ADDRESS = '0.0.0.0'
  const forwardedFor = headers().get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
  }

  return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <IP />
    </Suspense>
  )
}
```

除了 `x-forwarded-for`，`headers()` 还可以读取：

- `x-real-ip`
- `x-forwarded-host`
- `x-forwarded-port`
- `x-forwarded-proto`

### 版本历史

| 版本   | 变更               |
| --------- | --------------------- |
| `v13.0.0` | 引入了 `headers`。 |