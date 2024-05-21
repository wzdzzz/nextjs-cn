---
title: getServerSideProps
description: 使用 `getServerSideProps` 在每次请求时获取数据。
---

`getServerSideProps` 是 Next.js 的一个函数，可用于在请求时获取数据并渲染页面内容。

## 示例

你可以通过从页面组件导出 `getServerSideProps` 来使用它。下面的示例展示了如何在 `getServerSideProps` 中从第三方 API 获取数据，并将数据作为 props 传递给页面：

```tsx filename="pages/index.tsx" switcher
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getServerSideProps = (async () => {
  // 从外部 API 获取数据
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo: Repo = await res.json()
  // 通过 props 将数据传递给页面
  return { props: { repo } }
}) satisfies GetServerSideProps<{ repo: Repo }>

export default function Page({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  )
}
```

```jsx filename="pages/index.js" switcher
export async function getServerSideProps() {
  // 从外部 API 获取数据
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  // 通过 props 将数据传递给页面
  return { props: { repo } }
}

export default function Page({ repo }) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  )
}
```

## 何时使用 `getServerSideProps`？

如果你需要渲染一个依赖于个性化用户数据或只有在请求时才能知道的页面，你应该使用 `getServerSideProps`。例如，`authorization` 头或地理位置信息。

如果你不需要在请求时获取数据，或者更倾向于缓存数据并预渲染 HTML，我们建议使用 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)。

## 行为

- `getServerSideProps` 在服务器上运行。
- `getServerSideProps` 只能从 **页面** 导出。
- `getServerSideProps` 返回 JSON。
- 当用户访问页面时，`getServerSideProps` 将用于在请求时获取数据，并且使用这些数据来渲染页面的初始 HTML。
- 传递给页面组件的 `props` 可以在客户端作为初始 HTML 的一部分查看。这是为了允许页面正确地 [hydration](https://react.dev/reference/react-dom/hydrate)。确保你不要在 `props` 中传递任何不应该在客户端上可用的敏感信息。
- 当用户通过 [`next/link`](/docs/pages/api-reference/components/link) 或 [`next/router`](/docs/pages/api-reference/functions/use-router) 访问页面时，Next.js 会向服务器发送一个 API 请求，服务器会运行 `getServerSideProps`。
- 使用 `getServerSideProps` 时，你不需要调用 Next.js [API Route](/docs/pages/building-your-application/routing/api-routes) 来获取数据，因为该函数在服务器上运行。相反，你可以直接从 `getServerSideProps` 内部调用 CMS、数据库或其他第三方 API。

> **须知：**
>
> - 查看 [`getServerSideProps` API 参考](/docs/pages/api-reference/functions/get-server-side-props) 以了解可以与 `getServerSideProps` 一起使用的参数和 props。
> - 你可以使用 [next-code-elimination 工具](https://next-code-elimination.vercel.app/) 来验证 Next.js 从客户端捆绑包中消除了什么。

## 错误处理

如果在 `getServerSideProps` 内部抛出错误，它将显示 `pages/500.js` 文件。查看 [500 页面](/docs/pages/building-your-application/routing/custom-error#500-page) 的文档，了解更多关于如何创建它。在开发过程中，将不会使用此文件，而会显示开发错误覆盖层。
## 边缘情况

### Edge 运行时

`getServerSideProps` 可以与 [无服务器和 Edge 运行时](/docs/pages/building-your-application/rendering/edge-and-nodejs-runtimes) 一起使用，并且可以在两者中设置属性。

然而，目前在 Edge 运行时，您无法访问响应对象。这意味着您不能 —— 例如 —— 在 `getServerSideProps` 中添加 cookie。要访问响应对象，您应该 **继续使用 Node.js 运行时**，这是默认的运行时。

您可以通过修改 `config` 来显式设置每个页面的运行时，例如：

```jsx filename="pages/index.js"
export const config = {
  runtime: 'nodejs', // 或 "edge"
}

export const getServerSideProps = async () => {}
```

### 服务器端渲染（SSR）与缓存

您可以在 `getServerSideProps` 中使用缓存头部 (`Cache-Control`) 来缓存动态响应。例如，使用 [`stale-while-revalidate`](https://web.dev/stale-while-revalidate/)。

```jsx
// 这个值被认为在十秒内是新鲜的 (s-maxage=10)。
// 如果在接下来的 10 秒内重复请求，之前缓存的值仍然是新鲜的。如果请求在 59 秒之前重复，
// 缓存的值将过时但仍会呈现 (stale-while-revalidate=59)。
//
// 在后台，将发出一个重新验证请求以用新鲜值填充缓存。如果您刷新页面，您将看到新值。
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {},
  }
}
```

然而，在求助于 `cache-control` 之前，我们建议您看看 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 与 [ISR](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration) 是否更适合您的用例。