# getServerSideProps

当从一个页面导出一个名为 `getServerSideProps`（服务器端渲染）的函数时，Next.js 将在每个请求上使用 `getServerSideProps` 返回的数据预渲染该页面。这在您想要获取经常变化的数据，并希望页面更新以显示最新数据时非常有用。

```tsx filename="pages/index.tsx" switcher
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getServerSideProps = (async () => {
  // 从外部 API 获取数据
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo: Repo = await res.json()
  // 通过 props 将数据传递给页面
  return { props: { repo } }
}) satisfies GetServerSideProps<{ repo: Repo }>

export default function Page({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  )
}
```

```jsx filename="pages/index.js" switcher
export async function getServerSideProps() {
  // 从外部 API 获取数据
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  // 通过 props 将数据传递给页面
  return { props: { repo } }
}

export default function Page({ repo }) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  )
}
```

您可以在 `getServerSideProps` 中使用顶级作用域中导入的模块。使用的导入将**不会为客户端捆绑**。这意味着您可以直接在 `getServerSideProps` 中编写**服务器端代码**，包括从数据库获取数据。
## 上下文参数

`context` 参数是一个对象，包含以下键：

| 名称            | 描述                                                                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`        | 如果此页面使用了[动态路由](/docs/pages/building-your-application/routing/dynamic-routes)，`params` 包含了路由参数。如果页面名称是 `[id].js`，那么 `params` 将看起来像 `{ id: ... }`。 |
| `req`           | [HTTP IncomingMessage 对象](https://nodejs.org/api/http.html#http_class_http_incomingmessage)，增加了一个 `cookies` 属性，这是一个对象，其字符串键映射到字符串值的 cookies。    |
| `res`           | [HTTP 响应对象](https://nodejs.org/api/http.html#http_class_http_serverresponse)。                                                                                                                        |
| `query`         | 一个代表查询字符串的对象，包括动态路由参数。                                                                                                                                          |
| `preview`       | （已弃用，改为 `draftMode`）如果页面处于[预览模式](/docs/pages/building-your-application/configuring/preview-mode)，则 `preview` 为 `true`，否则为 `false`。                                          |
| `previewData`   | （已弃用，改为 `draftMode`）由 `setPreviewData` 设置的[预览](/docs/pages/building-your-application/configuring/preview-mode)数据。                                                                              |
| `draftMode`     | 如果页面处于[草稿模式](/docs/pages/building-your-application/configuring/draft-mode)，则 `draftMode` 为 `true`，否则为 `false`。                                                                         |
| `resolvedUrl`   | 请求 `URL` 的规范化版本，它剥离了客户端转换的 `_next/data` 前缀，并包含了原始查询值。                                                                              |
| `locale`        | 包含活动区域设置（如果已启用）。                                                                                                                                                                              |
| `locales`       | 包含所有支持的区域设置（如果已启用）。                                                                                                                                                                          |
| `defaultLocale` | 包含配置的默认区域设置（如果已启用）。                                                                                                                                                                  |
## getServerSideProps 返回值

`getServerSideProps` 函数应该返回一个对象，该对象具有以下**任一**属性：

### `props`

`props` 对象是键值对，其中的每个值都由页面组件接收。它应该是一个[可序列化对象](https://developer.mozilla.org/docs/Glossary/Serialization)，以便任何传递的属性都可以使用 [`JSON.stringify`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 进行序列化。

```jsx
export async function getServerSideProps(context) {
  return {
    props: { message: `Next.js is awesome` }, // 将作为 props 传递给页面组件
  }
}
```

### `notFound`

`notFound` 布尔值允许页面返回 `404` 状态和[404 页面](/docs/pages/building-your-application/routing/custom-error#404-page)。使用 `notFound: true`，即使之前成功生成了页面，页面也会返回 `404`。这旨在支持用户生成的内容被其作者移除等用例。

```js
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // 将作为 props 传递给页面组件
  }
}
```

### `redirect`

`redirect` 对象允许重定向到内部和外部资源。它应该匹配 `{ destination: string, permanent: boolean }` 的形状。在一些罕见的情况下，您可能需要为旧的 `HTTP` 客户端分配自定义状态码以正确重定向。在这些情况下，您可以使用 `statusCode` 属性而不是 `permanent` 属性，但不能同时使用两者。

```js
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {}, // 将作为 props 传递给页面组件
  }
}
```

## 版本历史

| 版本   | 变更                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| `v13.4.0` | [App Router](/docs/app/building-your-application/data-fetching) 现在已稳定，并且数据获取已简化 |
| `v10.0.0` | 添加了 `locale`、`locales`、`defaultLocale` 和 `notFound` 选项。                                         |
| `v9.3.0`  | 引入了 `getServerSideProps`。                                                                            |