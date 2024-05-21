---
title: httpAgentOptions
---

{/* 本文档的内容在应用和页面路由器之间共享。您可以使用 `<PagesOnly>内容</PagesOnly>` 组件来添加特定于页面路由器的内容。任何共享的内容都不应被包装在组件中。 */}

在 Node.js 18 之前的版本中，Next.js 会自动使用 [undici](/docs/architecture/supported-browsers#polyfills) 来对 `fetch()` 进行多版本兼容处理，并默认启用 [HTTP Keep-Alive](https://developer.mozilla.org/docs/Web/HTTP/Headers/Keep-Alive)。

要为服务器端的所有 `fetch()` 调用禁用 HTTP Keep-Alive，请打开 `next.config.js` 并添加 `httpAgentOptions` 配置：

```js filename="next.config.js"
module.exports = {
  httpAgentOptions: {
    keepAlive: false,
  },
}
```