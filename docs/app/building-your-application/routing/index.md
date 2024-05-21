# Routing Fundamentals

路由是每个应用程序的骨架。本页将向您介绍网络路由的**基本概念**以及如何在Next.js中处理路由。

## 术语

首先，您将看到这些术语在文档中被使用。这里有一个快速参考：

![Component Tree的术语](/docs/light/terminology-component-tree.png)

- **树(Tree)**: 可视化层次结构的惯例。例如，具有父组件和子组件的组件树，文件夹结构等。
- **子树(Subtree)**: 从新根（第一）开始到叶子（最后）结束的树的一部分。
- **根(Root)**: 树或子树中的第一个节点，例如根布局。
- **叶子(Leaf)**: 在子树中没有子节点的节点，例如URL路径中的最后一个段。

![URL解剖学的术语](/docs/light/terminology-url-anatomy.png)

- **URL段(URL Segment)**: 由斜杠分隔的URL路径的一部分。
- **URL路径(URL Path)**: 位于域之后的URL部分（由段组成）。

## `app`路由器

在版本13中，Next.js引入了一个新的**App路由器**，它建立在[React Server Components](/docs/app/building-your-application/rendering/server-components)之上，支持共享布局、嵌套路由、加载状态、错误处理等。

App路由器在名为`app`的新目录中工作。`app`目录与`pages`目录一起工作，允许逐步采用。这使您可以选择应用程序中的一些路由采用新的行为，同时保持`pages`目录中的其他路由以之前的行为。如果您的应用程序使用`pages`目录，请同时查看[Pages Router](/docs/pages/building-your-application/routing)文档。

> **须知**: App路由器优先于Pages路由器。跨目录的路由不应解析为相同的URL路径，并将导致构建时错误以防止冲突。

![Next.js App目录](/docs/light/next-router-directories.png)

默认情况下，`app`内部的组件是[React Server Components](/docs/app/building-your-application/rendering/server-components)。这是一种性能优化，并允许您轻松采用它们，您也可以使用[Client Components](/docs/app/building-your-application/rendering/client-components)。

> **推荐**: 如果您是Server Components的新手，请查看[Server](/docs/app/building-your-application/rendering/server-components)页面。

## 文件夹和文件的角色

Next.js使用基于文件系统的路由器，其中：

- **文件夹**用于定义路由。路由是嵌套文件夹的单个路径，遵循从**根文件夹**到最终**叶子文件夹**的文件系统层次结构，该叶子文件夹包括一个`page.js`文件。请参阅[定义路由](/docs/app/building-your-application/routing/defining-routes)。
- **文件**用于创建显示在路由段的UI。请参阅[特殊文件](#file-conventions)。

## 路由段

路由中的每个文件夹代表一个**路由段**。每个路由段都映射到URL路径中的相应**段**。

![路由段如何映射到URL段](/docs/light/route-segments-to-path-segments.png)
# Nested Routes

要创建一个嵌套路由，你可以将文件夹相互嵌套。例如，你可以通过在`app`目录中嵌套两个新文件夹来添加一个新的`/dashboard/settings`路由。

`/dashboard/settings`路由由三个部分组成：

- `/`（根部分）
- `dashboard`（部分）
- `settings`（叶子部分）

## 文件约定

Next.js 提供了一组特殊文件来创建具有特定行为的嵌套路由的UI：

|                                                                                           |                                                                                                |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [`layout`](/docs/app/building-your-application/routing/layouts-and-templates#layouts)     | 一个部分及其子部分的共享UI                                                       |
| [`page`](/docs/app/building-your-application/routing/pages)                               | 路由的唯一UI，并使路由公开可访问                                       |
| [`loading`](/docs/app/building-your-application/routing/loading-ui-and-streaming)         | 一个部分及其子部分的加载UI                                                      |
| [`not-found`](/docs/app/api-reference/file-conventions/not-found)                         | 一个部分及其子部分的未找到UI                                                    |
| [`error`](/docs/app/building-your-application/routing/error-handling)                     | 一个部分及其子部分的错误UI                                                        |
| [`global-error`](/docs/app/building-your-application/routing/error-handling)              | 全局错误UI                                                                                |
| [`route`](/docs/app/building-your-application/routing/route-handlers)                     | 服务器端API端点                                                                       |
| [`template`](/docs/app/building-your-application/routing/layouts-and-templates#templates) | 专门的重新渲染布局UI                                                              |
| [`default`](/docs/app/api-reference/file-conventions/default)                             | [并行路由](/docs/app/building-your-application/routing/parallel-routes)的回退UI |

> **须知**：特殊文件可以使用`.js`、`.jsx`或`.tsx`文件扩展名。

## 组件层次结构

在路由部分的特殊文件中定义的React组件将以特定的层次结构进行渲染：

- `layout.js`
- `template.js`
- `error.js`（React错误边界）
- `loading.js`（React挂起边界）
- `not-found.js`（React错误边界）
- `page.js`或嵌套的`layout.js`

![Component Hierarchy for File Conventions](/docs/light/file-conventions-component-hierarchy.png)

在嵌套路由中，一个部分的组件将被嵌套**在**其父部分的组件**里面**。

![Nested File Conventions Component Hierarchy](/docs/light/nested-file-conventions-component-hierarchy.png)
# Colocation

除了特殊文件，您还可以选择将您自己的文件（例如组件、样式、测试等）放置在`app`目录中的文件夹内。

这是因为虽然文件夹定义了路由，但只有通过`page.js`或`route.js`返回的内容才是公开可访问的。

![一个带有共位文件的示例文件夹结构](/docs/light/project-organization-colocation.png)

了解更多关于[项目组织和共位](/docs/app/building-your-application/routing/colocation)。

# Advanced Routing Patterns

App Router还提供了一套约定，帮助您实现更高级的路由模式。这些包括：

- [并行路由](/docs/app/building-your-application/routing/parallel-routes)：允许您在同一视图中同时显示两个或更多页面，并且可以独立导航。您可以将它们用于具有自己子导航的拆分视图。例如，仪表板。
- [拦截路由](/docs/app/building-your-application/routing/intercepting-routes)：允许您拦截一个路由并在另一个路由的上下文中显示它。当保持当前页面的上下文很重要时，您可以使用这些路由。例如，在编辑一个任务时查看所有任务，或在动态中展开一张照片。

这些模式允许您构建更丰富和更复杂的UI，使那些历史上对于小团队和个人开发者来说难以实现的功能民主化。

# Next Steps

现在您已经了解了Next.js路由的基础知识，请按照下面的链接创建您的第一条路由：