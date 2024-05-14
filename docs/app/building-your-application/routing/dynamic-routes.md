---
title: 动态路由
description: 动态路由可用于在请求时或构建时从动态数据生成路由段。
related:
  title: 下一步
  description: 有关下一步的更多信息，我们建议您查看以下部分
  links:
    - app/building-your-application/routing/linking-and-navigating
    - app/api-reference/functions/generate-static-params
---

当您不知道确切的段名并希望从动态数据创建路由时，可以使用动态段，这些段在请求时或[预渲染](#生成静态参数)时填充。

## 约定

可以通过将文件夹名称用方括号括起来来创建动态段：`[folderName]`。例如，`[id]`或 `[slug]`。

动态段作为 `params` 属性传递给 [`layout`](/docs/app/api-reference/file-conventions/layout)、[`page`](/docs/app/api-reference/file-conventions/page)、[`route`](/docs/app/building-your-application/routing/route-handlers) 和 [`generateMetadata`](/docs/app/api-reference/functions/generate-metadata#generatemetadata-function) 函数。

## 示例

例如，一个博客可以包含以下路由 `app/blog/[slug]/page.js`，其中 `[slug]` 是博客文章的动态段。

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default function Page({ params }: { params: { slug: string } }) {
  return <div>我的文章：{params.slug}</div>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default function Page({ params }) {
  return <div>我的文章：{params.slug}</div>
}
```

| 路由                     | 示例 URL | `params`        |
| ------------------------- | ----------- | --------------- |
| `app/blog/[slug]/page.js` | `/blog/a`   | `{ slug: 'a' }` |
| `app/blog/[slug]/page.js` | `/blog/b`   | `{ slug: 'b' }` |
| `app/blog/[slug]/page.js` | `/blog/c`   | `{ slug: 'c' }` |

查看 [generateStaticParams()](#生成静态参数) 页面，了解如何为该段生成参数。

> **须知**：动态段等同于 `pages` 目录中的 [动态路由](/docs/app/building-your-application/routing/dynamic-routes)。

## 生成静态参数

`generateStaticParams` 函数可以与 [动态路由段](/docs/app/building-your-application/routing/dynamic-routes) 结合使用，以在构建时而不是按需在请求时[**静态生成**](/docs/app/building-your-application/rendering/server-components#静态渲染-默认)路由。

```tsx filename="app/blog/[slug]/page.tsx" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

`generateStaticParams` 函数的主要优势是其智能数据检索。如果在 `generateStaticParams` 函数中使用 `fetch` 请求获取内容，这些请求将[自动记忆](/docs/app/building-your-application/caching#请求记忆)。这意味着在多个 `generateStaticParams`、布局和页面中具有相同参数的 `fetch` 请求只会执行一次，这减少了构建时间。

如果您正在从 `pages` 目录迁移，请使用[迁移指南](/docs/app/building-your-application/upgrading/app-router-migration#动态路径-getstaticpaths)。

有关更多信息和高级用例，请查看 [`generateStaticParams` 服务器函数文档](/docs/app/api-reference/functions/generate-static-params)。

## 全捕获段

动态段可以扩展为通过在方括号内添加省略号 `[...folderName]` 来**全捕获**后续段。

例如，`app/shop/[...slug]/page.js`# 捕获所有路由

捕获所有路由允许你匹配一个路径下的所有内容。例如，`/shop/clothes` 将匹配 `/shop/clothes`，但也会匹配 `/shop/clothes/tops`、`/shop/clothes/tops/t-shirts` 等。

| 路由                             | 示例 URL    | `params`                    |
| ------------------------------- | ---------- | --------------------------- |
| `app/shop/[...slug]/page.js`    | `/shop/a`  | `{ slug: ['a'] }`           |
| `app/shop/[...slug]/page.js`    | `/shop/a/b` | `{ slug: ['a', 'b'] }`      |
| `app/shop/[...slug]/page.js`    | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## 可选的捕获所有路由

通过将参数包含在双方括号中，可以使捕获所有路由成为**可选**的：`[[...folderName]]`。

例如，`app/shop/[[...slug]]/page.js` 除了匹配 `/shop/clothes`、`/shop/clothes/tops`、`/shop/clothes/tops/t-shirts` 之外，**也会**匹配 `/shop`。

**捕获所有**和**可选的捕获所有**路由的区别在于，可选的情况下，没有参数的路由也会被匹配（如上例中的 `/shop`）。

| 路由                               | 示例 URL    | `params`                    |
| ---------------------------------- | ---------- | --------------------------- |
| `app/shop/[[...slug]]/page.js`     | `/shop`    | `{}`                        |
| `app/shop/[[...slug]]/page.js`     | `/shop/a`  | `{ slug: ['a'] }`           |
| `app/shop/[[...slug]]/page.js`     | `/shop/a/b` | `{ slug: ['a', 'b'] }`      |
| `app/shop/[[...slug]]/page.js`     | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## TypeScript

在使用 TypeScript 时，你可以根据配置的路由段为 `params` 添加类型。

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>我的页面</h1>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default function Page({ params }) {
  return <h1>我的页面</h1>
}
```

| 路由                                   | `params` 类型定义                 |
| -------------------------------------- | ---------------------------------------- |
| `app/blog/[slug]/page.js`              | `{ slug: string }`                       |
| `app/shop/[...slug]/page.js`           | `{ slug: string[] }`                     |
| `app/shop/[[...slug]]/page.js`         | `{ slug?: string[] }`                    |
| `app/[categoryId]/[itemId]/page.js`    | `{ categoryId: string, itemId: string }` |

> **小提示**：未来可能会由 [TypeScript 插件](/docs/app/building-your-application/configuring/typescript#typescript-plugin) 自动完成此操作。