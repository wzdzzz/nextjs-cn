# 数据获取模式和最佳实践

## 在服务器上获取数据

我们建议尽可能在服务器上使用服务器组件来获取数据。这样做可以：

- 直接访问后端数据资源（例如数据库）。
- 通过防止敏感信息（如访问令牌和API密钥）暴露给客户端，使应用程序更安全。
- 在同一环境中获取数据和渲染。这减少了客户端和服务器之间的来回通信，以及客户端上的[主线程工作](https://vercel.com/blog/how-react-18-improves-application-performance)。
- 通过单个往返而不是客户端上的多个单独请求来执行多个数据获取。
- 减少客户端-服务器[瀑布流](#并行和顺序数据获取)。
- 根据您所在的地区，数据获取也可以更接近您的数据源，从而降低延迟并提高性能。

然后，您可以使用[服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)来变异或更新数据。

## 在需要的地方获取数据

如果您需要在树中的多个组件中使用相同的数据（例如当前用户），您不必全局获取数据，也不必在组件之间转发属性。相反，您可以在需要数据的组件中使用`fetch`或React `cache`，而不必担心为相同数据进行多次请求的性能影响。

这是因为`fetch`请求会自动记忆化。了解更多关于[请求记忆化](/docs/app/building-your-application/caching#request-memoization)的信息。

> **须知**：这也适用于布局，因为无法在父布局和其子组件之间传递数据。

## 流式传输

流式传输和[Suspense](https://react.dev/reference/react/Suspense)是React的功能，允许您逐步渲染并逐步流式传输UI的渲染单元到客户端。

使用服务器组件和[嵌套布局](/docs/app/building-your-application/routing/layouts-and-templates)，您可以立即渲染不需要特定数据的页面部分，并为正在获取数据的页面部分显示[加载状态](/docs/app/building-your-application/routing/loading-ui-and-streaming)。这意味着用户不必等待整个页面加载完毕才能开始与其交互。

![Server Rendering with Streaming](/docs/light/server-rendering-with-streaming.png)

要了解更多关于流式传输和Suspense的信息，请查看[加载UI](/docs/app/building-your-application/routing/loading-ui-and-streaming)和[流式传输和Suspense](/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)页面。
# Parallel and sequential data fetching

在React组件中获取数据时，您需要了解两种数据获取模式：并行和顺序。

![Sequential and Parallel Data Fetching](/docs/light/sequential-parallel-data-fetching.png)

- 使用**顺序数据获取**时，路由中的请求相互依赖，因此会创建瀑布流。在某些情况下，您可能希望采用这种模式，因为一个获取依赖于另一个获取的结果，或者您希望在进行下一个获取之前满足某个条件以节省资源。然而，这种行为也可能是无意的，导致加载时间更长。
- 使用**并行数据获取**时，路由中的请求会立即启动并同时加载数据。这减少了客户端-服务器瀑布流和加载数据所需的总时间。

### 顺序数据获取

如果您有嵌套组件，并且每个组件都获取自己的数据，那么如果这些数据请求不同，则数据获取将顺序发生（这不适用于相同数据的请求，因为它们会自动[记忆化](/docs/app/building-your-application/caching#request-memoization)）。

例如，`Playlists`组件只有在`Artist`组件完成数据获取后才会开始获取数据，因为`Playlists`依赖于`artistID`属性：

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

在这种情况下，您可以使用[`loading.js`](/docs/app/building-your-application/routing/loading-ui-and-streaming)（用于路由段）或React `<Suspense>`（用于嵌套组件）来显示即时加载状态，同时React正在流式传输结果。

这将防止整个路由被数据获取阻塞，用户将能够与未被阻塞的页面部分进行交互。

> **阻止数据请求：**
>
> 阻止瀑布流的另一种方法是在应用程序的根处全局获取数据，但这将阻止所有路由段的渲染，直到数据加载完成。这可以被描述为“全部或无”数据获取。要么您拥有页面或应用程序的全部数据，要么没有。
>
> 任何带有`await`的获取请求都将阻止整个树的渲染和数据获取，除非它们被包装在`<Suspense>`边界内或使用了`loading.js`。另一种选择是使用[并行数据获取](#parallel-data-fetching)或[预加载模式](#preloading-data)。
### 并行数据获取

要并行获取数据，可以通过在组件外部定义请求，然后在组件内部调用它们来积极地启动请求。这样可以节省时间，因为两个请求同时启动并行处理，然而，用户必须等到两个承诺都解决后才能看到这个渲染结果。

在下面的示例中，`getArtist` 和 `getArtistAlbums` 函数在 `Page` 组件外部定义，然后在组件内部调用，我们等待两个承诺解决：

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
  // Initiate both requests in parallel
  const artistData = getArtist(username)
  const albumsData = getArtistAlbums(username)

  // Wait for the promises to resolve
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
  // Initiate both requests in parallel
  const artistData = getArtist(username)
  const albumsData = getArtistAlbums(username)

  // Wait for the promises to resolve
  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums}></Albums>
    </>
  )
}
```

为了改善用户体验，您可以添加一个[Suspense Boundary](/docs/app/building-your-application/routing/loading-ui-and-streaming)来分割渲染工作，并尽快显示部分结果。
### 预加载数据

防止瀑布效应的另一种方法是使用预加载模式。您可以选择创建一个 `preload` 函数来进一步优化并行数据获取。通过这种方法，您不必将承诺作为属性传递。`preload` 函数也可以有任意名称，因为它是一种模式，而不是一个API。

```tsx filename="components/Item.tsx" switcher
import { getItem } from '@/utils/get-item'

export const preload = (id: string) => {
  // void 计算给定的表达式并返回 undefined
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
  // void 计算给定的表达式并返回 undefined
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

您可以结合使用 `cache` 函数、`preload` 模式和 `server-only` 包来创建一个数据获取实用程序，可以在您的整个应用程序中使用。

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

通过这种方法，您可以积极获取数据，缓存响应，并保证这个数据获取[只在服务器上发生](/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment)。

`utils/get-item` 导出可以被布局(Layouts)、页面(Pages)或其他组件使用，以控制何时获取项目的数据处理。

> **须知：**
>
> - 我们建议使用 [`server-only` 包](/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment) 确保服务器数据获取函数永远不会在客户端使用。
# 防止敏感数据暴露给客户端

我们建议使用React的污点API，[`taintObjectReference`](https://react.dev/reference/react/experimental_taintObjectReference)和[`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue)，以防止整个对象实例或敏感值被传递给客户端。

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

了解更多关于[Security and Server Actions](https://nextjs.org/blog/security-nextjs-server-components-actions)。