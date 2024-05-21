---
title: basePath
---

### 须知

要将 Next.js 应用程序部署在域名的子路径下，可以使用 `basePath` 配置选项。

`basePath` 允许您为应用程序设置路径前缀。例如，要使用 `/docs` 而不是 `''`（空字符串，默认值），打开 `next.config.js` 并添加 `basePath` 配置：

```js filename="next.config.js"
module.exports = {
  basePath: '/docs',
}
```

> **须知**：此值必须在构建时设置，且在不重新构建的情况下无法更改，因为该值会被内联到客户端捆绑包中。

### 链接

在使用 `next/link` 和 `next/router` 链接到其他页面时，`basePath` 将自动应用。

例如，当 `basePath` 设置为 `/docs` 时，使用 `/about` 将自动变为 `/docs/about`。

```js
export default function HomePage() {
  return (
    <>
      <Link href="/about">About Page</Link>
    </>
  )
}
```

输出的 HTML：

```html
<a href="/docs/about">About Page</a>
```

这确保了在更改 `basePath` 值时，您不必更改应用程序中的所有链接。

### 图片

<AppOnly>

当使用 [`next/image`](/docs/app/api-reference/components/image) 组件时，您需要在 `src` 前添加 `basePath`。

</AppOnly>

<PagesOnly>

当使用 [`next/image`](/docs/pages/api-reference/components/image) 组件时，您需要在 `src` 前添加 `basePath`。

</PagesOnly>

例如，当 `basePath` 设置为 `/docs` 时，使用 `/docs/me.png` 将正确地提供您的图片。

```jsx
import Image from 'next/image'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/docs/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}

export default Home
```