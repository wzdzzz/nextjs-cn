---
title: Codemods
---

# Codemods

Codemods 是对代码库运行的程序化转换。这允许在不必手动检查每个文件的情况下，对大量更改进行程序化应用。

Next.js 提供了 Codemod 转换，以帮助在 API 更新或弃用时升级您的 Next.js 代码库。

## 使用方法

在终端中，导航（`cd`）到您项目的文件夹，然后运行：

```bash filename="Terminal"
npx @next/codemod <transform> <path>
```

将 `<transform>` 和 `<path>` 替换为适当的值。

- `transform` - 转换的名称
- `path` - 要转换的文件或目录
- `--dry` 进行预运行，不会编辑代码
- `--print` 打印更改后的输出以供比较

## Next.js Codemods

### 14.0

#### 迁移 `ImageResponse` 导入

##### `next-og-import`

```bash filename="Terminal"
npx @next/codemod@latest next-og-import .
```

这个 codemod 将 `next/server` 中的导入转换为 `next/og`，以用于 [动态 OG 图像生成](/docs/app/building-your-application/optimizing/metadata#dynamic-image-generation)。

例如：

```js
import { ImageResponse } from 'next/server'
```

转换为：

```js
import { ImageResponse } from 'next/og'
```

#### 使用 `viewport` 导出

##### `metadata-to-viewport-export`

```bash filename="Terminal"
npx @next/codemod@latest metadata-to-viewport-export .
```

这个 codemod 将某些视口元数据迁移到 `viewport` 导出。

例如：

```js
export const metadata = {
  title: 'My App',
  themeColor: 'dark',
  viewport: {
    width: 1,
  },
}
```

转换为：

```js
export const metadata = {
  title: 'My App',
}

export const viewport = {
  width: 1,
  themeColor: 'dark',
}
```

### 13.2

#### 使用内置字体

##### `built-in-next-font`

```bash filename="Terminal"
npx @next/codemod@latest built-in-next-font .
```

这个 codemod 卸载 `@next/font` 包，并将 `@next/font` 导入转换为内置的 `next/font`。

例如：

```js
import { Inter } from '@next/font/google'
```

转换为：

```js
import { Inter } from 'next/font/google'
```
### 13.0

#### 重命名 Next 图片导入

##### `next-image-to-legacy-image`

```bash filename="终端"
npx @next/codemod@latest next-image-to-legacy-image .
```

安全地将现有的 Next.js 10、11 或 12 应用程序中的 `next/image` 导入重命名为 Next.js 13 中的 `next/legacy/image`。同时将 `next/future/image` 重命名为 `next/image`。

例如：

```jsx filename="pages/index.js"
import Image1 from 'next/image'
import Image2 from 'next/future/image'

export default function Home() {
  return (
    <div>
      <Image1 src="/test.jpg" width="200" height="300" />
      <Image2 src="/test.png" width="500" height="400" />
    </div>
  )
}
```

转换为：

```jsx filename="pages/index.js"
// 'next/image' 变为 'next/legacy/image'
import Image1 from 'next/legacy/image'
// 'next/future/image' 变为 'next/image'
import Image2 from 'next/image'

export default function Home() {
  return (
    <div>
      <Image1 src="/test.jpg" width="200" height="300" />
      <Image2 src="/test.png" width="500" height="400" />
    </div>
  )
}
```

#### 迁移到新的图片组件

##### `next-image-experimental`

```bash filename="终端"
npx @next/codemod@latest next-image-experimental .
```

通过添加内联样式并移除未使用的属性，从 `next/legacy/image` 危险地迁移到新的 `next/image`。

- 移除 `layout` 属性并添加 `style`。
- 移除 `objectFit` 属性并添加 `style`。
- 移除 `objectPosition` 属性并添加 `style`。
- 移除 `lazyBoundary` 属性。
- 移除 `lazyRoot` 属性。

#### 从链接组件中移除 `<a>` 标签

##### `new-link`

```bash filename="终端"
npx @next/codemod@latest new-link .
```

<AppOnly>

在 [链接组件](/docs/app/api-reference/components/link) 中移除 `<a>` 标签，或者为不能自动修复的链接添加 `legacyBehavior` 属性。

</AppOnly>

<PagesOnly>

在 [链接组件](/docs/pages/api-reference/components/link) 中移除 `<a>` 标签，或者为不能自动修复的链接添加 `legacyBehavior` 属性。

</PagesOnly>

例如：

```jsx
<Link href="/about">
  <a>About</a>
</Link>
// 转换为
<Link href="/about">
  About
</Link>

<Link href="/about">
  <a onClick={() => console.log('clicked')}>About</a>
</Link>
// 转换为
<Link href="/about" onClick={() => console.log('clicked')}>
  About
</Link>
```

在自动修复无法应用的情况下，会添加 `legacyBehavior` 属性。这允许您的应用程序继续使用旧行为来处理特定链接。

```jsx
const Component = () => <a>About</a>

<Link href="/about">
  <Component />
</Link>
// 变为
<Link href="/about" legacyBehavior>
  <Component />
</Link>
```

### 11

#### 从 CRA 迁移

##### `cra-to-next`

```bash filename="终端"
npx @next/codemod cra-to-next
```

将 Create React App 项目迁移到 Next.js；创建页面路由器和必要的配置以匹配行为。最初利用客户端仅渲染，以防止由于 SSR 期间使用 `window` 而导致的兼容性破坏，并可以无缝启用，以允许逐步采用 Next.js 特定功能。

请在此讨论中分享与此转换相关的任何反馈 [在此讨论](https://github.com/vercel/next.js/discussions/25858)。

### 10

#### 添加 React 导入

##### `add-missing-react-import`

```bash filename="终端"
npx @next/codemod add-missing-react-import
```

将不导入 `React` 的文件转换为包含导入，以便新的 [React JSX 转换](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) 能够工作。

例如：

```jsx filename="my-component.js"
export default class Home extends React.Component {
  render() {
    return <div>Hello World</div>
  }
}
```

转换为：

```jsx filename="my-component.js"
import React from 'react'
export default class Home extends React.Component {
  render() {
    return <div>Hello World</div>
  }
}
```
### 9

#### 将匿名组件转换为命名组件

##### `name-default-component`

```bash filename="终端"
npx @next/codemod name-default-component
```

**版本9及以上。**

将匿名组件转换为命名组件，以确保它们可以与[Fast Refresh](https://nextjs.org/blog/next-9-4#fast-refresh)一起使用。

例如：

```jsx filename="my-component.js"
export default function () {
  return <div>Hello World</div>
}
```

转换为：

```jsx filename="my-component.js"
export default function MyComponent() {
  return <div>Hello World</div>
}
```

组件将根据文件名具有一个驼峰命名的名称，它也适用于箭头函数。

### 8

#### 将AMP HOC转换为页面配置

##### `withamp-to-config`

```bash filename="终端"
npx @next/codemod withamp-to-config
```

将`withAmp` HOC转换为Next.js 9页面配置。

例如：

```js
// 之前
import { withAmp } from 'next/amp'

function Home() {
  return <h1>我的AMP页面</h1>
}

export default withAmp(Home)
```

```js
// 之后
export default function Home() {
  return <h1>我的AMP页面</h1>
}

export const config = {
  amp: true,
}
```


### 6

#### 使用`withRouter`

##### `url-to-withrouter`

```bash filename="终端"
npx @next/codemod url-to-withrouter
```

将弃用的自动注入的顶级页面上的`url`属性转换为使用`withRouter`和它注入的`router`属性。更多信息请查看：[https://nextjs.org/docs/messages/url-deprecated](/docs/messages/url-deprecated)

例如：

```js filename="From"
import React from 'react'
export default class extends React.Component {
  render() {
    const { pathname } = this.props.url
    return <div>当前路径：{pathname}</div>
  }
}
```

```js filename="To"
import React from 'react'
import { withRouter } from 'next/router'
export default withRouter(
  class extends React.Component {
    render() {
      const { pathname } = this.props.router
      return <div>当前路径：{pathname}</div>
    }
  }
)
```

这是一个案例。所有被转换（和测试）的案例都可以在[`__testfixtures__`目录](https://github.com/vercel/next.js/tree/canary/packages/next-codemod/transforms/__testfixtures__/url-to-withrouter)中找到。