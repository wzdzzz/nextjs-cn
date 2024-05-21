---
title: rewrites
description: 在您的 Next.js 应用中添加重写。
---



重写允许您将传入的请求路径映射到不同的目标路径。

<AppOnly>

重写充当 URL 代理并掩盖目标路径，使得看起来用户没有更改他们在网站上的位置。相比之下，[重定向](/docs/app/api-reference/next-config-js/redirects)将重新路由到一个新页面并显示 URL 更改。

</AppOnly>

<PagesOnly>

重写充当 URL 代理并掩盖目标路径，使得看起来用户没有更改他们在网站上的位置。相比之下，[重定向](/docs/pages/api-reference/next-config-js/redirects)将重新路由到一个新页面并显示 URL 更改。

</PagesOnly>

要使用重写，您可以在 `next.config.js` 中使用 `rewrites` 键：

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/',
      },
    ]
  },
}

```

重写应用于客户端路由，在上面的示例中，`<Link href="/about">` 将应用重写。

`rewrites` 是一个异步函数，期望返回一个数组或一个包含数组的对象（见下文），其中包含具有 `source` 和 `destination` 属性的对象：

- `source`: `String` - 是传入的请求路径模式。
- `destination`: `String` 是您想要路由到的路径。
- `basePath`: `false` 或 `undefined` - 如果为 false，则在匹配时不包括 basePath，只能用于外部重写。
- `locale`: `false` 或 `undefined` - 是否在匹配时不包括地区。
- `has` 是一个 [has 对象](#header-cookie-and-query-matching) 数组，具有 `type`、`key` 和 `value` 属性。
- `missing` 是一个 [missing 对象](#header-cookie-and-query-matching) 数组，具有 `type`、`key` 和 `value` 属性。

当 `rewrites` 函数返回一个数组时，重写在检查文件系统（页面和 `/public` 文件）之后以及动态路由之前应用。当 `rewrites` 函数返回一个具有特定形状的数组对象时，这种行为可以改变，并且可以更精细地控制，从 Next.js 的 `v10.1` 开始：

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return {
      beforeFiles: [
        // 这些重写在检查 headers/redirects 之后进行检查
        // 并在检查所有文件包括 _next/public 文件之前
        // 允许覆盖页面文件
        {
          source: '/some-page',
          destination: '/somewhere-else',
          has: [{ type: 'query', key: 'overrideMe' }],
        },
      ],
      afterFiles: [
        // 这些重写在检查 pages/public 文件之后进行检查
        // 但在动态路由之前
        {
          source: '/non-existent',
          destination: '/somewhere-else',
        },
      ],
      fallback: [
        // 这些重写在检查 pages/public 文件和动态路由之后进行检查
        {
          source: '/:path*',
          destination: `https://my-old-site.com/:path*`,
        },
      ],
    }
  },
}

```
# 须知

> **须知**：在 `beforeFiles` 中的重写不会在匹配到源路径后立即检查文件系统/动态路由，它们会继续执行直到所有 `beforeFiles` 都被检查完毕。

Next.js 路由的检查顺序如下：

<AppOnly>

1. [headers](/docs/app/api-reference/next-config-js/headers) 被检查/应用
2. [redirects](/docs/app/api-reference/next-config-js/redirects) 被检查/应用
3. `beforeFiles` 重写被检查/应用
4. 从 [public 目录](/docs/app/building-your-application/optimizing/static-assets) 的静态文件、`_next/static` 文件和非动态页面被检查/服务
5. `afterFiles` 重写被检查/应用，如果匹配到这些重写中的任何一个，我们会在每个匹配后检查动态路由/静态文件
6. `fallback` 重写被检查/应用，这些在渲染 404 页面之前和在所有动态路由/所有静态资源都被检查后应用。如果你在 `getStaticPaths` 中使用 [fallback: true/'blocking'](/docs/pages/api-reference/functions/get-static-paths#fallback-true)，那么你在 `next.config.js` 中定义的 fallback `rewrites` 将 _不会_ 被运行。

</AppOnly>

<PagesOnly>

1. [headers](/docs/pages/api-reference/next-config-js/headers) 被检查/应用
2. [redirects](/docs/pages/api-reference/next-config-js/redirects) 被检查/应用
3. `beforeFiles` 重写被检查/应用
4. 从 [public 目录](/docs/pages/building-your-application/optimizing/static-assets) 的静态文件、`_next/static` 文件和非动态页面被检查/服务
5. `afterFiles` 重写被检查/应用，如果匹配到这些重写中的任何一个，我们会在每个匹配后检查动态路由/静态文件
6. `fallback` 重写被检查/应用，这些在渲染 404 页面之前和在所有动态路由/所有静态资源都被检查后应用。如果你在 `getStaticPaths` 中使用 [fallback: true/'blocking'](/docs/pages/api-reference/functions/get-static-paths#fallback-true)，那么你在 `next.config.js` 中定义的 fallback `rewrites` 将 _不会_ 被运行。

</PagesOnly>

## 重写参数

在使用重写中的参数时，如果 `destination` 中没有使用任何参数，参数将默认通过查询传递。

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/old-about/:path*',
        destination: '/about', // 这里的 :path 参数没有使用，所以将自动通过查询传递
      },
    ]
  },
}
```

