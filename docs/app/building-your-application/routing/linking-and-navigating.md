---
title: 链接和导航
description: 学习 Next.js 中导航的工作原理，以及如何使用 Link 组件和 useRouter 钩子。
related:
  links:
    - app/building-your-application/caching
    - app/building-your-application/configuring/typescript
---

在 Next.js 中有四种方式在路由之间导航：

- 使用 [`<Link>` 组件](#link组件)
- 使用 [`useRouter` 钩子](#userouter钩子) ([客户端组件](/docs/app/building-your-application/rendering/client-components))
- 使用 [`redirect` 函数](#redirect函数) ([服务器组件](/docs/app/building-your-application/rendering/server-components))
- 使用原生的 [History API](#使用原生-history-api)

本页将介绍如何使用这些选项，并深入探讨导航的工作原理。

## `<Link>` 组件

`<Link>` 是一个内置组件，它扩展了 HTML `<a>` 标签，提供了 [预取](#2-预取) 和客户端路由之间的导航。这是 Next.js 中在路由之间导航的主要和推荐方式。

你可以通过从 `next/link` 导入它，并传递一个 `href` 属性来使用它：

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

你可以传递其他可选属性给 `<Link>`。查看 [API 参考](/docs/app/api-reference/components/link) 了解更多。

### 示例

#### 链接到动态段

当链接到 [动态段](/docs/app/building-your-application/routing/dynamic-routes) 时，你可以使用 [模板字符串和插值](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals) 来生成一系列链接。例如，要生成一系列博客文章：

```jsx filename="app/blog/PostList.js"
import Link from 'next/link'

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

#### 检查活动链接

你可以使用 [`usePathname()`]（/docs/app/api-reference/functions/use-pathname） 来确定一个链接是否处于活动状态。例如，要给活动链接添加一个类，你可以检查当前的 `pathname` 是否与链接的 `href` 匹配：

```tsx filename="@/app/ui/nav-links.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        首页
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        关于
      </Link>
    </nav>
  )
}
```

```jsx filename="@/app/ui/nav-links.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        首页
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        关于
      </Link>
    </nav>
  )
}
```

#### 滚动到 `id`

Next.js 应用路由器的默认行为是 **滚动到新路由的顶部或保持后退和前进导航的滚动位置。**

如果你想在导航时滚动到一个特定的 `id`，你可以在 URL 后附加一个 `#` 哈希链接，或者只将哈希链接传递给 `href` 属性。这之所以可能，是因为 `<Link>` 渲染为一个 `<a>` 元素。

```jsx
<Link href="/dashboard#settings">设置</Link>

// 输出
<a href="/dashboard#settings">
```设置

> **须知**：
>
> - 当导航时，如果[页面](/docs/app/building-your-application/routing/pages)不在视口中，Next.js将滚动到页面。

#### 禁用滚动恢复

Next.js应用路由的默认行为是**滚动到新路由的顶部或保持滚动位置以进行前后导航**。如果你想禁用这种行为，你可以向`<Link>`组件传递`scroll={false}`，或者向`router.push()`或`router.replace()`传递`scroll: false`。

```jsx
// next/link
<Link href="/dashboard" scroll={false}>
  仪表盘
</Link>
```

```jsx
// useRouter
import { useRouter } from 'next/navigation'

const router = useRouter()

router.push('/dashboard', { scroll: false })
```

## `useRouter()` 钩子

`useRouter`钩子允许你从[客户端组件](/docs/app/building-your-application/rendering/client-components)中以编程方式更改路由。

```jsx filename="app/page.js"
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      仪表盘
    </button>
  )
}
```

要查看`useRouter`方法的完整列表，请参见[API参考](/docs/app/api-reference/functions/use-router)。

> **建议：** 除非有特定要求使用`useRouter`，否则使用`<Link>`组件在路由之间导航。

## `redirect` 函数

对于[服务器组件](/docs/app/building-your-application/rendering/server-components)，请改用`redirect`函数。

```tsx filename="app/team/[id]/page.tsx" switcher
import { redirect } from 'next/navigation'

async function fetchTeam(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }: { params: { id: string } }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    redirect('/login')
  }

  // ...
}
```

```jsx filename="app/team/[id]/page.js" switcher
import { redirect } from 'next/navigation'

async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    redirect('/login')
  }

  // ...
}
```

> **须知**：
>
> - `redirect`默认返回307（临时重定向）状态码。当在服务器操作中使用时，它返回303（查看其他），这通常用于将POST请求的结果重定向到成功页面。
> - `redirect`内部抛出一个错误，因此应该在`try/catch`块之外调用。
> - `redirect`可以在渲染过程中的客户端组件中调用，但不能在事件处理程序中调用。你可以改用[`useRouter`钩子](#userouter-hook)。
> - `redirect`也接受绝对URL，并可用于重定向到外部链接。
> - 如果你想在渲染过程之前重定向，使用[`next.config.js`](/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs)或[中间件](/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware)。

有关更多信息，请参见[`redirect` API参考](/docs/app/api-reference/functions/redirect)。

## 使用原生History API

Next.js允许你使用原生的[`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)和[`window.history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)方法更新浏览器的历史堆栈而无需重新加载页面。

`pushState`和`replaceState`调用集成到Next.js路由器中，允许你与[`usePathname`](/docs/app/api-reference/functions/use-pathname)和[`useSearchParams`](/docs/app/api-reference/functions/use-search-params)同步。

### `window.history.pushStat# 使用 `window.history.pushState` 添加历史记录

使用它向浏览器的历史记录栈中添加一个新的条目。用户可以导航回之前的状态。例如，对产品列表进行排序：

```tsx fileName="app/ui/sort-products.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>升序排序</button>
      <button onClick={() => updateSorting('desc')}>降序排序</button>
    </>
  )
}
```

```jsx fileName="app/ui/sort-products.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>升序排序</button>
      <button onClick={() => updateSorting('desc')}>降序排序</button>
    </>
  )
}
```

### `window.history.replaceState`

使用它替换浏览器历史记录栈中的当前条目。用户无法导航回之前的状态。例如，切换应用程序的语言环境：

```tsx fileName="app/ui/locale-switcher.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale: string) {
    // 例如 '/en/about' 或 '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>英语</button>
      <button onClick={() => switchLocale('fr')}>法语</button>
    </>
  )
}
```

```jsx fileName="app/ui/locale-switcher.js" switcher
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale) {
    // 例如 '/en/about' 或 '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>英语</button>
      <button onClick={() => switchLocale('fr')}>法语</button>
    </>
  )
}
```

# 路由和导航的工作原理

App Router 使用混合方法进行路由和导航。在服务器上，你的应用程序代码会自动按路由段进行[代码分割](#1-代码分割)。在客户端，Next.js 会[预取](#2-预取)和[缓存](#3-缓存)路由段。这意味着，当用户导航到新路由时，浏览器不会重新加载页面，只有变化的路由段会重新渲染 - 提高了导航体验和性能。

### 1. 代码分割

代码分割允许你将应用程序代码分割成更小的包，由浏览器下载和执行。这减少了每次请求传输的数据量和执行时间，从而提高了性能。

[服务器组件](/docs/app/building-your-application/rendering/server-components)允许你的应用程序代码自动按路由段进行代码分割。这意味着只有在导航时才加载当前路由所需的代码。

### 2. 预取

预取是在用户访问之前在后台预加载路由的一种方式。

在 Next.js 中有两种预取路由的方式：

- **`<Link>` 组件**：当路由在用户的视口中变得可见时，路由会自动预取。当页面首次加载或通过滚动进入视图时，会发生预取。
- **`rou`ter.prefetch()`**：`useRouter` 钩子可以用于以编程方式预取路由。

`<Link>` 的默认预取行为（即当 `prefetch` 属性未指定或设置为 `null` 时）取决于您对 [`loading.js`](/docs/app/api-reference/file-conventions/loading) 的使用。只有共享的布局，沿着组件的“渲染树”直到第一个 `loading.js` 文件，才会被预取和缓存 `30s`。这减少了获取整个动态路由的成本，并且意味着您可以显示一个[即时加载状态](/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states)，为用户提供更好的视觉反馈。

您可以通过将 `prefetch` 属性设置为 `false` 来禁用预取。或者，您可以通过将 `prefetch` 属性设置为 `true` 来预取超出加载边界的完整页面数据。

有关更多信息，请参见 [`<Link>` API 参考](/docs/app/api-reference/components/link)。

> **须知**：
>
> - 在开发中不启用预取，仅在生产中启用。

### 3. 缓存

Next.js 有一个名为 [Router Cache](/docs/app/building-your-application/caching#router-cache) 的**内存内客户端缓存**。当用户在应用程序中导航时，[预取](#2-预取)路由段和访问过的路由的 React Server Component Payload 被存储在缓存中。

这意味着在导航时，尽可能重用缓存，而不是向服务器发起新请求 - 通过减少请求数量和数据传输来提高性能。

了解更多关于 [Router Cache](/docs/app/building-your-application/caching#router-cache) 如何工作以及如何配置它。

### 4. 部分渲染

部分渲染意味着只有在导航时发生变化的路由段会在客户端重新渲染，任何共享的段都会被保留。

例如，当在两个兄弟路由 `/dashboard/settings` 和 `/dashboard/analytics` 之间导航时，`settings` 和 `analytics` 页面将被渲染，共享的 `dashboard` 布局将被保留。

<Image
  alt="部分渲染如何工作"
  srcLight="/docs/light/partial-rendering.png"
  srcDark="/docs/dark/partial-rendering.png"
  width="1600"
  height="945"
/>

没有部分渲染，每次导航都会导致客户端上完整页面重新渲染。仅渲染发生变化的段减少了数据传输量和执行时间，从而提高了性能。

### 5. 软导航

浏览器在页面间导航时执行“硬导航”。Next.js App Router 启用了页面间的“软导航”，确保只有发生变化的路由段被重新渲染（部分渲染）。这使得在导航期间可以保留客户端 React 状态。

### 6. 后退和前进导航

默认情况下，Next.js 将保持后退和前进导航的滚动位置，并在 [Router Cache](/docs/app/building-your-application/caching#router-cache) 中重用路由段。

### 7. 在 `pages/` 和 `app/` 之间进行路由

当逐步从 `pages/` 迁移到 `app/` 时，Next.js 路由器将自动处理两者之间的硬导航。为了检测从 `pages/` 到 `app/` 的转换，有一个客户端路由器过滤器，它利用对应用程序路由的概率性检查，这有时会得出错误的阳性结果。默认情况下，这种情况应该非常罕见，因为我们将误报的可能性配置为 0.01%。这个可能性可以通过 `next.config.js` 中的 `experimental.clientRouterFilterAllowedRate` 选项进行自定义。需要注意的是，降低误报率会增加客户端捆绑包中生成的过滤器的大小。

或者，如果您更喜欢完全禁用此处理并手动管理 `pages/` 和 `app/` 之间的路由，可以在 `next.config.js` 中将 `experimental.clientRouterFilter` 设置为 false。当禁用此功能时，任何动态路由在 p与应用路由重叠的年龄默认无法正确导航。