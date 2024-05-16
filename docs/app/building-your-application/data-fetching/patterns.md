---
title: 模式和最佳实践
nav_title: 数据获取模式和最佳实践
description: 了解React和Next.js中常见的数据获取模式。
---

在React和Next.js中，有几种推荐的模式和最佳实践用于获取数据。本页将介绍一些最常见的模式以及如何使用它们。

## 服务器端获取数据

我们建议尽可能在服务器上使用服务器组件获取数据。这允许您：

- 直接访问后端数据资源（例如数据库）。
- 通过防止敏感信息（如访问令牌和API密钥）暴露给客户端，使您的应用程序更安全。
- 在同一环境中获取数据并进行渲染。这减少了客户端和服务器之间的来回通信，以及客户端上的[主线程工作](https://vercel.com/blog/how-react-18-improves-application-performance)。
- 通过单个往返而不是客户端上的多个单独请求来执行多个数据获取。
- 减少客户端-服务器[瀑布流](#并行和顺序数据获取)。
- 根据您的地区，数据获取也可以更靠近您的数据源发生，从而减少延迟并提高性能。

然后，您可以使用[服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)来变异或更新数据。

## 在需要的地方获取数据

如果您需要在树中的多个组件中使用相同的数据（例如当前用户），则无需全局获取数据，也无需在组件之间转发属性。相反，您可以在需要数据的组件中使用`fetch`或React `cache`，而不必担心为相同数据进行多次请求的性能影响。

之所以可能，是因为`fetch`请求会自动进行记忆化。了解更多关于[请求记忆化](/docs/app/building-your-application/caching#request-memoization)的信息。

> **须知**：这也适用于布局，因为无法在父布局和其子代之间传递数据。

## 流式传输

流式传输和[Suspense](https://react.dev/reference/react/Suspense)是React的功能，允许您逐步渲染并逐步将渲染的UI单元流式传输到客户端。

使用服务器组件和[嵌套布局](/docs/app/building-your-application/routing/layouts-and-templates)，您可以立即渲染不需要特定数据的页面部分，并为正在获取数据的页面部分显示[加载状态](/docs/app/building-your-application/routing/loading-ui-and-streaming)。这意味着用户不必等待整个页面加载完毕才能开始与其交互。

<Image
  alt="带流式传输的服务器渲染"
  srcLight="/docs/light/server-rendering-with-streaming.png"
  srcDark="/docs/dark/server-rendering-with-streaming.png"
  width="1600"
  height="785"
/>

要了解更多关于流式传输和Suspense的信息，请查看[加载UI](/docs/app/building-your-application/routing/loading-ui-and-streaming)和[流式传输和Suspense](/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)页面。## 并行与顺序数据获取

在 React 组件内获取数据时，您需要了解两种数据获取模式：并行和顺序。

<Image
  alt="顺序和并行数据获取"
  srcLight="/docs/light/sequential-parallel-data-fetching.png"
  srcDark="/docs/dark/sequential-parallel-data-fetching.png"
  width="1600"
  height="525"
/>

- **顺序数据获取**：在路由中的请求相互依赖，因此会创建瀑布流。在某些情况下，您可能希望使用这种模式，因为一个获取操作依赖于另一个获取操作的结果，或者您希望在下一个获取操作之前满足某个条件以节省资源。然而，这种行为也可能是无意的，导致加载时间更长。
- **并行数据获取**：在路由中的请求被急切地启动，并将同时加载数据。这减少了客户端-服务器瀑布流和加载数据所需的总时间。

### 顺序数据获取

如果您有嵌套组件，并且每个组件都获取自己的数据，那么如果这些数据请求是不同的（这不适用于相同数据的请求，因为它们会自动被[记忆化](/docs/app/building-your-application/caching#request-memoization)），则数据获取将顺序发生。

例如，`Playlists` 组件只有在 `Artist` 组件完成数据获取后才会开始获取数据，因为 `Playlists` 依赖于 `artistID` 属性：

```tsx filename="app/artist/[username]/page.tsx" switcher
// ...

async function Playlists({ artistID }: { artistID: string }) {
  // 等待播放列表
  const playlists = await getArtistPlaylists(artistID)

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}

export default async function Page({
  params: { username },
}: {
  params: { username: string }
}) {
  // 等待艺术家
  const artist = await getArtist(username)

  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}
```

```jsx filename="app/artist/[username]/page.js" switcher
// ...

async function Playlists({ artistID }) {
  // 等待播放列表
  const playlists = await getArtistPlaylists(artistID)

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}

export default async function Page({ params: { username } }) {
  // 等待艺术家
  const artist = await getArtist(username)

  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}
```

在这种情况下，您可以使用 [`loading.js`](/docs/app/building-your-application/routing/loading-ui-and-streaming)（对于路由段）或 React `<Suspense>`（对于嵌套组件）来显示即时加载状态，同时 React 流式传输结果。

这将防止整个路由被数据获取阻塞，用户将能够与未被阻塞的页面部分进行交互。

> **阻塞数据请求：**
>
> 阻止瀑布流的另一种方法是在应用程序的根处全局获取数据，但这将阻止所有路由段的渲染，直到数据完成加载。这可以被描述为“全有或全无”的数据获取。您要么拥有页面或应用程序的全部数据，要么一无所有。
>
> 任何带有 `await` 的获取请求都将阻止其下方整个树的渲染和数据获取，除非它们被包装在 `<Suspense>` 边界内或使用了 `loading.js`。另一种选择是使用 [并行数据获取](#parallel-data-fetching) 或 [预加载模式](#preloading-data)。### 并行数据获取

为了并行获取数据，你可以通过在组件外部定义请求，然后在组件内部调用它们来积极地启动请求。这样可以节省时间，因为同时启动了两个请求，但是用户将不会看到渲染结果，直到两个承诺都被解决。

在下面的示例中，`getArtist` 和 `getArtistAlbums` 函数在 `Page` 组件外部定义，然后在组件内部被调用，我们等待两个承诺解决：

```tsx filename="app/artist/[username]/page.tsx" switcher
import Albums from './albums'

async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}

async function getArtistAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}

export default async function Page({
  params: { username },
}: {
  params: { username: string }
}) {
  // 并行启动两个请求
  const artistData = getArtist(username)
  const albumsData = getArtistAlbums(username)

  // 等待承诺解决
  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums}></Albums>
    </>
  )
}
```

```jsx filename="app/artist/[username]/page.js" switcher
import Albums from './albums'

async function getArtist(username) {
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}

async function getArtistAlbums(username) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}

export default async function Page({ params: { username } }) {
  // 并行启动两个请求
  const artistData = getArtist(username)
  const albumsData = getArtistAlbums(username)

  // 等待承诺解决
  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums}></Albums>
    </>
  )
}
```

为了改善用户体验，你可以添加一个 [Suspense Boundary](/docs/app/building-your-application/routing/loading-ui-and-streaming) 来分割渲染工作，并尽可能快地显示部分结果。## 预加载数据

另一种防止瀑布流的方法是使用预加载模式。你可以创建一个可选的 `preload` 函数来进一步优化并行数据获取。通过这种方法，你不必将承诺作为属性传递下去。`preload` 函数也可以有任意名称，因为它是一种模式，而不是一个API。

```tsx filename="components/Item.tsx" switcher
import { getItem } from '@/utils/get-item'

export const preload = (id: string) => {
  // void 计算给定的表达式并返回未定义
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/void
  void getItem(id)
}
export default async function Item({ id }: { id: string }) {
  const result = await getItem(id)
  // ...
}
```

```jsx filename="components/Item.js" switcher
import { getItem } from '@/utils/get-item'

export const preload = (id) => {
  // void 计算给定的表达式并返回未定义
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/void
  void getItem(id)
}
export default async function Item({ id }) {
  const result = await getItem(id)
  // ...
}
```

```tsx filename="app/item/[id]/page.tsx" switcher
import Item, { preload, checkIsAvailable } from '@/components/Item'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  // 开始加载项目数据
  preload(id)
  // 执行另一个异步任务
  const isAvailable = await checkIsAvailable()

  return isAvailable ? <Item id={id} /> : null
}
```

```jsx filename="app/item/[id]/page.js" switcher
import Item, { preload, checkIsAvailable } from '@/components/Item'

export default async function Page({ params: { id } }) {
  // 开始加载项目数据
  preload(id)
  // 执行另一个异步任务
  const isAvailable = await checkIsAvailable()

  return isAvailable ? <Item id={id} /> : null
}
```

### 使用 React `cache`、`server-only` 和预加载模式

你可以结合 `cache` 函数、`preload` 模式和 `server-only` 包来创建一个可以在你的应用程序中使用的数据获取工具。

```ts filename="utils/get-item.ts" switcher
import { cache } from 'react'
import 'server-only'

export const preload = (id: string) => {
  void getItem(id)
}

export const getItem = cache(async (id: string) => {
  // ...
})
```

```js filename="utils/get-item.js" switcher
import { cache } from 'react'
import 'server-only'

export const preload = (id) => {
  void getItem(id)
}

export const getItem = cache(async (id) => {
  // ...
})
```

通过这种方法，你可以急切地获取数据，缓存响应，并保证这个数据获取[只在服务器上发生](/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment)。

`utils/get-item` 导出可以由布局、页面或其他组件使用，以控制何时获取项目的数据处理。

> **须知：**
>
> - 我们建议使用 [`server-only` 包](/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment) 以确保服务器数据获取函数永远不会在客户端上使用。## 防止敏感数据暴露给客户端

我们建议使用React的污点API，[`taintObjectReference`](https://react.dev/reference/react/experimental_taintObjectReference)和[`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue)，以防止将整个对象实例或敏感值传递给客户端。

要在您的应用程序中启用污点处理，请将Next.js配置的`experimental.taint`选项设置为`true`：

```js filename="next.config.js"
module.exports = {
  experimental: {
    taint: true,
  },
}
```

然后将您想要污点处理的对象或值传递给`experimental_taintObjectReference`或`experimental_taintUniqueValue`函数：

```ts filename="app/utils.ts" switcher
import { queryDataFromDB } from './api'
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from 'react'

export async function getUserData() {
  const data = await queryDataFromDB()
  experimental_taintObjectReference(
    '不要将整个用户对象传递给客户端',
    data
  )
  experimental_taintUniqueValue(
    "不要将用户的地址传递给客户端",
    data,
    data.address
  )
  return data
}
```

```js filename="app/utils.js" switcher
import { queryDataFromDB } from './api'
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from 'react'

export async function getUserData() {
  const data = await queryDataFromDB()
  experimental_taintObjectReference(
    '不要将整个用户对象传递给客户端',
    data
  )
  experimental_taintUniqueValue(
    "不要将用户的地址传递给客户端",
    data,
    data.address
  )
  return data
}
```

```tsx filename="app/page.tsx" switcher
import { getUserData } from './data'

export async function Page() {
  const userData = getUserData()
  return (
    <ClientComponent
      user={userData} // 由于taintObjectReference，这将导致错误
      address={userData.address} // 由于taintUniqueValue，这将导致错误
    />
  )
}
```

```jsx filename="app/page.js" switcher
import { getUserData } from './data'

export async function Page() {
  const userData = await getUserData()
  return (
    <ClientComponent
      user={userData} // 由于taintObjectReference，这将导致错误
      address={userData.address} // 由于taintUniqueValue，这将导致错误
    />
  )
}
```

了解更多关于[安全性和服务器操作](https://nextjs.org/blog/security-nextjs-server-components-actions)的信息。