如果 `destination` 中使用了参数，则不会自动通过查询传递任何参数。

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/docs/:path*',
        destination: '/:path*', // 这里的 :path 参数使用了，所以不会自动通过查询传递
      },
    ]
  },
}
```

如果目的地中已经使用了参数，你仍然可以通过在 `destination` 中指定查询来手动传递参数。

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:first/:second',
        destination: '/:first?second=:second',
        // 由于 :first 参数在目的地中使用了，:second 参数
        // 将不会自动添加到查询中，尽管我们可以像上面所示手动添加它
      },
    ]
  },
}
```

> **须知**：来自 [自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization) 或 [预渲染](/docs/pages/building-your-application/data-fetching/get-static-props) 的静态页面的重写参数将在客户端水合后解析，并在查询中提供。
## 路径匹配

路径匹配是允许的，例如 `/blog/:slug` 将匹配 `/blog/hello-world`（不匹配嵌套路径）：

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog/:slug',
        destination: '/news/:slug', // 匹配的参数可以在目标中使用
      },
    ]
  },
}
```

### 通配符路径匹配

要匹配通配符路径，可以在参数后使用 `*`，例如 `/blog/:slug*` 将匹配 `/blog/a/b/c/d/hello-world`：

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*', // 匹配的参数可以在目标中使用
      },
    ]
  },
}
```

### 正则表达式路径匹配

要匹配正则表达式路径，可以将正则表达式用括号括起来放在参数后面，例如 `/blog/:slug(\\d{1,})` 将匹配 `/blog/123` 但不会匹配 `/blog/abc`：

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/old-blog/:post(\\d{1,})',
        destination: '/blog/:post', // 匹配的参数可以在目标中使用
      },
    ]
  },
}
```

以下字符 `(`, `)`, `{`, `}`, `[`, `]`, `|`, `\`, `^`, `.`, `:`, `*`, `+`, `-`, `?`, `$` 用于正则表达式路径匹配，因此当它们在 `source` 中作为非特殊值使用时，必须通过在它们前面添加 `\\` 进行转义：

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        // 这将匹配被请求的 `/english(default)/something`
        source: '/english\\(default\\)/:slug',
        destination: '/en-us/:slug',
      },
    ]
  },
}
```
## 标题、Cookie和查询匹配

要仅在标题、Cookie或查询值也匹配`has`字段或不匹配`missing`字段时匹配重写，可以使用`has`字段或`missing`字段。必须匹配`source`和所有`has`项，并且所有`missing`项都不匹配，才能应用重写。

`has`和`missing`项可以具有以下字段：

- `type`: `String` - 必须是`header`、`cookie`、`host`或`query`之一。
- `key`: `String` - 要匹配的所选类型中的键。
- `value`: `String` 或 `undefined` - 要检查的值，如果未定义，则任何值都将匹配。可以使用类似正则表达式的字符串来捕获值的特定部分，例如，如果对于`first-second`使用值`first-(?<paramName>.*)`，则`second`将在目的地中可用，使用`:paramName`。

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      // 如果存在标题 `x-rewrite-me`，
      // 将应用此重写
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-rewrite-me',
          },
        ],
        destination: '/another-page',
      },
      // 如果不存在标题 `x-rewrite-me`，
      // 将应用此重写
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-rewrite-me',
          },
        ],
        destination: '/another-page',
      },
      // 如果匹配源、查询和Cookie，
      // 将应用此重写
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // 由于提供了值并且没有使用命名捕获组
            // 例如 (?<page>home)，因此在目的地中页面值将不可用
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        destination: '/:path*/home',
      },
      // 如果存在标题 `x-authorized` 并且
      // 包含匹配的值，将应用此重写
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        destination: '/home?authorized=:authorized',
      },
      // 如果主机是 `example.com`，
      // 将应用此重写
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        destination: '/another-page',
      },
    ]
  },
}
```
## 重写到外部URL

<details>
  <summary>示例</summary>

- [逐步采用Next.js](https://github.com/vercel/next.js/tree/canary/examples/custom-routes-proxying)
- [使用多个区域](https://github.com/vercel/next.js/tree/canary/examples/with-zones)

</details>

重写允许您重写到一个外部URL。这对于逐步采用Next.js特别有用。以下是一个示例重写，用于将主应用的`/blog`路由重定向到一个外部网站。

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: 'https://example.com/blog',
      },
      {
        source: '/blog/:slug',
        destination: 'https://example.com/blog/:slug', // 匹配的参数可以在目的地中使用
      },
    ]
  },
}
```

