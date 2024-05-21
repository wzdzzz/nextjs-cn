---
title: httpAgentOptions
---



在 Node.js 18 之前的版本中，Next.js 会自动使用 [undici](/docs/architecture/supported-browsers#polyfills) 来对 `fetch()` 进行多版本兼容处理，并默认启用 [HTTP Keep-Alive](https://developer.mozilla.org/docs/Web/HTTP/Headers/Keep-Alive)。

要为服务器端的所有 `fetch()` 调用禁用 HTTP Keep-Alive，请打开 `next.config.js` 并添加 `httpAgentOptions` 配置：

```js filename="next.config.js"
module.exports = {
  httpAgentOptions: {
    keepAlive: false,
  },
}
```