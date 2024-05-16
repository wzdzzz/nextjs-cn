---
title: 图像优化
nav_title: 图片
description: 使用内置的 `next/image` 组件优化您的图片。
related:
  title: API 参考
  description: 了解更多关于 next/image API 的信息。
  links:
    - app/api-reference/components/image
---

# 图像优化

<details>
  <summary>示例</summary>

- [图片组件](https://github.com/vercel/next.js/tree/canary/examples/image-component)

</details>

根据 [Web Almanac](https://almanac.httparchive.org)，图片占据了典型网站 [页面重量](https://almanac.httparchive.org/en/2022/page-weight#content-type-and-file-formats) 的很大一部分，并且对您网站的 [LCP性能](https://almanac.httparchive.org/en/2022/performance#lcp-image-optimization) 有相当大的影响。

Next.js 图片组件扩展了 HTML `<img>` 元素，增加了自动图片优化的功能：

- **大小优化：** 自动为每个设备提供正确大小的图片，使用像 WebP 和 AVIF 这样的现代图片格式。
- **视觉稳定性：** 当图片加载时，自动防止 [布局偏移](/learn/seo/web-performance/cls)。
- **更快的页面加载：** 图片仅在它们进入视口时使用原生浏览器懒加载加载，可选的模糊占位符。
- **资产灵活性：** 按需图片调整大小，即使是存储在远程服务器上的图片

> **🎥 观看：** 了解更多关于如何使用 `next/image` → [YouTube (9 分钟)](https://youtu.be/IU_qq_c_lKA)。

## 使用方法

```js
import Image from 'next/image'
```

然后，您可以为图片定义 `src`（本地或远程）。

### 本地图片

要使用本地图片，`import` 您的 `.jpg`、`.png` 或 `.webp` 图片文件。

Next.js 将 [自动确定](#image-sizing) 您图片的 `width` 和 `height`，基于导入的文件。这些值用于在图片加载时防止 [累积布局偏移](https://nextjs.org/learn/seo/web-performance/cls)。

<App>

```jsx filename="app/page.js"
import Image from 'next/image'
import profilePic from './me.png'

export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="作者的照片"
      // width={500} 自动提供
      // height={500} 自动提供
      // blurDataURL="data:..." 自动提供
      // placeholder="blur" // 加载时可选的模糊效果
    />
  )
}
```

</App>

<Pages>

```jsx filename="pages/index.js"
import Image from 'next/image'
import profilePic from '../public/me.png'

export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="作者的照片"
      // width={500} 自动提供
      // height={500} 自动提供
      // blurDataURL="data:..." 自动提供
      // placeholder="blur" // 加载时可选的模糊效果
    />
  )
}
```

</Pages>

> **警告：** 动态 `await import()` 或 `require()` 是 _不支持的_。`import` 必须是静态的，以便在构建时进行分析。

须知：动态 `await import()` 或 `require()` 是 _不支持的_。`import` 必须是静态的，以便在构建时进行分析。

### 远程图片

要使用远程图片，`src` 属性应该是一个 URL 字符串。

由于 Next.js 在构建过程中无法访问远程文件，您需要手动提供 [`width`](/docs/app/api-reference/components/image#width)、[`height`](/docs/app/api-reference/components/image#height) 和可选的 [`blurDataURL`](/docs/app/api-reference/components/image#blurdataurl) 属性。

`width` 和 `height` 属性用于推断图片的正确纵横比，并避免图片加载时的布局偏移。`width` 和 `height` 并不决定图片文件的渲染大小。了解更多关于 [图片尺寸](#image-sizing) 的信息。

```jsx filename="app/page.js"
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="作者的照片"
      width={500}
      height={500}
    />
  )
}
```

为了安全地允许优化图片，您可以在 `next.config.js` 中定义一个支持的 URL 模式列表。尽可能具体以防止恶意使用。例如，以下配置将只允许来自特定 AWS S3 存储桶的图片：

```js filename="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
}
```

了解更多关于 [`remotePatterns`](/docs/app/api-reference/components/image#remotepatterns) 配置。如果您想为图片的 `src` 使用相对 URL，请使用 [`loader`](/docs/app/api-reference/components/image#loader)。

### 域名

有时您可能想要优化一个远程图片，但仍然使用内置的 Next.js 图片优化 API。为此，请将 `loader` 保留为其默认设置，并为图片的 `src` 属性输入一个绝对 URL。

为了保护您的应用程序免受恶意用户的侵害，您必须定义一个您打算与 `next/image` 组件一起使用的远程主机名列表。

> 了解更多关于 [`remotePatterns`](/docs/app/api-reference/components/image#remotepatterns) 配置。

### 加载器

请注意，在 [前面的示例](#local-images) 中，为本地图片提供了一个部分 URL (`"/me.png"`)。这之所以可能，是因为加载器架构。

加载器是一个生成图片 URL 的函数。它修改提供的 `src`，并生成多个 URL 以请求不同大小的图片。这些多个 URL 用于自动 [srcset](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) 生成，以便访问您网站的访客将获得适合其视口大小的图片。

Next.js 应用程序的默认加载器使用内置的图片优化 API，该 API 优化来自网络上任何地方的图片，然后直接从 Next.js 网络服务器提供它们。如果您想直接从 CDN 或图片服务器提供您的图片，您可以用几行 JavaScript 编写自己的加载器函数。

您可以使用 [`loader` 属性](/docs/app/api-reference/components/image#loader) 为每个图片定义一个加载器，或使用 [`loaderFile` 配置](/docs/app/api-reference/components/image#loaderfile) 在应用程序级别定义。

## 优先级

您应该为每个页面的[最大内容绘制（LCP）元素](https://web.dev/lcp/#what-elements-are-considered)添加`priority`属性。这样做允许Next.js特别优先加载图片（例如通过预加载标签或优先级提示），从而显著提升LCP。

LCP元素通常是页面视口中可见的最大的图片或文本块。当您运行`next dev`时，如果LCP元素是不带`priority`属性的`<Image>`，则会在控制台中看到警告。

一旦确定了LCP图片，您可以像这样添加属性：

<PagesOnly>

```jsx filename="app/page.js"
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <h1>我的主页</h1>
      <Image
        src="/me.png"
        alt="作者的照片"
        width={500}
        height={500}
        priority
      />
      <p>欢迎来到我的主页！</p>
    </>
  )
}
```

</PagesOnly>

<AppOnly>

```jsx filename="app/page.js"
import Image from 'next/image'
import profilePic from '../public/me.png'

export default function Page() {
  return <Image src={profilePic} alt="作者的照片" priority />
}
```

</AppOnly>

有关优先级的更多信息，请参见[`next/image`组件文档](/docs/app/api-reference/components/image#priority)。

## 图片尺寸

图片通常通过_布局偏移_影响性能的一种方式，即图片在加载时推动页面上其他元素的位置。这种性能问题对用户来说非常烦人，以至于它有自己的核心网络关键指标，称为[累积布局偏移](https://web.dev/cls/)。避免基于图片的布局偏移的方法是[始终为图片指定尺寸](https://web.dev/optimize-cls/#images-without-dimensions)。这允许浏览器在图片加载之前精确预留足够的空间。

由于`next/image`旨在保证良好的性能结果，它不能以会导致布局偏移的方式使用，并且**必须**以三种方式之一进行尺寸设置：

1. 自动地，使用[静态导入](#local-images)
2. 明确地，通过包含`width`和`height`属性
3. 隐式地，使用`fill`，使图片扩展以填充其父元素。

> **如果我不知道该给我的图片设置多大的尺寸怎么办？**
>
> 如果您正在访问一个没有图片尺寸信息的图片源，您可以做几件事情：
>
> **使用`fill`**
>
> [`fill`](/docs/app/api-reference/components/image#fill)属性允许您的图片由其父元素进行尺寸设置。考虑使用CSS为图片的父元素在页面上分配空间，以及使用`sizes`属性匹配任何媒体查询断点。您还可以使用`object-fit`与`fill`、`contain`或`cover`，以及`object-position`来定义图片应如何占据该空间。
>
> **标准化您的图片**
>
> 如果您控制着图片来源，考虑修改您的图片流水线，将图片标准化为特定尺寸。
>
> **修改您的API调用**
>
> 如果您的应用程序使用API调用（例如到CMS）检索图片URL，您可能可以修改API调用以返回图片尺寸和URL。

如果上述任何建议的方法都不适用于您的图片尺寸设置，`next/image`组件旨在与标准`<img>`元素一起在页面上良好工作。

## 样式

为 Image 组件设置样式与为普通 `<img>` 元素设置样式类似，但有一些指南需要注意：

- 使用 `className` 或 `style`，而不是 `styled-jsx`。
  - 在大多数情况下，我们建议使用 `className` 属性。这可以是导入的 [CSS 模块](/docs/app/building-your-application/styling/css-modules)，[全局样式表](/docs/app/building-your-application/styling/css-modules#global-styles)等。
  - 您也可以使用 `style` 属性分配内联样式。
  - 您不能使用 [styled-jsx](/docs/app/building-your-application/styling/css-in-js)，因为它限定在当前组件范围内（除非您将样式标记为 `global`）。
- 当使用 `fill` 时，父元素必须有 `position: relative`
  - 这对于在该布局模式下正确渲染图像元素是必要的。
- 当使用 `fill` 时，父元素必须有 `display: block`
  - 这是 `<div>` 元素的默认设置，但其他情况下应明确指定。

## 示例

### 响应式

<Image
  alt="响应式图片填满其父容器的宽度和高度"
  srcLight="/docs/light/responsive-image.png"
  srcDark="/docs/dark/responsive-image.png"
  width="1600"
  height="629"
/>

```jsx
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Responsive() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Image
        alt="Mountains"
        // 导入图片将
        // 自动设置宽度和高度
        src={mountains}
        sizes="100vw"
        // 使图片显示全宽
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}
```

### 填充容器

<Image
  alt="网格图片填满父容器宽度"
  srcLight="/docs/light/fill-container.png"
  srcDark="/docs/dark/fill-container.png"
  width="1600"
  height="529"
/>

```jsx
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Fill() {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '8px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, auto))',
      }}
    >
      <div style={{ position: 'relative', height: '400px' }}>
        <Image
          alt="Mountains"
          src={mountains}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: 'cover', // cover, contain, none
          }}
        />
      </div>
      {/* 网格中还有更多图片... */}
    </div>
  )
}
```

### 背景图片

<Image
  alt="背景图片占据页面的全宽和全高"
  srcLight="/docs/light/background-image.png"
  srcDark="/docs/dark/background-image.png"
  width="1600"
  height="427"
/>

```jsx
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Background() {
  return (
    <Image
      alt="Mountains"
      src={mountains}
      placeholder="blur"
      quality={100}
      fill
      sizes="100vw"
      style={{
        objectFit: 'cover',
      }}
    />
  )
}
```

有关 Image 组件使用各种样式的示例，请参见 [Image Component Demo](https://image-component.nextjs.gallery)。

## 其他属性

[**查看 `next/image` 组件可用的所有属性。**](/docs/app/api-reference/components/image)

## 配置

`next/image` 组件和 Next.js 图像优化 API 可以在 [`next.config.js` 文件](/docs/app/api-reference/next-config-js) 中进行配置。这些配置允许您 [启用远程图像](/docs/app/api-reference/components/image#remotepatterns)、[定义自定义图像断点](/docs/app/api-reference/components/image#devicesizes)、[更改缓存行为](/docs/app/api-reference/components/image#caching-behavior) 等。

[**阅读完整的图像配置文档以获取更多信息。**](/docs/app/api-reference/components/image#configuration-options)