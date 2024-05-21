---
title: <Image>
description: 使用内置的 `next/image` 组件优化 Next.js 应用中的图片。
---

<details>
  <summary>示例</summary>

- [Image Component](https://github.com/vercel/next.js/tree/canary/examples/image-component)

</details>

<PagesOnly>

> **须知**：如果你使用的是 Next.js 13 之前的版本，你会想要使用 [next/legacy/image](/docs/pages/api-reference/components/image-legacy) 文档，因为该组件已经更名。

</PagesOnly>

本 API 参考将帮助你了解 [props](#props) 和 [配置选项](#configuration-options) 如何用于 Image 组件。有关特性和用法，请参见 [Image Component](/docs/app/building-your-application/optimizing/images) 页面。

```jsx filename="app/page.js"
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/profile.png"
      width={500}
      height={500}
      alt="作者的照片"
    />
  )
}
```


## Props

以下是 Image 组件可用的 props 摘要：

| Prop                         | 示例                                       | 类型          | 状态   |
|-------------------------------|------------------------------------------|---------------|--------|
| [`src`](#src)                | `src="/profile.png"`                     | 字符串        | 必选   |
| [`width`](#width)            | `width={500}`                            | 整数 (px)    | 必选   |
| [`height`](#height)          | `height={500}`                           | 整数 (px)    | 必选   |
| [`alt`](#alt)                | `alt="作者的照片"`                            | 字符串        | 必选   |
| [`loader`](#loader)          | `loader={imageLoader}`                   | 函数          | —      |
| [`fill`](#fill)              | `fill={true}`                            | 布尔值        | —      |
| [`sizes`](#sizes)            | `sizes="(max-width: 768px) 100vw, 33vw"` | 字符串        | —      |
| [`quality`](#quality)        | `quality={80}`                           | 整数 (1-100) | —      |
| [`priority`](#priority)      | `priority={true}`                        | 布尔值        | —      |
| [`placeholder`](#placeholder)| `placeholder="blur"`                     | 字符串        | —      |
| [`style`](#style)            | `style={\{objectFit: "contain"}\}`       | 对象          | —      |
| [`onLoadingComplete`](#onloadingcomplete) | `onLoadingComplete={img => done})`       | 函数          | 已弃用 |
| [`onLoad`](#onload)          | `onLoad={event => done})`                | 函数          | —      |
| [`onError`](#onerror)        | `onError={event => fail()}`              | 函数          | —      |
| [`loading`](#loading)        | `loading="lazy"`                         | 字符串        | —      |
| [`blurDataURL`](#blurdataurl) | `blurDataURL="data:image/jpeg..."`       | 字符串        | —      |
| [`overrideSrc`](#overridesrc)| `overrideSrc="/seo.png"`                 | 字符串        | —      |


## 图片组件的必需属性

图片组件需要以下属性：`src`、`width`、`height` 和 `alt`。

```jsx filename="app/page.js"
import Image from 'next/image'

export default function Page() {
  return (
    <div>
      <Image
        src="/profile.png"
        width={500}
        height={500}
        alt="作者的照片"
      />
    </div>
  )
}
```

### `src`

必须是以下之一：

- 一个[静态导入](/docs/app/building-your-application/optimizing/images#local-images)的图片文件
- 一个路径字符串。这可以是一个绝对的外部 URL，或者是根据[loader](#loader)属性的内部路径。

当使用外部 URL 时，您必须将其添加到 `next.config.js` 中的[remotePatterns](#remotepatterns)。

### `width`

`width` 属性表示以像素为单位的_渲染_宽度，因此它将影响图片显示的大小。

除了[静态导入的图片](/docs/app/building-your-application/optimizing/images#local-images)或具有[`fill`属性](#fill)的图片外，此属性是必需的。

### `height`

`height` 属性表示以像素为单位的_渲染_高度，因此它将影响图片显示的大小。

除了[静态导入的图片](/docs/app/building-your-application/optimizing/images#local-images)或具有[`fill`属性](#fill)的图片外，此属性是必需的。

### `alt`

`alt` 属性用于为屏幕阅读器和搜索引擎描述图片。如果图片被禁用或在加载图片时发生错误，它也是备用文本。

它应该包含可以替换图片的文本[而不改变页面的含义](https://html.spec.whatwg.org/multipage/images.html#general-guidelines)。它不是用来补充图片的，也不应该重复图片上方或下方的标题中已经提供的信息。

如果图片是[纯粹装饰性的](https://html.spec.whatwg.org/multipage/images.html#a-purely-decorative-image-that-doesn't-add-any-information)或[不打算给用户看的](https://html.spec.whatwg.org/multipage/images.html#an-image-not-intended-for-the-user)，`alt` 属性应该是一个空字符串（`alt=""`）。

[了解更多](https://html.spec.whatwg.org/multipage/images.html#alt)

## 可选属性

`<Image />` 组件除了必需的属性之外，还接受许多其他属性。本节描述了图片组件最常用的属性。在[高级属性](#高级属性)部分找到更多不常用属性的详细信息。

### `loader`

用于解析图片 URL 的自定义函数。

`loader` 是一个返回图片 URL 字符串的函数，给定以下参数：

- [`src`](#src)
- [`width`](#width)
- [`quality`](#quality)

以下是使用自定义 loader 的示例：

<AppOnly>

```js
'use client'

import Image from 'next/image'

const imageLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

export default function Page() {
  return (
    <Image
      loader={imageLoader}
      src="me.png"
      alt="作者的照片"
      width={500}
      height={500}
    />
  )
}
```

> **须知**：使用像 `loader` 这样接受函数的属性，需要使用[客户端组件](/docs/app/building-your-application/rendering/client-components)来序列化提供的函数。

</AppOnly>

<PagesOnly>

```js
import Image from 'next/image'

const imageLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

export default function Page() {
  return (
    <Image
      loader={imageLoader}
      src="me.png"
      alt="作者的照片"
      width={500}
      height={500}
    />
  )
}
```

</PagesOnly>

或者，您可以使用 `next.config.js` 中的[loaderFile](#loaderfile)配置来配置应用程序中每个 `next/image` 的实例，而无需传递属性。
### `fill`

```js
fill={true} // {true} | {false}
```

一个布尔值，它使图像填满父元素，这在未知 [`width`](#width) 和 [`height`](#height) 时非常有用。

父元素 _必须_ 分配 `position: "relative"`、`position: "fixed"` 或 `position: "absolute"` 样式。

默认情况下，img 元素将自动被分配 `position: "absolute"` 样式。

如果图像上没有应用任何样式，图像将拉伸以适应容器。您可能希望为图像设置 `object-fit: "contain"`，以便图像以字幕框的方式适应容器并保持宽高比。

或者，`object-fit: "cover"` 将使图像填满整个容器并进行裁剪以保持宽高比。为了使其看起来正确，应该将 `overflow: "hidden"` 样式分配给父元素。

更多信息，请参阅：

- [`position`](https://developer.mozilla.org/docs/Web/CSS/position)
- [`object-fit`](https://developer.mozilla.org/docs/Web/CSS/object-fit)
- [`object-position`](https://developer.mozilla.org/docs/Web/CSS/object-position)

### `sizes`

一个字符串，类似于媒体查询，它提供了图像在不同断点处宽度的信息。`sizes` 的值将极大地影响使用 [`fill`](#fill) 的图像或 [具有响应式大小](#responsive-images) 的图像的性能。

`sizes` 属性与图像性能相关有两个重要用途：

- 首先，`sizes` 的值由浏览器用来确定要从 `next/image` 自动生成的 `srcset` 中下载哪个大小的图像。当浏览器选择时，它还不知道页面上图像的大小，因此它选择一个与视口大小相同或更大的图像。`sizes` 属性允许您告诉浏览器图像实际上会比全屏小。如果您在具有 `fill` 属性的图像中没有指定 `sizes` 值，将使用默认值 `100vw`（全屏宽度）。
- 其次，`sizes` 属性改变了自动生成的 `srcset` 值的行为。如果没有 `sizes` 值，会生成一个适合固定大小图像的小型 `srcset`（1x/2x/等）。如果定义了 `sizes`，则会生成一个适合响应式图像的大型 `srcset`（640w/750w/等）。如果 `sizes` 属性包括如 `50vw` 这样的大小，它代表视口宽度的百分比，那么 `srcset` 将被修剪，不包括任何过小而不必要的值。

例如，如果您知道您的样式会导致图像在移动设备上全宽显示，在平板设备上呈现 2 栏布局，在桌面显示器上呈现 3 栏布局，您应该包含如下所示的 sizes 属性：

```jsx
import Image from 'next/image'

export default function Page() {
  return (
    <div className="grid-element">
      <Image
        fill
        src="/example.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

这个例子中的 `sizes` 可能会对性能指标产生显著影响。如果没有 `33vw` 大小，从服务器选择的图像将比所需的宽度宽 3 倍。由于文件大小与宽度的平方成正比，没有 `sizes`，用户将下载一个比必要大 9 倍的图像。

了解更多关于 `srcset` 和 `sizes` 的信息：

- [web.dev](https://web.dev/learn/design/responsive-images/#sizes)
- [mdn](https://developer.mozilla.org/docs/Web/HTML/Element/img#sizes)

### `quality`

```js
quality={75} // {number 1-100}
```

优化后的图像质量，介于 `1` 和 `100` 之间的整数，其中 `100` 是最佳质量，因此文件大小也最大。默认值为 `75`。
## `priority`

```js
priority={false} // {false} | {true}
```

当设置为 true 时，该图片将被视为高优先级并进行[预加载](https://web.dev/preload-responsive-images/)。使用 `priority` 的图片会自动禁用延迟加载。

您应该在任何被检测为[最大内容绘制（LCP）](https://nextjs.org/learn/seo/web-performance/lcp)元素的图片上使用 `priority` 属性。可能需要有多个优先级图片，因为不同的图片可能是不同视口大小的 LCP 元素。

仅当图片在页面折叠上方可见时才应使用。默认值为 `false`。

## `placeholder`

```js
placeholder = 'empty' // "empty" | "blur" | "data:image/..."
```

图片加载时使用的占位符。可能的值有 `blur`、`empty` 或 `data:image/...`。默认值为 `empty`。

当设置为 `blur` 时，将使用 [`blurDataURL`](#blurdataurl) 属性作为占位符。如果 `src` 是从[静态导入](/docs/app/building-your-application/optimizing/images#local-images)的对象，并且导入的图片是 `.jpg`、`.png`、`.webp` 或 `.avif` 格式，那么 `blurDataURL` 将自动填充，除非检测到图片是动画的。

对于动态图片，您必须提供 [`blurDataURL`](#blurdataurl) 属性。可以使用 [Plaiceholder](https://github.com/joe-bell/plaiceholder) 等解决方案来生成 `base64`。

当设置为 `data:image/...` 时，将使用[数据 URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)作为图片加载时的占位符。

当设置为 `empty` 时，在图片加载期间将没有占位符，只会显示空白空间。

试试以下示例：

- [尝试 `blur` 占位符的演示](https://image-component.nextjs.gallery/placeholder)
- [尝试使用数据 URL `placeholder` 属性的闪烁效果演示](https://image-component.nextjs.gallery/shimmer)
- [尝试使用 `blurDataURL` 属性的颜色效果演示](https://image-component.nextjs.gallery/color)


# 高级属性

在某些情况下，您可能需要更高级的用法。`< Image />` 组件可选地接受以下高级属性。

## `style`

允许向底层图片元素传递 CSS 样式。

```jsx filename="components/ProfileImage.js"
const imageStyle = {
  borderRadius: '50%',
  border: '1px solid #fff',
}

export default function ProfileImage() {
  return <Image src="..." style={imageStyle} />
}
```

请记住，所需的宽度和高度属性可以与您的样式交互。如果您使用样式来修改图片的宽度，您也应该将图片的高度样式设置为 `auto` 以保持其固有的纵横比，否则图片将会失真。

## `onLoadingComplete`

<AppOnly>

```jsx
'use client'

<Image onLoadingComplete={(img) => console.log(img.naturalWidth)} />
```

</AppOnly>

<PagesOnly>

```jsx
<Image onLoadingComplete={(img) => console.log(img.naturalWidth)} />
```

</PagesOnly>

> **警告**：自 Next.js 14 起已弃用，转而使用 [`onLoad`](#onload)。

图片完全加载并且[占位符](#placeholder)已被移除后调用的回调函数。

回调函数将带有一个参数，即对底层 `<img>` 元素的引用。

<AppOnly>

> **须知**：使用像 `onLoadingComplete` 这样接受函数的属性，需要使用 [客户端组件](/docs/app/building-your-application/rendering/client-components) 来序列化提供的函数。

</AppOnly>
### `onLoad`

```jsx
<Image onLoad={(e) => console.log(e.target.naturalWidth)} />
```

一个回调函数，当图片完全加载并且[占位符](#placeholder)被移除后被调用。

回调函数将带有一个参数，即事件（Event），它有一个 `target` 属性，引用了底层的 `<img>` 元素。

<AppOnly>

> **须知**：使用像 `onLoad` 这样接受函数的属性，需要使用 [客户端组件](/docs/app/building-your-application/rendering/client-components) 来序列化提供的函数。

</AppOnly>

### `onError`

```jsx
<Image onError={(e) => console.error(e.target.id)} />
```

如果图片加载失败，则调用此回调函数。

<AppOnly>

> **须知**：使用像 `onError` 这样接受函数的属性，需要使用 [客户端组件](/docs/app/building-your-application/rendering/client-components) 来序列化提供的函数。

</AppOnly>


### `loading`

> **推荐**：这个属性仅适用于高级用例。将图片切换为使用 `eager` 加载通常会**降低性能**。我们建议使用 [`priority`](#priority) 属性，它将预先加载图片。

```js
loading = 'lazy' // {lazy} | {eager}
```

图片的加载行为。默认为 `lazy`。

当为 `lazy` 时，推迟加载图片，直到它到达视口的计算距离。

当为 `eager` 时，立即加载图片。

了解更多关于 [`loading` 属性](https://developer.mozilla.org/docs/Web/HTML/Element/img#loading)。

### `blurDataURL`

一个[数据 URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)，用作 `src` 图片成功加载之前的占位符图片。仅当与 [`placeholder="blur"`](#placeholder) 结合使用时生效。

必须是 base64 编码的图片。它将被放大并模糊，因此建议使用非常小的图片（10px 或更小）。将较大的图片作为占位符可能会损害应用程序性能。

试试：

- [演示默认的 `blurDataURL` 属性](https://image-component.nextjs.gallery/placeholder)
- [演示 `blurDataURL` 属性的颜色效果](https://image-component.nextjs.gallery/color)

您也可以[生成与图片匹配的纯色数据 URL](https://png-pixel.com)。

### `unoptimized`

```js
unoptimized = {false} // {false} | {true}
```

当为 true 时，源图片将按原样提供，而不是改变质量、大小或格式。默认为 `false`。

```js
import Image from 'next/image'

const UnoptimizedImage = (props) => {
  return <Image {...props} unoptimized />
}
```

自 Next.js 12.3.0 起，此属性可以通过更新 `next.config.js` 中的以下配置，为所有图片分配：

```js filename="next.config.js"
module.exports = {
  images: {
    unoptimized: true,
  },
}
```

### `overrideSrc`

当向 `<Image>` 组件提供 `src` 属性时，`srcset` 和 `src` 属性会自动为生成的 `<img>` 生成。

```jsx filename="input.js"
<Image src="/me.jpg" />
```

```html filename="output.html"
<img
  srcset="
    /_next/image?url=%2Fme.jpg&w=640&q=75 1x,
    /_next/image?url=%2Fme.jpg&w=828&q=75 2x
  "
  src="/_next/image?url=%2Fme.jpg&w=828&q=75"
/>
```

在某些情况下，可能不希望生成 `src` 属性，而希望使用 `overrideSrc` 属性进行覆盖。

例如，在将现有网站从 `<img>` 升级到 `<Image>` 时，您可能希望出于 SEO 目的（例如图片排名或避免重新爬取）保持相同的 `src` 属性。

```jsx filename="input.js"
<Image src="/me.jpg" overrideSrc="/override.jpg" />
```

```html filename="output.html"
<img
  srcset="
    /_next/image?url=%2Fme.jpg&w=640&q=75 1x,
    /_next/image?url=%2Fme.jpg&w=828&q=75 2x
  "
  src="/override.jpg"
/>
```
## 图像属性

`<Image />` 组件上的其他属性将传递给底层的 `img` 元素，除了以下属性：

- `srcSet`。请使用 [设备尺寸](#devicesizes) 替代。
- `decoding`。始终为 `"async"`。

## 配置选项

除了属性，您还可以在 `next.config.js` 中配置图像组件。以下是可用的选项：

### `remotePatterns`

为了防止应用程序受到恶意用户的攻击，需要进行配置才能使用外部图像。这确保只有来自您账户的外部图像才能通过 Next.js 图像优化 API 提供。这些外部图像可以通过 `next.config.js` 文件中的 `remotePatterns` 属性进行配置，如下所示：

```js filename="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/account123/**',
      },
    ],
  },
}
```

> **须知**：上述示例将确保 `next/image` 的 `src` 属性必须以 `https://example.com/account123/` 开头。任何其他协议、主机名、端口或不匹配的路径都将响应 400 错误请求。

以下是 `next.config.js` 文件中 `remotePatterns` 属性的另一个示例：

```js filename="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
        port: '',
      },
    ],
  },
}
```

> **须知**：上述示例将确保 `next/image` 的 `src` 属性必须以 `https://img1.example.com` 或 `https://me.avatar.example.com` 或任何数量的子域名开头。任何其他协议、端口或不匹配的主机名都将响应 400 错误请求。

通配符模式可用于 `pathname` 和 `hostname`，并具有以下语法：

- `*` 匹配单个路径段或子域名
- `**` 匹配结尾的任意数量的路径段或开头的任意数量的子域名

`**` 语法不能在模式中间使用。

> **须知**：当省略 `protocol`、`port` 或 `pathname` 时，将隐式使用通配符 `**`。这并不推荐，因为它可能允许恶意行为者优化您未打算优化的 URL。

### `domains`

> **警告**：自 Next.js 14 起已弃用，转而使用更严格的 [`remotePatterns`](#remotepatterns) 以保护您的应用程序免受恶意用户的攻击。如果您拥有从域提供的所有内容，则仅使用 `domains`。

类似于 [`remotePatterns`](#remotepatterns)，`domains` 配置可用于提供外部图像的允许主机名列表。

然而，`domains` 配置不支持通配符模式匹配，且无法限制协议、端口或路径名。

以下是 `next.config.js` 文件中 `domains` 属性的示例：

```js filename="next.config.js"
module.exports = {
  images: {
    domains: ['assets.acme.com'],
  },
}
```
### `loaderFile`

如果你想使用云服务商来优化图片而不是使用Next.js内置的图片优化API，你可以在你的`next.config.js`中配置`loaderFile`，如下所示：

```js filename="next.config.js"
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}
```

这必须指向相对于你的Next.js应用根目录的文件。该文件必须导出一个默认函数，该函数返回一个字符串，例如：

<AppOnly>

```js filename="my/image/loader.js"
'use client'

export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

</AppOnly>

<PagesOnly>

```js filename="my/image/loader.js"
export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

</PagesOnly>

或者，你可以使用[`loader` prop](#loader)来配置`next/image`的每个实例。

示例：

- [自定义图片加载器配置](/docs/app/api-reference/next-config-js/images#example-loader-configuration)

<AppOnly>

> **须知**：自定义图片加载器文件，它接受一个函数，需要使用[客户端组件](/docs/app/building-your-application/rendering/client-components)来序列化提供的函数。

</AppOnly>
## 高级

以下配置适用于高级用例，通常并非必要。如果您选择配置下面的属性，您将覆盖 Next.js 默认值在未来更新中的任何更改。

### `deviceSizes`

如果您知道用户的预期设备宽度，您可以在 `next.config.js` 中使用 `deviceSizes` 属性指定设备宽度断点的列表。当 `next/image` 组件使用 [`sizes`](#sizes) 属性以确保为用户的设备提供正确的图片时，会使用这些宽度。

如果没有提供配置，默认使用以下设置。

```js filename="next.config.js"
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

### `imageSizes`

您可以在 `next.config.js` 文件中使用 `images.imageSizes` 属性指定图片宽度的列表。这些宽度与 [设备大小](#devicesizes) 数组连接，形成用于生成图片 [srcset](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) 的完整大小数组。

有两个单独的列表的原因是 imageSizes 仅用于提供 [`sizes`](#sizes) 属性的图片，这表明图片小于屏幕的全宽。**因此，imageSizes 中的大小都应该小于 deviceSizes 中的最小大小。**

如果没有提供配置，默认使用以下设置。

```js filename="next.config.js"
module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### `formats`

默认的 [Image Optimization API](#loader) 将通过请求的 `Accept` 头部自动检测浏览器支持的图片格式。

如果 `Accept` 头部匹配了多个配置的格式，将使用数组中的第一个匹配项。因此，数组的顺序很重要。如果没有匹配（或源图片是 [动画](#animated-images)），Image Optimization API 将回退到原始图片的格式。

如果没有提供配置，默认使用以下设置。

```js filename="next.config.js"
module.exports = {
  images: {
    formats: ['image/webp'],
  },
}
```

您可以使用以下配置启用 AVIF 支持。

```js filename="next.config.js"
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

> **须知**：
>
> - AVIF 通常编码时间比 WebP 长 20%，但压缩比 WebP 小 20%。这意味着第一次请求图片时，通常会更慢，然后后续的缓存请求会更快。
> - 如果您在 Next.js 前面使用 Proxy/CDN 自行托管，您必须配置 Proxy 以转发 `Accept` 头部。
## 缓存行为

以下是默认[loader](#loader)的缓存算法描述。对于所有其他loader，请参考您的云服务提供商的文档。

图片在请求时动态优化，并存储在`<distDir>/cache/images`目录中。优化后的图片文件将在后续请求中提供服务，直到达到过期时间。当发出与已缓存但已过期文件匹配的请求时，过期的图片会立即提供陈旧的版本。然后，图片会在后台重新优化（也称为重新验证），并带有新的过期日期保存到缓存中。

可以通过读取响应头`x-nextjs-cache`的值来确定图片的缓存状态。可能的值如下：

- `MISS` - 路径不在缓存中（最多发生一次，在首次访问时）
- `STALE` - 路径在缓存中，但超过了重新验证时间，因此将在后台更新
- `HIT` - 路径在缓存中，且未超过重新验证时间

过期时间（或最大年龄）由[`minimumCacheTTL`](#minimumcachettl)配置或上游图片的`Cache-Control`头定义，以较大者为准。具体来说，使用`Cache-Control`头中的`max-age`值。如果同时找到`s-maxage`和`max-age`，则优先使用`s-maxage`。`max-age`也会传递给任何下游客户端，包括CDN和浏览器。

- 您可以配置[`minimumCacheTTL`](#minimumcachettl)以增加缓存持续时间，当上游图片不包含`Cache-Control`头或值非常低时。
- 您可以配置[`deviceSizes`](#devicesizes)和[`imageSizes`](#imagesizes)以减少可能生成的图片总数。
- 您可以配置[格式](#formats)以禁用多个格式，而只使用单一图片格式。

### `minimumCacheTTL`

您可以配置缓存优化图片的生存时间（TTL），以秒为单位。在许多情况下，最好使用[静态图片导入](/docs/app/building-your-application/optimizing/images#local-images)，它将自动对文件内容进行哈希处理，并使用`Cache-Control`头为`immutable`永远缓存图片。

```js filename="next.config.js"
module.exports = {
  images: {
    minimumCacheTTL: 60,
  },
}
```

优化后的图片的过期时间（或最大年龄）由`minimumCacheTTL`或上游图片的`Cache-Control`头定义，以较大者为准。

如果需要为每个图片更改缓存行为，您可以配置[`headers`](/docs/app/api-reference/next-config-js/headers)以在上游图片上设置`Cache-Control`头（例如`/some-asset.jpg`，而不是`/_next/image`本身）。

目前没有机制可以使缓存失效，因此最好保持`minimumCacheTTL`较低。否则，您可能需要手动更改[`src`](#src)属性或删除`<distDir>/cache/images`。

### `disableStaticImages`

默认行为允许您导入静态文件，例如`import icon from './icon.png'`，然后将该文件传递给`src`属性。

在某些情况下，如果此功能与其他期望导入行为不同的插件冲突，您可能希望禁用此功能。

您可以在`next.config.js`中禁用静态图片导入：

```js filename="next.config.js"
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```
### `dangerouslyAllowSVG`

默认的[loader](#loader)出于几个原因不优化SVG图片。首先，SVG是矢量格式，意味着它可以无损地调整大小。其次，SVG具有许多与HTML/CSS相同的特性，如果没有适当的[内容安全策略（CSP）头](/docs/app/api-reference/next-config-js/headers#content-security-policy)，可能会导致漏洞。

因此，当已知[`src`](#src)属性是SVG时，我们建议使用[`unoptimized`](#unoptimized)属性。当`src`以`".svg"`结尾时，这会自动发生。

然而，如果你需要使用默认的图像优化API来提供SVG图片，你可以在`next.config.js`中设置`dangerouslyAllowSVG`：

```js filename="next.config.js"
module.exports = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
```

此外，强烈建议同时设置`contentDispositionType`以强制浏览器下载图片，以及`contentSecurityPolicy`以防止图片中嵌入的脚本执行。

### `contentDispositionType`

默认的[loader](#loader)将[`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#as_a_response_header_for_the_main_body)头设置为`attachment`，以增加保护，因为API可以提供任意远程图片。

默认值是`attachment`，这会强制浏览器在直接访问时下载图片。当[`dangerouslyAllowSVG`](#dangerouslyallowsvg)为true时，这一点尤其重要。

你可以选择配置`inline`以允许浏览器在直接访问时渲染图片，而不需要下载它。

```js filename="next.config.js"
module.exports = {
  images: {
    contentDispositionType: 'inline',
  },
}
```

## 动画图片

默认的[loader](#loader)将自动绕过动画图片的图像优化，并原样提供图片。

动画文件的自动检测是尽力而为的，支持GIF、APNG和WebP。如果你想明确地绕过给定动画图片的图像优化，使用[unoptimized](#unoptimized)属性。
## 响应式图片

默认生成的 `srcset` 包含了 `1x` 和 `2x` 图片，以支持不同的设备像素比例。然而，您可能希望渲染一个随着视口变化而伸缩的响应式图片。在这种情况下，您需要设置 [`sizes`](#sizes) 以及 `style`（或 `className`）。

您可以使用以下任一方法来渲染响应式图片。

### 使用静态导入的响应式图片

如果源图片不是动态的，您可以静态导入以创建响应式图片：

```jsx filename="components/author.js"
import Image from 'next/image'
import me from '../photos/me.jpg'

export default function Author() {
  return (
    <Image
      src={me}
      alt="作者的照片"
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  )
}
```

试试看：

- [演示图片响应视口](https://image-component.nextjs.gallery/responsive)

### 带有宽高比的响应式图片

如果源图片是动态的或远程 URL，您还需要提供 `width` 和 `height` 以设置响应式图片的正确宽高比：

```jsx filename="components/page.js"
import Image from 'next/image'

export default function Page({ photoUrl }) {
  return (
    <Image
      src={photoUrl}
      alt="作者的照片"
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
      }}
      width={500}
      height={300}
    />
  )
}
```

试试看：

- [演示图片响应视口](https://image-component.nextjs.gallery/responsive)

### 使用 `fill` 的响应式图片

如果您不知道宽高比，您将需要设置 [`fill`](#fill) 属性，并在父元素上设置 `position: relative`。根据所需的伸缩与裁剪行为，您还可以选择设置 `object-fit` 样式：

```jsx filename="app/page.js"
import Image from 'next/image'

export default function Page({ photoUrl }) {
  return (
    <div style={{ position: 'relative', width: '300px', height: '500px' }}>
      <Image
        src={photoUrl}
        alt="作者的照片"
        sizes="300px"
        fill
        style={{
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
```

试试看：

- [演示 `fill` 属性](https://image-component.nextjs.gallery/fill)
## 主题检测 CSS

如果你想为浅色和深色模式显示不同的图片，你可以创建一个新的组件，该组件包装了两个 `<Image>` 组件，并根据 CSS 媒体查询显示正确的图片。

```css filename="components/theme-image.module.css"
.imgDark {
  display: none;
}

@media (prefers-color-scheme: dark) {
  .imgLight {
    display: none;
  }
  .imgDark {
    display: unset;
  }
}
```

```tsx filename="components/theme-image.tsx" switcher
import styles from './theme-image.module.css'
import Image, { ImageProps } from 'next/image'

type Props = Omit<ImageProps, 'src' | 'priority' | 'loading'> & {
  srcLight: string
  srcDark: string
}

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className={styles.imgLight} />
      <Image {...rest} src={srcDark} className={styles.imgDark} />
    </>
  )
}
```

```jsx filename="components/theme-image.js" switcher
import styles from './theme-image.module.css'
import Image from 'next/image'

const ThemeImage = (props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className={styles.imgLight} />
      <Image {...rest} src={srcDark} className={styles.imgDark} />
    </>
  )
}
```

> **须知**：`loading="lazy"` 的默认行为确保只加载正确的图片。你不能使用 `priority` 或 `loading="eager"`，因为那会导致两张图片都加载。相反，你可以使用 [`fetchPriority="high"`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/fetchPriority)。

试试看：

- [演示浅色/深色模式主题检测](https://image-component.nextjs.gallery/theme)
## getImageProps

对于更高级的用例，你可以调用 `getImageProps()` 来获取将传递给底层 `<img>` 元素的属性，并将它们传递给另一个组件、样式、画布等。

这也避免了调用 React `useState()`，因此可以带来更好的性能，但它不能与 [`placeholder`](#placeholder) 属性一起使用，因为占位符将不会被移除。

### 主题检测图片

如果你想要在浅色和深色模式下显示不同的图片，你可以使用 [`<picture>`](https://developer.mozilla.org/docs/Web/HTML/Element/picture) 元素来根据用户的 [首选颜色方案](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 显示不同的图片。

```jsx filename="app/page.js"
import { getImageProps } from 'next/image'

export default function Page() {
  const common = { alt: '主题示例', width: 800, height: 400 }
  const {
    props: { srcSet: dark },
  } = getImageProps({ ...common, src: '/dark.png' })
  const {
    props: { srcSet: light, ...rest },
  } = getImageProps({ ...common, src: '/light.png' })

  return (
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet={dark} />
      <source media="(prefers-color-scheme: light)" srcSet={light} />
      <img {...rest} />
    </picture>
  )
}
```

### 艺术指导

如果你想要在移动设备和桌面上显示不同的图片，有时被称为 [艺术指导](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#art_direction)，你可以为 `getImageProps()` 提供不同的 `src`、`width`、`height` 和 `quality` 属性。

```jsx filename="app/page.js"
import { getImageProps } from 'next/image'

export default function Home() {
  const common = { alt: '艺术指导示例', sizes: '100vw' }
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    width: 1440,
    height: 875,
    quality: 80,
    src: '/desktop.jpg',
  })
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    width: 750,
    height: 1334,
    quality: 70,
    src: '/mobile.jpg',
  })

  return (
    <picture>
      <source media="(min-width: 1000px)" srcSet={desktop} />
      <source media="(min-width: 500px)" srcSet={mobile} />
      <img {...rest} style={{ width: '100%', height: 'auto' }} />
    </picture>
  )
}
```

### 背景 CSS

你甚至可以将 `srcSet` 字符串转换为 [`image-set()`](https://developer.mozilla.org/en-US/docs/Web/CSS/image/image-set) CSS 函数，以优化背景图片。

```jsx filename="app/page.js"
import { getImageProps } from 'next/image'

function getBackgroundImage(srcSet = '') {
  const imageSet = srcSet
    .split(', ')
    .map((str) => {
      const [url, dpi] = str.split(' ')
      return `url("${url}") ${dpi}`
    })
    .join(', ')
  return `image-set(${imageSet})`
}

export default function Home() {
  const {
    props: { srcSet },
  } = getImageProps({ alt: '', width: 128, height: 128, src: '/img.png' })
  const backgroundImage = getBackgroundImage(srcSet)
  const style = { height: '100vh', width: '100vw', backgroundImage }

  return (
    <main style={style}>
      <h1>你好，世界</h1>
    </main>
  )
}
```
## 已知浏览器Bug

这个 `next/image` 组件使用了浏览器原生的[惰性加载](https://caniuse.com/loading-lazy-attr)，这可能会导致在Safari 15.4之前的旧版浏览器中回退到急切加载。当使用模糊预览占位符时，Safari 12之前的旧版浏览器会回退到空占位符。当使用 `width`/`height` 为 `auto` 的样式时，可能会导致在Safari 15之前不[保留宽高比](https://caniuse.com/mdn-html_elements_img_aspect_ratio_computed_from_attributes)的旧版浏览器中发生[布局偏移](https://web.dev/cls/)。更多细节，参见[这个MDN视频](https://www.youtube.com/watch?v=4-d_SoCHeWE)。

- [Safari 15 - 16.3](https://bugs.webkit.org/show_bug.cgi?id=243601) 在加载时显示灰色边框。Safari 16.4 [修复了这个问题](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/#:~:text=Now%20in%20Safari%2016.4%2C%20a%20gray%20line%20no%20longer%20appears%20to%20mark%20the%20space%20where%20a%20lazy%2Dloaded%20image%20will%20appear%20once%20it%E2%80%99s%20been%20loaded.)。可能的解决方案：
  - 使用 CSS `@supports (font: -apple-system-body) and (-webkit-appearance: none) { img[loading="lazy"] { clip-path: inset(0.6px) } }`
  - 如果图片在折叠上方，使用 [`priority`](#priority)
- [Firefox 67+](https://bugzilla.mozilla.org/show_bug.cgi?id=1556156) 在加载时显示白色背景。可能的解决方案：
  - 启用 [AVIF `formats`](#formats)
  - 使用 [`placeholder`](#placeholder)
## Version History

| Version    | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v15.0.0`  | `contentDispositionType` configuration default changed to `attachment`.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `v14.2.0`  | `overrideSrc` prop added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `v14.1.0`  | `getImageProps()` is stable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `v14.0.0`  | `onLoadingComplete` prop and `domains` config deprecated.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `v13.4.14` | `placeholder` prop support for `data:/image...`                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `v13.2.0`  | `contentDispositionType` configuration added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `v13.0.6`  | `ref` prop added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `v13.0.0`  | The `next/image` import was renamed to `next/legacy/image`. The `next/future/image` import was renamed to `next/image`. A [codemod is available](/docs/app/building-your-application/upgrading/codemods#next-image-to-legacy-image) to safely and automatically rename your imports. `<span>` wrapper removed. `layout`, `objectFit`, `objectPosition`, `lazyBoundary`, `lazyRoot` props removed. `alt` is required. `onLoadingComplete` receives reference to `img` element. Built-in loader config removed. |
| `v12.3.0`  | `remotePatterns` and `unoptimized` configuration is stable.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `v12.2.0`  | Experimental `remotePatterns` and experimental `unoptimized` configuration added. `layout="raw"` removed.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `v12.1.1`  | `style` prop added. Experimental support for `layout="raw"` added.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `v12.1.0`  | `dangerouslyAllowSVG` and `contentSecurityPolicy` configuration added.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `v12.0.9`  | `lazyRoot` prop added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `v12.0.0`  | `formats` configuration added.<br/>AVIF support added.<br/>Wrapper `<div>` changed to `<span>`.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `v11.1.0`  | `onLoadingComplete` and `lazyBoundary` props added.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `v11.0.0`  | `src` prop support for static import.<br/>`placeholder` prop added.<br/>`blurDataURL` prop added.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `v10.0.5`  | `loader` prop added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `v10.0.1`  | `layout` prop added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `v10.0.0`  | `next/image` introduced.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
