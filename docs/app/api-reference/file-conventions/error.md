---
title: error.js
description: error.js 特殊文件的 API 参考。
related:
  title: 了解更多关于错误处理的信息
  links:
    - app/building-your-application/routing/error-handling
---

**error** 文件为路由段定义了一个错误 UI 边界。

它对于捕获在服务器组件和客户端组件中发生的**意外**错误并显示一个后备 UI 非常有用。

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


## Props

### `error`

一个 [`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error) 对象的实例，该对象被转发到 `error.js` 客户端组件。

#### `error.message`

错误消息。

- 对于从客户端组件转发的错误，这将是原始错误的信息。
- 对于从服务器组件转发的错误，这将是一个通用的错误消息，以避免泄露敏感细节。可以使用 `errors.digest` 在服务器端日志中匹配相应的错误。

#### `error.digest`

在服务器组件中抛出的错误自动生成的哈希值。它可以用来在服务器端日志中匹配相应的错误。

### `reset`

一个重置错误边界的函数。执行该函数时，函数将尝试重新渲染错误边界的内容。如果成功，后备错误组件将被重新渲染的结果替换。

可以用来提示用户尝试从错误中恢复。

> **须知**：
>
> - `error.js` 边界必须是 **[客户端组件](/docs/app/building-your-application/rendering/client-components)**。
> - 在生产构建中，从服务器组件转发的错误将剥离特定错误细节，以避免泄露敏感信息。
> - `error.js` 边界将 **不会** 处理在 **同一** 段中的 `layout.js` 组件中抛出的错误，因为错误边界嵌套在该布局组件 **内部**。
>   - 要处理特定布局的错误，请在布局的父段中放置一个 `error.js` 文件。
>   - 要处理根布局或模板中的错误，请使用称为 `app/global-error.js` 的 `error.js` 的变体。
## `global-error.js`

要在根目录的 `layout.js` 中特别处理错误，可以使用一个名为 `app/global-error.js` 的 `error.js` 的变体，它位于根目录的 `app` 中。

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
> - `global-error.js` 在激活时会替换根目录的 `layout.js`，因此**必须**定义自己的 `<html>` 和 `<body>` 标签。
> - 在设计错误用户界面时，您可能会发现使用 [React Developer Tools](https://react.dev/learn/react-developer-tools) 手动切换错误边界很有帮助。

## not-found.js

当在路由段内抛出 `notFound()` 函数时，使用 [`not-found`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) 文件来渲染用户界面。

## 版本历史

| 版本   | 变更                    |
| --------- | -------------------------- |
| `v13.1.0` | 引入了 `global-error`。 |
| `v13.0.0` | 引入了 `error`。        |