---
title: generateStaticParams
description: generateStaticParams 函数的 API 参考。
---

`generateStaticParams` 函数可以与 [动态路由段](/docs/app/building-your-application/routing/dynamic-routes) 结合使用，以在构建时 [**静态生成**](/docs/app/building-your-application/rendering/server-components#static-rendering-default) 路由，而不是在请求时按需生成。

```jsx filename="app/blog/[slug]/page.js"
// 返回一个 `params` 列表来填充 [slug] 动态段
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 此页面的多个版本将使用 `generateStaticParams` 返回的 `params` 静态生成
export default function Page({ params }) {
  const { slug } = params
  // ...
}
```

> **须知**
>
> - 您可以使用 [`dynamicParams`](/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams) 段配置选项来控制访问未通过 `generateStaticParams` 生成的动态段时会发生什么。
> - 在 `next dev` 期间，当您导航到一个路由时，将调用 `generateStaticParams`。
> - 在 `next build` 期间，`generateStaticParams` 在生成相应的布局或页面之前运行。
> - 在重新验证（ISR）期间，将不会再次调用 `generateStaticParams`。
> - `generateStaticParams` 替换了 Pages Router 中的 [`getStaticPaths`](/docs/pages/api-reference/functions/get-static-paths) 函数。

## 参数

`options.params` (可选)

如果路由中的多个动态段使用 `generateStaticParams`，则对于父 `generateStaticParams` 生成的每组 `params`，子 `generateStaticParams` 函数执行一次。

`params` 对象包含从父 `generateStaticParams` 填充的 `params`，可用于 [在子段中生成 `params`](#multiple-dynamic-segments-in-a-route)。

## 返回值

`generateStaticParams` 应返回一个对象数组，其中每个对象表示单个路由的填充动态段。

- 对象中的每个属性是一个要填充的动态段。
- 属性名称是段的名称，属性值是该段应填充的值。

| 示例路由                    | `generateStaticParams` 返回类型        |
| -------------------------------- | ----------------------------------------- |
| `/product/[id]`                  | `{ id: string }[]`                        |
| `/products/[category]/[product]` | `{ category: string, product: string }[]` |
| `/products/[...slug]`            | `{ slug: string[] }[]`                    |

## 单个动态段

```tsx filename="app/product/[id]/page.tsx" switcher
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

// 将使用 `generateStaticParams` 返回的 `params` 静态生成此页面的三个版本
// - /product/1
// - /product/2
// - /product/3
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
  // ...
}
```

```jsx filename="app/product/[id]/page.js" switcher
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

// 将使用 `generateStaticParams` 返回的 `params` 静态生成此页面的三个版本
// - /product/1
// - /product/2
// - /product/3
export default function Page({ params }) {
  const { id } = params
  // ...
}
```
## 多个动态段

```tsx filename="app/products/[category]/[product]/page.tsx" switcher
export function generateStaticParams() {
  return [
    { category: 'a', product: '1' },
    { category: 'b', product: '2' },
    { category: 'c', product: '3' },
  ]
}

// 使用 `generateStaticParams` 返回的 `params` 将静态生成此页面的三个版本
// - /products/a/1
// - /products/b/2
// - /products/c/3
export default function Page({
  params,
}: {
  params: { category: string; product: string }
}) {
  const { category, product } = params
  // ...
}
```

```jsx filename="app/products/[category]/[product]/page.js" switcher
export function generateStaticParams() {
  return [
    { category: 'a', product: '1' },
    { category: 'b', product: '2' },
    { category: 'c', product: '3' },
  ]
}

// 使用 `generateStaticParams` 返回的 `params` 将静态生成此页面的三个版本
// - /products/a/1
// - /products/b/2
// - /products/c/3
export default function Page({ params }) {
  const { category, product } = params
  // ...
}
```

## 通配符动态段

```tsx filename="app/product/[...slug]/page.tsx" switcher
export function generateStaticParams() {
  return [{ slug: ['a', '1'] }, { slug: ['b', '2'] }, { slug: ['c', '3'] }]
}

// 使用 `generateStaticParams` 返回的 `params` 将静态生成此页面的三个版本
// - /product/a/1
// - /product/b/2
// - /product/c/3
export default function Page({ params }: { params: { slug: string[] } }) {
  const { slug } = params
  // ...
}
```

```jsx filename="app/product/[...slug]/page.js" switcher
export function generateStaticParams() {
  return [{ slug: ['a', '1'] }, { slug: ['b', '2'] }, { slug: ['c', '3'] }]
}

// 使用 `generateStaticParams` 返回的 `params` 将静态生成此页面的三个版本
// - /product/a/1
// - /product/b/2
// - /product/c/3
export default function Page({ params }) {
  const { slug } = params
  // ...
}
```


## 示例


### 路由中的多个动态段

您可以为当前布局或页面上方的动态段生成参数，但**不能**在下方。例如，给定 `app/products/[category]/[product]` 路由：

- `app/products/[category]/[product]/page.js` 可以为 **两个** `[category]` 和 `[product]` 生成参数。
- `app/products/[category]/layout.js` 只能为 `[category]` 生成参数。

对于具有多个动态段的路由生成参数有两种方法：

### 从底部向上生成参数

从子路由段生成多个动态段。

```tsx filename="app/products/[category]/[product]/page.tsx" switcher
// 为 [category] 和 [product] 生成段
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) => res.json())

  return products.map((product) => ({
    category: product.category.slug,
    product: product.id,
  }))
}

export default function Page({
  params,
}: {
  params: { category: string; product: string }
}) {
  // ...
}
```

```jsx filename="app/products/[category]/[product]/page.js" switcher
// 为 [category] 和 [product] 生成段
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) => res.json())

  return products.map((product) => ({
    category: product.category.slug,
    product: product.id,
  }))
}

export default function Page({ params }) {
  // ...
}
```
### 从上到下生成参数

首先生成父段，然后使用结果生成子段。

```tsx filename="app/products/[category]/layout.tsx" switcher
// 为 [category] 生成段
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) => res.json())

  return products.map((product) => ({
    category: product.category.slug,
  }))
}

export default function Layout({ params }: { params: { category: string } }) {
  // ...
}
```

```jsx filename="app/products/[category]/layout.js" switcher
// 为 [category] 生成段
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) => res.json())

  return products.map((product) => ({
    category: product.category.slug,
  }))
}

export default function Layout({ params }) {
  // ...
}
```

对于每个父 `generateStaticParams` 生成的段，子路由段的 `generateStaticParams` 函数都会执行一次。

子 `generateStaticParams` 函数可以使用父 `generateStaticParams` 函数返回的 `params` 动态生成自己的段。

```tsx filename="app/products/[category]/[product]/page.tsx" switcher
// 使用从父段的 `generateStaticParams` 函数传递的 `params` 生成 [product] 的段
export async function generateStaticParams({
  params: { category },
}: {
  params: { category: string }
}) {
  const products = await fetch(
    `https://.../products?category=${category}`
  ).then((res) => res.json())

  return products.map((product) => ({
    product: product.id,
  }))
}

