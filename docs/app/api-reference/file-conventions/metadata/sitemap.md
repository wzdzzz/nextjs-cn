# sitemap.xml

**描述**：sitemap.xml 文件的 API 参考。

**相关**：
  - **标题**：下一步
  - **描述**：学习如何使用 generateSitemaps 函数。
  - **链接**：
    - [generate-sitemaps](/app/api-reference/functions/generate-sitemaps)

`sitemap.(xml|js|ts)` 是一个特殊文件，它符合 [Sitemaps XML 格式](https://www.sitemaps.org/protocol.html)，以帮助搜索引擎爬虫更高效地索引您的网站。

### Sitemap 文件 (.xml)

对于较小的应用，您可以创建一个 `sitemap.xml` 文件并将其放置在 `app` 目录的根目录中。

```xml filename="app/sitemap.xml"
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### 使用代码生成 sitemap (.js, .ts)

您可以使用 `sitemap.(js|ts)` 文件约定通过导出一个默认函数来以编程方式**生成**一个 sitemap，该函数返回一个 URL 数组。如果使用 TypeScript，可以使用 [`Sitemap`](#returns) 类型。

```ts filename="app/sitemap.ts" switcher
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

```js filename="app/sitemap.js" switcher
export default function sitemap() {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

输出：

```xml filename="acme.com/sitemap.xml"
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```
### 生成本地化站点地图

```ts filename="app/sitemap.ts" switcher
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es',
          de: 'https://acme.com/de',
        },
      },
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/about',
          de: 'https://acme.com/de/about',
        },
      },
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/blog',
          de: 'https://acme.com/de/blog',
        },
      },
    },
  ]
}
```

输出：

```xml filename="acme.com/sitemap.xml"
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://acme.com</loc>
    <xhtml:link
      rel="alternate"
      hreflang="es"
      href="https://acme.com/es"/>
    <xhtml:link
      rel="alternate"
      hreflang="de"
      href="https://acme.com/de"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <xhtml:link
      rel="alternate"
      hreflang="es"
      href="https://acme.com/es/about"/>
    <xhtml:link
      rel="alternate"
      hreflang="de"
      href="https://acme.com/de/about"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <xhtml:link
      rel="alternate"
      hreflang="es"
      href="https://acme.com/es/blog"/>
    <xhtml:link
      rel="alternate"
      hreflang="de"
      href="https://acme.com/de/blog"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
</urlset>
```
### 生成多个站点地图

对于大多数应用程序，单个站点地图就足够了。但对于大型Web应用程序，您可能需要将站点地图拆分为多个文件。

您可以使用以下两种方法创建多个站点地图：

- 通过在多个路由段内嵌套 `sitemap.(xml|js|ts)`，例如 `app/sitemap.xml` 和 `app/products/sitemap.xml`。
- 通过使用 [`generateSitemaps`](/docs/app/api-reference/functions/generate-sitemaps) 函数。

例如，要使用 `generateSitemaps` 分割站点地图，返回一个包含站点地图 `id` 的对象数组。然后，使用 `id` 生成唯一的站点地图。

```ts filename="app/product/sitemap.ts" switcher
import { MetadataRoute } from 'next'
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
  // Google的站点地图限制是每个站点地图50,000个URL
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

```js filename="app/product/sitemap.js" switcher
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // 获取产品的总数并计算所需的站点地图数量
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap({ id }) {
  // Google的站点地图限制是每个站点地图50,000个URL
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

您生成的站点地图将在 `/.../sitemap/[id]` 上可用。例如，`/product/sitemap/1`。

有关更多信息，请参见 [`generateSitemaps` API 参考](/docs/app/api-reference/functions/generate-sitemaps)。

## 返回值

从 `sitemap.(xml|ts|js)` 导出的默认函数应该返回一个对象数组，具有以下属性：

```tsx
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
  alternates?: {
    languages?: Languages<string>
  }
}>
```

## 版本历史

| 版本   | 变更                                                      |
| --------- | ------------------------------------------------------------ |
| `v13.4.5` | 添加 `changeFrequency` 和 `priority` 属性到站点地图。 |
| `v13.3.0` | 引入 `sitemap`。                                        |