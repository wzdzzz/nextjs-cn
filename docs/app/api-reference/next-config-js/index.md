---
title: next.config.js 配置选项
description: 学习如何通过 next.config.js 配置你的应用程序。
---



Next.js 可以通过项目目录根（例如，`package.json` 旁边）的 `next.config.js` 文件进行配置，默认导出。

```js filename="next.config.js"
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* 配置选项在这里 */
}

module.exports = nextConfig
```

`next.config.js` 是一个常规的 Node.js 模块，而不是一个 JSON 文件。它被 Next.js 服务器和构建阶段使用，并且不会被包含在浏览器构建中。

如果你需要 [ECMAScript 模块](https://nodejs.org/api/esm.html)，你可以使用 `next.config.mjs`：

```js filename="next.config.mjs"
// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* 配置选项在这里 */
}

export default nextConfig
```

你也可以使用一个函数：

```js filename="next.config.mjs"
// @ts-check

export default (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* 配置选项在这里 */
  }
  return nextConfig
}
```

自 Next.js 12.1.0 起，你可以使用一个异步函数：

```js filename="next.config.js"
// @ts-check

module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* 配置选项在这里 */
  }
  return nextConfig
}
```

`phase` 是配置加载的当前上下文。你可以查看 [可用的阶段](https://github.com/vercel/next.js/blob/5e6b008b561caf2710ab7be63320a3d549474a5b/packages/next/shared/lib/constants.ts#L19-L23)。阶段可以从 `next/constants` 导入：

```js
// @ts-check

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* 仅开发环境的配置选项在这里 */
    }
  }

  return {
    /* 除开发环境外所有阶段的配置选项在这里 */
  }
}
```

注释行是你放置 `next.config.js` 允许的配置的地方，这些配置 [在此文件中定义](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/config-shared.ts)。

然而，并不要求所有的配置，也没有必要理解每个配置的作用。相反，搜索你需要启用或修改的功能，它们会告诉你该怎么做。

> 避免使用在目标 Node.js 版本中不可用的新 JavaScript 特性。`next.config.js` 不会被 Webpack、Babel 或 TypeScript 解析。

本页面记录了所有可用的配置选项：