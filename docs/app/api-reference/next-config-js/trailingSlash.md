---
title: trailingSlash
description: 配置 Next.js 页面解析时是否包含尾随斜杠。
---

{/* 此文档的内容在应用和页面路由器之间共享。您可以使用 `<PagesOnly>内容</PagesOnly>` 组件添加特定于页面路由器的内容。任何共享的内容都不应包裹在组件中。 */}

默认情况下，Next.js 会将带有尾随斜杠的 URL 重定向到没有尾随斜杠的对应 URL。例如 `/about/` 将重定向到 `/about`。您可以配置此行为，使其相反，即没有尾随斜杠的 URL 被重定向到带有尾随斜杠的对应 URL。

打开 `next.config.js` 并添加 `trailingSlash` 配置：

```js filename="next.config.js"
module.exports = {
  trailingSlash: true,
}
```

启用此选项后，像 `/about` 这样的 URL 将重定向到 `/about/`。

当与 [`output: "export"`](/docs/app/building-your-application/deploying/static-exports) 配置一起使用时，`/about` 页面将输出 `/about/index.html`（而不是默认的 `/about.html`）。

## 版本历史

| 版本  | 变更                |
| -------- | ---------------------- |
| `v9.5.0` | 添加了 `trailingSlash`。 |