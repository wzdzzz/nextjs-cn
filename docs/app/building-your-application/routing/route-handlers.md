# 路由处理器

路由处理器允许您使用 Web [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response) API 为给定路由创建自定义请求处理器。

![Route.js 特殊文件](https://nextjs.org/_next/image?url=/docs/light/route-special-file.png&w=3840&q=75)

> **须知**：路由处理器仅在 `app` 目录中可用。它们等同于 `pages` 目录中的 [API Routes](/docs/pages/building-your-application/routing/api-routes)，这意味着您**不需要**同时使用 API Routes 和路由处理器。

## 约定

路由处理器在 `app` 目录中的 [`route.js|ts` 文件](/docs/app/api-reference/file-conventions/route) 中定义：

```ts filename="app/api/route.ts" switcher
export const dynamic = 'force-dynamic' // 默认为 auto
export async function GET(request: Request) {}
```

```js filename="app/api/route.js" switcher
export const dynamic = 'force-dynamic' // 默认为 auto
export async function GET(request) {}
```

路由处理器可以嵌套在 `app` 目录中，类似于 `page.js` 和 `layout.js`。但是，与 `page.js` 相同路由段级别上**不能**有 `route.js` 文件。

### 支持的 HTTP 方法

支持以下 [HTTP 方法](https://developer.mozilla.org/docs/Web/HTTP/Methods)：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD` 和 `OPTIONS`。如果调用了不支持的方法，Next.js 将返回 `405 Method Not Allowed` 响应。

### 扩展的 `NextRequest` 和 `NextResponse` API

除了支持原生的 [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response)，Next.js 通过 [`NextRequest`](/docs/app/api-reference/functions/next-request) 和 [`NextResponse`](/docs/app/api-reference/functions/next-response) 对它们进行了扩展，以提供高级用例的便捷助手。

## 行为

### 缓存

在使用 `Response` 对象的 `GET` 方法时，默认情况下会缓存路由处理器。

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

> **TypeScript 警告**：`Response.json()` 仅从 TypeScript 5.2 开始有效。如果您使用的是较低版本的 TypeScript，您可以使用 [`NextResponse.json()`](/docs/app/api-reference/functions/next-response#json) 代替，以获得类型化的响应。

### 退出缓存

您可以通过以下方式退出缓存：

- 使用带有`GET`方法的`Request`对象。
- 使用其他任何HTTP方法。
- 使用[动态函数](#dynamic-functions)，如`cookies`和`headers`。
- [Segment Config Options](#segment-config-options)手动指定动态模式。

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
  })
  const product = await res.json()

  return Response.json({ product })
}
```

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

类似地，`POST`方法将导致路由处理器动态评估。

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

> **须知**：像API路由一样，路由处理器可以用于处理表单提交等场景。正在开发一种新的抽象，用于[处理表单和变异](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)，与React深度集成。

### Route Resolution

您可以将`route`视为最低级别的路由原语。

- 它们**不**参与`page`这样的布局或客户端导航。
- 同一路由下**不能**同时存在`route.js`文件和`page.js`文件。

| 页面                 | 路由              | 结果                       |
| -------------------- | ------------------ | ---------------------------- |
| `app/page.js`        | `app/route.js`     | <Cross size={18} /> 冲突 |
| `app/page.js`        | `app/api/route.js` | <Check size={18} /> 有效    |
| `app/[user]/page.js` | `app/api/route.js` | <Check size={18} /> 有效    |

每个`route.js`或`page.js`文件都接管该路由的所有HTTP动词。

```jsx filename="app/page.js"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}

// ❌ 冲突
// `app/route.js`
export async function POST(request) {}
```

## Examples

以下示例展示了如何将路由处理器与其他Next.js API和功能结合使用。
### 重新验证缓存数据

您可以使用 [`next.revalidate`](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data) 选项来[重新验证缓存数据](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data)：

```ts filename="app/items/route.ts" switcher
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    next: { revalidate: 60 }, // 每60秒重新验证一次
  })
  const data = await res.json()

  return Response.json(data)
}
```

```js filename="app/items/route.js" switcher
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    next: { revalidate: 60 }, // 每60秒重新验证一次
  })
  const data = await res.json()

  return Response.json(data)
}
```

另外，您可以使用 [`revalidate` 段配置选项](/docs/app/api-reference/file-conventions/route-segment-config#revalidate)：

```ts
export const revalidate = 60
```
### 动态函数

路由处理器可以使用Next.js中的动态函数，如[`cookies`](/docs/app/api-reference/functions/cookies)和[`headers`](/docs/app/api-reference/functions/headers)。

#### Cookies

您可以使用来自`next/headers`的[`cookies`](/docs/app/api-reference/functions/cookies)读取或设置cookies。这个服务器函数可以直接在路由处理器中调用，或者嵌套在另一个函数内部。

另外，您可以使用[`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)头返回一个新的`Response`。

```ts filename="app/api/route.ts" switcher
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
```

