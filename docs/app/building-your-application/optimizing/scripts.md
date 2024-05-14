---
title: 脚本优化
nav_title: 脚本
description: 使用内置的 Script 组件优化第三方脚本。
related:
  title: API 参考
  description: 了解更多关于 next/script API 的信息。
  links:
    - app/api-reference/components/script
---

{/* 此文档的内容在应用和页面路由器之间共享。您可以使用 `<PagesOnly>Content</PagesOnly>` 组件添加特定于页面路由器的内容。任何共享的内容都不应被包装在组件中。 */}

<AppOnly>

### 布局脚本

要为多个路由加载第三方脚本，请导入 `next/script` 并将脚本直接包含在您的布局组件中：

```tsx filename="app/dashboard/layout.tsx" switcher
import Script from 'next/script'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

```jsx filename="app/dashboard/layout.js" switcher
import Script from 'next/script'

export default function DashboardLayout({ children }) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

当用户访问文件夹路由（例如 `dashboard/page.js`）或任何嵌套路由（例如 `dashboard/settings/page.js`）时，第三方脚本将被获取。Next.js 将确保脚本**只加载一次**，即使用户在相同布局的多个路由之间导航。

</AppOnly>

### 应用程序脚本

<AppOnly>

要为所有路由加载第三方脚本，请导入 `next/script` 并将脚本直接包含在您的根布局中：

```tsx filename="app/layout.tsx" switcher
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

</AppOnly>

<PagesOnly>

要为所有路由加载第三方脚本，请导入 `next/script` 并将脚本直接包含在您的自定义 `_app` 中：

```jsx filename="pages/_app.js"
import Script from 'next/script'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

</PagesOnly>

当您的应用程序中的任何路由被访问时，此脚本将加载并执行。Next.js 将确保脚本**只加载一次**，即使用户在多个页面之间导航。

> **须知**：我们建议只在特定页面或布局中包含第三方脚本，以最小化对性能的不必要影响。

### 策略

尽管 `next/script` 的默认行为允许您在任何页面或布局中加载第三方脚本，但您可以通过使用 `strategy` 属性来微调其加载行为：

- `beforeInteractive`：在任何 Next.js 代码和任何页面水合之前加载脚本。
- `afterInteractive`：（默认）在页面上发生一些水合后尽早加载脚本。
- `lazyOnload`：在浏览器空闲时间晚些时候加载脚本。
- `worker`：（实验性）在 Web Worker 中加载脚本。

请参阅 [`next/script`](/docs/app/api-reference/components/script#strategy) API 参考文档，了解更多关于每种策略及其用例的信息。

### 将脚本卸载到 Web Worker（实验性）

> **警告：** `worker` 策略尚未稳定，并且尚不适用于 [`app`](/docs/app/building-your-application/routing/defining-routes) 目录。请谨慎使用。

使用 `worker` 策略的脚本## 脚本组件

在Next.js中，`Script`组件用于加载外部脚本，并且可以配置为在网页后台线程（web worker）中卸载并执行，以提高网站性能。这需要使用[Partytown](https://partytown.builder.io/)。

### 使用Partytown在Web Worker中加载脚本

这种策略仍然处于实验阶段，只有在`next.config.js`中启用了`nextScriptWorkers`标志时才能使用：

```js filename="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

然后运行`next`（通常是`npm run dev`或`yarn dev`），Next.js将引导你完成设置所需的软件包安装：

```bash filename="终端"
npm run dev
```

你将看到类似这样的指令：请通过运行`npm install @builder.io/partytown`来安装Partytown。

一旦设置完成，定义`strategy="worker"`将自动在你的应用程序中实例化Partytown，并将脚本卸载到web worker中。

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

在web worker中加载第三方脚本时，需要考虑一些权衡。有关更多信息，请参见Partytown的[权衡](https://partytown.builder.io/trade-offs)文档。

### 内联脚本

内联脚本，或不从外部文件加载的脚本，也由Script组件支持。它们可以通过将JavaScript放在花括号内来编写：

```jsx
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

或者使用`dangerouslySetInnerHTML`属性：

```jsx
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

> **警告**：内联脚本必须分配一个`id`属性，以便Next.js能够跟踪和优化脚本。

### 执行额外的代码

可以使用事件处理程序与Script组件一起使用，在特定事件发生后执行额外的代码：

- `onLoad`：在脚本加载完成后执行代码。
- `onReady`：在脚本加载完成后，每次组件挂载时执行代码。
- `onError`：如果脚本加载失败，则执行代码。

<AppOnly>

这些处理程序只有在`next/script`被导入并用在定义了`"use client"`作为代码第一行的[客户端组件](/docs/app/building-your-application/rendering/client-components)中时才会工作：

```tsx filename="app/page.tsx" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('Script has loaded')
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
        onLoad={() => {
          console.log('Script has loaded')
        }}
      />
    </>
  )
}
```

参考[`next/script`](/docs/app/api-reference/components/script#onload) API参考，了解更多关于每个事件处理程序的信息，并查看示例。

</AppOnly>

<PagesOnly>

这些处理程序只有在`next/script`被导入并用在定义了`"use client"`作为代码第一行的[客户端组件](/docs/app/building-your-application/rendering/client-components)中时才会工作：

```tsx filename="pages/index.tsx" switcher
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
```### `onLoad` 事件处理

在 `Script` 组件中，`onLoad` 事件处理程序会在脚本加载完成后调用。以下是如何在 `pages/index.js` 文件中使用 `onLoad` 的示例：

```jsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('Script has loaded')
        }}
      />
    </>
  )
}
```

有关每个事件处理程序的更多信息，请参考 [`next/script`](/docs/pages/api-reference/components/script#onload) API 参考文档，并查看示例。

### 额外属性

有许多 DOM 属性可以分配给 `<script>` 元素，但 Script 组件并不使用这些属性，例如 [`nonce`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/nonce) 或 [自定义数据属性](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/data-*)。包含任何额外的属性都会自动将其转发到最终包含在 HTML 中的优化后的 `<script>` 元素。

以下是如何在 `app/page.tsx` 文件中使用额外属性的示例：

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

```jsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

以下是如何在 `pages/index.tsx` 文件中使用额外属性的示例：

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

```jsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```