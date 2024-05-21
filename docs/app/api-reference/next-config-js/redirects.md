# redirects

```
title: 重定向
description: 在您的 Next.js 应用中添加重定向。
```

{/* 此文档的内容在应用和页面路由器之间共享。您可以使用 `<PagesOnly>内容</PagesOnly>` 组件添加特定于页面路由器的内容。任何共享的内容都不应被包装在组件中。 */}

重定向允许您将传入请求的路径重定向到不同的目标路径。

要使用重定向，您可以在 `next.config.js` 中使用 `redirects` 键：

```js filename="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ]
  },
}
```

`redirects` 是一个异步函数，它期望返回一个数组，该数组包含具有 `source`、`destination` 和 `permanent` 属性的对象：

- `source` 是传入请求的路径模式。
- `destination` 是您想要路由到的路径。
- `permanent` `true` 或 `false` - 如果为 `true` 将使用 308 状态码，该状态码指示客户端/搜索引擎永久缓存重定向；如果为 `false` 将使用 307 状态码，该状态码是临时的并且不会被缓存。

> **为什么 Next.js 使用 307 和 308？** 传统上，302 用于临时重定向，301 用于永久重定向，但许多浏览器更改了重定向的请求方法为 `GET`，而不考虑原始方法。例如，如果浏览器向 `POST /v1/users` 发送请求，该请求返回状态码 `302` 并带有位置 `/v2/users`，则随后的请求可能是 `GET /v2/users` 而不是预期的 `POST /v2/users`。Next.js 使用 307 临时重定向和 308 永久重定向状态码，明确地保留使用的请求方法。

