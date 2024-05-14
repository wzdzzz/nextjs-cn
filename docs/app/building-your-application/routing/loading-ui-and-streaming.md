---
title: 加载 UI 和流式传输
description: 加载 UI 建立在 Suspense 之上，允许您为特定路由段创建回退，并在内容准备好时自动流式传输内容。
---

特殊的 `loading.js` 文件帮助您使用 [React Suspense](https://react.dev/reference/react/Suspense) 创建有意义的加载 UI。通过这种约定，您可以在路由段的内容加载时从服务器显示 [即时加载状态](#即时加载状态)。一旦渲染完成，新内容将自动替换进去。

<Image
  alt="加载 UI"
  srcLight="/docs/light/loading-ui.png"
  srcDark="/docs/dark/loading-ui.png"
  width="1600"
  height="691"
/>

## 即时加载状态

即时加载状态是在导航时立即显示的回退 UI。您可以预渲染加载指示器，如骨架和旋转器，或者预渲染未来屏幕的一小部分但有意义的部分，如封面照片、标题等。这有助于用户理解应用程序正在响应，并提供更好的用户体验。

通过在文件夹内添加 `loading.js` 文件来创建加载状态。

<Image
  alt="loading.js 特殊文件"
  srcLight="/docs/light/loading-special-file.png"
  srcDark="/docs/dark/loading-special-file.png"
  width="1600"
  height="606"
/>

```tsx filename="app/dashboard/loading.tsx" switcher
export default function Loading() {
  // 您可以在 Loading 中添加任何 UI，包括 Skeleton。
  return <LoadingSkeleton />
}
```

```jsx filename="app/dashboard/loading.js" switcher
export default function Loading() {
  // 您可以在 Loading 中添加任何 UI，包括 Skeleton。
  return <LoadingSkeleton />
}
```

在同一文件夹中，`loading.js` 将嵌套在 `layout.js` 内部。它将自动用 `<Suspense>` 边界包装 `page.js` 文件及以下的任何子级。

<Image
  alt="loading.js 概览"
  srcLight="/docs/light/loading-overview.png"
  srcDark="/docs/dark/loading-overview.png"
  width="1600"
  height="768"
/>

> **须知**：
>
> - 即使使用 [服务器中心路由](/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)，导航也是立即的。
> - 导航是可中断的，这意味着在导航到另一个路由之前，不需要等待当前路由的内容完全加载。
> - 在新路由段加载时，共享布局保持交互性。

> **须知**：对于路由段（布局和页面），使用 `loading.js` 约定，因为 Next.js 优化了此功能。

## 使用 Suspense 进行流式传输

除了 `loading.js`，您还可以为 UI 组件手动创建 Suspense 边界。App Router 支持使用 [Suspense](https://react.dev/reference/react/Suspense) 对 [Node.js 和 Edge 运行时](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes) 进行流式传输。

> **须知**：
>
> - [一些浏览器](https://bugs.webkit.org/show_bug.cgi?id=252413) 会缓冲流式传输响应。您可能直到响应超过 1024 字节后才能看到流式传输响应。这通常只影响“Hello World”应用程序，而不是真实应用程序。

### 什么是流式传输？

要了解 React 和 Next.js 中流式传输的工作原理，了解 **服务器端渲染 (SSR)** 及其局限性是有帮助的。

使用 SSR，需要完成一系列步骤，用户才能看到并交互页面：

1. 首先，服务器上获取给定页面的所有数据。
2. 然后，服务器渲染页面的 HTML。
3. 页面的 HTML、CSS 和 JavaScript 发送到客户端。
4. 使用生成的 HTML 和 CSS 显示非交互式用户界面。
5. 最后，React [hydration](https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) 用户界面使其变得交互式。

<Image
  alt="Chart showing Server Rendering without Streaming"
  srcLight="/docs/light/server-rendering-without-streaming-chart.png"
  srcDark="/docs/dark/server-rendering-without-streaming-chart.png"
  width="1600"
  height="900"
/>```
/docs/dark/server-rendering-without-streaming-chart.png"
  width="1600"
  height="612"
/>

这些步骤是顺序的并且是阻塞的，这意味着服务器只能在所有数据被获取后才能渲染页面的HTML。而且，在客户端，React只有在页面上所有组件的代码被下载后才能激活UI。

使用React和Next.js进行SSR有助于通过尽快向用户显示一个非交互式页面来改善感知的加载性能。

<Image
  alt="无流式传输的服务器渲染"
  srcLight="/docs/light/server-rendering-without-streaming.png"
  srcDark="/docs/dark/server-rendering-without-streaming.png"
  width="1600"
  height="748"
/>

然而，它仍然可能很慢，因为服务器上的所有数据获取都需要在页面显示给用户之前完成。

**流式传输**允许你将页面的HTML分解成更小的块，并逐步将这些块从服务器发送到客户端。

<Image
  alt="带流式传输的服务器渲染如何工作"
  srcLight="/docs/light/server-rendering-with-streaming.png"
  srcDark="/docs/dark/server-rendering-with-streaming.png"
  width="1600"
  height="785"
/>

这使得页面的部分可以更快地显示，而不需要等待所有数据加载后才能渲染任何UI。

流式传输与React的组件模型很好地配合，因为每个组件都可以被视为一个块。具有更高优先级（例如产品信息）或不依赖数据的组件可以先发送（例如布局），React可以更早地开始激活。具有较低优先级的组件（例如评论，相关产品）可以在其数据被获取后在同一服务器请求中发送。

<Image
  alt="显示带流式传输的服务器渲染的图表"
  srcLight="/docs/light/server-rendering-with-streaming-chart.png"
  srcDark="/docs/dark/server-rendering-with-streaming-chart.png"
  width="1600"
  height="730"
/>

当你想要防止长时间的数据请求阻塞页面渲染时，流式传输特别有益，因为它可以减少[第一字节时间（TTFB）](https://web.dev/ttfb/)和[首次内容绘制（FCP）](https://web.dev/first-contentful-paint/)。它还有助于改善[交互时间（TTI）](https://developer.chrome.com/en/docs/lighthouse/performance/interactive/)，特别是在较慢的设备上。

### 示例

`<Suspense>`通过包装执行异步操作的组件（例如获取数据），在操作发生时显示后备UI（例如骨架，旋转器），然后在操作完成后替换为你的组件。

```tsx filename="app/dashboard/page.tsx" switcher
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}
```

通过使用Suspense，你将获得以下好处：

1. **流式服务器渲染** - 逐步从服务器向客户端渲染HTML。
2. **选择性激活** - React根据用户交互优先考虑哪些组件首先变得交互式。

有关更多Suspense示例和用例，请参见[React文档](https://react.dev/reference/react/Suspense)。

### SEO

- Next.js将在流式传输UI到客户端之前等待[`generateMetadata`](/docs/app/api-reference/functions/generate-metadata)内部的数据获取完成。这保证了流的第一部分...
```med响应包括`<head>`标签。
- 由于流式传输是服务器渲染的，因此它不会影响SEO。您可以使用Google的[Rich Results Test](https://search.google.com/test/rich-results)工具查看页面对Google网络爬虫的呈现方式，并查看序列化HTML（来源：[https://web.dev/rendering-on-the-web/#seo-considerations](https://web.dev/rendering-on-the-web/#seo-considerations)）。

### 状态代码

在流式传输时，将返回`200`状态代码以表示请求成功。

服务器仍然可以在流式传输的内容本身中向客户端传达错误或问题，例如，当使用[`redirect`](/docs/app/api-reference/functions/redirect)或[`notFound`](/docs/app/api-reference/functions/not-found)时。由于响应头已经发送到客户端，因此响应的状态代码无法更新。这不会对SEO产生影响。