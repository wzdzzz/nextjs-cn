---
title: 版本 14
description: 将您的 Next.js 应用程序从版本 13 升级到 14。
---

# 版本 14
## 从 13 升级到 14

要更新到 Next.js 版本 14，请使用您喜欢的包管理器运行以下命令：

```bash filename="终端"
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash filename="终端"
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash filename="终端"
pnpm up next react react-dom eslint-config-next --latest
```

```bash filename="终端"
bun add next@latest react@latest react-dom@latest eslint-config-next@latest
```

> **须知：** 如果您正在使用 TypeScript，请确保也将 `@types/react` 和 `@types/react-dom` 升级到它们的最新版本。

### v14 摘要

- 最低 Node.js 版本已从 16.14 提高到 18.17，因为 16.x 已达到生命周期终点。
- 移除了 `next export` 命令，转而使用 `output: 'export'` 配置。有关更多信息，请参见[文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)。
- `next/server` 导入的 `ImageResponse` 已重命名为 `next/og`。有一个[代码修改工具](/docs/app/building-your-application/upgrading/codemods#next-og-import)可用于安全且自动地重命名您的导入。
- `@next/font` 包已完全移除，转而使用内置的 `next/font`。有一个[代码修改工具](/docs/app/building-your-application/upgrading/codemods#built-in-next-font)可用于安全且自动地重命名您的导入。
- 已移除 `next-swc` 的 WASM 目标。