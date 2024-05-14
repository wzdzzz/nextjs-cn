---
title: 打包分析器
description: 使用 @next/bundle-analyzer 插件分析你的 JavaScript 打包大小。
related:
  description: 了解更多关于为生产环境优化你的应用程序的信息。
  links:
    - app/building-your-application/deploying/production-checklist
---

[`@next/bundle-analyzer`](https://www.npmjs.com/package/@next/bundle-analyzer) 是 Next.js 的一个插件，帮助你管理 JavaScript 模块的大小。它生成每个模块及其依赖项大小的可视化报告。你可以使用这些信息来移除大型依赖项，分割你的代码，或者只在需要时加载某些部分，减少传输到客户端的数据量。

## 安装

通过运行以下命令安装插件：

```bash
npm i @next/bundle-analyzer
# 或
yarn add @next/bundle-analyzer
# 或
pnpm add @next/bundle-analyzer
```

然后，将打包分析器的设置添加到你的 `next.config.js`。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {}

const withBundleAnalyzer = require('@next/bundle-analyzer')()

module.exports =
  process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig
```

## 分析你的打包

运行以下命令来分析你的打包：

```bash
ANALYZE=true npm run build
# 或
ANALYZE=true yarn build
# 或
ANALYZE=true pnpm build
```

报告将在你的浏览器中打开三个新标签页，你可以检查它们。在开发过程中定期这样做，并在部署你的网站之前这样做，可以帮助你尽早识别大型打包，并设计你的应用程序以提高性能。