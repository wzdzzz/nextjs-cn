---
title: <链接>
description: 使用内置的 `next/link` 组件启用快速的客户端导航。
---

# 链接

<PagesOnly>

<details>
  <summary>示例</summary>

- [Hello World](https://github.com/vercel/next.js/tree/canary/examples/hello-world)
- [Active className on Link](https://github.com/vercel/next.js/tree/canary/examples/active-class-name)

</details>

</PagesOnly>

`<Link>` 是一个 React 组件，它扩展了 HTML `<a>` 元素，提供了 [预取](/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching) 和客户端路由之间的导航。这是 Next.js 中在不同路由之间导航的主要方式。

<AppOnly>

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

</AppOnly>

<PagesOnly>

例如，考虑一个包含以下文件的 `pages` 目录：

- `pages/index.js`
- `pages/about.js`
- `pages/blog/[slug].js`

我们可以这样链接到这些页面：

```jsx
import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link href="/">首页</Link>
      </li>
      <li>
        <Link href="/about">关于我们</Link>
      </li>
      <li>
        <Link href="/blog/hello-world">博客文章</Link>
      </li>
    </ul>
  )
}

export default Home
```

</PagesOnly>


## 属性

以下是 Link 组件可用属性的摘要：

<PagesOnly>

| 属性                     | 示例                 | 类型             | 必需 |
| ------------------------ | ------------------- | ---------------- | -------- |
| [`href`](#href-required) | `href="/dashboard"` | 字符串或对象       | 是      |
| [`replace`](#replace)    | `replace={false}`   | 布尔值           | -        |
| [`scroll`](#scroll)      | `scroll={false}`    | 布尔值           | -        |
| [`prefetch`](#prefetch)  | `prefetch={false}`  | 布尔值           | -        |

</PagesOnly>

<AppOnly>

| 属性                     | 示例                 | 类型             | 必需 |
| ------------------------ | ------------------- | ---------------- | -------- |
| [`href`](#href-required) | `href="/dashboard"` | 字符串或对象       | 是      |
| [`replace`](#replace)    | `replace={false}`   | 布尔值           | -        |
| [`scroll`](#scroll)      | `scroll={false}`    | 布尔值           | -        |
| [`prefetch`](#prefetch)  | `prefetch={false}`  | 布尔值或 null    | -        |

</AppOnly>

> **须知**：可以作为属性添加到 `<Link>` 的 `<a>` 标签属性，如 `className` 或 `target="_blank"`，并将被传递给底层的 `<a>` 元素。

### `href` (必需)

要导航到的路径或 URL。

```jsx
<Link href="/dashboard">Dashboard</Link>
```

`href` 也可以接受一个对象，例如：

```jsx
// 导航到 /about?name=test
<Link
  href={{
    pathname: '/about',
    query: { name: 'test' },
  }}
>
  关于
</Link>
```


### `replace`

**默认值为 `false`。** 当设置为 `true` 时，`next/link` 将替换当前的历史状态，而不是在 [浏览器的历史](https://developer.mozilla.org/docs/Web/API/History_API) 堆栈中添加一个新的 URL。

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```
### `scroll`

**默认为 `true`。** `<Link>` 的默认行为是滚动到新路由的顶部，或者在前进和后退导航时保持滚动位置。当设置为 `false` 时，`next/link` 在导航后将**不会**滚动到页面顶部。

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" scroll={false}>
      Dashboard
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" scroll={false}>
      Dashboard
    </Link>
  )
}
```

> **须知**：
>
> - Next.js 将在导航时滚动到 [页面](/docs/app/building-your-application/routing/pages)，如果它在视口中不可见。

### `prefetch`

<AppOnly>

当 `<Link />` 组件进入用户的视口（最初或通过滚动）时，会发生预取。Next.js 会在后台预取和加载链接的路由（由 `href` 表示）及其数据，以提高客户端导航的性能。预取仅在生产环境中启用。

- **`null`（默认）**：预取行为取决于路由是静态的还是动态的。对于静态路由，将预取完整的路由（包括其所有数据）。对于动态路由，将预取到最近的具有 [`loading.js`](/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states) 边界的分段的路由。
- `true`：将预取静态和动态路由的完整路由。
- `false`：在进入视口和悬停时都不会发生预取。

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
```

</AppOnly>

<PagesOnly>

当 `<Link />` 组件进入用户的视口（最初或通过滚动）时，会发生预取。Next.js 会在后台预取和加载链接的路由（由 `href` 表示）和数据，以提高客户端导航的性能。预取仅在生产环境中启用。

- **`true`（默认）**：将预取完整的路由及其数据。
- `false`：在进入视口时不会发生预取，但在悬停时会发生预取。如果你想完全移除悬停时的获取，可以考虑使用 `<a>` 标签或[逐步采用](/docs/app/building-your-application/upgrading/app-router-migration) App Router，它也允许禁用悬停时的预取。

```tsx filename="pages/index.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
```

```jsx filename="pages/index.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
```

</PagesOnly>

<PagesOnly>
# 其他属性

## `legacyBehavior`

不再需要将 `<a>` 元素作为 `<Link>` 的子元素。添加 `legacyBehavior` 属性以使用旧版行为，或者移除 `<a>` 以升级。[有一个 codemod 可用](/docs/app/building-your-application/upgrading/codemods#new-link) 来自动升级你的代码。

> **须知**：当 `legacyBehavior` 未设置为 `true` 时，所有 [`anchor`](https://developer.mozilla.org/docs/Web/HTML/Element/a) 标签属性也可以传递给 `next/link`，如 `className`、`onClick` 等。

## `passHref`

强制 `Link` 将其 `href` 属性传递给其子元素。默认为 `false`

## `scroll`

导航后滚动到页面顶部。默认为 `true`

## `shallow`

更新当前页面的路径，而不会重新运行 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)、[`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props) 或 [`getInitialProps`](/docs/pages/api-reference/functions/get-initial-props)。默认为 `false`

## `locale`

活动的语言环境会自动添加到前面。`locale` 允许提供不同的语言环境。当为 `false` 时，`href` 必须包含语言环境，因为默认行为被禁用。

</PagesOnly>

# 示例

## 链接到动态路由

对于动态路由，使用模板文字来创建链接的路径可能会很有帮助。

<PagesOnly>

例如，你可以为动态路由 `pages/blog/[slug].js` 生成一系列链接

```jsx filename="pages/blog/index.js"
import Link from 'next/link'

function Posts({ posts }) {
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

export default Posts
```

</PagesOnly>

<AppOnly>

例如，你可以为动态路由 `app/blog/[slug]/page.js` 生成一系列链接：

```jsx filename="app/blog/page.js"
import Link from 'next/link'

function Page({ posts }) {
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

</AppOnly>


## 如果子元素是一个包装了 `<a>` 标签的自定义组件

<AppOnly>

如果 `Link` 的子元素是一个包装了 `<a>` 标签的自定义组件，你必须向 `Link` 添加 `passHref`。如果你使用的是像 [styled-components](https://styled-components.com/) 这样的库，这是必要的。如果没有这个，`<a>` 标签将不会有 `href` 属性，这会损害你网站的可访问性，并且可能影响 SEO。如果你正在使用 [ESLint](/docs/app/building-your-application/configuring/eslint#eslint-plugin)，有一个内置的规则 `next/link-passhref` 来确保正确使用 `passHref`。

</AppOnly>

<PagesOnly>

如果 `Link` 的子元素是一个包装了 `<a>` 标签的自定义组件，你必须向 `Link` 添加 `passHref`。如果你使用的是像 [styled-components](https://styled-components.com/) 这样的库，这是必要的。如果没有这个，`<a>` 标签将不会有 `href` 属性，这会损害你网站的可访问性，并且可能影响 SEO。如果你正在使用 [ESLint](/docs/pages/building-your-application/configuring/eslint#eslint-plugin)，有一个内置的规则 `next/link-passhref` 来确保正确使用 `passHref`。

</PagesOnly>

```jsx
import Link from 'next/link'
import styled from 'styled-components'

// 这创建了一个包装了 <a> 标签的自定义组件
const RedLink = styled.a`
  color: red;
`

function NavLink({ href, name }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <RedLink>{name}</RedLink>
    </Link>
  )
}

export default NavLink
```

- 如果你正在使用 [emotion](https://emotion.sh/) 的 JSX pragma 特性 (`@jsx jsx`)，即使你直接使用 `<a>` 标签，也必须使用 `passHref`。
- 组件应该支持 `onClick` 属性以正确触发导航
### 如果子组件是函数组件

如果 `Link` 的子组件是函数组件，除了使用 `passHref` 和 `legacyBehavior`，您还必须使用 [`React.forwardRef`](https://react.dev/reference/react/forwardRef) 包装该组件：

```jsx
import Link from 'next/link'

// `onClick`、`href` 和 `ref` 需要传递给 DOM 元素
// 以正确处理
const MyButton = React.forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      点击我
    </a>
  )
})

function Home() {
  return (
    <Link href="/about" passHref legacyBehavior>
      <MyButton />
    </Link>
  )
}

export default Home
```

### 使用 URL 对象

`Link` 也可以接收一个 URL 对象，并且会自动格式化它以创建 URL 字符串。以下是如何操作的示例：

```jsx
import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link
          href={{
            pathname: '/about',
            query: { name: 'test' },
          }}
        >
          关于我们
        </Link>
      </li>
      <li>
        <Link
          href={{
            pathname: '/blog/[slug]',
            query: { slug: 'my-post' },
          }}
        >
          博客文章
        </Link>
      </li>
    </ul>
  )
}

export default Home
```

上述示例包含以下链接：

- 一个预定义的路由：`/about?name=test`
- 一个[动态路由](/docs/app/building-your-application/routing/dynamic-routes)：`/blog/my-post`

您可以使用 [Node.js URL 模块文档](https://nodejs.org/api/url.html#url_url_strings_and_url_objects)中定义的每个属性。

### 替换 URL 而不是推送

`Link` 组件的默认行为是将一个新的 URL `push` 到 `history` 栈中。您可以使用 `replace` 属性来防止添加新的条目，如下所示：

```jsx
<Link href="/about" replace>
  关于我们
</Link>
```

### 禁用滚动到页面顶部

`Link` 的默认行为是滚动到页面顶部。当定义了哈希时，它将滚动到特定的 id，就像普通的 `<a>` 标签一样。为了防止滚动到顶部 / 哈希，可以添加 `scroll={false}` 到 `Link`：

```jsx
<Link href="/#hashid" scroll={false}>
  禁用滚动到顶部
</Link>
```
### Middleware

在使用 [Middleware](/docs/app/building-your-application/routing/middleware) 进行身份验证或其他需要重定向用户到不同页面的目的时，这是一种常见做法。为了使 `<Link />` 组件能够通过 Middleware 正确预取带有重写链接的路由，你需要告诉 Next.js 需要显示的 URL 和需要预取的 URL。这是为了避免不必要的 Middleware 请求，以确定正确的预取路由。

例如，如果你想提供一个具有认证视图和访客视图的 `/dashboard` 路由，你可能会在 Middleware 中添加如下代码来将用户重定向到正确的页面：

```js filename="middleware.js"
export function middleware(req) {
  const nextUrl = req.nextUrl
  if (nextUrl.pathname === '/dashboard') {
    if (req.cookies.authToken) {
      return NextResponse.rewrite(new URL('/auth/dashboard', req.url))
    } else {
      return NextResponse.rewrite(new URL('/public/dashboard', req.url))
    }
  }
}
```

在这种情况下，你会想要在你的 `<Link />` 组件中使用以下代码：

```js
import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed'

export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/public/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
```

<PagesOnly>

> **须知**：如果你正在使用 [Dynamic Routes](/docs/app/building-your-application/routing/dynamic-routes)，你需要调整你的 `as` 和 `href` 属性。例如，如果你有一个像 `/dashboard/authed/[user]` 这样的动态路由，你想要通过 Middleware 以不同的方式展示，你会这样写：`<Link href={ pathname: '/dashboard/authed/[user]', query: { user: username } } as="/dashboard/[user]">Profile</Link>`。

</PagesOnly>

## 版本历史

| 版本   | 变化                                                                                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.0.0` | 不再需要子 `<a>` 标签。提供了一个 [codemod](/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components) 来自动更新你的代码库。 |
| `v10.0.0` | 指向动态路由的 `href` 属性会自动解析，不再需要 `as` 属性。                                                                                         |
| `v8.0.0`  | 提高了预取性能。                                                                                                                                                               |
| `v1.0.0`  | 引入了 `next/link`。                                                                                                                                                                         |