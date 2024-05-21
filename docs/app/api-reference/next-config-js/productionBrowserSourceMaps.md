---
title: 生产环境浏览器源代码映射
description: 在生产构建期间启用浏览器源代码映射的生成。
---



在开发期间，默认启用源代码映射。在生产构建中，为了防止您的源代码在客户端泄露，它们是禁用的，除非您特别使用配置标志选择启用。

Next.js 提供了一个配置标志，您可以使用它在生产构建期间启用浏览器源代码映射的生成：

```js filename="next.config.js"
module.exports = {
  productionBrowserSourceMaps: true,
}
```

当启用了 `productionBrowserSourceMaps` 选项时，源代码映射将输出在与 JavaScript 文件相同的目录中。Next.js 将在请求时自动提供这些文件。

- 添加源代码映射可以增加 `next build` 时间
- 在 `next build` 期间增加内存使用量

须知：