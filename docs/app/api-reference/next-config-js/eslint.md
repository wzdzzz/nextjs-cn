# eslint

Next.js 默认在构建过程中报告 ESLint 错误和警告。如需禁用此行为，请参考以下说明。

当在项目中检测到 ESLint 时，如果存在错误，Next.js 将失败您的**生产构建**（`next build`）。

如果您希望即使应用程序存在 ESLint 错误，Next.js 也能生成生产代码，您可以完全禁用内置的 linting 步骤。除非您已经在工作流程的其他部分（例如，在 CI 或 pre-commit 钩子中）配置了 ESLint 的运行，否则不建议这样做。

打开 `next.config.js` 并在 `eslint` 配置中启用 `ignoreDuringBuilds` 选项：

```js filename="next.config.js"
module.exports = {
  eslint: {
    // 警告：这允许即使项目存在 ESLint 错误，生产构建也能成功完成。
    ignoreDuringBuilds: true,
  },
}
```