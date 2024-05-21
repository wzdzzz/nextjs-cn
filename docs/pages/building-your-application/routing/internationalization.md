---
title: 国际化 (i18n) 路由
nav_title: 国际化
description: Next.js 自 `v10.0.0` 起内置支持国际化路由和语言检测。了解更多信息请点击这里。
---

<details>
  <summary>示例</summary>

- [i18n 路由](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing)

</details>

Next.js 自 `v10.0.0` 起内置支持国际化（[i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming)）路由。您可以提供一系列地区设置、默认地区设置以及特定于域的地区设置，Next.js 将自动处理路由。

i18n 路由支持目前旨在补充现有的 i18n 库解决方案，如 [`react-intl`](https://formatjs.io/docs/getting-started/installation)、[`react-i18next`](https://react.i18next.com/)、[`lingui`](https://lingui.dev/)、[`rosetta`](https://github.com/lukeed/rosetta)、[`next-intl`](https://github.com/amannn/next-intl)、[`next-translate`](https://github.com/aralroca/next-translate)、[`next-multilingual`](https://github.com/Avansai/next-multilingual)、[`tolgee`](https://tolgee.io/integrations/next)、[`inlang`](https://inlang.com/c/nextjs) 等，通过简化路由和地区解析来实现。

## 开始使用

要开始使用，请将 `i18n` 配置添加到您的 `next.config.js` 文件中。

地区设置是 [UTS 地区设置标识符](https://www.unicode.org/reports/tr35/tr35-59/tr35.html#Identifiers)，这是定义地区设置的标准格式。

通常，地区设置标识符由语言、地区和脚本组成，它们之间用连字符分隔：`language-region-script`。地区和脚本是可选的。例如：

- `en-US` - 在美国使用的英语
- `nl-NL` - 在荷兰使用的荷兰语
- `nl` - 荷兰语，没有特定地区

如果用户地区设置为 `nl-BE` 并且未在您的配置中列出，如果有可用的 `nl`，则它们将被重定向到 `nl`，否则将被重定向到默认地区设置。

如果您不打算支持一个国家的所有地区，那么包含将作为回退的国家地区设置是一个好习惯。

```js filename="next.config.js"
module.exports = {
  i18n: {
    // 这些都是您希望在
    // 您的应用程序中支持的所有地区设置
    locales: ['en-US', 'fr', 'nl-NL'],
    // 当访问非地区前缀路径时，例如 `/hello`
    // 您希望使用的默认地区设置
    defaultLocale: 'en-US',
    // 这是地区设置域列表以及它们应该处理的默认地区设置
    // （这些仅在设置域路由时需要）
    // 注意：要匹配，子域必须包含在域值中，例如 "fr.example.com"。
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en-US',
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl-NL',
      },
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
        // 还可以使用可选的 http 字段来测试
        // 使用 http 而不是 https 本地测试地区设置域
        http: true,
      },
    ],
  },
}
```
## 国际化策略

有两种国际化处理策略：子路径路由和域名路由。

### 子路径路由

子路径路由将语言环境信息放在URL路径中。

```js filename="next.config.js"
module.exports = {
  i18n: {
    locales: ['en-US', 'fr', 'nl-NL'],
    defaultLocale: 'en-US',
  },
}
```

使用上述配置，`en-US`、`fr` 和 `nl-NL` 将可用于路由，`en-US` 是默认的语言环境。如果你有一个 `pages/blog.js`，那么以下URL将可用：

- `/blog`
- `/fr/blog`
- `/nl-nl/blog`

默认语言环境没有前缀。

### 域名路由

通过使用域名路由，你可以配置不同的域名来提供不同的语言环境：

```js filename="next.config.js"
module.exports = {
  i18n: {
    locales: ['en-US', 'fr', 'nl-NL', 'nl-BE'],
    defaultLocale: 'en-US',

    domains: [
      {
        // 注意：子域名必须包含在域名值中才能匹配
        // 例如，如果预期的主机名是 www.example.com，则应使用 www.example.com
        domain: 'example.com',
        defaultLocale: 'en-US',
      },
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl-NL',
        // 指定应重定向到该域名的其他语言环境
        locales: ['nl-BE'],
      },
    ],
  },
}
```

例如，如果你有 `pages/blog.js`，那么以下URL将可用：

- `example.com/blog`
- `www.example.com/blog`
- `example.fr/blog`
- `example.nl/blog`
- `example.nl/nl-BE/blog`
## 自动地区检测

当用户访问应用程序的根目录（通常是 `/`）时，Next.js 会尝试根据 [`Accept-Language`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Language) 头部和当前域名自动检测用户偏好的语言环境。

如果检测到的地区与默认地区不同，用户将被重定向到：

- **使用子路径路由时：** 带有地区前缀的路径
- **使用域名路由时：** 指定该地区为默认值的域名

使用域名路由时，如果用户带有 `Accept-Language` 头部 `fr;q=0.9` 访问 `example.com`，他们将被重定向到 `example.fr`，因为该域名默认处理 `fr` 地区。

使用子路径路由时，用户将被重定向到 `/fr`。

### 为默认地区添加前缀

在 Next.js 12 和 [中间件](/docs/pages/building-your-application/routing/middleware) 中，我们可以通过一个[变通方法](https://github.com/vercel/next.js/discussions/18419)为默认地区添加前缀。

例如，下面是一个支持几种语言的 `next.config.js` 文件。请注意，`"default"` 地区是有意添加的。

```js filename="next.config.js"
module.exports = {
  i18n: {
    locales: ['default', 'en', 'de', 'fr'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  trailingSlash: true,
}
```

接下来，我们可以使用 [中间件](/docs/pages/building-your-application/routing/middleware) 添加自定义路由规则：

```ts filename="middleware.ts"
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  if (req.nextUrl.locale === 'default') {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en'

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )
  }
}
```

这个 [中间件](/docs/pages/building-your-application/routing/middleware) 跳过了为 [API 路由](/docs/pages/building-your-application/routing/api-routes) 和 [公共](/docs/pages/building-your-application/optimizing/static-assets) 文件（如字体或图片）添加默认前缀。如果请求是针对默认地区的，我们将重定向到我们的前缀 `/en`。

### 禁用自动地区检测

可以通过以下方式禁用自动地区检测：

```js filename="next.config.js"
module.exports = {
  i18n: {
    localeDetection: false,
  },
}
```

当 `localeDetection` 设置为 `false` 时，Next.js 将不再根据用户偏好的地区自动重定向，并且只会提供从上述基于地区的域名或地区路径检测到的地区信息。

## 访问地区信息

您可以通过 Next.js 路由器访问地区信息。例如，使用 [`useRouter()`](/docs/pages/api-reference/functions/use-router) 钩子，可以访问以下属性：

- `locale` 包含当前活动的地区。
- `locales` 包含所有配置的地区。
- `defaultLocale` 包含配置的默认地区。

当使用 `getStaticProps` 或 `getServerSideProps` [预渲染](/docs/pages/building-your-application/rendering/static-site-generation) 页面时，地区信息会在提供给函数的 [上下文](/docs/pages/building-your-application/data-fetching/get-static-props) 中提供。

当利用 `getStaticPaths` 时，配置的地区会在函数的上下文参数中提供，在 `locales` 下，配置的 defaultLocale 在 `defaultLocale` 下。
## 切换语言环境

您可以使用 `next/link` 或 `next/router` 在不同的语言环境之间进行切换。

对于 `next/link`，可以提供一个 `locale` 属性来切换到当前激活的语言环境之外的其他语言环境。如果没有提供 `locale` 属性，在客户端过渡期间将使用当前激活的 `locale`。例如：

```jsx
import Link from 'next/link'

export default function IndexPage(props) {
  return (
    <Link href="/another" locale="fr">
      To /fr/another
    </Link>
  )
}
```

当直接使用 `next/router` 方法时，您可以通过过渡选项指定应使用的 `locale`。例如：

```jsx
import { useRouter } from 'next/router'

export default function IndexPage(props) {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        router.push('/another', '/another', { locale: 'fr' })
      }}
    >
      to /fr/another
    </div>
  )
}
```

请注意，为了在仅切换 `locale` 同时保留所有路由信息，如[动态路由](/docs/pages/building-your-application/routing/dynamic-routes)查询值或隐藏的 href 查询值，您可以将 `href` 参数作为对象提供：

```jsx
import { useRouter } from 'next/router'
const router = useRouter()
const { pathname, asPath, query } = router
// 仅更改语言环境并保留包括 href 查询在内的所有其他路由信息
router.push({ pathname, query }, asPath, { locale: nextLocale })
```

有关 `router.push` 对象结构的更多信息，请参见[此处](/docs/pages/api-reference/functions/use-router#with-url-object)。

如果您有一个已经包含语言环境的 `href`，您可以选择不自动处理语言环境前缀：

```jsx
import Link from 'next/link'

export default function IndexPage(props) {
  return (
    <Link href="/fr/another" locale={false}>
      To /fr/another
    </Link>
  )
}
```

## 利用 `NEXT_LOCALE` 饼干

Next.js 允许设置一个 `NEXT_LOCALE=the-locale` 饼干，它优先于接受语言头部。这个饼干可以使用语言切换器设置，然后当用户回到网站时，它将在从 `/` 重定向到正确的语言环境位置时利用饼干中指定的语言环境。

例如，如果用户在其接受语言头部中喜欢语言环境 `fr`，但是设置了 `NEXT_LOCALE=en` 饼干，那么在访问 `/` 时用户将被重定向到 `en` 语言环境位置，直到饼干被移除或过期。

## 搜索引擎优化

由于 Next.js 知道用户访问的语言，它将自动向 `<html>` 标签添加 `lang` 属性。

Next.js 不知道页面的变体，因此需要您使用 [`next/head`](/docs/pages/api-reference/components/head) 添加 `hreflang` 元标签。您可以在 [Google Webmasters 文档](https://support.google.com/webmasters/answer/189077)中了解更多关于 `hreflang` 的信息。
## 静态生成与国际化路由如何协同工作？

> 注意，国际化路由并不与 [`output: 'export'`](/docs/pages/building-your-application/deploying/static-exports) 集成，因为它不利用 Next.js 的路由层。不使用 `output: 'export'` 的混合 Next.js 应用程序是完全支持的。

### 动态路由和 `getStaticProps` 页面

对于使用 `getStaticProps` 和 [动态路由](/docs/pages/building-your-application/routing/dynamic-routes) 的页面，所有希望预渲染的页面的本地化变体都需要从 [`getStaticPaths`](/docs/pages/building-your-application/data-fetching/get-static-paths) 返回。除了为 `paths` 返回的 `params` 对象外，您还可以返回一个 `locale` 字段，指定您想要渲染的本地化设置。例如：

```jsx filename="pages/blog/[slug].js"
export const getStaticPaths = ({ locales }) => {
  return {
    paths: [
      // 如果没有提供 `locale`，则只生成 defaultLocale
      { params: { slug: 'post-1' }, locale: 'en-US' },
      { params: { slug: 'post-1' }, locale: 'fr' },
    ],
    fallback: true,
  }
}
```

对于 [自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization) 和非动态 `getStaticProps` 页面，**将为每种本地化设置生成页面的一个版本**。这很重要，因为它可能会根据 `getStaticProps` 中配置的本地化设置数量增加构建时间。

例如，如果您配置了50种本地化设置，并且有10个使用 `getStaticProps` 的非动态页面，这意味着 `getStaticProps` 将被调用500次。在每次构建期间将生成10个页面的50个版本。

要减少具有 `getStaticProps` 的动态页面的构建时间，请使用 [`fallback` 模式](/docs/pages/api-reference/functions/get-static-paths#fallback-true)。这允许您在构建期间仅从 `getStaticPaths` 返回最受欢迎的路径和本地化设置以进行预渲染。然后，Next.js 将在运行时根据请求构建剩余页面。

### 自动静态优化页面

对于 [自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization) 的页面，将为每种本地化设置生成页面的一个版本。

### 非动态 getStaticProps 页面

对于非动态 `getStaticProps` 页面，如上所述，为每种本地化设置生成一个版本。`getStaticProps` 将使用正在渲染的每种 `locale` 被调用。如果您希望从预渲染中选择退出某个特定的本地化设置，您可以从 `getStaticProps` 返回 `notFound: true`，这样页面的这个变体就不会被生成。

```js
export async function getStaticProps({ locale }) {
  // 调用外部 API 端点以获取帖子。
  // 您可以使用任何数据获取库
  const res = await fetch(`https://.../posts?locale=${locale}`)
  const posts = await res.json()

  if (posts.length === 0) {
    return {
      notFound: true,
    }
  }

  // 通过返回 { props: posts }，博客组件
  // 将在构建时作为属性接收 `posts`
  return {
    props: {
      posts,
    },
  }
}
```

## i18n 配置的限制

- `locales`: 总共100个本地化设置
- `domains`: 总共100个本地化设置域名项

> **须知**：这些限制最初是为了防止 [构建时的性能问题](#dynamic-routes-and-getstaticprops-pages)。您可以使用 Next.js 12 中的 [中间件](/docs/pages/building-your-application/routing/middleware) 进行自定义路由来绕过这些限制。