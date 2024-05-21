---
title: instrumentationHook
description: 使用 instrumentationHook 选项在您的 Next.js 应用中设置监控。
related:
  title: 了解更多关于监控
  links:
    - app/api-reference/file-conventions/instrumentation
    - app/building-your-application/optimizing/instrumentation
---

{/* 本文档的内容在应用和页面路由之间共享。您可以使用 `<PagesOnly>Content</PagesOnly>` 组件添加特定于页面路由的内容。任何共享内容都不应被包装在组件中。 */}

实验性的 `instrumentationHook` 选项允许您通过 [`instrumentation` 文件](/docs/app/api-reference/file-conventions/instrumentation) 在您的 Next.js 应用中设置监控。

```js filename="next.config.js"
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
}
```