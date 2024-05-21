# reactStrictMode

React.StrictMode 是 React 的一个检查工具，它可以帮助开发者在开发过程中发现潜在的问题和性能瓶颈。Next.js 现在完全符合 Strict Mode 的要求，并且提供了一个配置选项来启用它。

## 简介

从 Next.js 9.5 开始，整个 Next.js 运行时都符合 Strict Mode 的要求。这意味着 Next.js 内部的所有组件和 API 都已经经过了严格的检查，以确保它们在开发过程中能够提供更好的性能和稳定性。

## 启用 Strict Mode

要启用 Strict Mode，你可以在 `next.config.js` 文件中添加以下配置：

```javascript
module.exports = {
  reactStrictMode: true,
}
```

这将启用 Next.js 应用中的 Strict Mode 功能。启用后，React.StrictMode 将检查所有的组件，并在控制台中报告任何潜在的问题。

## 须知

1. Strict Mode 仅在开发模式下有效，生产模式下不会启用。
2. Strict Mode 可能会引入一些额外的性能开销，因为它会在每次渲染时进行检查。
3. Strict Mode 可以帮助你发现和修复组件中的潜在问题，但它不会解决所有问题。在使用 Strict Mode 时，仍然需要仔细测试你的应用。
4. 如果你使用的是第三方组件库，请注意它们是否也支持 Strict Mode。一些组件库可能需要额外的配置或更新才能与 Strict Mode 兼容。

启用 Strict Mode 可以帮助你构建更稳定、更高效的 Next.js 应用。通过在开发过程中发现和修复问题，你可以确保你的应用在生产环境中表现最佳。