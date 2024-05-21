---
title: turbo (Experimental)
nav_title: turbo
description: 使用特定于 Turbopack 的选项配置 Next.js
---

{/* 此文档的内容在应用和页面路由之间共享。您可以使用 `<PagesOnly>Content</PagesOnly>` 组件添加特定于页面路由的内容。任何共享的内容都不应被包装在组件中。 */}

Turbopack 可以定制以转换不同的文件并改变模块解析的方式。

> **须知**：
>
> - 这些特性是实验性的，并且只有在使用 `next --turbo` 时才会工作。
> - 对于 Next.js 的 Turbopack 不需要加载器或加载器配置来实现内置功能。Turbopack 内置支持 css 和编译现代 JavaScript，因此如果您使用 `@babel/preset-env`，则无需 `css-loader`、`postcss-loader` 或 `babel-loader`。

## webpack 加载器

如果您需要超出内置功能范围的加载器支持，许多 webpack 加载器已经与 Turbopack 兼容。目前有一些限制：

- 仅实现了 webpack 加载器 API 的核心子集。目前，对于一些流行的加载器来说，覆盖范围已经足够，我们将在未来扩展我们的 API 支持。
- 仅支持返回 JavaScript 代码的加载器。当前不支持转换样式表或图像等文件的加载器。
- 传递给 webpack 加载器的选项必须是纯 JavaScript 原语、对象和数组。例如，不能将 `require()` 的插件模块作为选项值传递。

要配置加载器，在 `next.config.js` 中添加您已安装的加载器的名称和任何选项，将文件扩展名映射到加载器列表：

```js filename="next.config.js"
module.exports = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}
```

> **须知**：在 Next.js 版本 13.4.4 之前，`experimental.turbo.rules` 被称为 `experimental.turbo.loaders`，并且只接受像 `.mdx` 这样的文件扩展名，而不是 `*.mdx`。

### 支持的加载器

以下是已经测试与 Turbopack 的 webpack 加载器实现兼容的加载器：

- [`babel-loader`](https://www.npmjs.com/package/babel-loader)
- [`@svgr/webpack`](https://www.npmjs.com/package/@svgr/webpack)
- [`svg-inline-loader`](https://www.npmjs.com/package/svg-inline-loader)
- [`yaml-loader`](https://www.npmjs.com/package/yaml-loader)
- [`string-replace-loader`](https://www.npmjs.com/package/string-replace-loader)
- [`raw-loader`](https://www.npmjs.com/package/raw-loader)
- [`sass-loader`](https://www.npmjs.com/package/sass-loader)

## 解析别名

通过 `next.config.js`，Turbopack 可以配置修改模块解析的别名，类似于 webpack 的 [`resolve.alias`](https://webpack.js.org/configuration/resolve/#resolvealias) 配置。

要配置解析别名，在 `next.config.js` 中将导入的模式映射到它们的新目的地：

```js filename="next.config.js"
module.exports = {
  experimental: {
    turbo: {
      resolveAlias: {
        underscore: 'lodash',
        mocha: { browser: 'mocha/browser-entry.js' },
      },
    },
  },
}
```

这将 `underscore` 包的导入别名为 `lodash` 包。换句话说，`import underscore from 'underscore'` 将加载 `lodash` 模块而不是 `underscore`。

Turbopack 还支持通过此字段进行条件别名，类似于 Node.js 的 [条件导出](https://nodejs.org/docs/latest-v18.x/api/packages.html#conditional-exports)。目前只支持 `browser` 条件。在上面的例子中，当 Turbopack 针对浏览器环境时，`mocha` 模块的导入将被别名为 `mocha/browser-entry.js`。
## 解析扩展

通过 `next.config.js`，Turbopack 可以配置为解析具有自定义扩展名的模块，类似于 webpack 的 [`resolve.extensions`](https://webpack.js.org/configuration/resolve/#resolveextensions) 配置。

要配置解析扩展，请在 `next.config.js` 中使用 `resolveExtensions` 字段：

```js filename="next.config.js"
module.exports = {
  experimental: {
    turbo: {
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
    },
  },
}
```

这将用提供的列表覆盖原始的解析扩展。请确保包含默认扩展。

有关如何将您的应用程序从 webpack 迁移到 Turbopack 的更多信息和指导，请参阅 [Turbopack 的 webpack 兼容性文档](https://turbo.build/pack/docs/migrating-from-webpack)。