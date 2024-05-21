# opengraph-image 和 twitter-image

API 参考文档，介绍了 Open Graph 图片和 Twitter 图片文件约定。

`opengraph-image` 和 `twitter-image` 文件约定允许你为路由片段设置 Open Graph 和 Twitter 图片。

它们在用户分享你的网站链接时，对于在社交网络和消息应用上显示的图片非常有用。

设置 Open Graph 和 Twitter 图片有两种方法：

- [使用图片文件 (.jpg, .png, .gif)](#图片文件jpg-png-gif)
- [使用代码生成图片 (.js, .ts, .tsx)](#使用代码生成图片js-ts-tsx)


## 图片文件 (.jpg, .png, .gif)

通过在片段中放置一个 `opengraph-image` 或 `twitter-image` 图片文件，使用图片文件来设置路由片段的共享图片。

Next.js 将评估该文件，并自动将适当的标签添加到你的应用的 `<head>` 元素中。

| 文件约定                                 | 支持的文件类型            |
| ----------------------------------------------- | ------------------------------- |
| [`opengraph-image`](#opengraph-image)           | `.jpg`, `.jpeg`, `.png`, `.gif` |
| [`twitter-image`](#twitter-image)               | `.jpg`, `.jpeg`, `.png`, `.gif` |
| [`opengraph-image.alt`](#opengraph-imagealttxt) | `.txt`                          |
| [`twitter-image.alt`](#twitter-imagealttxt)     | `.txt`                          |

### `opengraph-image`

向任何路由片段添加一个 `opengraph-image.(jpg|jpeg|png|gif)` 图片文件。

```html filename="<head> 输出"
<meta property="og:image" content="<生成的>" />
<meta property="og:image:type" content="<生成的>" />
<meta property="og:image:width" content="<生成的>" />
<meta property="og:image:height" content="<生成的>" />
```

### `twitter-image`

向任何路由片段添加一个 `twitter-image.(jpg|jpeg|png|gif)` 图片文件。

```html filename="<head> 输出"
<meta name="twitter:image" content="<生成的>" />
<meta name="twitter:image:type" content="<生成的>" />
<meta name="twitter:image:width" content="<生成的>" />
<meta name="twitter:image:height" content="<生成的>" />
```

### `opengraph-image.alt.txt`

在与 `opengraph-image.(jpg|jpeg|png|gif)` 图片相同的路由片段中添加一个配套的 `opengraph-image.alt.txt` 文件，作为它的 alt 文本。

```txt filename="opengraph-image.alt.txt"
关于 Acme
```

```html filename="<head> 输出"
<meta property="og:image:alt" content="关于 Acme" />
```

### `twitter-image.alt.txt`

在与 `twitter-image.(jpg|jpeg|png|gif)` 图片相同的路由片段中添加一个配套的 `twitter-image.alt.txt` 文件，作为它的 alt 文本。

```txt filename="twitter-image.alt.txt"
关于 Acme
```

```html filename="<head> 输出"
<meta property="twitter:image:alt" content="关于 Acme" />
```
## 使用代码生成图片 (.js, .ts, .tsx)

除了使用[字面意义上的图片文件](#image-files-jpg-png-gif)，您还可以通过代码**生成**图片。

通过创建一个默认导出函数的`opengraph-image`或`twitter-image`路由，生成路由段的共享图片。

| 文件约定       | 支持的文件类型 |
| -------------- | -------------- |
| `opengraph-image` | `.js`, `.ts`, `.tsx` |
| `twitter-image`   | `.js`, `.ts`, `.tsx` |

> **须知**
>
> - 默认情况下，生成的图片是[**静态优化**](/docs/app/building-your-application/rendering/server-components#static-rendering-default)的（在构建时生成并缓存），除非它们使用[动态函数](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)或未缓存的数据。
> - 您可以使用[`generateImageMetadata`](/docs/app/api-reference/functions/generate-image-metadata)在同一文件中生成多个图片。

生成图片的最简单方法是使用`next/og`中的[ImageResponse](/docs/app/api-reference/functions/image-response) API。

```tsx filename="app/about/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'

// 图片元数据
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// 图片生成
export default async function Image() {
  // 字体
  const interSemiBold = fetch(
    new URL('./Inter-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      // ImageResponse JSX元素
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About Acme
      </div>
    ),
    // ImageResponse选项
    {
      // 为了方便，我们可以重用导出的opengraph-image
      // 大小配置来设置ImageResponse的宽度和高度。
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

```jsx filename="app/about/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'

// 图片元数据
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// 图片生成
export default async function Image() {
  // 字体
  const interSemiBold = fetch(
    new URL('./Inter-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      // ImageResponse JSX元素
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About Acme
      </div>
    ),
    // ImageResponse选项
    {
      // 为了方便，我们可以重用导出的opengraph-image
      // 大小配置来设置ImageResponse的宽度和高度。
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

```html filename="<head> output"
<meta property="og:image" content="<generated>" />
<meta property="og:image:alt" content="About Acme" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```
### Props

默认导出的函数接收以下属性：

#### `params` (可选)

一个对象，包含从根段到 `opengraph-image` 或 `twitter-image` 共存的段的[动态路由参数](/docs/app/building-your-application/routing/dynamic-routes)对象。

```tsx filename="app/shop/[slug]/opengraph-image.tsx" switcher
export default function Image({ params }: { params: { slug: string } }) {
  // ...
}
```

```jsx filename="app/shop/[slug]/opengraph-image.js" switcher
export default function Image({ params }) {
  // ...
}
```

| 路由                                      | URL         | `params`                  |
| ------------------------------------------ | ----------- | ------------------------- |
| `app/shop/opengraph-image.js`              | `/shop`     | `undefined`               |
| `app/shop/[slug]/opengraph-image.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/opengraph-image.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/opengraph-image.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

### 返回值

默认导出的函数应返回一个 `Blob` | `ArrayBuffer` | `TypedArray` | `DataView` | `ReadableStream` | `Response`。

> **须知**：`ImageResponse` 满足此返回类型。

### 配置导出

你可以通过从 `opengraph-image` 或 `twitter-image` 路由导出 `alt`、`size` 和 `contentType` 变量来选择性地配置图像的元数据。

| 选项                        | 类型                                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`alt`](#alt)                 | `string`                                                                                                        |
| [`size`](#size)               | `{ width: number; height: number }`                                                                             |
| [`contentType`](#contenttype) | `string` - [图像 MIME 类型](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

#### `alt`

```tsx filename="opengraph-image.tsx | twitter-image.tsx" switcher
export const alt = 'My images alt text'

export default function Image() {}
```

```jsx filename="opengraph-image.js | twitter-image.js" switcher
export const alt = 'My images alt text'

export default function Image() {}
```

```html filename="<head> output"
<meta property="og:image:alt" content="My images alt text" />
```

#### `size`

```tsx filename="opengraph-image.tsx | twitter-image.tsx" switcher
export const size = { width: 1200, height: 630 }

export default function Image() {}
```

```jsx filename="opengraph-image.js | twitter-image.js" switcher
export const size = { width: 1200, height: 630 }

export default function Image() {}
```

```html filename="<head> output"
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

#### `contentType`

```tsx filename="opengraph-image.tsx | twitter-image.tsx" switcher
export const contentType = 'image/png'

export default function Image() {}
```

```jsx filename="opengraph-image.js | twitter-image.js" switcher
export const contentType = 'image/png'

export default function Image() {}
```

```html filename="<head> output"
<meta property="og:image:type" content="image/png" />
```

#### 路由段配置

`opengraph-image` 和 `twitter-image` 是特殊的 [路由处理器](/docs/app/building-your-application/routing/route-handlers)，可以使用与页面和布局相同的 [路由段配置](/docs/app/api-reference/file-conventions/route-segment-config) 选项。
### 示例

#### 使用外部数据

这个示例使用 `params` 对象和外部数据来生成图像。

> **须知**：
> 默认情况下，这个生成的图像将被[静态优化](/docs/app/building-your-application/rendering/server-components#static-rendering-default)。你可以配置个别的 `fetch` [`options`](/docs/app/api-reference/functions/fetch) 或路由段 [options](/docs/app/api-reference/file-conventions/route-segment-config#revalidate) 来改变这种行为。

```tsx filename="app/posts/[slug]/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await fetch(`https://.../posts/${params.slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

```jsx filename="app/posts/[slug]/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }) {
  const post = await fetch(`https://.../posts/${params.slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

#### 使用 Edge 运行时与本地资源

这个示例使用 Edge 运行时来获取文件系统上的本地图像，并将其实作为 `ArrayBuffer` 传递给 `<img>` 元素的 `src` 属性。本地资源应该放置在示例源文件位置的相对路径下。

```jsx filename="app/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'

export const runtime = 'edge'

export async function GET() {
  const logoSrc = await fetch(new URL('./logo.png', import.meta.url)).then(
    (res) => res.arrayBuffer()
  )

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

#### 使用 Node.js 运行时与本地资源

这个示例使用 Node.js 运行时来获取文件系统上的本地图像，并将其实作为 `ArrayBuffer` 传递给 `<img>` 元素的 `src` 属性。本地资源应该放置在项目根目录的相对路径下，而不是示例源文件的位置。

```jsx filename="app/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

export async function GET() {
  const logoData = await readFile(join(process.cwd(), 'logo.png'))
  const logoSrc = Uint8Array.from(logoData).buffer

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

## 版本历史

| 版本   | 变化                                           |
| --------- | ------------------------------------------------- |
| `v13.3.0` | 引入了 `opengraph-image` 和 `twitter-image`。 |