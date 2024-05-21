# Middleware

须知：Middleware允许在请求完成之前运行代码。然后，根据传入的请求，您可以通过重写、重定向、修改请求或响应头，或直接响应来修改响应。

Middleware在缓存内容和匹配路由之前运行。有关更多详细信息，请参见[匹配路径](#matching-paths)。

## 使用场景

将Middleware集成到您的应用程序中可以显著提高性能、安全性和用户体验。以下是Middleware特别有效的一些常见场景：

- 认证和授权：确保用户身份并在授予对特定页面或API路由的访问权限之前检查会话cookie。
- 服务器端重定向：基于某些条件（例如，地区、用户角色）在服务器级别重定向用户。
- 路径重写：通过基于请求属性动态重写API路由或页面的路径来支持A/B测试、功能推出或旧路径。
- 机器人检测：通过检测和阻止机器人流量来保护您的资源。
- 日志记录和分析：在页面或API处理之前捕获和分析请求数据以获得洞察力。
- 功能标志：动态启用或禁用功能，以实现无缝的功能推出或测试。

认识到Middleware可能不是最佳方法的情况同样重要。以下是需要注意的一些场景：

- 复杂数据获取和操作：Middleware不适用于直接数据获取或操作，这应该在路由处理程序或服务器端实用程序中完成。
- 繁重的计算任务：Middleware应该是轻量级的并且响应迅速，否则可能会导致页面加载延迟。繁重的计算任务或长时间运行的过程应该在专用的路由处理程序中完成。
- 广泛的会话管理：虽然Middleware可以管理基本的会话任务，但广泛的会话管理应该由专用的认证服务或在路由处理程序中管理。
- 直接数据库操作：不建议在Middleware中执行直接数据库操作。数据库交互应该在路由处理程序或服务器端实用程序中完成。

## 约定

在项目的根目录中使用文件`middleware.ts`（或`.js`）来定义Middleware。例如，与`pages`或`app`同级，或者如果适用的话，在`src`内部。

> **注意**：虽然每个项目只支持一个`middleware.ts`文件，但您仍然可以模块化地组织您的middleware逻辑。将middleware功能拆分为单独的`.ts`或`.js`文件，并将它们导入到您的主`middleware.ts`文件中。这允许更清晰地管理特定于路由的middleware，这些middleware在`middleware.ts`中集中控制。通过强制使用单个middleware文件，它简化了配置，防止了潜在的冲突，并避免了多个middleware层，从而优化了性能。
# Example

## 中间件示例

```ts filename="middleware.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 此函数如果内部使用了`await`，可以标记为`async`
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// 详见下文“匹配路径”部分了解更多
export const config = {
  matcher: '/about/:path*',
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'

// 此函数如果内部使用了`await`，可以标记为`async`
export function middleware(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// 详见下文“匹配路径”部分了解更多
export const config = {
  matcher: '/about/:path*',
}
```

## 匹配路径

中间件将被调用在项目中的**每一个路由**上。鉴于此，使用匹配器来精确地定位或排除特定路由至关重要。以下是执行顺序：

1. `next.config.js` 中的 `headers`
2. `next.config.js` 中的 `redirects`
3. 中间件（`rewrites`、`redirects` 等）
4. `next.config.js` 中的 `beforeFiles`（`rewrites`）
5. 文件系统路由（`public/`、`_next/static/`、`pages/`、`app/` 等）
6. `next.config.js` 中的 `afterFiles`（`rewrites`）
7. 动态路由（`/blog/[slug]`）
8. `next.config.js` 中的 `fallback`（`rewrites`）

有两种方式定义中间件将运行在哪些路径上：

1. [自定义匹配器配置](#matcher)
2. [条件语句](#conditional-statements)
### Matcher

`matcher` 允许您过滤中间件，以便仅在特定路径上运行。

```js filename="middleware.js"
export const config = {
  matcher: '/about/:path*',
}
```

您可以使用数组语法匹配单个路径或多个路径：

```js filename="middleware.js"
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
```

`matcher` 配置允许完整的正则表达式，因此支持像负向前瞻或字符匹配这样的匹配。以下是一个负向前瞻的例子，用于匹配除了特定路径之外的所有路径：

```js filename="middleware.js"
export const config = {
  matcher: [
    /*
     * 匹配除了以下开头的所有请求路径：
     * - api (API路由)
     * - _next/static (静态文件)
     * - _next/image (图像优化文件)
     * - favicon.ico (favicon文件)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

您也可以通过使用 `missing` 或 `has` 数组，或者两者的组合，来绕过某些请求的中间件：

```js filename="middleware.js"
export const config = {
  matcher: [
    /*
     * 匹配除了以下开头的所有请求路径：
     * - api (API路由)
     * - _next/static (静态文件)
     * - _next/image (图像优化文件)
     * - favicon.ico (favicon文件)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
    },
  ],
}
```

> **须知**：`matcher` 值需要是常量，以便它们可以在构建时静态分析。变量等动态值将被忽略。

配置的匹配器：

1. 必须以 `/` 开头
2. 可以包含命名参数：`/about/:path` 匹配 `/about/a` 和 `/about/b`，但不匹配 `/about/a/c`
3. 可以在命名参数上使用修饰符（以 `:` 开头）：`/about/:path*` 匹配 `/about/a/b/c`，因为 `*` 是 _零个或多个_。`?` 是 _零个或一个_，`+` 是 _一个或多个_
4. 可以使用括号内包含的正则表达式：`/about/(.*)` 与 `/about/:path*` 相同

阅读更多详细信息，请查看 [path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1) 文档。

> **须知**：为了向后兼容，Next.js 总是将 `/public` 视为 `/public/index`。因此，`/public/:path` 的匹配器将会匹配。

### 条件语句

```ts filename="middleware.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```
# NextResponse

`NextResponse` API 允许您：

- `redirect` 将传入的请求重定向到不同的 URL
- `rewrite` 通过显示给定的 URL 重写响应
- 为 API 路由、`getServerSideProps` 和 `rewrite` 目的地设置请求头
- 设置响应 Cookie
- 设置响应头

<AppOnly>

要从中间件生成响应，您可以：

1. `rewrite` 到生成响应的路由（[页面](/docs/app/building-your-application/routing/layouts-and-templates) 或 [路由处理器](/docs/app/building-your-application/routing/route-handlers)）
2. 直接返回 `NextResponse`。请参阅 [生成响应](#producing-a-response)

</AppOnly>

<PagesOnly>

要从中间件生成响应，您可以：

1. `rewrite` 到生成响应的路由（[页面](/docs/pages/building-your-application/routing/pages-and-layouts) 或 [边缘 API 路由](/docs/pages/building-your-application/routing/api-routes)）
2. 直接返回 `NextResponse`。请参阅 [生成响应](#producing-a-response)

</PagesOnly>

# 使用 Cookies

Cookies 是常规的头部。在 `Request` 中，它们存储在 `Cookie` 头部。在 `Response` 中，它们在 `Set-Cookie` 头部。Next.js 提供了一种方便的方式来访问和操作这些 Cookie，通过 `NextRequest` 和 `NextResponse` 上的 `cookies` 扩展。

1. 对于传入的请求，`cookies` 带有以下方法：`get`、`getAll`、`set` 和 `delete` Cookie。您可以使用 `has` 检查 Cookie 的存在，或使用 `clear` 删除所有 Cookie。
2. 对于传出的响应，`cookies` 有以下方法 `get`、`getAll`、`set` 和 `delete`。

```ts filename="middleware.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 假设传入请求中存在 "Cookie:nextjs=fast" 头部
  // 使用 `RequestCookies` API 从请求中获取 Cookie
  let cookie = request.cookies.get('nextjs')
  console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false

  // 使用 `ResponseCookies` API 在响应上设置 Cookie
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // 传出的响应将具有 `Set-Cookie:vercel=fast;path=/` 头部。

  return response
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'

export function middleware(request) {
  // 假设传入请求中存在 "Cookie:nextjs=fast" 头部
  // 使用 `RequestCookies` API 从请求中获取 Cookie
  let cookie = request.cookies.get('nextjs')
  console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false

  // 使用 `ResponseCookies` API 在响应上设置 Cookie
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // 传出的响应将具有 `Set-Cookie:vercel=fast;path=/test` 头部。

  return response
}
```
## 设置请求和响应头

您可以使用 `NextResponse` API 设置请求和响应头（从 Next.js v13.0.0 开始支持设置 _请求_ 头）。

```ts filename="middleware.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 克隆请求头并设置新头 `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')

  // 您也可以在 NextResponse.rewrite 中设置请求头
  const response = NextResponse.next({
    request: {
      // 新请求头
      headers: requestHeaders,
    },
  })

  // 设置新响应头 `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'

export function middleware(request) {
  // 克隆请求头并设置新头 `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')

  // 您也可以在 NextResponse.rewrite 中设置请求头
  const response = NextResponse.next({
    request: {
      // 新请求头
      headers: requestHeaders,
    },
  })

  // 设置新响应头 `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
}
```

> **须知**：避免设置过大的头，因为这可能会导致 [431 Request Header Fields Too Large](https://developer.mozilla.org/docs/Web/HTTP/Status/431) 错误，具体取决于您的后端 Web 服务器配置。
### CORS

您可以在中间件中设置CORS头以允许跨域请求，包括[简单请求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)和[预检请求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests)。

```tsx filename="middleware.ts" switcher
import { NextRequest, NextResponse } from 'next/server'

const allowedOrigins = ['https://acme.com', 'https://my-app.org']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function middleware(request: NextRequest) {
  // 检查请求中的来源
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // 处理预检请求
  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // 处理简单请求
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

```jsx filename="middleware.js" switcher
import { NextResponse } from 'next/server'

const allowedOrigins = ['https://acme.com', 'https://my-app.org']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function middleware(request) {
  // 检查请求中的来源
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // 处理预检请求
  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // 处理简单请求
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

<AppOnly>

> **须知：** 您可以在[路由处理器](/docs/app/building-your-application/routing/route-handlers#cors)中为个别路由配置CORS头。

</AppOnly>
# 生成响应

你可以直接从中间件返回一个`Response`或`NextResponse`实例来做出响应。（这自[Next.js v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-middleware)起可用）

```ts filename="middleware.ts" switcher
import { NextRequest } from 'next/server'
import { isAuthenticated } from '@lib/auth'

// 限制中间件仅适用于以 `/api/` 开头的路径
export const config = {
  matcher: '/api/:function*',
}

export function middleware(request: NextRequest) {
  // 调用我们的认证函数来检查请求
  if (!isAuthenticated(request)) {
    // 以JSON响应，指示错误消息
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

```js filename="middleware.js" switcher
import { isAuthenticated } from '@lib/auth'

// 限制中间件仅适用于以 `/api/` 开头的路径
export const config = {
  matcher: '/api/:function*',
}

export function middleware(request) {
  // 调用我们的认证函数来检查请求
  if (!isAuthenticated(request)) {
    // 以JSON响应，指示错误消息
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

### `waitUntil` 和 `NextFetchEvent`

`NextFetchEvent`对象扩展了原生的[`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent)对象，并包括了[`waitUntil()`](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil)方法。

`waitUntil()`方法接受一个promise作为参数，并延长中间件的生命周期直到promise解决。这对于在后台执行工作非常有用。

```ts filename="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

export function middleware(req: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://my-analytics-platform.com', {
      method: 'POST',
      body: JSON.stringify({ pathname: req.nextUrl.pathname }),
    })
  )

  return NextResponse.next()
}
```

## 高级中间件标志

在Next.js的`v13.1`版本中，为中间件引入了两个额外的标志，`skipMiddlewareUrlNormalize`和`skipTrailingSlashRedirect`，以处理高级用例。

`skipTrailingSlashRedirect`禁用了Next.js添加或删除尾部斜杠的重定向。这允许在中间件内部自定义处理，以保持某些路径的尾部斜杠，而不是其他路径，这可以使增量迁移变得更容易。

```js filename="next.config.js"
module.exports = {
  skipTrailingSlashRedirect: true,
}
```

```js filename="middleware.js"
const legacyPrefixes = ['/docs', '/blog']

export default async function middleware(req) {
  const { pathname } = req.nextUrl

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // 应用尾部斜杠处理
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    return NextResponse.redirect(
      new URL(`${req.nextUrl.pathname}/`, req.nextUrl)
    )
  }
}
```

`skipMiddlewareUrlNormalize`允许禁用Next.js中的URL规范化，以使直接访问和客户端转换的处理相同。在某些高级情况下，此选项通过使用原始URL提供了完全的控制。

```js filename="next.config.js"
module.exports = {
  skipMiddlewareUrlNormalize: true,
}
```

```js filename="middleware.js"
export default async function middleware(req) {
  const { pathname } = req.nextUrl

  // GET /_next/data/build-id/hello.json

  console.log(pathname)
  // 有了这个标志，现在它是 /_next/data/build-id/hello.json
  // 没有这个标志，它将被规范化为 /hello
}
```
# Runtime

中间件目前仅支持[Edge runtime](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)。Node.js运行时无法使用。

# Version History

| 版本   | 变更                                                                                       |
| --------- | --------------------------------------------------------------------------------------------- |
| `v13.1.0` | 添加了高级中间件标志                                                                 |
| `v13.0.0` | 中间件可以修改请求头、响应头，并发送响应                                                 |
| `v12.2.0` | 中间件已稳定，请查看[升级指南](/docs/messages/middleware-upgrade-guide) |
| `v12.0.9` | 在Edge Runtime中强制使用绝对URL ([PR](https://github.com/vercel/next.js/pull/33410))    |
| `v12.0.0` | 添加了中间件（Beta）                                                                       |