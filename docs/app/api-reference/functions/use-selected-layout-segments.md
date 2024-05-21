---
title: useSelectedLayoutSegments
description: useSelectedLayoutSegments 钩子的 API 参考。
---

`useSelectedLayoutSegments` 是一个 **客户端组件** 钩子，允许你读取在其下调用的布局的 **下一级** 活动路由段。

对于需要知道活动子段（如面包屑导航）的父布局中创建 UI 非常有用。

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()

  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()

  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

> **须知**：
>
> - 由于 `useSelectedLayoutSegments` 是一个 [客户端组件](/docs/app/building-your-application/rendering/client-components) 钩子，而布局默认是 [服务器组件](/docs/app/building-your-application/rendering/server-components)，因此 `useSelectedLayoutSegments` 通常是通过导入到布局中的客户端组件来调用的。
> - 返回的段包括 [路由组](/docs/app/building-your-application/routing/route-groups)，你可能不希望在 UI 中包含它们。你可以使用数组的 `filter()` 方法来移除以括号开头的项目。

## 参数

```tsx
const segments = useSelectedLayoutSegments(parallelRoutesKey?: string)
```

`useSelectedLayoutSegments` 可选地接受一个 [`parallelRoutesKey`](/docs/app/building-your-application/routing/parallel-routes#useselectedlayoutsegments)，允许你在该插槽内读取活动路由段。

## 返回值

`useSelectedLayoutSegments` 返回一个字符串数组，包含从调用该钩子的布局下一级的活动段。如果不存在，则返回一个空数组。

例如，给定下面的布局和访问的 URL，返回的段将是：

| 布局                    | 访问的 URL           | 返回的段                       |
| ------------------------- | --------------------- | ------------------------------ |
| `app/layout.js`           | `/`                   | `[]`                           |
| `app/layout.js`           | `/dashboard`          | `['dashboard']`                |
| `app/layout.js`           | `/dashboard/settings` | `['dashboard', 'settings']`    |
| `app/dashboard/layout.js` | `/dashboard`          | `[]`                           |
| `app/dashboard/layout.js` | `/dashboard/settings` | `['settings']`                 |

## 版本历史

| 版本   | 更改                                  |
| --------- | ------------------------------------ |
| `v13.0.0` | 引入 `useSelectedLayoutSegments`。 |