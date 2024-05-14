---
title: Middleware
description: 学习如何使用中间件在请求完成之前运行代码。
---

{/* 本文档的内容在应用和页面路由之间共享。您可以使用 `<PagesOnly>Content</PagesOnly>` 组件添加特定于页面路由的内容。任何共享的内容都不应被包装在组件中。 */}

中间件允许您在请求完成之前运行代码。然后，根据传入的请求，您可以通过重写、重定向、修改请求或响应头，或直接响应来修改响应。

中间件在缓存内容和匹配路由之前运行。有关更多详细信息，请参见[匹配路径](#matching-paths)。

## 使用场景

将中间件集成到您的应用程序中可以显著提高性能、安全性和用户体验。以下是中间件特别有效的一些常见场景：

- 认证和授权：确保用户身份并在授予对特定页面或 API 路由的访问权限之前检查会话 cookie。
- 服务器端重定向：根据某些条件（例如，地区、用户角色）在服务器级别重定向用户。
- 路径重写：通过基于请求属性动态重写 API 路由或页面的路径来支持 A/B 测试、功能推出或遗留路径。
- 机器人检测：通过检测和阻止机器人流量来保护您的资源。
- 日志记录和分析：在页面或 API 处理之前捕获和分析请求数据以获得洞察。
- 功能标志：为无缝的功能推出或测试动态启用或禁用功能。

认识到中间件可能不是最佳方法的情况同样重要。以下是一些需要注意的场景：

- 复杂数据获取和操作：中间件不适用于直接数据获取或操作，这应该在路由处理程序或服务器端实用程序中完成。
- 重计算任务：中间件应该轻量级并快速响应，否则可能会导致页面加载延迟。重计算任务或长时间运行的进程应该在专用的路由处理程序中完成。
- 广泛的会话管理：虽然中间件可以管理基本的会话任务，但广泛的会话管理应该由专用的认证服务或在路由处理程序中管理。
- 直接数据库操作：不建议在中间件中执行直接数据库操作。数据库交互应该在路由处理程序或服务器端实用程序中完成。

## 约定

在项目的根目录中使用文件 `middleware.ts`（或 `.js`）来定义中间件。例如，与 `pages` 或 `app` 同级，或者如果适用的话，放在 `src` 目录内。

> **注意**：虽然每个项目只支持一个 `middleware.ts` 文件，但您仍然可以将中间件逻辑模块化地组织。将中间件功能拆分为单独的 `.ts` 或 `.js` 文件，并将它们导入到您的主要 `middleware.ts` 文件中。这允许更干净地管理特定于路由的中间件，在 `middleware.ts` 中进行集中控制。通过强制使用单个中间件文件，它简化了配置，防止了潜在的冲突，并优化了性能，避免了多个中间件层。

## 示例

```ts filename="middleware.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 这个函数如果内部使用 `await` 可以标记为 `async`
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// 有关更多信息，请参见下面的“匹配路径”
export const config = {
  matcher: '/about/:path*',
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'

// 这个函数如果内部使用 `await` 可以标记为 `async`
export function middleware(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// 有关更多信息，请参见下面的“匹配路径”
export const config = {
  matcher: '/about/:path*',
}
``````markdown
# 匹配路径

中间件将被调用到项目中的**每一个路由**。鉴于此，使用匹配器来精确地定位或排除特定路由至关重要。以下是执行顺序：

1. `next.config.js` 中的 `headers`
2. `next.config.js` 中的 `redirects`
3. 中间件（`rewrites`、`redirects` 等）
4. `next.config.js` 中的 `beforeFiles`（`rewrites`）
5. 文件系统路由（`public/`、`_next/static/`、`pages/`、`app/` 等）
6. `next.config.js` 中的 `afterFiles`（`rewrites`）
7. 动态路由（`/blog/[slug]`）
8. `next.config.js` 中的 `fallback`（`rewrites`）

有两种方式可以定义中间件将运行在哪些路径上：

1. [自定义匹配器配置](#matcher)
2. [条件语句](#conditional-statements)

### 匹配器

`matcher` 允许您过滤中间件以在特定路径上运行。

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

`matcher` 配置允许使用完整的正则表达式，因此支持匹配否定前瞻或字符匹配。下面是一个匹配除特定路径之外的所有路径的示例：

```js filename="middleware.js"
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以以下内容开头的：
     * - api（API路由）
     * - _next/static（静态文件）
     * - _next/image（图片优化文件）
     * - favicon.ico（favicon文件）
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

您还可以使用 `missing` 或 `has` 数组，或两者的组合，来绕过某些请求的中间件：

```js filename="middleware.js"
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以以下内容开头的：
     * - api（API路由）
     * - _next/static（静态文件）
     * - _next/image（图片优化文件）
     * - favicon.ico（favicon文件）
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
4. 可以使用括号内的正则表达式：`/about/(.*)` 与 `/about/:path*` 相同

更多详细信息，请查看 [path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1) 文档。

> **须知**：为了向后兼容，Next.js 总是将 `/public` 视为 `/public/index`。因此，`/public/:path` 的匹配器将匹配 `/public/index`。

### 条件语句

```ts filename="middleware.ts" switcher
import {# 中间件

```js
import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url));
  }
}
```

# NextResponse

`NextResponse` API 允许您：

- 将传入的请求 `redirect` 到不同的 URL
- 通过显示给定的 URL `rewrite` 响应
- 为 API 路由、`getServerSideProps` 和 `rewrite` 目标设置请求头
- 设置响应 cookie
- 设置响应头

<AppOnly>

要从中间件生成响应，您可以：

1. `rewrite` 到一个生成响应的路由（[页面](/docs/app/building-your-application/routing/layouts-and-templates)或[路由处理器](/docs/app/building-your-application/routing/route-handlers)）
2. 直接返回一个 `NextResponse`。请参阅 [生成响应](#producing-a-response)。

</AppOnly>

<PagesOnly>

要从中间件生成响应，您可以：

1. `rewrite` 到一个生成响应的路由（[页面](/docs/pages/building-your-application/routing/pages-and-layouts)或[边缘 API 路由](/docs/pages/building-your-application/routing/api-routes)）
2. 直接返回一个 `NextResponse`。请参阅 [生成响应](#producing-a-response)。

</PagesOnly>

# 使用 Cookies

Cookies 是常规的头部。在 `Request` 中，它们存储在 `Cookie` 头部。在 `Response` 中，它们在 `Set-Cookie` 头部。Next.js 提供了一种方便的方式来访问和操作这些通过 `NextRequest` 和 `NextResponse` 上的 `cookies` 扩展。

1. 对于传入的请求，`cookies` 带有以下方法：`get`、`getAll`、`set` 和 `delete` cookies。您可以使用 `has` 检查 cookie 的存在，或使用 `clear` 删除所有 cookies。
2. 对于传出的响应，`cookies` 有以下方法 `get`、`getAll`、`set` 和 `delete`。

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 假设传入请求的头部有 "Cookie:nextjs=fast"
  // 使用 `RequestCookies` API 从请求中获取 cookies
  let cookie = request.cookies.get('nextjs');
  console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll();
  console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs'); // => true
  request.cookies.delete('nextjs');
  request.cookies.has('nextjs'); // => false

  // 使用 `ResponseCookies` API 在响应上设置 cookies
  const response = NextResponse.next();
  response.cookies.set('vercel', 'fast');
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  });
  cookie = response.cookies.get('vercel');
  console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  // 传出的响应将有一个 `Set-Cookie:vercel=fast;path=/` 头部。

  return response;
}
```

```js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // 假设传入请求的头部有 "Cookie:nextjs=fast"
  // 使用 `RequestCookies` API 从请求中获取 cookies
  let cookie = request.cookies.get('nextjs');
  console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll();
  console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs'); // => true
  request.cookies.delete('nextjs');
  request.cookies.has('nextjs'); // => false

  // 使用 `ResponseCookies` API 在响应上设置 cookies
  // ...
}
```## 设置 Cookies

你可以使用 `NextResponse` API 设置请求和响应的 Cookies（自 Next.js v13.0.0 起，设置请求 Cookies 可用）。

```ts filename="middleware.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 设置名为 'vercel' 的 Cookie
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  // 或者设置一个具有更多选项的 Cookie
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  // 获取名为 'vercel' 的 Cookie
  const cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // 传出的响应将包含一个 `Set-Cookie:vercel=fast;path=/test` 的头信息

  return response
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'

