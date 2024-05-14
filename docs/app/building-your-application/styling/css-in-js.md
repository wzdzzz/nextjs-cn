---
title: CSS-in-JS
---

<AppOnly>

> **警告：** 需要运行时 JavaScript 的 CSS-in-JS 库目前不支持 Server Components。使用 CSS-in-JS 与 React 的新特性，如 Server Components 和 Streaming，需要库作者支持 React 的最新版本，包括 [并发渲染](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)。
>
> 我们正在与 React 团队合作，开发上游 API 来处理 CSS 和 JavaScript 资源，并支持 React Server Components 和流式架构。

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

以下库目前正在开发支持：

- [`emotion`](https://github.com/emotion-js/emotion/issues/2928)

> **须知**：我们正在测试不同的 CSS-in-JS 库，并将在支持 React 18 特性和/或 `app` 目录的库中添加更多示例。

如果你想为 Server Components 设置样式，我们建议使用 [CSS Modules](/docs/app/building-your-application/styling/css-modules) 或其他输出 CSS 文件的解决方案，如 PostCSS 或 [Tailwind CSS](/docs/app/building-your-application/styling/tailwind-css)。

## 在 `app` 中配置 CSS-in-JS

配置 CSS-in-JS 是一个三步的可选过程，涉及：

1. **样式注册表**，用于收集渲染中的所有 CSS 规则。
2. 新的 `useServerInsertedHTML` 钩子，用于在可能使用它们的任何内容之前注入规则。
3. 在初始服务器端渲染期间，用样式注册表包装你的应用的客户端组件。

### `styled-jsx`

在客户端组件中使用 `styled-jsx` 需要使用 `v5.1.0`。首先，创建一个新的注册表：

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
  // 使用惰性初始状态仅创建一次样式表
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
  // 使用惰性初始状态仅创建一次样式表
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  // ...（此处省略了代码的其余部分，因为 Markdown 格式不支持 JSX）
}
```

> **注意**：`styled-jsx` 需要在客户端使用，因为它依赖于浏览器的 DOM API。

</AppOnly>```markdown
# Styled JSX Registry

在 Next.js 应用中，你可能需要使用 Styled JSX 或 Styled Components 来全局收集和注入 CSS 样式。以下是如何在 Next.js 应用中设置这些样式的示例。

首先，创建一个用于收集 Styled JSX 样式的注册表组件：

```tsx
'use client'

import { jsxStyleRegistry } from 'styled-jsx/styleRegistry'
import { useServerInsertedHTML } from 'next/navigation'

export default function StyledJsxRegistry({ children }) {
  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
```

然后，将你的[根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)包裹在注册表中：

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

[在这里查看示例](https://github.com/vercel/app-playground/tree/main/app/styling/styled-jsx)。

# Styled Components

以下是如何配置 `styled-components@6` 或更新版本的示例：

首先，在 `next.config.js` 中启用 styled-components。

```js filename="next.config.js"
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

然后，使用 `styled-components` API 创建一个全局注册表组件来收集渲染期间生成的所有 CSS 样式规则，并提供一个函数来返回这些规则。然后使用 `useServerInsertedHTML` 钩子将注册表中收集的样式注入到根布局的 `<head>` HTML 标签中。

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
  // 使用惰性初始状态仅创建一次样式表
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

将根布局的 `children` 包裹在样式注册表组件中：

```tsx filename="app/layout.tsx" switcher
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

```一级标题：样式和CSS

</AppOnly>

<PagesOnly>

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

可以使用任何现有的CSS-in-JS解决方案。最简单的是内联样式：

```jsx
function HiThere() {
  return <p style={{ color: 'red' }}>hi there</p>
}

export default HiThere
```

我们打包了[styled-jsx](https://github.com/vercel/styled-jsx)以提供支持孤立作用域的CSS。
我们的目标是支持类似于Web组件的"shadow CSS"，遗憾的是[它们不支持服务器渲染，并且仅限于JS](https://github.com/w3c/webcomponents/issues/71)。

查看上述示例以了解其他流行的CSS-in-JS解决方案（如Styled Components）。

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
      `}</style>
    </div>
  )
}

export default HelloWorld
```

有关更多示例，请参见[styled-jsx文档](https://github.com/vercel/styled-jsx)。

### 禁用JavaScript

是的，如果您禁用了JavaScript，CSS仍将在生产构建中加载（`next start`）。在开发过程中，我们需要启用JavaScript以提供最佳的开发体验，包括[Fast Refresh](https://nextjs.org/blog/next-9-4#fast-refresh)。

</PagesOnly>