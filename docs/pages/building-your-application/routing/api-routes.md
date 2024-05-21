---
title: API 路由
description: Next.js 支持 API 路由，允许您在不离开 Next.js 应用的情况下构建您的 API。在这里了解它的工作原理。
---

<details>
  <summary>示例</summary>

- [基础 API 路由](https://github.com/vercel/next.js/tree/canary/examples/api-routes)
- [API 路由请求助手](https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware)
- [带有 GraphQL 的 API 路由](https://github.com/vercel/next.js/tree/canary/examples/api-routes-graphql)
- [带有 REST 的 API 路由](https://github.com/vercel/next.js/tree/canary/examples/api-routes-rest)
- [带有 CORS 的 API 路由](https://github.com/vercel/next.js/tree/canary/examples/api-routes-cors)

</details>

> **须知**：如果您正在使用 App Router，您可以使用 [Server Components](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating) 或 [Route Handlers](/docs/app/building-your-application/routing/route-handlers) 而不是 API 路由。

API 路由提供了一个在 Next.js 中构建 **公共 API** 的解决方案。

在 `pages/api` 文件夹内的任何文件都会被映射到 `/api/*` 并且将被视为 API 端点，而不是 `页面`。它们仅在服务器端打包，不会增加您的客户端捆绑包大小。

例如，下面的 API 路由返回一个状态码为 `200` 的 JSON 响应：

```ts filename="pages/api/hello.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

```js filename="pages/api/hello.js" switcher
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

> **须知**：
>
> - API 路由 [不指定 CORS 头](https://developer.mozilla.org/docs/Web/HTTP/CORS)，这意味着它们默认是 **同源的**。您可以通过将请求处理器包装在 [CORS 请求助手](https://github.com/vercel/next.js/tree/canary/examples/api-routes-cors) 中来自定义这种行为。

- API 路由不能与 [静态导出](/docs/pages/building-your-application/deploying/static-exports) 一起使用。但是，App Router 中的 [Route Handlers](/docs/app/building-your-application/routing/route-handlers) 可以。
  > - API 路由将受到 `next.config.js` 中 [`pageExtensions` 配置](/docs/pages/api-reference/next-config-js/pageExtensions) 的影响。

## 参数

```tsx
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // ...
}
```

- `req`: [http.IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage) 的一个实例
- `res`: [http.ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse) 的一个实例

## HTTP 方法

要在 API 路由中处理不同的 HTTP 方法，您可以在请求处理器中使用 `req.method`，如下所示：

```ts filename="pages/api/hello.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 处理 POST 请求
  } else {
    // 处理任何其他 HTTP 方法
  }
}
```

```js filename="pages/api/hello.js" switcher
export default function handler(req, res) {
  if (req.method === 'POST') {
    // 处理 POST 请求
  } else {
    // 处理任何其他 HTTP 方法
  }
}
```
## 请求助手

API路由提供了内置的请求助手，用于解析传入的请求（`req`）：

- `req.cookies` - 一个包含请求发送的cookie的对象。默认为`{}`
- `req.query` - 一个包含[查询字符串](https://en.wikipedia.org/wiki/Query_string)的对象。默认为`{}`
- `req.body` - 一个包含由`content-type`解析的正文的对象，如果没有发送正文则为`null`

### 自定义配置

每个API路由都可以导出一个`config`对象来更改默认配置，如下所示：

```js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // 指定此函数执行的最大允许持续时间（以秒为单位）
  maxDuration: 5,
}
```

`bodyParser`是自动启用的。如果你想将正文作为`Stream`或与[`raw-body`](https://www.npmjs.com/package/raw-body)一起使用，你可以将其设置为`false`。

禁用自动`bodyParsing`的一个用例是允许你验证**webhook**请求的原始正文，例如[来自GitHub的](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks#validating-payloads-from-github)。

```js
export const config = {
  api: {
    bodyParser: false,
  },
}
```

`bodyParser.sizeLimit`是解析正文所允许的最大大小，可以是[bytes](https://github.com/visionmedia/bytes.js)支持的任何格式，如下所示：

```js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500kb',
    },
  },
}
```

`externalResolver`是一个明确的标记，告诉服务器此路由由外部解析器（如_express_或_connect_）处理。启用此选项会禁用未解决请求的警告。

```js
export const config = {
  api: {
    externalResolver: true,
  },
}
```

`responseLimit`是自动启用的，当API路由的响应正文超过4MB时会发出警告。

如果你不是在无服务器环境中使用Next.js，并且了解不使用CDN或专用媒体主机的性能影响，你可以将此限制设置为`false`。

```js
export const config = {
  api: {
    responseLimit: false,
  },
}
```

`responseLimit`还可以采用字节数或`bytes`支持的任何字符串格式，例如`1000`，`'500kb'`或`'3mb'`。
此值是在显示警告之前的最大响应大小。默认值为4MB。（见上文）

```js
export const config = {
  api: {
    responseLimit: '8mb',
  },
}
```

## 响应助手

[服务器响应对象](https://nodejs.org/api/http.html#http_class_http_serverresponse)（通常缩写为`res`）包括一组类似Express.js的助手方法，以提高开发人员体验并加快创建新API端点的速度。

包括的助手有：

- `res.status(code)` - 一个设置状态码的函数。`code`必须是有效的[HTTP状态码](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
- `res.json(body)` - 发送JSON响应。`body`必须是[可序列化对象](https://developer.mozilla.org/docs/Glossary/Serialization)
- `res.send(body)` - 发送HTTP响应。`body`可以是`string`，`object`或`Buffer`
- `res.redirect([status,] path)` - 重定向到指定的路径或URL。`status`必须是有效的[HTTP状态码](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)。如果没有指定，`status`默认为"307" "Temporary redirect"。
- `res.revalidate(urlPath)` - 使用`getStaticProps`[按需重新验证页面](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation)。`urlPath`必须是一个`string`。
### 设置响应状态码

在将响应发送回客户端时，您可以设置响应的状态码。

以下示例将响应的状态码设置为 `200`（`OK`），并以 JSON 响应的形式返回一个 `message` 属性，其值为 `Hello from Next.js!`：

```ts filename="pages/api/hello.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

```js filename="pages/api/hello.js" switcher
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

### 发送 JSON 响应

当将响应发送回客户端时，您可以发送 JSON 响应，这必须是一个[可序列化对象](https://developer.mozilla.org/docs/Glossary/Serialization)。
在现实世界的应用中，您可能希望根据请求端点的结果，让客户端知道请求的状态。

以下示例发送了一个状态码为 `200`（`OK`）的 JSON 响应和异步操作的结果。它包含在一个 try catch 块中，用于处理可能发生的错误，并将适当的状态码和错误消息捕获并发送回客户端：

```ts filename="pages/api/hello.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await someAsyncOperation()
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
```

```js filename="pages/api/hello.js" switcher
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation()
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
```

### 发送 HTTP 响应

发送 HTTP 响应的方式与发送 JSON 响应相同。唯一的区别是响应体可以是 `string`、`object` 或 `Buffer`。

以下示例发送了一个状态码为 `200`（`OK`）的 HTTP 响应和异步操作的结果。

```ts filename="pages/api/hello.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await someAsyncOperation()
    res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

```js filename="pages/api/hello.js" switcher
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation()
    res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

### 重定向到指定的路径或 URL

以表单为例，一旦客户端提交了表单，您可能希望将客户端重定向到指定的路径或 URL。

以下示例在表单成功提交后将客户端重定向到 `/` 路径：

```ts filename="pages/api/hello.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, message } = req.body

  try {
    await handleFormInputAsync({ name, message })
    res.redirect(307, '/')
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch data' })
  }
}
```

```js filename="pages/api/hello.js" switcher
export default async function handler(req, res) {
  const { name, message } = req.body

  try {
    await handleFormInputAsync({ name, message })
    res.redirect(307, '/')
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```
### 添加 TypeScript 类型

通过从 `next` 导入 `NextApiRequest` 和 `NextApiResponse` 类型，您可以使您的 API 路由更加类型安全。除此之外，您还可以对您的响应数据进行类型定义：

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

> **须知**：`NextApiRequest` 的 body 是 `any` 类型，因为客户端可能包含任何有效负载。在使用之前，您应该在运行时验证 body 的类型/形状。

## 动态 API 路由

API 路由支持[动态路由](/docs/pages/building-your-application/routing/dynamic-routes)，并遵循与 `pages/` 中相同的文件命名规则。

```ts filename="pages/api/post/[pid].ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pid } = req.query
  res.end(`Post: ${pid}`)
}
```

```js filename="pages/api/post/[pid].js" switcher
export default function handler(req, res) {
  const { pid } = req.query
  res.end(`Post: ${pid}`)
}
```

现在，对 `/api/post/abc` 的请求将响应文本：`Post: abc`。

### 捕获所有 API 路由

API 路由可以通过在括号内添加三个点（`...`）来扩展以捕获所有路径。例如：

- `pages/api/post/[...slug].js` 匹配 `/api/post/a`，但也匹配 `/api/post/a/b`、`/api/post/a/b/c` 等。

> **须知**：您可以使用除 `slug` 之外的名称，例如：`[...param]`

匹配的参数将作为查询参数（示例中的 `slug`）发送到页面，它始终是一个数组，因此，路径 `/api/post/a` 将具有以下 `query` 对象：

```json
{ "slug": ["a"] }
```

在 `/api/post/a/b` 和任何其他匹配路径的情况下，新参数将被添加到数组中，如下所示：

```json
{ "slug": ["a", "b"] }
```

例如：

```ts filename="pages/api/post/[...slug].ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  res.end(`Post: ${slug.join(', ')}`)
}
```

```js filename="pages/api/post/[...slug].js" switcher
export default function handler(req, res) {
  const { slug } = req.query
  res.end(`Post: ${slug.join(', ')}`)
}
```

现在，对 `/api/post/a/b/c` 的请求将响应文本：`Post: a, b, c`。

### 可选的捕获所有 API 路由

通过在双括号内包含参数（`[[...slug]]`），可以使捕获所有路由变为可选。

例如，`pages/api/post/[[...slug]].js` 将匹配 `/api/post`、`/api/post/a`、`/api/post/a/b` 等。

捕获所有路由和可选捕获所有路由之间的主要区别在于，使用可选时，没有参数的路由也会被匹配（上述示例中的 `/api/post`）。

`query` 对象如下：

```json
{ } // GET `/api/post`（空对象）
{ "slug": ["a"] } // `GET /api/post/a`（单元素数组）
{ "slug": ["a", "b"] } // `GET /api/post/a/b`（多元素数组）
```

### 注意事项

- 预定义的 API 路由优先于动态 API 路由，动态 API 路由优先于捕获所有 API 路由。请看以下示例：
  - `pages/api/post/create.js` - 将匹配 `/api/post/create`
  - `pages/api/post/[pid].js` - 将匹配 `/api/post/1`、`/api/post/abc` 等。但不匹配 `/api/post/create`
  - `pages/api/post/[...slug].js` - 将匹配 `/api/post/1/2`、`/api/post/a/b/c
## Edge API Routes

如果您想在使用Edge Runtime时使用API Routes，我们建议您逐步采用App Router，并使用[Route Handlers](/docs/app/building-your-application/routing/route-handlers)。

Route Handlers函数签名是同构的，这意味着您可以为Edge和Node.js运行时使用相同的函数。