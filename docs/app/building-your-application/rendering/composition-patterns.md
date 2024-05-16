---
title: 服务器和客户端组件组合模式
nav_title: 组合模式
description: 使用服务器和客户端组件时推荐的模式。
---

# 服务器和客户端组件组合模式

在构建 React 应用程序时，您需要考虑应用程序的哪些部分应该在服务器或客户端呈现。本页面涵盖了在使用服务器和客户端组件时的一些推荐的组合模式。

## 何时使用服务器和客户端组件？

以下是服务器和客户端组件不同用例的快速总结：

| 您需要做什么？                                                            | 服务器组件    | 客户端组件    |
| ---------------------------------------------------------------------------------- | ------------------- | ------------------- |
| 获取数据                                                                         | ✅ | ❌ |
| 直接访问后端资源（直接）                                                | ✅ | ❌ |
| 在服务器上保留敏感信息（访问令牌、API 密钥等）            | ✅ | ❌ |
| 在服务器上保留大型依赖项 / 减少客户端 JavaScript              | ✅ | ❌ |
| 添加交互性和事件监听器（`onClick()`、`onChange()` 等）             | ❌ | ✅ |
| 使用状态和生命周期效果（`useState()`、`useReducer()`、`useEffect()` 等） | ❌ | ✅ |
| 使用仅限浏览器的 API                                                              | ❌ | ✅ |
| 使用依赖于状态、效果或仅限浏览器的 API 的自定义钩子               | ❌ | ✅ |
| 使用 [React 类组件](https://react.dev/reference/react/Component)          | ❌ | ✅ |

## 服务器组件模式

在选择客户端渲染之前，您可能希望在服务器上执行一些工作，如获取数据，或访问您的数据库或后端服务。

以下是使用服务器组件时的一些常见模式：

### 在组件之间共享数据

在服务器上获取数据时，可能存在需要在不同组件之间共享数据的情况。例如，您可能有一个布局和一个页面，它们都依赖于相同的数据。

而不是使用 [React Context](https://react.dev/learn/passing-data-deeply-with-context)（在服务器上不可用）或将数据作为属性传递，您可以使用 [`fetch`](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-fetch) 或 React 的 `cache` 函数来获取需要它的组件中的相同数据，而不必担心对相同数据进行重复请求。这是因为 React 扩展了 `fetch` 以自动记忆数据请求，当 `fetch` 不可用时可以使用 `cache` 函数。

了解更多关于 React 中的 [记忆化](/docs/app/building-your-application/caching#request-memoization)。

### 确保服务器端代码不进入客户端环境

由于JavaScript模块可以在服务器和客户端组件之间共享，原本只打算在服务器上运行的代码可能会意外地进入客户端。

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

乍一看，`getData`似乎在服务器和客户端上都能工作。然而，这个函数包含了一个`API_KEY`，其编写的目的是仅在服务器上执行。

由于环境变量`API_KEY`没有以`NEXT_PUBLIC`为前缀，它是一个私有变量，只能在服务器上访问。为了防止您的环境变量泄露到客户端，Next.js将私有环境变量替换为空字符串。

因此，尽管`getData()`可以在客户端导入和执行，但它不会按预期工作。虽然将变量公开会使函数在客户端上工作，但您可能不希望将敏感信息暴露给客户端。

为了防止这类服务器代码意外地在客户端使用，我们可以使用`server-only`包，如果其他开发人员不小心将这些模块导入到客户端组件中，他们将在构建时收到错误。

要使用`server-only`，首先安装该包：

```bash filename="Terminal"
npm install server-only
```

然后将包导入到包含服务器端代码的任何模块中：

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

现在，任何导入`getData()`的客户端组件都会在构建时收到一个错误，说明此模块只能在服务器上使用。

相应的包`client-only`可以用来标记包含仅客户端代码的模块——例如，访问`window`对象的代码。

### 使用第三方包和提供商

由于服务器组件是 React 的一个新特性，生态系统中的第三方包和提供商刚开始为使用客户端专有特性（如 `useState`、`useEffect` 和 `createContext`）的组件添加 `"use client"` 指令。

今天，许多来自 `npm` 包的组件使用客户端专有特性，但尚未具有该指令。这些第三方组件将在客户端组件内按预期工作，因为它们具有 `"use client"` 指令，但它们不会在服务器组件内工作。

例如，假设您安装了假设的 `acme-carousel` 包，其中包含一个 `<Carousel />` 组件。这个组件使用了 `useState`，但它还没有 `"use client"` 指令。

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

这是因为 Next.js 不知道 `<Carousel />` 正在使用客户端专有特性。

要解决这个问题，您可以将依赖于客户端专有特性的第三方组件包装在您自己的客户端组件中：

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

现在，您可以直接在服务器组件中使用 `<Carousel />`：

```tsx filename="app/page.tsx" switcher
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>查看图片</p>

      {/* 有效，因为 Carousel 是客户端组件 */}
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

      {/* 有效，因为 Carousel 是客户端组件 */}
      <Carousel />
    </div>
  )
}
```

我们不期望您需要包装大多数第三方组件，因为您可能会在客户端组件中使用它们。然而，一个例外是提供商，因为它们依赖于 React 状态和上下文，通常需要在应用程序的根级别使用。[在下面了解更多关于第三方上下文提供商的信息](#using-context-providers)。

# 使用上下文提供者

上下文提供者通常在应用程序的根组件附近呈现，以共享全局关注点，如当前主题。由于[React 上下文](https://react.dev/learn/passing-data-deeply-with-context)在服务器组件中不受支持，尝试在应用程序的根创建上下文将导致错误：

```tsx filename="app/layout.tsx" switcher
import { createContext } from 'react'

// 在服务器组件中不支持 createContext
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

// 在服务器组件中不支持 createContext
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

要修复这个问题，在客户端组件内部创建您的上下文并呈现其提供者：

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

您的服务器组件现在将能够直接呈现您的提供者，因为它已被标记为客户端组件：

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

提供者在根处呈现后，应用程序中的所有其他客户端组件都将能够使用此上下文。

> **须知**：您应该尽可能深地在树中渲染提供者——注意 `ThemeProvider` 仅包装 `{children}` 而不是整个 `<html>` 文档。这使得 Next.js 能够更容易地优化服务器组件的静态部分。

# 库作者的建议

类似地，库作者创建供其他开发人员使用的包时，可以使用 `"use client"` 指令来标记其包的客户端入口点。这允许包的用户直接将包组件导入到他们的服务器组件中，而无需创建包装边界。

您可以通过在树中更深层次地使用['use client'](#moving-client-components-down-the-tree)来优化您的包，允许导入的模块成为服务器组件模块图的一部分。

值得注意的是，一些打包器可能会剥离 `"use client"` 指令。您可以在 [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13) 和 [Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30) 存储库中找到如何配置 esbuild 以包含 `"use client"` 指令的示例。

## 客户端组件

### 将客户端组件下移至树形结构中

为了减少客户端 JavaScript 包的大小，我们建议将客户端组件下移至组件树中。

例如，您可能有一个包含静态元素（例如徽标、链接等）的布局和一个使用状态的交互式搜索栏。

不要将整个布局做成客户端组件，而是将交互逻辑移动到客户端组件（例如 `<SearchBar />`），并保持您的布局作为服务器组件。这意味着您不必将布局的所有组件 JavaScript 发送到客户端。

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

如果您在服务器组件中获取数据，您可能希望将数据作为 props 传递给客户端组件。从服务器传递到客户端组件的 props 需要能够被 React [序列化](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values)。

如果您的客户端组件依赖于不可序列化的数据，您可以使用第三方库在客户端 [获取数据](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-client-with-third-party-libraries)，或者通过 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 在服务器上获取。

## 交错使用服务器和客户端组件

当交错使用客户端和服务器组件时，将 UI 可视化为组件树可能会很有帮助。从 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required) 开始，这是一个服务器组件，然后您可以通过添加 `"use client"` 指令，在客户端渲染某些子树组件。


在这些客户端子树中，您仍然可以嵌套服务器组件或调用服务器操作，但需要注意以下几点：

- 在请求-响应生命周期中，您的代码从服务器移动到客户端。如果您需要在客户端上访问服务器上的数据或资源，您将进行一次**新的**请求到服务器 - 而不是来回切换。
- 当向服务器发出新请求时，所有服务器组件首先被渲染，包括嵌套在客户端组件内部的那些。渲染的结果（[RSC 有效载荷](/docs/app/building-your-application/rendering/server-components#what-is-the-react-server-component-payload-rsc)）将包含客户端组件位置的引用。然后，在客户端，React 使用 RSC 有效载荷将服务器和客户端组件调和为单个树。


- 由于客户端组件在服务器组件之后渲染，您不能将服务器组件导入到客户端组件模块中（因为这将需要向服务器发出新的请求）。相反，您可以将服务器组件作为 `props` 传递给客户端组件。请参阅下面的 [不支持的模式](#不支持的模式-将服务器组件导入到客户端组件中) 和 [支持的模式](#支持的模式-将服务器组件作为 props 传递给客户端组件) 部分。

### 不支持的模式：将服务器组件导入客户端组件

以下模式是不支持的。您不能将服务器组件导入客户端组件：

```tsx filename="app/client-component.tsx" switcher highlight={4,17}
'use client'

// 您不能将服务器组件导入客户端组件。
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

// 您不能将服务器组件导入客户端组件。
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

### 支持的模式：将服务器组件作为属性传递给客户端组件

以下模式是支持的。您可以将服务器组件作为属性传递给客户端组件。

一个常见的模式是使用 React 的 `children` 属性在您的客户端组件中创建一个“插槽”。

在下面的示例中，`<ClientComponent>` 接受一个 `children` 属性：

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

在父服务器组件中，您可以同时导入 `<ClientComponent>` 和 `<ServerComponent>` 并将 `<ServerComponent>` 作为 `<ClientComponent>` 的子级传递：

```tsx filename="app/page.tsx"  highlight={11} switcher
// 这种模式有效：
// 您可以将服务器组件作为子级或属性传递给客户端组件。
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
```

```jsx filename="app/page.js" highlight={11} switcher
// 这种模式有效：
// 您可以将服务器组件作为子级或属性传递给客户端组件。
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
```

通过这种方法，`<ClientComponent>` 和 `<ServerComponent>` 是解耦的，可以独立渲染。在这种情况下，子级 `<ServerComponent>` 可以在 `<ClientComponent>` 在客户端渲染之前在服务器上渲染。

> **须知：**
>
> - “提升内容”的模式已被用来避免在父组件重新渲染时重新渲染嵌套的子组件。
> - 您不仅限于使用 `children` 属性。您可以使用任何属性来传递 JSX。