```js filename="app/api/route.js" switcher
import { cookies } from 'next/headers'

export async function GET(request) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token}` },
  })
}
```

您也可以使用底层的Web API从请求中读取cookies（[`NextRequest`](/docs/app/api-reference/functions/next-request)）：

```ts filename="app/api/route.ts" switcher
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')
}
```

```js filename="app/api/route.js" switcher
export async function GET(request) {
  const token = request.cookies.get('token')
}
```

#### Headers

您可以使用来自`next/headers`的[`headers`](/docs/app/api-reference/functions/headers)读取头信息。这个服务器函数可以直接在路由处理器中调用，或者嵌套在另一个函数内部。

这个`headers`实例是只读的。要设置头信息，您需要返回一个新的带有新`headers`的`Response`。

```ts filename="app/api/route.ts" switcher
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = headers()
  const referer = headersList.get('referer')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

```js filename="app/api/route.js" switcher
import { headers } from 'next/headers'

export async function GET(request) {
  const headersList = headers()
  const referer = headersList.get('referer')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

您也可以使用底层的Web API从请求中读取头信息（[`NextRequest`](/docs/app/api-reference/functions/next-request)）：

```ts filename="app/api/route.ts" switcher
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
}
```

```js filename="app/api/route.js" switcher
export async function GET(request) {
  const requestHeaders = new Headers(request.headers)
}
```

### 重定向

```ts filename="app/api/route.ts" switcher
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```

```js filename="app/api/route.js" switcher
import { redirect } from 'next/navigation'

export async function GET(request) {
  redirect('https://nextjs.org/')
}
```
### 动态路由片段

> 我们建议在继续之前阅读[定义路由](/docs/app/building-your-application/routing/defining-routes)页面。

路由处理器可以使用[动态片段](/docs/app/building-your-application/routing/dynamic-routes)从动态数据创建请求处理器。

```ts filename="app/items/[slug]/route.ts" switcher
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug // 'a', 'b', 或 'c'
}
```

```js filename="app/items/[slug]/route.js" switcher
export async function GET(request, { params }) {
  const slug = params.slug // 'a', 'b', 或 'c'
}
```

| 路由                       | 示例 URL | `params`        |
| --------------------------- | ----------- | --------------- |
| `app/items/[slug]/route.js` | `/items/a`  | `{ slug: 'a' }` |
| `app/items/[slug]/route.js` | `/items/b`  | `{ slug: 'b' }` |
| `app/items/[slug]/route.js` | `/items/c`  | `{ slug: 'c' }` |

### URL查询参数

传递给路由处理器的请求对象是一个`NextRequest`实例，它有一些[额外的便利方法](/docs/app/api-reference/functions/next-request#nexturl)，包括更容易地处理查询参数。

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

流式传输通常与大型语言模型（LLMs）结合使用，如OpenAI，用于AI生成的内容。了解更多关于[AI SDK](https://sdk.vercel.ai/docs/introduction)的信息。

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

这些抽象使用Web API创建一个流。您也可以直接使用底层的Web API。

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

您可以使用标准的Web API方法读取`Request`体：

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

您可以使用 `request.formData()` 函数读取 `FormData`：

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

由于 `formData` 数据都是字符串，您可能希望使用 [`zod-form-data`](https://www.npmjs.com/zod-form-data) 来验证请求并按您喜欢的格式（例如 `number`）检索数据。

### CORS

您可以使用标准 Web API 方法为特定的路由处理器设置 CORS 标头：

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

> **须知**：
>
> - 要为多个路由处理器添加 CORS 标头，您可以使用 [中间件](/docs/app/building-your-application/routing/middleware#cors) 或 [`next.config.js` 文件](/docs/app/api-reference/next-config-js/headers#cors)。
> - 另外，请参阅我们的 [CORS 示例](https://github.com/vercel/examples/blob/main/edge-functions/cors/lib/cors.ts) 包。

### Webhooks

您可以使用路由处理器接收来自第三方服务的 Webhooks：

```ts filename="app/api/route.ts" switcher
export async function POST(request: Request) {
  try {
    const text = await request.text()
    // 处理 webhook 负载
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
    // 处理 webhook 负载
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

值得注意的是，与使用页面路由器的 API 路由不同，您不需要使用 `bodyParser` 进行任何额外的配置。
### 非UI响应

您可以使用路由处理器返回非UI内容。请注意，[`sitemap.xml`](/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts)、[`robots.txt`](/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file)、[`应用图标`](/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx)和[开放图象](/docs/app/api-reference/file-conventions/metadata/opengraph-image)都有内置支持。

```ts filename="app/rss.xml/route.ts" switcher
export const dynamic = 'force-dynamic' // 默认为auto

export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>

</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}
```

```js filename="app/rss.xml/route.js" switcher
export const dynamic = 'force-dynamic' // 默认为auto

export async function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>

</rss>`)
}
```

### 段配置选项

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

有关更多详细信息，请查看[API参考](/docs/app/api-reference/file-conventions/route-segment-config)。