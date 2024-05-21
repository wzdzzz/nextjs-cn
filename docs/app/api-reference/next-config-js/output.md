---
title: 输出文件追踪
description: Next.js 自动追踪每个页面所需的文件，以便轻松部署你的应用程序。在这里了解它是如何工作的。
---

{/* 本文档的内容在应用和页面路由器之间共享。你可以使用 `<PagesOnly>内容</PagesOnly>` 组件添加特定于页面路由器的内容。任何共享的内容都不应被包装在组件中。 */}

在构建过程中，Next.js 会自动追踪每个页面及其依赖项，以确定部署生产版本应用程序所需的所有文件。

这个特性有助于大幅减少部署的大小。以前，使用 Docker 部署时，你需要安装包的 `dependencies` 中的所有文件才能运行 `next start`。从 Next.js 12 开始，你可以利用 `.next/` 目录中的输出文件追踪，只包含必要的文件。

此外，这也消除了对已弃用的 `serverless` 目标的需求，这可能会导致各种问题，并且还会造成不必要的重复。

## 工作原理

在 `next build` 过程中，Next.js 将使用 [`@vercel/nft`](https://github.com/vercel/nft) 静态分析 `import`、`require` 和 `fs` 的使用情况，以确定页面可能加载的所有文件。

Next.js 的生产服务器也会被追踪其所需的文件，并输出到 `.next/next-server.js.nft.json`，这可以在生产中被利用。

要利用输出到 `.next` 目录的 `.nft.json` 文件，你可以读取每个追踪中相对于 `.nft.json` 文件的文件列表，然后将它们复制到你的部署位置。

## 自动复制追踪文件

Next.js 可以自动创建一个 `standalone` 文件夹，该文件夹只复制生产部署所需的必要文件，包括 `node_modules` 中的选定文件。

要利用这种自动复制，你可以在 `next.config.js` 中启用它：

```js filename="next.config.js"
module.exports = {
  output: 'standalone',
}
```

这将在 `.next/standalone` 创建一个文件夹，然后可以单独部署，而无需安装 `node_modules`。

此外，还会输出一个最小的 `server.js` 文件，可以用作 `next start` 的替代品。这个最小服务器默认不复制 `public` 或 `.next/static` 文件夹，因为这些理想情况下应该由 CDN 处理，尽管这些文件夹可以手动复制到 `standalone/public` 和 `standalone/.next/static` 文件夹，之后 `server.js` 文件将自动提供这些服务。

<AppOnly>

> **须知**：
>
> - 如果你的项目需要监听特定的端口或主机名，你可以在运行 `server.js` 之前定义 `PORT` 或 `HOSTNAME` 环境变量。例如，运行 `PORT=8080 HOSTNAME=0.0.0.0 node server.js` 在 `http://0.0.0.0:8080` 上启动服务器。
> - 如果你的项目使用默认的 `loader` 进行 [图片优化](/docs/app/building-your-application/optimizing/images)，则必须安装 `sharp` 作为依赖项：

</AppOnly>

<PagesOnly>

> **须知**：
>
> - `next.config.js` 在 `next build` 期间被读取，并序列化到 `server.js` 输出文件中。如果使用旧的 [`serverRuntimeConfig` 或 `publicRuntimeConfig` 选项](/docs/pages/api-reference/next-config-js/runtime-configuration)，这些值将在构建时特定。
> - 如果你的项目需要监听特定的端口或主机名，你可以在运行 `server.js` 之前定义 `PORT` 或 `HOSTNAME` 环境变量。例如，运行 `PORT=8080 HOSTNAME=0.0.0.0 node server.js` 在 `http://0.0.0.0:8080` 上启动服务器。
> - 如果你的项目使用默认的 `loader` 进行 [图片优化](/docs/pages/building-your-application/optimizing/images)，则必须安装 `sharp` 作为依赖项：

</PagesOnly>

```bash filename="终端"
npm i sharp
```

```bash filename="终端"
yarn add sharp
```

```bash filename="终端"
pnpm add sharp
```

```bash filename="终端"
bun add sharp
```
## 须知

- 在单仓库设置中进行跟踪时，默认使用项目目录进行跟踪。对于 `next build packages/web-app`，`packages/web-app` 将是跟踪根目录，该文件夹之外的任何文件都不会被包含。要包含此文件夹之外的文件，您可以在 `next.config.js` 中设置 `experimental.outputFileTracingRoot`。

```js filename="packages/web-app/next.config.js"
module.exports = {
  experimental: {
    // 这包括从单仓库基础向上两个目录的文件
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
}
```

- 在某些情况下，Next.js 可能无法包含所需的文件，或者可能错误地包含未使用的文件。在这些情况下，您可以分别在 `next.config.js` 中利用 `experimental.outputFileTracingExcludes` 和 `experimental.outputFileTracingIncludes`。每个配置接受一个对象，对象的键是 [minimatch globs](https://www.npmjs.com/package/minimatch)，用于匹配特定页面，值是一个数组，数组中的 globs 相对于项目根目录，用于在跟踪中包含或排除。

```js filename="next.config.js"
module.exports = {
  experimental: {
    outputFileTracingExcludes: {
      '/api/hello': ['./un-necessary-folder/**/*'],
    },
    outputFileTracingIncludes: {
      '/api/another': ['./necessary-folder/**/*'],
    },
  },
}
```

- 目前，Next.js 不会对生成的 `.nft.json` 文件进行任何操作。这些文件必须由您的部署平台读取，例如 [Vercel](https://vercel.com)，以创建最小的部署。在将来的版本中，计划引入一个新命令来利用这些 `.nft.json` 文件。

## 实验性 `turbotrace`

跟踪依赖关系可能会很慢，因为它需要非常复杂的计算和分析。我们创建了用 Rust 编写的 `turbotrace`，作为 JavaScript 实现的更快、更智能的替代方案。

要启用它，您可以在 `next.config.js` 中添加以下配置：

```js filename="next.config.js"
module.exports = {
  experimental: {
    turbotrace: {
      // 控制 turbotrace 的日志级别，默认为 `error`
      logLevel?:
      | 'bug'
      | 'fatal'
      | 'error'
      | 'warning'
      | 'hint'
      | 'note'
      | 'suggestions'
      | 'info',
      // 控制 turbotrace 日志是否应包含分析的详细信息，默认为 `false`
      logDetail?: boolean
      // 显示所有日志消息，无限制
      // turbotrace 默认每个类别只显示 1 条日志消息
      logAll?: boolean
      // 控制 turbotrace 的上下文目录
      // 上下文目录之外的文件将不会被跟踪
      // 设置 `experimental.outputFileTracingRoot` 有相同的效果
      // 如果同时设置了 `experimental.outputFileTracingRoot` 和此选项，则将使用 `experimental.turbotrace.contextDirectory`
      contextDirectory?: string
      // 如果您的代码中有 `process.cwd()` 表达式，您可以设置此选项，以在跟踪时告诉 `turbotrace` `process.cwd()` 的值。
      // 例如，require(process.cwd() + '/package.json') 将被跟踪为 require('/path/to/cwd/package.json')
      processCwd?: string
      // 控制 `turbotrace` 的最大内存使用量，单位为 `MB`，默认为 `6000`。
      memoryLimit?: number
    },
  },
}
```