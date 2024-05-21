# assetPrefix

---

须知：Next.js 9.5+ 增加了对可定制的[基础路径](/docs/app/api-reference/next-config-js/basePath)的支持，这更适合将您的应用程序托管在如 `/docs` 这样的子路径上。我们不建议在这种情况下使用自定义的 Asset Prefix。

要设置一个 [CDN](https://en.wikipedia.org/wiki/Content_delivery_network)，您可以设置一个资源前缀（asset prefix）并配置您的 CDN 的源以解析到 Next.js 托管的域名。

打开 `next.config.js` 并添加 `assetPrefix` 配置：

```js filename="next.config.js"
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // 在生产环境中使用 CDN，在本地开发环境中使用 localhost。
  assetPrefix: isProd ? 'https://cdn.mydomain.com' : undefined,
}
```

Next.js 将自动使用您的资源前缀来加载从 `/_next/` 路径（`.next/static/` 文件夹）加载的 JavaScript 和 CSS 文件。例如，使用上面的配置，以下对 JS 块的请求：

```
/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js
```

将变为：

```
https://cdn.mydomain.com/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js
```

将文件上传到特定 CDN 的确切配置将取决于您选择的 CDN。您需要在 CDN 上托管的唯一文件夹是 `.next/static/` 的内容，应按照上述 URL 请求所示上传为 `_next/static/`。**不要上传 `.next/` 文件夹的其余部分**，因为您不应将服务器代码和其他配置暴露给公众。

虽然 `assetPrefix` 涵盖了对 `_next/static` 的请求，但它不影响以下路径：

- [public](/docs/app/building-your-application/optimizing/static-assets) 文件夹中的文件；如果您希望通过 CDN 提供这些资源，您需要自己引入前缀
- `getServerSideProps` 页面的 `/_next/data/` 请求。这些请求将始终针对主域名进行，因为它们不是静态的。
- `getStaticProps` 页面的 `/_next/data/` 请求。这些请求将始终针对主域名进行，以支持 [增量静态生成](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)，即使您没有使用它（为了一致性）。