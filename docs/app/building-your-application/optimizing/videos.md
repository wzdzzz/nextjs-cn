---
title: 视频优化
nav_title: 视频
description: 为您的Next.js应用程序优化视频的建议和最佳实践。
---
# 视频优化
本页面概述了如何在Next.js应用程序中使用视频，展示了如何存储和显示视频文件而不会影响性能。

## 使用 `<video>` 和 `<iframe>`

可以使用HTML **`<video>`** 标签嵌入直接视频文件，以及使用 **`<iframe>`** 嵌入外部平台托管的视频。

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
      您的浏览器不支持视频标签。
    </video>
  )
}
```

### 常见的 `<video>` 标签属性

| 属性        | 描述                                                                                                    | 示例值                                      |
| ----------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `src`       | 指定视频文件的来源。                                                                                   | `<video src="/path/to/video.mp4" />`      |
| `width`     | 设置视频播放器的宽度。                                                                                 | `<video width="320" />`                   |
| `height`    | 设置视频播放器的高度。                                                                                 | `<video height="240" />`                  |
| `controls`  | 如果存在，它将显示默认的播放控件集。                                                                   | `<video controls />`                      |
| `autoPlay`  | 当页面加载时自动开始播放视频。注意：自动播放策略因浏览器而异。                                           | `<video autoPlay />`                      |
| `loop`      | 循环播放视频。                                                                                        | `<video loop />`                         |
| `muted`     | 默认情况下静音音频。通常与 `autoPlay` 一起使用。                                                        | `<video muted />`                        |
| `preload`   | 指定如何预加载视频。值：`none`, `metadata`, `auto`。                                                 | `<video preload="none" />`                |
| `playsInline` | 在iOS设备上启用内联播放，通常对于iOS Safari上自动播放是必要的。                                      | `<video playsInline />`                   |

> **须知**：当使用 `autoPlay` 属性时，重要的是还要包括 `muted` 属性以确保视频在大多数浏览器中自动播放，以及 `playsInline` 属性以兼容iOS设备。

有关视频属性的全面列表，请参阅 [MDN文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attributes)。

### 视频最佳实践

- **备选内容：** 使用 `<video>` 标签时，包含备选内容在标签内，以便不支持视频播放的浏览器能够显示。
- **字幕或说明文字：** 为听障用户包含字幕或说明文字。使用 [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) 标签与 `<video>` 元素一起，以指定字幕文件源。
- **可访问控制：** 推荐使用标准的 HTML5 视频控制，以便键盘导航和屏幕阅读器兼容。对于高级需求，考虑使用第三方播放器，如 [react-player](https://github.com/cookpete/react-player) 或 [video.js](https://videojs.com/)，它们提供可访问的控制和一致的浏览器体验。

### `<iframe>`

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

### 常见的 `<iframe>` 标签属性

| 属性             | 描述                                                                 | 示例值                                      |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------------ |
| `src`            | 要嵌入的页面的 URL。                                                 | `<iframe src="https://example.com" />`   |
| `width`          | 设置 iframe 的宽度。                                                 | `<iframe width="500" />`                  |
| `height`         | 设置 iframe 的高度。                                                 | `<iframe height="300" />`                 |
| `frameborder`    | 指定是否在 iframe 周围显示边框。                                     | `<iframe frameborder="0" />`              |
| `allowfullscreen`| 允许 iframe 内容以全屏模式显示。                                     | `<iframe allowfullscreen />`              |
| `sandbox`        | 对 iframe 内的内容启用一组额外的限制。                               | `<iframe sandbox />`                      |
| `loading`        | 优化加载行为（例如，延迟加载）。                                     | `<iframe loading="lazy" />`               |
| `title`          | 为 iframe 提供标题，以支持可访问性。                               | `<iframe title="描述" />`                  |

有关 iframe 属性的全面列表，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attributes)。

### 选择视频嵌入方法

你可以用两种方式在你的 Next.js 应用程序中嵌入视频：

- **自托管或直接视频文件：** 使用 `<video>` 标签嵌入自托管视频，适用于需要对播放器的功能和外观进行详细控制的场景。这种集成方法在 Next.js 内允许你自定义和控制你的视频内容。
- **使用视频托管服务（YouTube、Vimeo 等）：** 对于像 YouTube 或 Vimeo 这样的视频托管服务，你将使用 `<iframe>` 标签嵌入他们的基于 iframe 的播放器。虽然这种方法限制了对播放器的一些控制，但它提供了这些平台提供的易用性和功能。

选择与你的应用程序要求和你要提供的用户体验相一致的嵌入方法。

### 嵌入外部托管视频

要嵌入来自外部平台的视频，您可以使用 Next.js 来获取视频信息，并使用 React Suspense 来处理加载期间的回退状态。

**1. 创建用于视频嵌入的服务器组件**

第一步是创建一个[服务器组件](https://nextjs.org/docs/app/building-your-application/rendering/server-components)，该组件生成适当的 iframe 以嵌入视频。此组件将获取视频的源 URL 并呈现 iframe。

```jsx filename="app/ui/video-component.jsx"
export default async function VideoComponent() {
  const src = await getVideoSrc()

  return <iframe src={src} frameborder="0" allowfullscreen />
}
```

**2. 使用 React Suspense 流式传输视频组件**

创建用于嵌入视频的服务器组件后，下一步是使用[React Suspense](https://react.dev/reference/react/Suspense)来[流式传输](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)组件。

```jsx filename="app/page.jsx"
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<p>正在加载视频...</p>}>
        <VideoComponent />
      </Suspense>
      {/* 页面的其他内容 */}
    </section>
  )
}
```

> **须知**：在嵌入来自外部平台的视频时，请考虑以下最佳实践：
>
> - 确保视频嵌入是响应式的。使用 CSS 使 iframe 或视频播放器适应不同的屏幕尺寸。
> - 实施基于网络条件的[视频加载策略](https://yoast.com/site-speed-tips-for-faster-video/)，特别是对于有限数据计划的用户。

这种方法可以带来更好的用户体验，因为它防止了页面阻塞，这意味着用户可以在视频组件流式传输时与页面进行交互。

为了获得更具吸引力和信息性的信息加载体验，请考虑使用加载骨架作为回退 UI。因此，您可以显示一个类似于视频播放器的骨架，而不是简单的加载消息，如下所示：

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

### 自托管视频

出于多种原因，自托管视频可能更可取：

- **完全控制和独立性**：自托管使您能够直接管理您的视频内容，从播放到外观，确保完全拥有和控制，不受外部平台限制。
- **针对特定需求的定制**：适用于独特需求，如动态背景视频，它允许量身定制的定制，以符合设计和功能需求。
- **性能和可扩展性考虑**：选择既高性能又可扩展的存储解决方案，以有效支持不断增加的流量和内容大小。
- **成本和集成**：平衡存储和带宽的成本与轻松集成到您的 Next.js 框架和更广泛的技术生态系统的需求。

### 使用 Vercel Blob 进行视频托管

[Vercel Blob](https://vercel.com/docs/storage/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 提供了一种高效的视频托管方式，提供了一个可扩展的云存储解决方案，与 Next.js 配合使用效果很好。以下是如何使用 Vercel Blob 托管视频的方法：

**1. 将视频上传到 Vercel Blob**

在您的 Vercel 仪表板中，导航到“存储”选项卡并选择您的 [Vercel Blob](https://vercel.com/docs/storage/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 存储。在 Blob 表格的右上角，找到并点击“上传”按钮。然后，选择您想要上传的视频文件。上传完成后，视频文件将出现在 Blob 表格中。

或者，您可以使用服务器操作上传您的视频。有关详细说明，请参阅 Vercel 文档中的 [服务器端上传](https://vercel.com/docs/storage/vercel-blob/server-upload)。Vercel 还支持 [客户端上传](https://vercel.com/docs/storage/vercel-blob/client-upload)。对于某些用例，这种方法可能更可取。

**2. 在 Next.js 中展示视频**

一旦视频上传并存储，您可以在您的 Next.js 应用程序中展示它。以下是如何使用 `<video>` 标签和 React Suspense 来实现这一点的示例：

```jsx filename="app/page.jsx"
import { Suspense } from 'react'
import { list } from '@vercel/blob'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading video...</p>}>
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
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
  )
}
```

在这种方法中，页面使用视频的 `@vercel/blob` URL 通过 `VideoComponent` 展示视频。使用 React Suspense 显示一个备用内容，直到获取到视频 URL 并准备好展示视频。

### 为您的视频添加字幕

如果您的视频有字幕，您可以很容易地使用 `<video>` 标签内的 `<track>` 元素添加它们。您可以以类似获取视频文件的方式从 [Vercel Blob](https://vercel.com/docs/storage/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 获取字幕文件。以下是如何更新 `<VideoComponent>` 以包含字幕的示例。

```jsx filename="app/page.jsx"
async function VideoComponent({ fileName }) {
  const {blobs} = await list({
    prefix: fileName,
    limit: 2
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

通过这种方法，您可以有效地自行托管并将视频集成到您的 Next.js 应用程序中。

## 资源

要深入了解视频优化和最佳实践，请参考以下资源：

- **理解视频格式和编解码器**：为您的视频需求选择合适的格式和编解码器，例如MP4用于兼容性或WebM用于网络优化。有关更多详细信息，请参见[Mozilla的视频编解码器指南](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)。
- **视频压缩**：使用FFmpeg等工具有效压缩视频，平衡质量与文件大小。在[FFmpeg官方网站](https://www.ffmpeg.org/)了解压缩技术。
- **分辨率和比特率调整**：根据观看平台调整[分辨率和比特率](https://www.dacast.com/blog/bitrate-vs-resolution/#:~:text=The%20two%20measure%20different%20aspects,yield%20different%20qualities%20of%20video)，移动设备使用较低设置。
- **内容分发网络（CDN）**：利用CDN提高视频传输速度并管理高流量。使用某些存储解决方案，如Vercel Blob时，CDN功能将自动为您处理。[了解更多](https://vercel.com/docs/edge-network/overview?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)关于CDN及其优势。

探索这些视频流媒体平台，将视频集成到您的Next.js项目中：

### 开源 `next-video` 组件

- 提供一个与各种托管服务兼容的 `<Video>` 组件，包括 [Vercel Blob](https://vercel.com/docs/storage/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)、S3、Backblaze和Mux。
- [详细文档](https://next-video.dev/docs)，介绍如何使用 `next-video.dev` 与不同托管服务。

### Cloudinary集成

- 使用Cloudinary与Next.js的官方[文档和集成指南](https://next.cloudinary.dev/)。
- 包括一个 `<CldVideoPlayer>` 组件，用于[即插即用视频支持](https://next.cloudinary.dev/cldvideoplayer/basic-usage)。
- 查找[集成Cloudinary与Next.js的示例](https://github.com/cloudinary-community/cloudinary-examples/?tab=readme-ov-file#nextjs)，包括[自适应比特率流媒体](https://github.com/cloudinary-community/cloudinary-examples/tree/main/examples/nextjs-cldvideoplayer-abr)。
- 还提供其他[Cloudinary库](https://cloudinary.com/documentation)，包括Node.js SDK。

### Mux视频API

- Mux提供了一个[入门模板](https://github.com/muxinc/video-course-starter-kit)，用于使用Mux和Next.js创建视频课程。
- 了解Mux对于嵌入[Next.js应用程序的高性能视频的建议](https://www.mux.com/for/nextjs)。
- 探索一个[示例项目](https://with-mux-video.vercel.app/)，演示Mux与Next.js的结合。

### Fastly

- 了解更多关于将Fastly的解决方案集成到Next.js中的[视频点播](https://www.fastly.com/products/streaming-media/video-on-demand)和流媒体。