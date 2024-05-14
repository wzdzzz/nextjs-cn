---
title: 运行时
description: 了解 Next.js 中可切换的运行时（Edge 和 Node.js）。
related:
  description: 查看 Edge 运行时 API 参考。
  links:
    - app/api-reference/edge
---

{/* 此文档的内容在 app 和 pages 路由器之间共享。您可以使用 `<PagesOnly>Content</PagesOnly>` 组件添加特定于 Pages 路由器的内容。任何共享的内容都不应被包装在组件中。 */}

Next.js 在您的应用程序中提供了两种服务器运行时：

- **Node.js 运行时**（默认），它有权访问所有 Node.js API 和生态系统中兼容的包。
- **Edge 运行时**，它包含一个更有限的 [API 集合](/docs/app/api-reference/edge)。

## 使用场景

- Node.js 运行时用于渲染您的应用程序。
- Edge 运行时用于中间件（例如重定向、重写和设置标头的路由规则）。

## 注意事项

- Edge 运行时不支持所有 Node.js API。一些包将无法工作。在 [Edge 运行时](/docs/app/api-reference/edge#unsupported-apis) 中了解更多关于不支持的 API。
- Edge 运行时不支持增量静态生成（ISR）。
- 根据您的部署基础设施，两种运行时都可以支持 [流式传输](/docs/app/building-your-application/routing/loading-ui-and-streaming)。