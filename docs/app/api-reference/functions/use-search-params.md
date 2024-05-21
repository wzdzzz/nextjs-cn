---
title: useSearchParams
description: useSearchParams 钩子的 API 参考。
---

`useSearchParams` 是一个 **客户端组件** 钩子，允许您读取当前 URL 的 **查询字符串**。

`useSearchParams` 返回 [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) 接口的 **只读** 版本。

```tsx filename="app/dashboard/search-bar.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>搜索: {search}</>
}
```

```jsx filename="app/dashboard/search-bar.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>搜索: {search}</>
}
```

## 参数

```tsx
const searchParams = useSearchParams()
```

`useSearchParams` 不接受任何参数。
## 返回值

`useSearchParams` 返回一个只读版本的 [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) 接口，该接口包括用于读取 URL 查询字符串的实用方法：

- [`URLSearchParams.get()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/get): 返回与搜索参数关联的第一个值。例如：

  | URL                  | `searchParams.get("a")`                                                                                         |
  | -------------------- | --------------------------------------------------------------------------------------------------------------- |
  | `/dashboard?a=1`     | `'1'`                                                                                                           |
  | `/dashboard?a=`      | `''`                                                                                                            |
  | `/dashboard?b=3`     | `null`                                                                                                          |
  | `/dashboard?a=1&a=2` | `'1'` _- 使用 [`getAll()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/getAll) 获取所有值_ |

- [`URLSearchParams.has()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/has): 返回一个布尔值，指示给定参数是否存在。例如：

  | URL              | `searchParams.has("a")` |
  | ---------------- | ----------------------- |
  | `/dashboard?a=1` | `true`                  |
  | `/dashboard?b=3` | `false`                 |

- 了解更多关于 [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) 的其他只读方法，包括 [`getAll()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/getAll), [`keys()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/keys), [`values()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/values), [`entries()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/entries), [`forEach()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/forEach), 和 [`toString()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/toString)。

> **须知**：
>
> - `useSearchParams` 是一个 [客户端组件](/docs/app/building-your-application/rendering/client-components) hook，在 [服务器组件](/docs/app/building-your-application/rendering/server-components) 中**不支持**，以防止在[部分渲染](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)期间出现过时的值。
> - 如果应用程序包含 `/pages` 目录，`useSearchParams` 将返回 `ReadonlyURLSearchParams | null`。`null` 值是为了在迁移期间保持兼容性，因为在预渲染不使用 `getServerSideProps` 的页面时，搜索参数是未知的。
### 静态渲染

如果一个路由是[静态渲染](/docs/app/building-your-application/rendering/server-components#static-rendering-default)的，调用 `useSearchParams` 将导致客户端组件树直到最近的 [`Suspense` 边界](/docs/app/building-your-application/routing/loading-ui-and-streaming#example) 被客户端渲染。

这允许路由的一部分被静态渲染，而使用 `useSearchParams` 的动态部分则在客户端渲染。

我们建议将使用 `useSearchParams` 的客户端组件包装在 `<Suspense/>` 边界内。这将允许其上方的任何客户端组件被静态渲染并作为初始 HTML 的一部分发送。[示例](/docs/app/api-reference/functions/use-search-params#static-rendering)。

例如：

```tsx filename="app/dashboard/search-bar.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // 使用静态渲染时，服务器上不会记录此日志
  console.log(search)

  return <>Search: {search}</>
}
```

```jsx filename="app/dashboard/search-bar.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // 使用静态渲染时，服务器上不会记录此日志
  console.log(search)

  return <>Search: {search}</>
}
```

```tsx filename="app/dashboard/page.tsx" switcher
import { Suspense } from 'react'
import SearchBar from './search-bar'

// 作为 Suspense 边界的回退组件
// 将替换初始 HTML 中的搜索栏。
// 当 React 水合期间值可用时，回退
// 将被 `<SearchBar>` 组件替换。
function SearchBarFallback() {
  return <>placeholder</>
}

