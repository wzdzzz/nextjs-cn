---
title: 路由段配置
description: 了解如何为 Next.js 路由段配置选项。
---

路由段选项允许您通过直接导出以下变量来配置 [页面](/docs/app/building-your-application/routing/layouts-and-templates)、[布局](/docs/app/building-your-application/routing/layouts-and-templates) 或 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 的行为：

| 选项                                | 类型                                                                                                                      | 默认值                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| [`dynamic`](#dynamic)                 | `'auto' \| 'force-dynamic' \| 'error' \| 'force-static'`                                                                  | `'auto'`                   |
| [`dynamicParams`](#dynamicparams)     | `boolean`                                                                                                                 | `true`                     |
| [`revalidate`](#revalidate)           | `false \| 0 \| number`                                                                                                    | `false`                    |
| [`fetchCache`](#fetchcache)           | `'auto' \| 'default-cache' \| 'only-cache' \| 'force-cache' \| 'force-no-store' \| 'default-no-store' \| 'only-no-store'` | `'auto'`                   |
| [`runtime`](#runtime)                 | `'nodejs' \| 'edge'`                                                                                                      | `'nodejs'`                 |
| [`preferredRegion`](#preferredregion) | `'auto' \| 'global' \| 'home' \| string \| string[]`                                                                      | `'auto'`                   |
| [`maxDuration`](#maxduration)         | `number`                                                                                                                  | 由部署平台设置            |

## 选项
### `dynamic`

更改布局或页面的动态行为，使其完全静态或完全动态。

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

```js filename="layout.js | page.js | route.js" switcher
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

> **须知**：在 `app` 目录中的新模型更倾向于在 `fetch` 请求级别上进行细粒度的缓存控制，而不是 `pages` 目录中页面级别的 `getServerSideProps` 和 `getStaticProps` 的二元全有或全无模型。`dynamic` 选项是一种回归到旧模型的方式，作为便利，并提供了一个更简单的迁移路径。

- **`'auto'`**（默认）：默认选项，尽可能多地缓存，同时不阻止任何组件选择动态行为。
- **`'force-dynamic'`**：强制[动态渲染](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)，这将导致每个用户的路由在请求时渲染。此选项等同于：

  - `pages` 目录中的 `getServerSideProps()`。
  - 在布局或页面中的每个 `fetch()` 请求设置选项为 `{ cache: 'no-store', next: { revalidate: 0 } }`。
  - 设置段配置为 `export const fetchCache = 'force-no-store'`

- **`'error'`**：通过在任何组件使用[动态函数](/docs/app/building-your-application/rendering/server-components#dynamic-functions)或未缓存的数据时引发错误，强制静态渲染并缓存布局或页面的数据。此选项等同于：
  - `pages` 目录中的 `getStaticProps()`。
  - 在布局或页面中的每个 `fetch()` 请求设置选项为 `{ cache: 'force-cache' }`。
  - 设置段配置为 `fetchCache = 'only-cache', dynamicParams = false`。
  - `dynamic = 'error'` 将 `dynamicParams` 的默认值从 `true` 更改为 `false`。您可以通过手动设置 `dynamicParams = true` 来选择性地回归到动态参数的动态渲染。
- **`'force-static'`**：通过强制 [`cookies()`](/docs/app/api-reference/functions/cookies)、[`headers()`](/docs/app/api-reference/functions/headers) 和 [`useSearchParams()`](/docs/app/api-reference/functions/use-search-params) 返回空值，强制静态渲染并缓存布局或页面的数据。

> **须知**：
>
> - 在 [升级指南](/docs/app/building-your-application/upgrading/app-router-migration#step-6-migrating-data-fetching-methods) 中可以找到从 `getServerSideProps` 和 `getStaticProps` 迁移到 `dynamic: 'force-dynamic'` 和 `dynamic: 'error'` 的[迁移指南](/docs/app/building-your-application/upgrading/app-router-migration#step-6-migrating-data-fetching-methods)。

### `dynamicParams`

控制访问未用 [generateStaticParams](/docs/app/api-reference/functions/generate-static-params) 生成的动态段时会发生什么。

```tsx filename="layout.tsx | page.tsx" switcher
export const dynamicParams = true // true | false,
```

```js filename="layout.js | page.js | route.js" switcher
export const dynamicParams = true // true | false,
```

- **`true`**（默认）：未包含在 `generateStaticParams` 中的动态段按需生成。
- **`false`**：未包含在 `generateStaticParams` 中的动态段将返回 404。

> **须知**：
>
> - 此选项替代了 `pages` 目录中 `getStaticPaths` 的 `fallback: true | false | blocking` 选项。
> - 当 `dynamicParams = true` 时，该段使用 [Streaming Server Rendering](/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)。
> - 如果使用了 `dynamic = 'error'` 和 `dynamic = 'force-static'`，它将把 `dynamicParams` 的默认值更改为 `false`。
### `revalidate`

设置布局或页面的默认重新验证时间。此选项不会覆盖个别 `fetch` 请求设置的 `revalidate` 值。

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const revalidate = false
// false | 0 | number
```

```js filename="layout.js | page.js | route.js" switcher
export const revalidate = false
// false | 0 | number
```

- **`false`**（默认）：默认启发式缓存任何将 `cache` 选项设置为 `'force-cache'` 或在使用[动态函数](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)之前发现的 `fetch` 请求。语义上等同于 `revalidate: Infinity`，实际上意味着资源应该无限期地被缓存。尽管如此，个别 `fetch` 请求仍然可以使用 `cache: 'no-store'` 或 `revalidate: 0` 来避免被缓存并使路由动态渲染。或者将 `revalidate` 设置为低于路由默认值的正数来增加路由的重新验证频率。
- **`0`**：确保即使没有发现动态函数或未缓存的数据获取，布局或页面始终[动态渲染](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)。此选项将未设置 `cache` 选项的 `fetch` 请求的默认值更改为 `'no-store'`，但保留选择使用 `'force-cache'` 或使用正数 `revalidate` 的 `fetch` 请求。
- **`number`**：（单位：秒）将布局或页面的默认重新验证频率设置为 `n` 秒。

> **须知**：
>
> - 重新验证值需要能够静态分析。例如 `revalidate = 600` 是有效的，但 `revalidate = 60 * 10` 是无效的。
> - 使用 `runtime = 'edge'` 时，重新验证值不可用。

#### 重新验证频率

- 单个路由中每个布局和页面的最低 `revalidate` 值将决定整个路由的重新验证频率。这确保子页面的重新验证频率与它们的父布局一样频繁。
- 个别 `fetch` 请求可以设置比路由的默认 `revalidate` 更低的值，以增加整个路由的重新验证频率。这允许您根据某些标准为特定路由动态选择更频繁的重新验证。
### `fetchCache`

<details>
  <summary>这是一个高级选项，只有在您特别需要覆盖默认行为时才应使用。</summary>

默认情况下，Next.js **会缓存**任何在任何[动态函数](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)使用之前可访问的 `fetch()` 请求，并且**不会缓存**在使用动态函数之后发现的 `fetch` 请求。

`fetchCache` 允许您覆盖布局或页面中所有 `fetch` 请求的默认 `cache` 选项。

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

```js filename="layout.js | page.js | route.js" switcher
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

- **`'auto'`**（默认）：默认选项是在动态函数之前缓存 `fetch` 请求，并使用它们提供的 `cache` 选项，而不缓存动态函数之后的 `fetch` 请求。
- **`'default-cache'`**：允许向 `fetch` 传递任何 `cache` 选项，但如果未提供选项，则将 `cache` 选项设置为 `'force-cache'`。这意味着即使在动态函数之后的 `fetch` 请求也被视为静态。
- **`'only-cache'`**：确保所有 `fetch` 请求都选择使用缓存，如果未提供选项，则将默认更改为 `cache: 'force-cache'`，并在任何 `fetch` 请求使用 `cache: 'no-store'` 时引发错误。
- **`'force-cache'`**：确保所有 `fetch` 请求都选择使用缓存，通过将所有 `fetch` 请求的 `cache` 选项设置为 `'force-cache'`。
- **`'default-no-store'`**：允许向 `fetch` 传递任何 `cache` 选项，但如果未提供选项，则将 `cache` 选项设置为 `'no-store'`。这意味着即使在动态函数之前的 `fetch` 请求也被视为动态。
- **`'only-no-store'`**：确保所有 `fetch` 请求都不使用缓存，如果未提供选项，则将默认更改为 `cache: 'no-store'`，并在任何 `fetch` 请求使用 `cache: 'force-cache'` 时引发错误。
- **`'force-no-store'`**：确保所有 `fetch` 请求都不使用缓存，通过将所有 `fetch` 请求的 `cache` 选项设置为 `'no-store'`。这将强制每个请求都重新获取所有 `fetch` 请求，即使它们提供了 `'force-cache'` 选项。

#### 跨路由段行为

- 单个路由的每个布局和页面设置的任何选项需要彼此兼容。
  - 如果同时提供了 `'only-cache'` 和 `'force-cache'`，则 `'force-cache'` 优先。如果同时提供了 `'only-no-store'` 和 `'force-no-store'`，则 `'force-no-store'` 优先。强制选项会改变整个路由的行为，因此具有 `'force-*'` 的单个段将防止由 `'only-*'` 引起的任何错误。
  - `'only-*'` 和 `force-*'` 选项的目的是保证整个路由要么完全静态，要么完全动态。这意味着：
    - 在单个路由中不允许组合使用 `'only-cache'` 和 `'only-no-store'`。
    - 在单个路由中不允许组合使用 `'force-cache'` 和 `'force-no-store'`。
  - 如果子级提供了 `'auto'` 或 `'*-cache'`，则父级不能提供 `'default-no-store'`，因为这可能导致相同的获取具有不同的行为。
- 通常建议将共享的父级布局保留为 `'auto'`，并在子段发散的地方自定义选项。

</details>
### `runtime`

我们建议您使用 Node.js 运行时来渲染您的应用程序，并使用 Edge 运行时来处理中间件（唯一支持的选项）。

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const runtime = 'nodejs'
// 'nodejs' | 'edge'
```

```js filename="layout.js | page.js | route.js" switcher
export const runtime = 'nodejs'
// 'nodejs' | 'edge'
```

- **`'nodejs'`** （默认）
- **`'edge'`**

了解更多关于[不同的运行时](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)。

### `preferredRegion`

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const preferredRegion = 'auto'
// 'auto' | 'global' | 'home' | ['iad1', 'sfo1']
```

```js filename="layout.js | page.js | route.js" switcher
export const preferredRegion = 'auto'
// 'auto' | 'global' | 'home' | ['iad1', 'sfo1']
```

`preferredRegion` 的支持以及支持的区域取决于您的部署平台。

> **须知**：
>
> - 如果没有指定 `preferredRegion`，则会继承最近父布局的选项。
> - 根布局默认为 `all` 区域。

### `maxDuration`

默认情况下，Next.js 不限制服务器端逻辑的执行（渲染页面或处理 API）。
部署平台可以使用 Next.js 构建输出中的 `maxDuration` 来添加特定的执行限制。
例如，在 [Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes#max-duration) 上。

**注意**：此设置需要 Next.js `13.4.10` 或更高版本。

```tsx filename="layout.tsx | page.tsx | route.ts" switcher
export const maxDuration = 5
```

```js filename="layout.js | page.js | route.js" switcher
export const maxDuration = 5
```

> **须知**：
>
> - 如果使用 [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)，请在页面级别设置 `maxDuration` 以更改页面上使用的所有 Server Actions 的默认超时时间。

### `generateStaticParams`

`generateStaticParams` 函数可以与[动态路由段](/docs/app/building-your-application/routing/dynamic-routes)结合使用，以定义将在构建时静态生成的路由段参数列表，而不是在请求时按需生成。

有关更多详细信息，请参见[API参考](/docs/app/api-reference/functions/generate-static-params)。