# 动态路由

动态路由是允许你在URL中添加自定义参数的页面。开始创建动态路由并在这里了解更多。

## 须知

当你事先不知道确切的段名，并且想要根据动态数据创建路由时，你可以使用在请求时填充或在构建时预渲染的动态段。

## 约定

通过在方括号中包装文件或文件夹名称来创建动态段：`[segmentName]`。例如，`[id]`或`[slug]`。

动态段可以从[`useRouter`](/docs/pages/api-reference/functions/use-router)访问。

## 示例

例如，一个博客可以包含以下路由`pages/blog/[slug].js`，其中`[slug]`是博客文章的动态段。

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()
  return <p>Post: {router.query.slug}</p>
}
```

| 路由                  | 示例URL | `params`        |
| ---------------------- | ----------- | --------------- |
| `pages/blog/[slug].js` | `/blog/a`   | `{ slug: 'a' }` |
| `pages/blog/[slug].js` | `/blog/b`   | `{ slug: 'b' }` |
| `pages/blog/[slug].js` | `/blog/c`   | `{ slug: 'c' }` |

## 全局段

动态段可以通过在方括号内添加省略号`[...segmentName]`来扩展以**全局**匹配后续段。

例如，`pages/shop/[...slug].js`将匹配`/shop/clothes`，但也匹配`/shop/clothes/tops`、`/shop/clothes/tops/t-shirts`等。

| 路由                     | 示例URL   | `params`                    |
| ------------------------- | ------------- | --------------------------- |
| `pages/shop/[...slug].js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `pages/shop/[...slug].js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `pages/shop/[...slug].js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## 可选全局段

通过在双方括号中包含参数，可以使全局段成为**可选**的：`[[...segmentName]]`。

例如，`pages/shop/[[...slug]].js`除了匹配`/shop/clothes`、`/shop/clothes/tops`、`/shop/clothes/tops/t-shirts`之外，还将**匹配**`/shop`。

**全局**和**可选全局**段之间的区别在于，可选的段也会匹配没有参数的路由（上述示例中的`/shop`）。

| 路由                       | 示例URL   | `params`                    |
| --------------------------- | ------------- | --------------------------- |
| `pages/shop/[[...slug]].js` | `/shop`       | `{ slug: undefined }`       |
| `pages/shop/[[...slug]].js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `pages/shop/[[...slug]].js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `pages/shop/[[...slug]].js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |