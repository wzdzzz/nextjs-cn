# 链接和导航

了解Next.js中的导航是如何工作的，以及如何使用Link组件和`useRouter`钩子。

相关链接：
- app/building-your-application/caching
- app/building-your-application/configuring/typescript

在Next.js中，有四种在路由之间导航的方式：

- 使用[`<Link>`组件](#link-component)
- 使用[`useRouter`钩子](#userouter-hook) ([客户端组件](/docs/app/building-your-application/rendering/client-components))
- 使用[`redirect`函数](#redirect-function) ([服务器组件](/docs/app/building-your-application/rendering/server-components))
- 使用原生[History API](#using-the-native-history-api)

本页将介绍如何使用这些选项，并更深入地探讨导航的工作原理。
# `<Link>` 组件

`<Link>` 是一个内置组件，它扩展了 HTML `<a>` 标签，提供了[预取](#2-prefetching)和客户端路由导航功能。这是在 Next.js 中推荐的主要方式，用于在不同路由之间进行导航。

你可以通过从 `next/link` 导入它，并传递一个 `href` 属性到组件中来使用它：

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

你可以传递其他可选属性给 `<Link>`。更多信息请参阅 [API 参考](/docs/app/api-reference/components/link)。

### 示例

#### 链接到动态段

当链接到[动态段](/docs/app/building-your-application/routing/dynamic-routes)时，你可以使用[模板字面量和插值](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)来生成一系列链接。例如，生成一系列博客文章的列表：

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

你可以使用 [`usePathname()`](/docs/app/api-reference/functions/use-pathname) 来确定一个链接是否处于活动状态。例如，要给活动链接添加一个类，你可以检查当前的 `pathname` 是否与链接的 `href` 匹配：

```tsx filename="@/app/ui/nav-links.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
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
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

#### 滚动到一个 `id`

Next.js App Router 的默认行为是在导航时**滚动到新路由的顶部或保持后退和前进导航时的滚动位置**。

如果你想要在导航时滚动到特定的 `id`，你可以在 URL 后附加一个 `#` 哈希链接，或者只传递一个哈希链接到 `href` 属性。这是可能的，因为 `<Link>` 渲染为一个 `<a>` 元素。

```jsx
<Link href="/dashboard#settings">Settings</Link>

// 输出
<a href="/dashboard#settings">Settings</a>
```

> **须知**：
>
> - Next.js 将在导航时滚动到 [页面](/docs/app/building-your-application/routing/pages)，如果它在视口中不可见。

#### 禁用滚动恢复

Next.js App Router 的默认行为是在导航时**滚动到新路由的顶部或保持后退和前进导航时的滚动位置**。如果你想禁用这种行为，你可以传递 `scroll={false}` 到 `<Link>` 组件，或者传递 `scroll: false` 到 `router.push()` 或 `router.replace()`。

```jsx
// next/link
<Link href="/dashboard" scroll={false}>
  Dashboard
</Link>
```

```jsx
// useRouter
import { useRouter } from 'next/navigation'

const router = useRouter()

router.push('/dashboard', { scroll: false })
```
# `useRouter()` 钩子

`useRouter` 钩子允许你从 [客户端组件](/docs/app/building-your-application/rendering/client-components) 中以编程方式更改路由。

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

要查看 `useRouter` 方法的完整列表，请参见 [API 参考](/docs/app/api-reference/functions/use-router)。

> **推荐**：除非有特定要求使用 `useRouter`，否则使用 `<Link>` 组件在路由之间导航。

# `redirect` 函数

对于 [服务器组件](/docs/app/building-your-application/rendering/server-components)，改用 `redirect` 函数。

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
> - `redirect` 默认返回一个 307（临时重定向）状态码。当在服务器操作中使用时，它返回一个 303（查看其他），通常用于将用户重定向到 POST 请求成功后的页面。
> - `redirect` 内部抛出一个错误，因此应该在 `try/catch` 块之外调用。
> - `redirect` 可以在客户端组件的渲染过程中被调用，但不能在事件处理程序中调用。你可以改用 [`useRouter` 钩子](#userouter-hook)。
> - `redirect` 也接受绝对 URL，并可用于重定向到外部链接。
> - 如果你想在渲染过程之前进行重定向，请使用 [`next.config.js`](/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs) 或 [中间件](/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware)。

要获取更多信息，请参见 [`redirect` API 参考](/docs/app/api-reference/functions/redirect)。
# 使用原生History API

Next.js 允许您使用原生的 [`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) 和 [`window.history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) 方法来更新浏览器的历史记录堆栈，而无需重新加载页面。

`pushState` 和 `replaceState` 调用与 Next.js Router 集成，允许您与 [`usePathname`](/docs/app/api-reference/functions/use-pathname) 和 [`useSearchParams`](/docs/app/api-reference/functions/use-search-params) 同步。

### `window.history.pushState`

使用它来向浏览器的历史记录堆栈添加一个新条目。用户可以导航回之前的状态。例如，对产品列表进行排序：

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

使用它来替换浏览器历史记录堆栈中的当前条目。用户无法导航回之前的状态。例如，切换应用程序的语言环境：

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

App Router 使用混合方法进行路由和导航。在服务器上，您的应用程序代码会根据路由段自动进行 [代码拆分](#1-code-splitting)。在客户端，Next.js 会 [预取](#2-prefetching) 和 [缓存](#3-caching) 路由段。这意味着，当用户导航到新路由时，浏览器不会重新加载页面，只有变化的路由段会重新渲染 - 从而改善导航体验和性能。
# Code Splitting

代码分割允许你将应用程序代码分割成更小的包，由浏览器下载和执行。这减少了每次请求传输的数据量和执行时间，从而提高了性能。

[服务器组件](/docs/app/building-your-application/rendering/server-components)允许你的应用程序代码按路由段自动进行代码分割。这意味着只有在导航时才加载当前路由所需的代码。

# Prefetching

预取是一种在用户访问之前在后台预加载路由的方式。

Next.js 中有两种预取路由的方式：

- **`<Link>` 组件**：当路由在用户视口中变得可见时，路由会自动预取。预取发生在页面首次加载时或通过滚动进入视图时。
- **`router.prefetch()`**：可以使用 `useRouter` 钩子以编程方式预取路由。

`<Link>` 的默认预取行为（即当 `prefetch` 属性未指定或设置为 `null` 时）取决于你对 [`loading.js`](/docs/app/api-reference/file-conventions/loading) 的使用。只有共享的布局，在组件渲染的“树”中直到第一个 `loading.js` 文件，会被预取和缓存 `30s`。这减少了获取整个动态路由的成本，并且意味着你可以显示一个[即时加载状态](/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states)，为用户提供更好的视觉反馈。

你可以通过将 `prefetch` 属性设置为 `false` 来禁用预取。或者，你可以通过将 `prefetch` 属性设置为 `true` 来预取超出加载边界的完整页面数据。

更多信息请参阅 [`<Link>` API 参考](/docs/app/api-reference/components/link)。

> **须知**：
>
> - 在开发环境中不启用预取，只有在生产环境中启用。

# Caching

Next.js 有一个称为 [Router Cache](/docs/app/building-your-application/caching#router-cache) 的**内存客户端缓存**。当用户在应用程序中导航时，[预取](#2-prefetching)的路由段和访问过的路由的 React Server Component Payload 被存储在缓存中。

这意味着在导航时，尽可能多地重用缓存，而不是向服务器发出新请求 - 通过减少请求数量和传输的数据量来提高性能。

了解更多关于 [Router Cache](/docs/app/building-your-application/caching#router-cache) 如何工作以及如何配置它。

# Partial Rendering

部分渲染意味着只有在导航时发生变化的路由段会在客户端重新渲染，任何共享的段都会保留。

例如，当在两个兄弟路由 `/dashboard/settings` 和 `/dashboard/analytics` 之间导航时，`settings` 和 `analytics` 页面将被渲染，共享的 `dashboard` 布局将被保留。

![How partial rendering works](https://nextjs.org/_next/image?url=/docs/light/partial-rendering.png&w=3840&q=75)

没有部分渲染，每次导航都会导致客户端上整个页面重新渲染。只渲染变化的部分减少了传输的数据量和执行时间，从而提高了性能。

# Soft Navigation

浏览器在页面间导航时执行“硬导航”。Next.js App Router 启用页面间的“软导航”，确保只有发生变化的路由段被重新渲染（部分渲染）。这使得在导航期间可以保留客户端 React 状态。

# Back and Forward Navigation

默认情况下，Next.js 会保持向后和向前导航时的滚动位置，并在 [Router Cache](/docs/app/building-your-application/caching#router-cache) 中重用路由段。
# 7. `pages/` 与 `app/` 之间的路由

当逐步从 `pages/` 迁移到 `app/` 时，Next.js 路由器将自动处理两者之间的硬导航。为了检测从 `pages/` 到 `app/` 的过渡，有一个客户端路由器过滤器，它利用应用路由的概率性检查，这有时可能导致误报。默认情况下，这种情况应该非常罕见，因为我们将误报的可能性配置为 0.01%。这种可能性可以通过 `next.config.js` 中的 `experimental.clientRouterFilterAllowedRate` 选项进行自定义。需要注意的是，降低误报率会增加客户端捆绑包中生成的过滤器的大小。

或者，如果您更倾向于完全禁用此处理，并手动管理 `pages/` 和 `app/` 之间的路由，您可以在 `next.config.js` 中将 `experimental.clientRouterFilter` 设置为 false。当此功能被禁用时，默认情况下，与应用路由重叠的页面中的任何动态路由都不会被正确导航。