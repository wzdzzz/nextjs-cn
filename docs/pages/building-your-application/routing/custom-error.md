---
title: 自定义错误页面
description: 重写并扩展内置的错误页面以处理自定义错误。
---

## 404 页面

404页面可能会被频繁访问。为每次访问服务器渲染一个错误页面会增加Next.js服务器的负载。这可能导致成本增加和体验变慢。

为了避免上述问题，Next.js默认提供了一个静态的404页面，无需添加任何额外文件。

### 自定义404页面

要创建自定义的404页面，您可以创建一个`pages/404.js`文件。此文件在构建时静态生成。

```jsx filename="pages/404.js"
export default function Custom404() {
  return <h1>404 - 页面未找到</h1>
}
```

> **须知**：如果您需要在构建时获取数据，可以在本页面内使用[`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)。

## 500 页面

为每次访问服务器渲染一个错误页面会增加响应错误的复杂性。为了帮助用户尽快获得错误响应，Next.js默认提供了一个静态的500页面，无需添加任何额外文件。

### 自定义500页面

要自定义500页面，您可以创建一个`pages/500.js`文件。此文件在构建时静态生成。

```jsx filename="pages/500.js"
export default function Custom500() {
  return <h1>500 - 发生了服务器端错误</h1>
}
```

> **须知**：如果您需要在构建时获取数据，可以在本页面内使用[`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)。

### 更高级的错误页面自定义

500错误由`Error`组件在客户端和服务器端处理。如果您希望覆盖它，定义文件`pages/_error.js`并添加以下代码：

```jsx
function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `服务器上发生了${statusCode}错误`
        : '客户端发生了错误'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
```

> `pages/_error.js`仅在生产环境中使用。在开发中，您将获得带有调用栈的错误，以了解错误源自何处。

### 重用内置错误页面

如果您想渲染内置的错误页面，可以通过导入`Error`组件来实现：

```jsx
import Error from 'next/error'

export async function getServerSideProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const errorCode = res.ok ? false : res.status
  const json = await res.json()

  return {
    props: { errorCode, stars: json.stargazers_count },
  }
}

export default function Page({ errorCode, stars }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return <div>Next stars: {stars}</div>
}
```

`Error`组件还可以接受`title`作为属性，如果您想传递文本消息以及`statusCode`。

如果您有自定义的`Error`组件，请确保导入那个组件。`next/error`导出了Next.js使用的默认组件。

### 注意事项

- `Error`当前不支持Next.js [数据获取方法](/docs/pages/building-your-application/data-fetching)，如[`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)或[`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)。
- `_error`像`_app`一样是保留路径名。`_error`用于定义错误页面的自定义布局和行为。通过[路由](/docs/pages/building-your-application/routing)直接访问或在[自定义服务器](/docs/pages/building-your-application/configuring/custom-server)中渲染`/_error`将呈现404。