---
title: env
description: 学习如何在构建时在您的 Next.js 应用程序中添加和访问环境变量。
---



<AppOnly>

> 自从 [Next.js 9.4](https://nextjs.org/blog/next-9-4) 发布以来，我们现在有了一种更直观和符合人体工程学的 [添加环境变量](/docs/app/building-your-application/configuring/environment-variables) 的体验。试试看！

</AppOnly>

<PagesOnly>

> 自从 [Next.js 9.4](https://nextjs.org/blog/next-9-4) 发布以来，我们现在有了一种更直观和符合人体工程学的 [添加环境变量](/docs/pages/building-your-application/configuring/environment-variables) 的体验。试试看！

</PagesOnly>

<AppOnly>

> **须知**：以这种方式指定的环境变量将 **始终** 包含在 JavaScript 打包文件中，仅在通过环境或 .env 文件指定它们时，前缀环境变量名称 `NEXT_PUBLIC_` 才会生效。

</AppOnly>

<PagesOnly>

> **须知**：以这种方式指定的环境变量将 **始终** 包含在 JavaScript 打包文件中，仅在通过环境或 .env 文件指定它们时，前缀环境变量名称 `NEXT_PUBLIC_` 才会生效。

</PagesOnly>

要将环境变量添加到 JavaScript 打包文件中，请打开 `next.config.js` 并添加 `env` 配置：

```js filename="next.config.js"
module.exports = {
  env: {
    customKey: 'my-value',
  },
}
```

现在，您可以在代码中访问 `process.env.customKey`。例如：

```jsx
function Page() {
  return <h1>customKey 的值是：{process.env.customKey}</h1>
}

export default Page
```

Next.js 将在构建时将 `process.env.customKey` 替换为 `'my-value'`。由于 webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 的特性，尝试解构 `process.env` 变量将无法工作。

例如，以下代码行：

```jsx
return <h1>customKey 的值是：{process.env.customKey}</h1>
```

最终将变成：

```jsx
return <h1>customKey 的值是：{'my-value'}</h1>
```