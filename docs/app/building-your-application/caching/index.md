---
title: Next.js 中的缓存
---

Next.js 通过缓存渲染工作和数据请求，提高应用程序的性能并降低成本。本页面深入探讨了 Next.js 的缓存机制、您可以使用的配置它们的 API，以及它们之间的相互作用。

> **须知**：本页面帮助您了解 Next.js 的内部工作原理，但**不是**使用 Next.js 的必要知识。大多数 Next.js 的缓存启发式规则由您的 API 使用情况决定，并且具有默认值，以零或最小配置实现最佳性能。

## 概述

以下是不同缓存机制及其目的的高级概述：

| 机制                                   | 内容                       | 位置  | 目的                                             | 持续时间                        |
| ---------------------------------------- | -------------------------- | ----- | ----------------------------------------------- | ------------------------------- |
| [请求记忆化](#请求记忆化) | 函数的返回值               | 服务器 | 在 React 组件树中重用数据                         | 每个请求生命周期               |
| [数据缓存](#数据缓存)                   | 数据                       | 服务器 | 跨用户请求和部署存储数据                         | 持久性（可以重新验证）           |
| [完整路由缓存](#完整路由缓存)           | HTML 和 RSC 负载           | 服务器 | 减少渲染成本并提高性能                         | 持久性（可以重新验证）           |
| [路由器缓存](#路由器缓存)               | RSC 负载                   | 客户端 | 减少导航时的服务器请求                           | 用户会话或基于时间              |

默认情况下，Next.js 会尽可能多地缓存以提高性能并降低成本。这意味着路由是**静态渲染**的，数据请求是**缓存**的，除非您选择退出。下面的图表显示了默认的缓存行为：当路由在构建时静态渲染，以及当静态路由首次被访问时。

![Next.js 中四种机制的默认缓存行为图示，包括构建时和路由首次访问时的 HIT、MISS 和 SET。](/docs/light/caching-overview.png)

缓存行为会根据路由是静态还是动态渲染、数据是否缓存以及请求是否是初始访问或后续导航而改变。根据您的用例，您可以为单个路由和数据请求配置缓存行为。

## 请求记忆化

React 扩展了 [`fetch` API](#fetch)，以自动**记忆化**具有相同 URL 和选项的请求。这意味着您可以在 React 组件树的多个位置调用相同数据的获取函数，而只需执行一次。

![去重的获取请求](/docs/light/deduplicated-fetch-requests.png)

例如，如果您需要在路由中使用相同的数据（例如，在布局、页面和多个组件中），您不必在树的顶部获取数据，并在组件之间转发 props。相反，您可以在需要数据的组件中获取数据，而不必担心为相同数据在网络中多次请求的性能影响。

```tsx filename="app/example.tsx" switcher
async function getItem() {
  // `fetch` 函数自动记忆化，结果被缓存
  const res = await fetch('https://.../item/1')
  return res.json()
}

// 这个函数被调用两次，但只在第一次执行
const item = await getItem() // 缓存 MISS

// 第二次调用可以在您的路由中的任何位置
const item = await getItem() // 缓存 HIT
``````markdown
# 示例代码

```jsx filename="app/example.js" switcher
async function getItem() {
  // `fetch` 函数会自动进行记忆化，并且结果会被缓存
  const res = await fetch('https://.../item/1')
  return res.json()
}

// 这个函数被调用了两次，但只在第一次执行
const item = await getItem() // 缓存未命中

// 第二次调用可以在你的路由中的任何位置
const item = await getItem() // 缓存命中
```

# 请求记忆化是如何工作的

<Image
  alt="图表展示了在 React 渲染期间获取记忆化是如何工作的。"
  srcLight="/docs/light/request-memoization.png"
  srcDark="/docs/dark/request-memoization.png"
  width="1600"
  height="742"
/>

- 在渲染路由时，第一次调用特定请求时，其结果不会在内存中，它将是一个缓存`MISS`。
- 因此，将执行该函数，从外部源获取数据，并将结果存储在内存中。
- 在同一渲染传递中对该请求的后续函数调用将是缓存`HIT`，并且数据将从内存返回而无需执行该函数。
- 一旦路由已渲染并且渲染传递完成，内存将被“重置”，所有请求记忆化条目都将被清除。

> **须知**：
>
> - 请求记忆化是 React 的特性，而不是 Next.js 的特性。它包含在这里是为了展示它如何与其他缓存机制交互。
> - 记忆化仅适用于 `fetch` 请求中的 `GET` 方法。
> - 记忆化仅适用于 React 组件树，这意味着：
>   - 它适用于 `generateMetadata`、`generateStaticParams`、布局、页面和其他服务器组件中的 `fetch` 请求。
>   - 它不适用于路由处理器中的 `fetch` 请求，因为它们不是 React 组件树的一部分。
> - 对于 `fetch` 不适用的情况（例如某些数据库客户端、CMS 客户端或 GraphQL 客户端），您可以使用 [React `cache` 函数](#react-cache-function) 对函数进行记忆化。

### 持续时间

缓存持续到服务器请求的生命周期结束，直到 React 组件树完成渲染。

### 重新验证

由于记忆化不是跨服务器请求共享的，并且仅在渲染期间适用，因此无需重新验证它。

### 选择退出

记忆化仅适用于 `fetch` 请求中的 `GET` 方法，其他方法，如 `POST` 和 `DELETE`，不会被记忆化。这种默认行为是 React 的优化，我们不建议选择退出。

要管理个别请求，您可以使用 [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 的 [`signal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal) 属性。然而，这不会将请求选择退出记忆化，而是中止正在进行的请求。

```js filename="app/example.js"
const { signal } = new AbortController()
fetch(url, { signal })
```

# 数据缓存

Next.js 有一个内置的数据缓存，它**持久化**了数据获取的结果，跨入站**服务器请求**和**部署**。这是可能的，因为 Next.js 扩展了原生的 `fetch` API，允许每个服务器上的请求设置自己的持久缓存语义。

> **须知**：在浏览器中，`fetch` 的 `cache` 选项指示请求将如何与浏览器的 HTTP 缓存交互，在 Next.js 中，`cache` 选项指示服务器端请求将如何与服务器的数据缓存交互。

默认情况下，使用 `fetch` 的数据请求是**缓存**的。您可以使用 `fetch` 的 [`cache`](#fetch-optionscache) 和 [`next.revalidate`](#fetch-optionsnextrevalidate) 选项来配置缓存行为。

# 数据缓存是如何工作的

<Image
  alt="图表展示了缓存和未缓存的获取请求是如何与数据缓存交互的。缓存的请求存储在数据缓存中，并进行了记忆化，未缓存的请求从数据源获取，不存储在数据缓存中，并进行了记忆化。"
  srcLight="/docs/light/"
```# 数据缓存

<Image
  alt="数据缓存图示"
  srcLight="/docs/light/data-cache.png"
  srcDark="/docs/dark/data-cache.png"
  width="1600"
  height="661"
/>

- 在渲染期间，当首次调用 `fetch` 请求时，Next.js 会检查数据缓存中是否有缓存的响应。
- 如果找到了缓存的响应，它会立即返回并进行[记忆化](#请求记忆化)。
- 如果没有找到缓存的响应，请求将发送到数据源，结果将存储在数据缓存中，并进行记忆化。
- 对于未缓存的数据（例如 `{ cache: 'no-store' }`），结果总是从数据源获取，并进行记忆化。
- 无论数据是否被缓存，请求总是进行记忆化，以避免在 React 渲染过程中对相同数据进行重复请求。

> **数据缓存与请求记忆化之间的差异**
>
> 虽然两种缓存机制都通过重用缓存数据来帮助提高性能，但数据缓存在传入请求和部署之间是持久的，而记忆化仅持续请求的生命周期。
>
> 通过记忆化，我们减少了在同一渲染过程中必须跨越从渲染服务器到数据缓存服务器（例如 CDN 或边缘网络）或数据源（例如数据库或 CMS）的网络边界的**重复**请求的数量。通过数据缓存，我们减少了对我们原始数据源的请求数量。

### 持续时间

数据缓存在传入请求和部署之间是持久的，除非你重新验证或选择退出。

### 重新验证

缓存的数据可以通过两种方式重新验证：

- **基于时间的重新验证**：在一定时间过去后，当有新的请求时重新验证数据。这适用于不频繁变化且新鲜度不是关键的数据。
- **按需重新验证**：根据事件（例如表单提交）重新验证数据。按需重新验证可以使用基于标签或基于路径的方法一次性重新验证数据组。这在你想尽快确保显示最新数据时很有用（例如，当你的无头 CMS 的内容更新时）。

#### 基于时间的重新验证

要定时重新验证数据，可以使用 `fetch` 的 `next.revalidate` 选项来设置资源的缓存生命周期（以秒为单位）。

```js
// 每小时重新验证一次
fetch('https://...', { next: { revalidate: 3600 } })
```

或者，你可以使用[路由段配置选项](#段配置选项)来配置一个段中的所有 `fetch` 请求，或者在你无法使用 `fetch` 的情况下。

**基于时间的重新验证如何工作**

<Image
  alt="图表显示了基于时间的重新验证的工作原理，在重新验证周期后，首次请求返回陈旧数据，然后重新验证数据。"
  srcLight="/docs/light/time-based-revalidation.png"
  srcDark="/docs/dark/time-based-revalidation.png"
  width="1600"
  height="1252"
/>

- 第一次调用带有 `revalidate` 的 fetch 请求时，数据将从外部数据源获取并存储在数据缓存中。
- 在指定的时间框架内（例如 60 秒）调用的任何请求都将返回缓存的数据。
- 时间框架过后，下一个请求仍将返回缓存的（现在已陈旧的）数据。
  - Next.js 将在后台触发数据的重新验证。
  - 一旦数据成功获取，Next.js 将使用新鲜数据更新数据缓存。
  - 如果后台重新验证失败，先前的数据将保持不变。

这类似于 [**stale-while-revalidate**](https://web.dev/stale-while-revalidate/) 行为。

#### 按需重新验证

数据可以通过路径（[`revalidatePath`](#revalidatepath)）或通过缓存标签（[`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag)）按需重新验证。

**按需重新验证如何工作**

<Image
  alt="图表显示了按需重新验证的工作原理，在重新验证请求后，数据缓存将用新鲜数据更新。"
  srcLight="/docs/light/on-demand-revalidation.png"
  srcDark="/docs/dark/on-demand-revali## 数据缓存

- 第一次调用 `fetch` 请求时，数据将从外部数据源获取并存储在数据缓存中。
- 当触发按需重新验证时，适当的缓存条目将从缓存中清除。
  - 这与基于时间的重新验证不同，后者在获取新鲜数据之前会保留缓存中的过时数据。
- 下次请求时，将再次出现缓存 `MISS`，数据将从外部数据源获取并存储在数据缓存中。

### 退出缓存

对于个别数据获取，你可以通过将 [`cache`](#fetch-optionscache) 选项设置为 `no-store` 来选择退出缓存。这意味着每次调用 `fetch` 时都会获取数据。

```jsx
// 为个别 `fetch` 请求选择退出缓存
fetch(`https://...`, { cache: 'no-store' })
```

或者，你也可以使用 [路由段配置选项](#segment-config-options) 来为特定路由段选择退出缓存。这将影响路由段中的所有数据请求，包括第三方库。

```jsx
// 为路由段中的所有数据请求选择退出缓存
export const dynamic = 'force-dynamic'
```

> **注意**：数据缓存目前仅在页面/路由中可用，不适用于中间件。在中间件中执行的任何获取操作将默认未缓存。

> **Vercel 数据缓存**
>
> 如果你的 Next.js 应用程序部署在 Vercel 上，我们建议阅读 [Vercel 数据缓存](https://vercel.com/docs/infrastructure/data-cache) 文档，以更好地理解 Vercel 特定的功能。

## 全路由缓存

> **相关术语**：
>
> 你可能会看到 **自动静态优化**、**静态站点生成** 或 **静态渲染** 这些术语被交替使用，以指代在构建时渲染和缓存应用程序的路由的过程。

Next.js 自动在构建时渲染和缓存路由。这是一种优化，允许你提供缓存的路由，而不是对每个请求都进行服务器端渲染，从而实现更快的页面加载。

要理解全路由缓存的工作原理，有助于查看 React 如何处理渲染，以及 Next.js 如何缓存结果：

### 1. 服务器上的 React 渲染

在服务器上，Next.js 使用 React 的 API 来协调渲染。渲染工作被分成块：按个别路由段和 Suspense 边界。

每个块的渲染分为两个步骤：

1. React 将服务器组件渲染成一种特殊的数据格式，这种格式针对流式传输进行了优化，称为 **React 服务器组件有效载荷**。
2. Next.js 使用 React 服务器组件有效载荷和客户端组件 JavaScript 指令在服务器上渲染 **HTML**。

这意味着我们不必等待所有内容都渲染完毕就可以缓存工作或发送响应。相反，我们可以在完成工作时流式传输响应。

> **什么是 React 服务器组件有效载荷？**
>
> React 服务器组件有效载荷是渲染后的 React 服务器组件树的紧凑二进制表示。它由 React 在客户端用于更新浏览器的 DOM。React 服务器组件有效载荷包含：
>
> - 服务器组件的渲染结果
> - 客户端组件应该渲染的位置的占位符及其 JavaScript 文件的引用
> - 从服务器组件传递给客户端组件的任何属性
>
> 要了解更多信息，请查看 [服务器组件](/docs/app/building-your-application/rendering/server-components) 文档。

### 2. 服务器上的 Next.js 缓存（全路由缓存）

<Image
  alt="全路由缓存的默认行为，展示了 React 服务器组件有效载荷和 HTML 如何在服务器上为静态渲染的路由进行缓存。"
  srcLight="/docs/light/full-route-cache.png"
  srcDark="/docs/dark/full-route-cache.png"
  width="1600"
  height="888"
/>

Next.js 的默认行为是缓存渲染结果（React 服务器组件有效载荷# 完整路由缓存

在服务器上，对于一个路由：

1. **构建时静态生成**：在构建时，静态生成的路由会生成HTML和JSON。JSON包含了服务器组件的渲染结果，以及客户端组件需要从服务器获取的数据。

2. **预渲染**：在构建时或重新验证期间，预渲染静态生成的路由。

3. **客户端的React水合和协调**：在客户端请求时：

   1. 使用HTML立即显示客户端和服务器组件的快速非交互式初始预览。
   2. 使用React服务器组件负载来协调客户端和渲染的服务器组件树，并更新DOM。
   3. 使用JavaScript指令来[水合](https://react.dev/reference/react-dom/client/hydrateRoot)客户端组件并使应用程序变得交互式。

4. **客户端的Next.js缓存（路由器缓存）**：React服务器组件负载存储在客户端的[路由器缓存](#router-cache)中——这是一个单独的内存缓存，按单个路由段分割。这个路由器缓存用于通过存储先前访问的路由和预取未来路由来改善导航体验。

5. **后续导航**：在后续导航或预取期间，Next.js将检查React服务器组件负载是否存储在路由器缓存中。如果是，它将跳过向服务器发送新请求。

   如果路由段不在缓存中，Next.js将从服务器获取React服务器组件负载，并在客户端上填充路由器缓存。

### 静态和动态渲染

路由在构建时是否被缓存取决于它是静态渲染还是动态渲染。静态路由默认被缓存，而动态路由在请求时渲染，不被缓存。

这张图显示了静态和动态渲染之间的区别，以及缓存和未缓存数据的影响：

<Image
  alt="静态和动态渲染如何影响完整路由缓存。静态路由在构建时或数据重新验证后被缓存，而动态路由从不被缓存"
  srcLight="/docs/light/static-and-dynamic-routes.png"
  srcDark="/docs/dark/static-and-dynamic-routes.png"
  width="1600"
  height="1314"
/>

了解更多关于[静态和动态渲染](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies)。

### 持续时间

默认情况下，完整路由缓存是持久的。这意味着渲染输出在用户请求之间被缓存。

### 失效

您可以通过以下两种方式之一使完整路由缓存失效：

- **[重新验证数据](/docs/app/building-your-application/caching#revalidating)**：重新验证[数据缓存](#data-cache)将反过来通过在服务器上重新渲染组件并缓存新的渲染输出来使路由器缓存失效。
- **重新部署**：与跨部署持久的数据缓存不同，完整路由缓存在新部署时会被清除。

### 选择退出

您可以通过以下方式选择退出完整路由缓存，或者换句话说，为每个传入的请求动态渲染组件：

- **使用[动态函数](#dynamic-functions)**：这将使路由从完整路由缓存中退出，并在请求时动态渲染它。数据缓存仍然可以使用。
- **使用`dynamic = 'force-dynamic'`或`revalidate = 0`路由段配置选项**：这将跳过完整路由缓存和数据缓存。这意味着组件将在每个传入的服务器请求上渲染和获取数据。路由器缓存仍然适用，因为它是客户端缓存。
- **选择退出[数据缓存](#data-cache)**：如果一个路由有一个没有被缓存的`fetch`请求，这将使该路由退出完整路由缓存。特定`fetch`请求的数据将为每个传入的请求获取。其他没有选择退出缓存的`fetch`请求仍然会在数据缓存中被缓存。这允许缓存和未缓存数据的混合。

# 路由器缓存

> **相关术语：**
>
> 您可能会看到路由器缓存被称为**客户端缓存**或**预取缓存**。虽然**预取缓存**指的是预取的路由段，# 客户端缓存

**客户端缓存**指的是整个路由器缓存，包括已访问和预取的段。
> 这个缓存特别适用于 Next.js 和服务器组件，并且与浏览器的 [bfcache](https://web.dev/bfcache/) 不同，尽管它有类似的结果。

Next.js 有一个内存中的客户端缓存，用于存储 React 服务器组件有效载荷，按单个路由段分割，在用户会话期间。这被称为路由器缓存。

### 路由器缓存的工作原理

<Image
  alt="路由器缓存如何为静态和动态路由工作，显示初始和后续导航的未命中和命中。"
  srcLight="/docs/light/router-cache.png"
  srcDark="/docs/dark/router-cache.png"
  width="1600"
  height="1375"
/>

当用户在路由之间导航时，Next.js 缓存已访问的路由段，并 [预取](/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching) 用户可能要导航到的路由（基于他们视口中的 `<Link>` 组件）。

这为用户带来了改进的导航体验：

- 由于缓存了访问过的路由，因此可以即时向后/向前导航，并且由于预取和 [部分渲染](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，可以快速导航到新路由。
- 导航之间没有全页面重新加载，并且保留了 React 状态和浏览器状态。

> **路由器缓存和完整路由缓存之间的区别**：
>
> 路由器缓存在用户会话期间暂时在浏览器中存储 React 服务器组件有效载荷，而完整路由缓存则在多个用户请求中持久地在服务器上存储 React 服务器组件有效载荷和 HTML。
>
> 虽然完整路由缓存只缓存静态渲染的路由，但路由器缓存适用于静态和动态渲染的路由。

### 持续时间

缓存存储在浏览器的临时内存中。两个因素决定了路由器缓存持续多长时间：

- **会话**：缓存在导航之间持续存在。但是，在页面刷新时会被清除。
- **自动失效周期**：单个段的缓存在特定时间后自动失效。持续时间取决于资源是如何 [预取的](/docs/app/api-reference/components/link#prefetch)：
  - **默认预取** (`prefetch={null}` 或未指定)：30 秒
  - **完整预取**：(`prefetch={true}` 或 `router.prefetch`)：5 分钟

虽然页面刷新将清除 **所有** 缓存段，但自动失效周期只影响从预取时间开始的单个段。

> **注意**：从 [v14.2.0](https://github.com/vercel/next.js/releases/tag/v14.2.0) 开始，有 [实验性支持](/docs/app/api-reference/next-config-js/staleTimes) 配置这些值。

### 失效

有两种方法可以失效路由器缓存：

- 在 **服务器操作** 中：
  - 通过路径按需重新验证数据 ([`revalidatePath`](/docs/app/api-reference/functions/revalidatePath)) 或通过缓存标签 ([`revalidateTag`](/docs/app/api-reference/functions/revalidateTag))
  - 使用 [`cookies.set`](/docs/app/api-reference/functions/cookies#cookiessetname-value-options) 或 [`cookies.delete`](/docs/app/api-reference/functions/cookies#deleting-cookies) 会失效路由器缓存，以防止使用 cookie 的路由变得过时（例如身份验证）。
- 调用 [`router.refresh`](/docs/app/api-reference/functions/use-router) 将失效路由器缓存，并为当前路由向服务器发起新的请求。

### 选择退出

不可能选择退出路由器缓存。但是，你可以通过调用 [`router.refresh`](/docs/app/api-reference/functions/use-router)、[`revalidatePath`](/docs/app/api-reference/functions/revalidatePath) 或 [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag)（见上文）来失效它。这将清除缓存。# 缓存机制

在 Next.js 中，缓存是一种强大的性能优化技术，可以显著减少服务器的负载并加快页面加载时间。Next.js 提供了几种不同的缓存机制，每种机制都有其特定的用例和配置选项。

## 数据缓存

数据缓存是一种服务器端缓存机制，它缓存了从 API 路由或服务器动作返回的数据。这意味着，当页面或片段重新验证时，数据缓存中的数据将被重新使用，而不是重新从 API 路由或服务器动作获取。

## 完全路由缓存

完全路由缓存是一种服务器端缓存机制，它缓存了整个页面或页面片段的渲染结果。这意味着，当页面或片段重新验证时，缓存的渲染结果将被重新使用，而不是重新渲染页面或片段。

## 客户端路由缓存

客户端路由缓存是一种客户端缓存机制，它缓存了页面或页面片段的渲染结果。这意味着，当用户在客户端上导航到已缓存的页面或片段时，缓存的渲染结果将被重新使用，而不是重新渲染页面或片段。

## 重新验证和失效

Next.js 提供了几种不同的重新验证和失效缓存的选项：

### 重新验证数据缓存

你可以通过在 `fetch` 方法中设置 `options.next.revalidate` 属性来重新验证数据缓存。这将告诉 Next.js 在指定的时间后重新获取数据，即使数据仍然在缓存中。

### 失效数据缓存

你可以通过在 `fetch` 方法中设置 `options.next.revalidate` 属性为 `0` 来立即失效数据缓存。这将告诉 Next.js 立即重新获取数据，而不是使用缓存中的数据。

### 重新验证完全路由缓存

你可以通过在 `fetch` 方法中设置 `options.next.revalidate` 属性来重新验证完全路由缓存。这将告诉 Next.js 在指定的时间后重新渲染页面或片段，即使页面或片段仍然在缓存中。

### 失效完全路由缓存

你可以通过在 `fetch` 方法中设置 `options.next.revalidate` 属性为 `0` 来立即失效完全路由缓存。这将告诉 Next.js 立即重新渲染页面或片段，而不是使用缓存的渲染结果。

## 与服务器的交互

当你配置不同的缓存机制时，了解它们如何相互作用非常重要：

### 数据缓存和完全路由缓存

- 重新验证或选择不使用数据缓存**将**使完全路由缓存失效，因为渲染输出依赖于数据。
- 使完全路由缓存失效或选择不使用它**不**影响数据缓存。你可以动态渲染一个同时包含缓存和未缓存数据的路由。这在你页面的大部分使用缓存数据，但有几个组件依赖于需要在请求时获取的数据时非常有用。你可以动态渲染，而不用担心重新获取所有数据的性能影响。

### 数据缓存和客户端路由缓存

- 在[路由处理器](/docs/app/building-your-application/routing/route-handlers)中重新验证数据缓存**不会**立即使路由器缓存失效，因为路由处理器不与特定路由绑定。这意味着路由器缓存将继续提供之前的负载，直到进行硬刷新，或自动失效期已过。
- 要立即使数据缓存和路由器缓存失效，你可以在[服务器动作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)中使用[`revalidatePath`](#revalidatepath)或[`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag)。

## API

下表提供了不同 Next.js API 如何影响缓存的概述：

| API                                                                     | 路由器缓存               | 完全路由缓存      | 数据缓存            | React 缓存 |
| ----------------------------------------------------------------------- | -------------------------- | --------------------- | --------------------- | ----------- |
| [`<Link prefetch>`](#link)                                              | 缓存                      |                       |                       |             |
| [`router.prefetch`](#routerprefetch)                                    | 缓存                      |                       |                       |             |
| [`router.refresh`](#routerrefresh)                                      | 重新验证                 |                       |                       |             |
| [`fetch`](#fetch)                                                       |                            |                       | 缓存                 | 缓存       |
| [`fetch` `options.cache`](#fetch-optionscache)                          |                            |                       | 缓存或选择退出      |             |
| [`fetch` `options.next.revalidate`](#fetch-optionsnextrevalidate)       |                            | 重新验证            | 重新验证            |             |
| [`fetch` `options.next.tags`](#fetch-optionsnexttags-and-revalidatetag) |                            | 缓存                 | 缓存                 |             |
| [`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag)             | 重新验证（服务器动作） | 重新验证            | 重新验证            |             |
| [`revalidatePath`](#revalidatepath)                                     | 重新验证（服务器动作） | ### 退出选项

| 功能 | 服务器行为 | 缓存策略 | 备注 |
| --- | --- | --- | --- |
| [`cookies`](#cookies) | 重新验证 | 退出 |  |
| [`headers`, `searchParams`](#dynamic-functions) |  | 退出 |  |
| [`generateStaticParams`](#generatestaticparams) |  | 缓存 |  |
| [`React.cache`](#react-cache-function) |  |  | 缓存 |
| [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache) |  |  | 缓存 |

### `<Link>`

默认情况下，`<Link>` 组件会自动从完整路由缓存中预取路由，并将 React 服务器组件有效载荷添加到路由器缓存中。

要禁用预取，可以将 `prefetch` 属性设置为 `false`。但这不会永久跳过缓存，当用户访问该路由时，路由段仍会在客户端被缓存。

了解更多关于 [`<Link>` 组件](/docs/app/api-reference/components/link)。

### `router.prefetch`

`useRouter` 钩子的 `prefetch` 选项可以用来手动预取路由。这会将 React 服务器组件有效载荷添加到路由器缓存中。

查看 [`useRouter` 钩子](/docs/app/api-reference/functions/use-router) API 参考。

### `router.refresh`

`useRouter` 钩子的 `refresh` 选项可以用来手动刷新路由。这将完全清除路由器缓存，并为当前路由向服务器发起新的请求。`refresh` 不会影响数据或完整路由缓存。

渲染结果将在客户端上进行协调，同时保留 React 状态和浏览器状态。

查看 [`useRouter` 钩子](/docs/app/api-reference/functions/use-router) API 参考。

### `fetch`

从 `fetch` 返回的数据会自动缓存在数据缓存中。

```jsx
// 默认缓存。`force-cache` 是默认选项，可以省略。
fetch(`https://...`, { cache: 'force-cache' })
```

查看 [`fetch` API 参考](/docs/app/api-reference/functions/fetch) 以获取更多选项。

### `fetch options.cache`

你可以通过将 `cache` 选项设置为 `no-store` 来退出个别 `fetch` 请求的数据缓存：

```jsx
// 退出缓存
fetch(`https://...`, { cache: 'no-store' })
```

由于渲染输出依赖于数据，使用 `cache: 'no-store'` 也会跳过使用 `fetch` 请求的路由的完整路由缓存。也就是说，该路由将在每次请求时动态渲染，但你仍然可以在相同路由中拥有其他缓存的数据请求。

查看 [`fetch` API 参考](/docs/app/api-reference/functions/fetch) 以获取更多选项。

### `fetch options.next.revalidate`

你可以使用 `fetch` 的 `next.revalidate` 选项来设置个别 `fetch` 请求的重新验证周期（以秒为单位）。这将重新验证数据缓存，进而重新验证完整路由缓存。将获取新鲜数据，并在服务器上重新渲染组件。

```jsx
// 最多在 1 小时后重新验证
fetch(`https://...`, { next: { revalidate: 3600 } })
```

查看 [`fetch` API 参考](/docs/app/api-reference/functions/fetch) 以获取更多选项。

### `fetch options.next.tags` 和 `revalidateTag`

Next.js 有一个用于细粒度数据缓存和重新验证的缓存标签系统。

1. 当使用 `fetch` 或 [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache) 时，你可以选择用一个或多个标签标记缓存条目。
2. 然后，你可以调用 `revalidateTag` 来清除与该标签关联的缓存条目。

例如，你可以在获取数据时设置一个标签：

```jsx
// 使用标签缓存数据
fetch(`https://...`, { next: { tags: ['tag'] } })
```### 缓存和数据失效

在 Next.js 中，缓存和数据失效是构建快速、高效应用程序的关键部分。以下是一些关键概念和 API，帮助你理解和使用它们：

### 数据缓存

Next.js 通过数据缓存自动为你的应用程序提供快速渲染。数据缓存是全局的，可以用于缓存任何数据，比如 API 响应或数据库查询结果。

#### 自定义数据缓存

你可以使用 `generateDataCache` 函数自定义数据缓存。这个函数接受一个 `context` 对象，并且可以返回一个 Promise 或一个值，该值将被缓存。

```jsx
// app/api/generate-data-cache.js
export default function generateDataCache(context) {
  // 使用 context 来决定要缓存什么数据
  // 返回一个 Promise 或一个值，该值将被缓存
}
```

然后，在你的页面或组件中，使用 `generateDataCache` 函数：

```jsx
// app/page.js
import generateDataCache from 'api/generate-data-cache'

export default async function Page() {
  const data = await generateDataCache(context)
  // 使用 data 渲染你的页面
}
```

### 路由缓存

路由缓存允许你为每个路由段缓存渲染结果。这可以显著提高性能，因为相同的内容可以在不同的请求之间重用。

#### 自动路由缓存

路由缓存默认情况下是启用的，并且 Next.js 会根据路由段的 `revalidate` 属性自动进行数据失效。

#### 手动路由缓存

你可以使用 `revalidateTag` 或 `revalidatePath` 手动进行数据失效。

### `revalidateTag`

`revalidateTag` 允许你通过标签来清除缓存条目。首先，你需要在 `fetch` 方法中为你的数据关联标签：

```jsx
// 在 fetch 方法中为数据关联标签
const { data, revalidateTag } = await fetch('/api/data', {
  ags: ['a', 'b', 'c'] });
```

然后，调用 `revalidateTag` 并传入一个标签，以清除特定的缓存条目：

```jsx
// 清除特定标签的缓存条目
revalidateTag('a')
```

你可以在两个地方使用 `revalidateTag`，具体取决于你想要实现的目标：

1. [路由处理程序](/docs/app/building-your-application/routing/route-handlers) - 响应第三方事件（例如 webhook）来重新验证数据。这不会立即使路由器缓存失效，因为路由处理程序没有绑定到特定路由。
2. [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - 在用户操作（例如表单提交）后重新验证数据。这将使关联路由的路由器缓存失效。

### `revalidatePath`

`revalidatePath` 允许你手动重新验证数据，并在同一操作中重新渲染特定路径下的路由段。调用 `revalidatePath` 方法将重新验证数据缓存，进而使完整路由缓存失效。

```jsx
revalidatePath('/')
```

你可以在两个地方使用 `revalidatePath`，具体取决于你想要实现的目标：

1. [路由处理程序](/docs/app/building-your-application/routing/route-handlers) - 响应第三方事件（例如 webhook）重新验证数据。
2. [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - 在用户交互（例如表单提交、点击按钮）后重新验证数据。

查看 [`revalidatePath` API 参考](/docs/app/api-reference/functions/revalidatePath) 了解更多信息。

> **`revalidatePath`** 与 **`router.refresh`**：
>
> 调用 `router.refresh` 将清除路由器缓存，并在不使数据缓存或完整路由缓存失效的情况下，在服务器上重新渲染路由段。
>
> 区别在于 `revalidatePath` 清除了数据缓存和完整路由缓存，而 `router.refresh()` 不改变数据缓存和完整路由缓存，因为它是一个客户端 API。

### 动态函数

像 `cookies` 和 `headers` 这样的动态函数，以及页面中的 `searchParams` 属性，都依赖于运行时传入请求的信息。使用它们将使路由退出完整路由缓存，换句话说，路由将被动态渲染。

#### `cookies`

在服务器操作中使用 `cookies.set` 或 `cookies.delete` 将使路由器缓存失效，以防止使用 cookies 的路由变得过时（例如，反映认证变更）。

查看 [`cookies`](/docs/app/api-reference/functions/cookies) API 参考。

### 路由段配置选项

路由段配置选项可以用来覆盖路由段的默认设置，或者在你无法使用 `fetch` API 时使用（例如数据库客户端或第三方库）。

以下路由段配置选项将退出数据缓存和完整路由缓存：

- `const dynamic =# utils/get-item.ts 和 utils/get-item.js

多次调用同一个函数，但只执行一次。

由于 `fetch` 请求会自动进行缓存，因此您不需要将其包装在 React 的 `cache` 中。然而，您可以使用 `cache` 来手动缓存数据请求，以应对 `fetch` API 不适用的情况。例如，一些数据库客户端、CMS 客户端或 GraphQL 客户端。

```tsx filename="utils/get-item.ts" switcher
import { cache } from 'react'
import db from '@/lib/db'

export const getItem = cache(async (id: string) => {
  const item = await db.item.findUnique({ id })
  return item
})
```

```jsx filename="utils/get-item.js" switcher
import { cache } from 'react'
import db from '@/lib/db'

export const getItem = cache(async (id) => {
  const item = await db.item.findUnique({ id })
  return item
})
```