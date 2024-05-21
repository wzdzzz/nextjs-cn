---
title: loading.js
---

## loading.js

**loading** 文件可以创建基于 [Suspense](/docs/app/building-your-application/routing/loading-ui-and-streaming) 的即时加载状态。

默认情况下，此文件是 [Server Component](/docs/app/building-your-application/rendering/server-components) - 但也可以借助 `"use client"` 指令作为 Client Component使用。

```tsx filename="app/feed/loading.tsx" switcher
export default function Loading() {
  // 或者自定义的加载骨架组件
  return <p>Loading...</p>
}
```

```jsx filename="app/feed/loading.js" switcher
export default function Loading() {
  // 或者自定义的加载骨架组件
  return <p>Loading...</p>
}
```

加载UI组件不接受任何参数。

> **须知**
>
> - 在设计加载UI时，您可能会发现使用 [React Developer Tools](https://react.dev/learn/react-developer-tools) 手动切换 Suspense 边界很有帮助。

## 版本历史

| 版本   | 变化               |
| --------- | --------------------- |
| `v13.0.0` | 引入了 `loading`。 |