- `basePath`: `false` 或 `undefined` - 如果为 false，则在匹配时不包含 `basePath`，只能用于外部重定向。
- `locale`: `false` 或 `undefined` - 是否在匹配时不包含地区。
- `has` 是一个 [has 对象](#header-cookie-and-query-matching) 数组，具有 `type`、`key` 和 `value` 属性。
- `missing` 是一个 [missing 对象](#header-cookie-and-query-matching) 数组，具有 `type`、`key` 和 `value` 属性。

重定向在检查文件系统之前进行检查，这包括页面和 `/public` 文件。

当使用页面路由器时，除非存在 [中间件](/docs/app/building-your-application/routing/middleware) 并匹配路径，否则重定向不适用于客户端路由（`Link`、`router.push`）。

当应用重定向时，请求中提供的任何查询值都将传递到重定向目标。例如，请参阅以下重定向配置：

```js
{
  source: '/old-blog/:path*',
  destination: '/blog/:path*',
  permanent: false
}
```

当请求 `/old-blog/post-1?hello=world` 时，客户端将被重定向到 `/blog/post-1?hello=world`。
## 路径匹配

路径匹配是允许的，例如 `/old-blog/:slug` 将匹配 `/old-blog/hello-world`（不匹配嵌套路径）：

```js filename="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug', // 匹配的参数可以在目标中使用
        permanent: true,
      },
    ]
  },
}
```

### 通配符路径匹配

为了匹配一个通配符路径，你可以在参数后使用 `*`，例如 `/blog/:slug*` 将匹配 `/blog/a/b/c/d/hello-world`：

```js filename="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*', // 匹配的参数可以在目标中使用
        permanent: true,
      },
    ]
  },
}
```

### 正则表达式路径匹配

为了匹配一个正则表达式路径，你可以在参数后用括号将正则表达式括起来，例如 `/post/:slug(\d{1,})` 将匹配 `/post/123` 但不会匹配 `/post/abc`：

```js filename="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        source: '/post/:slug(\d{1,})',
        destination: '/news/:slug', // 匹配的参数可以在目标中使用
        permanent: false,
      },
    ]
  },
}
```

以下字符 `(`, `)`, `{`, `}`, `:`, `*`, `+`, `?` 用于正则表达式路径匹配，因此当它们在 `source` 中作为非特殊值使用时，必须通过在它们前面添加 `\\` 来进行转义：

```js filename="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        // 这将匹配被请求的 `/english(default)/something`
        source: '/english\\(default\\)/:slug',
        destination: '/en-us/:slug',
        permanent: false,
      },
    ]
  },
}
```
# Header, Cookie, and Query Matching

## 标题：Header、Cookie和Query匹配

当需要在匹配重定向时同时匹配`has`字段的值，或者不匹配`missing`字段的值时，可以使用`has`和`missing`字段。`source`和所有的`has`项必须匹配，所有的`missing`项必须不匹配，才能应用重定向。

`has`和`missing`项可以包含以下字段：

- `type`: `String` - 必须是`header`、`cookie`、`host`或`query`之一。
- `key`: `String` - 从选定类型中匹配的键。
- `value`: `String` 或 `undefined` - 要检查的值，如果未定义，则任何值都会匹配。可以使用类似正则表达式的字符串来捕获值的特定部分，例如，如果对于`first-second`使用值`first-(?<paramName>.*)`，则`second`将可以在目的地中使用`:paramName`。

```js filename="next.config.js"
module.exports = {
  async redirects() {
    return [
      // 如果存在头部`x-redirect-me`，
      // 将应用此重定向
      {
        source: '/:path((?!another-page$).*)',
        has: [
          {
            type: 'header',
            key: 'x-redirect-me',
          },
        ],
        permanent: false,
        destination: '/another-page',
      },
      // 如果存在头部`x-dont-redirect`，
      // 将不应用此重定向
      {
        source: '/:path((?!another-page$).*)',
        missing: [
          {
            type: 'header',
            key: 'x-do-not-redirect',
          },
        ],
        permanent: false,
        destination: '/another-page',
      },
      // 如果匹配了源、查询和Cookie，
      // 将应用此重定向
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // 由于提供了值并且没有使用命名捕获组，
            // 例如(?<page>home)，因此在目的地中页面值将不可用
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        permanent: false,
        destination: '/another/:path*',
      },
      // 如果存在头部`x-authorized`并且
      // 包含匹配的值，将应用此重定向
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        permanent: false,
        destination: '/home?authorized=:authorized',
      },
      // 如果主机是`example.com`，
      // 将应用此重定向
      {
        source: '/:path((?!another-page$).*)',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        permanent: false,
        destination: '/another-page',
      },
    ]
  },
}
```

### Redirects with basePath support

当使用[`basePath`支持](/docs/app/api-reference/next-config-js/basePath)与重定向结合时，每个`source`和`destination`会自动加上`basePath`前缀，除非你在重定向中添加`basePath: false`：

```js filename="next.config.js"
module.exports = {
  basePath: '/docs',

  async redirects() {
    return [
      {
        source: '/with-basePath', // 自动变为 /docs/with-basePath
        destination: '/another', // 自动变为 /docs/another
        permanent: false,
      },
      {
        // 不添加/docs，因为设置了basePath: false
        source: '/without-basePath',
        destination: 'https://example.com',
        basePath: false,
        permanent: false,
      },
    ]
  },
}
```
### 支持国际化的重定向

<AppOnly>

当利用 [`i18n` 支持](/docs/app/building-your-application/routing/internationalization) 进行重定向时，每个 `source` 和 `destination` 会自动加上前缀以处理配置的 `locales`，除非你在重定向中添加 `locale: false`。如果使用了 `locale: false`，则必须为 `source` 和 `destination` 添加一个语言环境前缀，以便正确匹配。

</AppOnly>

<PagesOnly>

当利用 [`i18n` 支持](/docs/pages/building-your-application/routing/internationalization) 进行重定向时，每个 `source` 和 `destination` 会自动加上前缀以处理配置的 `locales`，除非你在重定向中添加 `locale: false`。如果使用了 `locale: false`，则必须为 `source` 和 `destination` 添加一个语言环境前缀，以便正确匹配。

</PagesOnly>

```js filename="next.config.js"
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  async redirects() {
    return [
      {
        source: '/with-locale', // 自动处理所有语言环境
        destination: '/another', // 自动传递语言环境
        permanent: false,
      },
      {
        // 由于设置了 locale: false，因此不自动处理语言环境
        source: '/nl/with-locale-manual',
        destination: '/nl/another',
        locale: false,
        permanent: false,
      },
      {
        // 由于 `en` 是 defaultLocale，这会匹配 '/'
        source: '/en',
        destination: '/en/another',
        locale: false,
        permanent: false,
      },
      // 即使设置了 locale: false，也可以匹配所有语言环境
      {
        source: '/:locale/page',
        destination: '/en/newpage',
        permanent: false,
        locale: false,
      },
      {
        // 这将转换为 /(en|fr|de)/(.*)，因此不会匹配顶级的
        // `/` 或 `/fr` 路由，像 /:path* 会的那样
        source: '/(.*)',
        destination: '/another',
        permanent: false,
      },
    ]
  },
}
```

在某些罕见的情况下，您可能需要为旧版的 HTTP 客户端分配一个自定义状态码以正确重定向。在这些情况下，您可以使用 `statusCode` 属性而不是 `permanent` 属性，但不能同时使用两者。为了确保 IE11 的兼容性，对于 308 状态码会自动添加一个 `Refresh` 头。

## 其他重定向

- 在 [API Routes](/docs/pages/building-your-application/routing/api-routes) 和 [Route Handlers](/docs/app/building-your-application/routing/route-handlers) 中，您可以根据传入的请求进行重定向。
- 在 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 和 [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props) 中，您可以在请求时重定向特定页面。

## 版本历史

| 版本   | 变更            |
| --------- | ------------------ |
| `v13.3.0` | `missing` 添加。   |
| `v10.2.0` | `has` 添加。       |
| `v9.5.0`  | `redirects` 添加。 |