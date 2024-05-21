---
title: page.js
---

# page.js

**页面** 是特定于路由的用户界面。

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <h1>我的页面</h1>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default function Page({ params, searchParams }) {
  return <h1>我的页面</h1>
}
```

## 属性

### `params` （可选）

包含从根段到该页面的[动态路由参数](/docs/app/building-your-application/routing/dynamic-routes)的对象。例如：

| 示例                              | URL         | `params`                       |
| ------------------------------------ | ----------- | ------------------------------ |
| `app/shop/[slug]/page.js`            | `/shop/1`   | `{ slug: '1' }`                |
| `app/shop/[category]/[item]/page.js` | `/shop/1/2` | `{ category: '1', item: '2' }` |
| `app/shop/[...slug]/page.js`         | `/shop/1/2` | `{ slug: ['1', '2'] }`         |

### `searchParams` （可选）

包含当前URL的[搜索参数](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#parameters)的对象。例如：

| URL             | `searchParams`       |
| --------------- | -------------------- |
| `/shop?a=1`     | `{ a: '1' }`         |
| `/shop?a=1&b=2` | `{ a: '1', b: '2' }` |
| `/shop?a=1&a=2` | `{ a: ['1', '2'] }`  |

> **须知**：
>
> - `searchParams` 是一个**[动态API](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)**，其值无法提前知晓。使用它将使页面在请求时选择**[动态渲染](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)**。
> - `searchParams` 返回一个普通的JavaScript对象，而不是 `URLSearchParams` 实例。

## 版本历史

| 版本   | 变更            |
| --------- | ------------------ |
| `v13.0.0` | 引入了 `page`。 |