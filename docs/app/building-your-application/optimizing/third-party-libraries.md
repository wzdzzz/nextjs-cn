# 第三方库

**`@next/third-parties`** 是一个库，提供了一组组件和实用程序，这些组件和实用程序可以提高在您的 Next.js 应用程序中加载流行第三方库的性能和开发者体验。

`@next/third-parties` 提供的所有第三方集成都已针对性能和易用性进行了优化。

## 开始使用

要开始使用，请安装 `@next/third-parties` 库：

```bash filename="终端"
npm install @next/third-parties@latest next@latest
```

`@next/third-parties` 目前是一个**实验性**的库，正在积极开发中。我们建议您在添加更多第三方集成的同时，使用 **latest** 或 **canary** 标志进行安装。

## Google 第三方库

所有支持的 Google 第三方库都可以从 `@next/third-parties/google` 导入。

### Google 标签管理器

`GoogleTagManager` 组件可以用来在您的页面上实例化一个 [Google 标签管理器](https://developers.google.com/tag-platform/tag-manager) 容器。默认情况下，在页面上发生水合后，它会获取原始的内联脚本。

<App>

要在所有路由上加载 Google 标签管理器，将组件直接包含在您的根布局中，并传入您的 GTM 容器 ID：

```tsx filename="app/layout.tsx" switcher
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-XYZ" />
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-XYZ" />
      <body>{children}</body>
    </html>
  )
}
```

</App>

<Pages>

要在所有路由上加载 Google 标签管理器，将组件直接包含在您的自定义 `_app` 中，并传入您的 GTM 容器 ID：

```jsx filename="pages/_app.js"
import { GoogleTagManager } from '@next/third-parties/google'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleTagManager gtmId="GTM-XYZ" />
    </>
  )
}
```

</Pages>

要为单个路由加载 Google 标签管理器，请将组件包含在您的页面文件中：

<App>

```jsx filename="app/page.js"
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return <GoogleTagManager gtmId="GTM-XYZ" />
}
```

</App>

<Pages>

```jsx filename="pages/index.js"
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return <GoogleTagManager gtmId="GTM-XYZ" />
}
```

</Pages>
# 发送事件

`sendGTMEvent` 函数可用于通过使用 `dataLayer` 对象发送事件来跟踪页面上的用户交互。要使此函数正常工作，必须在父布局、页面或组件中包含 `<GoogleTagManager />` 组件，或者直接在同一文件中包含。

<App>

```jsx filename="app/page.js"
'use client'

import { sendGTMEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <div>
      <button
        onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })}
      >
        发送事件
      </button>
    </div>
  )
}
```
</App>

<Pages>

```jsx filename="pages/index.js"
import { sendGTMEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <div>
      <button
        onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })}
      >
        发送事件
      </button>
    </div>
  )
}
```
</Pages>

如需了解可以传递给函数的不同变量和事件，请参考标签管理器 [开发者文档](https://developers.google.com/tag-platform/tag-manager/datalayer)。

# 选项

传给 Google 标签管理器的选项。要获取选项的完整列表，请阅读 [Google 标签管理器文档](https://developers.google.com/tag-platform/tag-manager/datalayer)。

| 名称            | 类型     | 描述                                                                           |
| --------------- | -------- | ------------------------------------------------------------------------------ |
| `gtmId`         | 必填     | 您的 GTM 容器 ID。通常以 `GTM-` 开头。                                    |
| `dataLayer`     | 可选     | 用于实例化容器的数据层数组。默认为空数组。                               |
| `dataLayerName` | 可选     | 数据层的名称。默认为 `dataLayer`。                                        |
| `auth`          | 可选     | 环境片段的认证参数值（`gtm_auth`）。                                     |
| `preview`       | 可选     | 环境片段的预览参数值（`gtm_preview`）。                                   |

须知：
### Google Analytics

`GoogleAnalytics` 组件可用于通过 Google 标签（`gtag.js`）将 [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4) 包含在您的页面中。默认情况下，它会在页面发生水合后获取原始脚本。

> **推荐**：如果 Google Tag Manager 已经包含在您的应用程序中，您可以直接使用它配置 Google Analytics，而不是将 Google Analytics 作为单独的组件包含。请参阅 [文档](https://developers.google.com/analytics/devguides/collection/ga4/tag-options#what-is-gtm) 以了解更多关于 Tag Manager 和 `gtag.js` 之间的区别。

**App**:

要为所有路由加载 Google Analytics，请将组件直接包含在您的根布局中，并传入您的测量 ID：

```tsx filename="app/layout.tsx" switcher
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

**Pages**:

要为所有路由加载 Google Analytics，请将组件直接包含在您的自定义 `_app` 中，并传入您的测量 ID：

```jsx filename="pages/_app.js"
import { GoogleAnalytics } from '@next/third-parties/google'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-XYZ" />
    </>
  )
}
```

要为单个路由加载 Google Analytics，请将组件包含在您的页面文件中：

**App**:

```jsx filename="app/page.js"
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Page() {
  return <GoogleAnalytics gaId="G-XYZ" />
}
```

**Pages**:

```jsx filename="pages/index.js"
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Page() {
  return <GoogleAnalytics gaId="G-XYZ" />
}
```

#### 发送事件

`sendGAEvent` 函数可用于通过 `dataLayer` 对象发送事件来衡量页面上的用户交互。要使此函数工作，必须在父布局、页面或组件中包含 `<GoogleAnalytics />` 组件，或直接在同一文件中包含。

**App**:

```jsx filename="app/page.js"
'use client'

import { sendGAEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <div>
      <button
        onClick={() => sendGAEvent({ event: 'buttonClicked', value: 'xyz' })}
      >
        发送事件
      </button>
    </div>
  )
}
```

**Pages**:

```jsx filename="pages/index.js"
import { sendGAEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <div>
      <button
        onClick={() => sendGAEvent({ event: 'buttonClicked', value: 'xyz' })}
      >
        发送事件
      </button>
    </div>
  )
}
```

请参阅 Google Analytics [开发者文档](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters) 以了解更多关于事件参数的信息。
# 跟踪页面浏览量

Google Analytics 在浏览器历史状态更改时会自动跟踪页面浏览量。这意味着客户端在 Next.js 路由之间的导航将发送页面浏览数据，无需任何配置。

为了确保客户端导航被正确测量，请验证您的管理面板中已启用 [“增强型测量”](https://support.google.com/analytics/answer/9216061#enable_disable) 属性，并且已选中“基于浏览器历史事件的页面更改”复选框。

> **须知**：如果您决定手动发送页面浏览事件，请确保禁用默认的页面浏览测量，以避免数据重复。请参阅 Google Analytics [开发者文档](https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag#manual_pageviews) 了解更多信息。

# 选项

传递给 `<GoogleAnalytics>` 组件的选项。

| 名称            | 类型     | 描述                                                                                            |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `gaId`          | 必填     | 您的 [测量 ID](https://support.google.com/analytics/answer/12270356)。通常以 `G-` 开头。 |
| `dataLayerName` | 可选     | 数据层的名称。默认为 `dataLayer`。                                                       |
### Google Maps Embed

`GoogleMapsEmbed` 组件可用于将 [Google Maps Embed](https://developers.google.com/maps/documentation/embed/embedding-map) 添加到您的页面。默认情况下，它使用 `loading` 属性将嵌入内容懒加载到页面下方。

**App**

```jsx filename="app/page.js"
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleMapsEmbed
      apiKey="XYZ"
      height={200}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

