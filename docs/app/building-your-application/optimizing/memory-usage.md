---
title: 内存使用
description: 在开发和生产中优化应用程序使用的内存。
---
# 内存使用
随着应用程序的增长和功能变得更加丰富，它们在本地开发或创建生产构建时可能会需要更多的资源。

让我们探索一些策略和技术，以优化内存并解决 Next.js 中常见的内存问题。

## 减少依赖项数量

拥有大量依赖项的应用程序将使用更多的内存。

[Bundle Analyzer](/docs/app/building-your-application/optimizing/bundle-analyzer) 可以帮助您调查应用程序中可能导致性能下降和内存使用增加的大型依赖项，这些依赖项可能可以被移除以改善性能。

## 运行带有 `--experimental-debug-memory-usage` 的 `next build`

从 `14.2.0` 版本开始，您可以运行 `next build --experimental-debug-memory-usage` 来以一种模式运行构建，在此模式下，Next.js 会在整个构建过程中持续打印有关内存使用的信息，例如堆使用情况和垃圾回收统计信息。当内存使用接近配置的限制时，还会自动拍摄堆快照。

> **须知**：此功能与 Webpack 构建工作线程选项不兼容，除非您有自定义的 webpack 配置，否则该选项会自动启用。

## 记录堆配置文件

要查找内存问题，您可以从 Node.js 记录堆配置文件并将其加载到 Chrome DevTools 中以识别潜在的内存泄漏源。

在终端中，启动 Next.js 构建时向 Node.js 传递 `--heap-prof` 标志：

```sh
node --heap-prof node_modules/next/dist/bin/next build
```

构建结束时，Node.js 将创建一个 `.heapprofile` 文件。

在 Chrome DevTools 中，您可以打开内存选项卡并点击“加载配置文件”按钮来可视化该文件。

## 分析堆的快照

您可以使用检查器工具来分析应用程序的内存使用情况。

在运行 `next build` 或 `next dev` 命令时，在命令开头添加 `NODE_OPTIONS=--inspect`。这将在默认端口上暴露检查器代理。
如果您希望在任何用户代码开始之前中断，可以改为传递 `--inspect-brk`。在进程运行时，您可以使用 Chrome DevTools 等工具连接到调试端口，记录并分析堆的快照，以查看保留了哪些内存。

从 `14.2.0` 版本开始，您还可以运行带有 `--experimental-debug-memory-usage` 标志的 `next build`，以更方便地拍摄堆快照。

在此模式下运行时，您可以在任何时候向进程发送 `SIGUSR2` 信号，进程将拍摄堆快照。

堆快照将保存到 Next.js 应用程序的项目根目录中，并且可以使用任何堆分析器（例如 Chrome DevTools）加载，以查看保留了哪些内存。此模式尚未与 Webpack 构建工作线程兼容。

有关如何记录和分析堆快照的更多信息，请参见 [如何记录和分析堆快照](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)。

## Webpack 构建工作线程

Webpack 构建工作线程允许您在一个单独的 Node.js 工作线程中运行 Webpack 编译，这将减少应用程序在构建期间的内存使用。

如果您的应用程序没有自定义 Webpack 配置，此选项将从 `v14.1.0` 开始默认启用。

如果您使用的是较旧版本的 Next.js 或者您有自定义的 Webpack 配置，您可以通过在 `next.config.js` 中设置 `experimental.webpackBuildWorker: true` 来启用此选项。

> **须知**：此功能可能与所有自定义 Webpack 插件不兼容。
## 禁用Webpack缓存

[Webpack缓存](https://webpack.js.org/configuration/cache/) 会将生成的Webpack模块保存在内存和/或磁盘中，以提高构建速度。这可以帮助提高性能，但它也会增加应用程序的内存使用量，以存储缓存的数据。

你可以通过向你的应用程序添加一个[自定义Webpack配置](/docs/app/api-reference/next-config-js/webpack)来禁用这种行为：

```js filename="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: 'memory',
      })
      config.cache.maxMemoryGenerations = 0
    }
    // 重要：返回修改后的配置
    return config
  },
}

export default nextConfig
```

## 禁用源代码映射

生成源代码映射会在构建过程中消耗额外的内存。

你可以通过在你的Next.js配置中添加 `productionBrowserSourceMaps: false` 和 `experimental.serverSourceMaps: false` 来禁用源代码映射生成。

> **须知**：一些插件可能会打开源代码映射，并且可能需要自定义配置来禁用。

## Edge内存问题

Next.js `v14.1.3` 修复了使用Edge运行时时的内存问题。请更新到这个版本（或更高版本），看看它是否解决了你的问题。