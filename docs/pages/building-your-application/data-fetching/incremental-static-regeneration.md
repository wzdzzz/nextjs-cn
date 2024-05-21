---
title: 增量静态生成（ISR）
description: 学习如何使用增量静态生成在运行时创建或更新静态页面。
---

<details>
  <summary>示例</summary>

- [Next.js Commerce](https://nextjs.org/commerce)
- [GitHub Reactions Demo](https://reactions-demo.vercel.app/)
- [Static Tweet Demo](https://static-tweet.vercel.app/)

</details>

Next.js 允许您在构建网站后创建或更新静态页面。增量静态生成（ISR）使您能够在每个页面的基础上使用静态生成，而**无需重建整个网站**。通过 ISR，您可以保留静态的好处，同时扩展到数百万页面。

> **须知**：当前 [`edge` 运行时](/docs/pages/api-reference/edge) 与 ISR 不兼容，尽管您可以通过手动设置 `cache-control` 头部来利用 `stale-while-revalidate`。

要使用 ISR，请在 `getStaticProps` 中添加 `revalidate` 属性：

```jsx
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// 此函数在构建时在服务器端被调用。
// 如果启用了重新验证，并且有新的请求进来
// 它可能会再次被调用，在无服务器函数上
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
    revalidate: 10, // 单位为秒
  }
}

// 此函数在构建时在服务器端被调用。
// 如果路径尚未生成，则可能会再次在无服务器函数上调用
export async function getStaticPaths() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 根据帖子获取我们想要预渲染的路径
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // 我们将在构建时仅预渲染这些路径。
  // { fallback: 'blocking' } 将按需服务器呈现页面
  // 如果路径不存在。
  return { paths, fallback: 'blocking' }
}

export default Blog
```

当对在构建时预渲染的页面进行请求时，它最初将显示缓存的页面。

- 在初始请求之后和 10 秒之前的任何请求也将被缓存并瞬间完成。
- 在 10 秒窗口之后，下一次请求仍将显示缓存的（过时的）页面
- Next.js 会在后台触发页面的重新生成。
- 一旦页面成功生成，Next.js 将使缓存失效并显示更新后的页面。如果后台重新生成失败，旧页面将保持不变。

当对尚未生成的路径进行请求时，Next.js 将在第一次请求时服务器呈现页面。未来的请求将从缓存中提供静态文件。在 Vercel 上的 ISR [全局持久化缓存并处理回滚](https://vercel.com/docs/concepts/next.js/incremental-static-regeneration?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)。

> **须知**：检查您的上游数据提供商是否默认启用了缓存。您可能需要禁用它（例如 `useCdn: false`），否则重新验证将无法拉取新鲜数据以更新 ISR 缓存。当它返回 `Cache-Control` 头部时，缓存可能会发生在 CDN（对于正在被请求的端点）。
## 按需重新验证

如果您设置了一个 `revalidate` 时间为 `60`，所有访客将在同一分钟内看到您网站的相同生成版本。使缓存失效的唯一方法是在一分钟后有人访问该页面。

从 `v12.2.0` 开始，Next.js 支持按需增量静态生成，以便手动清除特定页面的 Next.js 缓存。当以下情况发生时，这使得更新您的网站变得更加容易：

- 来自您的无头 CMS 的内容被创建或更新
- 电子商务元数据发生变化（价格、描述、类别、评论等）

在 `getStaticProps` 中，您不需要指定 `revalidate` 来使用按需重新验证。如果省略了 `revalidate`，Next.js 将使用默认值 `false`（无重新验证），并且仅在调用 `revalidate()` 时按需重新验证页面。

> **须知**：[中间件](/docs/pages/building-your-application/routing/middleware) 不会为按需 ISR 请求执行。相反，您需要在您希望重新验证的 _确切_ 路径上调用 `revalidate()`。例如，如果您有 `pages/blog/[slug].js` 和一个从 `/post-1` -> `/blog/post-1` 的重写，您将需要调用 `res.revalidate('/blog/post-1')`。

### 使用按需重新验证

首先，创建一个只有您的 Next.js 应用知道的密钥令牌。这个密钥将被用来防止未经授权的访问重新验证 API 路由。您可以使用以下 URL 结构手动或通过 Webhook 访问该路由：

```bash filename="终端"
https://<your-site.com>/api/revalidate?secret=<token>
```

接下来，将密钥作为 [环境变量](/docs/pages/building-your-application/configuring/environment-variables) 添加到您的应用程序中。最后，创建重新验证 API 路由：

```js filename="pages/api/revalidate.js"
export default async function handler(req, res) {
  // 检查密钥以确认这是一个有效的请求
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // 这应该是实际路径而不是重写的路径
    // 例如，对于 "/blog/[slug]" 应该是 "/blog/post-1"
    await res.revalidate('/path-to-revalidate')
    return res.json({ revalidated: true })
  } catch (err) {
    // 如果有错误，Next.js 将继续
    // 显示最后成功生成的页面
    return res.status(500).send('Error revalidating')
  }
}
```

[查看我们的演示](https://on-demand-isr.vercel.app) 以查看按需重新验证的操作并提供反馈。

### 在开发期间测试按需 ISR

当使用 `next dev` 本地运行时，每个请求都会调用 `getStaticProps`。要验证您的按需 ISR 配置是否正确，您需要创建一个 [生产构建](/docs/pages/api-reference/next-cli#build) 并启动 [生产服务器](/docs/pages/api-reference/next-cli#production)：

```bash filename="终端"
$ next build
$ next start
```

然后，您可以确认静态页面已成功重新验证。
## 错误处理和重新验证

如果在处理后台再生时`getStaticProps`内部出现错误，或者您手动抛出错误，最后成功生成的页面将继续显示。在下一次随后的请求中，Next.js将重试调用`getStaticProps`。

```jsx
export async function getStaticProps() {
  // 如果这个请求抛出一个未捕获的错误，Next.js将
  // 不会使当前显示的页面失效，并
  // 在下一次请求中重试getStaticProps。
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  if (!res.ok) {
    // 如果有服务器错误，您可能想要
    // 抛出一个错误而不是返回，以便缓存不会更新
    // 直到下一次成功的请求。
    throw new Error(`Failed to fetch posts, received status ${res.status}`)
  }

  // 如果请求成功，返回帖子
  // 并每10秒重新验证一次。
  return {
    props: {
      posts,
    },
    revalidate: 10,
  }
}
```

## 自托管ISR

增量静态再生（ISR）在您使用`next start`时，可以在[自托管的Next.js站点](/docs/pages/building-your-application/deploying#self-hosting)中立即工作。

了解更多关于[自托管Next.js](/docs/pages/building-your-application/deploying#self-hosting)的信息。

## 版本历史

| 版本   | 变更                                                                                 |
| --------- | --------------------------------------------------------------------------------------- |
| `v14.1.0` | 自定义`cacheHandler`稳定。                                                        |
| `v12.2.0` | 按需ISR稳定                                                                 |
| `v12.1.0` | 添加了按需ISR（beta）。                                                             |
| `v12.0.0` | 添加了[Bot感知ISR回退](https://nextjs.org/blog/next-12#bot-aware-isr-fallback)。 |
| `v9.5.0`  | 添加了基本路径。                                                                        |