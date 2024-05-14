---
title: 路由分组
description: 路由分组可以将您的 Next.js 应用程序划分为不同的部分。
---

在 `app` 目录中，嵌套的文件夹通常映射为 URL 路径。然而，您可以将一个文件夹标记为 **路由分组**，以防止文件夹被包含在路由的 URL 路径中。

这允许您将路由段和项目文件组织成逻辑组，而不影响 URL 路径结构。

路由分组对于以下情况很有用：

- [将路由组织成组](#organize-routes-without-affecting-the-url-path)，例如按网站部分、意图或团队分组。
- 在同一路由段级别启用 [嵌套布局](/docs/app/building-your-application/routing/layouts-and-templates)：
  - [在同一段中创建多个嵌套布局，包括多个根布局](#creating-multiple-root-layouts)
  - [为共同段中的子集路由添加布局](#opting-specific-segments-into-a-layout)

## 约定

通过将文件夹名称用括号括起来，可以创建一个路由分组：`(folderName)`

## 示例

### 在不影响 URL 路径的情况下组织路由

要在不影响 URL 的情况下组织路由，请创建一个组以保持相关路由在一起。括号内的文件夹将从 URL 中省略（例如 `(marketing)` 或 `(shop)`）。

<Image
  alt="使用路由分组组织路由"
  srcLight="/docs/light/route-group-organisation.png"
  srcDark="/docs/dark/route-group-organisation.png"
  width="1600"
  height="930"
/>

尽管 `(marketing)` 和 `(shop)` 内的路由共享相同的 URL 层次结构，但您可以通过在它们的文件夹内添加 `layout.js` 文件，为每个组创建不同的布局。

<Image
  alt="具有多个布局的路由分组"
  srcLight="/docs/light/route-group-multiple-layouts.png"
  srcDark="/docs/dark/route-group-multiple-layouts.png"
  width="1600"
  height="768"
/>

### 选择特定段进入布局

要将特定路由选择进入布局，创建一个新的路由分组（例如 `(shop)`），并将共享相同布局的路由移动到该组中（例如 `account` 和 `cart`）。组外的路由将不共享布局（例如 `checkout`）。

<Image
  alt="具有选择性布局的路由分组"
  srcLight="/docs/light/route-group-opt-in-layouts.png"
  srcDark="/docs/dark/route-group-opt-in-layouts.png"
  width="1600"
  height="930"
/>

### 创建多个根布局

要创建多个 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)，请删除顶层的 `layout.js` 文件，并在每个路由分组内添加一个 `layout.js` 文件。这对于将应用程序划分为具有完全不同的 UI 或体验的部分非常有用。需要将 `<html>` 和 `<body>` 标签添加到每个根布局中。

<Image
  alt="具有多个根布局的路由分组"
  srcLight="/docs/light/route-group-multiple-root-layouts.png"
  srcDark="/docs/dark/route-group-multiple-root-layouts.png"
  width="1600"height="687"
/>

在上面的示例中，`(marketing)` 和 `(shop)` 都有它们自己的根布局。

---

> **须知**：
>
> - 路由组的命名没有特殊含义，仅用于组织。它们不会影响 URL 路径。
> - 包含路由组的路由**不应**解析为与其他路由相同的 URL 路径。例如，由于路由组不影响 URL 结构，`(marketing)/about/page.js` 和 `(shop)/about/page.js` 都会解析为 `/about` 并导致错误。
> - 如果您使用多个根布局而没有顶级的 `layout.js` 文件，您的主页 `page.js` 文件应该定义在其中一个路由组中，例如：`app/(marketing)/page.js`。
> - 导航**跨越多个根布局**将导致**完整的页面加载**（与客户端导航相对）。例如，从使用 `app/(shop)/layout.js` 的 `/cart` 导航到使用 `app/(marketing)/layout.js` 的 `/blog` 将导致完整的页面加载。这**仅**适用于多个根布局。