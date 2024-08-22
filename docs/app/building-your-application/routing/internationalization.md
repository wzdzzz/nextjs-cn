# 国际化

Next.js 支持通过国际化路由和本地化内容来配置支持多种语言。使您的网站适应不同的地区包括翻译内容（本地化）和国际化路由。

## 术语

- **地区代码：** 一组语言和格式偏好的标识符。这通常包括用户的首选语言以及可能的地理区域。
  - `en-US`: 美国英语
  - `nl-NL`: 荷兰语，荷兰地区
  - `nl`: 荷兰语，无特定地区

## 路由概览

建议使用浏览器中用户的语言偏好来选择使用哪个地区代码。更改您的首选语言将修改传入的 `Accept-Language` 头部到您的应用程序。

例如，使用以下库，您可以查看传入的 `Request` 以确定基于 `Headers`、您计划支持的地区代码和默认地区代码选择哪个地区。

```js filename="middleware.js"
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let headers = { 'accept-language': 'en-US,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['en-US', 'nl-NL', 'nl']
let defaultLocale = 'en-US'

match(languages, locales, defaultLocale) // -> 'en-US'
```

路由可以通过子路径（`/fr/products`）或域名（`my-site.fr/products`）进行国际化。有了这些信息，您现在可以根据内部 [中间件](/docs/app/building-your-application/routing/middleware) 中的地区代码重定向用户。

```js filename="middleware.js"
import { NextResponse } from "next/server";

let locales = ['en-US', 'nl-NL', 'nl']

// 获取首选地区代码，类似于上述或使用库
function getLocale(request) { ... }

export function middleware(request) {
  // 检查路径名中是否有任何支持的地区代码
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // 如果没有地区代码则重定向
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // 例如，传入请求是 /products
  // 新 URL 现在是 /en-US/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // 跳过所有内部路径 (_next)
    '/((?!_next).*)',
    // 可选：仅在根 (/) URL 上运行
    // '/'
  ],
}
```

最后，确保所有特殊文件都嵌套在 `app/[lang]` 下。这使得 Next.js 路由器能够动态处理路由中的不同地区代码，并将 `lang` 参数传递给每个布局和页面。例如：

```jsx filename="app/[lang]/page.js"
// 您现在可以访问当前地区代码
// 例如。/en-US/products -> `lang` 是 "en-US"
export default async function Page({ params: { lang } }) {
  return ...
}
```

根布局也可以嵌套在新文件夹中（例如 `app/[lang]/layout.js`）。
## Localization

根据用户首选语言环境或本地化更改显示内容并不是Next.js特有的。下面描述的模式同样适用于任何网络应用程序。

假设我们希望在我们的应用程序中支持英语和荷兰语内容。我们可能会维护两个不同的“字典”，这些对象为我们提供了从某个键到本地化字符串的映射。例如：

```json filename="dictionaries/en.json"
{
  "products": {
    "cart": "Add to Cart"
  }
}
```

```json filename="dictionaries/nl.json"
{
  "products": {
    "cart": "Toevoegen aan Winkelwagen"
  }
}
```

然后我们可以创建一个`getDictionary`函数来加载所请求语言环境的翻译：

```jsx filename="app/[lang]/dictionaries.js"
import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()
```

根据当前选定的语言，我们可以在布局或页面中获取字典。

```jsx filename="app/[lang]/page.js"
import { getDictionary } from './dictionaries'

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang) // en
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

由于`app/`目录中的所有布局和页面默认为[服务器组件](/docs/app/building-your-application/rendering/server-components)，我们不需要担心翻译文件的大小影响我们的客户端JavaScript捆绑包大小。此代码将**仅在服务器上运行**，并且只有生成的HTML将发送到浏览器。

## 静态生成

要为一组给定的语言环境生成静态路由，我们可以使用`generateStaticParams`与任何页面或布局。这可以是全局的，例如，在根布局中：

```jsx filename="app/[lang]/layout.js"
export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'de' }]
}

export default function Root({ children, params }) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  )
}
```

## 资源

- [最小化i18n路由和翻译](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing)
- [`next-intl`](https://next-intl-docs.vercel.app/docs/next-13)
- [`next-international`](https://github.com/QuiiBz/next-international)
- [`next-i18n-router`](https://github.com/i18nexus/next-i18n-router)
- [`inlang`](https://inlang.com/c/nextjs)