---
title: 路由处理器
description: 使用 Web 的 Request 和 Response API 为特定路由创建自定义请求处理器。
related:
  title: API 参考
  description: 了解更多关于 route.js 文件的信息。
  links:
    - app/api-reference/file-conventions/route
---

路由处理器允许您使用 Web [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response) API 为特定路由创建自定义请求处理器。

<Image
  alt="Route.js 特殊文件"
  srcLight="/docs/light/route-special-file.png"
  srcDark="/docs/dark/route-special-file.png"
  width="1600"
  height="444"
/>

> **须知**：路由处理器仅在 `app` 目录内可用。它们等同于 `pages` 目录内的 [API Routes](/docs/pages/building-your-application/routing/api-routes)，这意味着您**不需要**同时使用 API Routes 和路由处理器。

## 约定

路由处理器在 `app` 目录内的 [`route.js|ts` 文件](/docs/app/api-reference/file-conventions/route) 中定义：

```ts filename="app/api/route.ts" switcher
export const dynamic = 'force-dynamic' // 默认为 auto
export async function GET(request: Request) {}
```

```js filename="app/api/route.js" switcher
export const dynamic = 'force-dynamic' // 默认为 auto
export async function GET(request) {}
```

路由处理器可以嵌套在 `app` 目录内，类似于 `page.js` 和 `layout.js`。但是，与 `page.js` 相同路由段级别上**不能**有 `route.js` 文件。

### 支持的 HTTP 方法

支持以下 [HTTP 方法](https://developer.mozilla.org/docs/Web/HTTP/Methods)：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD` 和 `OPTIONS`。如果调用了不支持的方法，Next.js 将返回 `405 Method Not Allowed` 响应。

### 扩展的 `NextRequest` 和 `NextResponse` API

除了支持原生的 [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response)，Next.js 还通过 [`NextRequest`](/docs/app/api-reference/functions/next-request) 和 [`NextResponse`](/docs/app/api-reference/functions/next-response) 扩展了它们，为高级用例提供了方便的助手。

## 行为

### 缓存

默认情况下，当使用 `GET` 方法和 `Response` 对象时，路由处理器会被缓存。

```ts filename="app/items/route.ts" switcher
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
```

```js filename="app/items/route.js" switcher
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
```

> **TypeScript 警告**：`Response.json()` 仅从 TypeScript 5.2 起有效。如果您使用的是较低版本的 TypeScript，您可以使用 [`NextResponse.json()`](/docs/app/api-reference/functions/next-response#json) 来代替，以获得类型化的响应。

### 退出缓存

您可以通过以下方式退出缓存：

- 使用 `GET` 方法和 `Request` 对象。
- 使用任何其他 HTTP 方法。
- 使用 [动态函数](#dynamic-functions)，如 `cookies` 和 `headers`。
- [Segment Config Options](#segment-config-options) 手动指定动态模式。

例如：

```ts filename="app/products/api/route.ts" switcher
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
  }一级标题：Route Handlers

以下是内容的中文翻译，并保持了Markdown的格式：

```js filename="app/products/api/route.js" switcher
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const product = await res.json()

  return Response.json({ product })
}
```

类似地，`POST` 方法将导致路由处理器动态评估。

```ts filename="app/items/route.ts" switcher
export async function POST() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  })

  const data = await res.json()

  return Response.json(data)
}
```

```js filename="app/items/route.js" switcher
export async function POST() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  })

  const data = await res.json()

  return Response.json(data)
}
```

> **须知**：像 API 路由一样，路由处理器可以用于处理表单提交等情况。目前正在开发一种新的抽象，用于[处理表单和变异](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)，该抽象与 React 深度集成。

### 路由解析

你可以将 `route` 视为最低级别的路由原语。

- 它们**不**参与布局或像 `page` 这样的客户端导航。
- 不**能**在同一路由下有 `route.js` 文件和 `page.js` 文件。

| 页面                 | 路由              | 结果                       |
| -------------------- | ------------------ | ---------------------------- |
| `app/page.js`        | `app/route.js`     | <Cross size={18} /> 冲突 |
| `app/page.js`        | `app/api/route.js` | <Check size={18} /> 有效    |
| `app/[user]/page.js` | `app/api/route.js` | <Check size={18} /> 有效    |

每个 `route.js` 或 `page.js` 文件接管该路由的所有 HTTP 动词。

```jsx filename="app/page.js"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}

