---
title: 视频优化
nav_title: 视频
description: 为您的 Next.js 应用程序中的视频使用提供建议和最佳实践。
---

本页面概述了如何在 Next.js 应用程序中使用视频，展示了如何存储和显示视频文件而不会影响性能。

## 使用 `<video>` 和 `<iframe>`

可以使用 HTML **`<video>`** 标签嵌入直接视频文件，以及使用 **`<iframe>`** 嵌入外部平台托管的视频。

### `<video>`

HTML [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) 标签可以嵌入自托管或直接服务的视频内容，允许完全控制播放和外观。

```jsx filename="app/ui/video.jsx"
export function Video() {
  return (
    <video width="320" height="240" controls preload="none">
      <source src="/path/to/video.mp4" type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      您的浏览器不支持 video 标签。
    </video>
  )
}
```

### 常见的 `<video>` 标签属性

| 属性        | 描述                                                                                                     | 示例值                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `src`       | 指定视频文件的来源。                                                                                         | `<video src="/path/to/video.mp4" />`       |
| `width`     | 设置视频播放器的宽度。                                                                                       | `<video width="320" />`                    |
| `height`    | 设置视频播放器的高度。                                                                                       | `<video height="240" />`                   |
| `controls`  | 如果存在，它将显示默认的播放控件集。                                                                       | `<video controls />`                       |
| `autoPlay`  | 当页面加载时自动开始播放视频。注意：自动播放策略因浏览器而异。                                               | `<video autoPlay />`                       |
| `loop`      | 循环播放视频。                                                                                               | `<video loop />`                          |
| `muted`     | 默认情况下静音音频。通常与 `autoPlay` 一起使用。                                                            | `<video muted />`                          |
| `preload`   | 指定如何预加载视频。值：`none`, `metadata`, `auto`。                                                      | `<video preload="none" />`                 |
| `playsInline` | 在 iOS 设备上启用内联播放，通常对于在 iOS Safari 上自动播放是必要的。                                     | `<video playsInline />`                    |

> **须知**：当使用 `autoPlay` 属性时，重要的是还要包括 `muted` 属性，以确保视频在大多数浏览器中自动播放，以及 `playsInline` 属性以兼容 iOS 设备。

有关视频属性的全面列表，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attributes)。

### 视频最佳实践

- **备选内容：** 使用 `<video>` 标签时，包含备选内容在标签内，以便不支持视频播放的浏览器可以显示。
- **字幕或说明：** 包括字幕或说明，以帮助聋人或听力有障碍的用户。使用 [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) 标签与您的 `<video>` 元素一起指定字幕文件来源。
- **可访问控件：** 推荐使用标准的 HTML5 视频控件，以支持键盘导航和屏幕阅读器兼容性。对于高级需求，考虑使用第三方播放器，如 [react-player](https://github.com/cookpete/react-player)。## `<iframe>` 标签

HTML `<iframe>` 标签允许你嵌入来自 YouTube 或 Vimeo 等外部平台的视频。

```jsx filename="app/page.jsx"
export default function Page() {
  return (
    <iframe
      src="https://www.youtube.com/watch?v=gfU1iZnjRZM"
      frameborder="0"
      allowfullscreen
    />
  )
}
```

### `<iframe>` 标签的常见属性

| 属性            | 描述                                                                 | 示例值                                      |
| --------------- | -------------------------------------------------------------------- | ------------------------------------------ |
| `src`           | 要嵌入的页面的 URL。                                                 | `<iframe src="https://example.com" />`     |
| `width`         | 设置 iframe 的宽度。                                                 | `<iframe width="500" />`                   |
| `height`        | 设置 iframe 的高度。                                                 | `<iframe height="300" />`                  |
| `frameborder`   | 指定是否在 iframe 周围显示边框。                                     | `<iframe frameborder="0" />`               |
| `allowfullscreen` | 允许 iframe 内容以全屏模式显示。                                   | `<iframe allowfullscreen />`               |
| `sandbox`       | 对 iframe 内的内容启用一组额外的限制。                             | `<iframe sandbox />`                       |
| `loading`       | 优化加载行为（例如，延迟加载）。                                     | `<iframe loading="lazy" />`                |
| `title`         | 为 iframe 提供标题以支持无障碍性。                                 | `<iframe title="描述" />`                   |

有关 iframe 属性的全面列表，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attributes)。

### 选择视频嵌入方法

你可以通过两种方式在 Next.js 应用程序中嵌入视频：

