---
title: getInitialProps
description: 使用 getInitialProps 在服务器上为你的 React 组件获取动态数据。
---

> **须知**：`getInitialProps` 是一个遗留 API。我们推荐使用 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 或 [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)。

`getInitialProps` 是一个 `async` 函数，可以添加到页面的默认导出 React 组件中。它将在服务器端运行，并且在页面转换期间再次在客户端运行。函数的结果将作为 `props` 传递给 React 组件。

```tsx filename="pages/index.tsx" switcher
import { NextPageContext } from 'next'

Page.getInitialProps = async (ctx: NextPageContext) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default function Page({ stars }: { stars: number }) {
  return stars
}
```

```jsx filename="pages/index.js" switcher
Page.getInitialProps = async (ctx) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default function Page({ stars }) {
  return stars
}
```

> **须知**：
>
> - 从 `getInitialProps` 返回的数据在服务器渲染时会被序列化。确保从 `getInitialProps` 返回的对象是一个普通的 `Object`，并且不使用 `Date`、`Map` 或 `Set`。
> - 对于初始页面加载，`getInitialProps` 仅在服务器上运行。当使用 [`next/link`](/docs/pages/api-reference/components/link) 组件或通过使用 [`next/router`](/docs/pages/api-reference/functions/use-router) 导航到不同的路由时，`getInitialProps` 也会在客户端上运行。
> - 如果在自定义 `_app.js` 中使用 `getInitialProps`，并且正在导航到的页面使用了 `getServerSideProps`，那么 `getInitialProps` 也会在服务器上运行。

## 上下文对象

`getInitialProps` 接收一个名为 `context` 的单个参数，这是一个具有以下属性的对象：

| 名称       | 描述                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `pathname` | 当前路由，`/pages` 中页面的路径                                                       |
| `query`    | URL 的查询字符串，解析为对象                                                          |
| `asPath`   | 浏览器中显示的实际路径（包括查询）的 `String`                                |
| `req`      | [HTTP 请求对象](https://nodejs.org/api/http.html#http_class_http_incomingmessage)（仅限服务器） |
| `res`      | [HTTP响应对象](https://nodejs.org/api/http.html#http_class_http_serverresponse)（仅限服务器） |
| `err`      | 如果在渲染期间遇到任何错误，则为错误对象                                         |

## 注意事项

- `getInitialProps` 只能在 `pages/` 顶级文件中使用，不能在嵌套组件中使用。要在组件级别进行嵌套数据获取，可以考虑探索 [App Router](/docs/app/building-your-application/data-fetching)。
- 无论您的路由是静态的还是动态的，作为 `props` 从 `getInitialProps` 返回的任何数据都将能够在初始 HTML 中在客户端检查。这是为了允许页面正确地[水合](https://react.dev/reference/react-dom/hydrate)。确保您不要在 `props` 中传递任何不应该在客户端上可用的敏感信息。