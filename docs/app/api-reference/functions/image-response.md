---
title: ImageResponse
description: ImageResponse 构造函数的 API 参考。
---

`ImageResponse` 构造函数允许您使用 JSX 和 CSS 生成动态图像。这对于生成社交媒体图像（如 Open Graph 图片、Twitter 卡片等）非常有用。

`ImageResponse` 可用的选项如下：

```jsx
import { ImageResponse } from 'next/og'

new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
      style: 'normal' | 'italic'
    }[]
    debug?: boolean = false

    // 将传递给 HTTP 响应的选项
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

## 支持的 CSS 属性

请参考 [Satori 的文档](https://github.com/vercel/satori#css) 以获取支持的 HTML 和 CSS 特性列表。

## 版本历史

| 版本   | 变更                                               |
| --------- | ----------------------------------------------------- |
| `v14.0.0` | `ImageResponse` 从 `next/server` 移动到 `next/og` |
| `v13.3.0` | `ImageResponse` 可以从 `next/server` 导入。   |
| `v13.0.0` | 通过 `@vercel/og` 包引入了 `ImageResponse`。  |