// ❌ 冲突
// `app/route.js`
export async function POST(request) {}
```

## 示例

以下示例展示了如何将路由处理器与其他 Next.js API 和功能结合使用。

### 重新验证缓存数据

你可以使用 [`next.revalidate`](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data) 选项重新验证缓存数据：

```ts filename="app/items/route.ts" switcher
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    next: { revalidate: 60 }, // 每 60 秒重新验证一次
  })
  const data = await res.json()

  return Response.json(data)
}
```

```js filename="app/items/route.js" switcher
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    next: { revalidate: 60 }, // 每 60 秒重新验证一次
  })
  const data = await res.json()

  return Response.json(data)
}
```

或者，你可以使用 [`revalidate` 段配置选项](/docs/app/api-reference/file-conventions/route-segment-config#revalidate)：

```ts
export const revalidate = 60
```

### 动态函数

路由处理器可以与 Next.js 的动态函数一起使用，如 [`cookies`](/docs/app/api-reference/functions/cookies) 和 [`headers`](/docs/app/api-reference/functions/headers)。

#### Cookies

你可以使用 [`cookies`](/docs/app/api-reference/functions/cookies) 来读取或设置 cookie。## 路由处理程序

在 Next.js 中，路由处理程序是用于处理特定路由请求的服务器端函数。你可以使用它们来处理静态文件、动态路由、API 路由等。

### 静态文件

```ts filename="app/api/route.ts" switcher
import { NextRequest, NextResponse } from 'next/server'
import type { APIRoute } from 'next'

export default function RouteHandler(
  req: NextRequest,
  res: NextResponse,
  { params }: { params: { slug: string } }
) {
  if (req.method === 'GET' && params.slug === 'static') {
    // 静态文件处理逻辑
  }

  return APIRoute.next()
}
```

```js filename="app/api/route.js" switcher
import { NextRequest, NextResponse } from 'next/server'
import type { APIRoute } from 'next'

export default function RouteHandler(
  req,
  res,
  { params }
) {
  if (req.method === 'GET' && params.slug === 'static') {
    // 静态文件处理逻辑
  }

  return APIRoute.next()
}
```

### API 路由

```ts filename="app/api/route.ts" switcher
import { NextRequest, NextResponse } from 'next/server'
import type { APIRoute } from 'next'

export default function RouteHandler(
  req: NextRequest,
  res: NextResponse,
  { params }: { params: { slug: string } }
) {
  if (req.method === 'GET' && params.slug === 'api') {
    // API 路由处理逻辑
  }

  return APIRoute.next()
}
```

```js filename="app/api/route.js" switcher
import { NextRequest, NextResponse } from 'next/server'
import type { APIRoute } from 'next'

export default function RouteHandler(
  req,
  res,
  { params }
) {
  if (req.method === 'GET' && params.slug === 'api') {
    // API 路由处理逻辑
  }

  return APIRoute.next()
}
```

### 动态路由

```ts filename="app/items/[slug]/route.ts" switcher
import { NextRequest, NextResponse } from 'next/server'
import type { APIRoute } from 'next'

export default function RouteHandler(
  req: NextRequest,
  res: NextResponse,
  { params }: { params: { slug: string } }
) {
  if (req.method === 'GET') {
    const slug = params.slug // 'a', 'b', 或 'c'
    // 动态路由处理逻辑
  }

  return APIRoute.next()
}
```

```js filename="app/items/[slug]/route.js" switcher
import { NextRequest, NextResponse } from 'next/server'
import type { APIRoute } from 'next'

export default function RouteHandler(
  req,
  res,
  { params }
) {
  if (req.method === 'GET') {
    const slug = params.slug // 'a', 'b', 或 'c'
    // 动态路由处理逻辑
  }

  return APIRoute.next()
}
```

| 路由                         | 示例 URL       | `params`       |
| ---------------------------- | -------------- | -------------- |
| `/items/[slug]`              | `/items/a`    | `{ "slug": "a" }` |
| `/items/[slug]/page/2`       | `/items/b/page/2` | `{ "slug": "b", "page": "2" }` |
| `/items/[slug]/page/3?query=123` | `/items/c/page/3?query=123` | `{ "slug": "c", "page": "3", "query": "123" }` |

### 路由参数

```ts filename="app/api/route.ts" switcher
import { NextRequest, NextResponse } from 'next/server'
import type { APIRoute } from 'next'

