---
title: 项目组织和文件共存
nav_title: 项目组织
description: 了解如何组织你的 Next.js 项目并共存文件。
related:
  links:
    - app/building-your-application/routing/defining-routes
    - app/building-your-application/routing/route-groups
    - app/building-your-application/configuring/src-directory
    - app/building-your-application/configuring/absolute-imports-and-module-aliases
---

除了[路由文件夹和文件约定](/docs/getting-started/project-structure#app-routing-conventions)，Next.js 对你如何组织和共存项目文件是**没有意见**的。

这个页面分享了默认行为和你可以用来组织项目的特性。

- [默认安全共存](#safe-colocation-by-default)
- [项目组织特性](#project-organization-features)
- [项目组织策略](#project-organization-strategies)

## 默认安全共存

在 `app` 目录中，[嵌套的文件夹层次结构](/docs/app/building-your-application/routing#route-segments) 定义了路由结构。

每个文件夹代表一个路由段，映射到 URL 路径中的相应段。

然而，即使路由结构是通过文件夹定义的，一个路由在添加了 `page.js` 或 `route.js` 文件到路由段之前是**不公开可访问**的。

![一个图表，展示了在将 page.js 或 route.js 文件添加到路由段之前，路由不是公开可访问的。](/docs/light/project-organization-not-routable.png)

而且，即使当路由被公开访问时，只有 `page.js` 或 `route.js` 返回的**内容**会被发送到客户端。

![一个图表，展示了 page.js 和 route.js 文件如何使路由公开可访问。](/docs/light/project-organization-routable.png)

这意味着**项目文件**可以**安全地**共存于 `app` 目录中的路由段内，而不会意外地成为可路由的。

![一个图表，展示了即使在段中包含 page.js 或 route.js 文件时，共存的项目文件也是不可路由的。](/docs/light/project-organization-colocation.png)

> **须知**：
>
> - 这与 `pages` 目录不同，`pages` 中的任何文件都被视为路由。
> - 你可以在 `app` 中**共存**你的项目文件，但并不**必须**这样做。如果你更喜欢，你可以[将它们放在 `app` 目录之外](#store-project-files-outside-of-app)。

## 项目组织特性

Next.js 提供了几个特性来帮助你组织你的项目。

### 私有文件夹

可以通过在文件夹名前加上下划线来创建私有文件夹：`_folderName`

这表明该文件夹是私有的实现细节，不应被路由系统考虑，从而**选择该文件夹及其所有子文件夹**退出路由。

![使用私有文件夹的示例文件夹结构](/docs/light/project-organization-private-folders.png)

由于 `app` 目录中的文件可以[默认安全共存](#safe-colocation-by-default)，私有文件夹对于共存不是必需的。然而，它们可能对于以下情况很有用：

- 将 UI 逻辑与路由逻辑分离。
- 在项目和 Next.js 生态系统中一致地组织内部文件。
- 在代码编辑器中排序和分组文件。
- 避免与未来 Next.js 文件约定的潜在命名冲突。

> **须知**：
>
> - 虽然这不是框架约定，你也可能考虑使用相同的下划线模式将私有文件夹外的文件标记为“私有”# 项目结构

> - 你可以通过在文件夹名前缀加上 `%5F`（下划线URL编码形式）来创建以下划线开头的URL片段：`%5FfolderName`。
> - 如果你不使用私有文件夹，了解 Next.js 的[特殊文件约定](/docs/getting-started/project-structure#routing-files)以防止意外的命名冲突会很有帮助。

### 路由组

通过将文件夹用括号括起来，可以创建路由组：`(folderName)`

这表示该文件夹用于组织目的，并且**不应包含**在路由的URL路径中。

![使用路由组的示例文件夹结构](/docs/light/project-organization-route-groups.png)

路由组适用于：

- [将路由组织成组](/docs/app/building-your-application/routing/route-groups#organize-routes-without-affecting-the-url-path)，例如按网站部分、意图或团队进行分组。
- 在同一路由段级别启用嵌套布局：
  - [在同一段中创建多个嵌套布局，包括多个根布局](/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts)
  - [为共同段中的子集路由添加布局](/docs/app/building-your-application/routing/route-groups#opting-specific-segments-into-a-layout)

### `src` 目录

Next.js 支持将应用程序代码（包括 `app`）存储在可选的 [`src` 目录](/docs/app/building-your-application/configuring/src-directory) 中。这将应用程序代码与主要位于项目根目录的配置文件分开。

![带有 `src` 目录的示例文件夹结构](/docs/light/project-organization-src-directory.png)

### 模块路径别名

Next.js 支持 [模块路径别名](/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)，这使得在深度嵌套的项目文件中读取和维护导入变得更加容易。

```jsx filename="app/dashboard/settings/analytics/page.js"
// before
import { Button } from '../../../components/button'

// after
import { Button } from '@/components/button'
```

# 项目组织策略

在 Next.js 项目中组织自己的文件和文件夹没有“正确”或“错误”的方式。

以下部分列出了常见的策略的非常高层次的概述。最简单的收获是选择一个适合你和你团队的策略，并在整个项目中保持一致。

> **须知**：在我们下面的示例中，我们使用 `components` 和 `lib` 文件夹作为通用占位符，它们的命名没有特殊的框架意义，你的项目可能使用其他文件夹，如 `ui`、`utils`、`hooks`、`styles` 等。

### 将项目文件存储在 `app` 外部

这种策略将所有应用程序代码存储在项目的**根目录**中的共享文件夹中，并将 `app` 目录纯粹用于路由目的。

![将项目文件存储在 app 外部的示例文件夹结构](/docs/light/project-organization-project-root.png)

### 将项目文件存储在 `app` 内的顶级文件夹中

这种策略将所有应用程序代码存储在 `app` 目录的**根目录**中的共享文件夹中。

![将项目文件存储在 app 内的示例文件夹结构](/docs/light/project-organization-app-root.png)

### 按功能或路由拆分项目文件

这种策略将全局共享的应用程序代码存储在根 `app` 目录中，并将更具体的应用程序代码**拆分**到使用它们的路由段中。

![按功能或路由拆分的示例文件夹结构](/docs/light/project-organization-feature-routes.png)# 按功能或路由拆分的项目文件组织

![按功能或路由拆分的项目文件组织](/docs/light/project-organization-app-root-split.png)