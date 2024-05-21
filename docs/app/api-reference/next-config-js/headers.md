---
title: headers
description: 为你的 Next.js 应用添加自定义 HTTP 头部。
---



Headers 允许你在给定路径上对传入请求的响应设置自定义 HTTP 头部。

要设置自定义 HTTP 头部，你可以在 `next.config.js` 中使用 `headers` 键：

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'x-custom-header',
            value: '我的自定义头部值',
          },
          {
            key: 'x-another-custom-header',
            value: '我的另一个自定义头部值',
          },
        ],
      },
    ]
  },
}
```

`headers` 是一个异步函数，它期望返回一个数组，该数组包含具有 `source` 和 `headers` 属性的对象：

- `source` 是传入请求的路径模式。
- `headers` 是响应头部对象的数组，具有 `key` 和 `value` 属性。
- `basePath`: `false` 或 `undefined` - 如果为 false，则在匹配时不包括 basePath，仅可用于外部重写。
- `locale`: `false` 或 `undefined` - 是否在匹配时不包括地区。
- `has` 是一个 [has 对象](#header-cookie-and-query-matching) 数组，具有 `type`、`key` 和 `value` 属性。
- `missing` 是一个 [missing 对象](#header-cookie-and-query-matching) 数组，具有 `type`、`key` 和 `value` 属性。

在检查文件系统之前，会检查头部，这包括页面和 `/public` 文件。

## 头部覆盖行为

如果两个头部匹配相同的路径并设置相同的头部键，则最后一个头部键将覆盖第一个。使用下面的头部，路径 `/hello` 将导致头部 `x-hello` 的值为 `world`，因为最后设置的头部值为 `world`。

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-hello',
            value: 'there',
          },
        ],
      },
      {
        source: '/hello',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}
```
## 路径匹配

路径匹配是允许的，例如 `/blog/:slug` 将匹配 `/blog/hello-world`（不匹配嵌套路径）：

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/blog/:slug',
        headers: [
          {
            key: 'x-slug',
            value: ':slug', // 可以在值中使用匹配的参数
          },
          {
            key: 'x-slug-:slug', // 可以在键中使用匹配的参数
            value: '我的其他自定义标头值',
          },
        ],
      },
    ]
  },
}
```

### 通配符路径匹配

要匹配一个通配符路径，可以在参数后使用 `*`，例如 `/blog/:slug*` 将匹配 `/blog/a/b/c/d/hello-world`：

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/blog/:slug*',
        headers: [
          {
            key: 'x-slug',
            value: ':slug*', // 可以在值中使用匹配的参数
          },
          {
            key: 'x-slug-:slug*', // 可以在键中使用匹配的参数
            value: '我的其他自定义标头值',
          },
        ],
      },
    ]
  },
}
```

### 正则表达式路径匹配

要匹配一个正则表达式路径，可以将正则表达式用括号括起来放在参数后面，例如 `/blog/:slug(\d{1,})` 将匹配 `/blog/123` 但不会匹配 `/blog/abc`：

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/blog/:post(\d{1,})',
        headers: [
          {
            key: 'x-post',
            value: ':post',
          },
        ],
      },
    ]
  },
}
```

以下字符 `(`, `)`, `{`, `}`, `:`, `*`, `+`, `?` 用于正则表达式路径匹配，因此当在 `source` 中作为非特殊值使用时，必须通过在它们前面添加 `\\` 来转义：

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        // 这将匹配被请求的 `/english(default)/something`
        source: '/english\\(default\\)/:slug',
        headers: [
          {
            key: 'x-header',
            value: 'value',
          },
        ],
      },
    ]
  },
}
```
## 标题、Cookie和查询匹配

当标题、Cookie或查询的值也匹配 `has` 字段或不匹配 `missing` 字段时，可以仅应用标题。必须匹配 `source` 和所有 `has` 项，并且所有 `missing` 项都不匹配，才能应用标题。

`has` 和 `missing` 项可以有以下字段：

