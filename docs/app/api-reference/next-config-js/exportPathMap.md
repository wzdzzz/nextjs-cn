---
title: exportPathMap（已弃用）
nav_title: exportPathMap
description: 使用 `next export` 时，自定义将被导出为 HTML 文件的页面。
---



> 此功能是 `next export` 的专属功能，目前为了支持 `pages` 的 `getStaticPaths` 或 `app` 的 `generateStaticParams`，已经 **弃用**。

<details>
  <summary>示例</summary>
  
- [静态导出](https://github.com/vercel/next.js/tree/canary/examples/with-static-export)

</details>

`exportPathMap` 允许您指定请求路径到页面目的地的映射，以便在导出期间使用。在 `exportPathMap` 中定义的路径在使用 [`next dev`](/docs/app/api-reference/next-cli#development) 时也将可用。

让我们通过一个示例开始，为具有以下页面的应用程序创建自定义的 `exportPathMap`：

- `pages/index.js`
- `pages/about.js`
- `pages/post.js`

打开 `next.config.js` 并添加以下 `exportPathMap` 配置：

```js filename="next.config.js"
module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    }
  },
}
```

> **须知**：`exportPathMap` 中的 `query` 字段不能与 [自动静态优化页面](/docs/pages/building-your-application/rendering/automatic-static-optimization) 或 [`getStaticProps` 页面](/docs/pages/building-your-application/data-fetching/get-static-props) 一起使用，因为它们在构建时被渲染为 HTML 文件，并且在 `next export` 期间无法提供额外的查询信息。

然后，页面将作为 HTML 文件导出，例如，`/about` 将变成 `/about.html`。

`exportPathMap` 是一个 `async` 函数，接收 2 个参数：第一个是 `defaultPathMap`，这是 Next.js 使用的默认映射。第二个参数是一个对象，包含：

- `dev` - 当在开发中调用 `exportPathMap` 时为 `true`。当运行 `next export` 时为 `false`。在开发中 `exportPathMap` 用于定义路由。
- `dir` - 项目目录的绝对路径
- `outDir` - `out/` 目录的绝对路径（可以通过 `-o` [自定义输出目录](#自定义输出目录)）。当 `dev` 为 `true` 时，`outDir` 的值将为 `null`。
- `distDir` - `.next/` 目录的绝对路径（可以通过 [`distDir`](/docs/pages/api-reference/next-config-js/distDir) 配置自定义）
- `buildId` - 生成的构建 ID

返回的对象是一个页面映射，其中 `key` 是 `pathname`，`value` 是一个对象，接受以下字段：

- `page`: `String` - 要渲染的 `pages` 目录中的页面
- `query`: `Object` - 预渲染时传递给 `getInitialProps` 的 `query` 对象。默认为 `{}`

> 导出的 `pathname` 也可以是文件名（例如，`/readme.md`），但如果它与 `.html` 不同，您可能需要在提供其内容时将 `Content-Type` 头部设置为 `text/html`。

## 添加尾随斜线

可以配置 Next.js 将页面导出为 `index.html` 文件，并要求使用尾随斜线，`/about` 变成 `/about/index.html` 并通过 `/about/` 可路由。这是 Next.js 9 之前的默认行为。

要切换回并添加尾随斜线，打开 `next.config.js` 并启用 `trailingSlash` 配置：

```js filename="next.config.js"
module.exports = {
  trailingSlash: true,
}
```
## 自定义输出目录

<AppOnly>

[`next export`](/docs/app/building-your-application/deploying/static-exports) 默认使用 `out` 作为输出目录，你可以使用 `-o` 参数自定义这个目录，如下所示：

</AppOnly>

<PagesOnly>

[`next export`](/docs/pages/building-your-application/deploying/static-exports) 默认使用 `out` 作为输出目录，你可以使用 `-o` 参数自定义这个目录，如下所示：

</PagesOnly>

```bash filename="终端"
next export -o outdir
```

> **警告**：使用 `exportPathMap` 已被弃用，并且会被 `pages` 内的 `getStaticPaths` 覆盖。我们不推荐一起使用它们。