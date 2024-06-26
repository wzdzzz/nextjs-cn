---
title: App Router
description: 使用 Next.js 和 React 的最新功能构建应用程序，包括布局、服务器组件、Suspense 等。
---
# App Router
Next.js App Router 引入了一种新的应用程序构建模型，使用 React 的最新功能，如 [服务器组件](/docs/app/building-your-application/rendering/server-components)、[带有 Suspense 的流式传输](/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense) 和 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)。

通过 [创建你的第一个页面](/docs/app/building-your-application/routing/layouts-and-templates) 开始使用 App Router。

## 常见问题解答

### 我如何在布局中访问请求对象？

你不能直接访问原始请求对象。然而，你可以通过服务器端函数访问 [`headers`](/docs/app/api-reference/functions/headers) 和 [`cookies`](/docs/app/api-reference/functions/cookies)。你也可以 [设置 cookies](#how-can-i-set-cookies)。

[布局](/docs/app/building-your-application/routing/layouts-and-templates#layouts) 不会重新渲染。它们可以被缓存和重用，以避免在页面导航之间进行不必要的计算。通过限制布局访问原始请求，Next.js 可以防止在布局中执行可能缓慢或成本高昂的用户代码，这可能会对性能产生负面影响。

这种设计还强制执行了布局在不同页面上的一致和可预测的行为，简化了开发和调试。

根据你正在构建的 UI 模式，[并行路由](/docs/app/building-your-application/routing/parallel-routes) 允许你在同一个布局中渲染多个页面，页面可以访问路由段以及 URL 搜索参数。

### 我如何在页面上访问 URL？

默认情况下，页面是服务器组件。你可以通过 [`params`](/docs/app/api-reference/file-conventions/page#params-optional) 属性访问路由段，并通过给定页面的 [`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional) 属性访问 URL 搜索参数。

如果你使用的是客户端组件，你可以使用 [`usePathname`](/docs/app/api-reference/functions/use-pathname)、[`useSelectedLayoutSegment`](/docs/app/api-reference/functions/use-selected-layout-segment) 和 [`useSelectedLayoutSegments`](/docs/app/api-reference/functions/use-selected-layout-segments) 来处理更复杂的路由。

此外，根据你正在构建的 UI 模式，[并行路由](/docs/app/building-your-application/routing/parallel-routes) 允许你在同一个布局中渲染多个页面，页面可以访问路由段以及 URL 搜索参数。

### 我如何从服务器组件重定向？

你可以使用 [`redirect`](/docs/app/api-reference/functions/redirect) 从页面重定向到相对或绝对 URL。[`redirect`](/docs/app/api-reference/functions/redirect) 是一个临时（307）重定向，而 [`permanentRedirect`](/docs/app/api-reference/functions/permanentRedirect) 是一个永久（308）重定向。当在流式传输 UI 时使用这些函数，它们将在客户端插入一个 meta 标签以发出重定向。

### 如何使用 App Router 处理身份验证？

以下是一些支持 App Router 的常见身份验证解决方案：

- [NextAuth.js](https://next-auth.js.org/configuration/nextjs#in-app-router)
- [Clerk](https://clerk.com/docs/quickstarts/nextjs)
- [Lucia](https://lucia-auth.com/getting-started/nextjs-app)
- [Auth0](https://github.com/auth0/nextjs-auth0#app-router)
- [Stytch](https://stytch.com/docs/example-apps/frontend/nextjs)
- [Kinde](https://kinde.com/docs/developer-tools/nextjs-sdk/)
- [WorkOS](https://workos.com/docs/user-management)
- 或手动处理会话或 JWTs
## 如何设置cookies？

您可以在[服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations#cookies)或[路由处理器](/docs/app/building-your-application/routing/route-handlers)中使用[`cookies`](/docs/app/api-reference/functions/cookies)函数来设置cookies。

由于HTTP不允许在开始流式传输后设置cookies，因此您不能直接从页面或布局设置cookies。您还可以从[中间件](/docs/app/building-your-application/routing/middleware#using-cookies)中设置cookies。

## 如何构建多租户应用程序？

如果您希望构建一个服务于多个租户的单一Next.js应用程序，我们已经构建了一个示例，展示了我们推荐的架构：[多租户示例](https://vercel.com/templates/next.js/platforms-starter-kit)。

## 如何使应用路由器缓存失效？

Next.js中有多个缓存层，因此有多种方法可以失效缓存的不同部分。[了解更多关于缓存的信息](/docs/app/building-your-application/caching)。

## 是否有任何构建在应用路由器上的全面、开源应用程序？

是的。您可以查看[Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce)或[平台启动包](https://vercel.com/templates/next.js/platforms-starter-kit)，这两个使用应用路由器的更大示例是开源的。

## 了解更多

- [路由基础](/docs/app/building-your-application/routing)
- [数据获取、缓存和重新验证](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
- [表单和变异](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [缓存](/docs/app/building-your-application/caching)
- [渲染基础](/docs/app/building-your-application/rendering)
- [服务器组件](/docs/app/building-your-application/rendering/server-components)
- [客户端组件](/docs/app/building-your-application/rendering/client-components)