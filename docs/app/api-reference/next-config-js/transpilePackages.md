---
title: transpilePackages
description: 自动转译并打包本地包（如单体仓库）或外部依赖（`node_modules`）的依赖。
---



Next.js 可以自动转译并打包本地包（如单体仓库）或外部依赖（`node_modules`）。这取代了 `next-transpile-modules` 包。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  转译包: ['@acme/ui', 'lodash-es'],
}

module.exports = nextConfig
```

## 版本历史

| 版本   | 变更                    |
| --------- | -------------------------- |
| `v13.0.0` | 添加了 `转译包`。 |