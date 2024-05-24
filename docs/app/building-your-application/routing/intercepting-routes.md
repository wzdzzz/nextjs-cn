# 拦截路由

拦截路由允许您在当前布局中从应用程序的另一部分加载路由。当您希望显示路由的内容而用户不需要切换到不同的上下文时，这种路由范例可能很有用。

例如，当点击动态中的一张照片时，您可以在模态框中显示该照片，覆盖动态。在这种情况下，Next.js 拦截了 `/photo/123` 路由，隐藏了 URL，并将其覆盖在 `/feed` 上。

![拦截路由软导航](https://nextjs.org/_next/image?url=/docs/light/intercepting-routes-soft-navigate.png&w=3840&q=75)

然而，通过点击可共享的 URL 或刷新页面来浏览照片时，应该渲染整个照片页面而不是模态框。不应该发生路由拦截。

![拦截路由硬导航](https://nextjs.org/_next/image?url=/docs/light/intercepting-routes-hard-navigate.png&w=3840&q=75)

## 约定

拦截路由可以使用 `(..)` 约定来定义，这类似于相对路径约定 `../`，但用于段。

您可以使用：

- `(.)` 匹配 **同一级别** 的段
- `(..)` 匹配 **上一级** 的段
- `(..)(..)` 匹配 **上两级** 的段
- `(...)` 匹配从 **根** `app` 目录的段

例如，您可以通过创建 `(..)photo` 目录来拦截 `feed` 段中的 `photo` 段。

![拦截路由文件夹结构](https://nextjs.org/_next/image?url=/docs/light/intercepted-routes-files.png&w=3840&q=75)

> 注意，`(..)` 约定基于 _路由段_，而不是文件系统。

## 示例

### 模态框

拦截路由可以与 [并行路由](/docs/app/building-your-application/routing/parallel-routes) 一起使用来创建模态框。这允许您解决构建模态框时的常见挑战，例如：

- 通过 URL **共享模态框内容**。
- 页面刷新时 **保留上下文**，而不是关闭模态框。
- 在向后导航时 **关闭模态框**，而不是转到上一个路由。
- 在向前导航时 **重新打开模态框**。

考虑以下 UI 模式，用户可以从画廊中使用客户端导航打开照片模态框，或者直接从可共享的 URL 导航到照片页面：

![拦截路由模态框示例](https://nextjs.org/_next/image?url=/docs/light/intercepted-routes-modal-example.png&w=3840&q=75)

在上面的示例中，由于 `@modal` 是一个插槽而 **不是** 一个段，因此 `photo` 段的路径可以使用 `(..)` 匹配器。这意味着尽管 `photo` 路由在文件系统上高两个级别，但它只比一个段级别高。

请参阅 [并行路由](/docs/app/building-your-application/routing/parallel-routes#modals) 文档了解逐步示例，或查看我们的 [图片画廊示例](https://github.com/vercel-labs/nextgram)。

> **须知：**
>
> - 其他示例可能包括在顶部导航栏中打开登录模态框，同时还有一个专用的 `/login` 页面，或者在侧边栏中打开购物车模态框。