---
title: Server and Client Composition Patterns
---

当构建 React 应用程序时，您需要考虑应用程序的哪些部分应该在服务器或客户端渲染。本页涵盖了在使用服务器和客户端组件时的一些推荐组合模式。

## 何时使用服务器和客户端组件？

以下是服务器和客户端组件的不同用例的快速总结：

| 您需要做什么？                                                            | 服务器组件    | 客户端组件    |
| ---------------------------------------------------------------------------------- | ------------------- | ------------------- |
| 获取数据                                                                         | <Check size={18} /> | <Cross size={18} /> |
| 直接访问后端资源（直接）                                                | <Check size={18} /> | <Cross size={18} /> |
| 在服务器上保留敏感信息（访问令牌、API 密钥等）            | <Check size={18} /> | <Cross size={18} /> |
| 在服务器上保留大型依赖项 / 减少客户端 JavaScript              | <Check size={18} /> | <Cross size={18} /> |
| 添加交互性和事件监听器（`onClick()`、`onChange()` 等）             | <Cross size={18} /> | <Check size={18} /> |
| 使用状态和生命周期效果（`useState()`、`useReducer()`、`useEffect()` 等） | <Cross size={18} /> | <Check size={18} /> |
| 使用仅限浏览器的 API                                                              | <Cross size={18} /> | <Check size={18} /> |
| 使用依赖于状态、效果或仅限浏览器的 API 的自定义钩子               | <Cross size={18} /> | <Check size={18} /> |
| 使用 [React 类组件](https://react.dev/reference/react/Component)          | <Cross size={18} /> | <Check size={18} /> |

## 服务器组件模式

在选择客户端渲染之前，您可能希望在服务器上进行一些工作，比如获取数据，或访问您的数据库或后端服务。

以下是使用服务器组件时的一些常见模式：

### 在组件之间共享数据

在服务器上获取数据时，可能会有需要在不同组件之间共享数据的情况。例如，您可能有一个布局和一个页面，它们都依赖于相同的数据。

而不是使用 [React Context](https://react.dev/learn/passing-data-deeply-with-context)（在服务器上不可用）或将数据作为属性传递，您可以使用 [`fetch`](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-fetch) 或 React 的 `cache` 函数来获取需要它的组件中的相同数据，而不用担心为相同的数据制作重复请求。这是因为 React 扩展了 `fetch` 以自动记忆数据请求，而当 `fetch` 不可用时可以使用 `cache` 函数。

了解更多关于 React 中的 [记忆](/docs/app/building-your-application/caching#request-memoization)。

### 将仅限服务器的代码排除在客户端环境之外

由于 JavaScript 模块可以在服务器和客户端组件模块之间共享，因此只打算在服务器上运行的代码可能会潜入客户端。

例如，考虑以下数据获取函数：

```ts filename="lib/data.ts" switcher
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

```js filename="lib/data.js" switcher
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

乍一看，似乎 `getData` 在两者上都可以工作服务器和客户端。然而，这个函数包含了一个 `API_KEY`，其编写的意图是仅在服务器上执行。

由于环境变量 `API_KEY` 没有以 `NEXT_PUBLIC` 为前缀，它是一个只能在服务器上访问的私有变量。为了防止您的环境变量泄露到客户端，Next.js 会用空字符串替换私有环境变量。

因此，尽管 `getData()` 可以在客户端导入和执行，但它不会按预期工作。虽然使变量公开会使函数在客户端上工作，但您可能不想将敏感信息暴露给客户端。

为了防止这种无意中的客户端使用服务器代码，我们可以使用 `server-only` 包，如果其他开发人员不小心将这些模块导入到客户端组件中，该包会在构建时给出错误。

要使用 `server-only`，请先安装该包：

```bash filename="终端"
npm install server-only
```

然后将该包导入到包含仅限服务器代码的任何模块中：

```js filename="lib/data.js"
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

现在，任何导入 `getData()` 的客户端组件都会收到一个构建时错误，解释这个模块只能在服务器上使用。

相应的包 `client-only` 可以用来标记包含仅限客户端代码的模块——例如，访问 `window` 对象的代码。

### 使用第三方包和提供商

由于服务器组件是 React 的一个新特性，生态系统中的第三方包和提供商刚开始向使用 `useState`、`useEffect` 和 `createContext` 等仅限客户端特性的组件添加 `"use client"` 指令。

今天，许多使用 `npm` 包中的仅限客户端特性的组件还没有指令。这些第三方组件将在客户端组件内按预期工作，因为它们有 `"use client"` 指令，但它们不会在服务器组件内工作。

例如，假设您安装了假设的 `acme-carousel` 包，其中包含一个 `<Carousel />` 组件。该组件使用 `useState`，但还没有 `"use client"` 指令。

如果您在客户端组件中使用 `<Carousel />`，它将按预期工作：

```tsx filename="app/gallery.tsx" switcher
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>查看图片</button>

      {/* 有效，因为 Carousel 在客户端组件内使用 */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

```jsx filename="app/gallery.js" switcher
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>查看图片</button>

      {/* 有效，因为 Carousel 在客户端组件内使用 */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

然而，如果您尝试直接在服务器组件中使用它，您将看到一个错误：

```tsx filename="app/page.tsx" switcher
import { Carousel } from 'acme-carousel'

export default function Page() {
  return (
    <div>
      <p>查看图片</p>

      {/* 错误：`useState` 不能在服务器组件中使用 */}
      <Carousel />
    </div>
  )
}
```

```jsx filename="app/page.js" switcher
import { Carousel } from 'acme-carousel'

export default function Page() {
  return (
    <div>
      <p>查看图片</p>

      {/*  错误：`useState` 不能在服务器组件中使用 */}
      <Carousel />
    </div>
  )
}
```

这是因为# 使用第三方组件

由于 Next.js 不知道 `<Carousel />` 使用了仅限客户端的特性。

要修复这个问题，你可以将依赖于仅限客户端特性的第三方组件包装在你自己的客户端组件中：

```tsx filename="app/carousel.tsx" switcher
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

```jsx filename="app/carousel.js" switcher
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

现在，你可以直接在服务器组件中使用 `<Carousel />`：

```tsx filename="app/page.tsx" switcher
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>查看图片</p>

      {/* 可行，因为 Carousel 是客户端组件 */}
      <Carousel />
    </div>
  )
}
```

```jsx filename="app/page.js" switcher
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>查看图片</p>

      {/* 可行，因为 Carousel 是客户端组件 */}
      <Carousel />
    </div>
  )
}
```

我们不期望你需要包装大多数第三方组件，因为你很可能会在使用它们时在客户端组件内使用它们。然而，有一个例外是提供程序，因为它们依赖于 React 状态和上下文，并且通常需要在应用程序的根目录下使用。[在下面了解更多关于第三方上下文提供程序的信息](#使用上下文提供程序)。

## 使用上下文提供程序

上下文提供程序通常在应用程序的根目录附近呈现，以共享全局关注点，如当前主题。由于 [React 上下文](https://react.dev/learn/passing-data-deeply-with-context) 在服务器组件中不受支持，尝试在应用程序的根目录创建上下文将导致错误：

```tsx filename="app/layout.tsx" switcher
import { createContext } from 'react'

