---
title: 惰性加载
description: 惰性加载导入的库和React组件，以提高应用程序的加载性能。
---

# 惰性加载

[惰性加载](https://developer.mozilla.org/docs/Web/Performance/Lazy_loading) 在 Next.js 中有助于通过减少渲染路由所需的 JavaScript 数量来改善应用程序的初始加载性能。

它允许您推迟加载 **客户端组件** 和导入的库，并且仅在需要时将它们包含在客户端捆绑包中。例如，您可能想要推迟加载一个模态框，直到用户点击打开它。

在 Next.js 中实现惰性加载有两种方式：

1. 使用 [动态导入](#nextdynamic) 与 `next/dynamic`
2. 使用 [`React.lazy()`](https://react.dev/reference/react/lazy) 与 [Suspense](https://react.dev/reference/react/Suspense)

默认情况下，服务器组件会自动进行 [代码拆分](https://developer.mozilla.org/docs/Glossary/Code_splitting)，您可以使用 [流式传输](/docs/app/building-your-application/routing/loading-ui-and-streaming) 逐步从服务器发送 UI 片段到客户端。惰性加载适用于客户端组件。

## `next/dynamic`

`next/dynamic` 是 [`React.lazy()`](https://react.dev/reference/react/lazy) 和 [Suspense](https://react.dev/reference/react/Suspense) 的组合体。它在 `app` 和 `pages` 目录中的行为相同，以允许逐步迁移。

## 示例

### 导入客户端组件

```jsx filename="app/page.js"
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// 客户端组件：
const ComponentA = dynamic(() => import('../components/A'))
const ComponentB = dynamic(() => import('../components/B'))
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })

export default function ClientComponentExample() {
  const [showMore, setShowMore] = useState(false)

  return (
    <div>
      {/* 立即加载，但在单独的客户端捆绑包中 */}
      <ComponentA />

      {/* 按需加载，仅当/如果满足条件时 */}
      {showMore && <ComponentB />}
      <button onClick={() => setShowMore(!showMore)}>切换</button>

      {/* 仅在客户端加载 */}
      <ComponentC />
    </div>
  )
}
```

### 跳过SSR

当使用 `React.lazy()` 和 Suspense 时，客户端组件将默认进行预渲染（SSR）。

如果您想要禁用客户端组件的预渲染，可以使用 `ssr` 选项设置为 `false`：

```jsx
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })
```

### 导入服务器组件

如果您动态导入一个服务器组件，只有作为服务器组件子组件的客户端组件会被惰性加载 - 而不是服务器组件本身。

```jsx filename="app/page.js"
import dynamic from 'next/dynamic'

// 服务器组件：
const ServerComponent = dynamic(() => import('../components/ServerComponent'))

export default function ServerComponentExample() {
  return (
    <div>
      <ServerComponent />
    </div>
  )
}
```
### 加载外部库

可以使用 [`import()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) 函数按需加载外部库。以下示例使用外部库 `fuse.js` 进行模糊搜索。该模块仅在用户在搜索输入框中输入内容后在客户端加载。

```jsx filename="app/page.js"
'use client'

import { useState } from 'react'

const names = ['Tim', 'Joe', 'Bel', 'Lee']

export default function Page() {
  const [results, setResults] = useState()

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onChange={async (e) => {
          const { value } = e.currentTarget
          // 动态加载 fuse.js
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)

          setResults(fuse.search(value))
        }}
      />
      <pre>Results: {JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}
```

### 添加自定义加载组件

```jsx filename="app/page.js"
import dynamic from 'next/dynamic'

const WithCustomLoading = dynamic(
  () => import('../components/WithCustomLoading'),
  {
    loading: () => <p>Loading...</p>,
  }
)

export default function Page() {
  return (
    <div>
      {/* 在 <WithCustomLoading/> 加载时将渲染加载组件 */}
      <WithCustomLoading />
    </div>
  )
}
```

### 导入命名导出

要动态导入命名导出，可以从 [`import()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) 函数返回的 Promise 中返回它：

```jsx filename="components/hello.js"
'use client'

export function Hello() {
  return <p>Hello!</p>
}
```

```jsx filename="app/page.js"
import dynamic from 'next/dynamic'

const ClientComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```


```jsx
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('../components/header'), {
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  return <DynamicHeader />
}
```

> **须知**：在 `import('path/to/component')` 中，路径必须明确写出。它不能是模板字符串，也不能是变量。此外，`import()` 必须在 `dynamic()` 调用内部，以便 Next.js 能够匹配 webpack 包/模块 id 到特定的 `dynamic()` 调用并预加载它们，然后再进行渲染。`dynamic()` 不能在 React 渲染内部使用，因为它需要在模块的顶层标记以使预加载工作，类似于 `React.lazy`。

## 命名导出

要动态导入命名导出，可以从 [`import()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) 返回的 [Promise](https://github.com/tc39/proposal-dynamic-import#example) 中返回它：

```jsx filename="components/hello.js"
export function Hello() {
  return <p>Hello!</p>
}

// pages/index.js
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```

## 无需服务器端渲染

要在客户端动态加载组件，可以使用 `ssr` 选项禁用服务器渲染。如果外部依赖项或组件依赖于 `window` 等浏览器 API，则这非常有用。

```jsx
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('../components/header'), {
  ssr: false,
})
```
## 外部库的使用

这个示例使用了外部库 `fuse.js` 来实现模糊搜索。这个模块仅在用户在搜索输入框中输入内容后才会在浏览器中加载。

```jsx
import { useState } from 'react'

const names = ['Tim', 'Joe', 'Bel', 'Lee']

export default function Page() {
  const [results, setResults] = useState()

  return (
    <div>
      <input
        type="text"
        placeholder="搜索"
        onChange={async (e) => {
          const { value } = e.currentTarget
          // 动态加载 fuse.js
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)

          setResults(fuse.search(value))
        }}
      />
      <pre>结果: {JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}
```

