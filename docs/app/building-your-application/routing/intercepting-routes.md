---
title: 拦截路由
description: 使用拦截路由在当前布局中加载新路由，同时掩盖浏览器URL，适用于模态框等高级路由模式。
related:
  title: 下一步
  description: 学习如何使用拦截和并行路由与模态框。
  links:
    - app/building-your-application/routing/parallel-routes
---

拦截路由允许您在当前布局中从应用程序的另一部分加载路由。当您希望显示路由的内容而不希望用户切换到不同的上下文时，这种路由范例可能很有用。

例如，当您点击信息流中的一张照片时，您可以在模态框中显示该照片，覆盖信息流。在这种情况下，Next.js 拦截了 `/photo/123` 路由，掩盖了 URL，并将其覆盖在 `/feed` 上。

![拦截路由软导航](/docs/light/intercepting-routes-soft-navigate.png)

然而，当通过点击可分享的 URL 或刷新页面来导航到照片时，应该渲染整个照片页面而不是模态框。不应发生路由拦截。

![拦截路由硬导航](/docs/light/intercepting-routes-hard-navigate.png)

## 约定

拦截路由可以使用 `(..)` 约定来定义，这与相对路径约定 `../` 类似，但用于段。

您可以使用：

- `(.)` 匹配**同一级别**的段
- `(..)` 匹配**上一级**的段
- `(..)(..)` 匹配**上两级**的段
- `(...)` 匹配**根** `app` 目录的段

例如，您可以通过创建一个 `(..)photo` 目录来拦截 `feed` 段中的 `photo` 段。

![拦截路由文件夹结构](/docs/light/intercepted-routes-files.png)

> 注意，`(..)` 约定基于_路由段_，而不是文件系统。

## 示例

### 模态框

拦截路由可以与[并行路由](/docs/app/building-your-application/routing/parallel-routes)一起使用，以创建模态框。这允许您解决构建模态框时的常见挑战，例如：

- 通过 URL **共享模态框内容**。
- 页面刷新时**保留上下文**，而不是关闭模态框。
- 在后退导航时**关闭模态框**，而不是转到上一个路由。
- 在前进导航时**重新打开模态框**。

考虑以下 UI 模式，用户可以从使用客户端导航的画廊中打开照片模态框，也可以直接从可分享的 URL 导航到照片页面：

![拦截路由模态框示例](/docs/light/intercepted-routes-modal-example.png)

在上面的示例中，由于 `@modal` 是一个插槽而不是一个段，因此 `photo` 段的路径可以使用 `(..)` 匹配器。这意味着 `photo` 路由只比文件系统高一个级别，尽管它比文件系统高两个级别。

查看 [并行路由](/docs/app/building-your-application/routing/parallel-routes#modals) 文档以获取逐步示例，或查看我们的 [图片库示例](https://github.com/vercel-labs/nextgram)。

> **了解：**
>
> - 其他示例可能包括在顶部导航栏中打开登录模态框，同时拥有专用的 `/login` 页面，或在侧边模态框中打开购物车。