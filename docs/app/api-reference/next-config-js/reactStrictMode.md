---
title: reactStrictMode
description: Next.js 运行时现在符合严格模式，了解如何启用
---



> **须知**：自 Next.js 13.4 起，默认情况下 `app` 路由器的严格模式为 `true`，因此上述配置仅对 `pages` 必要。您仍然可以通过设置 `reactStrictMode: false` 来禁用严格模式。

> **建议**：我们强烈建议您在 Next.js 应用程序中启用严格模式，以更好地为 React 的未来做好准备。

React 的 [Strict Mode](https://react.dev/reference/react/StrictMode) 是一个仅在开发模式下使用的特性，用于突出应用程序中的潜在问题。它有助于识别不安全的生命周期、遗留 API 使用以及其他一些特性。

Next.js 运行时符合严格模式。要启用严格模式，请在您的 `next.config.js` 中配置以下选项：

```js filename="next.config.js"
module.exports = {
  reactStrictMode: true,
}
```

如果您或您的团队还没有准备好在整个应用程序中使用严格模式，那没关系！您可以使用 `<React.StrictMode>` 逐步在页面的基础上进行迁移。