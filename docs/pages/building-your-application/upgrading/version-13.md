---
title: 版本 13
description: 将您的 Next.js 应用程序从版本 12 升级到 13。
---

## 从 12 升级到 13

要更新到 Next.js 版本 13，请使用您喜欢的包管理器运行以下命令：

```bash filename="终端"
npm i next@13 react@latest react-dom@latest eslint-config-next@13
```

```bash filename="终端"
yarn add next@13 react@latest react-dom@latest eslint-config-next@13
```

```bash filename="终端"
pnpm i next@13 react@latest react-dom@latest eslint-config-next@13
```

```bash filename="终端"
bun add next@13 react@latest react-dom@latest eslint-config-next@13
```

> **须知：** 如果您正在使用 TypeScript，请确保也将 `@types/react` 和 `@types/react-dom` 升级到它们的最新版本。

### v13 摘要

- [支持的浏览器](/docs/architecture/supported-browsers)已更改，不再支持 Internet Explorer，而是针对现代浏览器。
- Node.js 的最低版本已从 12.22.0 提升到 16.14.0，因为 12.x 和 14.x 已达到生命周期终点。
- React 的最低版本已从 17.0.2 提升到 18.2.0。
- `swcMinify` 配置属性的值已从 `false` 更改为 `true`。有关更多信息，请参见 [Next.js 编译器](/docs/architecture/nextjs-compiler)。
- `next/image` 导入已重命名为 `next/legacy/image`。`next/future/image` 导入已重命名为 `next/image`。有一个[代码修改工具](/docs/pages/building-your-application/upgrading/codemods#next-image-to-legacy-image)可用于安全且自动地重命名您的导入。
- `next/link` 的子元素不能再是 `<a>`。添加 `legacyBehavior` 属性以使用旧版行为，或移除 `<a>` 以升级。有一个[代码修改工具](/docs/pages/building-your-application/upgrading/codemods#new-link)可自动升级您的代码。
- `target` 配置属性已被移除，并被 [输出文件跟踪](/docs/pages/api-reference/next-config-js/output) 取代。
## 迁移共享特性

Next.js 13 引入了一个新的 [`app` 目录](/docs/app/building-your-application/routing)，其中包含新特性和约定。然而，升级到 Next.js 13 **并不要求**使用新的 [`app` 目录](/docs/app/building-your-application/routing#the-app-router)。

你可以继续使用 `pages`，同时使用在两个目录中都能工作的新增特性，例如更新后的 [Image 组件](#image-component)、[Link 组件](#link-component)、[Script 组件](#script-component) 和 [字体优化](#font-optimization)。

### `<Image/>` 组件

Next.js 12 通过临时导入 `next/future/image` 对 Image 组件进行了许多改进。这些改进包括减少客户端 JavaScript、更容易扩展和样式化图片、更好的可访问性和原生浏览器懒加载。

从 Next.js 13 开始，这些新行为现在成为 `next/image` 的默认设置。

有两个 codemods 可以帮助你迁移到新的 Image 组件：

- [next-image-to-legacy-image](/docs/pages/building-your-application/upgrading/codemods#next-image-to-legacy-image)：这个 codemod 将安全且自动地将 `next/image` 导入重命名为 `next/legacy/image`，以保持与 Next.js 12 相同的行为。我们建议运行此 codemod，以快速自动更新到 Next.js 13。
- [next-image-experimental](/docs/pages/building-your-application/upgrading/codemods#next-image-experimental)：在运行上一个 codemod 后，你可以选择运行这个实验性 codemod，将 `next/legacy/image` 升级到新的 `next/image`，这将移除未使用的属性并添加内联样式。请注意，这个 codemod 是实验性的，并且只涵盖静态用法（例如 `<Image src={img} layout="responsive" />`），不包括动态用法（例如 `<Image {...props} />`）。

或者，你可以手动更新，遵循 [迁移指南](/docs/pages/building-your-application/upgrading/codemods#next-image-experimental)，还可以查看 [旧版比较](/docs/pages/api-reference/components/image-legacy#comparison)。

### `<Link>` 组件

[`<Link>` 组件](/docs/pages/api-reference/components/link) 不再需要手动添加 `<a>` 标签作为子元素。这种行为是在 [版本 12.2](https://nextjs.org/blog/next-12-2) 中作为实验性选项添加的，现在已成为默认设置。在 Next.js 13 中，`<Link>` 总是渲染 `<a>` 并允许你将属性转发到底层标签。

例如：

```jsx
import Link from 'next/link'

// Next.js 12：必须嵌套 `<a>`，否则将被排除
<Link href="/about">
  <a>About</a>
</Link>

// Next.js 13：`<Link>` 在内部始终渲染 `<a>`
<Link href="/about">
  About
</Link>
```

要将你的链接升级到 Next.js 13，你可以使用 [`new-link` codemod](/docs/pages/building-your-application/upgrading/codemods#new-link)。

### `<Script>` 组件

[`next/script`](/docs/pages/api-reference/components/script) 的行为已更新，以支持 `pages` 和 `app`。如果逐步采用 `app`，请阅读 [升级指南](/docs/pages/building-your-application/upgrading)。

### 字体优化

之前，Next.js 通过内联字体 CSS 帮助你优化字体。版本 13 引入了新的 [`next/font`](/docs/pages/building-your-application/optimizing/fonts) 模块，它允许你自定义字体加载体验，同时确保出色的性能和隐私。

查看 [优化字体](/docs/pages/building-your-application/optimizing/fonts) 了解如何使用 `next/font`。