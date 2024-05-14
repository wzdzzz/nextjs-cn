# 介绍

欢迎来到 Next.js 文档！

## Next.js 是什么？

Next.js 是一个用于构建全栈 Web 应用程序的 React 框架。您使用 React 组件来构建用户界面，并使用 Next.js 来提供额外的功能和优化。

在底层，Next.js 还抽象并自动配置了 React 所需的工具，如打包、编译等。这使您可以专注于构建应用程序，而不是花费时间进行配置。

无论您是个人开发者还是更大团队的一部分，Next.js 都可以帮助您构建交互式、动态和快速的 React 应用程序。

## 主要特性

一些主要的 Next.js 特性包括：

| 特性 | 描述 |
| --- | --- |
| [路由](/docs/app/building-your-application/routing) | 一个基于文件系统的路由器，构建在 Server Components 之上，支持布局、嵌套路由、加载状态、错误处理等。 |
| [渲染](/docs/app/building-your-application/rendering) | 客户端和服务器端渲染，使用客户端和服务器组件。通过 Next.js 在服务器上进一步优化静态和动态渲染。在 Edge 和 Node.js 运行时上进行流式传输。 |
| [数据获取](/docs/app/building-your-application/data-fetching) | 使用 Server Components 中的 async/await 简化数据获取，并扩展了 `fetch` API 以进行请求记忆、数据缓存和重新验证。 |
| [样式](/docs/app/building-your-application/styling) | 支持您喜欢的样式方法，包括 CSS Modules、Tailwind CSS 和 CSS-in-JS |
| [优化](/docs/app/building-your-application/optimizing) | 图片、字体和脚本优化，以改善您的应用程序的核心 Web Vitals 和用户体验。 |
| [TypeScript](/docs/app/building-your-application/configuring/typescript) | 改进了对 TypeScript 的支持，具有更好的类型检查和更高效的编译，以及自定义 TypeScript 插件和类型检查器。 |

## 如何使用这些文档

在屏幕左侧，您会找到文档导航栏。文档页面按顺序组织，从基础到高级，因此您可以在构建应用程序时按步骤跟随它们。当然，您也可以按任何顺序阅读它们，或跳到适用于您用例的页面。

在屏幕右侧，您将看到一个目录，使您更容易在页面的不同部分之间导航。如果您需要快速找到页面，可以使用顶部的搜索栏，或使用搜索快捷键（`Ctrl+K` 或 `Cmd+K`）。

要开始，请查看 [安装](/docs/getting-started/installation) 指南。

## 应用路由与页面路由

Next.js 有两种不同的路由器：应用路由器和页面路由器。应用路由器是一种较新的路由器，允许您使用 React 的最新功能，如 Server Components 和流式传输。页面路由器是原始的 Next.js 路由器，允许您构建服务器渲染的 React 应用程序，并继续支持旧版 Next.js 应用程序。

在侧边栏顶部，您会注意到一个下拉菜单，允许您在 **应用路由器** 和 **页面路由器** 特性之间切换。由于每个目录都有独特的特性，因此跟踪哪个选项卡被选中是很重要的。

页面顶部的面包屑也将会指示您正在查看应用路由器文档还是页面路由器文档。

## 先决条件知识

尽管我们的文档旨在对初学者友好，但我们需要建立一个基线，以便文档可以专注于 Next.js 功能。每当我们引入一个新概念时，我们会确保提供相关文档的链接。

为了最大限度地利用我们的文档，我们建议您对 HTML、CSS 和 React 有基本的了解。如果您需要复习 React 技能，请查看我们的 [React 基础课程](/learn/react-foundations)，它将向您介绍基础知识。然后，通过 [构建仪表板应用程序](/learn/dashboard-app) 了解更多关于 Next.js 的知识。

## 可访问性

为了在使用屏幕阅读器阅读文档时获得最佳的可访问性，我们建议使用 Firefox 和 NVDA，或 Safari 和 VoiceOver。

## 加入我们的社区

如果您对 Next.js 的任何相关内容有疑问，您总是可以在 [GitHub 讨论](https://github.com/vercel/next.js/discussions)、[Discord](https://discord.com/invite/bUG2bvbtHy)、[Twitter](https://twitter.com/nextjs) 和 [Reddit](https://www.reddit.com/r/nextjs) 上向我们的社区提问。
