---
title: CSS-in-JS
description: 在 Next.js 中使用 CSS-in-JS 库
---

# CSS-in-JS

> **警告：** 目前不支持在 Server Components 中使用需要运行时 JavaScript 的 CSS-in-JS 库。使用 CSS-in-JS 与 React 的新特性（如 Server Components 和 Streaming）需要库作者支持 React 的最新版本，包括 [并发渲染](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)。
>
> 我们正在与 React 团队合作开发上游 API，以处理 CSS 和 JavaScript 资源，并支持 React Server Components 和流式架构。

在 `app` 目录中的客户端组件支持以下库（按字母顺序）：

- [`chakra-ui`](https://chakra-ui.com/getting-started/nextjs-app-guide)
- [`@fluentui/react-components`](https://react.fluentui.dev/?path=/docs/concepts-developer-server-side-rendering-next-js-appdir-setup--page)
- [`kuma-ui`](https://kuma-ui.com)
- [`@mui/material`](https://mui.com/material-ui/guides/next-js-app-router/)
- [`@mui/joy`](https://mui.com/joy-ui/integrations/next-js-app-router/)
- [`pandacss`](https://panda-css.com)
- [`styled-jsx`](#styled-jsx)
- [`styled-components`](#styled-components)
- [`stylex`](https://stylexjs.com)
- [`tamagui`](https://tamagui.dev/docs/guides/next-js#server-components)
- [`tss-react`](https://tss-react.dev/)
- [`vanilla-extract`](https://vanilla-extract.style)
- [`ant-design`](https://ant.design/docs/react/use-with-next#using-app-router)

以下库目前正在进行支持工作：

- [`emotion`](https://github.com/emotion-js/emotion/issues/2928)

> **须知**：我们正在测试不同的 CSS-in-JS 库，并将在支持 React 18 特性和/或 `app` 目录的库中添加更多示例。

如果您想为 Server Components 设置样式，我们建议使用 [CSS Modules](/docs/app/building-your-application/styling/css-modules) 或其他输出 CSS 文件的解决方案，如 PostCSS 或 [Tailwind CSS](/docs/app/building-your-application/styling/tailwind-css)。

## 在 `app` 中配置 CSS-in-JS

配置 CSS-in-JS 是一个三步的可选过程，涉及：

1. **样式注册表**，用于收集渲染中的所有 CSS 规则。
2. 新的 `useServerInsertedHTML` 钩子，在可能使用它们的任何内容之前注入规则。
3. 在初始服务器端渲染期间，使用样式注册表包装您的应用程序的客户端组件。### `styled-jsx`

在客户端组件中使用 `styled-jsx` 需要使用 `v5.1.0` 版本。首先，创建一个新的注册表：

```tsx filename="app/registry.tsx" switcher
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // 仅使用惰性初始状态创建一次样式表
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
```

```jsx filename="app/registry.js" switcher
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({ children }) {
  // 仅使用惰性初始状态创建一次样式表
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
```

然后，用注册表包裹你的 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)：

```tsx filename="app/layout.tsx" switcher
import StyledJsxRegistry from './registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import StyledJsxRegistry from './registry'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
```

[在这里查看示例](https://github.com/vercel/app-playground/tree/main/app/styling/styled-jsx)。

### Styled Components

以下是如何配置 `styled-components@6` 或更新版本的示例：

首先，在 `next.config.js` 中启用 styled-components。

```js filename="next.config.js"
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

然后，使用 `styled-components` API 创建一个全局注册表组件来收集渲染期间生成的所有 CSS 样式规则，以及一个返回这些规则的函数。然后使用 `useServerInsertedHTML` 钩子将注册表中收集的样式注入到根布局的 `<head>` HTML 标签中。

```tsx filename="lib/registry.tsx" switcher
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // 仅使用惰性初始状态创建一次样式表
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

# lib/registry.js

```jsx
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({ children }) {
  // 仅使用懒惰的初始状态创建一次样式表
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

# app/layout.tsx

```tsx
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

# app/layout.js

```jsx
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

[查看示例](https://github.com/vercel/app-playground/tree/main/app/styling/styled-components)。

> **须知**：
>
> - 在服务器端渲染期间，样式将被提取到全局注册表并刷新到 HTML 的 `<head>` 中。这确保了样式规则在可能使用它们的任何内容之前放置。将来，我们可能会使用即将推出的 React 特性来确定注入样式的位置。
> - 在流式传输期间，每个块的样式将被收集并追加到现有样式中。客户端侧水合完成后，`styled-components` 将像往常一样接管并注入任何进一步的动态样式。
> - 我们特别在树的顶层使用客户端组件作为样式注册表，因为这样提取 CSS 规则更有效。它避免了在后续服务器渲染中重新生成样式，并将它们从服务器组件有效载荷中发送出去。
> - 对于需要配置 styled-components 编译的个别属性的高级用例，您可以阅读我们的 [Next.js styled-components API 参考](/docs/architecture/nextjs-compiler#styled-components) 以了解更多信息。

**App** 标签内容结束。

**Pages** 标签内容开始。

<details>
  <summary>示例</summary>

- [Styled JSX](https://github.com/vercel/next.js/tree/canary/examples/with-styled-jsx)
- [Styled Components](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components)
- [Emotion](https://github.com/vercel/next.js/tree/canary/examples/with-emotion)
- [Linaria](https://github.com/vercel/next.js/tree/canary/examples/with-linaria)
- [Styletron](https://github.com/vercel/next.js/tree/canary/examples/with-styletron)
- [Cxs](https://github.com/vercel/next.js/tree/canary/examples/with-cxs)
- [Fela](https://github.com/vercel/next.js/tree/canary/examples/with-fela)
- [Stitches](https://github.com/vercel/next.js/tree/canary/examples/with-stitches)

</details>

可以使用任何现有的 CSS-in-JS 解决方案。最简单的一个是内联样式：

```jsx
function HiThere() {
  return <p style={{ color: 'red' }}>hi there</p>
}

export default HiThere
```

**Pages** 标签内容结束。

# 集成CSS

我们捆绑了[styled-jsx](https://github.com/vercel/styled-jsx)以提供对隔离作用域CSS的支持。
我们的目标是支持类似于Web Components的"shadow CSS"，不幸的是[它们不支持服务器渲染，并且仅限于JS](https://github.com/w3c/webcomponents/issues/71)。

请参阅上面的示例，了解其他流行的CSS-in-JS解决方案（如Styled Components）。

使用`styled-jsx`的组件如下所示：

```jsx
function HelloWorld() {
  return (
    <div>
      Hello world
      <p>scoped!</p>
      <style jsx>{`
        p {
          color: blue;
        }
        div {
          background: red;
        }
        @media (max-width: 600px) {
          div {
            background: blue;
          }
        }
      `}</style>
      <style global jsx>{`
        body {
          background: black;
        }
      `}</style>
    </div>
  )
}

export default HelloWorld
```

有关更多示例，请参见[styled-jsx文档](https://github.com/vercel/styled-jsx)。

### 禁用JavaScript

是的，如果您禁用了JavaScript，CSS仍将在生产构建中加载（`next start`）。在开发过程中，我们需要启用JavaScript，以提供最佳的开发体验，包括[Fast Refresh](https://nextjs.org/blog/next-9-4#fast-refresh)。

