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

# 脚本优化

<AppOnly>


### 布局脚本

要为多个路由加载第三方脚本，导入 `next/script` 并将脚本直接包含在您的布局组件中：

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

要为所有路由加载第三方脚本，导入 `next/script` 并将脚本直接包含在您的根布局中：

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

要为所有路由加载第三方脚本，导入 `next/script` 并将脚本直接包含在您的自定义 `_app` 中：

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

当访问应用程序中的**任何**路由时，此脚本将加载并执行。Next.js 将确保脚本**只加载一次**，即使用户在多个页面之间导航。

> **建议**：我们建议只在特定页面或布局中包含第三方脚本，以最小化对性能的不必要影响。

### 策略

尽管 `next/script` 的默认行为允许您在任何页面或布局中加载第三方脚本，但您可以通过使用 `strategy` 属性来微调其加载行为：

- `beforeInteractive`：在任何 Next.js 代码之前以及页面水合之前加载脚本。
- `afterInteractive`：（默认）在页面上发生一些水合后尽早加载脚本。
- `lazyOnload`：在浏览器空闲时间晚些时候加载脚本。
- `worker`：（实验性）在 Web Worker 中加载脚本。

请参阅 [`next/script`](/docs/app/api-reference/components/script#strategy) API 参考文档，以了解更多关于每种策略及其用例的信息。
### 使用 Web Worker 卸载脚本（实验性）

> **警告：** `worker` 策略目前还不稳定，且还不适用于 [`app`](/docs/app/building-your-application/routing/defining-routes) 目录。请谨慎使用。

使用 `worker` 策略的脚本将被卸载并在 [Partytown](https://partytown.builder.io/) 的 Web Worker 中执行。这可以通过将主线程专门用于应用程序代码的其余部分来提高您的网站性能。

此策略仍处于实验阶段，只有在 `next.config.js` 中启用了 `nextScriptWorkers` 标志才能使用：

```js filename="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

然后，运行 `next`（通常是 `npm run dev` 或 `yarn dev`），Next.js 将引导您完成安装所需包的步骤：

```bash filename="Terminal"
npm run dev
```

您将看到类似这样的指令：请通过运行 `npm install @builder.io/partytown` 来安装 Partytown。

一旦设置完成，定义 `strategy="worker"` 将自动在您的应用程序中实例化 Partytown 并卸载脚本到 Web Worker。

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

在 Web Worker 中加载第三方脚本时需要考虑一些权衡。有关更多信息，请参见 Partytown 的 [权衡](https://partytown.builder.io/trade-offs) 文档。

### 内联脚本

Script 组件也支持内联脚本，即不是从外部文件加载的脚本。它们可以通过将 JavaScript 放在花括号内来编写：

```jsx
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

或者使用 `dangerouslySetInnerHTML` 属性：

```jsx
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

> **警告**：为了 Next.js 能够跟踪和优化脚本，内联脚本必须分配一个 `id` 属性。
### 执行额外的代码

事件处理器可以与Script组件一起使用，在特定事件发生后执行额外的代码：

- `onLoad`：在脚本加载完成后执行代码。
- `onReady`：在脚本加载完成后以及每次组件挂载时执行代码。
- `onError`：如果脚本加载失败，则执行代码。

**App**：

这些处理器只有在`next/script`被导入并用在定义了`"use client"`作为代码第一行的[客户端组件](/docs/app/building-your-application/rendering/client-components)内部时才会工作：

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

请参阅[`next/script`](/docs/app/api-reference/components/script#onload) API参考，以了解更多关于每个事件处理器的信息并查看示例。

**Pages**：

这些处理器只有在`next/script`被导入并用在定义了`"use client"`作为代码第一行的[客户端组件](/docs/app/building-your-application/rendering/client-components)内部时才会工作：

```tsx filename="pages/index.tsx" switcher
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

```jsx filename="pages/index.js" switcher
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

请参阅[`next/script`](/docs/pages/api-reference/components/script#onload) API参考，以了解更多关于每个事件处理器的信息并查看示例。

须知：以上代码示例中的`src`属性应该指向实际的脚本文件URL。
### 附加属性

有许多DOM属性可以分配给`<script>`元素，这些属性不会被Script组件使用，例如[`nonce`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/nonce)或[自定义数据属性](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/data-*)。包含任何额外的属性将自动将其转发到最终包含在HTML中的优化后的`<script>`元素。

**App**

```tsx filename="app/page.tsx" switcher
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

```jsx filename="app/page.js" switcher
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

**Pages**

```tsx filename="pages/index.tsx" switcher
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

```jsx filename="pages/index.js" switcher
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