---
title: TypeScript
description: Next.js 默认报告 TypeScript 错误。在这里学习如何退出此行为。
---

{/* 本文档的内容在应用和页面路由器之间共享。您可以使用 `<PagesOnly>内容</PagesOnly>` 组件添加特定于页面路由器的内容。任何共享的内容都不应被包装在组件中。 */}

当项目中存在 TypeScript 错误时，Next.js 会使您的 **生产构建** (`next build`) 失败。

如果您希望 Next.js 即使在应用程序有错误时也冒险生成生产代码，您可以禁用内置的类型检查步骤。

如果禁用了，请确保您在构建或部署过程中运行类型检查，否则这可能非常危险。

打开 `next.config.js` 并在 `typescript` 配置中启用 `ignoreBuildErrors` 选项：

```js filename="next.config.js"
module.exports = {
  typescript: {
    // !! 警告 !!
    // 允许生产构建即使
    // 您的项目有类型错误也能成功完成。
    // !! 警告 !!
    ignoreBuildErrors: true,
  },
}
```