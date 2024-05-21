# Partial Prerendering (experimental)

> **警告**：Partial Prerendering 是一个实验性功能，目前 **不适用于生产环境**。

Partial Prerendering 是一个实验性功能，允许路由的静态部分被预先渲染并从缓存中提供，同时动态部分通过流式传输，所有这些都在单个 HTTP 请求中完成。

Partial Prerendering 可在 `next@canary` 中使用：

```bash filename="终端"
npm install next@canary
```

你可以通过设置实验性的 `ppr` 标志来启用 Partial Prerendering：

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },
}

module.exports = nextConfig
```

> **须知**：
>
> - Partial Prerendering 尚未适用于客户端导航。我们正在积极开发中。
> - Partial Prerendering 专为 [Node.js 运行时](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes) 设计。当你可以即时提供静态外壳时，不需要使用 Node.js 运行时的子集。

在 [Next.js Learn 课程](/learn/dashboard-app/partial-prerendering) 中了解更多关于 Partial Prerendering 的信息。