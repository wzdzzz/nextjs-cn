---
title: <Image> (Legacy)
description: 向后兼容的图片优化，使用旧版 Image 组件。
---

<details>
  <summary>示例</summary>

- [旧版 Image 组件](https://github.com/vercel/next.js/tree/canary/examples/image-legacy-component)

</details>

从 Next.js 13 开始，`next/image` 组件被重写以提高性能和开发者体验。为了提供一个向后兼容的升级解决方案，旧的 `next/image` 被重命名为 `next/legacy/image`。

查看 **新** [`next/image` API 参考](/docs/pages/api-reference/components/image)

## 比较

与 `next/legacy/image` 相比，新的 `next/image` 组件有以下变化：

- 移除了 `<img>` 外的 `<span>` 包装，改为使用 [原生计算宽高比](https://caniuse.com/mdn-html_elements_img_aspect_ratio_computed_from_attributes)
- 添加了对规范 `style` 属性的支持
  - 移除了 `layout` 属性，转而使用 `style` 或 `className`
  - 移除了 `objectFit` 属性，转而使用 `style` 或 `className`
  - 移除了 `objectPosition` 属性，转而使用 `style` 或 `className`
- 移除了 `IntersectionObserver` 实现，改为使用 [原生懒加载](https://caniuse.com/loading-lazy-attr)
  - 移除了 `lazyBoundary` 属性，因为没有原生等效项
  - 移除了 `lazyRoot` 属性，因为没有原生等效项
- 移除了 `loader` 配置，转而使用 [`loader`](#loader) 属性
- 将 `alt` 属性从可选改为必需
- 将 `onLoadingComplete` 回调更改为接收 `<img>` 元素的引用

## 必需属性

`<Image />` 组件需要以下属性。

### src

必须是以下之一：

- 一个 [静态导入的](/docs/pages/building-your-application/optimizing/images#local-images) 图片文件
- 路径字符串。这可以是绝对的外部 URL，或者是内部路径，取决于 [loader](#loader) 属性或 [loader 配置](#loader-configuration)。

使用外部 URL 时，您必须将其添加到 `next.config.js` 中的 [remotePatterns](#remote-patterns)。

### width

`width` 属性可以表示 _渲染_ 宽度或 _原始_ 宽度（以像素为单位），这取决于 [`layout`](#layout) 和 [`sizes`](#sizes) 属性。

使用 `layout="intrinsic"` 或 `layout="fixed"` 时，`width` 属性表示 _渲染_ 宽度（以像素为单位），因此它将影响图片的显示大小。

使用 `layout="responsive"`，`layout="fill"` 时，`width` 属性表示 _原始_ 宽度（以像素为单位），因此它只会影响宽高比。

`width` 属性是必需的，除非是 [静态导入的图片](/docs/pages/building-your-application/optimizing/images#local-images)，或者是那些有 `layout="fill"` 的图片。

### height

`height` 属性可以表示 _渲染_ 高度或 _原始_ 高度（以像素为单位），这取决于 [`layout`](#layout) 和 [`sizes`](#sizes) 属性。

使用 `layout="intrinsic"` 或 `layout="fixed"` 时，`height` 属性表示 _渲染_ 高度（以像素为单位），因此它将影响图片的显示大小。

使用 `layout="responsive"`，`layout="fill"` 时，`height` 属性表示 _原始_ 高度（以像素为单位），因此它只会影响宽高比。

`height` 属性是必需的，除非是 [静态导入的图片](/docs/pages/building-your-application/optimizing/images#local-images)，或者是那些有 `layout="fill"` 的图片。

## 可选属性

`<Image />` 组件接受许多额外的属性，除了必需的属性之外。本节描述了 Image 组件最常用的属性。在 [高级属性](#advanced-props) 部分找到更多不常用属性的详细信息。
### 布局

当视口大小改变时，图片的布局行为。

| `布局`              | 行为                                                     | `srcSet`                                                                                                    | `sizes` | 有包装器和大小器 |
| --------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------- | --------------------- |
| `intrinsic` (默认)   | 缩小以适应容器宽度，最多到图片大小                     | `1x`, `2x` (基于 [imageSizes](#image-sizes))                                                            | N/A     | 是                   |
| `fixed`               | 精确设置为 `width` 和 `height`                         | `1x`, `2x` (基于 [imageSizes](#image-sizes))                                                            | N/A     | 是                   |
| `responsive`          | 缩放到适应容器宽度                                    | `640w`, `750w`, ... `2048w`, `3840w` (基于 [imageSizes](#image-sizes) 和 [deviceSizes](#device-sizes)) | `100vw` | 是                   |
| `fill`                | 在 X 和 Y 轴上增长以填满容器                           | `640w`, `750w`, ... `2048w`, `3840w` (基于 [imageSizes](#image-sizes) 和 [deviceSizes](#device-sizes)) | `100vw` | 是                   |

- [演示 `intrinsic` 布局（默认）](https://image-legacy-component.nextjs.gallery/layout-intrinsic)
  - 当设置为 `intrinsic` 时，图片会根据较小的视口缩小尺寸，但保持原始尺寸以适应较大的视口。
- [演示 `fixed` 布局](https://image-legacy-component.nextjs.gallery/layout-fixed)
  - 当设置为 `fixed` 时，图片尺寸不会随着视口的变化而改变（无响应性），类似于原生的 `img` 元素。
- [演示 `responsive` 布局](https://image-legacy-component.nextjs.gallery/layout-responsive)
  - 当设置为 `responsive` 时，图片会根据较小的视口缩小尺寸，并根据较大的视口放大尺寸。
  - 确保父元素在其样式表中使用 `display: block`。
- [演示 `fill` 布局](https://image-legacy-component.nextjs.gallery/layout-fill)
  - 当设置为 `fill` 时，图片会拉伸宽度和高度以适应父元素的尺寸，前提是父元素是相对定位的。
  - 这通常与 [`objectFit`](#objectfit) 属性配对使用。
  - 确保父元素在其样式表中具有 `position: relative`。
- [演示背景图片](https://image-legacy-component.nextjs.gallery/background)

### 加载器

用于解析 URL 的自定义函数。将加载器设置为 Image 组件上的属性会覆盖在 [`next.config.js`](#loader-configuration) 的 [`images` 部分](#loader-configuration) 中定义的默认加载器。

`加载器` 是一个返回给定参数的图片 URL 字符串的函数：

- [`src`](#src)
- [`width`](#width)
- [`quality`](#quality)

以下是使用自定义加载器的示例：

```js
import Image from 'next/legacy/image'

const myLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

const MyImage = (props) => {
  return (
    <Image
      loader={myLoader}
      src="me.png"
      alt="作者的照片"
      width={500}
      height={500}
    />
  )
}
```
### sizes

`sizes` 是一个字符串，提供有关图像在不同断点处宽度的信息。`sizes` 的值将极大地影响使用 `layout="responsive"` 或 `layout="fill"` 的图像的性能。对于使用 `layout="intrinsic"` 或 `layout="fixed"` 的图像，它将被忽略。

`sizes` 属性与图像性能相关，有两个重要用途：

首先，`sizes` 的值由浏览器用来确定从 `next/legacy/image` 自动生成的源集（source set）中下载哪个大小的图像。当浏览器选择时，它还不知道页面上图像的大小，因此它选择一个与视口大小相同或更大的图像。`sizes` 属性允许您告诉浏览器，图像实际上会比全屏小。如果您不指定 `sizes` 值，将使用默认值 `100vw`（全屏宽度）。

其次，`sizes` 值被解析并用于修剪自动创建的源集中的值。如果 `sizes` 属性包括 `50vw` 等尺寸，这些尺寸代表视口宽度的百分比，那么源集将被修剪，不包括任何太小而永远不必要的值。

例如，如果您知道您的样式会导致图像在移动设备上全宽，在平板上的 2 栏布局，在桌面显示器上的 3 栏布局，您应该包含如下所示的 `sizes` 属性：

```js
import Image from 'next/legacy/image'
const Example = () => (
  <div className="grid-element">
    <Image
      src="/example.png"
      layout="fill"
      sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
    />
  </div>
)
```

这个示例 `sizes` 可能对性能指标产生显著影响。如果没有 `33vw` 大小，从服务器选择的图像将比所需的宽度宽 3 倍。因为文件大小与宽度的平方成正比，没有 `sizes`，用户将下载一个比必要大 9 倍的图像。

了解更多关于 `srcset` 和 `sizes` 的信息：

- [web.dev](https://web.dev/learn/design/responsive-images/#sizes)
- [mdn](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-sizes)

### quality

优化图像的质量，介于 `1` 和 `100` 之间的整数，其中 `100` 是最佳质量。默认值为 `75`。

### priority

当设置为 true 时，图像将被视为高优先级并进行 [预加载](https://web.dev/preload-responsive-images/)。对于使用 `priority` 的图像，懒加载将自动禁用。

您应该在检测到作为 [最大内容绘制（LCP）](https://nextjs.org/learn/seo/web-performance/lcp) 元素的任何图像上使用 `priority` 属性。可能有多个优先级图像是合适的，因为不同的图像可能是不同视口大小的 LCP 元素。

`priority` 仅应在图像在折叠上方可见时使用。默认值为 `false`。

### placeholder

在图像加载时使用的占位符。可能的值是 `blur` 或 `empty`。默认为 `empty`。

当设置为 `blur` 时，将使用 [`blurDataURL`](#blurdataurl) 属性作为占位符。如果 `src` 是从 [静态导入](/docs/pages/building-your-application/optimizing/images#local-images) 的对象，并且导入的图像是 `.jpg`、`.png`、`.webp` 或 `.avif`，那么 `blurDataURL` 将自动填充。

对于动态图像，您必须提供 [`blurDataURL`](#blurdataurl) 属性。像 [Plaiceholder](https://github.com/joe-bell/plaiceholder) 这样的解决方案可以帮助生成 `base64`。

当设置为 `empty` 时，在图像加载时将没有占位符，只有空白空间。

尝试一下：

- [尝试 `blur` 占位符的演示](https://image-legacy-component.nextjs.gallery/placeholder)
- [尝试使用 `blurDataURL` 属性的闪烁效果演示](https://image-legacy-component.nextjs.gallery/shimmer)
- [尝试使用 `blurDataURL` 属性的颜色效果演示](https://image-legacy-component.nextjs.gallery/color)
## 高级属性

在某些情况下，您可能需要更高级的用法。`<Image />`组件可选地接受以下高级属性。

### style

允许向底层图像元素传递[CSS样式](https://developer.mozilla.org/docs/Web/HTML/Element/style)。

请注意，所有`layout`模式都会向图像元素应用自己的样式，这些自动样式会优先于`style`属性。

还要记住，必需的`width`和`height`属性可以与您的样式交互。如果您使用样式修改图像的`width`，则还必须设置`height="auto"`样式，否则您的图像将变形。

### objectFit

在使用`layout="fill"`时，定义图像将如何适应其父容器。

该值传递给`src`图像的[object-fit CSS属性](https://developer.mozilla.org/docs/Web/CSS/object-fit)。

### objectPosition

在使用`layout="fill"`时，定义图像在其父元素内的定位方式。

该值传递给应用于图像的[object-position CSS属性](https://developer.mozilla.org/docs/Web/CSS/object-position)。

### onLoadingComplete

一旦图像完全加载并且已移除[占位符](#placeholder)，就会调用此回调函数。

`onLoadingComplete`函数接受一个参数，一个包含以下属性的对象：

- [`naturalWidth`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/naturalWidth)
- [`naturalHeight`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/naturalHeight)

### loading

> **注意**：此属性仅适用于高级用途。将图像切换为使用`eager`加载通常会**损害性能**。
>
> 我们建议使用[`priority`](#priority)属性，它几乎适用于所有用例，可以正确地优先加载图像。

图像的加载行为。默认为`lazy`。

当设置为`lazy`时，推迟加载图像，直到它到达距离视口的计算距离。

当设置为`eager`时，立即加载图像。

[了解更多](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-loading)

### blurDataURL

用作`src`图像成功加载前的占位符图像的[Data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)。仅在使用[`placeholder="blur"`](#placeholder)时生效。

必须是base64编码的图像。它将被放大和模糊，因此建议使用非常小的图像（10px或更小）。包括更大的图像作为占位符可能会损害您的应用程序性能。

试试：

- [演示默认的`blurDataURL`属性](https://image-legacy-component.nextjs.gallery/placeholder)
- [演示带有`blurDataURL`属性的闪烁效果](https://image-legacy-component.nextjs.gallery/shimmer)
- [演示带有`blurDataURL`属性的颜色效果](https://image-legacy-component.nextjs.gallery/color)

您还可以[生成与图像匹配的纯色Data URL](https://png-pixel.com)。

### lazyBoundary

一个字符串（与边距属性的语法类似），用作检测视口与图像交点并触发延迟[加载](#loading)的边界框。默认为`"200px"`。

如果图像嵌套在滚动父元素中，而不是根文档，则还需要分配[lazyRoot](#lazyroot)属性。

[了解更多](https://developer.mozilla.org/docs/Web/API/IntersectionObserver/rootMargin)
### lazyRoot

`lazyRoot` 是一个指向可滚动父元素的 React [Ref](https://react.dev/learn/referencing-values-with-refs)。默认值为 `null`（文档视口）。

Ref 必须指向一个 DOM 元素或者一个 React 组件，该组件[转发 Ref](https://react.dev/reference/react/forwardRef)到底层的 DOM 元素。

**指向 DOM 元素的示例**

```jsx
import Image from 'next/legacy/image'
import React from 'react'

const Example = () => {
  const lazyRoot = React.useRef(null)

  return (
    <div ref={lazyRoot} style={{ overflowX: 'scroll', width: '500px' }}>
      <Image lazyRoot={lazyRoot} src="/one.jpg" width="500" height="500" />
      <Image lazyRoot={lazyRoot} src="/two.jpg" width="500" height="500" />
    </div>
  )
}
```

**指向 React 组件的示例**

```jsx
import Image from 'next/legacy/image'
import React from 'react'

const Container = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} style={{ overflowX: 'scroll', width: '500px' }}>
      {props.children}
    </div>
  )
})

const Example = () => {
  const lazyRoot = React.useRef(null)

  return (
    <Container ref={lazyRoot}>
      <Image lazyRoot={lazyRoot} src="/one.jpg" width="500" height="500" />
      <Image lazyRoot={lazyRoot} src="/two.jpg" width="500" height="500" />
    </Container>
  )
}
```

[了解更多](https://developer.mozilla.org/docs/Web/API/IntersectionObserver/root)

### unoptimized

当设置为 true 时，源图像将以原始状态提供，而不是更改质量、大小或格式。默认值为 `false`。

```js
import Image from 'next/image'

const UnoptimizedImage = (props) => {
  return <Image {...props} unoptimized />
}
```

自 Next.js 12.3.0 起，可以通过更新 `next.config.js` 中的以下配置，为所有图像分配此属性：

```js filename="next.config.js"
module.exports = {
  images: {
    unoptimized: true,
  },
}
```

## 其他属性

`<Image />` 组件上的其他属性将传递给底层的 `img` 元素，但以下属性除外：

- `srcSet`。请使用[设备尺寸](#device-sizes)。
- `ref`。请使用 [`onLoadingComplete`](#onloadingcomplete) 替代。
- `decoding`。它始终是 `"async"`。

## 配置选项
### 远程模式

为了保护您的应用程序免受恶意用户的攻击，需要进行配置才能使用外部图片。这确保只有来自您账户的外部图片才能通过 Next.js 图像优化 API 提供。这些外部图片可以通过 `next.config.js` 文件中的 `remotePatterns` 属性进行配置，如下所示：

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

> **须知**：上述示例将确保 `next/legacy/image` 的 `src` 属性必须以 `https://example.com/account123/` 开头。任何其他协议、主机名、端口或不匹配的路径都将响应 400 错误请求。

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

> **须知**：上述示例将确保 `next/legacy/image` 的 `src` 属性必须以 `https://img1.example.com` 或 `https://me.avatar.example.com` 或任何数量的子域名开头。任何其他协议、端口或不匹配的主机名都将响应 400 错误请求。

通配符模式可以用于 `pathname` 和 `hostname`，并具有以下语法：

- `*` 匹配单个路径段或子域名
- `**` 匹配末尾的任意数量的路径段或开头的任意数量的子域名

`**` 语法不能在模式中间使用。

> **须知**：当省略 `protocol`、`port` 或 `pathname` 时，将隐含通配符 `**`。这并不推荐，因为它可能允许恶意行为者优化您未打算的 URL。

### 域

> **警告**：自 Next.js 14 起已弃用，转而使用更严格的 [`remotePatterns`](#remote-patterns) 以保护您的应用程序免受恶意用户的攻击。只有当您拥有从域提供的所有必要内容时，才使用 `domains`。

类似于 [`remotePatterns`](#remote-patterns)，`domains` 配置可用于提供外部图片的允许主机名列表。

然而，`domains` 配置不支持通配符模式匹配，且不能限制协议、端口或路径。

以下是 `next.config.js` 文件中 `domains` 属性的示例：

```js filename="next.config.js"
module.exports = {
  images: {
    domains: ['assets.acme.com'],
  },
}
```

### 加载器配置

如果您想使用云服务提供商来优化图片而不是使用 Next.js 内置的图像优化 API，您可以在 `next.config.js` 文件中配置 `loader` 和 `path` 前缀。这允许您为图像 [`src`](#src) 使用相对 URL，并自动生成您的提供商的正确绝对 URL。

```js filename="next.config.js"
module.exports = {
  images: {
    loader: 'imgix',
    path: 'https://example.com/myaccount/',
  },
}
```
### 内置加载器

以下是包含的图片优化云服务提供商：

- 默认：与 `next dev`、`next start` 或自定义服务器自动工作
- [Vercel](https://vercel.com)：在 Vercel 上部署时自动工作，无需配置。[了解更多](https://vercel.com/docs/concepts/image-optimization?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)
- [Imgix](https://www.imgix.com)：`loader: 'imgix'`
- [Cloudinary](https://cloudinary.com)：`loader: 'cloudinary'`
- [Akamai](https://www.akamai.com)：`loader: 'akamai'`
- 自定义：`loader: 'custom'` 通过在 `next/legacy/image` 组件上实现 [`loader`](#loader) 属性来使用自定义云服务提供商

如果您需要不同的提供商，可以使用 `next/legacy/image` 组件上的 [`loader`](#loader) 属性。

> 图片不能使用 [`output: 'export'`](/docs/pages/building-your-application/deploying/static-exports) 在构建时进行优化，只能按需优化。要使用 `output: 'export'` 与 `next/legacy/image`，您需要使用与默认不同的加载器。[在讨论中了解更多](https://github.com/vercel/next.js/discussions/19065)

## 高级

以下配置适用于高级用例，通常不是必需的。如果您选择配置下面的属性，您将覆盖未来更新中 Next.js 默认值的任何更改。

### 设备尺寸

如果您知道用户的预期设备宽度，您可以在 `next.config.js` 中使用 `deviceSizes` 属性指定设备宽度断点的列表。当 `next/legacy/image` 组件使用 `layout="responsive"` 或 `layout="fill"` 时，这些宽度用于确保为用户的设备提供正确的图片。

如果没有提供配置，默认使用以下设置。

```js filename="next.config.js"
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

### 图片尺寸

您可以在 `next.config.js` 文件中使用 `images.imageSizes` 属性指定图片宽度的列表。这些宽度与 [设备尺寸](#设备尺寸) 数组连接，形成用于生成图片 [srcset](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) 的完整大小数组。

有两个单独的列表的原因是 imageSizes 仅用于提供 [`sizes`](#sizes) 属性的图片，这表明图片小于屏幕的全宽。**因此，imageSizes 中的尺寸应都小于 deviceSizes 中的最小尺寸。**

如果没有提供配置，默认使用以下设置。

```js filename="next.config.js"
module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### 可接受的格式

默认的 [图片优化 API](#loader-配置) 将通过请求的 `Accept` 头部自动检测浏览器支持的图片格式。

如果 `Accept` 头部匹配配置的多个格式，则使用数组中的第一个匹配项。因此，数组的顺序很重要。如果没有匹配项（或源图片是 [动画](#动画图片)），图片优化 API 将回退到原始图片的格式。

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

> **须知**：AVIF 通常需要编码时间比 WebP 长 20%，但它压缩的体积比 WebP 小 20%。这意味着当第一次请求图片时，它通常会更慢，然后随后的请求由于缓存会更快。
## 缓存行为

以下描述了默认 [loader](#loader) 的缓存算法。对于所有其他加载器，请参考您的云服务提供商的文档。

图片在请求时动态优化，并存储在 `<distDir>/cache/images` 目录中。优化后的图片文件将在后续请求中提供服务，直到到达过期时间。当发出的请求匹配到已缓存但已过期的文件时，过期的图片会立即提供陈旧的版本。然后，图片会在后台重新优化（也称为重新验证），并带有新的过期日期保存到缓存中。

可以通过读取响应头 `x-nextjs-cache`（在 Vercel 上部署时为 `x-vercel-cache`）的值来确定图片的缓存状态。可能的值如下：

- `MISS` - 路径不在缓存中（最多发生一次，在首次访问时）
- `STALE` - 路径在缓存中，但已超过重新验证时间，因此将在后台更新
- `HIT` - 路径在缓存中，且未超过重新验证时间

过期时间（或最大年龄）由 [`minimumCacheTTL`](#minimum-cache-ttl) 配置或上游图片的 `Cache-Control` 响应头定义，以较大者为准。具体来说，使用的是 `Cache-Control` 响应头中的 `max-age` 值。如果同时找到 `s-maxage` 和 `max-age`，则优先使用 `s-maxage`。`max-age` 也会传递给任何下游客户端，包括 CDN 和浏览器。

- 您可以配置 [`minimumCacheTTL`](#minimum-cache-ttl) 以增加缓存持续时间，当上游图片不包含 `Cache-Control` 响应头或值非常低时。
- 您可以配置 [`deviceSizes`](#device-sizes) 和 [`imageSizes`](#image-sizes) 以减少可能生成的图片总数。
- 您可以配置 [格式](#acceptable-formats) 以禁用多个格式，而只使用单一图片格式。

### 最小缓存TTL

您可以为缓存优化后的图片配置存活时间（TTL），单位为秒。在许多情况下，最好使用 [静态图片导入](/docs/pages/building-your-application/optimizing/images#local-images)，它将自动对文件内容进行哈希处理，并使用 `Cache-Control` 响应头的 `immutable` 永远缓存图片。

```js filename="next.config.js"
module.exports = {
  images: {
    minimumCacheTTL: 60,
  },
}
```

优化后的图片的过期时间（或最大年龄）由 `minimumCacheTTL` 或上游图片的 `Cache-Control` 响应头定义，以较大者为准。

如果需要为每个图片更改缓存行为，您可以配置 [`headers`](/docs/pages/api-reference/next-config-js/headers) 来设置上游图片（例如 `/some-asset.jpg`，不是 `/_next/image` 本身）的 `Cache-Control` 响应头。

目前没有机制可以使缓存失效，因此最好保持 `minimumCacheTTL` 较低。否则，您可能需要手动更改 [`src`](#src) 属性或删除 `<distDir>/cache/images`。

### 禁用静态导入

默认行为允许您导入静态文件，例如 `import icon from './icon.png'`，然后将该文件传递给 `src` 属性。

在某些情况下，如果该功能与其他期望导入行为不同的插件冲突，您可能希望禁用此功能。

您可以在 `next.config.js` 中禁用静态图片导入：

```js filename="next.config.js"
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```
### 危险地允许SVG

默认的[loader](#loader)出于几个原因不优化SVG图像。首先，SVG是矢量格式，这意味着它可以无损地调整大小。其次，SVG具有许多与HTML/CSS相同的特性，如果没有适当的[内容安全策略（CSP）头](/docs/app/api-reference/next-config-js/headers#content-security-policy)，可能会导致漏洞。

因此，我们建议在已知[`src`](#src)属性为SVG时使用[`unoptimized`](#unoptimized)属性。当`src`以`".svg"`结尾时，这会自动发生。

然而，如果你需要使用默认的图像优化API来提供SVG图像，你可以在`next.config.js`中设置`dangerouslyAllowSVG`：

```js filename="next.config.js"
module.exports = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
```

此外，强烈建议同时设置`contentDispositionType`以强制浏览器下载图像，以及`contentSecurityPolicy`以防止图像中嵌入的脚本执行。

### `contentDispositionType`

默认的[loader](#loader)将[`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#as_a_response_header_for_the_main_body)头设置为`attachment`，以增加保护，因为API可以提供任意的远程图像。

默认值是`attachment`，这会强制浏览器在直接访问时下载图像。当[`dangerouslyAllowSVG`](#dangerously-allow-svg)为true时，这一点尤为重要。

你可以选择配置`inline`，允许浏览器在直接访问时渲染图像，而不需要下载。

```js filename="next.config.js"
module.exports = {
  images: {
    contentDispositionType: 'inline',
  },
}
```

### 动画图像

默认的[loader](#loader)将自动绕过动画图像的图像优化，并原样提供图像。

对于动画文件的自动检测是尽力而为的，支持GIF、APNG和WebP。如果你想明确地绕过给定动画图像的图像优化，请使用[unoptimized](#unoptimized)属性。

### 版本历史

| 版本   | 变更                                     |
| --------- | ------------------------------------------- |
| `v13.0.0` | `next/image` 重命名为 `next/legacy/image` |