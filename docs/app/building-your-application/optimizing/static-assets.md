---
nav_title: 静态资源
description: Next.js 允许您在 public 目录中提供静态文件，如图片。您可以在这里了解它的工作原理。
---

# public 目录中的静态资源

Next.js 可以在根目录中名为 `public` 的文件夹下提供静态文件，如图片。`public` 内部的文件可以通过代码引用，从基础 URL (`/`) 开始。

例如，文件 `public/avatars/me.png` 可以通过访问 `/avatars/me.png` 路径来查看。显示该图片的代码可能如下所示：

```jsx filename="avatar.js"
import Image from 'next/image'

export function Avatar({ id, alt }) {
  return <Image src={`/avatars/${id}.png`} alt={alt} width="64" height="64" />
}

export function AvatarOfMe() {
  return <Avatar id="me" alt="我的肖像" />
}
```

## 缓存

Next.js 无法安全地缓存 `public` 文件夹中的资源，因为它们可能会发生变化。默认应用的缓存头部为：

```jsx
Cache-Control: public, max-age=0
```

## 机器人、favicons 和其他

<PagesOnly>

该文件夹还适用于 `robots.txt`、`favicon.ico`、Google 网站验证以及任何其他静态文件（包括 `.html`）。但请确保不要有一个与 `pages/` 目录中文件同名的静态文件，因为这将导致错误。[了解更多](/docs/messages/conflicting-public-file-page)。

</PagesOnly>

<AppOnly>

对于静态元数据文件，如 `robots.txt`、`favicon.ico` 等，您应该使用 `app` 文件夹内的 [特殊元数据文件](/docs/app/api-reference/file-conventions/metadata)。

</AppOnly>

> 须知：
>
> - 目录必须命名为 `public`。名称不能更改，且是用于提供静态资源的唯一目录。
> - 只有在 [构建时](/docs/app/api-reference/next-cli#build) 在 `public` 目录中的资源才会被 Next.js 提供。请求时添加的文件将不可用。我们建议使用第三方服务，如 [Vercel Blob](https://vercel.com/docs/storage/vercel-blob?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 进行持久文件存储。