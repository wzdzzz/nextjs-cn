# StaleTimes（实验性）

> **警告**：`staleTimes`配置是一个实验性特性。这种配置策略在未来可能会发生变化。

`staleTimes`是一个实验性特性，它允许配置客户端路由器缓存的[失效周期](/docs/app/building-your-application/caching#duration-3)。

此配置选项自[v14.2.0](https://github.com/vercel/next.js/releases/tag/v14.2.0)起可用。

你可以通过设置实验性的`staleTimes`标志来启用这个实验性特性并提供自定义的重新验证时间：

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
}

module.exports = nextConfig
```

`static`和`dynamic`属性对应于不同类型的[链接预取](/docs/app/api-reference/components/link#prefetch)基于时间周期（以秒为单位）。

- `dynamic`属性用于当`Link`上的`prefetch`属性未指定或设置为`false`时。
  - 默认值：30秒
- `static`属性用于当`Link`上的`prefetch`属性设置为`true`，或者当调用[`router.prefetch`](/docs/app/building-your-application/caching#routerprefetch)时。
  - 默认值：5分钟

> **须知：**
>
> - [加载边界](/docs/app/api-reference/file-conventions/loading)被认为在本配置中定义的`static`期间是可重用的。
> - 这不会禁用[部分渲染支持](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，**意味着共享布局不会在每次导航时自动重新获取，只有新的段数据。**
> - 这不会改变[后退/前进缓存](/docs/app/building-your-application/caching#router-cache)行为，以防止布局偏移和防止丢失浏览器滚动位置。
> - 此配置的不同属性指的是不同级别的“活性”，与段本身选择静态或动态渲染无关。换句话说，当前`static`的默认值5分钟意味着数据由于重新验证频率低而感觉是静态的。

你可以在[这里](/docs/app/building-your-application/caching#router-cache)了解更多关于客户端路由器缓存的信息。