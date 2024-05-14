---
title: 路由基础
nav_title: 路由
description: 学习前端应用程序路由的基础知识。
---

# 路由基础

每个应用程序的骨架都是路由。本页将向您介绍 Web 路由的**基本概念**以及如何在 Next.js 中处理路由。

## 术语

首先，您将看到整个文档中使用这些术语。以下是快速参考：

<Image
  alt="组件树的术语"
  srcLight="/docs/light/terminology-component-tree.png"
  srcDark="/docs/dark/terminology-component-tree.png"
  width="1600"
  height="832"
/>

- **树（Tree）**：一种可视化层次结构的约定。例如，具有父组件和子组件的组件树，文件夹结构等。
- **子树（Subtree）**：树的一部分，从新根（第一）开始，到叶子（最后）结束。
- **根（Root）**：树或子树中的第一个节点，例如根布局。
- **叶子（Leaf）**：子树中的节点没有子节点，例如 URL 路径中的最后一个段。

<Image
  alt="URL 解剖的术语"
  srcLight="/docs/light/terminology-url-anatomy.png"
  srcDark="/docs/dark/terminology-url-anatomy.png"
  width="1600"
  height="371"
/>

- **URL 段（URL Segment）**：由斜杠分隔的 URL 路径的一部分。
- **URL 路径（URL Path）**：URL 中域名后的部分（由段组成）。

## `app` 路由器

在版本 13 中，Next.js 引入了一个新的 **App Router**，它建立在 [React Server Components](/docs/app/building-your-application/rendering/server-components) 之上，支持共享布局、嵌套路由、加载状态、错误处理等。

App Router 在名为 `app` 的新目录中工作。`app` 目录与 `pages` 目录一起工作，允许逐步采用。这允许您选择应用程序的一些路由以采用新行为，同时将其他路由保留在 `pages` 目录中以保持以前的行为。如果您的应用程序使用 `pages` 目录，请还查看 [Pages Router](/docs/pages/building-your-application/routing) 文档。

> **须知**：App Router 优先于 Pages Router。跨目录的路由不应解析为相同的 URL 路径，并会在构建时引发错误以防止冲突。

<Image
  alt="Next.js App 目录"
  srcLight="/docs/light/next-router-directories.png"
  srcDark="/docs/dark/next-router-directories.png"
  width="1600"
  height="444"
/>

默认情况下，`app` 内部的组件是 [React Server Components](/docs/app/building-your-application/rendering/server-components)。这是一种性能优化，并且可以轻松采用它们，您也可以使用 [Client Components](/docs/app/building-your-application/rendering/client-components)。

> **须知**：如果您是 Server Components 的新手，请查看 [Server](/docs/app/building-your-application/rendering/server-components) 页面。

## 文件夹和文件的角色

Next.js 使用基于文件系统的路由器，其中：