export function middleware(request) {
  // 设置名为 'vercel' 的 Cookie
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  // 或者设置一个具有更多选项的 Cookie
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  // 获取名为 'vercel' 的 Cookie
  const cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // 传出的响应将包含一个 `Set-Cookie:vercel=fast;path=/test` 的头信息

  return response
}
```

## 设置头部

你可以使用 `NextResponse` API 设置请求和响应头部（设置请求头部自 Next.js v13.0.0 起可用）。

```ts filename="middleware.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 克隆请求头部并设置一个新的头部 `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')

  // 你也可以在 NextResponse.rewrite 中设置请求头部
  const response = NextResponse.next({
    request: {
      // 新的请求头部
      headers: requestHeaders,
    },
  })

  // 设置一个新的响应头部 `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'

export function middleware(request) {
  // 克隆请求头部并设置一个新的头部 `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')

  // 你也可以在 NextResponse.rewrite 中设置请求头部
  const response = NextResponse.next({
    request: {
      // 新的请求头部
      headers: requestHeaders,
    },
  })

  // 设置一个新的响应头部 `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
}
```

> **须知**：避免设置过大的头部，因为这可能会导致 [431 Request Header Fields Too Large](https://developer.mozilla.org/docs/Web/HTTP/Status/431) 错误，这取决于你的后端 Web 服务器配置。

### CORS

你可以在中间件中设置 CORS 头部以允许跨源请求，包括 [简单](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests) 和 [预检](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests) 请求。

```tsx filename="middleware.ts" switcher
import { NextRequest, NextResponse } from 'next/server'

