---
title: 运行时
description: 了解 Next.js 中可切换的运行时（Edge 和 Node.js）。
related:
  description: 查看 Edge 运行时 API 参考。
  links:
    - app/api-reference/edge
---

# 运行时

Next.js 在您的应用程序中提供了两种服务器运行时：

- **Node.js 运行时**（默认），可以访问所有 Node.js API 和生态系统中兼容的包。
- **Edge 运行时**，包含一个更有限的 [API 集合](/docs/app/api-reference/edge)。

## 使用场景

- Node.js 运行时用于渲染您的应用程序。
- Edge 运行时用于中间件（如重定向、重写和设置头部的路由规则）。

## 注意事项

- Edge 运行时不支持所有 Node.js API。一些包将无法工作。在 [Edge 运行时](/docs/app/api-reference/edge#unsupported-apis) 中了解更多关于不支持的 API。
- Edge 运行时不支持增量静态再生（ISR）。
- 根据您的部署基础设施，两种运行时都可以支持 [流式传输](/docs/app/building-your-application/routing/loading-ui-and-streaming)。