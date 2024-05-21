# poweredByHeader

须知：Next.js 默认会添加 `x-powered-by` 头信息。在这里学习如何禁用它。



默认情况下，Next.js 会添加 `x-powered-by` 头信息。要禁用它，请打开 `next.config.js` 并禁用 `poweredByHeader` 配置：

```js filename="next.config.js"
module.exports = {
  poweredByHeader: false,
}
```