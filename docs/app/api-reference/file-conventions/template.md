---
title: template.js
---

# template.js

**模板** 文件类似于 [布局](/docs/app/building-your-application/routing/layouts-and-templates#layouts)，因为它包裹了一个布局或页面。与在路由之间持久存在并维护状态的布局不同，模板被赋予了一个唯一的键，这意味着子客户端组件在导航时会重置它们的状态。

```tsx filename="app/template.tsx" switcher
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```jsx filename="app/template.jsx" switcher
export default function Template({ children }) {
  return <div>{children}</div>
}
```

<img
  alt="template.js 特殊文件"
  src="https://nextjs.org/_next/image?url=/docs/light/template-special-file.png&w=3840&q=75"
  srcDark="/docs/dark/template-special-file.png"
  width="1600"
  height="444"
/>

虽然不太常见，但如果您想要：

- 依赖于 `useEffect`（例如记录页面浏览量）和 `useState`（例如每页反馈表单）的功能。
- 更改默认的框架行为。例如，布局中的 Suspense Boundaries 只在首次加载布局时显示回退，而不是在切换页面时。对于模板，每次导航都会显示回退。

您可能会选择使用模板而不是布局。

## Props

### `children` (必需)

模板接受一个 `children` 属性。例如：

```jsx filename="Output"
<Layout>
  {/* 注意模板会自动获得一个唯一的键。 */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```

> **须知**：
>
> - 默认情况下，`template` 是一个 [服务器组件](/docs/app/building-your-application/rendering/server-components)，但也可以通过 `"use client"` 指令用作 [客户端组件](/docs/app/building-your-application/rendering/client-components)。
> - 当用户在共享 `template` 的路由之间导航时，组件的新实例将被挂载，DOM 元素将被重新创建，客户端组件中的状态将不会被 **保留**，并且效果将被重新同步。

## 版本历史

| 版本   | 变化                |
| --------- | ---------------------- |
| `v13.0.0` | 引入了 `template`。 |