---
title: 版本 11
description: 将您的 Next.js 应用程序从版本 10 升级到版本 11。
---

要升级到版本 11，请运行以下命令：

```bash filename="终端"
npm i next@11 react@17 react-dom@17
```

```bash filename="终端"
yarn add next@11 react@17 react-dom@17
```

```bash filename="终端"
pnpm up next@11 react@17 react-dom@17
```

```bash filename="终端"
bun add next@11 react@17 react-dom@17
```

> **须知：** 如果您正在使用 TypeScript，请确保也将 `@types/react` 和 `@types/react-dom` 升级到相应的版本。

### Webpack 5

Webpack 5 现在是所有 Next.js 应用程序的默认配置。如果您没有自定义 webpack 配置，您的应用程序已经在使用 webpack 5。如果您有自定义 webpack 配置，可以参考 [Next.js webpack 5 文档](/docs/messages/webpack5) 进行升级指导。

### 清理 `distDir` 现在是默认行为

构建输出目录（默认为 `.next`）现在默认情况下会被清除，除了 Next.js 缓存之外。您可以查看 [清理 `distDir` RFC](https://github.com/vercel/next.js/discussions/6009) 以获取更多信息。

如果您的应用程序之前依赖于此行为，您可以通过在 `next.config.js` 中添加 `cleanDistDir: false` 标志来禁用此新默认行为。

### `PORT` 现在支持 `next dev` 和 `next start`

Next.js 11 支持使用 `PORT` 环境变量来设置应用程序运行的端口。尽管仍然推荐使用 `-p`/`--port`，但如果由于某种原因您无法使用 `-p`，现在可以使用 `PORT` 作为替代方案：

示例：

```
PORT=4000 next start
```

### `next.config.js` 自定义以导入图片

Next.js 11 支持使用 `next/image` 静态导入图片。这项新功能依赖于能够处理图片导入。如果您之前添加了 `next-images` 或 `next-optimized-images` 包，您可以要么迁移到使用 `next/image` 的新内置支持，要么禁用该特性：

```js filename="next.config.js"
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```

### 从 `pages/_app.js` 中移除 `super.componentDidCatch()`

`next/app` 组件的 `componentDidCatch` 在 Next.js 9 中已被弃用，因为它不再需要，并且自此以后一直无操作。在 Next.js 11 中，它已被移除。

如果您的 `pages/_app.js` 有一个自定义的 `componentDidCatch` 方法，您可以移除 `super.componentDidCatch`，因为它不再需要。

### 从 `pages/_app.js` 中移除 `Container`

这个导出在 Next.js 9 中已被弃用，因为它不再需要，并且在开发期间一直带有警告。在 Next.js 11 中它已被移除。

如果您的 `pages/_app.js` 从 `next/app` 导入了 `Container`，您可以移除 `Container`，因为它已被移除。在 [文档](/docs/messages/app-container-deprecated) 中了解更多。

### 从页面组件中移除 `props.url` 使用

这个属性在 Next.js 4 中已被弃用，并且自此以后在开发期间一直显示警告。随着 `getStaticProps` / `getServerSideProps` 的引入，这些方法已经不允许使用 `props.url`。在 Next.js 11 中，它被完全移除。

您可以在 [文档](/docs/messages/url-deprecated) 中了解更多。

### 从 `next/image` 中移除 `unsized` 属性

`next/image` 上的 `unsized` 属性在 Next.js 10.0.1 中已被弃用。您可以改用 `layout="fill"`。在 Next.js 11 中 `unsized` 已被移除。

### 从 `next/dynamic` 中移除 `modules` 属性

`next/dynamic` 的 `modules` 和 `render` 选项在 Next.js 9.5 中已被弃用。这样做是为了使 `next/dynamic` API 更接近 `React.lazy`。在 Next.js 11 中，`modules` 和 `render` 选项已被移除。

自从 Next.js 8 以来，这个选项就没有在文档中提到，所以您的应用程序使用它的可能性较小。

如果您的应用程序确实使用了 `modules` 和 `render`，您可以查看 [文档](/docs/messages/next-dynamic-modules)。
### 移除 `Head.rewind`

`Head.rewind` 自 Next.js 9.5 起就已无操作，而在 Next.js 11 中已被移除。您可以安全地移除对 `Head.rewind` 的使用。

### 默认排除 Moment.js 语言环境

Moment.js 默认包含了许多语言环境的翻译。Next.js 现在会自动默认排除这些语言环境，以优化使用 Moment.js 的应用程序的打包大小。

要加载特定的语言环境，请使用以下代码片段：

```js
import moment from 'moment'
import 'moment/locale/ja'

moment.locale('ja')
```

如果您不希望使用这种新默认行为，可以通过在 `next.config.js` 中添加 `excludeDefaultMomentLocales: false` 来选择退出，但请注意，强烈建议不要禁用这种新的优化，因为它显著减少了 Moment.js 的大小。

### 更新 `router.events` 的使用

如果您在渲染期间访问 `router.events`，在 Next.js 11 中，`router.events` 在预渲染期间不再提供。确保您在 `useEffect` 中访问 `router.events`：

```js
useEffect(() => {
  const handleRouteChange = (url, { shallow }) => {
    console.log(
      `App is changing to ${url} ${
        shallow ? 'with' : 'without'
      } shallow routing`
    )
  }

  router.events.on('routeChangeStart', handleRouteChange)

  // 如果组件被卸载，使用 `off` 方法从事件中取消订阅：
  return () => {
    router.events.off('routeChangeStart', handleRouteChange)
  }
}, [router])
```

如果您的应用程序使用了 `router.router.events`，这是一个不是公开属性的内部属性，请确保也使用 `router.events`。

### React 16 升级到 17

React 17 引入了一个新的 [JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)，它将长期以来 Next.js 的特性带到了更广泛的 React 生态系统中：在使用 JSX 时不必 `import React from 'react'`。当使用 React 17 时，Next.js 将自动使用新的转换。这个转换不会使 `React` 变量全局化，这是之前 Next.js 实现的一个意外副作用。[有一个 codemod 可用](/docs/pages/building-your-application/upgrading/codemods#add-missing-react-import) 来自动修复您不小心在没有导入的情况下使用了 `React` 的情况。

大多数应用程序已经使用了最新版本的 React，随着 Next.js 11 的发布，React 的最低版本已更新为 17.0.2。

要升级，您可以运行以下命令：

```
npm install react@latest react-dom@latest
```

或者使用 `yarn`：

```
yarn add react@latest react-dom@latest
```