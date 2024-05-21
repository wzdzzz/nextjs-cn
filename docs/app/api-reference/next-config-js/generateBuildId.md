---
title: generateBuildId
description: 配置构建ID，该ID用于识别当前正在提供服务的应用程序版本。
---



Next.js 在 `next build` 期间生成一个ID，以识别当前正在提供服务的应用程序版本。相同的构建应用于启动多个容器。

如果您在环境的每个阶段都进行重建，您将需要生成一个一致的构建ID在容器之间使用。在 `next.config.js` 中使用 `generateBuildId` 命令：

```jsx filename="next.config.js"
module.exports = {
  generateBuildId: async () => {
    // 这可以是任何东西，使用最新的git哈希
    return process.env.GIT_HASH
  },
}
```