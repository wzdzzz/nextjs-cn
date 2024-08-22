---
title: 路由分组
description: 路由分组可用于将您的Next.js应用程序划分为不同的部分。
---
# 路由分组

在`app`目录中，嵌套文件夹通常映射到URL路径。然而，您可以将一个文件夹标记为**路由分组**，以防止文件夹被包含在路由的URL路径中。

这允许您将路由段和项目文件组织成逻辑组，而不影响URL路径结构。

路由分组适用于：

- [按网站部分、意图或团队将路由组织成组](#organize-routes-without-affecting-the-url-path)。
- 启用[同一路由段级别的嵌套布局](/docs/app/building-your-application/routing/layouts-and-templates)：
  - [在同一段中创建多个嵌套布局，包括多个根布局](#creating-multiple-root-layouts)。
  - [向共同段中的子集路由添加布局](#opting-specific-segments-into-a-layout)。

## 约定

可以通过将文件夹名称括在括号中来创建路由分组：`(folderName)`
## Examples

### 组织路由而不改变URL路径

要在不影响URL的情况下组织路由，请创建一个组来保持相关路由在一起。括号中的文件夹将从URL中省略（例如`(marketing)`或`(shop)`）。

![Organizing Routes with Route Groups](https://nextjs.org/_next/image?url=/docs/light/route-group-organisation.png&w=3840&q=75)

尽管`(marketing)`和`(shop)`内的路由共享相同的URL层次结构，但您可以通过在它们的文件夹中添加一个`layout.js`文件来为每个组创建不同的布局。

![Route Groups with Multiple Layouts](https://nextjs.org/_next/image?url=/docs/light/route-group-multiple-layouts.png&w=3840&q=75)

### 将特定段选择到布局中

要将特定路由选择到布局中，请创建一个新的路由组（例如`(shop)`），并将共享相同布局的路由移动到该组中（例如`account`和`cart`）。组外的路由将不共享布局（例如`checkout`）。

![Route Groups with Opt-in Layouts](https://nextjs.org/_next/image?url=/docs/light/route-group-opt-in-layouts.png&w=3840&q=75)

### 创建多个根布局

要创建多个[root layouts](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)，请删除顶层`layout.js`文件，并在每个路由组内添加一个`layout.js`文件。这对于将应用程序划分为具有完全不同的UI或体验的部分非常有用。需要在每个根布局中添加`<html>`和`<body>`标签。

![Route Groups with Multiple Root Layouts](https://nextjs.org/_next/image?url=/docs/light/route-group-multiple-root-layouts.png&w=3840&q=75)

在上面的示例中，`(marketing)`和`(shop)`都有自己的根布局。

---

> **须知**：
>
> - 路由组的命名除了用于组织外，没有特殊意义。它们不影响URL路径。
> - 包含路由组的路由**不应该**解析为与其他路由相同的URL路径。例如，由于路由组不影响URL结构，`(marketing)/about/page.js`和`(shop)/about/page.js`都将解析为`/about`并导致错误。
> - 如果您在没有顶层`layout.js`文件的情况下使用多个根布局，您的主页`page.js`文件应该定义在一个路由组中，例如：`app/(marketing)/page.js`。
> - 跨多个根布局导航将导致**完整页面加载**（与客户端导航相对）。例如，从使用`app/(shop)/layout.js`的`/cart`导航到使用`app/(marketing)/layout.js`的`/blog`将导致完整页面加载。这只适用于多个根布局。