export default function Page({
  params,
}: {
  params: { category: string; product: string }
}) {
  // ...
}
```

```jsx filename="app/products/[category]/[product]/page.js" switcher
// 使用从父段的 `generateStaticParams` 函数传递的 `params` 生成 [product] 的段
export async function generateStaticParams({ params: { category } }) {
  const products = await fetch(
    `https://.../products?category=${category}`
  ).then((res) => res.json())

  return products.map((product) => ({
    product: product.id,
  }))
}

export default function Page({ params }) {
  // ...
}
```

> **须知**：`fetch` 请求会自动针对所有 `generate` 前缀函数、布局、页面和服务器组件中相同的数据进行 [缓存](/docs/app/building-your-application/caching#request-memoization)。如果 `fetch` 不可用，可以使用 React [`cache`](/docs/app/building-your-application/caching#request-memoization)。

### 生成参数的子集

你可以通过返回一个对象数组来生成路由的参数子集，这些对象只包含你想要生成的动态段。然后，通过使用 [`dynamicParams`](/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams) 段配置选项，你可以控制当访问未通过 `generateStaticParams` 生成的动态段时会发生什么。

```jsx filename="app/blog/[slug]/page.js"
// 除了前 10 篇帖子外，所有帖子都将是 404
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  const topPosts = posts.slice(0, 10)

  return topPosts.map((post) => ({
    slug: post.slug,
  }))
}
```

## 版本历史

| 版本   | 变更                            |
| --------- | ---------------------------------- |
| `v13.0.0` | 引入 `generateStaticParams`。 |