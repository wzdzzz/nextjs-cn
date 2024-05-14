---
title: 错误处理
description: 通过自动包装路由段及其嵌套子项在 React 错误边界中来处理运行时错误。
related:
  links:
    - app/api-reference/file-conventions/error
---

`error.js` 文件约定允许您在 [嵌套路由](/docs/app/building-your-application/routing#nested-routes) 中优雅地处理意外的运行时错误。

- 自动将路由段及其嵌套子项包装在 [React 错误边界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) 中。
- 使用文件系统层次结构创建特定于特定段的错误 UI，以调整粒度。
- 将错误隔离到受影响的段，同时保持应用程序的其余部分功能正常。
- 添加功能，尝试在不进行完整页面重新加载的情况下从错误中恢复。

通过在路由段内添加 `error.js` 文件并导出一个 React 组件来创建错误 UI：

<Image
  alt="error.js 特殊文件"
  srcLight="/docs/light/error-special-file.png"
  srcDark="/docs/dark/error-special-file.png"
  width="1600"
  height="606"
/>

```tsx filename="app/dashboard/error.tsx" switcher
'use client' // 错误组件必须是客户端组件

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 将错误记录到错误报告服务
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>出了点问题！</h2>
      <button
        onClick={
          // 尝试通过重新渲染段来恢复
          () => reset()
        }
      >
        再试一次
      </button>
    </div>
  )
}
```

```jsx filename="app/dashboard/error.js" switcher
'use client' // 错误组件必须是客户端组件

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // 将错误记录到错误报告服务
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>出了点问题！</h2>
      <button
        onClick={
          // 尝试通过重新渲染段来恢复
          () => reset()
        }
      >
        再试一次
      </button>
    </div>
  )
}
```

### `error.js` 如何工作

<Image
  alt="error.js 如何工作"
  srcLight="/docs/light/error-overview.png"
  srcDark="/docs/dark/error-overview.png"
  width="1600"
  height="903"
/>

- `error.js` 自动创建一个 [React 错误边界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)，它**包装**了一个嵌套子段或 `page.js` 组件。
- 从 `error.js` 文件导出的 React 组件被用作**备用**组件。
- 如果在错误边界内抛出错误，错误将被**包含**，并且会**渲染**备用组件。
- 当备用错误组件处于活动状态时，错误边界**上方**的布局**保持**其状态并**保持**交互性，错误组件可以显示从错误中恢复的功能。

### 从错误中恢复

错误的原因有时可能是暂时的。在这些情况下，简单地再试一次可能会解决问题。

错误组件可以使用 `reset()` 函数提示用户尝试从错误中恢复。执行时，该函数将尝试重新渲染错误边界的内容。如果成功，备用错误组件将被重新渲染的结果替换。

```tsx filename="app/dashboard/error.tsx" switcher
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>出了点问题！</h2>
      <button onClick={() => reset()}>再试一次</button>
    </div>
  )
}
```

```jsx filename="app/dashboard/error.js" switcher
'use client'

export default function Error({ error, reset }) {
  re```markdown
# 出错了！

```jsx
function ErrorComponent() {
  return (
    <div>
      <h2>出错了！</h2>
      <button onClick={() => reset()}>再试一次</button>
    </div>
  )
}
```

### 嵌套路由

通过[特殊文件](/docs/app/building-your-application/routing#file-conventions)创建的React组件会以[特定的嵌套层次结构](/docs/app/building-your-application/routing#component-hierarchy)进行渲染。

例如，一个包含两个段的嵌套路由，这两个段都包含`layout.js`和`error.js`文件，它们会以以下简化的组件层次结构进行渲染：

<Image
  alt="嵌套错误组件层次结构"
  srcLight="/docs/light/nested-error-component-hierarchy.png"
  srcDark="/docs/dark/nested-error-component-hierarchy.png"
  width="1600"
  height="687"
/>

嵌套组件层次结构对嵌套路由中`error.js`文件的行为有影响：

- 错误会冒泡到最近的父错误边界。这意味着`error.js`文件将处理其所有嵌套子段的错误。通过在路由的嵌套文件夹中放置`error.js`文件，可以实现更细粒度或更粗粒度的错误UI。
- `error.js`边界**不会**处理**同一**段中`layout.js`组件抛出的错误，因为错误边界嵌套在该布局的组件**内部**。

### 在布局中处理错误

`error.js`边界**不会**捕获**同一**段中`layout.js`或`template.js`组件抛出的错误。这种[有意的层次结构](#nested-routes)在发生错误时保持了在兄弟路由之间共享的重要UI（如导航）的可见性和功能性。

要处理特定布局或模板中的错误，请在布局的父段中放置一个`error.js`文件。

要处理根布局或模板中的错误，请使用称为`global-error.js`的`error.js`的变体。

### 处理根布局中的错误

根`app/error.js`边界**不会**捕获根`app/layout.js`或`app/template.js`组件抛出的错误。

要特别处理这些根组件中的错误，请使用位于根`app`目录中的称为`app/global-error.js`的`error.js`的变体。

与根`error.js`不同，`global-error.js`错误边界包裹了**整个**应用程序，当激活时，其回退组件将替换根布局。因此，重要的是要注意`global-error.js`**必须**定义自己的`<html>`和`<body>`标签。

`global-error.js`是粒度最粗的错误UI，可以被认为是整个应用程序的"万能"错误处理。由于根组件通常不太动态，其他`error.js`边界将捕获大多数错误，因此它不太可能经常被触发。

即使定义了`global-error.js`，仍然建议定义一个根`error.js`，其回退组件将在包含全局共享UI和品牌的根布局**内**部渲染。

```tsx filename="app/global-error.tsx" switcher
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>出错了！</h2>
        <button onClick={() => reset()}>再试一次</button>
      </body>
    </html>
  )
}
```

```jsx filename="app/global-error.js" switcher
'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>出错了！</h2>
        <button onClick={() => reset()}>再试一次</button>
      </body>
    </html>
  )
}
```

> **须知**：
>
> - `global-error.js`仅在生产环境中启用。在开发中，将显示我们的错误覆盖层。

### 处理服务器错误

如果服务器组件内部抛出错误，Next.js会将一个`Error`对象（在生产中剥离敏感错误信息）作为`error`属性转发给最近的`error.js`文件。

#### 保护敏感错误信息

在生产过程中，`Error`对象# 仅向客户端转发的错误

向客户端转发的错误只包含一个通用的 `message`（消息）属性和 `digest`（摘要）属性。

这是一种安全预防措施，旨在避免将错误中可能包含的敏感细节泄露给客户端。

`message` 属性包含有关错误的通用消息，而 `digest` 属性包含错误自动生成的哈希值，可用于在服务器端日志中匹配相应的错误。

在开发过程中，转发给客户端的 `Error` 对象将被序列化，并包含原始错误的 `message`，以便于调试。