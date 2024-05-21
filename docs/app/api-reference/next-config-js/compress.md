---
title: 压缩
description: Next.js 提供了 gzip 压缩来压缩渲染内容和静态文件，它仅与服务器目标一起工作。在这里了解更多信息。
---

{/* 本文档的内容在应用和页面路由器之间共享。您可以使用 `<PagesOnly>内容</PagesOnly>` 组件添加特定于页面路由器的内容。任何共享的内容都不应被包装在组件中。 */}

默认情况下，Next.js 使用 `gzip` 来压缩使用 `next start` 或自定义服务器时的渲染内容和静态文件。这是一种针对没有配置压缩的应用程序的优化。如果压缩已经通过自定义服务器在您的应用程序中配置好了，Next.js 将不会添加压缩。

> **须知：**
>
> - 当您在 [Vercel](https://vercel.com/docs/edge-network/compression) 上托管应用程序时，压缩首先使用 `brotli`，然后是 `gzip`。
> - 您可以通过查看响应中的 [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)（浏览器接受的选项）和 [`Content-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)（当前使用的）头部来检查是否启用了压缩以及使用了哪种算法。

## 禁用压缩

要禁用 **压缩**，将 `compress` 配置选项设置为 `false`：

```js filename="next.config.js"
module.exports = {
  compress: false,
}
```

除非您已经在服务器上配置了压缩，否则我们不建议您禁用压缩，因为压缩可以减少带宽使用并提高应用程序的性能。

## 更改压缩算法

要更改您的压缩算法，您需要配置您的自定义服务器，并在您的 `next.config.js` 文件中将 `compress` 选项设置为 `false`。

例如，您正在使用 [nginx](https://www.nginx.com/) 并希望切换到 `brotli`，将 `compress` 选项设置为 `false` 以允许 nginx 处理压缩。

> **须知：**
>
> - 对于在 Vercel 上的 Next.js 应用程序，压缩由 Vercel 的边缘网络处理，而不是 Next.js。有关更多信息，请参见 [Vercel 文档](https://vercel.com/docs/edge-network/compression)。