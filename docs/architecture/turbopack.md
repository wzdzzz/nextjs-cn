# Turbopack

Turbopack 是一个为 JavaScript 和 TypeScript 优化的增量打包器，使用 Rust 编写，并内置于 Next.js 中。

## 使用方法

Turbopack 可以在 Next.js 的 `pages` 和 `app` 目录中使用，以实现更快的本地开发。要启用 Turbopack，请在运行 Next.js 开发服务器时使用 `--turbo` 标志。

```json filename="package.json" highlight={3}
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 支持的功能

Next.js 中的 Turbopack 对大多数用户来说不需要任何配置，并且可以扩展以用于更高级的用例。要了解更多关于 Turbopack 当前支持的功能，请查看 [API 参考](/docs/app/api-reference/next-config-js/turbo)。

## 不支持的功能

Turbopack 目前仅支持 `next dev`，不支持 `next build`。随着我们接近稳定性，我们目前正在努力支持构建。

目前不支持以下功能：

- [`webpack()`](/docs/app/api-reference/next-config-js/webpack) 配置在 `next.config.js` 中
  - Turbopack 取代了 Webpack，这意味着不支持 Webpack 配置。
  - 要配置 Turbopack，请[查看文档](/docs/app/api-reference/next-config-js/turbo)。
  - Turbopack 支持 [Webpack 加载器](/docs/app/api-reference/next-config-js/turbo#webpack-loaders)的一个子集。
- Babel (`.babelrc`)
  - Turbopack 利用 [SWC](/docs/architecture/nextjs-compiler#why-swc) 编译器进行所有转译和优化。这意味着默认情况下不包括 Babel。
  - 如果您有一个 `.babelrc` 文件，您可能不再需要它，因为 Next.js 包括了可以启用的常见的 Babel 插件作为 SWC 转换。您可以在[编译器文档](docs/architecture/nextjs-compiler#supported-features)中了解更多信息。
  - 如果在确认您的特定用例没有被覆盖后，您仍然需要使用 Babel，您可以利用 Turbopack 的[对自定义 webpack 加载器的支持](/docs/app/api-reference/next-config-js/turbo#webpack-loaders)来包含 `babel-loader`。
- 在 App Router 中自动创建根布局。
  - 由于这种行为会更改输入文件，所以目前不支持，相反，会显示一个错误，提示您手动在所需位置添加根布局。
- `@next/font`（旧版字体支持）。
  - `@next/font` 已被 `next/font` 取代。[`next/font`](/docs/app/building-your-application/optimizing/fonts) 完全支持 Turbopack。
- `new Worker('file', import.meta.url)`。
  - 我们计划将来实现这一点。
- [Relay 转换](/docs/architecture/nextjs-compiler#relay)
  - 我们计划将来实现这一点。
- `experimental.nextScriptWorkers`
  - 我们计划将来实现这一点。
- [AMP](/docs/pages/building-your-application/configuring/amp)。
  - 我们目前不打算在 Next.js 中使用 Turbopack 支持 AMP。
- Yarn PnP
  - 我们目前不打算在 Next.js 中使用 Turbopack 支持 Yarn PnP。
- [`experimental.urlImports`](/docs/app/api-reference/next-config-js/urlImports)
  - 我们目前不打算在 Next.js 中使用 Turbopack 支持 `experimental.urlImports`。

## 生成 Trace 文件

Trace 文件允许 Next.js 团队调查和改进性能指标和内存使用情况。要生成 trace 文件，请将 `NEXT_TURBOPACK_TRACING=1` 附加到 `next dev --turbo` 命令中，这将生成一个 `.next/trace.log` 文件。

在报告与 Turbopack 性能和内存使用相关的的问题时，请在您的 [GitHub](https://github.com/vercel/next.js) 问题中包含 trace 文件。