const allowedOrigins = ['https://acme.com', 'https://my-app.org']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function middleware(request: NextRequest) {
  // 从请求中检查来源
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // 处理预检请求
  const isPreflight = request.method === 'OPTIONS'

  if```markdown
# CORS 配置

```typescript
const isAllowedOrigin = allowedOrigins.includes(origin)

// 处理预请求请求
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

> **你知道吗：** 你可以在[路由处理器](/docs/app/building-your-application/routing/route-handlers#cors)中为个别路由配置 CORS 头。

</AppOnly>

# 生成响应

你可以直接从中间件返回响应，通过返回一个 `Response` 或 `NextResponse` 实例。（这在 [Next.js v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-middleware) 中可用）

```typescript filename="middleware.ts" switcher
import { NextRequest } from 'next/server'
import { isAuthenticated } from '@lib/auth'

// 将中间件限制为以 `/api/` 开头的路径
export const config = {
  matcher: '/api/:function*',
}

export function middleware(request: NextRequest) {
  // 调用我们的认证函数来检查请求
  if (!isAuthenticated(request)) {
    // 用 JSON 响应表示错误信息
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

```javascript filename="middleware.js" switcher
import { isAuthenticated } from '@lib/auth'

// 将中间件限制为以 `/api/` 开头的路径
export const config = {
  matcher: '/api/:function*',
}

export function middleware(request) {
  // 调用我们的认证函数来检查请求
  if (!isAuthenticated(request)) {
    // 用 JSON 响应表示错误信息
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

## `waitUntil` 和 `NextFetchEvent`

`NextFetchEvent` 对象扩展了原生的 [`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent) 对象，并包括了 [`waitUntil()`](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil) 方法。

`waitUntil()` 方法接受一个 promise 作为参数，并延长中间件的生命周期直到 promise 确定。这在后台执行工作时非常有用。

```typescript filename="middleware.ts"
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

# 高级中间件标志

在 Next.js 的 `v13.1` 中引入了两个额外的标志用于中间件，`skipMiddlewareUrlNormalize` 和 `skipTrailingSlashRedirect` 来处理高级用例。

`skipTrailingSlashRedirect` 禁用了 Next.js 添加或删除尾随斜杠的重定向。这允许在中间件中自定义处理，以保持某些路径的尾随斜杠，而不是其他路径，这可以使增量迁移更容易。

```javascript filename="next.config.js"
module.exports = {
  skipTrailingSlashRedirect: true,
}
```

```javascript filename="middleware.js"
const legacyPrefixes = ['/docs', '/blog']

export default async function middleware(req) {
  const { pathname } = req.nextUrl

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // 应用尾随斜杠处理
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+)$/)
  ) {
    return NextResponse.redirect(`${pathname}/`)
  }

  return NextResponse.next()
}
```# Middleware

中间件是一种服务器端功能，允许你在 Next.js 应用中执行自定义逻辑。你可以使用它来处理请求、修改请求头、修改响应头，甚至发送响应。

中间件会根据你的应用结构自动运行，无需额外配置。如果你的应用是单页面应用（SPA），中间件将在每次客户端路由跳转时运行。如果你的应用是服务器渲染应用（SSR），中间件将在每次服务器请求时运行。

## 使用

要使用中间件，你需要在你的 Next.js 应用中创建一个名为 `middleware.js` 的文件。这个文件应该导出一个异步函数，该函数接收一个 `req`（请求）对象作为参数。

```js filename="middleware.js"
export default async function middleware(req) {
  // 你的自定义逻辑
}
```

## 示例

以下是一个简单的中间件示例，它将所有以 `/api` 开头的请求重定向到 `/`。

```js filename="middleware.js"
export default async function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
}
```

## 重定向

如果你的中间件需要重定向请求，你可以使用 `NextResponse.redirect()` 方法。

```js filename="middleware.js"
import { NextResponse } from 'next/server'

export default async function middleware(req) {
  // 检查路径是否以 'old-path' 开头
  if (req.nextUrl.pathname.startsWith('/old-path')) {
    // 重定向到 'new-path'
    return NextResponse.redirect(new URL('/new-path', req.nextUrl))
  }
}
```

## 修改请求头

你可以使用 `NextResponse` 修改请求头。

```js filename="middleware.js"
import { NextResponse } from 'next/server'

export default async function middleware(req) {
  return NextResponse.modify(req, {
    headers: {
      'x-custom-header': 'custom-value',
    },
  })
}
```

## 修改响应头

你可以使用 `NextResponse` 修改响应头。

```js filename="middleware.js"
import { NextResponse } from 'next/server'

export default async function middleware(req) {
  const response = NextResponse.next()
  
  // 修改响应头
  new Headers(response.headers).append('X-Custom-Header', 'custom-value')
  
  return response
}
```

## 发送响应

你可以使用 `NextResponse` 发送响应。

```js filename="middleware.js"
import { NextResponse } from 'next/server'

export default async function middleware(req) {
  return new NextResponse('Hello, world!', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
```

## 跳过中间件

如果你想要跳过中间件处理，可以返回 `NextResponse.next()`。

```js filename="middleware.js"
import { NextResponse } from 'next/server'

export default async function middleware(req) {
  // 你的自定义逻辑
  // 如果需要跳过中间件
  return NextResponse.next()
}
```

## 跳过中间件URL规范化

有时，你可能想要跳过 Next.js 的 URL 规范化，以使直接访问和客户端转换的处理方式相同。在一些高级用例中，这个选项可以提供完全的控制权，使用原始 URL。

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
  // 开启标志后，这里将是 /_next/data/build-id/hello.json
  // 否则，将被规范化为 /hello
}
```

## 运行时

中间件目前只支持 [Edge 运行时](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)。Node.js 运行时不能使用。

## 版本历史

| 版本   | 变更                                                                                       |
| --------- | --------------------------------------------------------------------------------------------- |
| `v13.1.0` | 添加了高级中间件标志                                                               |
| `v13.0.0` | 中间件可以修改请求头、响应头，并发送响应                   |
| `v12.2.0` | 中间件稳定版，请查看 [升级指南](/docs/messages/middleware-upgrade-guide) |
| `v12.0.9` | 在 Edge 运行时强制使用绝对 URL ([PR](https://github.com/vercel/next.js/pull/33410))    |
| `v12.0.0` | 添加了中间件（Beta）                                                                       |