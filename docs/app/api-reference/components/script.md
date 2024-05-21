---
title: <Script> 组件
description: 使用内置的 `next/script` 组件优化 Next.js 应用中的第三方脚本。
---



本 API 参考将帮助您了解 Script 组件可用的 [props](#props)。有关特性和用法，请参见 [优化脚本](/docs/app/building-your-application/optimizing/scripts) 页面。

```tsx filename="app/dashboard/page.tsx" switcher
import Script from 'next/script'

export default function Dashboard() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
import Script from 'next/script'

export default function Dashboard() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```


## Props

以下是 Script 组件可用的属性摘要：

| 属性                    | 示例                             | 类型     | 是否必须                              |
| ----------------------- | --------------------------------- | -------- | ------------------------------------- |
| [`src`](#src)           | `src="http://example.com/script"` | String   | 除非使用内联脚本，否则为必须 |
| [`strategy`](#strategy) | `strategy="lazyOnload"`           | String   | -                                     |
| [`onLoad`](#onload)     | `onLoad={onLoadFunc}`             | Function | -                                     |
| [`onReady`](#onready)   | `onReady={onReadyFunc}`           | Function | -                                     |
| [`onError`](#onerror)   | `onError={onErrorFunc}`           | Function | -                                     |

## 必需属性

`<Script />` 组件需要以下属性。

### `src`

指定外部脚本 URL 的路径字符串。可以是绝对的外部 URL 或内部路径。除非使用内联脚本，否则 `src` 属性是必需的。

## 可选属性

`<Script />` 组件接受除了必需的属性之外的许多其他属性。

### `strategy`

脚本的加载策略。可以使用以下四种不同的策略：

- `beforeInteractive`: 在任何 Next.js 代码之前加载，并在页面水合之前发生。
- `afterInteractive`: （默认）加载得较早，但在页面上发生一些水合之后。
- `lazyOnload`: 在浏览器空闲时间加载。
- `worker`: （实验性）在 Web Worker 中加载。
### `beforeInteractive`

使用 `beforeInteractive` 策略加载的脚本被注入到服务器的初始 HTML 中，在任何 Next.js 模块之前下载，并在页面上的任何水合（hydration）发生之前按它们放置的顺序执行。

标有此策略的脚本会预加载并在任何第一方代码之前获取，但它们的执行不会阻止页面水合的发生。

<AppOnly>

`beforeInteractive` 脚本必须放置在根布局（`app/layout.tsx`）中，旨在加载整个站点所需的脚本（即，当应用程序中的任何页面已在服务器端加载时，脚本将加载）。

</AppOnly>

<PagesOnly>

`beforeInteractive` 脚本必须放置在 `Document` 组件（`pages/_document.js`）中，旨在加载整个站点所需的脚本（即，当应用程序中的任何页面已在服务器端加载时，脚本将加载）。

</PagesOnly>

**此策略仅应用于需要在页面的任何部分变得交互式之前获取的关键脚本。**

<AppOnly>

```tsx filename="app/layout.tsx" switcher
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
```

</AppOnly>

<PagesOnly>

```jsx filename="pages/_document.js"
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  )
}
```

</PagesOnly>

> **须知**：带有 `beforeInteractive` 的脚本将始终被注入到 HTML 文档的 `head` 中，无论它在组件中放置在哪里。

一些应尽快使用 `beforeInteractive` 加载的脚本示例包括：

- 机器人检测器
- Cookie同意管理器

### `afterInteractive`

使用 `afterInteractive` 策略的脚本被注入到 HTML 中的客户端，并将加载在页面上的一些（或全部）水合发生之后。**这是 Script 组件的默认策略**，应用于任何需要尽快加载但不要在任何第一方 Next.js 代码之前加载的脚本。

`afterInteractive` 脚本可以放置在任何页面或布局中，并且只有在在浏览器中打开该页面（或一组页面）时才会加载和执行。

```jsx filename="app/page.js"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="afterInteractive" />
    </>
  )
}
```

一些适合使用 `afterInteractive` 的脚本示例包括：

- 标签管理器
- 分析工具
### `lazyOnload`

使用 `lazyOnload` 策略的脚本会在浏览器空闲时间注入到 HTML 客户端，并在页面上所有资源被获取后才加载。应使用此策略加载任何后台或低优先级的脚本，这些脚本不需要早期加载。

`lazyOnload` 脚本可以放置在任何页面或布局中，并且只有在在浏览器中打开该页面（或一组页面）时才会加载和执行。

```jsx filename="app/page.js"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="lazyOnload" />
    </>
  )
}
```

不需要立即加载并且可以使用 `lazyOnload` 获取的脚本示例包括：

- 聊天支持插件
- 社交媒体小部件

### `worker`

> **警告：** `worker` 策略目前尚未稳定，并且尚不适用于 [`app`](/docs/app/building-your-application/routing/defining-routes) 目录。请谨慎使用。

使用 `worker` 策略的脚本被卸载到 Web Worker 中，以释放主线程，并确保只有关键的、第一方的资源在其中处理。虽然这种策略可以用于任何脚本，但它是一个高级用例，不能保证支持所有第三方脚本。

要使用 `worker` 作为策略，必须在 `next.config.js` 中启用 `nextScriptWorkers` 标志：

```js filename="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

`worker` 脚本**目前只能在 `pages/` 目录中使用**：

```tsx filename="pages/home.tsx" switcher
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

```jsx filename="pages/home.js" switcher
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

### `onLoad`

> **警告：** `onLoad` 尚不适用于服务器组件，并且只能在客户端组件中使用。此外，`onLoad` 不能与 `beforeInteractive` 一起使用 - 考虑改用 `onReady`。

一些第三方脚本要求用户在脚本加载完成后运行一次 JavaScript 代码，以实例化内容或调用函数。如果您使用 afterInteractive 或 lazyOnload 作为加载策略加载脚本，可以使用 onLoad 属性在加载后执行代码。

以下是在库加载后仅执行 lodash 方法的示例。

```tsx filename="app/page.tsx" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
        onLoad={() => {
          console.log(_.sample([1, 2, 3, 4]))
        }}
      />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
        onLoad={() => {
          console.log(_.sample([1, 2, 3, 4]))
        }}
      />
    </>
  )
}
```
## `onReady`

> **警告：** `onReady` 尚未支持 Server Components，只能在 Client Components 中使用。

一些第三方脚本要求用户在脚本加载完成后以及每次组件挂载时（例如路由导航后）运行 JavaScript 代码。您可以使用 onReady 属性，在脚本首次加载后的加载事件后执行代码，然后在每次后续组件重新挂载后执行。

以下是如何在每次组件挂载时重新实例化 Google Maps JS 嵌入的示例：

<AppOnly>

```tsx filename="app/page.tsx" switcher
'use client'

import { useRef } from 'react'
import Script from 'next/script'

export default function Page() {
  const mapRef = useRef()

  return (
    <>
      <div ref={mapRef}></div>
      <Script
        id="google-maps"
        src="https://maps.googleapis.com/maps/api/js"
        onReady={() => {
          new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          })
        }}
      />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
'use client'

import { useRef } from 'react'
import Script from 'next/script'

export default function Page() {
  const mapRef = useRef()

  return (
    <>
      <div ref={mapRef}></div>
      <Script
        id="google-maps"
        src="https://maps.googleapis.com/maps/api/js"
        onReady={() => {
          new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          })
        }}
      />
    </>
  )
}
```

</AppOnly>

<PagesOnly>

```jsx
import { useRef } from 'react'
import Script from 'next/script'

export default function Page() {
  const mapRef = useRef()

  return (
    <>
      <div ref={mapRef}></div>
      <Script
        id="google-maps"
        src="https://maps.googleapis.com/maps/api/js"
        onReady={() => {
          new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          })
        }}
      />
    </>
  )
}
```

</PagesOnly>

## `onError`

> **警告：** `onError` 尚未支持 Server Components，只能在 Client Components 中使用。`onError` 不能与 `beforeInteractive` 加载策略一起使用。

有时捕获脚本加载失败的情况会很有帮助。这些错误可以通过 onError 属性来处理：

<AppOnly>

```tsx filename="app/page.tsx" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onError={(e: Error) => {
          console.error('Script failed to load', e)
        }}
      />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onError={(e: Error) => {
          console.error('Script failed to load', e)
        }}
      />
    </>
  )
}
```

</AppOnly>

<PagesOnly>

```jsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onError={(e: Error) => {
          console.error('Script failed to load', e)
        }}
      />
    </>
  )
}
```

</PagesOnly>


## 版本历史

| 版本   | 变化                                                                   |
| --------- | ------------------------------------------------------------------------- |
| `v13.0.0` | `beforeInteractive` 和 `afterInteractive` 被修改以支持 `app`。  |
| `v12.2.4` | 添加了 `onReady` 属性。                                                     |
| `v12.2.2` | 允许将带有 `beforeInteractive` 的 `next/script` 放置在 `_document` 中。 |
| `v11.0.0` | 引入了 `next/script`。                                                 |