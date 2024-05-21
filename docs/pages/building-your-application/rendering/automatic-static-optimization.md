---
title: 自动静态优化
description: Next.js 会自动优化您的应用，尽可能生成静态 HTML。在这里了解它是如何工作的。
---

Next.js 会自动判断页面是否为静态（可以预渲染），如果页面没有阻塞数据需求。这种判断是通过页面中缺少 `getServerSideProps` 和 `getInitialProps` 来做出的。

这个特性允许 Next.js 发出包含**服务器渲染和静态生成页面**的混合应用程序。

> 静态生成的页面仍然是可交互的：Next.js 会在客户端激活您的应用程序，以提供完整的交互性。

这个特性的主要好处之一是，优化后的页面不需要服务器端计算，并且可以立即从多个 CDN 位置流式传输给最终用户。结果是为您的用户带来了**超快**的加载体验。

## 它是如何工作的

如果页面中存在 `getServerSideProps` 或 `getInitialProps`，Next.js 将切换到按需、按请求渲染页面（意味着[服务器端渲染](/docs/pages/building-your-application/rendering/server-side-rendering)）。

如果不是上述情况，Next.js 将通过预渲染页面到静态 HTML 来**自动静态优化**您的页面。

在预渲染期间，由于我们没有在此阶段提供 `query` 信息，因此路由器的 `query` 对象将是空的。激活后，Next.js 将触发对您的应用程序的更新，以在 `query` 对象中提供路由参数。

在激活后触发另一个渲染以更新查询的案例包括：

- 页面是[动态路由](/docs/pages/building-your-application/routing/dynamic-routes)。
- 页面在 URL 中有查询值。
- 在您的 `next.config.js` 中配置了[重写](/docs/pages/api-reference/next-config-js/rewrites)，因为这些可能需要解析并提供在 `query` 中的参数。

为了能够区分查询是否已完全更新并准备好使用，您可以利用 [`next/router`](/docs/pages/api-reference/functions/use-router#router-object) 上的 `isReady` 字段。

> **须知**：使用 [动态路由](/docs/pages/building-your-application/routing/dynamic-routes) 添加到使用 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 的页面的参数，将始终在 `query` 对象中可用。

`next build` 会为静态优化的页面发出 `.html` 文件。例如，页面 `pages/about.js` 的结果将是：

```bash filename="终端"
.next/server/pages/about.html
```

如果您向页面添加了 `getServerSideProps`，它将变成如下的 JavaScript：

```bash filename="终端"
.next/server/pages/about.js
```

## 注意事项

- 如果您有一个带有 `getInitialProps` 的[自定义 `App`](/docs/pages/building-your-application/routing/custom-app)，那么在没有[静态生成](/docs/pages/building-your-application/data-fetching/get-static-props)的页面中，这种优化将被关闭。
- 如果您有一个带有 `getInitialProps` 的[自定义 `Document`](/docs/pages/building-your-application/routing/custom-document)，请确保在假定页面是服务器端渲染之前检查 `ctx.req` 是否已定义。对于预渲染的页面，`ctx.req` 将是 `undefined`。
- 避免在路由器的 `isReady` 字段为 `true` 之前，在渲染树中使用 [`next/router`](/docs/pages/api-reference/functions/use-router#router-object) 上的 `asPath` 值。静态优化的页面只在客户端知道 `asPath` 而不是服务器端，因此将其作为属性使用可能会导致不匹配错误。[`active-class-name` 示例](https://github.com/vercel/next.js/tree/canary/examples/active-class-name)演示了一种使用 `asPath` 作为属性的方法。