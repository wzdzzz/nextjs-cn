# Head

**须知：** 添加自定义元素到页面的 `<head>` 中，可以使用内置的 Head 组件。

<details>
  <summary>示例</summary>

- [Head Elements](https://github.com/vercel/next.js/tree/canary/examples/head-elements)
- [Layout Component](https://github.com/vercel/next.js/tree/canary/examples/layout-component)

</details>

我们提供了一个内置组件，用于将元素添加到页面的 `<head>` 中：

```jsx
import Head from 'next/head'

function IndexPage() {
  return (
    <div>
      <Head>
        <title>我的页面标题</title>
      </Head>
      <p>你好，世界！</p>
    </div>
  )
}

export default IndexPage
```

## 避免标签重复

为了避免 `<head>` 中的标签重复，可以使用 `key` 属性，确保标签只渲染一次，如下例所示：

```jsx
import Head from 'next/head'

function IndexPage() {
  return (
    <div>
      <Head>
        <title>我的页面标题</title>
        <meta property="og:title" content="我的页面标题" key="title" />
      </Head>
      <Head>
        <meta property="og:title" content="我的新标题" key="title" />
      </Head>
      <p>你好，世界！</p>
    </div>
  )
}

export default IndexPage
```

在这种情况下，只有第二个 `<meta property="og:title" />` 被渲染。具有重复 `key` 属性的 `meta` 标签会自动处理。

> 当组件卸载时，`head` 中的内容将被清除，因此请确保每个页面都完全定义了它在 `head` 中需要的内容，而不要假设其他页面添加了什么。

## 使用最少的嵌套

`title`、`meta` 或任何其他元素（例如 `script`）需要作为 `Head` 元素的**直接**子元素，或者包裹在最多一层 `<React.Fragment>` 或数组中——否则在客户端导航时标签将不会被正确捕获。

## 使用 `next/script` 用于脚本

我们建议在组件中使用 [`next/script`](/docs/pages/building-your-application/optimizing/scripts) 而不是手动在 `next/head` 中创建 `<script>`。

## 不使用 `html` 或 `body` 标签

你**不能**使用 `<Head>` 来设置 `<html>` 或 `<body>` 标签上的属性。这将导致一个 `next-head-count is missing` 错误。`next/head` 只能处理 HTML `<head>` 标签内的标签。