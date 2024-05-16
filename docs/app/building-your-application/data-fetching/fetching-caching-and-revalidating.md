---
title: 数据获取、缓存和重新验证
nav_title: 获取、缓存和重新验证
description: 学习如何在您的 Next.js 应用程序中获取、缓存和重新验证数据。
---

数据获取是任何应用程序的核心部分。本页将介绍如何在 React 和 Next.js 中获取、缓存和重新验证数据。

您可以使用以下四种方式获取数据：

1. [在服务器上，使用 `fetch`](#使用-fetch在服务器上获取数据)
2. [在服务器上，使用第三方库](#使用第三方库在服务器上获取数据)
3. [在客户端，通过路由处理器](#使用路由处理器在客户端获取数据)
4. [在客户端，使用第三方库](#使用第三方库在客户端获取数据)。

## 使用 `fetch` 在服务器上获取数据

Next.js 扩展了原生的 [`fetch` Web API](https://developer.mozilla.org/docs/Web/API/Fetch_API)，允许您为服务器上的每个获取请求配置[缓存](#缓存数据)和[重新验证](#重新验证数据)行为。React 扩展了 `fetch`，以在渲染 React 组件树时自动[记忆化](/docs/app/building-your-application/data-fetching/patterns#在需要数据的地方获取数据)获取请求。

您可以在 Server Components 中、在 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 中，以及在 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中使用 `fetch` 与 `async`/`await`。

例如：

```tsx filename="app/page.tsx" switcher
async function getData() {
  const res = await fetch('https://api.example.com/...')
  // 返回值*不会被*序列化
  // 您可以返回 Date, Map, Set 等

  if (!res.ok) {
    // 这将激活最近的 `error.js` 错误边界
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page() {
  const data = await getData()

  return <main></main>
}
```

```jsx filename="app/page.js" switcher
async function getData() {
  const res = await fetch('https://api.example.com/...')
  // 返回值*不会被*序列化
  // 您可以返回 Date, Map, Set 等

  if (!res.ok) {
    // 这将激活最近的 `error.js` 错误边界
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page() {
  const data = await getData()

  return <main></main>
}
```

> **须知**：
>
> - Next.js 提供了在 Server Components 中获取数据时可能需要的有用函数，例如 [`cookies`](/docs/app/api-reference/functions/cookies) 和 [`headers`](/docs/app/api-reference/functions/headers)。这些将导致路由动态呈现，因为它们依赖于请求时的信息。
> - 在路由处理器中，`fetch` 请求不会被记忆化，因为路由处理器不是 React 组件树的一部分。
> - 在 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中，`fetch` 请求不会被缓存（默认 `cache: no-store`）。
> - 在使用 TypeScript 的 Server Component 中使用 `async`/`await`，您需要使用 TypeScript `5.1.3` 或更高版本和 `@types/react` `18.2.8` 或更高版本。
 
### 缓存数据

缓存存储数据，以便在每次请求时不必从数据源重新获取。

默认情况下，Next.js 在服务器上的 [数据缓存](/docs/app/building-your-application/caching#data-cache) 中自动缓存 `fetch` 返回的值。这意味着数据可以在构建时或请求时获取，缓存，并在每个数据请求上重用。

```js
// 'force-cache' 是默认设置，可以省略
fetch('https://...', { cache: 'force-cache' })
```

然而，有一些例外，当 `fetch` 请求在以下情况下不会被缓存：

- 在 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 内部使用。
- 在使用 `POST` 方法的 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 内部使用。

> **什么是数据缓存？**
>
> 数据缓存是一种持久的 [HTTP 缓存](https://developer.mozilla.org/docs/Web/HTTP/Caching)。根据您使用的平台，缓存可以自动扩展，并且可以[跨多个区域共享](https://vercel.com/docs/infrastructure/data-cache)。
>
> 了解更多关于 [数据缓存](/docs/app/building-your-application/caching#data-cache) 的信息。### 数据重新验证

数据重新验证是清除数据缓存并重新获取最新数据的过程。当您的数据发生变化，并且您希望确保显示最新信息时，这非常有用。

缓存数据可以通过两种方式重新验证：

- **基于时间的重新验证**：在一定时间后自动重新验证数据。这适用于不经常变化且新鲜度不是关键的数据。
- **按需重新验证**：根据事件（例如表单提交）手动重新验证数据。按需重新验证可以使用基于标签或基于路径的方法一次性重新验证数据组。当您希望尽快显示最新数据时（例如，当您无头CMS中的内容更新时），这非常有用。

#### 基于时间的重新验证

要定时重新验证数据，可以使用 `fetch` 的 `next.revalidate` 选项来设置资源的缓存生命周期（以秒为单位）。

```js
fetch('https://...', { next: { revalidate: 3600 } })
```

或者，要重新验证路由段中的所有 `fetch` 请求，可以使用[Segment Config Options](/docs/app/api-reference/file-conventions/route-segment-config)。

```jsx filename="layout.js | page.js"
export const revalidate = 3600 // 每小时重新验证一次
```

如果您在静态渲染的路由中有多个fetch请求，并且每个请求有不同的重新验证频率，将使用最低时间用于所有请求。对于动态渲染的路由，每个 `fetch` 请求将独立重新验证。

了解更多关于[基于时间的重新验证](/docs/app/building-your-application/caching#time-based-revalidation)。

#### 按需重新验证

可以通过路径（[`revalidatePath`](/docs/app/api-reference/functions/revalidatePath)）或通过缓存标签（[`revalidateTag`](/docs/app/api-reference/functions/revalidateTag)）在[Server Action](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)或[Route Handler](/docs/app/building-your-application/routing/route-handlers)中按需重新验证数据。

Next.js有一个缓存标签系统，用于使跨路由的 `fetch` 请求失效。

1. 使用 `fetch` 时，您可以选择用一个或多个标签标记缓存条目。
2. 然后，您可以调用 `revalidateTag` 来重新验证与该标签关联的所有条目。

例如，以下 `fetch` 请求添加了缓存标签 `collection`：

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  const res = await fetch('https://...', { next: { tags: ['collection'] } })
  const data = await res.json()
  // ...
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  const res = await fetch('https://...', { next: { tags: ['collection'] } })
  const data = await res.json()
  // ...
}
```

然后，您可以通过在 Server Action 中调用 `revalidateTag` 来重新验证这个带有 `collection` 标签的 `fetch` 调用：

```ts filename="app/actions.ts" switcher
'use server'

import { revalidateTag } from 'next/cache'

export default async function action() {
  revalidateTag('collection')
}
```

```js filename="app/actions.js" switcher
'use server'

import { revalidateTag } from 'next/cache'

export default async function action() {
  revalidateTag('collection')
}
```

了解更多关于[按需重新验证](/docs/app/building-your-application/caching#on-demand-revalidation)。

#### 错误处理和重新验证

如果在尝试重新验证数据时抛出错误，将从缓存中继续提供最后成功生成的数据。在下一次随后的请求中，Next.js将重试重新验证数据。### 数据缓存的禁用

如果满足以下条件，`fetch` 请求将**不会**被缓存：

- 在 `fetch` 请求中添加了 `cache: 'no-store'`。
- 在单个 `fetch` 请求中添加了 `revalidate: 0` 选项。
- `fetch` 请求位于使用 `POST` 方法的路由器处理器中。
- `fetch` 请求在 `headers` 或 `cookies` 的使用之后。
- 使用了 `const dynamic = 'force-dynamic'` 路由段选项。
- `fetchCache` 路由段选项被配置为默认跳过缓存。
- `fetch` 请求使用了 `Authorization` 或 `Cookie` 头，并且在组件树中它的上面有一个未被缓存的请求。

#### 单个 `fetch` 请求

要为单个 `fetch` 请求禁用缓存，你可以在 `fetch` 中将 `cache` 选项设置为 `'no-store'`。这将在每次请求时动态获取数据。

```js filename="layout.js | page.js"
fetch('https://...', { cache: 'no-store' })
```

在 [`fetch` API 参考](/docs/app/api-reference/functions/fetch) 中查看所有可用的 `cache` 选项。

#### 多个 `fetch` 请求

如果在路由段（例如布局或页面）中有多个 `fetch` 请求，你可以使用 [Segment Config Options](/docs/app/api-reference/file-conventions/route-segment-config) 配置该段中所有数据请求的缓存行为。

然而，我们建议单个配置每个 `fetch` 请求的缓存行为。这样可以更细致地控制缓存行为。## 使用第三方库在服务器上获取数据

在您使用不支持或不暴露 `fetch`（例如数据库、CMS或ORM客户端）的第三方库的情况下，您可以使用[路由段配置选项](/docs/app/api-reference/file-conventions/route-segment-config)和React的`cache`函数来配置这些请求的缓存和重新验证行为。

数据是否被缓存将取决于路由段是[静态还是动态渲染](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies)。如果该段是静态的（默认），请求的输出将被缓存，并作为路由段的一部分进行重新验证。如果该段是动态的，请求的输出将不会被缓存，并且每次在渲染该段时都会重新获取。

您还可以使用实验性的[`unstable_cache` API](/docs/app/api-reference/functions/unstable_cache)。

### 示例

在下面的示例中：

- 使用React的`cache`函数来[记忆化](/docs/app/building-your-application/caching#request-memoization)数据请求。
- 在布局和页面段中，`revalidate`选项设置为`3600`，这意味着数据将最多每小时缓存和重新验证一次。

```ts filename="app/utils.ts" switcher
import { cache } from 'react'

export const getItem = cache(async (id: string) => {
  const item = await db.item.findUnique({ id })
  return item
})
```

```js filename="app/utils.js" switcher
import { cache } from 'react'

export const getItem = cache(async (id) => {
  const item = await db.item.findUnique({ id })
  return item
})
```

尽管`getItem`函数被调用了两次，但只会向数据库发出一个查询。

```tsx filename="app/item/[id]/layout.tsx" switcher
import { getItem } from '@/utils/get-item'

export const revalidate = 3600 // 最多每小时重新验证数据一次

export default async function Layout({
  params: { id },
}: {
  params: { id: string }
}) {
  const item = await getItem(id)
  // ...
}
```

```jsx filename="app/item/[id]/layout.js" switcher
import { getItem } from '@/utils/get-item'

export const revalidate = 3600 // 最多每小时重新验证数据一次

export default async function Layout({ params: { id } }) {
  const item = await getItem(id)
  // ...
}
```

```tsx filename="app/item/[id]/page.tsx" switcher
import { getItem } from '@/utils/get-item'

export const revalidate = 3600 // 最多每小时重新验证数据一次

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const item = await getItem(id)
  // ...
}
```

```jsx filename="app/item/[id]/page.js" switcher
import { getItem } from '@/utils/get-item'

export const revalidate = 3600 // 最多每小时重新验证数据一次

export default async function Page({ params: { id } }) {
  const item = await getItem(id)
  // ...
}
```

## 使用路由处理器在客户端获取数据

如果您需要在客户端组件中获取数据，可以从客户端调用[路由处理器](/docs/app/building-your-application/routing/route-handlers)。路由处理器在服务器上执行并返回数据给客户端。当您不想向客户端公开敏感信息（如API令牌）时，这非常有用。

有关示例，请参见[路由处理器](/docs/app/building-your-application/routing/route-handlers)文档。

> **服务器组件和路由处理器**
>
> 由于服务器组件在服务器上渲染，您不需要从服务器组件调用路由处理器来获取数据。相反，您可以直接在服务器组件内获取数据。

**App**## 使用第三方库在客户端获取数据

您还可以使用第三方库（如[SWR](https://swr.vercel.app/)或[TanStack Query](https://tanstack.com/query/latest)）在客户端获取数据。这些库提供了它们自己的API，用于记忆请求、缓存、重新验证和变异数据。

> **须知**：
>
> `use`是一个React函数，它**接受并处理**由函数返回的承诺。在客户端组件中，目前**不推荐**将`fetch`包装在`use`中，因为这可能会触发多次重新渲染。在[React文档](https://react.dev/reference/react/use)中了解更多关于`use`的信息。