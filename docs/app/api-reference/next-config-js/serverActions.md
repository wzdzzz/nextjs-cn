---
title: serverActions
description: 在您的 Next.js 应用程序中配置服务器操作行为。
---

在您的 Next.js 应用程序中配置服务器操作行为的选项。

## `allowedOrigins`

服务器操作可以被调用的额外安全源域名列表。Next.js 将服务器操作请求的源与主机域进行比较，确保它们匹配以防止跨站请求伪造（CSRF）攻击。如果没有提供，只允许相同源。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */

module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

## `bodySizeLimit`

默认情况下，发送到服务器操作的请求体的最大大小为 1MB，以防止在解析大量数据时消耗过多的服务器资源，以及潜在的分布式拒绝服务（DDoS）攻击。

然而，您可以使用 `serverActions.bodySizeLimit` 选项配置此限制。它可以采用字节数或任何由 bytes 支持的字符串格式，例如 `1000`，`'500kb'` 或 `'3mb'`。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}
```

## 启用服务器操作 (v13)

服务器操作在 Next.js 14 中成为了一个稳定特性，默认已启用。然而，如果您使用的是 Next.js 的早期版本，您可以通过将 `experimental.serverActions` 设置为 `true` 来启用它们。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
}

module.exports = config
```