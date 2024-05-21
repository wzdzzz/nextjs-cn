---
title: 客户端组件
description: 学习如何使用客户端组件在客户端渲染应用程序的部分内容。
---
# 客户端组件

客户端组件允许您编写交互式用户界面，这些界面可以在服务器上进行[预渲染](https://github.com/reactwg/server-components/discussions/4)，并可以使用客户端JavaScript在浏览器中运行。

本页将介绍客户端组件的工作原理、它们的渲染方式以及您可能使用它们的情况。

## 客户端渲染的优势

在客户端进行渲染工作有几个优势，包括：

- **交互性**：客户端组件可以使用状态、效果和事件监听器，这意味着它们可以为用户提供即时反馈并更新用户界面。
- **浏览器API**：客户端组件可以访问浏览器API，如[地理位置](https://developer.mozilla.org/docs/Web/API/Geolocation_API)或[localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage)。

## 在Next.js中使用客户端组件

要使用客户端组件，您可以在文件顶部，位于您的导入语句之上，添加React [`"use client"` 指令](https://react.dev/reference/react/use-client)。

`"use client"` 用于声明服务器和客户端组件模块之间的[边界](/docs/app/building-your-application/rendering#network-boundary)。这意味着通过在文件中定义 `"use client"`，所有导入到其中的其他模块，包括子组件，都被视为客户端捆绑包的一部分。

```tsx filename="app/counter.tsx" highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>您点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点击我</button>
    </div>
  )
}
```

```jsx filename="app/counter.js" highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>您点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点击我</button>
    </div>
  )
}
```

下面的图表显示，如果在未定义 `"use client"` 指令的情况下在嵌套组件（`toggle.js`）中使用 `onClick` 和 `useState`，将会导致错误。这是因为默认情况下，App Router中的所有组件都是服务器组件，这些API在服务器组件中不可用。通过在 `toggle.js` 中定义 `"use client"` 指令，您可以告诉React进入客户端边界，这些API在客户端边界中是可用的。

<img
  alt="使用客户端指令和网络边界"
  src="https://nextjs.org/_next/image?url=/docs/light/use-client-directive.png&w=3840&q=75"
  srcDark="/docs/dark/use-client-directive.png"
  width="1600"
  height="1320"
/>

> **定义多个 `use client` 入口点**：
>
> 您可以在React组件树中定义多个 "use client" 入口点。这允许您将应用程序分割成多个客户端捆绑包。
>
> 然而，不需要在每个需要在客户端渲染的组件中定义 `"use client"`。一旦您定义了边界，所有导入到其中的子组件和模块都被视为客户端捆绑包的一部分。

## 客户端组件是如何渲染的？

在 Next.js 中，客户端组件的渲染方式取决于请求是完整的页面加载（初次访问您的应用程序或由浏览器刷新触发的页面重新加载）还是后续导航。

### 完整页面加载

为了优化初始页面加载，Next.js 将使用 React 的 API 在服务器上为客户端和服务器端组件渲染静态 HTML 预览。这意味着，当用户首次访问您的应用程序时，他们将立即看到页面的内容，而不必等待客户端下载、解析和执行客户端组件 JavaScript 捆绑包。

在服务器上：

1. React 将服务器组件渲染为一种称为 [**React 服务器组件有效载荷 (RSC Payload)**](/docs/app/building-your-application/rendering/server-components#what-is-the-react-server-component-payload-rsc) 的特殊数据格式，其中包含对客户端组件的引用。
2. Next.js 使用 RSC Payload 和客户端组件 JavaScript 指令在服务器上为路由渲染 **HTML**。

然后在客户端：

1. 使用 HTML 立即显示路由的快速非交互式初始预览。
2. 使用 React 服务器组件有效载荷来协调客户端和服务器组件树，并更新 DOM。
3. 使用 JavaScript 指令来 [hydrate](https://react.dev/reference/react-dom/client/hydrateRoot) 客户端组件并使其 UI 交互式。

> **什么是 hydration？**
>
> Hydration 是将事件监听器附加到 DOM 的过程，以使静态 HTML 交互式。在幕后，hydration 是使用 [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) React API 完成的。

### 后续导航

在后续导航中，客户端组件完全在客户端上渲染，没有服务器渲染的 HTML。

这意味着客户端组件 JavaScript 捆绑包被下载和解析。一旦捆绑包准备好，React 将使用 [RSC Payload](/docs/app/building-your-application/rendering/server-components#what-is-the-react-server-component-payload-rsc) 来协调客户端和服务器组件树，并更新 DOM。

## 返回服务器环境

有时，在您声明了 `"use client"` 边界之后，您可能想要返回到服务器环境。例如，您可能想要减少客户端捆绑包的大小，在服务器上获取数据，或者使用仅在服务器上可用的 API。

即使代码理论上嵌套在客户端组件内部，您也可以通过交错客户端和服务器组件以及 [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 来保持服务器上的代码。有关更多信息，请参见 [Composition Patterns](/docs/app/building-your-application/rendering/composition-patterns) 页面。