# getStaticProps

如果你从一个页面导出一个名为 `getStaticProps` 的函数（静态网站生成），Next.js 将在构建时使用 `getStaticProps` 返回的属性预渲染此页面。

```tsx filename="pages/index.tsx" switcher
import type { InferGetStaticPropsType, GetStaticProps } from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getStaticProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetStaticProps<{
  repo: Repo
}>

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count
}
```

```jsx filename="pages/index.js" switcher
export async function getStaticProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}

export default function Page({ repo }) {
  return repo.stargazers_count
}
```

> 请注意，无论渲染类型如何，任何 `props` 都将传递给页面组件，并且可以在初始 HTML 中在客户端查看。这是为了允许页面正确地[水合](https://react.dev/reference/react-dom/hydrate)。确保你不要在 `props` 中传递任何不应该在客户端可用的敏感信息。

[`getStaticProps` API 参考](/docs/pages/api-reference/functions/get-static-props)涵盖了所有可以与 `getStaticProps` 一起使用的参数和属性。

## 何时使用 getStaticProps？

你应该使用 `getStaticProps`，如果：

- 页面渲染所需的数据在用户请求之前在构建时可用
- 数据来自无头 CMS
- 页面必须预渲染（用于 SEO）并且非常快 — `getStaticProps` 生成 `HTML` 和 `JSON` 文件，两者都可以被 CDN 缓存以提高性能
- 数据可以公开缓存（非用户特定）。在某些特定情况下，可以通过使用中间件重写路径来绕过此条件。

## getStaticProps 何时运行

`getStaticProps` 总是在服务器上运行，从不在客户端运行。你可以使用[这个工具](https://next-code-elimination.vercel.app/)验证 `getStaticProps` 内部编写的代码是否已从客户端捆绑包中移除。

- `getStaticProps` 总是在 `next build` 期间运行
- 使用 [`fallback: true`](/docs/pages/api-reference/functions/get-static-paths#fallback-true) 时，`getStaticProps` 在后台运行
- 使用 [`fallback: blocking`](/docs/pages/api-reference/functions/get-static-paths#fallback-blocking) 时，`getStaticProps` 在初始渲染前被调用
- 使用 `revalidate` 时，`getStaticProps` 在后台运行
- 使用 [`revalidate()`](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation) 时，`getStaticProps` 按需在后台运行

结合 [增量静态再生](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)，`getStaticProps` 将在旧页面正在重新验证时在后台运行，并将新鲜页面提供给浏览器。

`getStaticProps` 无法访问传入的请求（例如查询参数或 HTTP 头），因为它生成静态 HTML。如果你需要访问页面的请求，请考虑除了 `getStaticProps` 之外，还使用 [中间件](/docs/pages/building-your-application/routing/middleware)。
## 使用 getStaticProps 从 CMS 获取数据

以下示例展示了如何从 CMS 获取博客文章列表。

```tsx filename="pages/blog.tsx" switcher
// posts 将在构建时由 getStaticProps() 填充
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// 此函数将在服务器端构建时被调用。
// 它不会在客户端被调用，因此你甚至可以直接执行
// 数据库查询。
export async function getStaticProps() {
  // 调用外部 API 端点获取文章。
  // 你可以使用任何数据获取库
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 通过返回 { props: { posts } }，Blog 组件
  // 将在构建时作为属性接收 `posts`
  return {
    props: {
      posts,
    },
  }
}
```

```jsx filename="pages/blog.js" switcher
// posts 将在构建时由 getStaticProps() 填充
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// 此函数将在服务器端构建时被调用。
// 它不会在客户端被调用，因此你甚至可以直接执行
// 数据库查询。
export async function getStaticProps() {
  // 调用外部 API 端点获取文章。
  // 你可以使用任何数据获取库
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 通过返回 { props: { posts } }，Blog 组件
  // 将在构建时作为属性接收 `posts`
  return {
    props: {
      posts,
    },
  }
}
```

[`getStaticProps` API 参考](/docs/pages/api-reference/functions/get-static-props)涵盖了所有可以使用 `getStaticProps` 的参数和属性。

## 直接编写服务器端代码

由于 `getStaticProps` 只在服务器端运行，它永远不会在客户端运行。它甚至不会被包含在浏览器的 JS 打包文件中，因此你可以直接编写数据库查询代码，而不需要将它们发送到浏览器。

这意味着，你可以直接在 `getStaticProps` 中编写服务器端代码，而不是从 `getStaticProps` 获取 **API 路由**（该路由本身从外部源获取数据）。

以以下示例为例。一个 API 路由被用来从 CMS 获取一些数据。然后直接从 `getStaticProps` 调用该 API 路由。这会产生一个额外的调用，降低性能。相反，可以通过使用 `lib/` 目录共享从 CMS 获取数据的逻辑。然后它就可以与 `getStaticProps` 共享。

```js filename="lib/load-posts.js"
// 以下函数与 getStaticProps 和 API 路由共享
// 来自 `lib/` 目录
export async function loadPosts() {
  // 调用外部 API 端点获取文章
  const res = await fetch('https://.../posts/')
  const data = await res.json()

  return data
}
```

```jsx filename="pages/blog.js"
// pages/blog.js
import { loadPosts } from '../lib/load-posts'

// 此函数只在服务器端运行
export async function getStaticProps() {
  // 而不是获取你的 `/api` 路由，你可以直接在 `getStaticProps` 中调用相同的
  // 函数
  const posts = await loadPosts()

  // 返回的属性将传递给页面组件
  return { props: { posts } }
}
```

或者，如果你**不**使用 API 路由来获取数据，那么可以直接在 `getStaticProps` 中使用 [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API) API 来获取数据。

要验证 Next.js 从客户端打包文件中消除了什么，你可以使用 [next-code-elimination 工具](https://next-code-elimination.vercel.app/)。
# Statically generates both HTML and JSON

当使用 `getStaticProps` 的页面在构建时进行预渲染时，除了页面的 HTML 文件外，Next.js 还会生成一个包含运行 `getStaticProps` 结果的 JSON 文件。

这个 JSON 文件将通过 [`next/link`](/docs/pages/api-reference/components/link) 或 [`next/router`](/docs/pages/api-reference/functions/use-router) 在客户端路由中使用。当您导航到使用 `getStaticProps` 进行预渲染的页面时，Next.js 会获取这个在构建时预先计算好的 JSON 文件，并将其作为页面组件的属性。这意味着客户端页面转换将**不会**调用 `getStaticProps`，因为只使用了导出的 JSON。

当使用增量静态生成时，`getStaticProps` 将在后台执行，以生成客户端导航所需的 JSON。您可能会看到对同一页面进行了多次请求，但这是正常的，并且对最终用户的性能没有影响。

## Where can I use getStaticProps

`getStaticProps` 只能从**页面**导出。您**不能**从非页面文件、`_app`、`_document` 或 `_error` 中导出它。

这个限制的原因之一是 React 需要在页面渲染之前拥有所有必需的数据。

此外，您必须将 `getStaticProps` 作为独立函数导出 —— 如果您将 `getStaticProps` 作为页面组件的属性添加，它将**不起作用**。

> **须知**：如果您已经创建了一个 [自定义应用](/docs/pages/building-your-application/routing/custom-app)，请确保您像链接文档中显示的那样将 `pageProps` 传递给页面组件，否则属性将是空的。

## Runs on every request in development

在开发中（`next dev`），`getStaticProps` 将在每个请求时被调用。

## Preview Mode

您可以使用 [**预览模式**](/docs/pages/building-your-application/configuring/preview-mode) 临时绕过静态生成，并在**请求时**而不是构建时渲染页面。例如，您可能正在使用无头 CMS，并希望在发布之前预览草稿。