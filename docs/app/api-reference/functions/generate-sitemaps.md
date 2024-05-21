---
title: generateSitemaps
nav_title: generateSitemaps
description: 学习如何使用 generateSitemaps 函数为您的应用程序创建多个站点地图。
related:
  title: 下一步
  description: 学习如何为您的 Next.js 应用程序创建站点地图。
  links:
    - app/api-reference/file-conventions/metadata/sitemap
---

您可以使用 `generateSitemaps` 函数为您的应用程序生成多个站点地图。

## 返回值

`generateSitemaps` 返回一个对象数组，每个对象都有一个 `id` 属性。

## URL

在生产环境中，您生成的站点地图将在 `/.../sitemap/[id].xml` 上可用。例如，`/product/sitemap/1.xml`。

在开发环境中，您可以在 `/.../sitemap.xml/[id]` 上查看生成的站点地图。例如，`/product/sitemap.xml/1`。这种差异是暂时的，最终将遵循生产格式。

## 示例

例如，要使用 `generateSitemaps` 分割站点地图，返回一个包含站点地图 `id` 的对象数组。然后，使用 `id` 生成唯一的站点地图。

```ts filename="app/product/sitemap.ts" switcher
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // 获取产品的总数并计算所需的站点地图数量
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  // Google 的站点地图每个限制为 50,000 个 URL
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

```js filename="app/product/sitemap.js" switcher
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // 获取产品的总数并计算所需的站点地图数量
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap({ id }) {
  // Google 的站点地图每个限制为 50,000 个 URL
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${id}`,
    lastModified: product.date,
  }))
}
```