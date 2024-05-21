---
title: distDir
description: 设置自定义构建目录以代替默认的.next目录。
---

# distDir

您可以指定一个名称，用于使用自定义构建目录而不是 `.next`。

打开 `next.config.js` 并添加 `distDir` 配置：

```js filename="next.config.js"
module.exports = {
  distDir: 'build',
}
```

现在，如果您运行 `next build`，Next.js 将使用 `build` 而不是默认的 `.next` 文件夹。

> `distDir` **不应** 离开您的项目目录。例如，`../build` 是一个 **无效** 的目录。