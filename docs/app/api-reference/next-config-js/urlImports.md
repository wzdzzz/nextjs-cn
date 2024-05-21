---
title: urlImports
---

{/* The content of this doc is shared between the app and pages router. You can use the `<PagesOnly>Content</PagesOnly>` component to add content that is specific to the Pages Router. Any shared content should not be wrapped in a component. */}

## 须知

URL imports 是一个实验性功能，允许您直接从外部服务器导入模块（而不是从本地磁盘）。

> **警告**：此功能是实验性的。只有在您信任的域上下载和执行代码。在该功能被标记为稳定之前，请谨慎使用。

要启用此功能，请在 `next.config.js` 中添加允许的 URL 前缀：

```js filename="next.config.js"
module.exports = {
  experimental: {
    urlImports: ['https://example.com/assets/', 'https://cdn.skypack.dev'],
  },
}
```

然后，您可以直接从 URL 导入模块：

```js
import { a, b, c } from 'https://example.com/assets/some/module.js'
```

URL Imports 可以在任何常规包导入可以使用的地方使用。

## 安全模型

此功能的设计将**安全性**作为首要考虑因素。首先，我们添加了一个实验性标志，迫使您明确允许您接受 URL imports 的域。我们正在努力通过使用 [Edge Runtime](/docs/app/api-reference/edge) 将 URL imports 限制为在浏览器沙盒中执行来进一步推进这一点。

## Lockfile

使用 URL imports 时，Next.js 将创建一个包含 lockfile 和获取到的资源的 `next.lock` 目录。
这个目录**必须提交到 Git**，不应被 `.gitignore` 忽略。

- 当运行 `next dev` 时，Next.js 将下载并添加所有新发现的 URL Imports 到您的 lockfile
- 当运行 `next build` 时，Next.js 将仅使用 lockfile 来构建生产应用程序

通常情况下，不需要网络请求，任何过时的 lockfile 都将导致构建失败。
一个例外是响应 `Cache-Control: no-cache` 的资源。
这些资源将在 lockfile 中有一个 `no-cache` 条目，并且在每次构建时都会从网络获取。

## 示例

### Skypack

```js
import confetti from 'https://cdn.skypack.dev/canvas-confetti'
import { useEffect } from 'react'

export default () => {
  useEffect(() => {
    confetti()
  })
  return <p>Hello</p>
}
```

### 静态图片导入

```js
import Image from 'next/image'
import logo from 'https://example.com/assets/logo.png'

export default () => (
  <div>
    <Image src={logo} placeholder="blur" />
  </div>
)
```

### CSS 中的 URL

```css
.className {
  background: url('https://example.com/assets/hero.jpg');
}
```

### 资源导入

```js
const logo = new URL('https://example.com/assets/file.txt', import.meta.url)

console.log(logo.pathname)

// 输出 "/_next/static/media/file.a9727b5d.txt"
```