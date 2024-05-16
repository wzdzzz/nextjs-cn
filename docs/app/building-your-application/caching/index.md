---
title: Next.js 中的缓存
nav_title: 缓存
description: Next.js 中缓存机制的概述。
---
# Next.js 中的缓存

Next.js 通过缓存渲染工作和数据请求来提高应用程序的性能并降低成本。本页面深入探讨了 Next.js 的缓存机制、您可以使用的配置它们的 API 以及它们之间的相互作用。

> **须知**：本页面帮助您了解 Next.js 的内部工作原理，但**不是**使用 Next.js 的必要知识。Next.js 的大多数缓存启发式规则由您的 API 使用情况决定，并且具有默认值，以实现零配置或最少配置的最佳性能。

## 概览

以下是不同缓存机制及其目的的高级概述：

| 机制                                   | 用途                       | 位置  | 目的                                             | 持续时间                        |
| ---------------------------------------- | -------------------------- | ----- | ----------------------------------------------- | ------------------------------- |
| [请求记忆化](#request-memoization) | 函数的返回值               | 服务器 | 在 React 组件树中重用数据                         | 每个请求生命周期               |
| [数据缓存](#data-cache)                 | 数据                       | 服务器 | 在用户请求和部署之间存储数据                       | 持久性（可以重新验证）           |
| [完整路由缓存](#full-route-cache)       | HTML 和 RSC 有效载荷       | 服务器 | 降低渲染成本并提高性能                           | 持久性（可以重新验证）           |
| [路由器缓存](#router-cache)             | RSC 有效载荷                | 客户端 | 减少导航时的服务器请求                             | 用户会话或基于时间的             |

默认情况下，Next.js 将尽可能多地缓存以提高性能并降低成本。这意味着路由是**静态渲染**的，数据请求是**缓存**的，除非您选择退出。下面的图表显示了默认的缓存行为：当路由在构建时静态渲染，以及当静态路由首次被访问时。

<Image
  alt="图表显示了 Next.js 中四种机制的默认缓存行为，包括在构建时和当路由首次被访问时的 HIT、MISS 和 SET。"
  srcLight="/docs/light/caching-overview.png"
  srcDark="/docs/dark/caching-overview.png"
  width="1600"
  height="1179"
/>

缓存行为会根据路由是静态还是动态渲染、数据是否缓存以及请求是否是初始访问或后续导航而有所不同。根据您的用例，您可以为单个路由和数据请求配置缓存行为。

## 请求记忆化

React 扩展了 [`fetch` API](#fetch)，以自动**记忆化**具有相同 URL 和选项的请求。这意味着你可以在 React 组件树中的多个地方调用相同的获取函数，而只需执行一次。

<Image
  alt="去重的获取请求"
  srcLight="/docs/light/deduplicated-fetch-requests.png"
  srcDark="/docs/dark/deduplicated-fetch-requests.png"
  width="1600"
  height="857"
/>

例如，如果你需要在路由中使用相同的数据（例如在布局、页面和多个组件中），你不必在树的顶部获取数据，并在组件之间转发 props。相反，你可以在需要数据的组件中获取数据，而不必担心为相同数据在网络上进行多次请求的性能影响。

```tsx filename="app/example.tsx" switcher
async function getItem() {
  // `fetch` 函数自动记忆化，结果被缓存
  const res = await fetch('https://.../item/1')
  return res.json()
}

// 这个函数被调用了两次，但只在第一次执行
const item = await getItem() // 缓存未命中

// 第二次调用可以在你的路由中的任何地方
const item = await getItem() // 缓存命中
```

```jsx filename="app/example.js" switcher
async function getItem() {
  // `fetch` 函数自动记忆化，结果被缓存
  const res = await fetch('https://.../item/1')
  return res.json()
}

// 这个函数被调用了两次，但只在第一次执行
const item = await getItem() // 缓存未命中

// 第二次调用可以在你的路由中的任何地方
const item = await getItem() // 缓存命中
```

**请求记忆化如何工作**

<Image
  alt="图表显示了在 React 渲染期间获取记忆化的工作方式。"
  srcLight="/docs/light/request-memoization.png"
  srcDark="/docs/dark/request-memoization.png"
  width="1600"
  height="742"
/>

- 在渲染路由时，第一次调用特定请求时，其结果不会在内存中，它将是一个缓存`MISS`。
- 因此，将执行该函数，从外部源获取数据，并将结果存储在内存中。
- 在同一渲染传递中对该请求的后续函数调用将是缓存`HIT`，并且数据将从内存返回而无需执行该函数。
- 一旦路由已渲染并且渲染传递完成，内存将被“重置”，并且所有请求记忆化条目都将被清除。

> **须知**：
>
> - 请求记忆化是 React 的特性，而不是 Next.js 的特性。它包含在这里是为了展示它如何与其他缓存机制交互。
> - 记忆化仅适用于 `fetch` 请求中的 `GET` 方法。
> - 记忆化仅适用于 React 组件树，这意味着：
>   - 它适用于 `generateMetadata`、`generateStaticParams`、布局、页面和其他服务器组件中的 `fetch` 请求。
>   - 它不适用于路由处理程序中的 `fetch` 请求，因为它们不是 React 组件树的一部分。
> - 对于 `fetch` 不适用的情况（例如某些数据库客户端、CMS 客户端或 GraphQL 客户端），你可以使用 [React `cache` 函数](#react-cache-function) 来记忆化函数。


### 持续时间

缓存持续到服务器请求的生命周期结束，直到 React 组件树完成渲染。


### 重新验证

由于记忆化不跨服务器请求共享，并且仅在渲染期间适用，因此无需重新验证它。


### 退出机制

Memoization（记忆化）仅适用于 `fetch` 请求中的 `GET` 方法，其他方法（如 `POST` 和 `DELETE`）不会被记忆化。这是 React 的默认优化行为，我们不建议您退出此行为。

要管理个别请求，您可以使用 [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 的 [`signal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal) 属性。然而，这不会将请求从记忆化中退出，而是中止正在进行的请求。

```js filename="app/example.js"
const { signal } = new AbortController()
fetch(url, { signal })
```

## 数据缓存

Next.js 内置了数据缓存，它能够**持久化**数据获取的结果，跨越传入的**服务器请求**和**部署**。这是可能的，因为 Next.js 扩展了原生的 `fetch` API，允许每个服务器上的请求设置自己的持久缓存语义。

> **须知**：在浏览器中，`fetch` 的 `cache` 选项指示请求将如何与浏览器的 HTTP 缓存交互，在 Next.js 中，`cache` 选项指示服务器端请求将如何与服务器的数据缓存交互。

默认情况下，使用 `fetch` 的数据请求是**缓存**的。您可以使用 `fetch` 的 [`cache`](#fetch-optionscache) 和 [`next.revalidate`](#fetch-optionsnextrevalidate) 选项来配置缓存行为。

**数据缓存的工作原理**

<Image
  alt="图表展示了缓存和未缓存的 fetch 请求如何与数据缓存交互。缓存的请求存储在数据缓存中，并进行了记忆化，未缓存的请求从数据源获取，不存储在数据缓存中，并进行了记忆化。"
  srcLight="/docs/light/data-cache.png"
  srcDark="/docs/dark/data-cache.png"
  width="1600"
  height="661"
/>

- 在渲染期间第一次调用 `fetch` 请求时，Next.js 会检查数据缓存中是否有缓存的响应。
- 如果找到了缓存的响应，它会立即返回并进行[记忆化](#request-memoization)。
- 如果没有找到缓存的响应，请求会被发送到数据源，结果会被存储在数据缓存中，并进行记忆化。
- 对于未缓存的数据（例如 `{ cache: 'no-store' }`），结果总是从数据源获取，并进行记忆化。
- 无论数据是缓存的还是未缓存的，请求总是进行记忆化，以避免在 React 渲染过程中对相同数据进行重复请求。

> **数据缓存与请求记忆化之间的差异**
>
> 虽然这两种缓存机制都通过重用缓存数据来帮助提高性能，但数据缓存是跨传入请求和部署持久化的，而记忆化仅持续请求的生命周期。
>
> 通过记忆化，我们减少了在相同渲染过程中必须跨越从渲染服务器到数据缓存服务器（例如 CDN 或边缘网络）或数据源（例如数据库或 CMS）的网络边界的**重复**请求数量。通过数据缓存，我们减少了向我们的原始数据源发出的请求数量。


### 持续时间

数据缓存在传入请求和部署中是持久的，除非您重新验证或选择退出。


### 重新验证

缓存数据可以通过两种方式重新验证：

- **基于时间的重新验证**：在一定时间过去后以及新请求发出时重新验证数据。这对于不经常变化且新鲜度不是非常关键的数据非常有用。
- **按需重新验证**：基于事件（例如表单提交）重新验证数据。按需重新验证可以使用基于标签或基于路径的方法一次性重新验证数据组。当您希望尽快展示最新数据时（例如，当您无头CMS中的内容更新时），这非常有用。

#### 基于时间的重新验证

要定时重新验证数据，您可以使用 `fetch` 的 `next.revalidate` 选项来设置资源的缓存生命周期（以秒为单位）。

```js
// 每小时重新验证一次
fetch('https://...', { next: { revalidate: 3600 } })
```

或者，您可以使用[路由片段配置选项](#segment-config-options)来配置一个片段中的所有 `fetch` 请求，或者在您无法使用 `fetch` 的情况下。

**基于时间的重新验证如何工作**

<Image
  alt="图表显示了基于时间的重新验证的工作原理，在重新验证周期后，首次请求返回陈旧数据，然后重新验证数据。"
  srcLight="/docs/light/time-based-revalidation.png"
  srcDark="/docs/dark/time-based-revalidation.png"
  width="1600"
  height="1252"
/>

- 第一次调用带有 `revalidate` 的 fetch 请求时，将从外部数据源获取数据并存储在数据缓存中。
- 在指定的时间框架内（例如60秒）调用的任何请求都将返回缓存的数据。
- 时间框架过后，下一次请求仍将返回缓存的（现在已陈旧的）数据。
  - Next.js 将在后台触发数据的重新验证。
  - 一旦数据成功获取，Next.js 将使用新鲜数据更新数据缓存。
  - 如果后台重新验证失败，先前的数据将保持不变。

这类似于 [**stale-while-revalidate**](https://web.dev/stale-while-revalidate/) 行为。

#### 按需重新验证

可以通过路径（[`revalidatePath`](#revalidatepath)）或通过缓存标签（[`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag)）按需重新验证数据。

**按需重新验证如何工作**

<Image
  alt="图表显示了按需重新验证的工作原理，在重新验证请求后，数据缓存用新鲜数据更新。"
  srcLight="/docs/light/on-demand-revalidation.png"
  srcDark="/docs/dark/on-demand-revalidation.png"
  width="1600"
  height="1082"
/>

- 第一次调用 `fetch` 请求时，将从外部数据源获取数据并存储在数据缓存中。
- 当触发按需重新验证时，适当的缓存条目将从缓存中清除。
  - 这与基于时间的重新验证不同，后者在获取新鲜数据之前保留缓存中的陈旧数据。
- 下次请求时，它将再次成为缓存 `MISS`，并且数据将从外部数据源获取并存储在数据缓存中。
### 禁用缓存

对于单个数据获取操作，你可以通过将 [`cache`](#fetch-optionscache) 选项设置为 `no-store` 来禁用缓存。这意味着每当调用 `fetch` 时，都会获取数据。

```jsx
// 为单个 `fetch` 请求禁用缓存
fetch(`https://...`, { cache: 'no-store' })
```

或者，你也可以使用 [路由片段配置选项](#segment-config-options) 来为特定路由片段禁用缓存。这将影响路由片段中的所有数据请求，包括第三方库。

```jsx
// 为路由片段中的所有数据请求禁用缓存
export const dynamic = 'force-dynamic'
```

> **须知**：数据缓存目前仅在页面/路由中可用，不适用于中间件。在中间件中执行的任何获取操作默认情况下都是未缓存的。

> **Vercel 数据缓存**
>
> 如果你的 Next.js 应用程序部署在 Vercel 上，我们建议你阅读 [Vercel 数据缓存](https://vercel.com/docs/infrastructure/data-cache) 文档，以更好地理解 Vercel 特有的特性。

## 全路由缓存

> **相关术语**：
>
> 你可能会发现 **自动静态优化**、**静态站点生成** 或 **静态渲染** 这些术语被交替使用，以指代在构建时渲染和缓存应用程序路由的过程。

Next.js 会在构建时自动渲染和缓存路由。这是一种优化，允许你提供缓存的路由，而不是对每个请求都进行服务器端渲染，从而实现更快的页面加载。

要理解全路由缓存的工作原理，看看 React 如何处理渲染以及 Next.js 如何缓存结果是很有帮助的：


### 1. 服务器上的 React 渲染

在服务器上，Next.js 使用 React 的 API 来协调渲染。渲染工作被分成多个块：由单独的路由片段和 Suspense 边界组成。

每个块的渲染分为两个步骤：

1. React 将服务器组件渲染成一种特殊的数据格式，这种格式针对流式传输进行了优化，称为 **React 服务器组件负载**。
2. Next.js 使用 React 服务器组件负载和客户端组件 JavaScript 指令在服务器上渲染 **HTML**。

这意味着我们不必等待所有内容渲染完成后再缓存工作或发送响应。相反，我们可以在完成工作时流式传输响应。

> **什么是 React 服务器组件负载？**
>
> React 服务器组件负载是渲染后的 React 服务器组件树的紧凑二进制表示。它由 React 在客户端用来更新浏览器的 DOM。React 服务器组件负载包含：
>
> - 服务器组件的渲染结果
> - 客户端组件应该渲染的位置的占位符及其 JavaScript 文件的引用
> - 从服务器组件传递给客户端组件的任何属性
>
> 要了解更多信息，请查看 [服务器组件](/docs/app/building-your-application/rendering/server-components) 文档。


### 2. 服务器上的 Next.js 缓存（全路由缓存）

<Image
  alt="全路由缓存的默认行为，展示了 React 服务器组件负载和 HTML 如何在服务器上为静态渲染路由进行缓存。"
  srcLight="/docs/light/full-route-cache.png"
  srcDark="/docs/dark/full-route-cache.png"
  width="1600"
  height="888"
/>
### 3. 客户端的 React 水合和协调

在客户端请求时：

1. HTML 用于立即显示客户端和服务器组件的快速非交互式初始预览。
2. React 服务器组件负载用于协调客户端和渲染的服务器组件树，并更新 DOM。
3. JavaScript 指令用于 [水合](https://react.dev/reference/react-dom/client/hydrateRoot) 客户端组件并使应用程序交互式。


### 4. 客户端的 Next.js 缓存（路由器缓存）

React 服务器组件负载存储在客户端的 [路由器缓存](#router-cache) 中 - 这是一个单独的内存缓存，按各个路由段分割。这个路由器缓存用于通过存储先前访问的路由和预取未来路由来改善导航体验。


### 5. 后续导航

在后续导航或在预取期间，Next.js 将检查 React 服务器组件负载是否存储在路由器缓存中。如果是，它将跳过向服务器发送新请求。

如果路由段不在缓存中，Next.js 将从服务器获取 React 服务器组件负载，并在客户端填充路由器缓存。


### 静态和动态渲染

路线在构建时是否被缓存取决于它是静态还是动态渲染。静态路由默认情况下会被缓存，而动态路由则在请求时渲染，不会被缓存。

这张图显示了静态和动态渲染路线之间的区别，以及缓存和未缓存数据的影响：

<Image
  alt="静态和动态渲染如何影响完整路由缓存。静态路由在构建时或数据重新验证后被缓存，而动态路由从不被缓存"
  srcLight="/docs/light/static-and-dynamic-routes.png"
  srcDark="/docs/dark/static-and-dynamic-routes.png"
  width="1600"
  height="1314"
/>

了解更多关于 [静态和动态渲染](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies)。


### 持续时间

默认情况下，完整路由缓存是持久的。这意味着渲染输出在用户请求之间被缓存。


### 使缓存失效

您可以通过以下两种方式使完整路由缓存失效：

- **[重新验证数据](/docs/app/building-your-application/caching#revalidating)**：重新验证 [数据缓存](#data-cache) 将通过在服务器上重新渲染组件并缓存新的渲染输出来间接使路由器缓存失效。
- **重新部署**：与跨部署持久的数据缓存不同，完整路由缓存在新部署时会被清除。


### 选择退出

您可以通过以下方式选择退出完整路由缓存，或者换句话说，为每个传入的请求动态渲染组件：

- **使用 [动态函数](#dynamic-functions)**：这将使路线退出完整路由缓存，并在请求时动态渲染它。数据缓存仍然可以使用。
- **使用 `dynamic = 'force-dynamic'` 或 `revalidate = 0` 路线段配置选项**：这将跳过完整路由缓存和数据缓存。这意味着组件将在每个传入的服务器请求上渲染，并且数据将在每个请求上获取。路由器缓存仍然适用，因为它是客户端缓存。
- **选择退出 [数据缓存](#data-cache)**：如果一个路线有一个 `fetch` 请求，该请求没有被缓存，这将使路线退出完整路由缓存。特定 `fetch` 请求的数据将为每个传入的请求获取。其他没有选择退出缓存的 `fetch` 请求仍然会在数据缓存中被缓存。这允许缓存和未缓存数据的混合。

## Router Cache

> **相关术语：**
>
> 您可能会看到Router Cache被称为**客户端缓存**或**预取缓存**。**预取缓存**指的是预取的路由片段，而**客户端缓存**指的是整个Router缓存，包括已访问和预取的片段。
> 此缓存特别适用于Next.js和Server Components，与浏览器的[bfcache](https://web.dev/bfcache/)不同，尽管它们有类似的结果。

Next.js具有一个内存中的客户端缓存，用于存储React Server Component Payload，按单个路由片段分割，在用户会话期间存储。这被称为Router Cache。

**Router Cache的工作原理**

<Image
  alt="How the Router cache works for static and dynamic routes, showing MISS and HIT for initial and subsequent navigations."
  srcLight="/docs/light/router-cache.png"
  srcDark="/docs/dark/router-cache.png"
  width="1600"
  height="1375"
/>

当用户在路由之间导航时，Next.js会缓存已访问的路由片段，并根据其视口中的`<Link>`组件，[预取](/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)用户可能导航到的路由。

这为用户带来了改进的导航体验：

- 由于访问的路由被缓存，因此可以即时向后/向前导航，并且由于预取和[部分渲染](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，可以快速导航到新路由。
- 导航之间没有全页面重新加载，并且React状态和浏览器状态都被保留。

> **Router Cache和Full Route Cache之间的区别：**
>
> Router Cache在用户会话期间临时在浏览器中存储React Server Component Payload，而Full Route Cache则在服务器上持久存储React Server Component Payload和HTML，跨越多个用户请求。
>
> 虽然Full Route Cache仅缓存静态渲染的路由，但Router Cache适用于静态和动态渲染的路由。


### 持续时间

缓存存储在浏览器的临时内存中。两个因素决定了路由器缓存持续的时间：

- **会话**：缓存在导航中持续存在。但是，在页面刷新时会被清除。
- **自动失效周期**：单个片段的缓存在特定时间后自动失效。持续时间取决于资源是如何[预取的](/docs/app/api-reference/components/link#prefetch)：
  - **默认预取**（`prefetch={null}`或未指定）：30秒
  - **完全预取**（`prefetch={true}`或`router.prefetch`）：5分钟

虽然页面刷新将清除**所有**缓存片段，但自动失效周期仅影响从预取时间开始的单个片段。

> **注意**：从[v14.2.0](https://github.com/vercel/next.js/releases/tag/v14.2.0)开始，有[实验性支持](/docs/app/api-reference/next-config-js/staleTimes)配置这些值。


### 失效

您可以通过两种方式使Router Cache失效：

- 在**服务器操作**中：
  - 通过路径按需重新验证数据（[`revalidatePath`](/docs/app/api-reference/functions/revalidatePath)）或通过缓存标签重新验证数据（[`revalidateTag`](/docs/app/api-reference/functions/revalidateTag)）
  - 使用[`cookies.set`](/docs/app/api-reference/functions/cookies#cookiessetname-value-options)或[`cookies.delete`](/docs/app/api-reference/functions/cookies#deleting-cookies)使Router Cache失效，以防止使用cookie的路由变得过时（例如认证）。
- 调用[`router.refresh`](/docs/app/api-reference/functions/use-router)将使Router Cache失效，并对当前路由向服务器发起新的请求。
### 退出机制

无法退出路由器缓存。但是，您可以通过调用 [`router.refresh`](/docs/app/api-reference/functions/use-router)、[`revalidatePath`](/docs/app/api-reference/functions/revalidatePath) 或 [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag)（见上文）来使缓存失效。这将清除缓存并重新向服务器发出请求，确保显示最新数据。

您还可以通过将 `<Link>` 组件的 `prefetch` 属性设置为 `false` 来退出 **预取**。但是，这仍将临时存储路由片段 30 秒，以允许在嵌套段之间（例如标签栏）或前进和后退导航之间即时导航。访问过的路由仍将被缓存。

## 缓存交互

在配置不同的缓存机制时，了解它们如何相互交互非常重要：


### 数据缓存和完整路由缓存

- 重新验证或退出数据缓存 **将** 使完整路由缓存失效，因为渲染输出依赖于数据。
- 使完整路由缓存失效或退出 **不** 影响数据缓存。您可以动态渲染具有缓存和未缓存数据的路由。当您的页面大部分使用缓存数据，但有一些组件依赖于需要在请求时获取的数据时，这非常有用。您可以在不担心重新获取所有数据的性能影响的情况下进行动态渲染。


### 数据缓存和客户端路由器缓存

- 在 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 中重新验证数据缓存 **不会** 立即使路由器缓存失效，因为路由处理器不与特定路由绑定。这意味着路由器缓存将继续提供先前的负载，直到进行硬刷新，或自动失效期已过。
- 要立即使数据缓存和路由器缓存失效，您可以在 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中使用 [`revalidatePath`](#revalidatepath) 或 [`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag)。

## API

下表提供了不同 Next.js API 如何影响缓存的概览：

| API                                                                     | 路由器缓存               | 完整路由缓存      | 数据缓存            | React 缓存 |
| ----------------------------------------------------------------------- | -------------------------- | --------------------- | --------------------- | ----------- |
| [`<Link prefetch>`](#link)                                              | 缓存                      |                       |                       |             |
| [`router.prefetch`](#routerprefetch)                                    | 缓存                      |                       |                       |             |
| [`router.refresh`](#routerrefresh)                                      | 重新验证                 |                       |                       |             |
| [`fetch`](#fetch)                                                       |                            |                       | 缓存                 | 缓存       |
| [`fetch` `options.cache`](#fetch-optionscache)                          |                            |                       | 缓存或选择退出      |             |
| [`fetch` `options.next.revalidate`](#fetch-optionsnextrevalidate)       |                            | 重新验证            | 重新验证            |             |
| [`fetch` `options.next.tags`](#fetch-optionsnexttags-and-revalidatetag) |                            | 缓存                 | 缓存                 |             |
| [`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag)             | 重新验证（服务器操作） | 重新验证            | 重新验证            |             |
| [`revalidatePath`](#revalidatepath)                                     | 重新验证（服务器操作） | 重新验证            | 重新验证            |             |
| [`const revalidate`](#segment-config-options)                           |                            | 重新验证或选择退出 | 重新验证或选择退出 |             |
| [`const dynamic`](#segment-config-options)                              |                            | 缓存或选择退出      | 缓存或选择退出      |             |
| [`cookies`](#cookies)                                                   | 重新验证（服务器操作） | 选择退出               |                       |             |
| [`headers`, `searchParams`](#dynamic-functions)                         |                            | 选择退出               |                       |             |
| [`generateStaticParams`](#generatestaticparams)                         |                            | 缓存                 |                       |             |
| [`React.cache`](#react-cache-function)                                  |                            |                       |                       | 缓存       |
| [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache)    |                            |                       | 缓存                 |             |


### `<Link>`

默认情况下，`<Link>` 组件会自动从完整路由缓存中预取路由，并将 React 服务器组件有效载荷添加到路由器缓存中。

要禁用预取，可以将 `prefetch` 属性设置为 `false`。但这不会永久跳过缓存，当用户访问该路由时，路由段仍将在客户端被缓存。

了解更多关于 [`<Link>` 组件](/docs/app/api-reference/components/link)。


### `router.prefetch`

`useRouter` 钩子的 `prefetch` 选项可用于手动预取路由。这将把 React 服务器组件有效载荷添加到路由器缓存中。

查看 [`useRouter` 钩子](/docs/app/api-reference/functions/use-router) API 参考。
### `router.refresh`

`useRouter` 钩子的 `refresh` 选项可用于手动刷新路由。这将完全清除路由器缓存，并为当前路由向服务器发起新的请求。`refresh` 不会影响数据或完整路由缓存。

渲染结果将在客户端上进行调和，同时保留 React 状态和浏览器状态。

请参阅 [`useRouter` 钩子](/docs/app/api-reference/functions/use-router) API 参考。


### `fetch`

从 `fetch` 返回的数据会自动缓存在数据缓存中。

```jsx
// 默认情况下会被缓存。`force-cache` 是默认选项，可以省略。
fetch(`https://...`, { cache: 'force-cache' })
```

有关更多选项，请参阅 [`fetch` API 参考](/docs/app/api-reference/functions/fetch)。


### `fetch options.cache`

您可以通过将 `cache` 选项设置为 `no-store` 来选择退出个别 `fetch` 请求的数据缓存：

```jsx
// 选择退出缓存
fetch(`https://...`, { cache: 'no-store' })
```

由于渲染输出依赖于数据，使用 `cache: 'no-store'` 也将跳过使用 `fetch` 请求的路由的完整路由缓存。也就是说，每次请求都会动态渲染该路由，但您仍然可以在相同路由中拥有其他缓存数据请求。

有关更多选项，请参阅 [`fetch` API 参考](/docs/app/api-reference/functions/fetch)。


### `fetch options.next.revalidate`

您可以使用 `fetch` 的 `next.revalidate` 选项来设置个别 `fetch` 请求的重新验证周期（以秒为单位）。这将重新验证数据缓存，进而重新验证完整路由缓存。将获取新鲜数据，并在服务器上重新渲染组件。

```jsx
// 最多在 1 小时后重新验证
fetch(`https://...`, { next: { revalidate: 3600 } })
```

有关更多选项，请参阅 [`fetch` API 参考](/docs/app/api-reference/functions/fetch)。


### `fetch options.next.tags` 和 `revalidateTag`

Next.js 有一个用于细粒度数据缓存和重新验证的缓存标签系统。

1. 使用 `fetch` 或 [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache) 时，您可以选择使用一个或多个标签标记缓存条目。
2. 然后，您可以调用 `revalidateTag` 来清除与该标签关联的缓存条目。

例如，您可以在获取数据时设置一个标签：

```jsx
// 使用标签缓存数据
fetch(`https://...`, { next: { tags: ['a', 'b', 'c'] } })
```

然后，使用一个标签调用 `revalidateTag` 来清除缓存条目：

```jsx
// 使用特定标签重新验证条目
revalidateTag('a')
```

您可以在两个地方使用 `revalidateTag`，具体取决于您要实现的目标：

1. [路由处理器](/docs/app/building-your-application/routing/route-handlers) - 响应第三方事件（例如，webhook）重新验证数据。由于路由处理器不与特定路由绑定，因此这不会使路由器缓存立即失效。
2. [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - 在用户操作（例如，表单提交）后重新验证数据。这将使相关路由的路由器缓存失效。
### `revalidatePath`

`revalidatePath` 允许您手动重新验证数据 **和** 重新渲染特定路径下的路由段，所有这些操作只需一次调用。调用 `revalidatePath` 方法会重新验证数据缓存，进而使完整路由缓存失效。

```jsx
revalidatePath('/')
```

您可以根据要实现的目标，在两个地方使用 `revalidatePath`：

1. [路由处理器](/docs/app/building-your-application/routing/route-handlers) - 响应第三方事件（例如，webhook）重新验证数据。
2. [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - 用户交互后（例如，表单提交，点击按钮）重新验证数据。

有关更多信息，请查看 [`revalidatePath` API 参考](/docs/app/api-reference/functions/revalidatePath)。

> **`revalidatePath`** 与 **`router.refresh`**：
>
> 调用 `router.refresh` 将清除路由器缓存，并在不使数据缓存或完整路由缓存失效的情况下，在服务器上重新渲染路由段。
>
> 区别在于 `revalidatePath` 清除了数据缓存和完整路由缓存，而 `router.refresh()` 由于是一个客户端 API，不会改变数据缓存和完整路由缓存。


### 动态函数

动态函数如 `cookies` 和 `headers`，以及 Pages 中的 `searchParams` 属性依赖于运行时传入请求的信息。使用它们将使路由退出完整路由缓存，换句话说，路由将被动态渲染。

#### `cookies`

在服务器操作中使用 `cookies.set` 或 `cookies.delete` 将使路由器缓存失效，以防止使用 cookies 的路由变得过时（例如，反映认证变更）。

请查看 [`cookies`](/docs/app/api-reference/functions/cookies) API 参考。


### 段配置选项

路由段配置选项可以用来覆盖路由段的默认设置，或者当您无法使用 `fetch` API 时（例如，数据库客户端或第三方库）。

以下路由段配置选项将退出数据缓存和完整路由缓存：

- `const dynamic = 'force-dynamic'`
- `const revalidate = 0`

有关更多选项，请查看 [路由段配置](/docs/app/api-reference/file-conventions/route-segment-config) 文档。


### `generateStaticParams`

对于 [动态段](/docs/app/building-your-application/routing/dynamic-routes)（例如 `app/blog/[slug]/page.js`），`generateStaticParams` 提供的路径将在构建时缓存在完整路由缓存中。在请求时，Next.js 也会缓存在构建时未知的路径，这些路径在首次访问时会被缓存。

您可以通过在路由段中使用 `export const dynamicParams = false` 选项来禁用请求时的缓存。当使用此配置选项时，只有 `generateStaticParams` 提供的路径会被服务，其他路由将返回 404 或匹配（在 [全捕获路由](/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments) 的情况下）。

请查看 [`generateStaticParams` API 参考](/docs/app/api-reference/functions/generate-static-params)。
### React `cache` 函数

React `cache` 函数允许你记住一个函数的返回值，这样你可以多次调用同一个函数，但只执行一次。

由于 `fetch` 请求会自动记住，你不需要用 React `cache` 包装它。然而，当 `fetch` API 不适用时，你可以使用 `cache` 手动记住数据请求。例如，一些数据库客户端、CMS客户端或GraphQL客户端。

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