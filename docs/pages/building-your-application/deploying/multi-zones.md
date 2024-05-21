---
title: 多区域
description: 学习如何使用多区域将多个 Next.js 应用部署为一个单一应用。
---

<details open>
  <summary>示例</summary>

- [带区域的](https://github.com/vercel/next.js/tree/canary/examples/with-zones)

</details>

区域是 Next.js 应用的单个部署。您可以拥有多个区域并将它们合并为一个单一的应用。

例如，假设您有以下应用：

- 一个用于服务 `/blog/**` 的应用
- 另一个用于服务所有其他页面的应用

通过多区域支持，您可以将这两个应用合并为一个，允许您的客户使用单个 URL 浏览它，但您可以独立开发和部署这两个应用。

## 如何定义一个区域

没有与区域相关的 API。您只需要做以下事情：

- 确保在您的应用中只保留您需要的页面，这意味着一个应用不能有另一个应用的页面，如果应用 `A` 有 `/blog` 那么应用 `B` 也不应该有它。
- 确保配置了 [basePath](/docs/app/api-reference/next-config-js/basePath) 以避免页面和静态文件的冲突。

## 如何合并区域

您可以使用其中一个应用中的 [`rewrites`](/docs/pages/api-reference/next-config-js/rewrites) 或任何 HTTP 代理来合并区域。

对于 [在 Vercel 上的 Next.js](https://vercel.com?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 应用程序，您可以使用 [monorepo](https://vercel.com/blog/monorepos-are-changing-how-teams-build-software?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 通过单个 `git push` 部署两个应用。