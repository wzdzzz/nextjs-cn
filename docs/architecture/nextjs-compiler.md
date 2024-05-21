# Next.js Compiler

Next.js Compiler，使用Rust编写，通过[SWC](https://swc.rs/)，允许Next.js转换和压缩您的Next.js应用程序。

使用Next.js Compiler进行编译比Babel快17倍，并且自Next.js版本12起默认启用。如果您有现有的Babel配置或使用[不支持的功能](#unsupported-features)，您的应用程序将选择不使用Next.js Compiler，而继续使用Babel。

## 为什么选择SWC？

[SWC](https://swc.rs/)是一个基于Rust的可扩展平台，用于下一代快速开发工具。

SWC可用于编译、压缩、打包等——并设计为可扩展。您可以调用它来执行代码转换（内置或自定义）。通过像Next.js这样的更高级别工具运行这些转换。

我们选择在SWC上构建有几个原因：

- **可扩展性：** SWC可以作为Next.js中的Crate使用，无需fork库或解决设计约束问题。
- **性能：** 通过切换到SWC，我们能够在Next.js中实现大约3倍的快速刷新和大约5倍的更快构建，并且仍在进行更多的优化空间。
- **WebAssembly：** Rust对WASM的支持对于支持所有可能的平台并使Next.js开发无处不在至关重要。
- **社区：** Rust社区和生态系统非常棒，并且仍在增长。

## 支持的功能

### 样式组件

我们正在努力将`babel-plugin-styled-components`移植到Next.js Compiler。

首先，更新到最新版本的Next.js：`npm install next@latest`。然后，更新您的`next.config.js`文件：

```js filename="next.config.js"
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

对于高级用例，您可以为styled-components编译配置各个属性。

> 须知：`minify`、`transpileTemplateLiterals` 和 `pure` 尚未实现。您可以在[这里](https://github.com/vercel/next.js/issues/30802)跟踪进度。`ssr` 和 `displayName` 转换是Next.js中使用`styled-components`的主要要求。

```js filename="next.config.js"
module.exports = {
  compiler: {
    // 有关选项的更多信息，请参见 https://styled-components.com/docs/tooling#babel-plugin。
    styledComponents: {
      // 默认在开发中启用，在生产中禁用以减小文件大小，
      // 设置此选项将覆盖所有环境的默认设置。
      displayName?: boolean,
      // 默认启用。
      ssr?: boolean,
      // 默认启用。
      fileName?: boolean,
      // 默认为空。
      topLevelImportPaths?: string[],
      // 默认为 ["index"]。
      meaninglessFileNames?: string[],
      // 默认启用。
      cssProp?: boolean,
      // 默认为空。
      namespace?: string,
      // 尚未支持。
      minify?: boolean,
      // 尚未支持。
      transpileTemplateLiterals?: boolean,
      // 尚未支持。
      pure?: boolean,
    },
  },
}
```
# Jest

Next.js 编译器会转译你的测试，并简化与 Next.js 一起配置 Jest 的过程，包括：

- 自动模拟 `.css`, `.module.css`（及其 `.scss` 变体）和图片导入
- 使用 SWC 自动设置 `transform`
- 加载 `.env`（及其所有变体）到 `process.env`
- 忽略 `node_modules` 从测试解析和转换
- 忽略 `.next` 从测试解析
- 加载 `next.config.js` 以获取启用实验性 SWC 转换的标志

首先，更新到 Next.js 的最新版本：`npm install next@latest`。然后，更新你的 `jest.config.js` 文件：

```js filename="jest.config.js"
const nextJest = require('next/jest')

// 提供 Next.js 应用的路径，这将启用加载 next.config.js 和 .env 文件
const createJestConfig = nextJest({ dir: './' })

// 任何你想要传递给 Jest 的自定义配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

// 以这种方式导出 createJestConfig 以确保 next/jest 可以加载 Next.js 配置，这是异步的
module.exports = createJestConfig(customJestConfig)
```

# Relay

要启用 [Relay](https://relay.dev/) 支持：

```js filename="next.config.js"
module.exports = {
  compiler: {
    relay: {
      // 这应该与 relay.config.js 匹配
      src: './',
      artifactDirectory: './__generated__',
      language: 'typescript',
      eagerEsModules: false,
    },
  },
}
```

> **须知**：在 Next.js 中，`pages` 目录中的所有 JavaScript 文件都被视为路由。因此，对于 `relay-compiler`，你需要在 `pages` 之外指定 `artifactDirectory` 配置设置，否则 `relay-compiler` 将在 `__generated__` 目录中生成文件，与源文件相邻，这个文件将被视为路由，这将破坏生产构建。

# Remove React Properties

允许移除 JSX 属性。这通常用于测试。类似于 `babel-plugin-react-remove-properties`。

要移除匹配默认正则表达式 `^data-test` 的属性：

```js filename="next.config.js"
module.exports = {
  compiler: {
    reactRemoveProperties: true,
  },
}
```

要移除自定义属性：

```js filename="next.config.js"
module.exports = {
  compiler: {
    // 在这里定义的正则表达式是在 Rust 中处理的，因此语法与
    // JavaScript `RegExp`s 不同。见 https://docs.rs/regex。
    reactRemoveProperties: { properties: ['^data-custom$'] },
  },
}
```

# Remove Console

此转换允许在应用程序代码中（非 `node_modules`）移除所有 `console.*` 调用。类似于 `babel-plugin-transform-remove-console`。

移除所有 `console.*` 调用：

```js filename="next.config.js"
module.exports = {
  compiler: {
    removeConsole: true,
  },
}
```

除了 `console.error` 之外，移除 `console.*` 输出：

```js filename="next.config.js"
module.exports = {
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
}
```

# Legacy Decorators

Next.js 将自动检测 `jsconfig.json` 或 `tsconfig.json` 中的 `experimentalDecorators`。旧版装饰器通常与 `mobx` 等旧版本的库一起使用。

这个标志仅用于与现有应用程序的兼容性。我们不建议在新应用程序中使用旧版装饰器。

首先，更新到 Next.js 的最新版本：`npm install next@latest`。然后，更新你的 `jsconfig.json` 或 `tsconfig.json` 文件：

```js
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

# importSource

Next.js 将自动检测 `jsconfig.json` 或 `tsconfig.json` 中的 `jsxImportSource` 并应用它。这通常与 [Theme UI](https://theme-ui.com) 等库一起使用。

首先，更新到 Next.js 的最新版本：`npm install next@latest`。然后，更新你的 `jsconfig.json` 或 `tsconfig.json` 文件：

```js
{
  "compilerOptions": {
    "jsxImportSource": "theme-ui"
  }
}
```
# Emotion

我们正在将 `@emotion/babel-plugin` 移植到 Next.js 编译器。

首先，更新到 Next.js 的最新版本：`npm install next@latest`。然后，更新您的 `next.config.js` 文件：

```js filename="next.config.js"
module.exports = {
  compiler: {
    emotion: boolean | {
      // 默认为 true。当构建类型为生产环境时将被禁用。
      sourceMap?: boolean,
      // 默认为 'dev-only'。
      autoLabel?: 'never' | 'dev-only' | 'always',
      // 默认为 '[local]'。
      // 允许的值：`[local]` `[filename]` 和 `[dirname]`
      // 此选项仅在 autoLabel 设置为 'dev-only' 或 'always' 时有效。
      // 它允许您定义结果标签的格式。
      // 格式是通过字符串定义的，其中变量部分用方括号 [] 包围。
      // 例如 labelFormat: "my-classname--[local]"，其中 [local] 将被替换为结果分配给的变量名称。
      labelFormat?: string,
      // 默认为 undefined。
      // 此选项允许您告诉编译器应该查看哪些导入，
      // 以确定它应该转换什么，因此如果您重新导出
      // Emotion 的导出，您仍然可以使用转换。
      importMap?: {
        [packageName: string]: {
          [exportName: string]: {
            canonicalImport?: [string, string],
            styledBaseImport?: [string, string],
          }
        }
      },
    },
  },
}
```

# Minification

自 v13 起，Next.js 默认使用 swc 编译器进行压缩。这比 Terser 快 7 倍。

如果出于某种原因仍然需要 Terser，可以进行配置。

```js filename="next.config.js"
module.exports = {
  swcMinify: false,
}
```

# Module Transpilation

Next.js 可以自动转译和捆绑本地包（如 monorepos）或外部依赖（`node_modules`）中的依赖项。这取代了 `next-transpile-modules` 包。

```js filename="next.config.js"
module.exports = {
  transpilePackages: ['@acme/ui', 'lodash-es'],
}
```

# Modularize Imports

此选项已被 Next.js 13.5 中的 [`optimizePackageImports`](/docs/app/api-reference/next-config-js/optimizePackageImports) 取代。我们建议升级以使用不需要手动配置导入路径的新选项。

# Experimental Features

## SWC Trace profiling

您可以生成 SWC 的内部转换跟踪，以 chromium 的 [trace event format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview?mode=html#%21=)。

```js filename="next.config.js"
module.exports = {
  experimental: {
    swcTraceProfiling: true,
  },
}
```

一旦启用，swc 将在 `.next/` 下生成名为 `swc-trace-profile-${timestamp}.json` 的跟踪。Chromium 的跟踪查看器（chrome://tracing/, https://ui.perfetto.dev/）或兼容的火焰图查看器（https://www.speedscope.app/）可以加载并可视化生成的跟踪。

## SWC Plugins (Experimental)

您可以配置 swc 的转换以使用 swc 的实验性插件支持，该插件以 wasm 编写，以自定义转换行为。

```js filename="next.config.js"
module.exports = {
  experimental: {
    swcPlugins: [
      [
        'plugin',
        {
          ...pluginOptions,
        },
      ],
    ],
  },
}
```

`swcPlugins` 接受一个元组数组来配置插件。插件的元组包含插件的路径和插件配置的对象。插件的路径可以是 npm 模块包名称或 `.wasm` 二进制文件的绝对路径本身。
# Unsupported Features

当您的应用程序包含一个 `.babelrc` 文件时，Next.js 将自动回退到使用 Babel 来转换单个文件。这确保了与利用自定义 Babel 插件的现有应用程序的向后兼容性。

如果您正在使用自定义 Babel 设置，请[分享您的配置](https://github.com/vercel/next.js/discussions/30174)。我们正在努力移植尽可能多的常用 Babel 转换，以及在未来支持插件。

## 版本历史

| 版本   | 变更                                                                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.1.0` | [模块转译](https://nextjs.org/blog/next-13-1#built-in-module-transpilation-stable)和[模块化导入](https://nextjs.org/blog/next-13-1#import-resolution-for-smaller-bundles)稳定。 |
| `v13.0.0` | 默认启用 SWC Minifier。                                                                                                                                                                         |
| `v12.3.0` | SWC Minifier [稳定](https://nextjs.org/blog/next-12-3#swc-minifier-stable)。                                                                                                                            |
| `v12.2.0` | 添加了对[SWC 插件](#swc-plugins-experimental)的实验性支持。                                                                                                                                     |
| `v12.1.0` | 添加了对 Styled Components、Jest、Relay、Remove React Properties、Legacy Decorators、Remove Console 和 jsxImportSource 的支持。                                                                       |
| `v12.0.0` | [引入](https://nextjs.org/blog/next-12)了 Next.js 编译器。                                                                                                                                          |

## 须知

- 当您的应用程序包含 `.babelrc` 文件时，Next.js 会自动回退到使用 Babel 来转换单个文件，以确保与现有应用程序的向后兼容性。
- 如果您使用自定义 Babel 设置，请分享您的配置，以便 Next.js 团队能够更好地支持您的需求。
- Next.js 正在不断更新，添加新特性和改进现有功能，例如模块转译、模块化导入、SWC Minifier 的稳定支持等。
- Next.js 12.0.0 版本引入了 Next.js 编译器，这是一个重要的更新，为应用程序的性能和开发体验带来了显著提升。