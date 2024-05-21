---
title: 元数据对象和generateMetadata选项
nav_title: generateMetadata
description: 了解如何为您的Next.js应用程序添加元数据，以改善搜索引擎优化（SEO）和网络共享性。
related:
  title: 下一步
  description: 查看所有元数据API选项。
  links:
    - app/api-reference/file-conventions/metadata
    - app/api-reference/functions/generate-viewport
    - app/building-your-application/optimizing/metadata
---

本页涵盖了所有基于配置的元数据选项，使用`generateMetadata`和静态元数据对象。

```tsx filename="layout.tsx | page.tsx" switcher
import { Metadata } from 'next'

// 静态元数据
export const metadata: Metadata = {
  title: '...',
}

// 或动态元数据
export async function generateMetadata({ params }) {
  return {
    title: '...',
  }
}
```

```jsx filename="layout.js | page.js" switcher
// 静态元数据
export const metadata = {
  title: '...',
}

// 或动态元数据
export async function generateMetadata({ params }) {
  return {
    title: '...',
  }
}
```

> **须知**：
>
> - `metadata`对象和`generateMetadata`函数导出**仅支持在服务器组件中**。
> - 您不能从同一路由段导出`metadata`对象和`generateMetadata`函数。

## `metadata`对象

要定义静态元数据，请从一个`layout.js`或`page.js`文件中导出一个[`Metadata`对象](#元数据字段)。

```tsx filename="layout.tsx | page.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '...',
  description: '...',
}

export default function Page() {}
```

```jsx filename="layout.js | page.js" switcher
export const metadata = {
  title: '...',
  description: '...',
}

export default function Page() {}
```

查看[元数据字段](#元数据字段)以获取支持选项的完整列表。
## `generateMetadata` 函数

动态元数据依赖于**动态信息**，例如当前路由参数、外部数据或父段中的 `metadata`，可以通过导出一个返回 [`Metadata` 对象](#metadata-fields) 的 `generateMetadata` 函数来设置。

```tsx filename="app/products/[id]/page.tsx" switcher
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 读取路由参数
  const id = params.id

  // 获取数据
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // 可选地访问并扩展（而不是替换）父元数据
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

export default function Page({ params, searchParams }: Props) {}
```

```jsx filename="app/products/[id]/page.js" switcher
export async function generateMetadata({ params, searchParams }, parent) {
  // 读取路由参数
  const id = params.id

  // 获取数据
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // 可选地访问并扩展（而不是替换）父元数据
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

export default function Page({ params, searchParams }) {}
```

### 参数

`generateMetadata` 函数接受以下参数：

- `props` - 包含当前路由参数的对象：

  - `params` - 包含从根段到调用 `generateMetadata` 的段的 [动态路由参数](/docs/app/building-your-application/routing/dynamic-routes) 对象。示例：

    | 路由                           | URL         | `params`                  |
    | ------------------------------- | ----------- | ------------------------- |
    | `app/shop/[slug]/page.js`       | `/shop/1`   | `{ slug: '1' }`           |
    | `app/shop/[tag]/[item]/page.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
    | `app/shop/[...slug]/page.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

  - `searchParams` - 包含当前 URL 的 [搜索参数](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#parameters) 的对象。示例：

    | URL             | `searchParams`       |
    | --------------- | -------------------- |
    | `/shop?a=1`     | `{ a: '1' }`         |
    | `/shop?a=1&b=2` | `{ a: '1', b: '2' }` |
    | `/shop?a=1&a=2` | `{ a: ['1', '2'] }`  |

- `parent` - 来自父路由段的解析元数据的承诺。

### 返回值

`generateMetadata` 应该返回一个包含一个或多个元数据字段的 [`Metadata` 对象](#metadata-fields)。

> **须知**：
>
> - 如果元数据不依赖于运行时信息，应该使用静态的 [`metadata` 对象](#the-metadata-object) 而不是 `generateMetadata`。
> - `fetch` 请求会自动针对 `generateMetadata`、`generateStaticParams`、布局、页面和服务器组件中的相同数据进行 [记忆化](/docs/app/building-your-application/caching#request-memoization)。如果 `fetch` 不可用，可以使用 React [`cache`](/docs/app/building-your-application/caching#request-memoization)。
> - `searchParams` 只在 `page.js` 段中可用。
> - Next.js 方法 [`redirect()`](/docs/app/api-reference/functions/redirect) 和 [`notFound()`](/docs/app/api-reference/functions/not-found) 也可以在 `generateMetadata` 中使用。

## 元数据字段
### `title`

`title` 属性用于设置文档的标题。它可以被定义为一个简单的 [字符串](#string) 或者一个可选的 [模板对象](#template-object)。

#### 字符串

```jsx filename="layout.js | page.js"
export const metadata = {
  title: 'Next.js',
}
```

```html filename="<head> output" hideLineNumbers
<title>Next.js</title>
```
#### 模板对象

```tsx filename="app/layout.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '...',
    default: '...',
    absolute: '...',
  },
}
```

```jsx filename="app/layout.js" switcher
export const metadata = {
  title: {
    default: '...',
    template: '...',
    absolute: '...',
  },
}
```

##### 默认值

`title.default` 可以用来为没有定义 `title` 的子路由段提供 **备用标题**。

```tsx filename="app/layout.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Acme',
  },
}
```

```tsx filename="app/about/page.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {}

// 输出: <title>Acme</title>
```

##### 模板

`title.template` 可以用来为 **子** 路由段中定义的 `titles` 添加前缀或后缀。

```tsx filename="app/layout.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme', // 创建模板时需要一个默认值
  },
}
```

```jsx filename="app/layout.js" switcher
export const metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme', // 创建模板时需要一个默认值
  },
}
```

```tsx filename="app/about/page.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

// 输出: <title>About | Acme</title>
```

```jsx filename="app/about/page.js" switcher
export const metadata = {
  title: 'About',
}

// 输出: <title>About | Acme</title>
```

> **须知**：
>
> - `title.template` 应用于 **子** 路由段，而不是定义它的段。这意味着：
>
>   - 添加 `title.template` 时，**必须** 有 `title.default`。
>   - 在 `layout.js` 中定义的 `title.template` 不会应用于同一路由段中 `page.js` 定义的 `title`。
>   - 在 `page.js` 中定义的 `title.template` 无效，因为页面始终是路由的终止段（它没有任何子路由段）。
>
> - 如果路由没有定义 `title` 或 `title.default`，`title.template` 将 **无效**。

##### 绝对值

`title.absolute` 可以用来提供忽略在父段中设置的 `title.template` 的标题。

```tsx filename="app/layout.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
  },
}
```

```jsx filename="app/layout.js" switcher
export const metadata = {
  title: {
    template: '%s | Acme',
  },
}
```

```tsx filename="app/about/page.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'About',
  },
}

// 输出: <title>About</title>
```

```jsx filename="app/about/page.js" switcher
export const metadata = {
  title: {
    absolute: 'About',
  },
}

// 输出: <title>About</title>
```

> **须知**：
>
> - `layout.js`
>
>   - `title`（字符串）和 `title.default` 定义了子段的默认标题（没有定义自己的 `title`）。如果存在，它将增加来自最近父段的 `title.template`。
>   - `title.absolute` 定义了子段的默认标题。它忽略了来自父段的 `title.template`。
>   - `title.template` 为子段定义了一个新的标题模板。
>
> - `page.js`
>   - 如果页面没有定义自己的标题，将使用最近父段解析的标题。
>   - `title`（字符串）定义了路由的标题。如果存在，它将增加来自最近父段的 `title.template`。
>   - `title.absolute` 定义了路由标题。它忽略了来自父段的 `title.template`。
>   - `page.js` 中的 `title.template` 无效，因为页面始终是路由的终止段。
## `description`

```jsx filename="layout.js | page.js"
export const metadata = {
  描述: '为Web构建的React框架',
}
```

```html filename="<head> output" hideLineNumbers
<meta name="description" content="为Web构建的React框架" />
```

## 基础字段

```jsx filename="layout.js | page.js"
export const metadata = {
  生成器: 'Next.js',
  应用名称: 'Next.js',
  来源: 'origin-when-cross-origin',
  关键词: ['Next.js', 'React', 'JavaScript'],
  作者: [{ name: 'Seb' }, { name: 'Josh', url: 'https://nextjs.org' }],
  创建者: 'Jiachi Liu',
  出版者: 'Sebastian Markbåge',
  格式检测: {
    电子邮件: false,
    地址: false,
    电话: false,
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta name="application-name" content="Next.js" />
<meta name="author" content="Seb" />
<link rel="author" href="https://nextjs.org" />
<meta name="author" content="Josh" />
<meta name="generator" content="Next.js" />
<meta name="keywords" content="Next.js,React,JavaScript" />
<meta name="referrer" content="origin-when-cross-origin" />
<meta name="color-scheme" content="dark" />
<meta name="creator" content="Jiachi Liu" />
<meta name="publisher" content="Sebastian Markbåge" />
<meta name="format-detection" content="telephone=no, address=no, email=no" />
```

## `metadataBase`

`metadataBase` 是一个方便的选项，用于为需要完全合格 URL 的 `metadata` 字段设置一个基本 URL 前缀。

- `metadataBase` 允许在 **当前路由段及以下** 定义的基于 URL 的 `metadata` 字段使用 **相对路径**，而不是否则所需的绝对 URL。
- 字段的相对路径将与 `metadataBase` 组合以形成一个完全合格的 URL。
- 如果没有配置，`metadataBase` 将 **自动填充** 一个 [默认值](#默认值)。

```jsx filename="layout.js | page.js"
export const metadata = {
  metadataBase: new URL('https://acme.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
}
```

```html filename="<head> output" hideLineNumbers
<link rel="canonical" href="https://acme.com" />
<link rel="alternate" hreflang="en-US" href="https://acme.com/en-US" />
<link rel="alternate" hreflang="de-DE" href="https://acme.com/de-DE" />
<meta property="og:image" content="https://acme.com/og-image.png" />
```

> **须知**：
>
> - `metadataBase` 通常在根 `app/layout.js` 中设置，以便跨所有路由应用于基于 URL 的 `metadata` 字段。
> - 所有需要绝对 URL 的基于 URL 的 `metadata` 字段都可以使用 `metadataBase` 选项进行配置。
> - `metadataBase` 可以包含子域，例如 `https://app.acme.com` 或基本路径，例如 `https://acme.com/start/from/here`
> - 如果 `metadata` 字段提供了一个绝对 URL，`metadataBase` 将被忽略。
> - 在没有配置 `metadataBase` 的情况下，在基于 URL 的 `metadata` 字段中使用相对路径将导致构建错误。
> - Next.js 将规范化 `metadataBase`（例如 `https://acme.com/`）和相对字段（例如 `/path`）之间的重复斜杠为单个斜杠（例如 `https://acme.com/path`）
# 默認值

如果未配置，`metadataBase` 具有**默認值**。

> 在 Vercel 上：
>
> - 对于生产部署，将使用 `VERCEL_PROJECT_PRODUCTION_URL`。
> - 对于预览部署，`VERCEL_BRANCH_URL` 将优先使用，如果不存在则回退到 `VERCEL_URL`。
>
> 如果这些值存在，它们将被用作 `metadataBase` 的**默认值**，否则将回退到 `http://localhost:${process.env.PORT || 3000}`。这允许 Open Graph 图片在本地构建和 Vercel 预览以及生产部署上工作。在覆盖默认值时，我们建议使用环境变量来计算 URL。这样可以为本地开发、暂存和生产环境配置 URL。
>
> 有关这些环境变量的更多详细信息，请参阅 [系统环境变量](https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables) 文档。

# URL 组合

URL 组合优先考虑开发者意图而不是默认的目录遍历语义。

- `metadataBase` 和 `metadata` 字段之间的尾随斜杠将被规范化。
- `metadata` 字段中的“绝对”路径（通常将替换整个 URL 路径）被视为“相对”路径（从 `metadataBase` 的末尾开始）。

例如，给定以下 `metadataBase`：

```tsx filename="app/layout.tsx" switcher
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://acme.com'),
}
```

```jsx filename="app/layout.js" switcher
export const metadata = {
  metadataBase: new URL('https://acme.com'),
}
```

任何继承上述 `metadataBase` 并设置自己值的 `metadata` 字段将按以下方式解析：

| `metadata` 字段                 | 解析后的 URL                     |
| -------------------------------- | -------------------------------- |
| `/`                              | `https://acme.com`               |
| `./`                             | `https://acme.com`               |
| `payments`                       | `https://acme.com/payments`      |
| `/payments`                      | `https://acme.com/payments`      |
| `./payments`                     | `https://acme.com/payments`      |
| `../payments`                    | `https://acme.com/payments`      |
| `https://beta.acme.com/payments` | `https://beta.acme.com/payments` |
### `openGraph`

```jsx filename="layout.js | page.js"
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png', // 必须是一个绝对URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://nextjs.org/og-alt.png', // 必须是一个绝对URL
        width: 1800,
        height: 1600,
        alt: '我的自定义alt',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:url" content="https://nextjs.org/" />
<meta property="og:site_name" content="Next.js" />
<meta property="og:locale" content="en_US" />
<meta property="og:image:url" content="https://nextjs.org/og.png" />
<meta property="og:image:width" content="800" />
<meta property="og:image:height" content="600" />
<meta property="og:image:url" content="https://nextjs.org/og-alt.png" />
<meta property="og:image:width" content="1800" />
<meta property="og:image:height" content="1600" />
<meta property="og:image:alt" content="我的自定义alt" />
<meta property="og:type" content="website" />
```

```jsx filename="layout.js | page.js"
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    type: 'article',
    publishedTime: '2023-01-01T00:00:00.000Z',
    authors: ['Seb', 'Josh'],
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2023-01-01T00:00:00.000Z" />
<meta property="article:author" content="Seb" />
<meta property="article:author" content="Josh" />
```

> **须知**：
>
> - 使用[基于文件的元数据API](/docs/app/api-reference/file-conventions/metadata/opengraph-image#image-files-jpg-png-gif)可能更方便。与必须同步配置导出和实际文件相比，基于文件的API将自动为您生成正确的元数据。

### `robots`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta name="robots" content="noindex, follow, nocache" />
<meta
  name="googlebot"
  content="index, nofollow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
/>
```
### 图标 `icons`

> **须知**：我们建议尽可能使用[基于文件的元数据API](/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png)来处理图标。与必须同步配置导出和实际文件不同，基于文件的API将自动为您生成正确的元数据。

```jsx filename="layout.js | page.js"
export const metadata = {
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
}
```

```html filename="<head> output" hideLineNumbers
<link rel="shortcut icon" href="/shortcut-icon.png" />
<link rel="icon" href="/icon.png" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
<link
  rel="apple-touch-icon-precomposed"
  href="/apple-touch-icon-precomposed.png"
/>
```

```jsx filename="layout.js | page.js"
export const metadata = {
  icons: {
    icon: [
      { url: '/icon.png' },
      new URL('/icon.png', 'https://example.com'),
      { url: '/icon-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: ['/shortcut-icon.png'],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
}
```

```html filename="<head> output" hideLineNumbers
<link rel="shortcut icon" href="/shortcut-icon.png" />
<link rel="icon" href="/icon.png" />
<link rel="icon" href="https://example.com/icon.png" />
<link rel="icon" href="/icon-dark.png" media="(prefers-color-scheme: dark)" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
<link
  rel="apple-touch-icon-precomposed"
  href="/apple-touch-icon-precomposed.png"
/>
<link
  rel="apple-touch-icon"
  href="/apple-icon-x3.png"
  sizes="180x180"
  type="image/png"
/>
```

> **须知**：`msapplication-*` 元标签在 Chromium 构建的 Microsoft Edge 中不再受支持，因此也不再需要。

### `themeColor`

> **已弃用**：`metadata` 中的 `themeColor` 选项在 Next.js 14 中已被弃用。请改用 [`viewport` 配置](/docs/app/api-reference/functions/generate-viewport)。

### `manifest`

Web应用程序清单，如[Web应用程序清单规范](https://developer.mozilla.org/docs/Web/Manifest)中定义的。

```jsx filename="layout.js | page.js"
export const metadata = {
  manifest: 'https://nextjs.org/manifest.json',
}
```

```html filename="<head> output" hideLineNumbers
<link rel="manifest" href="https://nextjs.org/manifest.json" />
```
### `twitter`

`twitter` 规范（出人意料地）不仅仅用于 X（以前称为 Twitter）。

了解更多关于 [Twitter Card 标记参考](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)。

```jsx filename="layout.js | page.js"
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: ['https://nextjs.org/og.png'], // 必须是一个绝对 URL
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site:id" content="1467726470533754880" />
<meta name="twitter:creator" content="@nextjs" />
<meta name="twitter:creator:id" content="1467726470533754880" />
<meta name="twitter:title" content="Next.js" />
<meta name="twitter:description" content="The React Framework for the Web" />
<meta name="twitter:image" content="https://nextjs.org/og.png" />
```

```jsx filename="layout.js | page.js"
export const metadata = {
  twitter: {
    card: 'app',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: {
      url: 'https://nextjs.org/og.png',
      alt: 'Next.js Logo',
    },
    app: {
      name: 'twitter_app',
      id: {
        iphone: 'twitter_app://iphone',
        ipad: 'twitter_app://ipad',
        googleplay: 'twitter_app://googleplay',
      },
      url: {
        iphone: 'https://iphone_url',
        ipad: 'https://ipad_url',
      },
    },
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta name="twitter:site:id" content="1467726470533754880" />
<meta name="twitter:creator" content="@nextjs" />
<meta name="twitter:creator:id" content="1467726470533754880" />
<meta name="twitter:title" content="Next.js" />
<meta name="twitter:description" content="The React Framework for the Web" />
<meta name="twitter:card" content="app" />
<meta name="twitter:image" content="https://nextjs.org/og.png" />
<meta name="twitter:image:alt" content="Next.js Logo" />
<meta name="twitter:app:name:iphone" content="twitter_app" />
<meta name="twitter:app:id:iphone" content="twitter_app://iphone" />
<meta name="twitter:app:id:ipad" content="twitter_app://ipad" />
<meta name="twitter:app:id:googleplay" content="twitter_app://googleplay" />
<meta name="twitter:app:url:iphone" content="https://iphone_url" />
<meta name="twitter:app:url:ipad" content="https://ipad_url" />
<meta name="twitter:app:name:ipad" content="twitter_app" />
<meta name="twitter:app:name:googleplay" content="twitter_app" />
```

### `viewport`

> **已弃用**: `metadata` 中的 `viewport` 选项在 Next.js 14 中已弃用。请改用 [`viewport` 配置](/docs/app/api-reference/functions/generate-viewport)。

### `verification`

```jsx filename="layout.js | page.js"
export const metadata = {
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      me: ['my-email', 'my-link'],
    },
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta name="google-site-verification" content="google" />
<meta name="y_key" content="yahoo" />
<meta name="yandex-verification" content="yandex" />
<meta name="me" content="my-email" />
<meta name="me" content="my-link" />
```
### `appleWebApp`

```jsx filename="layout.js | page.js"
export const metadata = {
  itunes: {
    appId: 'myAppStoreID',
    appArgument: 'myAppArgument',
  },
  appleWebApp: {
    title: 'Apple Web App',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/assets/startup/apple-touch-startup-image-768x1004.png',
      {
        url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta
  name="apple-itunes-app"
  content="app-id=myAppStoreID, app-argument=myAppArgument"
/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Apple Web App" />
<link
  href="/assets/startup/apple-touch-startup-image-768x1004.png"
  rel="apple-touch-startup-image"
/>
<link
  href="/assets/startup/apple-touch-startup-image-1536x2008.png"
  media="(device-width: 768px) and (device-height: 1024px)"
  rel="apple-touch-startup-image"
/>
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
```

### `alternates`

```jsx filename="layout.js | page.js"
export const metadata = {
  alternates: {
    canonical: 'https://nextjs.org',
    languages: {
      'en-US': 'https://nextjs.org/en-US',
      'de-DE': 'https://nextjs.org/de-DE',
    },
    media: {
      'only screen and (max-width: 600px)': 'https://nextjs.org/mobile',
    },
    types: {
      'application/rss+xml': 'https://nextjs.org/rss',
    },
  },
}
```

```html filename="<head> output" hideLineNumbers
<link rel="canonical" href="https://nextjs.org" />
<link rel="alternate" hreflang="en-US" href="https://nextjs.org/en-US" />
<link rel="alternate" hreflang="de-DE" href="https://nextjs.org/de-DE" />
<link
  rel="alternate"
  media="only screen and (max-width: 600px)"
  href="https://nextjs.org/mobile"
/>
<link
  rel="alternate"
  type="application/rss+xml"
  href="https://nextjs.org/rss"
/>
```


### `appLinks`

```jsx filename="layout.js | page.js"
export const metadata = {
  appLinks: {
    ios: {
      url: 'https://nextjs.org/ios',
      app_store_id: 'app_store_id',
    },
    android: {
      package: 'com.example.android/package',
      app_name: 'app_name_android',
    },
    web: {
      url: 'https://nextjs.org/web',
      should_fallback: true,
    },
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta property="al:ios:url" content="https://nextjs.org/ios" />
<meta property="al:ios:app_store_id" content="app_store_id" />
<meta property="al:android:package" content="com.example.android/package" />
<meta property="al:android:app_name" content="app_name_android" />
<meta property="al:web:url" content="https://nextjs.org/web" />
<meta property="al:web:should_fallback" content="true" />
```


### `archives`

```jsx filename="layout.js | page.js"
export const metadata = {
  archives: ['https://nextjs.org/13'],
}
```

```html filename="<head> output" hideLineNumbers
<link rel="archives" href="https://nextjs.org/13" />
```


### `assets`

```jsx filename="layout.js | page.js"
export const metadata = {
  assets: ['https://nextjs.org/assets'],
}
```

```html filename="<head> output" hideLineNumbers
<link rel="assets" href="https://nextjs.org/assets" />
```


### `bookmarks`

```jsx filename="layout.js | page.js"
export const metadata = {
  bookmarks: ['https://nextjs.org/13'],
}
```

```html filename="<head> output" hideLineNumbers
<link rel="bookmarks" href="https://nextjs.org/13" />
```


### `category`

```jsx filename="layout.js | page.js"
export const metadata =
### `其他`

所有元数据选项都应使用内置支持来涵盖。然而，可能存在特定于您网站的自定义元数据标签，或者刚刚发布的全新元数据标签。您可以使用 `other` 选项来呈现任何自定义元数据标签。

```jsx filename="layout.js | page.js"
export const metadata = {
  other: {
    custom: 'meta',
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta name="custom" content="meta" />
```

如果您想生成多个具有相同键的元数据标签，可以使用数组值。

```jsx filename="layout.js | page.js"
export const metadata = {
  other: {
    custom: ['meta1', 'meta2'],
  },
}
```

```html filename="<head> output" hideLineNumbers
<meta name="custom" content="meta1" /> <meta name="custom" content="meta2" />
```
## 不支持的元数据

以下元数据类型当前没有内置支持。但是，它们仍然可以在布局或页面本身中呈现。

| 元数据                      | 建议                                                                                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<meta http-equiv="...">`     | 通过 [`redirect()`](/docs/app/api-reference/functions/redirect)、[Middleware](/docs/app/building-your-application/routing/middleware#nextresponse)、[Security Headers](/docs/app/api-reference/next-config-js/headers) 使用适当的 HTTP 头部 |
| `<base>`                      | 在布局或页面本身中呈现标签。                                                                                                                                                                                                       |
| `<noscript>`                  | 在布局或页面本身中呈现标签。                                                                                                                                                                                                       |
| `<style>`                     | 了解更多关于 [Next.js 中的样式](/docs/app/building-your-application/styling/css-modules)。                                                                                                                                                    |
| `<script>`                    | 了解更多关于 [使用脚本](/docs/app/building-your-application/optimizing/scripts)。                                                                                                                                                          |
| `<link rel="stylesheet" />`   | 直接在布局或页面本身中 `import` 样式表。                                                                                                                                                                                        |
| `<link rel="preload />`       | 使用 [ReactDOM preload 方法](#link-relpreload)                                                                                                                                                                                                    |
| `<link rel="preconnect" />`   | 使用 [ReactDOM preconnect 方法](#link-relpreconnect)                                                                                                                                                                                              |
| `<link rel="dns-prefetch" />` | 使用 [ReactDOM prefetchDNS 方法](#link-reldns-prefetch)                                                                                                                                                                                           |
## 资源提示

`<link>` 元素有多个 `rel` 关键字，可以用来提示浏览器可能需要一个外部资源。浏览器根据这些关键字应用预加载优化。

虽然元数据 API 并不直接支持这些提示，但您可以使用新的 [`ReactDOM` 方法](https://github.com/facebook/react/pull/26237) 将它们安全地插入文档的 `<head>` 中。

```tsx filename="app/preload-resources.tsx" switcher
'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('...', { as: '...' })
  ReactDOM.preconnect('...', { crossOrigin: '...' })
  ReactDOM.prefetchDNS('...')

  return null
}
```

```jsx filename="app/preload-resources.js" switcher
'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('...', { as: '...' })
  ReactDOM.preconnect('...', { crossOrigin: '...' })
  ReactDOM.prefetchDNS('...')

  return null
}
```

#### `<link rel="preload">`

在页面渲染（浏览器）生命周期的早期开始加载资源。[MDN 文档](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preload)。

```tsx
ReactDOM.preload(href: string, options: { as: string })
```

```html filename="<head> output" hideLineNumbers
<link rel="preload" href="..." as="..." />
```

#### `<link rel="preconnect">`

预先启动到一个源的连接。[MDN 文档](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preconnect)。

```tsx
ReactDOM.preconnect(href: string, options?: { crossOrigin?: string })
```

```html filename="<head> output" hideLineNumbers
<link rel="preconnect" href="..." crossorigin />
```

#### `<link rel="dns-prefetch">`

在请求资源之前尝试解析域名。[MDN 文档](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/dns-prefetch)。

```tsx
ReactDOM.prefetchDNS(href: string)
```

```html filename="<head> output" hideLineNumbers
<link rel="dns-prefetch" href="..." />
```

> **须知**：
>
> - 这些方法目前只在客户端组件中支持，这些组件在初始页面加载时仍然是服务器端渲染的。
> - Next.js 的内置特性，如 `next/font`、`next/image` 和 `next/script` 会自动处理相关的资源提示。

## 类型

您可以通过使用 `Metadata` 类型为您的元数据添加类型安全性。如果您在 IDE 中使用了 [内置的 TypeScript 插件](/docs/app/building-your-application/configuring/typescript)，则无需手动添加类型，但您仍然可以明确添加它。

### `metadata` 对象

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js',
}
```

### `generateMetadata` 函数

#### 常规函数

```tsx
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Next.js',
  }
}
```

#### 异步函数

```tsx
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Next.js',
  }
}
```

#### 带有分段属性

```tsx
import type { Metadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateMetadata({ params, searchParams }: Props): Metadata {
  return {
    title: 'Next.js',
  }
}

export default function Page({ params, searchParams }: Props) {}
```

#### 带有父元数据

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Next.js',
  }
}
```

#### JavaScript 项目

对于 JavaScript 项目，您可以使用 JSDoc 添加类型安全性。

```js
/** @type {import("next").Metadata} */
export const metadata = {
  title: 'Next.js',
}
```
## 版本历史

| 版本   | 变更                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.2.0` | `viewport`, `themeColor`, 和 `colorScheme` 已被废弃，推荐使用 [`viewport` 配置](/docs/app/api-reference/functions/generate-viewport)。 |
| `v13.2.0` | 引入了 `metadata` 和 `generateMetadata`。                                                                                                           |