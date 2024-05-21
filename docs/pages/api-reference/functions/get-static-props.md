---
title: getStaticProps
description: Next.js中`getStaticProps`的API参考。了解如何使用`getStaticProps`生成静态页面。
---

导出一个名为`getStaticProps`的函数将在构建时预渲染页面，并使用该函数返回的props：

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

您可以在`getStaticProps`中使用顶层作用域导入模块。使用的导入**不会为客户端打包**。这意味着您可以在`getStaticProps`中直接编写**服务器端代码**，包括从数据库获取数据。
## Context parameter

The `context` parameter is an object containing the following keys:

| Name               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`           | Contains the route parameters for pages using [dynamic routes](/docs/pages/building-your-application/routing/dynamic-routes). For example, if the page name is `[id].js`, then `params` will look like `{ id: ... }`. You should use this together with `getStaticPaths`, which we'll explain later.                                                                                                                                              |
| `preview`          | (Deprecated for `draftMode`) `preview` is `true` if the page is in the [Preview Mode](/docs/pages/building-your-application/configuring/preview-mode) and `false` otherwise.                                                                                                                                                                                                                                                                      |
| `previewData`      | (Deprecated for `draftMode`) The [preview](/docs/pages/building-your-application/configuring/preview-mode) data set by `setPreviewData`.                                                                                                                                                                                                                                                                                                          |
| `draftMode`        | `draftMode` is `true` if the page is in the [Draft Mode](/docs/pages/building-your-application/configuring/draft-mode) and `false` otherwise.                                                                                                                                                                                                                                                                                                     |
| `locale`           | Contains the active locale (if enabled).                                                                                                                                                                                                                                                                                                                                                                                                          |
| `locales`          | Contains all supported locales (if enabled).                                                                                                                                                                                                                                                                                                                                                                                                      |
| `defaultLocale`    | Contains the configured default locale (if enabled).                                                                                                                                                                                                                                                                                                                                                                                              |
| `revalidateReason` | Provides a reason for why the function was called. Can be one of: "build" (run at build time), "stale" (revalidate period expired, or running in [development mode](/docs/pages/building-your-application/data-fetching/get-static-props#runs-on-every-request-in-development)), "on-demand" (triggered via [on-demand revalidation](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation)) |


# getStaticProps 返回值

`getStaticProps` 函数应该返回一个对象，其中包含 `props`、`redirect` 或 `notFound`，随后是 **可选的** `revalidate` 属性。

### `props`

`props` 对象是键值对，其中的每个值都会被页面组件接收。它应该是一个[可序列化对象](https://developer.mozilla.org/docs/Glossary/Serialization)，以便传递的任何属性都能通过 [`JSON.stringify`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 进行序列化。

```jsx
export async function getStaticProps(context) {
  return {
    props: { message: `Next.js is awesome` }, // 将作为 props 传递给页面组件
  }
}
```

### `revalidate`

`revalidate` 属性是页面重新生成的秒数（默认为 `false` 或无重新验证）。

```js
// 此函数在服务器端构建时被调用。
// 如果启用了重新验证，并且有新请求进来，
// 它可能会再次在无服务器函数上被调用
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js 将尝试重新生成页面：
    // - 当有请求进来时
    // - 每 10 秒最多一次
    revalidate: 10, // 以秒为单位
  }
}
```

了解更多关于[增量静态再生](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)。

利用 ISR 的页面的缓存状态可以通过读取 `x-nextjs-cache` 响应头的值来确定。可能的值如下：

- `MISS` - 路径不在缓存中（最多发生一次，在首次访问时）
- `STALE` - 路径在缓存中，但超过了重新验证时间，因此将在后台更新
- `HIT` - 路径在缓存中，并且没有超过重新验证时间

### `notFound`

`notFound` 布尔值允许页面返回 `404` 状态和[404 页面](/docs/pages/building-your-application/routing/custom-error#404-page)。使用 `notFound: true`，即使之前成功生成了页面，页面也会返回 `404`。这是为了支持用户生成的内容被其作者删除等用例。注意，`notFound` 遵循相同的 `revalidate` 行为[如这里所述](#revalidate)。

```js
export async function getStaticProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // 将作为 props 传递给页面组件
  }
}
```

> **须知**：对于 [`fallback: false`](/docs/pages/api-reference/functions/get-static-paths#fallback-false) 模式，不需要 `notFound`，因为只有从 `getStaticPaths` 返回的路径才会预先渲染。

### `redirect`

`redirect` 对象允许重定向到内部或外部资源。它应该匹配 `{ destination: string, permanent: boolean }` 的形状。

在某些罕见的情况下，您可能需要为旧的 `HTTP` 客户端分配自定义状态代码以正确重定向。在这些情况下，您可以使用 `statusCode` 属性而不是 `permanent` 属性，**但不能同时使用**。您也可以设置 `basePath: false`，类似于 `next.config.js` 中的重定向。

```js
export async function getStaticProps(context) {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
        // statusCode: 301
      },
    }
  }

  return {
    props: { data }, // 将作为 props 传递给页面组件
  }
}
```

如果重定向在构建时已知，它们应该添加在 [`next.config.js`](/docs/pages/api-reference/next-config-js/redirects) 中。
## 读取文件：使用 `process.cwd()`

在 `getStaticProps` 中，可以直接从文件系统中读取文件。

为此，您需要获取文件的完整路径。

由于 Next.js 会将您的代码编译到一个单独的目录中，您不能使用 `__dirname`，因为它返回的路径与页面路由不同。

相反，您可以使用 `process.cwd()`，它提供了 Next.js 正在执行的目录。

```jsx
import { promises as fs } from 'fs'
import path from 'path'

// posts 将在构建时由 getStaticProps() 填充
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>
          <h3>{post.filename}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  )
}

// 这个函数在服务器端构建时被调用。
// 它不会在客户端被调用，所以您甚至可以进行
// 直接的数据库查询。
export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = await fs.readdir(postsDirectory)

  const posts = filenames.map(async (filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = await fs.readFile(filePath, 'utf8')

    // 通常您会解析/转换内容
    // 例如，您可以在这里将 markdown 转换为 HTML

    return {
      filename,
      content: fileContents,
    }
  })
  // 通过返回 { props: { posts } }，Blog 组件
  // 将在构建时作为属性接收 `posts`
  return {
    props: {
      posts: await Promise.all(posts),
    },
  }
}

export default Blog
```

## 版本历史

| 版本   | 变更                                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.4.0` | [App Router](/docs/app/building-your-application/data-fetching) 现在稳定，数据获取简化                                                           |
| `v12.2.0` | [按需增量静态生成](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation) 现在稳定。    |
| `v12.1.0` | [按需增量静态生成](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation) 添加 (beta)。 |
| `v10.0.0` | 添加了 `locale`、`locales`、`defaultLocale` 和 `notFound` 选项。                                                                                                   |
| `v10.0.0` | 添加了 `fallback: 'blocking'` 返回选项。                                                                                                                           |
| `v9.5.0`  | [增量静态生成](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration) 稳定。                                         |
| `v9.3.0`  | 引入了 `getStaticProps`。                                                                                                                                          |

## 须知

- 您应该使用 `process.cwd()` 来获取 Next.js 执行时的目录路径，而不是使用 `__dirname`。
- `getStaticProps` 函数在构建时服务器端调用，因此您可以执行直接的数据库查询等操作。
- 通过 `Promise.all()` 可以等待所有异步操作完成后再返回数据，确保 `posts` 属性在构建时被正确填充。