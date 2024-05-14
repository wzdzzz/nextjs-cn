---
title: 元数据
description: 使用元数据 API 在任何布局或页面中定义元数据。
相关：
  description: 查看所有元数据 API 选项。
  links:
    - app/api-reference/functions/generate-metadata
    - app/api-reference/file-conventions/metadata
    - app/api-reference/functions/generate-viewport
---

Next.js 提供了一个元数据 API，可用于定义应用程序的元数据（例如 HTML `head` 元素内的 `meta` 和 `link` 标签），以改善 SEO 和网络共享性。

您可以使用以下两种方式之一为您的应用程序添加元数据：

- **基于配置的元数据**：在 `layout.js` 或 `page.js` 文件中导出一个 [静态 `metadata` 对象](/docs/app/api-reference/functions/generate-metadata#metadata-object) 或一个动态的 [`generateMetadata` 函数](/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)。
- **基于文件的元数据**：向路由段添加静态或动态生成的特殊文件。

使用这两种选项，Next.js 将自动为您的页面生成相关的 `<head>` 元素。您还可以使用 [`ImageResponse`](/docs/app/api-reference/functions/image-response) 构造函数创建动态的 OG 图像。

## 静态元数据

要定义静态元数据，请从 `layout.js` 或静态 `page.js` 文件中导出一个 [`Metadata` 对象](/docs/app/api-reference/functions/generate-metadata#metadata-object)。

```tsx filename="layout.tsx | page.tsx" switcher
import type { Metadata } from 'next'

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

所有可用选项，请参见 [API 参考](/docs/app/api-reference/functions/generate-metadata)。

## 动态元数据

您可以使用 `generateMetadata` 函数来获取需要动态值的元数据。

```tsx filename="app/products/[id]/page.tsx" switcher
import type { Metadata, ResolvingMetadata } from 'next'

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

所有可用参数，请参见 [API 参考](/docs/app/api-reference/functions/generate-metadata)。

> **须知**：
>
> - 通过 `generateMetadata` 的静态和动态元数据都**仅在服务器组件中受支持**。
> - `fetch` 请求会自动为 `generateMetadata`、`generateStaticParams`、布局、页面和服务器组件中的相同数据进行 [记忆化](/docs/app/building-your-application/caching#request-memoization)。如果 `fetch` 不可用，可以使用 React [`cache`](/docs/app/building-your-application/caching#request-memoization)。
> - Next.js 将等待# 文件元数据

在 `generateMetadata` 中使用 `t` 来获取数据，以确保在将 UI 流式传输到客户端之前完成。这保证了 [流式响应](/docs/app/building-your-application/routing/loading-ui-and-streaming) 的第一部分包含 `<head>` 标签。

## 基于文件的元数据

以下是可用于元数据的特殊文件：

- [favicon.ico, apple-icon.jpg, 和 icon.jpg](/docs/app/api-reference/file-conventions/metadata/app-icons)
- [opengraph-image.jpg 和 twitter-image.jpg](/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [robots.txt](/docs/app/api-reference/file-conventions/metadata/robots)
- [sitemap.xml](/docs/app/api-reference/file-conventions/metadata/sitemap)

您可以使用这些文件进行静态元数据，或者您可以使用代码程序化地生成这些文件。

有关实现和示例，请参见 [元数据文件](/docs/app/api-reference/file-conventions/metadata) API 参考和 [动态图像生成](#dynamic-image-generation)。

## 行为

基于文件的元数据具有更高的优先级，并将覆盖任何基于配置的元数据。

### 默认字段

即使路由没有定义元数据，也会始终添加两个默认的 `meta` 标签：

- [meta charset 标签](https://developer.mozilla.org/docs/Web/HTML/Element/meta#attr-charset) 设置网站的字符编码。
- [meta viewport 标签](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) 设置网站的视口宽度和缩放比例，以适应不同的设备。

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

> **须知**：您可以覆盖默认的 [`viewport`](/docs/app/api-reference/functions/generate-metadata#viewport) meta 标签。

### 排序

元数据按顺序评估，从根段开始，一直到最终 `page.js` 段最近的段。例如：

1. `app/layout.tsx`（根布局）
2. `app/blog/layout.tsx`（嵌套的博客布局）
3. `app/blog/[slug]/page.tsx`（博客页面）

### 合并

按照 [评估顺序](#ordering)，同一路由中多个段导出的元数据对象被 **浅合并** 以形成路由的最终元数据输出。重复的键根据其顺序被 **替换**。

这意味着在早期段中定义的具有嵌套字段的元数据，如 [`openGraph`](/docs/app/api-reference/functions/generate-metadata#opengraph) 和 [`robots`](/docs/app/api-reference/functions/generate-metadata#robots)，将被最后一个定义它们的段 **覆盖**。

#### 覆盖字段

```jsx filename="app/layout.js"
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}
```

```jsx filename="app/blog/page.js"
export const metadata = {
  title: 'Blog',
  openGraph: {
    title: 'Blog',
  },
}

// 输出：
// <title>Blog</title>
// <meta property="og:title" content="Blog" />
```

在上面的示例中：

- `app/layout.js` 中的 `title` 被 `app/blog/page.js` 中的 `title` **替换**。
- 因为 `app/blog/page.js` 设置了 `openGraph` 元数据，所以 `app/layout.js` 中的所有 `openGraph` 字段都被 **替换**。注意缺少 `openGraph.description`。

如果您希望在覆盖其他字段的同时在段之间共享一些嵌套字段，可以将它们提取到一个单独的变量中：

```jsx filename="app/shared-metadata.js"
export const openGraphImage = { images: ['http://...'] }
```

```jsx filename="app/page.js"
import { openGraphImage } from './shared-metadata'

export const metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'Home',
  },
}
```

```jsx filename="app/about/page.js"
import { openGraphImage } from '../shared-metadata'

export const metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'About',
  },
}
```

在上面的示例中，OG 图片在 `app/layout.js` 和 `app/about/page.js` 之间共享，而标题则不同。

#### 继承字段## 应用布局

```jsx filename="app/layout.js"
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme 是一个...',
  },
}
```

```jsx filename="app/about/page.js"
export const metadata = {
  title: '关于',
}

// 输出：
// <title>关于</title>
// <meta property="og:title" content="Acme" />
// <meta property="og:description" content="Acme 是一个..." />
```

**注意**

- `app/layout.js` 中的 `title` 被 `app/about/page.js` 中的 `title` **替换**。
- 因为 `app/about/page.js` 没有设置 `openGraph` 元数据，所以它在 `app/about/page.js` 中**继承**了所有 `openGraph` 字段。

## 动态图片生成

`ImageResponse` 构造函数允许您使用 JSX 和 CSS 生成动态图片。这对于创建社交媒体图片（如 Open Graph 图片、Twitter 卡片等）非常有用。

要使用它，您可以从 `next/og` 导入 `ImageResponse`：

```jsx filename="app/about/route.js"
import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Hello world!
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  )
}
```

`ImageResponse` 与 Next.js 的其他 API 集成得很好，包括 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 和基于文件的元数据。例如，您可以在 `opengraph-image.tsx` 文件中使用 `ImageResponse` 在构建时或请求时动态生成 Open Graph 图片。

`ImageResponse` 支持常见的 CSS 属性，包括 flexbox 和绝对定位、自定义字体、文本换行、居中和嵌套图片。[查看支持的 CSS 属性完整列表](/docs/app/api-reference/functions/image-response)。

> **须知**：
>
> - 示例可在 [Vercel OG Playground](https://og-playground.vercel.app/) 中找到。
> - `ImageResponse` 使用 [@vercel/og](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation)、[Satori](https://github.com/vercel/satori) 和 Resvg 将 HTML 和 CSS 转换为 PNG。
> - 仅支持 Edge 运行时。默认的 Node.js 运行时将无法工作。
> - 仅支持 flexbox 和 CSS 属性的子集。高级布局（例如 `display: grid`）将无法工作。
> - 最大捆绑包大小为 `500KB`。捆绑包大小包括您的 JSX、CSS、字体、图片和任何其他资产。如果您超出限制，请考虑在运行时减少任何资产的大小或获取。
> - 仅支持 `ttf`、`otf` 和 `woff` 字体格式。为了最大化字体解析速度，推荐使用 `ttf` 或 `otf` 而不是 `woff`。

## JSON-LD

[JSON-LD](https://json-ld.org/) 是一种结构化数据格式，搜索引擎可以用它来理解您的内容。例如，您可以用它来描述一个人、一个事件、一个组织、一部电影、一本书、一个食谱以及许多其他类型的实体。

我们当前对 JSON-LD 的建议是在您的 `layout.js` 或 `page.js` 组件中将结构化数据作为 `<script>` 标签呈现。例如：

```tsx filename="app/products/[id]/page.tsx" switcher
export default async function Page({ params }) {
  const product = await getProduct(params.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <section>
      {/* 将 JSON-LD 添加到您的页面 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ... */}
    </section>
  )
}
```

```jsx filename="app/products/[id]/page.js" switcher
export default async function Page({ params }) {
  const product = await getProduct(params.id)
  // ...其他代码
}
``````markdown
# JSON-LD 结构化数据

```jsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: product.image,
  description: product.description,
}

return (
  <section>
    {/* 将 JSON-LD 添加到您的页面 */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    {/* ... */}
  </section>
)
}
```

您可以使用 Google 的 [Rich Results Test](https://search.google.com/test/rich-results) 或通用的 [Schema Markup Validator](https://validator.schema.org/) 来验证和测试您的结构化数据。

您可以使用社区包如 [`schema-dts`](https://www.npmjs.com/package/schema-dts) 使用 TypeScript 输入您的 JSON-LD：

```tsx
import { Product, WithContext } from 'schema-dts'

const jsonLd: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Next.js Sticker',
  image: 'https://nextjs.org/imgs/sticker.png',
  description: 'Dynamic at the speed of static.',
}
```
```