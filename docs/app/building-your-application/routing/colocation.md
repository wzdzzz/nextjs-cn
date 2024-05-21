# 项目组织和文件共置

除了[路由文件夹和文件约定](/docs/getting-started/project-structure#app-routing-conventions)，Next.js 对于如何组织和共置项目文件是**没有意见**的。

这个页面分享了默认行为和可以用来组织项目的特性。

- [默认安全共置](#默认安全共置)
- [项目组织特性](#项目组织特性)
- [项目组织策略](#项目组织策略)

## 默认安全共置

在 `app` 目录中，[嵌套文件夹层次结构](/docs/app/building-your-application/routing#route-segments)定义了路由结构。

每个文件夹代表一个路由段，映射到URL路径中的相应段。

然而，即使路由结构是通过文件夹定义的，一个路由**不是公开可访问**的，直到向路由段添加了 `page.js` 或 `route.js` 文件。

![一个图表显示了在向路由段添加page.js或route.js文件之前，路由不是公开可访问的](/docs/light/project-organization-not-routable.png)

而且，即使路由被公开访问，也只有 `page.js` 或 `route.js` 返回的**内容**被发送到客户端。

![一个图表显示了page.js和route.js文件如何使路由公开可访问](/docs/light/project-organization-routable.png)

这意味着**项目文件**可以在 `app` 目录中的路由段内**安全地共置**，而不会被意外地路由。

![一个图表显示了共置的项目文件即使在段包含page.js或route.js文件时也不是可路由的](/docs/light/project-organization-colocation.png)

> **须知**：
>
> - 这与 `pages` 目录不同，`pages` 中的任何文件都被视为路由。
> - 你**可以**在 `app` 中共置你的项目文件，但**不必**这么做。如果你愿意，你可以[将它们放在 `app` 目录之外](#store-project-files-outside-of-app)。
# Project organization features

Next.js提供了多种功能来帮助您组织项目。

### 私有文件夹

通过在文件夹名前加上下划线，可以创建私有文件夹：`_folderName`

这表示该文件夹是一个私有的实现细节，不应被路由系统考虑，从而**使该文件夹及其所有子文件夹退出路由**。

![使用私有文件夹的示例文件夹结构](/docs/light/project-organization-private-folders.png)

由于`app`目录中的文件默认可以[安全地共存](#safe-colocation-by-default)，因此不需要私有文件夹来进行共存。然而，它们可能对以下情况很有用：

- 将UI逻辑与路由逻辑分开。
- 在整个项目和Next.js生态系统中一致地组织内部文件。
- 在代码编辑器中对文件进行排序和分组。
- 避免与未来Next.js文件约定的潜在命名冲突。

> **须知**
>
> - 虽然这不是框架约定，您也可以考虑使用相同的下划线模式将私有文件夹外的文件标记为“私有”。
> - 您可以通过在文件夹名前加上`%5F`（下划线URL编码形式）来创建以下划线开头的URL段：`%5FfolderName`。
> - 如果您不使用私有文件夹，了解Next.js的[特殊文件约定](/docs/getting-started/project-structure#routing-files)以防止意外的命名冲突将会很有帮助。

### 路由组

通过将文件夹括在括号中，可以创建路由组：`(folderName)`

这表示该文件夹用于组织目的，**不应包含**在路由的URL路径中。

![使用路由组的示例文件夹结构](/docs/light/project-organization-route-groups.png)

路由组很有用，用于：

- [将路由组织成组](/docs/app/building-your-application/routing/route-groups#organize-routes-without-affecting-the-url-path)，例如按网站部分、意图或团队。
- 在同一路由段级别启用嵌套布局：
  - [在同一段中创建多个嵌套布局，包括多个根布局](/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts)
  - [为公共段中的子集路由添加布局](/docs/app/building-your-application/routing/route-groups#opting-specific-segments-into-a-layout)

### `src`目录

Next.js支持将应用程序代码（包括`app`）存储在可选的[`src`目录](/docs/app/building-your-application/configuring/src-directory)中。这将应用程序代码与主要位于项目根目录的大多数项目配置文件分开。

![带有`src`目录的示例文件夹结构](/docs/light/project-organization-src-directory.png)

### 模块路径别名

Next.js支持[模块路径别名](/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)，这使得在深度嵌套的项目文件中读取和维护导入变得更加容易。

```jsx filename="app/dashboard/settings/analytics/page.js"
// before
import { Button } from '../../../components/button'

// after
import { Button } from '@/components/button'
```
# 项目组织策略

在Next.js项目中组织自己的文件和文件夹没有“正确”或“错误”的方式。

以下部分列出了常见策略的非常高层次的概述。最简单的收获是选择一个适合您和您的团队的策略，并在整个项目中保持一致。

> **须知**：在我们下面的例子中，我们使用`components`和`lib`文件夹作为通用占位符，它们的命名没有特别的框架意义，您的项目可能会使用其他文件夹，如`ui`、`utils`、`hooks`、`styles`等。

### 在`app`之外存储项目文件

这种策略将所有应用程序代码存储在**项目根目录**的共享文件夹中，并将`app`目录纯粹用于路由目的。

![An example folder structure with project files outside of app](/docs/light/project-organization-project-root.png)

### 在`app`内的顶级文件夹中存储项目文件

这种策略将所有应用程序代码存储在**`app`目录的根目录**的共享文件夹中。

![An example folder structure with project files inside app](/docs/light/project-organization-app-root.png)

### 按功能或路由拆分项目文件

这种策略将全局共享的应用程序代码存储在根`app`目录中，并将更具体的应用程序代码**拆分**到使用它们的路由段中。

![An example folder structure with project files split by feature or route](/docs/light/project-organization-app-root-split.png)