---
title: useParams
description: useParams 钩子的 API 参考。
---

`useParams` 是一个 **客户端组件** 钩子，允许您读取当前 URL 填充的路由的 [动态参数](/docs/app/building-your-application/routing/dynamic-routes)。

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const params = useParams<{ tag: string; item: string }>()

  // 路由 -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)

  return <></>
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const params = useParams()

  // 路由 -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)

  return <></>
}
```

## 参数

```tsx
const params = useParams()
```

`useParams` 不接受任何参数。

## 返回值

`useParams` 返回一个对象，包含当前路由填充的 [动态参数](/docs/app/building-your-application/routing/dynamic-routes)。

- 对象中的每个属性都是一个活动的动态段。
- 属性的名称是段的名称，属性的值是段填充的内容。
- 属性的值将是一个 `string` 或 `string` 数组，取决于 [动态段的类型](/docs/app/building-your-application/routing/dynamic-routes)。
- 如果路由不包含任何动态参数，`useParams` 返回一个空对象。
- 如果在 Pages Router 中使用，`useParams` 将在初始渲染时返回 `null`，并在路由器准备好后根据上述规则更新属性。

例如：

| 路由                           | URL         | `useParams()`             |
| ------------------------------- | ----------- | ------------------------- |
| `app/shop/page.js`              | `/shop`     | `{}`                      |
| `app/shop/[slug]/page.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/page.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/page.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

## 版本历史

| 版本   | 变更                 |
| --------- | ----------------------- |
| `v13.3.0` | 引入 `useParams`。 |