export default function RouteHandler(
  req: NextRequest,
  res: NextResponse,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug // 'a', 'b', 或 'c'
  // 使用 slug 参数处理逻辑
}

```

```js filename="app/api/route.js" switcher
import { NextRequest, NextResponse } from 'next/server'
import type { APIRoute } from 'next'

export default function RouteHandler(
  req,
  res,
  { params }
) {
  const slug = params.slug // 'a', 'b', 或 'c'
  // 使用 slug 参数处理逻辑
### 路由

------ |
| `app/items/[slug]/route.js` | `/items/a`  | `{ slug: 'a' }` |
| `app/items/[slug]/route.js` | `/items/b`  | `{ slug: 'b' }` |
| `app/items/[slug]/route.js` | `/items/c`  | `{ slug: 'c' }` |

### URL查询参数

传递给路由处理器的请求对象是一个`NextRequest`实例，它有一些[额外的便利方法](/docs/app/api-reference/functions/next-request#nexturl)，包括更容易处理查询参数的方法。

```ts filename="app/api/search/route.ts" switcher
import { type NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // 对于/api/search?query=hello，query是"hello"
}
```

```js filename="app/api/search/route.js" switcher
export function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // 对于/api/search?query=hello，query是"hello"
}
```

### 流式传输

流式传输通常与大型语言模型（LLMs）结合使用，例如OpenAI，用于AI生成的内容。了解更多关于[AI SDK](https://sdk.vercel.ai/docs/introduction)的信息。

```ts filename="app/api/chat/route.ts" switcher
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

export async function POST(req) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return new StreamingTextResponse(result.toAIStream())
}
```

```js filename="app/api/chat/route.js" switcher
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return new StreamingTextResponse(result.toAIStream())
}
```

这些抽象使用了Web API来创建一个流。你也可以直接使用底层的Web API。

```ts filename="app/api/route.ts" switcher
// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const encoder = new TextEncoder()

async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}

export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)

  return new Response(stream)
}
```

```js filename="app/api/route.js" switcher
// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const encoder = new TextEncoder()

async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}

export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)

  return new Response(stream)
}
```

### 请求体

你可以使用标准的Web API方法读取`Request`体：

```ts filename="app/items/route.ts" switcher
export async function POST(request: Request) {
  const res = aw
```### Request Body JSON

```ts filename="app/items/route.ts" switcher
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```

```js filename="app/items/route.js" switcher
export async function POST(request) {
  const res = await request.json()
  return Response.json({ res })
}
```

### Request Body FormData

```ts filename="app/items/route.ts" switcher
export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

```js filename="app/items/route.js" switcher
export async function POST(request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

### CORS

```ts filename="app/api/route.ts" switcher
export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

```js filename="app/api/route.js" switcher
export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### Webhooks

```ts filename="app/api/route.ts" switcher
export async function POST(request: Request) {
  try {
    const text = await request.text()
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  return new Response('Success!', {
    status: 200,
  })
}
```

```js filename="app/api/route.js" switcher
export async function POST(request) {
  try {
    const text = await request.text()
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  return new Response('Success!', {
    status: 200,
  })
}
```

### Non-UI Responses

```ts filename="app/rss.xml/route.ts" switcher
export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>`
  )
}
```以下是将提供的英文内容翻译成中文，并保持Markdown格式的示例：

---

# Next.js 文档

- **链接**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **描述**: 网络的React框架

---

```xml filename="app/rss.xml/route.js"
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>

</rss>
```

### 路由配置选项

路由处理器使用与页面和布局相同的[路由段配置](/docs/app/api-reference/file-conventions/route-segment-config)。

```ts filename="app/items/route.ts" switcher
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
```

```js filename="app/items/route.js" switcher
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
```

有关更多详细信息，请参见[API参考](/docs/app/api-reference/file-conventions/route-segment-config)。

---

请注意，文本中的链接和代码不需要翻译，图片链接只取`srcLight`部分。如果文本中包含图片链接，只需保留`srcLight`属性的值。