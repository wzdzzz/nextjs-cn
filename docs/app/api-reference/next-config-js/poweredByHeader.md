# poweredByHeader

须知：Next.js 默认会添加 `x-powered-by` 头信息。在这里学习如何禁用它。

{/* 本文档的内容在应用和页面路由器之间共享。您可以使用 `<PagesOnly>内容</PagesOnly>` 组件来添加特定于页面路由器的内容。任何共享内容都不应被包装在组件中。 */}

默认情况下，Next.js 会添加 `x-powered-by` 头信息。要禁用它，请打开 `next.config.js` 并禁用 `poweredByHeader` 配置：

```js filename="next.config.js"
module.exports = {
  poweredByHeader: false,
}
```