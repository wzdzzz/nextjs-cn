# 加载界面和流式传输

`loading.js` 特殊文件帮助您使用 [React Suspense](https://react.dev/reference/react/Suspense) 创建有意义的加载界面。通过这种约定，您可以在路由段的内容加载时显示来自服务器的[即时加载状态](#即时加载状态)。一旦渲染完成，新内容将自动替换。

![加载界面](/docs/light/loading-ui.png)

## 即时加载状态

即时加载状态是在导航时立即显示的备用 UI。您可以预渲染加载指示器，如骨架和旋转器，或者未来屏幕的一小部分但有意义的部分，如封面照片、标题等。这有助于用户理解应用程序正在响应，并提供更好的用户体验。

通过在文件夹内添加 `loading.js` 文件来创建加载状态。

![loading.js 特殊文件](/docs/light/loading-special-file.png)

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

在同一文件夹中，`loading.js` 将嵌套在 `layout.js` 中。它将自动包装 `page.js` 文件及以下的任何子级在一个 `<Suspense>` 边界内。

![loading.js 概览](/docs/light/loading-overview.png)

> **须知**：
>
> - 即使使用 [服务器中心路由](/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)，导航也是立即的。
> - 导航是可中断的，这意味着更改路由不需要等待路由的内容完全加载后再导航到另一个路由。
> - 在新路由段加载时，共享布局保持交互性。

> **推荐**：使用 `loading.js` 约定用于路由段（布局和页面），因为 Next.js 优化了此功能。

## 使用 Suspense 进行流式传输

除了 `loading.js`，您还可以为自定义 UI 组件手动创建 Suspense 边界。App Router 支持使用 [Suspense](https://react.dev/reference/react/Suspense) 进行流式传输，适用于 [Node.js 和 Edge 运行时](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)。

> **须知**：
>
> - [一些浏览器](https://bugs.webkit.org/show_bug.cgi?id=252413) 会缓冲流式响应。您可能直到响应超过 1024 字节时才看到流式响应。这通常只影响“hello world”应用程序，而不是真实应用程序。
### 什么是流式传输？

要了解React和Next.js中流式传输的工作原理，了解**服务器端渲染（SSR）**及其局限性是很有帮助的。

使用SSR，需要完成一系列步骤，用户才能看到并与页面交互：

1. 首先，在服务器上获取给定页面的所有数据。
2. 然后，服务器渲染页面的HTML。
3. 将页面的HTML、CSS和JavaScript发送到客户端。
4. 使用生成的HTML和CSS显示非交互式用户界面。
5. 最后，React [激活](https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)用户界面使其可交互。

![图表显示无流式传输的服务器渲染](/docs/light/server-rendering-without-streaming-chart.png)

这些步骤是顺序的和阻塞的，这意味着服务器只有在所有数据都被获取后才能渲染页面的HTML。而且，在客户端，React只有在页面的所有组件代码都被下载后才能激活UI。

React和Next.js的SSR通过尽快向用户显示非交互式页面来帮助提高感知的加载性能。

![无流式传输的服务器渲染](/docs/light/server-rendering-without-streaming.png)

然而，由于服务器上的所有数据获取都需要完成才能向用户显示页面，它仍然可能很慢。

**流式传输**允许你将页面的HTML分解为更小的块，并逐步从服务器向客户端发送这些块。

![服务器渲染与流式传输工作原理](/docs/light/server-rendering-with-streaming.png)

这使得页面的部分可以更快地显示，而无需等待所有数据加载后再渲染任何UI。

流式传输与React的组件模型很好地配合，因为每个组件都可以被视为一个块。具有较高优先级（例如产品信息）或不依赖数据的组件可以先发送（例如布局），React可以更早地开始激活。具有较低优先级（例如评论、相关产品）的组件可以在其数据被获取后在同一服务器请求中发送。

![图表显示流式传输的服务器渲染](/docs/light/server-rendering-with-streaming-chart.png)

当你想要防止长时间的数据请求阻塞页面渲染时，流式传输特别有益，因为它可以减少[首字节时间（TTFB）](https://web.dev/ttfb/)和[首次内容绘制（FCP）](https://web.dev/first-contentful-paint/)。它还有助于提高[可交互时间（TTI）](https://developer.chrome.com/en/docs/lighthouse/performance/interactive/)，特别是在较慢的设备上。
# Example

`<Suspense>` 通过包装执行异步操作的组件（例如获取数据），在操作进行时显示回退UI（例如骨架，旋转器），然后在操作完成后替换为您的组件。

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

使用Suspense，您可以获得以下好处：

1. **流式服务器渲染** - 逐步从服务器渲染HTML到客户端。
2. **选择性水合** - React根据用户交互优先考虑哪些组件首先变得交互式。

有关更多Suspense示例和用例，请参见[React文档](https://react.dev/reference/react/Suspense)。

# SEO

- Next.js将在流式传输UI到客户端之前等待[`generateMetadata`](/docs/app/api-reference/functions/generate-metadata)中的数据获取完成。这保证了流式响应的第一部分包括`<head>`标签。
- 由于流式传输是服务器渲染的，因此不会影响SEO。您可以使用Google的[Rich Results Test](https://search.google.com/test/rich-results)工具查看您的页面对Google网络爬虫的显示情况，并查看序列化HTML（[source](https://web.dev/rendering-on-the-web/#seo-considerations)）。

### 状态码

在流式传输时，将返回`200`状态码以表示请求成功。

服务器仍然可以在流式传输的内容本身中与客户端通信错误或问题，例如，当使用[`redirect`](/docs/app/api-reference/functions/redirect)或[`notFound`](/docs/app/api-reference/functions/not-found)时。由于响应头已经发送到客户端，因此无法更新响应的状态码。这不会影响SEO。