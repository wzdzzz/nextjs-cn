# Error Handling

`error.js` 文件约定允许您在 [嵌套路由](/docs/app/building-your-application/routing#nested-routes) 中优雅地处理意外的运行时错误。

- 自动将路由段及其嵌套子级包装在 [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) 中。
- 使用文件系统层次结构创建针对特定段的定制错误 UI，以调整粒度。
- 隔离错误以影响的段，同时保持应用程序的其余部分功能正常。
- 添加功能，尝试在不进行完整页面重新加载的情况下从错误中恢复。

通过在路由段内添加 `error.js` 文件并导出一个 React 组件来创建错误 UI：

![error.js 特殊文件](/docs/light/error-special-file.png)

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
          // 尝试通过尝试重新渲染段来恢复
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
          // 尝试通过尝试重新渲染段来恢复
          () => reset()
        }
      >
        再试一次
      </button>
    </div>
  )
}
```

### `error.js` 的工作原理

![How error.js works](/docs/light/error-overview.png)

- `error.js` 自动创建一个 [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)，该边界 **包裹** 一个嵌套子段或 `page.js` 组件。
- 从 `error.js` 文件导出的 React 组件用作 **后备** 组件。
- 如果在错误边界内抛出错误，错误将被 **包含**，并且将 **渲染** 后备组件。
- 当后备错误组件处于活动状态时，错误边界 **上方** 的布局 **保持** 其状态并 **保持** 交互性，错误组件可以显示从错误中恢复的功能。
### 从错误中恢复

错误的发生有时可能是暂时性的。在这种情况下，简单地尝试重新操作可能会解决问题。

错误组件可以使用 `reset()` 函数来提示用户尝试从错误中恢复。执行该函数时，它将尝试重新渲染错误边界的内容。如果成功，回退错误组件将被重新渲染的结果替换。

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
  return (
    <div>
      <h2>出了点问题！</h2>
      <button onClick={() => reset()}>再试一次</button>
    </div>
  )
}
```

### 嵌套路由

通过[特殊文件](/docs/app/building-your-application/routing#file-conventions)创建的React组件在[特定的嵌套层次结构](/docs/app/building-your-application/routing#component-hierarchy)中进行渲染。

例如，具有两个段的嵌套路由，这两个段都包含 `layout.js` 和 `error.js` 文件，它们在以下简化的组件层次结构中被渲染：

![嵌套错误组件层次结构](/docs/light/nested-error-component-hierarchy.png)

嵌套组件层次结构对嵌套路由中 `error.js` 文件的行为有影响：

- 错误会冒泡到最近的父错误边界。这意味着 `error.js` 文件将处理其所有嵌套子段的错误。通过在路由的嵌套文件夹的不同级别放置 `error.js` 文件，可以实现更细粒度的错误UI。
- `error.js` 边界将**不会**处理在**同一**段中的 `layout.js` 组件抛出的错误，因为错误边界嵌套在该布局的组件**内部**。

### 在布局中处理错误

`error.js` 边界**不会**捕获在**同一段**的 `layout.js` 或 `template.js` 组件中抛出的错误。这种[有意的层次结构](#nested-routes)在发生错误时保持了在兄弟路由之间共享的重要UI（例如导航）的可见性和功能性。

要在特定布局或模板中处理错误，请在布局的父段中放置一个 `error.js` 文件。

要在根布局或模板中处理错误，请使用称为 `global-error.js` 的 `error.js` 的变体。
### 根布局中的错误处理

根 `app/error.js` 边界**不**捕获在根 `app/layout.js` 或 `app/template.js` 组件中抛出的错误。

要特别处理这些根组件中的错误，请使用位于根 `app` 目录中的名为 `app/global-error.js` 的 `error.js` 的变体。

与根 `error.js` 不同，`global-error.js` 错误边界包装了**整个**应用程序，其回退组件在激活时将替换根布局。因此，重要的是要注意 `global-error.js` **必须**定义自己的 `<html>` 和 `<body>` 标签。

`global-error.js` 是最不细粒度的错误 UI，可以被认为是整个应用程序的“通用”错误处理。由于根组件通常不太动态，其他 `error.js` 边界将捕获大多数错误，因此它不太可能经常被触发。

即使定义了 `global-error.js`，仍然建议定义一个根 `error.js`，其回退组件将在包括全局共享 UI 和品牌在内的根布局**内**呈现。

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
        <h2>出了点问题！</h2>
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
        <h2>出了点问题！</h2>
        <button onClick={() => reset()}>再试一次</button>
      </body>
    </html>
  )
}
```

> **须知**：
>
> - `global-error.js` 仅在生产环境中启用。在开发中，将显示我们的错误覆盖层。

### 处理服务器错误

如果服务器组件内部抛出错误，Next.js 将把一个 `Error` 对象（在生产中剥离敏感错误信息）作为 `error` 属性转发到最近的 `error.js` 文件。

#### 保护敏感错误信息

在生产过程中，转发到客户端的 `Error` 对象仅包括通用的 `message` 和 `digest` 属性。

这是一种安全预防措施，以避免将错误中可能包含的敏感细节泄露给客户端。

`message` 属性包含有关错误的通用消息，`digest` 属性包含错误的自动生成哈希值，可用于匹配服务器端日志中的相应错误。

在开发过程中，转发到客户端的 `Error` 对象将被序列化，并包括原始错误的 `message`，以便于调试。