- `type`: `String` - 必须是 `header`、`cookie`、`host` 或 `query` 之一。
- `key`: `String` - 要匹配的选定类型中的键。
- `value`: `String` 或 `undefined` - 要检查的值，如果未定义，则任何值都将匹配。可以使用类似正则表达式的字符串来捕获值的特定部分，例如，如果使用 `first-(?<paramName>.*)` 作为 `first-second` 的 `value`，则 `second` 将在目的地中可用，使用 `:paramName`。

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      // 如果存在标题 `x-add-header`，
      // 将应用 `x-another-header` 标题
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-add-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // 如果不存在标题 `x-no-header`，
      // 将应用 `x-another-header` 标题
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-no-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // 如果匹配了源、查询和Cookie，
      // 将应用 `x-authorized` 标题
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // 页面值将不可用在
            // 标题键/值中，因为提供了值
            // 并且没有使用命名捕获组，例如 (?<page>home)
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        headers: [
          {
            key: 'x-authorized',
            value: ':authorized',
          },
        ],
      },
      // 如果存在标题 `x-authorized` 并且
      // 包含匹配的值，将应用 `x-another-header`
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
      // 如果主机是 `example.com`，
      // 将应用此标题
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
    ]
  },
}
```

## 支持basePath的标题

当使用 [`basePath` 支持](/docs/app/api-reference/next-config-js/basePath) 与标题时，每个 `source` 会自动加上 `basePath` 的前缀，除非你在标题中添加 `basePath: false`：

```js filename="next.config.js"
module.exports = {
  basePath: '/docs',

  async headers() {
    return [
      {
        source: '/with-basePath', // 变成 /docs/with-basePath
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        source: '/without-basePath', // 由于设置了 basePath: false，所以没有修改
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
        basePath: false,
      },
    ]
  },
}
```
## 支持i18n的Headers

<AppOnly>

当利用[`i18n`支持](/docs/app/building-your-application/routing/internationalization)与headers时，每个`source`会自动加上前缀以处理配置的`locales`，除非你在header中添加`locale: false`。如果使用了`locale: false`，你必须在`source`前加上一个locale，以便正确匹配。

</AppOnly>

<PagesOnly>

当利用[`i18n`支持](/docs/pages/building-your-application/routing/internationalization)与headers时，每个`source`会自动加上前缀以处理配置的`locales`，除非你在header中添加`locale: false`。如果使用了`locale: false`，你必须在`source`前加上一个locale，以便正确匹配。

</PagesOnly>

```js filename="next.config.js"
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  async headers() {
    return [
      {
        source: '/with-locale', // 自动处理所有locale
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // 由于设置了locale: false，不自动处理locales
        source: '/nl/with-locale-manual',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // 这匹配'/'，因为`en`是defaultLocale
        source: '/en',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // 这被转换为/(en|fr|de)/(.*)，所以不会匹配顶级
        // `/` 或 `/fr` 路由，像 /:path* 会
        source: '/(.*)',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}
```

## Cache-Control

你不能在`next.config.js`中为页面或资源设置`Cache-Control` headers，因为这些headers在生产中会被覆盖，以确保响应和静态资源被有效缓存。

<AppOnly>

了解更多关于[缓存](/docs/app/building-your-application/caching)与App Router。

</AppOnly>

<PagesOnly>

如果你需要重新验证一个已经被[静态生成](/docs/pages/building-your-application/rendering/static-site-generation)的页面的缓存，你可以通过在页面的[`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)函数中设置`revalidate`属性来实现。

你可以在你的[API Routes](/docs/pages/building-your-application/routing/api-routes)中通过使用`res.setHeader`方法来设置`Cache-Control` header：

```ts filename="pages/api/hello.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.setHeader('Cache-Control', 's-maxage=86400')
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

```js filename="pages/api/hello.js" switcher
export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=86400')
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

</PagesOnly>


## 选项


```
### 跨源资源共享 (CORS)

[跨源资源共享 (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS) 是一项安全特性，允许您控制哪些网站可以访问您的资源。您可以设置 `Access-Control-Allow-Origin` 标头，以允许特定来源访问您的 <PagesOnly>API 端点</PagesOnly><AppOnly>路由处理器</AppOnly>。

```js
async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // 设置您的来源
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
```

### X-DNS-Prefetch-Control

[这个标头](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control) 控制 DNS 预取，允许浏览器主动对外部链接、图片、CSS、JavaScript 等执行域名解析。这种预取是在后台进行的，因此当需要引用的项目时，[DNS](https://developer.mozilla.org/docs/Glossary/DNS) 更有可能已经被解析。这减少了用户点击链接时的延迟。

```js
{
  key: 'X-DNS-Prefetch-Control',
  value: 'on'
}
```

### Strict-Transport-Security

[这个标头](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security) 通知浏览器应该只通过 HTTPS 访问，而不是使用 HTTP。使用下面的配置，所有当前和未来的子域名将使用 HTTPS，`max-age` 设置为 2 年。这阻止了只能通过 HTTP 服务的页面或子域名的访问。

如果您在 [Vercel](https://vercel.com/docs/concepts/edge-network/headers#strict-transport-security?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 上部署，这个标头是不必要的，因为它会自动添加到所有部署中，除非您在 `next.config.js` 中声明了 `headers`。

```js
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

### X-Frame-Options

[这个标头](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options) 指示网站是否应该被允许在 `iframe` 中显示。这可以防止点击劫持攻击。

**这个标头已经被 CSP 的 `frame-ancestors` 选项取代**，在现代浏览器中有更好的支持（有关配置详细信息，请参见 [内容安全策略](/docs/app/building-your-application/configuring/content-security-policy)）。

```js
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN'
}
```

### Permissions-Policy

[这个标头](https://developer.mozilla.org/docs/Web/HTTP/Headers/Permissions-Policy) 允许您控制浏览器中可以使用哪些功能和 API。它之前被称为 `Feature-Policy`。

```js
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
}
```

### X-Content-Type-Options

[这个标头](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options) 防止浏览器在没有明确设置 `Content-Type` 标头的情况下尝试猜测内容类型。这可以防止 XSS 利用，对于允许用户上传和共享文件的网站来说尤其重要。

例如，一个用户试图下载一个图片，但是被当作不同的 `Content-Type` 处理，如可执行文件，这可能是恶意的。这个标头也适用于下载浏览器扩展。这个标头的唯一有效值是 `nosniff`。

```js
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}
```
### Referrer-Policy

[这个头部](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy) 控制浏览器在从当前网站（源）导航到另一个网站时包含的信息。

```js
{
  key: 'Referrer-Policy',
  value: 'origin-when-cross-origin'
}
```

### Content-Security-Policy

了解更多关于如何为您的应用程序添加 [内容安全策略](/docs/app/building-your-application/configuring/content-security-policy)。

## 版本历史

| 版本   | 变更          |
| --------- | ---------------- |
| `v13.3.0` | `missing` 添加。 |
| `v10.2.0` | `has` 添加。     |
| `v9.5.0`  | 头部添加。   |