---
title: manifest.json
description: manifest.json文件的API参考。
---

在`app`目录的**根目录**中添加或生成一个符合[Web Manifest规范](https://developer.mozilla.org/docs/Web/Manifest)的`manifest.(json|webmanifest)`文件，以向浏览器提供有关您的Web应用程序的信息。

## 静态Manifest文件

```json filename="app/manifest.json | app/manifest.webmanifest"
{
  "name": "我的Next.js应用程序",
  "short_name": "Next.js应用",
  "description": "使用Next.js构建的应用程序",
  "start_url": "/"
  // ...
}
```

## 生成Manifest文件

添加一个返回[Manifest对象](#manifest对象)的`manifest.js`或`manifest.ts`文件。

```ts filename="app/manifest.ts" switcher
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

```js filename="app/manifest.js" switcher
export default function manifest() {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

### Manifest对象

Manifest对象包含一个广泛的选项列表，这些选项可能会因新的Web标准而更新。有关所有当前选项的信息，如果使用[TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin)，请在代码编辑器中参考`MetadataRoute.Manifest`类型，或查看[MDN](https://developer.mozilla.org/docs/Web/Manifest)文档。

---

须知：以上内容为翻译后的文本，保持了Markdown格式，并按照要求进行了处理。