//  createContext 在服务器组件中不受支持
export const ThemeContext = createContext({})

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { createContext } from 'react'

//  createContext 在服务器组件中不受支持
export const ThemeContext = createContext({})

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  )
}
```

要修复这个问题，在客户端组件内创建你的上下文并呈现其提供程序：

```tsx filename="app/theme-provider.tsx" switcher
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

```jsx filename="app/theme-provider.js" switcher
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({ children }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

现在，你的服务器组件将能够直接呈现你的提供程序，因为它已经被标记为客户端组件：

```tsx filename="app/layout.tsx" switcher
import ThemeProvider from './theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import ThemeProvider from './theme-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

在根目录呈现提供程序后，应用程序中的所有其他客户端组件都将能够使用此上下文。上下文。

> **须知**：您应该尽可能深地在树中渲染提供程序——注意 `ThemeProvider` 仅包裹 `{children}` 而不是整个 `<html>` 文档。这使得 Next.js 能够更容易地优化您的服务器组件的静态部分。

#### 给库作者的建议

类似地，库作者创建供其他开发者使用的包时，可以使用 `"use client"` 指令来标记其包的客户端入口点。这允许包的用户直接将包组件导入到他们的服务器组件中，而无需创建包装边界。

您可以通过在树中更深层次地使用 ['use client'](#将客户端组件向下移动树) 来优化您的包，允许导入的模块成为服务器组件模块图的一部分。

值得注意的是，一些打包器可能会剥离 `"use client"` 指令。您可以在 [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13) 和 [Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30) 仓库中找到如何配置 esbuild 以包含 `"use client"` 指令的示例。

## 客户端组件

### 将客户端组件向下移动树

为了减少客户端 JavaScript 包的大小，我们建议将客户端组件向下移动到组件树中。

例如，您可能有一个包含静态元素（例如徽标、链接等）的布局，以及一个使用状态的交互式搜索栏。

不要将整个布局制作成客户端组件，而是将交互逻辑移动到客户端组件（例如 `<SearchBar />`），并保持您的布局作为服务器组件。这意味着您不必将布局的所有组件 JavaScript 发送到客户端。

```tsx filename="app/layout.tsx" switcher
// SearchBar 是一个客户端组件
import SearchBar from './searchbar'
// Logo 是一个服务器组件
import Logo from './logo'

// Layout 默认是一个服务器组件
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

```jsx filename="app/layout.js" switcher
// SearchBar 是一个客户端组件
import SearchBar from './searchbar'
// Logo 是一个服务器组件
import Logo from './logo'

// Layout 默认是一个服务器组件
export default function Layout({ children }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

### 从服务器向客户端组件传递 props（序列化）

如果您在服务器组件中获取数据，您可能希望将数据作为 props 传递给客户端组件。从服务器传递到客户端组件的 props 需要被 React [序列化](https://react.dev/reference/react/use-server#可序列化的参数和返回值)。

如果您的客户端组件依赖于不可序列化的数据，您可以使用第三方库在客户端 [获取数据](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#使用第三方库在客户端获取数据)，或通过 [路由处理程序](/docs/app/building-your-application/routing/route-handlers) 在服务器上获取。

## 交错服务器和客户端组件

当交错客户端和服务器组件时，将您的 UI 可视化为组件树可能很有帮助。从 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#根布局必需) 开始，这是一个服务器组件，然后您可以通过添加 `"use client"` 指令在客户端呈现组件的某些子树。

{/* 图表 - 交错 */}

在这些客户端子树中，您仍然可以嵌套服务器组件或调用服务器操作，但需要注意以下几点：

- 在请求-响应生命周期中，您的代码从服务器移动到客户端。如果您需要## 客户端组件和服务器组件的交互

在客户端上，当你需要访问服务器上的数据或资源时，你将向服务器发起一个**新的**请求 - 而不是来回切换。
- 当向服务器发起新的请求时，首先会渲染所有的服务器组件，包括嵌套在客户端组件内部的服务器组件。渲染的结果（[RSC Payload](/docs/app/building-your-application/rendering/server-components#what-is-the-react-server-component-payload-rsc)）将包含客户端组件位置的引用。然后，在客户端上，React 使用 RSC Payload 将服务器和客户端组件调和成一个单一的树。

{/* 图表 */}

- 由于客户端组件在服务器组件之后渲染，你不能将服务器组件导入到客户端组件模块中（因为这将需要重新向服务器发起请求）。相反，你可以将服务器组件作为 `props` 传递给客户端组件。请参阅下面的[不支持的模式](#不支持的模式-将服务器组件导入到客户端组件)和[支持的模式](#支持的模式-将服务器组件作为props传递给客户端组件)部分。

### 不支持的模式：将服务器组件导入到客户端组件

以下模式是不支持的。你不能将服务器组件导入到客户端组件中：

```tsx filename="app/client-component.tsx" switcher highlight={4,17}
'use client'

// 你不能将服务器组件导入到客户端组件。
import ServerComponent from './Server-Component'

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>

      <ServerComponent />
    </>
  )
}
```

```jsx filename="app/client-component.js" switcher highlight={3,13}
'use client'

// 你不能将服务器组件导入到客户端组件。
import ServerComponent from './Server-Component'

export default function ClientComponent({ children }) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>

      <ServerComponent />
    </>
  )
}
```

### 支持的模式：将服务器组件作为props传递给客户端组件

以下模式是支持的。你可以将服务器组件作为prop传递给客户端组件。

一个常见的模式是使用 React 的 `children` prop 在你的客户端组件中创建一个 _"插槽"_。

在下面的示例中，`<ClientComponent>` 接受一个 `children` prop：

```tsx filename="app/client-component.tsx" switcher highlight={6,15}
'use client'

import { useState } from 'react'

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}
    </>
  )
}
```

```jsx filename="app/client-component.js" switcher highlight={5,12}
'use client'

import { useState } from 'react'

export default function ClientComponent({ children }) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>

      {children}
    </>
  )
}
```

`<ClientComponent>` 不知道 `children` 最终将由服务器组件的结果填充。`<ClientComponent>` 唯一的责任是决定 **在哪里** 最终放置 `children`。

在父服务器组件中，你可以同时导入 `<ClientComponent>` 和 `<ServerComponent>` 并将 `<ServerComponent>` 作为 `<ClientComponent>` 的子组件传递：

```tsx filename="app/page.tsx"  highlight={11} switcher
// 这种模式可行：
// 你可以将服务器组件作为子组件或属性传递给
// 客户端组件。
import ClientComponent from './client-component'
import ServerComponent from './server-component'

// Next.js 中的页面默认为服务器组件
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  )
}
```# ServerComponent

```jsx
<ServerComponent />
</ClientComponent>
)
}
```

```jsx filename="app/page.js" highlight={11} switcher
// 这种模式是可行的：
// 你可以将服务器组件作为子组件或属性传递给客户端组件。
import ClientComponent from './client-component'
import ServerComponent from './server-component'

// 在Next.js中，页面默认为服务器组件
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  )
}
```

通过这种方法，`<ClientComponent>` 和 `<ServerComponent>` 是解耦的，可以独立渲染。在这种情况下，子组件 `<ServerComponent>` 可以在 `<ClientComponent>` 在客户端渲染之前在服务器上渲染。

> **须知：**
>
> - “提升内容”的模式已被用来避免在父组件重新渲染时重新渲染嵌套的子组件。
> - 你不限于使用 `children` 属性。你可以使用任何属性来传递 JSX。