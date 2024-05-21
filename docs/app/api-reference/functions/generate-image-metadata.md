---
title: generateImageMetadata
description: 学习如何使用单个元数据API特殊文件生成多个图像。
related:
  title: Next Steps
  description: 查看所有元数据API选项。
  links:
    - app/api-reference/file-conventions/metadata
    - app/building-your-application/optimizing/metadata
---

您可以使用 `generateImageMetadata` 来生成一个图像的不同版本，或者为一个路由段返回多个图像。这在您想要避免硬编码元数据值时非常有用，例如对于图标。

## 参数

`generateImageMetadata` 函数接受以下参数：

#### `params` (可选)

一个对象，包含从根段到调用 `generateImageMetadata` 的段的 [动态路由参数](/docs/app/building-your-application/routing/dynamic-routes) 对象。

```tsx filename="icon.tsx" switcher
export function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  // ...
}
```

```jsx filename="icon.js" switcher
export function generateImageMetadata({ params }) {
  // ...
}
```

| 路由                           | URL         | `params`                  |
| ------------------------------- | ----------- | ------------------------- |
| `app/shop/icon.js`              | `/shop`     | `undefined`               |
| `app/shop/[slug]/icon.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/icon.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |
## 返回值

`generateImageMetadata` 函数应该返回一个对象数组，包含图像的元数据，如 `alt` 和 `size`。此外，每个项目**必须**包括一个 `id` 值，该值将传递给图像生成函数的 props。

| 图像元数据对象 | 类型                                |
| --------------------- | ----------------------------------- |
| `id`                  | `string` (required)                 |
| `alt`                 | `string`                            |
| `size`                | `{ width: number; height: number }` |
| `contentType`         | `string`                            |

```tsx filename="icon.tsx" switcher
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default function Icon({ id }: { id: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        Icon {id}
      </div>
    )
  )
}
```

```jsx filename="icon.js" switcher
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default function Icon({ id }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        Icon {id}
      </div>
    )
  )
}
```

### 示例

#### 使用外部数据

这个示例使用 `params` 对象和外部数据来为一个路由段生成多个 [Open Graph 图像](/docs/app/api-reference/file-conventions/metadata/opengraph-image)。

```tsx filename="app/products/[id]/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'
import { getCaptionForImage, getOGImages } from '@/app/utils/images'

export async function generateImageMetadata({
  params,
}: {
  params: { id: string }
}) {
  const images = await getOGImages(params.id)

  return images.map((image, idx) => ({
    id: idx,
    size: { width: 1200, height: 600 },
    alt: image.text,
    contentType: 'image/png',
  }))
}

export default async function Image({
  params,
  id,
}: {
  params: { id: string }
  id: number
}) {
  const productId = params.id
  const imageId = id
  const text = await getCaptionForImage(productId, imageId)

  return new ImageResponse(
    (
      <div
        style={
          {
            // ...
          }
        }
      >
        {text}
      </div>
    )
  )
}
```

```jsx filename="app/products/[id]/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'
import { getCaptionForImage, getOGImages } from '@/app/utils/images'

export async function generateImageMetadata({ params }) {
  const images = await getOGImages(params.id)

  return images.map((image, idx) => ({
    id: idx,
    size: { width: 1200, height: 600 },
    alt: image.text,
    contentType: 'image/png',
  }))
}

export default async function Image({ params, id }) {
  const productId = params.id
  const imageId = id
  const text = await getCaptionForImage(productId, imageId)

  return new ImageResponse(
    (
      <div
        style={
          {
            // ...
          }
        }
      >
        {text}
      </div>
    )
  )
}
```
## 版本历史

| 版本   | 更改                               |
| ------ | ---------------------------------- |
| `v13.3.0` | 引入了 `generateImageMetadata`。 |