# Server Components

React Server Components 允许您编写可以在服务器上渲染并可选地缓存的 UI。在 Next.js 中，渲染工作通过路由段进一步分割，以实现流式传输和部分渲染，并且有三种不同的服务器渲染策略：

- [静态渲染](#静态渲染默认)
- [动态渲染](#动态渲染)
- [流式传输](#流式传输)

本页将介绍 Server Components 的工作原理、您可能使用它们的情况以及不同的服务器渲染策略。

## 服务器渲染的好处

在服务器上进行渲染工作有几个好处，包括：

- **数据获取**：Server Components 允许您将数据获取移至服务器，更接近您的数据源。这可以通过减少获取渲染所需数据所需的时间以及客户端需要进行的请求数量来提高性能。
- **安全性**：Server Components 允许您将敏感数据和逻辑（如令牌和 API 密钥）保留在服务器上，而不必担心暴露给客户端。
- **缓存**：通过在服务器上进行渲染，结果可以被缓存并在后续请求和用户之间重用。这可以通过减少每次请求上进行的渲染和数据获取量来提高性能并降低成本。
- **性能**：Server Components 为您提供了从基线优化性能的额外工具。例如，如果您从一个完全由客户端组件组成的应用程序开始，将 UI 的非交互部分移动到 Server Components 可以减少所需的客户端 JavaScript 数量。这对于使用较慢的互联网或功能较弱的设备的用户体验是有益的，因为浏览器需要下载、解析和执行的客户端 JavaScript 较少。
- **初始页面加载和[首次内容绘制（FCP）](https://web.dev/fcp/)**：在服务器上，我们可以生成 HTML，使用户可以立即查看页面，而无需等待客户端下载、解析并执行渲染页面所需的 JavaScript。
- **搜索引擎优化和社交网络共享性**：渲染的 HTML 可以被搜索引擎机器人用来索引您的页面，社交网络机器人用来为您的页面生成社交卡片预览。
- **流式传输**：Server Components 允许您将渲染工作分成块，并将它们作为它们准备好时流式传输到客户端。这使用户可以更早地看到页面的部分，而不必等待整个页面在服务器上渲染完成。

## 在 Next.js 中使用 Server Components

默认情况下，Next.js 使用 Server Components。这允许您自动实现服务器渲染，无需额外配置，并且您可以在需要时选择使用客户端组件，请参阅 [客户端组件](/docs/app/building-your-application/rendering/client-components)。

## 服务器组件是如何渲染的？

在服务器上，Next.js 使用 React 的 API 来协调渲染。渲染工作被分成多个块：按单个路由段和[Suspense边界](https://react.dev/reference/react/Suspense)。

每个块的渲染分为两个步骤：

1. React 将服务器组件渲染成一种特殊的数据格式，称为 **React 服务器组件有效载荷（RSC Payload）**。
2. Next.js 使用 RSC Payload 和客户端组件 JavaScript 指令在服务器上渲染 **HTML**。

然后在客户端：

1. HTML 被用来立即显示路由的快速非交互式预览 - 这仅用于初始页面加载。
2. React 服务器组件有效载荷被用来协调客户端和服务器组件树，并更新 DOM。
3. 使用 JavaScript 指令来[水合](https://react.dev/reference/react-dom/client/hydrateRoot)客户端组件并使应用程序变得交互式。

> #### React 服务器组件有效载荷（RSC）是什么？
>
> RSC Payload 是渲染后的 React 服务器组件树的紧凑二进制表示。它由 React 在客户端用来更新浏览器的 DOM。RSC Payload 包含：
>
> - 服务器组件的渲染结果
> - 客户端组件应该渲染的位置的占位符和对它们 JavaScript 文件的引用
> - 从服务器组件传递到客户端组件的任何属性

## 服务器渲染策略

服务器渲染有三个子集：静态、动态和流式。

### 静态渲染（默认）

使用静态渲染，路由在 **构建时** 或在[数据重新验证](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data)后的后台渲染。结果是缓存的，可以推送到[内容分发网络（CDN）](https://developer.mozilla.org/docs/Glossary/CDN)。这种优化允许您在用户和服务器请求之间共享渲染工作的成果。

当路由的数据不是针对用户的个性化内容，并且可以在构建时知道时，静态渲染非常有用，例如静态博客文章或产品页面。

### 动态渲染

使用动态渲染时，每个用户的路由在**请求时**进行渲染。

动态渲染在路由具有针对用户个性化的数据或只有在请求时才能知道的信息（例如cookies或URL的搜索参数）时非常有用。

> **动态路由与缓存数据**
>
> 在大多数网站上，路由既不是完全静态的，也不是完全动态的——它是一个范围。例如，你可以有一个电子商务页面，它使用在间隔内重新验证的缓存产品数据，但同时也有未缓存的、个性化的客户数据。
>
> 在Next.js中，你可以拥有同时包含缓存和未缓存数据的动态渲染路由。这是因为RSC有效载荷和数据是分别缓存的。这允许你选择动态渲染，而不必担心在请求时获取所有数据的性能影响。
>
> 了解更多关于[全路由缓存](/docs/app/building-your-application/caching#full-route-cache)和[数据缓存](/docs/app/building-your-application/caching#data-cache)。

#### 切换到动态渲染

在渲染期间，如果发现[动态函数](#dynamic-functions)或[未缓存数据请求](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching)，Next.js将切换到动态渲染整个路由。下表总结了动态函数和数据缓存如何影响路由是静态还是动态渲染：

| 动态函数 | 数据       | 路由                |
| ----------------- | ---------- | -------------------- |
| 无                | 缓存     | 静态渲染          |
| 是               | 缓存     | 动态渲染          |
| 无                | 未缓存 | 动态渲染          |
| 是               | 未缓存 | 动态渲染          |

在上表中，要使路由完全静态，所有数据必须被缓存。然而，你可以拥有一个使用缓存和未缓存数据获取的动态渲染路由。

作为开发者，你不需要在静态和动态渲染之间做出选择，因为Next.js将根据使用的特徵和API自动选择每个路由的最佳渲染策略。相反，你选择何时[缓存或重新验证特定数据](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)，并且你可能会选择[流式传输](#streaming)你的UI的某些部分。

#### 动态函数

动态函数依赖于只能在请求时知道的信息，例如用户的cookies、当前请求的头部或URL的搜索参数。在Next.js中，这些动态函数是：

- **[`cookies()`](/docs/app/api-reference/functions/cookies) 和 [`headers()`](/docs/app/api-reference/functions/headers)**：在Server Component中使用这些将使整个路由在请求时选择动态渲染。
- **[`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional)**：在[Page](/docs/app/api-reference/file-conventions/page)上使用`searchParams`属性将使页面在请求时选择动态渲染。

使用这些函数中的任何一个都将使整个路由在请求时选择动态渲染。

### 流式传输

<Image
  alt="显示在流式传输期间对路由段进行并行化的图示，展示了数据获取、渲染和单个块的激活过程。"
  srcLight="/docs/light/sequential-parallel-data-fetching.png"
  srcDark="/docs/dark/sequential-parallel-data-fetching.png"
  width="1600"
  height="525"
/>

流式传输使您能够逐步从服务器渲染用户界面。工作被分成块，一旦准备好就流式传输到客户端。这允许用户在全部内容完成渲染之前立即看到页面的部分。

<Image
  alt="图示显示客户端上部分渲染的页面，正在流式传输的块的加载用户界面。"
  srcLight="/docs/light/server-rendering-with-streaming.png"
  srcDark="/docs/dark/server-rendering-with-streaming.png"
  width="1600"
  height="785"
/>

流式传输默认内置于 Next.js App Router 中。这有助于改善初始页面加载性能，以及依赖于较慢数据获取的 UI，这些数据获取会阻塞整个路由的渲染。例如，产品页面上的评论。

您可以使用 `loading.js` 和带有 [React Suspense](/docs/app/building-your-application/routing/loading-ui-and-streaming) 的 UI 组件开始流式传输路由段。有关更多信息，请参见 [加载用户界面和流式传输](/docs/app/building-your-application/routing/loading-ui-and-streaming) 部分。