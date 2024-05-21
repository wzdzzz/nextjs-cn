---
title: 自定义 Webpack 配置
nav_title: webpack
description: 学习如何自定义 Next.js 使用的 webpack 配置
---

# 自定义 Webpack 配置

> **须知**：webpack 配置的更改不受 semver 规范的约束，因此请自行承担风险

在继续向您的应用程序添加自定义 webpack 配置之前，请确保 Next.js 已经不支持您的用例：

<AppOnly>

- [CSS 导入](/docs/app/building-your-application/styling)
- [CSS 模块](/docs/app/building-your-application/styling/css-modules)
- [Sass/SCSS 导入](/docs/app/building-your-application/styling/sass)
- [Sass/SCSS 模块](/docs/app/building-your-application/styling/sass)

</AppOnly>

<PagesOnly>

- [CSS 导入](/docs/pages/building-your-application/styling)
- [CSS 模块](/docs/pages/building-your-application/styling/css-modules)
- [Sass/SCSS 导入](/docs/pages/building-your-application/styling/sass)
- [Sass/SCSS 模块](/docs/pages/building-your-application/styling/sass)
- [自定义 babel 配置](/docs/pages/building-your-application/configuring/babel)

</PagesOnly>

一些常见功能作为插件提供：

- [@next/mdx](https://github.com/vercel/next.js/tree/canary/packages/next-mdx)
- [@next/bundle-analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)

为了扩展我们对 `webpack` 的使用，您可以在 `next.config.js` 中定义一个函数来扩展其配置，如下所示：

```js filename="next.config.js"
module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // 重要：返回修改后的配置
    return config
  },
}
```

> `webpack` 函数执行三次，两次用于服务器（nodejs / edge 运行时），一次用于客户端。这允许您使用 `isServer` 属性区分客户端和服务器端配置。

`webpack` 函数的第二个参数是一个对象，具有以下属性：

- `buildId`: `String` - 构建 ID，用作构建之间的唯一标识符
- `dev`: `Boolean` - 指示编译是否在开发环境中进行
- `isServer`: `Boolean` - 对于服务器端编译，它是 `true`，对于客户端编译，它是 `false`
- `nextRuntime`: `String | undefined` - 服务器端编译的目标运行时；要么是 `"edge"` 要么是 `"nodejs"`，对于客户端编译它是 `undefined`
- `defaultLoaders`: `Object` - Next.js 内部使用的默认加载器：
  - `babel`: `Object` - 默认的 `babel-loader` 配置

`defaultLoaders.babel` 的示例用法：

```js
// 示例配置，用于添加依赖于 babel-loader 的加载器
// 此源代码取自 @next/mdx 插件源代码：
// https://github.com/vercel/next.js/tree/canary/packages/next-mdx
module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: pluginOptions.options,
        },
      ],
    })

    return config
  },
}
```

#### `nextRuntime`

请注意，当 `nextRuntime` 是 `"edge"` 或 `"nodejs"` 时，`isServer` 是 `true`，`nextRuntime` "`edge`" 目前仅用于中间件和边缘运行时的服务器组件。