- **文件夹** 用于定义路由。路由是嵌套文件夹的单个路径，遵循从 **根文件夹** 到包含 `page.js` 文件的最终 **叶子文件夹** 的文件系统层次结构。参见 [定义路由](/docs/app/building-your-application/routing/defining-routes)。
- **文件** 用于创建显示在路由段中的 UI。参见 [特殊文件](#file-conventions)。

## 路由段

路由中的每个文件夹代表一个 **路由段**。每个路由段都映射到 URL 路径中的相应 **段**。

<Image
  alt="路由段如何映射到 URL 段"
  srcLight="/docs/light/route-segments-to-path-segments.png"
  srcDark="/docs/dark/route-segments-to-path-segments.png"
  width="1600"
  height="594"
/>

## 嵌套路由

要创建嵌套路由，您可以将文件夹相互嵌套。例如，您可以通过在 `app` 目录中嵌套两个新文件夹来添加一个新的 `/dashboard/settings` 路由。

`/dashboard/settings` 路由由三个段组成# 目录结构

Next.js 提供了一系列特殊的文件来创建具有特定行为的 UI，这些文件适用于嵌套路由：

|                                                                                           |                                                                                                |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [`layout`](/docs/app/building-your-application/routing/layouts-and-templates#layouts)     | 一个段及其子级共享的 UI                                                         |
| [`page`](/docs/app/building-your-application/routing/pages)                               | 路由的唯一 UI，并使路由公开可访问                                       |
| [`loading`](/docs/app/building-your-application/routing/loading-ui-and-streaming)         | 一个段及其子级的加载 UI                                                      |
| [`not-found`](/docs/app/api-reference/file-conventions/not-found)                         | 一个段及其子级的未找到 UI                                                    |
| [`error`](/docs/app/building-your-application/routing/error-handling)                     | 一个段及其子级的错误 UI                                                        |
| [`global-error`](/docs/app/building-your-application/routing/error-handling)              | 全局错误 UI                                                                                |
| [`route`](/docs/app/building-your-application/routing/route-handlers)                     | 服务器端 API 端点                                                                       |
| [`template`](/docs/app/building-your-application/routing/layouts-and-templates#templates) | 专门的重新渲染布局 UI                                                              |
| [`default`](/docs/app/api-reference/file-conventions/default)                             | [并行路由](/docs/app/building-your-application/routing/parallel-routes) 的后备 UI |

> **须知**：特殊文件可以使用 `.js`、`.jsx` 或 `.tsx` 文件扩展名。

## 组件层级

在路由段的特殊文件中定义的 React 组件将以特定的层级进行渲染：

- `layout.js`
- `template.js`
- `error.js`（React 错误边界）
- `loading.js`（React 挂起边界）
- `not-found.js`（React 错误边界）
- `page.js` 或嵌套的 `layout.js`

<Image
  alt="文件约定的组件层级"
  srcLight="/docs/light/file-conventions-component-hierarchy.png"
  srcDark="/docs/dark/file-conventions-component-hierarchy.png"
  width="1600"
  height="643"
/>

在嵌套路由中，一个段的组件将被嵌套在**其父段**的组件**内部**。

<Image
  alt="嵌套文件约定的组件层级"
  srcLight="/docs/light/nested-file-conventions-component-hierarchy.png"
  srcDark="/docs/dark/nested-file-conventions-component-hierarchy.png"
  width="1600"
  height="863"
/>

## 代码共置

除了特殊文件，您还可以选择将您自己的文件（例如组件、样式、测试等）共置在 `app` 目录中的文件夹内。

这是因为虽然文件夹定义了路由，但只有通过 `page.js` 或 `route.js` 返回的内容才是公开可寻址的。

<Image
  alt="带有共置文件的示例文件夹结构"
  srcLight="/docs/light/project-organization-colocation.png"
  srcDark="/docs/dark/project-organization-colocation.png"
  width="1600"
  height="1011"
/>

了解更多关于 [项目组织和代码共置](/docs/app/building-your-application/routing/colocation)。

## 高级路由模式

App Router 还提供了一组约定，帮助您实现# 高级路由模式

这些包括：

- [并行路由](/docs/app/building-your-application/routing/parallel-routes)：允许你同时在同一视图中显示两个或更多页面，并且可以独立导航。你可以使用它们来创建具有自己子导航的分屏视图。例如，仪表板。
- [拦截路由](/docs/app/building-your-application/routing/intercepting-routes)：允许你拦截一个路由，并在另一个路由的上下文中显示它。当你需要保留当前页面的上下文时，可以使用这些路由。例如，在编辑一个任务时查看所有任务，或者在信息流中展开一张照片。

这些模式允许你构建更丰富和更复杂的用户界面，使得历史上对于小团队和个人开发者来说难以实现的功能变得更加普及。

## 下一步

现在你已经了解了 Next.js 中路由的基础知识，请按照下面的链接创建你的第一个路由：