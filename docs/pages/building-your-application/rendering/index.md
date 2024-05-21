---
title: 渲染
description: 学习 React 和 Next.js 中渲染的基础知识。
---

默认情况下，Next.js **预渲染**每个页面。这意味着 Next.js 会提前为每个页面生成 HTML，而不是完全由客户端 JavaScript 完成。预渲染可以带来更好的性能和搜索引擎优化（SEO）。

每个生成的 HTML 都与该页面所需的最小 JavaScript 代码相关联。当浏览器加载页面时，其 JavaScript 代码运行并使页面完全交互式（在 React 中，这个过程称为[hydration](https://react.dev/reference/react-dom/client/hydrateRoot)）。

### 预渲染

Next.js 有两种预渲染形式：**静态生成**和**服务器端渲染**。区别在于它**何时**为页面生成 HTML。

- 静态生成：HTML 在**构建时**生成，并且将在每次请求中重复使用。
- 服务器端渲染：HTML 在**每次请求**时生成。

重要的是，Next.js 允许你选择为每个页面使用哪种预渲染形式。你可以通过为大多数页面使用静态生成，为其他页面使用服务器端渲染，来创建一个“混合”的 Next.js 应用程序。

出于性能原因，我们建议使用静态生成而不是服务器端渲染。静态生成的页面可以由 CDN 缓存，无需额外配置即可提高性能。然而，在某些情况下，服务器端渲染可能是唯一的选择。

你还可以在静态生成或服务器端渲染的同时使用客户端数据获取。这意味着页面的某些部分可以完全由客户端 JavaScript 渲染。要了解更多信息，请查看[数据获取](/docs/pages/building-your-application/data-fetching/client-side)文档。