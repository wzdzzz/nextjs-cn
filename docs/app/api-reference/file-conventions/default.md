---
title: default.js
description: default.js 文件的 API 参考。
related:
  title: 了解更多关于并行路由的信息
  links:
    - app/building-your-application/routing/parallel-routes
---

`default.js` 文件用于在 Next.js 在完全页面加载后无法恢复 [slot's](/docs/app/building-your-application/routing/parallel-routes#slots) 的活动状态时，在 [Parallel Routes](/docs/app/building-your-application/routing/parallel-routes) 中呈现一个回退。

在 [soft navigation](/docs/app/building-your-application/routing/linking-and-navigating#5-soft-navigation) 期间，Next.js 会跟踪每个 slot 的活动 _state_（子页面）。然而，对于硬导航（完全页面加载），Next.js 无法恢复活动状态。在这种情况下，可以为当前 URL 不匹配的子页面呈现一个 `default.js` 文件。

考虑以下文件夹结构。`@team` slot 有一个 `settings` 页面，但 `@analytics` 没有。

<img
  alt="Parallel Routes unmatched routes"
  src="https://nextjs.org/_next/image?url=/docs/light/parallel-routes-unmatched-routes.png&w=3840&q=75"
  srcDark="/docs/dark/parallel-routes-unmatched-routes.png"
  width="1600"
  height="930"
/>

当导航到 `/settings` 时，`@team` slot 将呈现 `settings` 页面，同时保持 `@analytics` slot 当前活动的页面。

在刷新时，Next.js 将为 `@analytics` 呈现一个 `default.js`。如果不存在 `default.js`，则呈现 `404`。

此外，由于 `children` 是一个隐式 slot，当 Next.js 无法恢复父页面的活动状态时，您还需要创建一个 `default.js` 文件来呈现 `children` 的回退。

## Props

### `params` (可选)

一个包含从根段到 slot 的子页面的 [dynamic route parameters](/docs/app/building-your-application/routing/dynamic-routes) 的对象。例如：

| 示例                                    | URL          | `params`                            |
| ---------------------------------------- | ------------ | ----------------------------------- |
| `app/[artist]/@sidebar/default.js`      | `/zack`      | `{ artist: 'zack' }`                |
| `app/[artist]/[album]/@sidebar/default.js` | `/zack/next` | `{ artist: 'zack', album: 'next' }` |