- **自托管或直接视频文件：** 使用 `<video>` 标签嵌入自托管视频，适用于需要对播放器的功能和外观进行详细控制的场景。这种集成方法在 Next.js 中允许你自定义和控制你的视频内容。
- **使用视频托管服务（YouTube、Vimeo 等）：** 对于 YouTube 或 Vimeo 等视频托管服务，你将使用 `<iframe>` 标签嵌入他们的基于 iframe 的播放器。虽然这种方法限制了对播放器的一些控制，但它提供了这些平台提供的易用性和功能。

选择与你的应用程序需求和你要提供的用户体验相一致的嵌入方法。

### 嵌入外部托管的视频

要从外部平台嵌入视频，你可以使用 Next.js 来获取视频信息，并使用 React Suspense 来处理加载期间的回退状态。

**1. 创建视频嵌入的服务器组件**

第一步是创建一个 [服务器组件](https://nextjs.org/docs/app/building-your-application/rendering/server-components)，该组件生成适当的 iframe 以嵌入视频。这个组件将获取视频的源 URL 并呈现 iframe。

```jsx filename="app/ui/video-component.jsx"
export default async function VideoComponent() {
  const src = await getVideoSrc()

  return <iframe src={src} frameborder="0" allowfullscreen />
}
```

**2. 使用 React Suspense 流式传输视频组件**

创建了嵌入视频的服务器组件后，下一步是使用 [React Suspense](https://react.dev/reference/react/Suspense) [流式传输](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)组件。

```jsx filename="app/page.jsx"
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'

export default function Page() {
  return (
    <section>
```# 视频嵌入

## 使用第三方平台嵌入视频

使用第三方平台如YouTube或Vimeo嵌入视频可以快速简便地为你的网站添加视频内容。以下是使用`iframe`嵌入视频的示例：

```jsx
<section>
  <Suspense fallback={<p>视频加载中...</p>}>
    <VideoComponent />
  </Suspense>
  {/* 页面的其他内容 */}
</section>
```

### 最佳实践

> **须知**：当嵌入来自外部平台的视频时，请考虑以下最佳实践：
>
> - 确保视频嵌入是响应式的。使用CSS使iframe或视频播放器适应不同的屏幕尺寸。
> - 根据网络条件实施[视频加载策略](https://yoast.com/site-speed-tips-for-faster-video/)，特别是对于有限数据计划的用户。

这种方法可以提供更好的用户体验，因为它防止了页面阻塞，这意味着用户可以在视频组件流式传输时与页面互动。

为了获得更具吸引力和信息性的加载体验，请考虑使用加载骨架作为后备UI。因此，不要只显示简单的加载消息，而是可以显示类似于视频播放器的骨架，如下所示：

```jsx filename="app/page.jsx"
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'
import VideoSkeleton from '../ui/VideoSkeleton.jsx'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<VideoSkeleton />}>
        <VideoComponent />
      </Suspense>
      {/* 页面的其他内容 */}
    </section>
  )
}
```

## 自托管视频

出于几个原因，自托管视频可能更可取：

- **完全控制和独立性**：自托管允许你直接管理你的视频内容，从播放到外观，确保完全拥有和控制，不受外部平台限制。
- **针对特定需求的定制**：适合独特需求，如动态背景视频，允许量身定制以符合设计和功能需求。
- **性能和可扩展性考虑**：选择既高性能又可扩展的存储解决方案，以有效支持不断增长的流量和内容大小。
- **成本和集成**：平衡存储和带宽的成本与轻松集成到你的Next.js框架和更广泛的技术生态系统的需求。

### 使用Vercel Blob进行视频托管

[Vercel Blob](https://vercel.com/docs/storage/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)提供了一种高效的视频托管方式，提供了一个可扩展的云存储解决方案，与Next.js很好地配合。以下是如何使用Vercel Blob托管视频的方法：

**1. 将视频上传到Vercel Blob**

在你的Vercel仪表板中，导航到“存储”选项卡，并选择你的[Vercel Blob](https://vercel.com/docs/storage/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)存储。在Blob表格的右上角，找到并点击“上传”按钮。然后，选择你想要上传的视频文件。上传完成后，视频文件将出现在Blob表格中。

或者，你可以使用服务器操作上传你的视频。有关详细说明，请参阅Vercel文档中的[服务器端上传](https://vercel.com/docs/storage/vercel-blob/server-upload)。Vercel还支持[客户端上传](https://vercel.com/docs/storage/vercel-blob/client-upload)。对于某些用例，这种方法可能更可取。

**2. 在Next.js中展示视频**

一旦视频上传并存储，你可以在Next.js应用程序中展示它。以下是如何使用`<video>`标签和React Suspense进行此操作的示例：

```jsx filename="app/page.jsx"
import { Suspense } from 'react'
import { list } from '@vercel/blob'

export default function Page() {
  return (
    <Suspense fallback={<p>视频加载中...</p>}>
      <VideoComponent fileName="my-video.mp4" />
    </Suspense>
  )
}

async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 1,
  })
  const { url } = blobs[0]

  return (
    <video controls preload="none" aria-label="视频播放">
      <source src={url} type="video/mp4" />
    </video>
  )
}
```

请注意，图片的`srcLight`属性没有在提供的文本中找到，因此没有包含在翻译中。# 自定义视频播放器组件

在本节中，我们将学习如何使用Vercel Blob存储和在Next.js应用中显示视频。我们将创建一个自定义的`VideoComponent`，它将异步获取视频文件的URL，并在视频准备好后显示它。此外，我们还将学习如何为视频添加字幕。

## 创建自定义视频组件

首先，我们将创建一个`VideoComponent`，它将从Vercel Blob存储中获取视频文件的URL，并在视频准备好后显示它。我们将使用React Suspense来在获取视频URL时显示一个回退组件。

```jsx filename="app/page.jsx"
async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 1,
  });
  const { url } = blobs[0];

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
  );
}
```

在这种方法中，页面使用视频的`@vercel/blob` URL来显示`VideoComponent`。使用React Suspense来显示一个回退，直到获取视频URL并准备好显示视频。

### 为视频添加字幕

如果您的视频有字幕，您可以使用`<video>`标签内的`<track>`元素轻松添加它们。您可以像获取视频文件一样从[Vercel Blob](https://vercel.com/docs/storage/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)获取字幕文件。以下是如何更新`<VideoComponent>`以包含字幕的示例。

```jsx filename="app/page.jsx"
async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 2,
  });
  const { url } = blobs[0];
  const { url: captionsUrl } = blobs[1];

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      <track
        src={captionsUrl}
        kind="subtitles"
        srcLang="en"
        label="English">
      您的浏览器不支持视频标签。
    </video>
  );
};
```

通过这种方法，您可以有效地自托管视频并将其集成到您的Next.js应用程序中。

## 资源

要了解更多关于视频优化和最佳实践的信息，请参考以下资源：

- **了解视频格式和编解码器**：为您的视频需求选择正确的格式和编解码器，例如MP4用于兼容性或WebM用于网络优化。有关更多详细信息，请参见[Mozilla关于视频编解码器的指南](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)。
- **视频压缩**：使用像FFmpeg这样的工具有效地压缩视频，在质量与文件大小之间取得平衡。在[FFmpeg的官方网站](https://www.ffmpeg.org/)上了解压缩技术。
- **分辨率和比特率调整**：根据观看平台调整[分辨率和比特率](https://www.dacast.com/blog/bitrate-vs-resolution/#:~:text=The%20two%20measure%20different%20aspects,yield%20different%20qualities%20of%20video)，为移动设备设置较低的设置。
- **内容分发网络（CDN）**：使用CDN提高视频传输速度并管理高流量。当您使用某些存储解决方案，如Vercel Blob时，CDN功能会自动为您处理。[了解更多](https://vercel.com/docs/edge-network/overview?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)关于CDN及其优势。

探索这些视频流平台，将视频集成到您的Next.js项目中：

### 开源`next-video`组件

- 为Next.js提供`<Video>`组件，与各种托管服务兼容，包括[Vercel Blob](https://vercel.com/docs/storage/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)、S3、Backblaze和Mux。
- [详细文档](https://next-video.dev/docs)，介绍如何使用`next-video.dev`与不同的托管服务。

### Cloudinary集成

- Cloudinary的官方[文档和集成指南](https://next.cloudinary.dev/)，用于与Next.js一起使用。
- 包括一个`<CldVideoPlayer>`组件，用于[即插即用的视频支持](https://next.cloudinary.dev/cldvideoplayer/basic-usage)。
- 查找[集成Cloudinary与Next.js的示例](https://github.com/cloudinary-community/cloudinary-examples/?tab=readme-ov### Mux 和 Next.js

- 了解 Mux 对于在 Next.js 应用程序中嵌入[高性能视频](https://www.mux.com/for/nextjs)的建议。
- 探索一个[示例项目](https://with-mux-video.vercel.app/)，演示了 Mux 与 Next.js 的结合。

### Fastly

- 了解更多关于将 Fastly 的解决方案集成到 Next.js 中，用于[视频点播](https://www.fastly.com/products/streaming-media/video-on-demand)和流媒体。