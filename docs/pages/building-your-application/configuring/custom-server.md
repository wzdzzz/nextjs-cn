---
title: 自定义服务器
description: 使用自定义服务器启动 Next.js 应用程序。
---

<details>
  <summary>示例</summary>

- [自定义服务器](https://github.com/vercel/next.js/tree/canary/examples/custom-server)
- [SSR 缓存](https://github.com/vercel/next.js/tree/canary/examples/ssr-caching)

</details>

默认情况下，Next.js 包含了 `next start` 的自己的服务器。如果您有现有的后端，您仍然可以与 Next.js 一起使用它（这不是自定义服务器）。自定义 Next.js 服务器允许您完全以编程方式启动服务器，以便使用自定义服务器模式。大多数情况下，您不需要这个 - 但它适用于完全自定义。

> **须知**：
>
> - 在决定使用自定义服务器之前，请记住，只有在 Next.js 的集成路由器无法满足您的应用程序要求时才应使用它。自定义服务器将移除重要的性能优化，如 **无服务器函数** 和 **[自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization)**。
> - 自定义服务器 **不能** 部署在 [Vercel](https://vercel.com/solutions/nextjs) 上。
> - 独立输出模式，不跟踪自定义服务器文件，而是输出一个单独的最小 `server.js` 文件。

请查看以下自定义服务器的示例：

```js filename="server.js"
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// 当使用中间件时 `hostname` 和 `port` 必须在下面提供
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // 确保将 `true` 作为第二个参数传递给 `url.parse`。
      // 这告诉它解析 URL 的查询部分。
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('处理时发生错误', req.url, err)
      res.statusCode = 500
      res.end('内部服务器错误')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> 准备就绪，访问 http://${hostname}:${port}`)
    })
})

```

> `server.js` 不会经过 babel 或 webpack。确保此文件所需的语法和源代码与您当前运行的 Node 版本兼容。

要运行自定义服务器，您需要像这样更新 `package.json` 中的 `scripts`：

```json filename="package.json"
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}

```

---

自定义服务器使用以下导入将服务器与 Next.js 应用程序连接：

```js
const next = require('next')
const app = next({})

```
# Next.js 服务器

上述 `next` 导入是一个函数，它接收一个包含以下选项的对象：

| 选项             | 类型               | 描述                                                                                                     |
| --------------- | ------------------ | -------------------------------------------------------------------------------------------------------- |
| `conf`          | `Object`           | 与在 [next.config.js](/docs/pages/api-reference/next-config-js) 中使用的相同对象。默认为 `{}`           |
| `customServer`  | `Boolean`          | （可选）当服务器由 Next.js 创建时设置为 false                                                       |
| `dev`           | `Boolean`          | （可选）是否以开发模式启动 Next.js。默认为 `false`                                                   |
| `dir`           | `String`           | （可选）Next.js 项目的所在位置。默认为 `'.'`                                                       |
| `quiet`         | `Boolean`          | （可选）隐藏包含服务器信息的错误消息。默认为 `false`                                                |
| `hostname`      | `String`           | （可选）服务器运行的主机名                                                                       |
| `port`          | `Number`           | （可选）服务器运行的端口号                                                                       |
| `httpServer`    | `node:http#Server` | （可选）Next.js 运行的 HTTP 服务器                                                                   |

返回的 `app` 可以用于让 Next.js 按需处理请求。

## 禁用文件系统路由

默认情况下，`Next` 会为 `pages` 文件夹中的每个文件提供服务，其路径名与文件名匹配。如果您的项目使用自定义服务器，这种行为可能导致相同的内容从多个路径提供服务，这可能会对 SEO 和用户体验造成问题。

要禁用此行为并防止基于 `pages` 中的文件进行路由，请打开 `next.config.js` 并禁用 `useFileSystemPublicRoutes` 配置：

```js filename="next.config.js"
module.exports = {
  useFileSystemPublicRoutes: false,
}
```

> 须知 `useFileSystemPublicRoutes` 会禁用服务器端渲染的文件名路由；客户端路由仍然可以访问这些路径。使用此选项时，您应该防止导航到您不希望以编程方式访问的路由。

> 您可能还希望配置客户端路由器，以禁止客户端重定向到文件名路由；有关此操作，请参考 [`router.beforePopState`](/docs/pages/api-reference/functions/use-router#routerbeforepopstate)。