export default function Page() {
  return (
    <>
      <nav>
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
import { Suspense } from 'react'
import SearchBar from './search-bar'

// 作为 Suspense 边界的回退组件
// 将替换初始 HTML 中的搜索栏。
// 当 React 水合期间值可用时，回退
// 将被 `<SearchBar>` 组件替换。
function SearchBarFallback() {
  return <>placeholder</>
}

export default function Page() {
  return (
    <>
      <nav>
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}
```
## 行为

### 动态渲染

如果一个路由是[动态渲染](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)的，`useSearchParams`将在客户端组件的初始服务器渲染期间在服务器上可用。

例如：

```tsx filename="app/dashboard/search-bar.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // 这将在初始渲染期间在服务器上记录，并且在后续导航中在客户端记录。
  console.log(search)

  return <>搜索: {search}</>
}
```

```jsx filename="app/dashboard/search-bar.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // 这将在初始渲染期间在服务器上记录，并且在后续导航中在客户端记录。
  console.log(search)

  return <>搜索: {search}</>
}
```

```tsx filename="app/dashboard/page.tsx" switcher
import SearchBar from './search-bar'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <nav>
        <SearchBar />
      </nav>
      <h1>仪表板</h1>
    </>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
import SearchBar from './search-bar'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <nav>
        <SearchBar />
      </nav>
      <h1>仪表板</h1>
    </>
  )
}
```

> **须知**：将[`dynamic`路由段配置选项](/docs/app/api-reference/file-conventions/route-segment-config#dynamic)设置为`force-dynamic`可用于强制动态渲染。

### 服务器组件

#### 页面

要在[页面](/docs/app/api-reference/file-conventions/page)（服务器组件）中访问搜索参数，请使用[`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional)属性。

#### 布局

与页面不同，[布局](/docs/app/api-reference/file-conventions/layout)（服务器组件）**不**接收`searchParams`属性。这是因为共享的布局在导航期间[不会重新渲染](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，这可能导致导航之间的`searchParams`过时。查看[详细解释](/docs/app/api-reference/file-conventions/layout#layouts-do-not-receive-searchparams)。

相反，使用页面的[`searchParams`](/docs/app/api-reference/file-conventions/page)属性或在客户端组件中使用[`useSearchParams`](/docs/app/api-reference/functions/use-search-params)钩子，客户端组件会随着最新的`searchParams`重新渲染。
## 示例

### 更新 `searchParams`

您可以使用 [`useRouter`](/docs/app/api-reference/functions/use-router) 或 [`Link`](/docs/app/api-reference/components/link) 来设置新的 `searchParams`。在执行导航后，当前的 [`page.js`](/docs/app/api-reference/file-conventions/page) 将接收到更新后的 [`searchParams` prop](/docs/app/api-reference/file-conventions/page#searchparams-optional)。

```tsx filename="app/example-client-component.tsx" switcher
export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 通过合并当前的 searchParams 和提供的键/值对来获取新的 searchParams 字符串
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
      <p>排序方式</p>

      {/* 使用 useRouter */}
      <button
        onClick={() => {
          // <pathname>?sort=asc
          router.push(pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        ASC
      </button>

      {/* 使用 <Link> */}
      <Link
        href={
          // <pathname>?sort=desc
          pathname + '?' + createQueryString('sort', 'desc')
        }
      >
        DESC
      </Link>
    </>
  )
}
```

```jsx filename="app/example-client-component.js" switcher
export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 通过合并当前的 searchParams 和提供的键/值对来获取新的 searchParams 字符串
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
      <p>排序方式</p>

      {/* 使用 useRouter */}
      <button
        onClick={() => {
          // <pathname>?sort=asc
          router.push(pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        ASC
      </button>

      {/* 使用 <Link> */}
      <Link
        href={
          // <pathname>?sort=desc
          pathname + '?' + createQueryString('sort', 'desc')
        }
      >
        DESC
      </Link>
    </>
  )
}
```

## 版本历史

| 版本   | 变化                       |
| --------- | ----------------------------- |
| `v13.0.0` | 引入 `useSearchParams`。 |