---
title: bundlePagesRouterDependencies
description: 为 Pages Router 启用自动依赖打包
---

为 Pages Router 应用程序启用自动服务器端依赖打包。与 App Router 中的自动依赖打包相匹配。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  bundlePagesRouterDependencies: true,
}

module.exports = nextConfig
```

使用 [`serverExternalPackages`](/docs/pages/api-reference/next-config-js/serverExternalPackages) 选项明确选择某些包不被打包。

---

须知：如果遇到 AppOnly 和 PagesOnly 标签，不做任何处理。