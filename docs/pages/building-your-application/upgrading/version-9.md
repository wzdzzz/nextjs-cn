---
title: 升级到版本9
nav_title: 版本9
description: 将您的Next.js应用程序从版本8升级到版本9。
---

要升级到版本9，请运行以下命令：

```bash filename="终端"
npm i next@9
```

```bash filename="终端"
yarn add next@9
```

```bash filename="终端"
pnpm up next@9
```

```bash filename="终端"
bun add next@9
```

> **须知：** 如果您正在使用TypeScript，请确保也将`@types/react`和`@types/react-dom`升级到相应的版本。

## 在Vercel上进行生产部署

如果您之前在`vercel.json`文件中为动态路由配置了`routes`，当使用Next.js 9的新[动态路由功能](/docs/pages/building-your-application/routing/dynamic-routes)时，这些规则可以被移除。

Next.js 9的动态路由在[Vercel](https://vercel.com/)上是**自动配置的**，不需要任何`vercel.json`的自定义。

您可以在[这里](/docs/pages/building-your-application/routing/dynamic-routes)了解更多关于[动态路由]的信息。

## 检查您的自定义App文件（`pages/_app.js`）

如果您之前复制了[自定义<App>](/docs/pages/building-your-application/routing/custom-app)示例，您可能可以移除您的`getInitialProps`。

尽可能从`pages/_app.js`中移除`getInitialProps`对于利用Next.js的新特性来说很重要！

以下`getInitialProps`没有做任何事情，可以被移除：

```js
class MyApp extends App {
  // 删除我，我什么也没做！
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    // ... 等
  }
}
```
## 破坏性变更

### `@zeit/next-typescript` 已不再必要

Next.js 现在将忽略 `@zeit/next-typescript` 的使用，并警告您将其移除。请从您的 `next.config.js` 中移除此插件。

如果您的自定义 `.babelrc` 中有引用 `@zeit/next-typescript/babel`，请将其移除。

您还应该从 `next.config.js` 中移除 [`fork-ts-checker-webpack-plugin`](https://github.com/Realytics/fork-ts-checker-webpack-plugin/issues) 的使用。

TypeScript 定义已随 `next` 包发布，因此您需要卸载 `@types/next`，因为它们会发生冲突。

以下是一些不同的类型：

> 这个列表是由社区创建的，以帮助您升级，如果您发现其他差异，请向这个列表发送 pull-request，以帮助其他用户。

从：

```tsx
import { NextContext } from 'next'
import { NextAppContext, DefaultAppIProps } from 'next/app'
import { NextDocumentContext, DefaultDocumentIProps } from 'next/document'
```

到：

```tsx
import { NextPageContext } from 'next'
import { AppContext, AppInitialProps } from 'next/app'
import { DocumentContext, DocumentInitialProps } from 'next/document'
```

### `config` 键现在是一个页面上的导出项

您可能不再从页面导出一个名为 `config` 的自定义变量（即 `export { config }` / `export const config ...`）。
现在这个导出的变量被用来指定页面级别的 Next.js 配置，如 Opt-in AMP 和 API 路由特性。

您必须将非 Next.js 用途的 `config` 导出重命名为其他名称。

### `next/dynamic` 在加载时不再默认渲染 "loading..."

动态组件在加载时默认不会渲染任何内容。您仍然可以通过设置 `loading` 属性来自定义此行为：

```jsx
import dynamic from 'next/dynamic'

const DynamicComponentWithCustomLoading = dynamic(
  () => import('../components/hello2'),
  {
    loading: () => <p>Loading</p>,
  }
)
```

### `withAmp` 已被导出的配置对象取代

Next.js 现在有了页面级配置的概念，因此 `withAmp` 高阶组件已被移除以保持一致性。

可以通过在 Next.js 项目的根目录下运行以下命令来**自动迁移此变更**：

```bash filename="Terminal"
curl -L https://github.com/vercel/next-codemod/archive/master.tar.gz | tar -xz --strip=2 next-codemod-master/transforms/withamp-to-config.js npx jscodeshift -t ./withamp-to-config.js pages/**/*.js
```

要手动执行此迁移，或查看 codemod 将产生什么，请参阅以下内容：

**之前**

```jsx
import { withAmp } from 'next/amp'

function Home() {
  return <h1>My AMP Page</h1>
}

export default withAmp(Home)
// 或
export default withAmp(Home, { hybrid: true })
```

**之后**

```jsx
export default function Home() {
  return <h1>My AMP Page</h1>
}

export const config = {
  amp: true,
  // 或
  amp: 'hybrid',
}
```

### `next export` 不再将页面导出为 `index.html`

之前，导出 `pages/about.js` 会产生 `out/about/index.html`。此行为已更改，以产生 `out/about.html`。

您可以通过创建一个包含以下内容的 `next.config.js` 来恢复之前的行为：

```js filename="next.config.js"
module.exports = {
  trailingSlash: true,
}
```

### `pages/api/` 的处理方式不同

`pages/api/` 中的页面现在被视为 [API Routes](https://nextjs.org/blog/next-9#api-routes)。
此目录中的页面将不再包含客户端捆绑包。
## 弃用的功能

### `next/dynamic` 已弃用一次性加载多个模块

为了更接近 React 的实现（`React.lazy` 和 `Suspense`），`next/dynamic` 中一次性加载多个模块的能力已经被弃用。

更新依赖此行为的代码相对简单！我们提供了一个迁移应用程序的前后示例：

**之前**

```jsx
import dynamic from 'next/dynamic'

const HelloBundle = dynamic({
  modules: () => {
    const components = {
      Hello1: () => import('../components/hello1').then((m) => m.default),
      Hello2: () => import('../components/hello2').then((m) => m.default),
    }

    return components
  },
  render: (props, { Hello1, Hello2 }) => (
    <div>
      <h1>{props.title}</h1>
      <Hello1 />
      <Hello2 />
    </div>
  ),
})

function DynamicBundle() {
  return <HelloBundle title="Dynamic Bundle" />
}

export default DynamicBundle
```

**之后**

```jsx
import dynamic from 'next/dynamic'

const Hello1 = dynamic(() => import('../components/hello1'))
const Hello2 = dynamic(() => import('../components/hello2'))

function HelloBundle({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      <Hello1 />
      <Hello2 />
    </div>
  )
}

function DynamicBundle() {
  return <HelloBundle title="Dynamic Bundle" />
}

export default DynamicBundle
```