**Pages**

```jsx filename="pages/index.js"
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleMapsEmbed
      apiKey="XYZ"
      height={200}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

#### 选项

传递给 Google Maps Embed 的选项。有关选项的完整列表，请阅读 [Google Map Embed 文档](https://developers.google.com/maps/documentation/embed/embedding-map)。

| 名称              | 类型     | 描述                                                                                         |
| ----------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `apiKey`          | 必填     | 您的 API 密钥。                                                                                       |
| `mode`            | 必填     | [地图模式](https://developers.google.com/maps/documentation/embed/embedding-map#choosing_map_modes) |
| `height`          | 可选     | 嵌入内容的高度。默认为 `auto`。                                                            |
| `width`           | 可选     | 嵌入内容的宽度。默认为 `auto`。                                                             |
| `style`           | 可选     | 向 iframe 传递样式。                                                                          |
| `allowfullscreen` | 可选     | 允许某些地图部分全屏的属性。                                              |
| `loading`         | 可选     | 默认为懒加载。如果您知道嵌入内容将位于页面上方，请考虑更改。                  |
| `q`               | 可选     | 定义地图标记位置。_根据地图模式，这可能是必需的_。                      |
| `center`          | 可选     | 定义地图视图的中心。                                                                 |
| `zoom`            | 可选     | 设置地图的初始缩放级别。                                                                 |
| `maptype`         | 可选     | 定义要加载的地图瓦片类型。                                                                  |
| `language`        | 可选     | 定义 UI 元素使用的语言以及地图瓦片上标签的显示语言。             |
| `region`          | 可选     | 根据地理政治敏感性，定义要显示的适当边界和标签。        |

须知：在使用 `GoogleMapsEmbed` 组件之前，请确保您已经从 Google 获取了有效的 API 密钥，并且遵守了 Google Maps 的使用条款。
### YouTube 嵌入

`YouTubeEmbed` 组件用于加载和显示 YouTube 嵌入视频。该组件通过在底层使用 [`lite-youtube-embed`](https://github.com/paulirish/lite-youtube-embed) 加载得更快。

**App**

```jsx filename="app/page.js"
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

**Pages**

```jsx filename="pages/index.js"
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

#### 选项

| 名称        | 类型     | 描述                                                                                                                                                                                                      |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `videoid`   | 必选     | YouTube 视频 ID。                                                                                                                                                                                            |
| `width`     | 可选     | 视频容器的宽度。默认为 `auto`                                                                                                                                                                         |
| `height`    | 可选     | 视频容器的高度。默认为 `auto`                                                                                                                                                                         |
| `playlabel` | 可选     | 播放按钮的可视隐藏标签，用于提高可访问性。                                                                                                                                                         |
| `params`    | 可选     | 在 [这里](https://developers.google.com/youtube/player_parameters#Parameters) 定义的视频播放器参数。<br/>参数以查询参数字符串的形式传递。<br/>例如：`params="controls=0&start=10&end=30"` |
| `style`     | 可选     | 用于应用视频容器样式。                                                                                                                                                                                  |
须知：以上内容为翻译的 Markdown 格式文本，已按照要求进行了翻译和格式化。