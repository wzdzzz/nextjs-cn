# 动态路由

动态路由可以根据动态数据以编程方式生成路由段。

## 相关链接
- [链接和导航](/app/building-your-application/routing/linking-and-navigating)
- [生成静态参数](/app/api-reference/functions/generate-static-params)

当你事先不知道确切的段名并希望从动态数据创建路由时，可以使用在请求时填充或在构建时[预渲染](#生成静态参数)的动态段。

## 约定

通过在方括号中包装文件夹名称来创建动态段：`[folderName]`。例如，`[id]`或`[slug]`。

动态段作为`params`属性传递给[`layout`](/docs/app/api-reference/file-conventions/layout)、[`page`](/docs/app/api-reference/file-conventions/page)、[`route`](/docs/app/building-your-application/routing/route-handlers)和[`generateMetadata`](/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)函数。

## 示例

例如，一个博客可以包含以下路由`app/blog/[slug]/page.js`，其中`[slug]`是博客文章的动态段。

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Post: {params.slug}</div>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default function Page({ params }) {
  return <div>My Post: {params.slug}</div>
}
```

| 路由                     | 示例URL | `params`        |
| ------------------------- | ----------- | --------------- |
| `app/blog/[slug]/page.js` | `/blog/a`   | `{ slug: 'a' }` |
| `app/blog/[slug]/page.js` | `/blog/b`   | `{ slug: 'b' }` |
| `app/blog/[slug]/page.js` | `/blog/c`   | `{ slug: 'c' }` |

查看[generateStaticParams()](#生成静态参数)页面，了解如何为该段生成参数。

> **须知**：动态段等同于`pages`目录中的[动态路由](/docs/app/building-your-application/routing/dynamic-routes)。

## 生成静态参数

`generateStaticParams`函数可以与[动态路由段](/docs/app/building-your-application/routing/dynamic-routes)结合使用，以[**静态生成**](/docs/app/building-your-application/rendering/server-components#静态渲染-默认)构建时的路由，而不是按需在请求时生成。

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

`generateStaticParams`函数的主要优点是其智能数据检索。如果在`generateStaticParams`函数中使用`fetch`请求获取内容，则请求将[自动记忆](/docs/app/building-your-application/caching#请求记忆)。这意味着在多个`generateStaticParams`、布局和页面中具有相同参数的`fetch`请求只会执行一次，这减少了构建时间。

如果您正在从`pages`目录迁移，请使用[迁移指南](/docs/app/building-your-application/upgrading/app-router-migration#动态路径-getstaticpaths)。

有关更多信息和高级用例，请查看[`generateStaticParams`服务器函数文档](/docs/app/api-reference/functions/generate-static-params)。
## 通用片段

动态片段可以通过在括号内添加省略号 `[...folderName]` 来扩展为 **通用** 后续片段。

例如，`app/shop/[...slug]/page.js` 将匹配 `/shop/clothes`，同时也会匹配 `/shop/clothes/tops`、`/shop/clothes/tops/t-shirts` 等。

| 路由                        | 示例URL   | `params`                    |
| ---------------------------- | ------------- | --------------------------- |
| `app/shop/[...slug]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[...slug]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## 可选通用片段

通过在双括号内包含参数 `[[...folderName]]`，可以使通用片段变为 **可选**。

例如，`app/shop/[[...slug]]/page.js` 除了匹配 `/shop/clothes`、`/shop/clothes/tops`、`/shop/clothes/tops/t-shirts` 之外，还将 **同样** 匹配 `/shop`。

**通用** 和 **可选通用** 片段的区别在于，可选通用片段即使没有参数的路由也会被匹配（如示例中的 `/shop`）。

| 路由                          | 示例URL   | `params`                    |
| ------------------------------ | ------------- | --------------------------- |
| `app/shop/[[...slug]]/page.js` | `/shop`       | `{}`                        |
| `app/shop/[[...slug]]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## TypeScript

在使用 TypeScript 时，你可以根据配置的路由片段为 `params` 添加类型。

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>My Page</h1>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default function Page({ params }) {
  return <h1>My Page</h1>
}
```

| 路由                               | `params` 类型定义                 |
| ----------------------------------- | ---------------------------------------- |
| `app/blog/[slug]/page.js`           | `{ slug: string }`                       |
| `app/shop/[...slug]/page.js`        | `{ slug: string[] }`                     |
| `app/shop/[[...slug]]/page.js`      | `{ slug?: string[] }`                    |
| `app/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }` |

> **须知**：这可能会在未来由 [TypeScript 插件](/docs/app/building-your-application/configuring/typescript#typescript-plugin) 自动完成。