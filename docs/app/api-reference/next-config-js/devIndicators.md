# devIndicators

---

须知：优化后的页面包括一个指示器，让您知道它是否正在被静态优化。您可以在这里选择退出。

<AppOnly>

当您编辑代码时，Next.js 正在编译应用程序，在页面的右下角会出现一个编译指示器。

> **须知**：此指示器仅在开发模式下存在，不会在生产模式下构建和运行应用程序时出现。

在某些情况下，此指示器可能会在您的页面上错位，例如，当与聊天启动器冲突时。要更改其位置，请打开 `next.config.js` 并设置 `devIndicators` 对象中的 `buildActivityPosition` 为 `bottom-right`（默认值）、`bottom-left`、`top-right` 或 `top-left`：

```js filename="next.config.js"
module.exports = {
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
}
```

在某些情况下，此指示器可能对您没有用处。要删除它，请打开 `next.config.js` 并在 `devIndicators` 对象中禁用 `buildActivity` 配置：

```js filename="next.config.js"
module.exports = {
  devIndicators: {
    buildActivity: false,
  },
}
```

</AppOnly>

<PagesOnly>

> **须知**：此指示器已在 Next.js 版本 10.0.1 中移除。我们建议您升级到 Next.js 的最新版本。

当页面符合 [自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization) 条件时，我们会显示一个指示器来告知您。

这很有帮助，因为自动静态优化可能非常有益，并且如果页面符合条件，立即在开发中知道这一点会很有用。

在某些情况下，此指示器可能没有用处，比如在处理 electron 应用程序时。要删除它，请打开 `next.config.js` 并在 `devIndicators` 中禁用 `autoPrerender` 配置：

```js filename="next.config.js"
module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
}
```

</PagesOnly>