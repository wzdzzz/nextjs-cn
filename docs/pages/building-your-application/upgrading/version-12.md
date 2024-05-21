---
title: 版本 12
description: 将您的 Next.js 应用程序从版本 11 升级到版本 12。
---

要升级到版本 12，请运行以下命令：

```bash filename="终端"
npm i next@12 react@17 react-dom@17 eslint-config-next@12
```

```bash filename="终端"
yarn add next@12 react@17 react-dom@17 eslint-config-next@12
```

```bash filename="终端"
pnpm up next@12 react@17 react-dom@17 eslint-config-next@12
```

```bash filename="终端"
bun add next@12 react@17 react-dom@17 eslint-config-next@12
```

> **须知：** 如果您正在使用 TypeScript，请确保也升级 `@types/react` 和 `@types/react-dom` 到相应的版本。

### 升级到 12.2

[中间件](/docs/messages/middleware-upgrade-guide) - 如果您在 `12.2` 之前使用了中间件，请查看 [升级指南](/docs/messages/middleware-upgrade-guide) 以获取更多信息。

### 升级到 12.0

[最小 Node.js 版本](https://nodejs.org/en/) - 最小 Node.js 版本已从 `12.0.0` 提升到 `12.22.0`，这是 Node.js 支持原生 ES 模块的第一个版本。

[最小 React 版本](https://react.dev/learn/add-react-to-an-existing-project) - 最小所需的 React 版本是 `17.0.2`。要升级，您可以在终端中运行以下命令：

```bash filename="终端"
npm install react@latest react-dom@latest

yarn add react@latest react-dom@latest

pnpm update react@latest react-dom@latest

bun add react@latest react-dom@latest
```

#### SWC 替代 Babel

Next.js 现在使用基于 Rust 的编译器 [SWC](https://swc.rs/) 来编译 JavaScript/TypeScript。这个新编译器在编译单个文件时比 Babel 快多达 17 倍，在快速刷新时快多达 5 倍。

Next.js 提供了与具有 [自定义 Babel 配置](/docs/pages/building-your-application/configuring/babel) 的应用程序的完全向后兼容性。所有 Next.js 默认处理的转换，如 styled-jsx 和 `getStaticProps` / `getStaticPaths` / `getServerSideProps` 的树摇，都已移植到 Rust。

当应用程序具有自定义 Babel 配置时，Next.js 将自动选择不使用 SWC 来编译 JavaScript/Typescript，并将回退到使用 Babel，就像在 Next.js 11 中使用的方式一样。

许多目前需要自定义 Babel 转换的与外部库的集成将很快被移植到基于 Rust 的 SWC 转换。这些包括但不限于：

- Styled Components
- Emotion
- Relay

为了优先考虑有助于您采用 SWC 的转换，请在 [这个反馈线程](https://github.com/vercel/next.js/discussions/30174) 上提供您的 `.babelrc`。

#### SWC 替代 Terser 进行压缩

您可以通过在 `next.config.js` 中使用标志来选择使用 SWC 替代 Terser 进行压缩，速度可快达 7 倍：

```js filename="next.config.js"
module.exports = {
  swcMinify: true,
}
```

使用 SWC 进行压缩是一个可选的标志，以确保在它成为 Next.js 12.1 中的默认设置之前，它可以针对更多的真实世界 Next.js 应用程序进行测试。如果您对压缩有反馈，请在 [这个反馈线程](https://github.com/vercel/next.js/discussions/30237) 上留下。

#### styled-jsx CSS 解析的改进

在基于 Rust 的编译器之上，我们实现了一个新的 CSS 解析器，该解析器基于 styled-jsx Babel 转换所使用的解析器。这个新的解析器改进了对 CSS 的处理，并在使用了以前会漏过的无效 CSS 时现在会抛出错误，这可能会导致意外的行为。

由于这个变化，无效的 CSS 将在开发期间和 `next build` 时抛出错误。这个变化只影响 styled-jsx 的使用。
# `next/image` 包装元素变更

`next/image` 现在将 `<img>` 渲染在 `<span>` 内部，而不是 `<div>`。

如果您的应用程序有特定针对 `<span>` 的 CSS，例如 `.container span`，升级到 Next.js 12 可能会导致错误地匹配 `<Image>` 组件内的包装元素。您可以通过将选择器限制为特定类，例如 `.container span.item`，并将相关组件更新为该 className，例如 `<span className="item" />`，来避免这种情况。

如果您的应用程序有特定针对 `next/image` 的 `<div>` 标签的 CSS，例如 `.container div`，它可能不再匹配。您可以更新选择器为 `.container span`，或者更可取的是，添加一个新的 `<div className="wrapper">` 包裹 `<Image>` 组件，并针对该元素进行定位，例如 `.container .wrapper`。

`className` 属性保持不变，仍将传递给底层的 `<img>` 元素。

有关更多信息，请查看[文档](/docs/pages/building-your-application/optimizing/images#styling)。

# HMR 连接现在使用 WebSocket

之前，Next.js 使用 [服务器发送的事件](https://developer.mozilla.org/docs/Web/API/Server-sent_events) 连接来接收 HMR 事件。Next.js 12 现在使用 WebSocket 连接。

在某些情况下，当代理请求到 Next.js 开发服务器时，您需要确保升级请求被正确处理。例如，在 `nginx` 中，您需要添加以下配置：

```nginx
location /_next/webpack-hmr {
    proxy_pass http://localhost:3000/_next/webpack-hmr;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

如果您使用的是 Apache (2.x)，则可以添加以下配置以启用服务器的 WebSocket。请检查端口、主机名和服务器名称。

```
<VirtualHost *:443>
 # ServerName yourwebsite.local
 ServerName "${WEBSITE_SERVER_NAME}"
 ProxyPass / http://localhost:3000/
 ProxyPassReverse / http://localhost:3000/
 # Next.js 12 使用 websocket
 <Location /_next/webpack-hmr>
    RewriteEngine On
    RewriteCond %{QUERY_STRING} transport=websocket [NC]
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule /(.*) ws://localhost:3000/_next/webpack-hmr/$1 [P,L]
    ProxyPass ws://localhost:3000/_next/webpack-hmr retry=0 timeout=30
    ProxyPassReverse ws://localhost:3000/_next/webpack-hmr
 </Location>
</VirtualHost>
```

对于自定义服务器，例如 `express`，您可能需要使用 `app.all` 来确保请求被正确传递，例如：

```js
app.all('/_next/webpack-hmr', (req, res) => {
  nextjsRequestHandler(req, res)
})
```

# Webpack 4 支持已被移除

如果您已经在使用 webpack 5，您可以跳过本节。

Next.js 已在 Next.js 11 中采用 webpack 5 作为编译的默认选项。正如在 [webpack 5 升级文档](/docs/messages/webpack5) 中所述，Next.js 12 移除了对 webpack 4 的支持。

如果您的应用程序仍在使用 webpack 4，并使用退出标志，您现在将看到一个错误，指向 [webpack 5 升级文档](/docs/messages/webpack5)。

# `target` 选项已被弃用

如果您的 `next.config.js` 中没有 `target`，您可以跳过本节。

为了支持追踪运行页面所需的依赖关系，`target` 选项已被弃用。

在 `next build` 期间，Next.js 将自动追踪每个页面及其依赖项，以确定部署应用程序的生产版本所需的所有文件。

如果您目前正在使用设置为 `serverless` 的 `target` 选项，请阅读[文档，了解如何利用新的输出](/docs/pages/api-reference/next-config-js/output)。