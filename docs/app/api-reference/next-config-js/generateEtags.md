# generateEtags

Next.js 默认为每个页面生成 etags。在这里了解如何禁用 etag 生成。



Next.js 默认为每个页面生成 [etags](https://en.wikipedia.org/wiki/HTTP_ETag)。根据您的缓存策略，您可能想要为 HTML 页面禁用 etag 生成。

打开 `next.config.js` 并禁用 `generateEtags` 选项：

```js filename="next.config.js"
module.exports = {
  generateEtags: false,
}
```