如果您使用`trailingSlash: true`，您还需要在`source`参数中插入一个尾随斜杠。如果目标服务器也期望有一个尾随斜杠，它应该包含在`destination`参数中。

```js filename="next.config.js"
module.exports = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/blog/',
        destination: 'https://example.com/blog/',
      },
      {
        source: '/blog/:path*/',
        destination: 'https://example.com/blog/:path*/',
      },
    ]
  },
}
```

### 逐步采用Next.js

您也可以在检查完所有Next.js路由后，让Next.js回退到代理到现有网站。

这样，在将更多页面迁移到Next.js时，您不必更改重写配置。

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `https://custom-routes-proxying-endpoint.vercel.app/:path*`,
        },
      ],
    }
  },
}
```

### 支持basePath的重写

当利用[`basePath`支持](/docs/app/api-reference/next-config-js/basePath)与重写时，每个`source`和`destination`会自动加上`basePath`前缀，除非您在重写中添加`basePath: false`：

```js filename="next.config.js"
module.exports = {
  basePath: '/docs',

  async rewrites() {
    return [
      {
        source: '/with-basePath', // 自动变为 /docs/with-basePath
        destination: '/another', // 自动变为 /docs/another
      },
      {
        // 不添加 /docs 到 /without-basePath，因为设置了 basePath: false
        // 须知：这不能用于内部重写，例如 `destination: '/another'`
        source: '/without-basePath',
        destination: 'https://example.com',
        basePath: false,
      },
    ]
  },
}
```
## Rewrites with i18n support

<AppOnly>

当使用[`i18n` 支持](/docs/app/building-your-application/routing/internationalization)与重写功能时，每个 `source` 和 `destination` 会自动添加前缀以处理配置的 `locales`，除非你在重写中添加 `locale: false`。如果使用了 `locale: false`，则必须在 `source` 和 `destination` 前添加一个语言环境（locale），以便正确匹配。

</AppOnly>

<PagesOnly>

当使用[`i18n` 支持](/docs/pages/building-your-application/routing/internationalization)与重写功能时，每个 `source` 和 `destination` 会自动添加前缀以处理配置的 `locales`，除非你在重写中添加 `locale: false`。如果使用了 `locale: false`，则必须在 `source` 和 `destination` 前添加一个语言环境（locale），以便正确匹配。

</PagesOnly>

```js filename="next.config.js"
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  async rewrites() {
    return [
      {
        source: '/with-locale', // 自动处理所有语言环境
        destination: '/another', // 自动传递语言环境
      },
      {
        // 由于设置了 locale: false，不自动处理语言环境
        source: '/nl/with-locale-manual',
        destination: '/nl/another',
        locale: false,
      },
      {
        // 由于 `en` 是 defaultLocale，这会匹配 '/'
        source: '/en',
        destination: '/en/another',
        locale: false,
      },
      {
        // 即使设置了 locale: false，也可以匹配所有语言环境
        source: '/:locale/api-alias/:path*',
        destination: '/api/:path*',
        locale: false,
      },
      {
        // 这将被转换为 /(en|fr|de)/(.*)，因此不会匹配顶级的
        // `/` 或 `/fr` 路由，像 /:path* 会的那样
        source: '/(.*)',
        destination: '/another',
      },
    ]
  },
}
```

## 版本历史

| 版本   | 变更          |
| --------- | ---------------- |
| `v13.3.0` | `missing` 添加。 |
| `v10.2.0` | `has` 添加。     |
| `v9.5.0`  | 添加了头部。   |