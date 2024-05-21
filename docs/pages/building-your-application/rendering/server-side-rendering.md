---
title: 服务器端渲染 (SSR)
description: 使用服务器端渲染在每次请求时渲染页面。
---

> 也称为 "SSR" 或 "动态渲染"。

如果页面使用 **服务器端渲染**，则页面 HTML 会在 **每次请求** 时生成。

要为页面使用服务器端渲染，您需要 `export` 一个名为 `getServerSideProps` 的 `async` 函数。服务器会在每次请求时调用此函数。

例如，假设您的页面需要预渲染经常更新的数据（从外部 API 获取）。您可以编写 `getServerSideProps` 来获取这些数据并像下面这样将其传递给 `Page`：

```jsx
export default function Page({ data }) {
  // 渲染数据...
}

// 这会在每次请求时被调用
export async function getServerSideProps() {
  // 从外部 API 获取数据
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // 通过 props 将数据传递给页面
  return { props: { data } }
}
```

如您所见，`getServerSideProps` 类似于 `getStaticProps`，但不同之处在于 `getServerSideProps` 是在每次请求时运行，而不是在构建时运行。

要了解更多关于 `getServerSideProps` 的工作原理，请查看我们的 [数据获取文档](/docs/pages/building-your-application/data-fetching/get-server-side-props)。