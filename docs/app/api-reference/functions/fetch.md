---
title: fetch
description: 扩展的 fetch 函数的 API 参考。
---

Next.js 扩展了原生的 [Web `fetch()` API](https://developer.mozilla.org/docs/Web/API/Fetch_API)，允许服务器上的每个请求设置自己的持久缓存语义。

在浏览器中，`cache` 选项指示 fetch 请求将如何与浏览器的 HTTP 缓存交互。通过这个扩展，`cache` 指示服务器端 fetch 请求将如何与框架的持久 HTTP 缓存交互。

你可以在服务器组件内直接使用 `async` 和 `await` 调用 `fetch`。

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  // 这个请求应该被缓存，直到手动使它失效。
  // 类似于 `getStaticProps`。
  // `force-cache` 是默认设置，可以省略。
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // 这个请求应该在每次请求时重新获取。
  // 类似于 `getServerSideProps`。
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // 这个请求应该被缓存，并且有10秒的生命周期。
  // 类似于带有 `revalidate` 选项的 `getStaticProps`。
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  // 这个请求应该被缓存，直到手动使它失效。
  // 类似于 `getStaticProps`。
  // `force-cache` 是默认设置，可以省略。
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // 这个请求应该在每次请求时重新获取。
  // 类似于 `getServerSideProps`。
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // 这个请求应该被缓存，并且有10秒的生命周期。
  // 类似于带有 `revalidate` 选项的 `getStaticProps`。
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```
## `fetch(url, options)`

由于 Next.js 扩展了 [Web `fetch()` API](https://developer.mozilla.org/docs/Web/API/Fetch_API)，您可以使用任何[原生选项](https://developer.mozilla.org/docs/Web/API/fetch#parameters)。

### `options.cache`

配置请求应如何与 Next.js [数据缓存](/docs/app/building-your-application/caching#data-cache)交互。

```ts
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })
```

- **`force-cache`**（默认）- Next.js 在其数据缓存中查找匹配的请求。
  - 如果找到匹配项并且是最新的，它将从缓存中返回。
  - 如果没有匹配项或匹配项已过时，Next.js 将从远程服务器获取资源并使用下载的资源更新缓存。
- **`no-store`** - Next.js 在每次请求时都从远程服务器获取资源，而不查看缓存，并且不会使用下载的资源更新缓存。

> **须知**：
>
> - 如果您不提供 `cache` 选项，Next.js 将默认使用 `force-cache`，除非使用了如 `cookies()` 这样的[动态函数](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)，在这种情况下它将默认为 `no-store`。
> - `no-cache` 选项在 Next.js 中的行为与 `no-store` 相同。

### `options.next.revalidate`

```ts
fetch(`https://...`, { next: { revalidate: false | 0 | number } })
```

设置资源的缓存生命周期（以秒为单位）。

- **`false`** - 无限期地缓存资源。语义上等同于 `revalidate: Infinity`。HTTP 缓存可能会随着时间的推移逐出旧资源。
- **`0`** - 防止资源被缓存。
- **`number`** - （以秒为单位）指定资源应具有最多 `n` 秒的缓存生命周期。

> **须知**：
>
> - 如果单个 `fetch()` 请求设置的 `revalidate` 数字低于路由的[默认 `revalidate`](/docs/app/api-reference/file-conventions/route-segment-config#revalidate)，则整个路由的重新验证间隔将减少。
> - 如果同一路由中具有相同 URL 的两个 fetch 请求具有不同的 `revalidate` 值，则将使用较低的值。
> - 作为一种便利，如果将 `revalidate` 设置为数字，则不必设置 `cache` 选项，因为 `0` 意味着 `cache: 'no-store'`，正值意味着 `cache: 'force-cache'`。
> - 冲突的选项，如 `{ revalidate: 0, cache: 'force-cache' }` 或 `{ revalidate: 10, cache: 'no-store' }` 将导致错误。

### `options.next.tags`

```ts
fetch(`https://...`, { next: { tags: ['collection'] } })
```

设置资源的缓存标签。然后可以使用 [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) 按需重新验证数据。自定义标签的最大长度为 256 个字符，最大标签项数为 64。

## 版本历史

| 版本   | 变化             |
| --------- | ------------------- |
| `v13.0.0` | 引入了 `fetch`。 |