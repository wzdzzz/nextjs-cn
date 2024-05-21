---
title: 生产清单
description: 在将您的 Next.js 应用程序投入生产之前，确保最佳性能和用户体验的建议。
---
# 生产清单
在将您的 Next.js 应用程序投入生产之前，您应该考虑实施一些优化和模式，以获得最佳的用户体验、性能和安全性。

本页面提供了您可以在[构建应用程序](#during-development)、[投入生产前](#before-going-to-production)和[部署后](#after-deployment)时使用的的最佳实践，以及您应该了解的[自动 Next.js 优化](#automatic-optimizations)。

## 自动优化

这些 Next.js 优化默认启用，无需配置：

<AppOnly>

- **[服务器组件](/docs/app/building-your-application/rendering/server-components):** Next.js 默认使用服务器组件。服务器组件在服务器上运行，不需要 JavaScript 即可在客户端渲染。因此，它们不会影响您客户端 JavaScript 包的大小。根据需要，您可以使用[客户端组件](/docs/app/building-your-application/rendering/client-components)进行交互。
- **[代码分割](/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works):** 服务器组件通过路由段启用自动代码分割。您还可以考虑在适当的情况下[延迟加载](/docs/app/building-your-application/optimizing/lazy-loading)客户端组件和第三方库。
- **[预取](/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching):** 当新路由的链接进入用户的视口时，Next.js 会在后台预取该路由。这使得导航到新路由几乎瞬间完成。在适当的情况下，您可以选择退出预取。
- **[静态渲染](/docs/app/building-your-application/rendering/server-components#static-rendering-default):** Next.js 在构建时在服务器上静态渲染服务器和客户端组件，并缓存渲染结果以提高应用程序的性能。在适当的情况下，您可以选择[动态渲染](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)特定路由。
- **[缓存](/docs/app/building-your-application/caching):** Next.js 缓存数据请求、服务器和客户端组件的渲染结果、静态资产等，以减少对服务器、数据库和后端服务的网络请求数量。在适当的情况下，您可以选择退出缓存。

</AppOnly>

<PagesOnly>

- **[代码分割](/docs/pages/building-your-application/routing/pages-and-layouts):** Next.js 自动通过页面对应用程序代码进行代码分割。这意味着只有在导航时才会加载当前页面所需的代码。您还可以考虑在适当的情况下[延迟加载](/docs/pages/building-your-application/optimizing/lazy-loading)第三方库。
- **[预取](/docs/pages/api-reference/components/link#prefetch):** 当新路由的链接进入用户的视口时，Next.js 会在后台预取该路由。这使得导航到新路由几乎瞬间完成。在适当的情况下，您可以选择退出预取。
- **[自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization):** 如果页面没有阻塞数据需求，Next.js 自动确定页面是静态的（可以预渲染）。优化后的页面可以被缓存，并从多个 CDN 位置提供给最终用户。在适当的情况下，您可以选择[服务器端渲染](/docs/pages/building-your-application/data-fetching/get-server-side-props)。

</PagesOnly>

这些默认设置旨在提高您的应用程序性能，并减少每次网络请求的成本和数据传输量。
# 在开发中

在构建应用程序时，我们建议您使用以下功能以确保最佳性能和用户体验：

### 路由和渲染

<AppOnly>

- **[布局](/docs/app/building-your-application/routing/layouts-and-templates#layouts):** 使用布局在页面之间共享UI，并在导航上启用[部分渲染](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)。
- **[`<Link>` 组件](/docs/app/building-your-application/routing/linking-and-navigating#link-component):** 使用 `<Link>` 组件进行[客户端导航和预取](/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)。
- **[错误处理](/docs/app/building-your-application/routing/error-handling):** 通过创建自定义错误页面，优雅地处理生产中的[全局错误](/docs/app/building-your-application/routing/error-handling)和[404错误](/docs/app/api-reference/file-conventions/not-found)。
- **[组合模式](/docs/app/building-your-application/rendering/composition-patterns):** 遵循服务器和客户端组件的推荐组合模式，并检查你的[`"use client"` 边界](/docs/app/building-your-application/rendering/composition-patterns#moving-client-components-down-the-tree)的放置，以避免不必要地增加你的客户端JavaScript捆绑包。
- **[动态函数](/docs/app/building-your-application/rendering/server-components#dynamic-functions):** 请注意，像 [`cookies()`](/docs/app/api-reference/functions/cookies) 和 [`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional) prop 这样的动态函数将使整个路由进入[动态渲染](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)（或者如果在整个应用程序中使用，则是你的整个应用程序[根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)）。确保动态函数的使用是有意的，并在适当的地方用 `<Suspense>` 边界包装它们。

> **须知**：[部分预渲染（实验性）](/blog/next-14#partial-prerendering-preview) 将允许路由的部分是动态的，而不必使整个路由进入动态渲染。

</AppOnly>

<PagesOnly>

- **[`<Link>` 组件](/docs/pages/building-your-application/routing/linking-and-navigating):** 使用 `<Link>` 组件进行客户端导航和预取。
- **[自定义错误](/docs/pages/building-your-application/routing/custom-error):** 优雅地处理[500](/docs/pages/building-your-application/routing/custom-error#500-page)和[404错误](/docs/pages/building-your-application/routing/custom-error#404-page)

</PagesOnly>
### 数据获取与缓存

<AppOnly>

- **[服务器组件](/docs/app/building-your-application/data-fetching/patterns#fetching-data-on-the-server):** 利用服务器组件在服务器上获取数据的优势。
- **[路由处理器](/docs/app/building-your-application/routing/route-handlers):** 使用路由处理器从客户端组件访问后端资源。但不要从服务器组件调用路由处理器，以避免额外的服务器请求。
- **[流式传输](/docs/app/building-your-application/routing/loading-ui-and-streaming):** 使用加载UI和React Suspense逐步从服务器向客户端发送UI，并防止整个路由在获取数据时阻塞。
- **[并行数据获取](/docs/app/building-your-application/data-fetching/patterns#parallel-and-sequential-data-fetching):** 通过并行获取数据来减少网络瀑布效应，适当情况下也要考虑[预加载数据](/docs/app/building-your-application/data-fetching/patterns#preloading-data)。
- **[数据缓存](/docs/app/building-your-application/caching#data-cache):** 验证您的数据请求是否被缓存，并在适当情况下选择缓存。确保不使用`fetch`的请求被[缓存](/docs/app/api-reference/functions/unstable_cache)。
- **[静态图片](/docs/app/building-your-application/optimizing/static-assets):** 使用`public`目录自动缓存您的应用程序的静态资源，例如图片。

</AppOnly>

<PagesOnly>

- **[API路由](/docs/pages/building-your-application/routing/api-routes):** 使用路由处理器访问您的后端资源，并防止敏感密钥暴露给客户端。
- **[数据缓存](/docs/pages/building-your-application/data-fetching/get-static-props):** 验证您的数据请求是否被缓存，并在适当情况下选择缓存。确保不使用`getStaticProps`的请求在适当情况下被缓存。
- **[增量静态再生](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration):** 使用增量静态再生在构建静态页面后更新它们，而不需要重建整个站点。
- **[静态图片](/docs/pages/building-your-application/optimizing/static-assets):** 使用`public`目录自动缓存您的应用程序的静态资源，例如图片。

</PagesOnly>

### UI与可访问性

<AppOnly>

- **[表单和验证](/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms):** 使用服务器操作处理表单提交、服务器端验证和错误处理。

</AppOnly>

- **[字体模块](/docs/app/building-your-application/optimizing/fonts):** 通过使用字体模块优化字体，它会自动托管您的字体文件与其他静态资源，减少外部网络请求，并减少[布局偏移](https://web.dev/articles/cls)。
- **[`<Image>`组件](/docs/app/building-your-application/optimizing/images):** 通过使用Image组件优化图片，它会自动优化图片，防止布局偏移，并以WebP或AVIF等现代格式提供服务。
- **[`<Script>`组件](/docs/app/building-your-application/optimizing/scripts):** 通过使用Script组件优化第三方脚本，它会自动延迟脚本并防止它们阻塞主线程。
- **[ESLint](/docs/architecture/accessibility#linting):** 使用内置的`eslint-plugin-jsx-a11y`插件尽早捕捉可访问性问题。
# 安全

<AppOnly>

- **[数据污染](/docs/app/building-your-application/data-fetching/patterns#防止敏感数据暴露给客户端):** 通过污染数据对象和/或特定值，防止敏感数据暴露给客户端。
- **[服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations#认证和授权):** 确保用户被授权调用服务器操作。查看推荐的[安全实践](/blog/security-nextjs-server-components-actions)。

</AppOnly>

- **[环境变量](/docs/app/building-your-application/configuring/environment-variables):** 确保你的 `.env.*` 文件被添加到 `.gitignore` 中，并且只有公共变量以 `NEXT_PUBLIC_` 为前缀。
- **[内容安全策略](/docs/app/building-your-application/configuring/content-security-policy):** 考虑添加内容安全策略，以保护你的应用程序免受各种安全威胁，如跨站脚本攻击、点击劫持和其他代码注入攻击。

# 元数据和SEO

<AppOnly>

- **[元数据API](/docs/app/building-your-application/optimizing/metadata):** 使用元数据API通过添加页面标题、描述等来改善你的应用程序的搜索引擎优化（SEO）。
- **[开放图谱（OG）图片](/docs/app/api-reference/file-conventions/metadata/opengraph-image):** 创建OG图片，为社交分享准备你的应用程序。
- **[站点地图](/docs/app/api-reference/functions/generate-sitemaps)和[机器人](/docs/app/api-reference/file-conventions/metadata/robots):** 通过生成站点地图和机器人文件，帮助搜索引擎爬取和索引你的页面。

</AppOnly>

<PagesOnly>

- **[`<Head>` 组件](/docs/pages/api-reference/components/head):** 使用 `next/head` 组件来添加页面标题、描述等。

</PagesOnly>


# 类型安全

- **TypeScript和[TS插件](/docs/app/building-your-application/configuring/typescript):** 使用TypeScript和TypeScript插件来提高类型安全性，并帮助你尽早发现错误。

# 上线前须知

在上线前，你可以运行 `next build` 来本地构建你的应用程序并捕捉任何构建错误，然后运行 `next start` 来衡量你的应用程序在类似生产环境中的性能。

# 核心网络指标

- **[Lighthouse](https://developers.google.com/web/tools/lighthouse):** 在隐身模式下运行Lighthouse，以更好地了解用户将如何体验你的网站，并确定改进的领域。这是一个模拟测试，应该与查看现场数据（如核心网络指标）配对。

<AppOnly>

- **[`useReportWebVitals` 钩子](/docs/app/api-reference/functions/use-report-web-vitals):** 使用此钩子将[核心网络指标](https://web.dev/articles/vitals)数据发送到分析工具。

</AppOnly>

# 分析捆绑包

使用 [`@next/bundle-analyzer` 插件](/docs/app/building-your-application/optimizing/bundle-analyzer) 来分析你的JavaScript捆绑包的大小，并识别可能影响你的应用程序性能的大型模块和依赖项。

此外，以下工具可以帮助你了解添加新依赖项到你的应用程序的影响：

- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [Package Phobia](https://packagephobia.com/)
- [Bundle Phobia](https://bundlephobia.com/)
- [bundlejs](https://bundlejs.com/)
## 部署后

根据您部署应用程序的位置，您可能可以访问其他工具和集成，以帮助您监控和改善应用程序的性能。

对于 Vercel 部署，我们建议以下内容：

- **[分析](https://vercel.com/analytics?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs)：** 一个内置的分析仪表板，帮助您了解应用程序的流量，包括独立访客数量、页面浏览量等。
- **[速度洞察](https://vercel.com/docs/speed-insights?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs)：** 基于访客数据的实际性能洞察，提供您的网站在实际使用中的性能的实用视角。
- **[日志记录](https://vercel.com/docs/observability/runtime-logs?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs)：** 运行时和活动日志，帮助您调试问题并监控生产中的应用程序。或者，查看 [集成页面](https://vercel.com/integrations?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs) 以获取第三方工具和服务的列表。

> **须知：**
>
> 要全面了解 Vercel 上生产部署的最佳实践，包括改善网站性能的详细策略，请参考 [Vercel 生产检查清单](https://vercel.com/docs/production-checklist?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs)。

遵循这些建议将帮助您为您的用户构建更快、更可靠、更安全的应用程序。