---
title: middleware.js
description: middleware.js 文件的 API 参考。
related:
  title: 了解更多关于 Middleware
  links:
    - app/building-your-application/routing/middleware
---

`middleware.js|ts` 文件用于编写 [Middleware](/docs/app/building-your-application/routing/middleware) 并在请求完成之前在服务器上运行代码。然后，根据传入的请求，您可以通过重写、重定向、修改请求或响应头或直接响应来修改响应。

Middleware 在路由呈现之前执行。它特别适用于实现自定义服务器端逻辑，如身份验证、记录日志或处理重定向。

使用项目根目录中的 `middleware.ts`（或 .js）文件来定义 Middleware。例如，与 `app` 或 `pages` 同级，或者如果适用，放在 `src` 内部。

```tsx filename="middleware.ts" switcher
import { NextResponse, NextRequest } from 'next/server'

// 这个函数如果内部使用了 `await` 可以标记为 `async`
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'

// 这个函数如果内部使用了 `await` 可以标记为 `async`
export function middleware(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```


## 导出

### Middleware 函数

该文件必须导出一个函数，可以是默认导出或命名为 `middleware`。请注意，不支持从同一文件中导出多个 middleware。

```js filename="middleware.js"
// 默认导出的示例
export default function middleware(request) {
  // Middleware 逻辑
}
```

### 配置对象（可选）

可以与 Middleware 函数一起导出一个配置对象。这个对象包括 [matcher](#matcher) 来指定 Middleware 应用的路径。

#### Matcher

`matcher` 选项允许您为目标路径运行 Middleware。您可以以多种方式指定这些路径：

- 对于单个路径：直接使用字符串定义路径，如 `'/about'`。
- 对于多个路径：使用数组列出多个路径，例如 `matcher: ['/about', '/contact']`，将 Middleware 应用于 `/about` 和 `/contact`。

此外，`matcher` 支持通过正则表达式进行复杂的路径规范，例如 `matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']`，允许您精确控制包含或排除哪些路径。

`matcher` 选项还接受一个对象数组，每个对象包含以下键：

- `source`：用于匹配请求路径的路径或模式。它可以是直接路径匹配的字符串，或者用于更复杂匹配的模式。
- `regexp`（可选）：一个正则表达式字符串，根据 source 微调匹配。它提供了对包含或排除哪些路径的额外控制。
- `locale`（可选）：一个布尔值，当设置为 `false` 时，忽略基于语言环境的路由路径匹配。
- `has`（可选）：根据特定请求元素的存在指定条件，例如标头、查询参数或 cookie。
- `missing`（可选）：专注于请求元素缺失的条件，如缺失的标头或 cookie。

```js filename="middleware.js"
export const config = {
  matcher: [
    {
      source: '/api/*',
      regexp: '^/api/(.*)',
      locale: false,
      has: [
        { type: 'header', key: 'Authorization', value: 'Bearer Token' },
        { type: 'query', key: 'userId', value: '123' },
      ],
      missing: [{ type: 'cookie', key: 'session', value: 'active' }],
    },
  ],
}
```
## 参数

### `request`

在定义中间件时，默认导出的函数接受一个参数，`request`。这个参数是 `NextRequest` 的一个实例，它代表传入的 HTTP 请求。

```tsx filename="middleware.ts" switcher
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 中间件逻辑放在这里
}
```

```js filename="middleware.js" switcher
export function middleware(request) {
  // 中间件逻辑放在这里
}
```

> **须知**：
>
> - `NextRequest` 是一个类型，它在 Next.js 中间件中代表传入的 HTTP 请求，而 [`NextResponse`](#nextresponse) 是一个用于操作和发送回 HTTP 响应的类。

## NextResponse

中间件可以使用 [`NextResponse`](/docs/app/building-your-application/routing/middleware#nextresponse) 对象，它扩展了 [Web 响应 API](https://developer.mozilla.org/en-US/docs/Web/API/Response)。通过返回一个 `NextResponse` 对象，你可以直接操作 cookies，设置 headers，实现重定向和重写路径。

> **须知**：对于重定向，你也可以使用 `Response.redirect` 而不是 `NextResponse.redirect`。

## 运行时

中间件只支持 [Edge 运行时](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)。Node.js 运行时不能使用。

## 版本历史

| 版本   | 变更                                                                                       |
| --------- | --------------------------------------------------------------------------------------------- |
| `v13.1.0` | 添加了高级中间件标志                                                               |
| `v13.0.0` | 中间件可以修改请求头、响应头，并发送响应                   |
| `v12.2.0` | 中间件稳定，请参阅 [升级指南](/docs/messages/middleware-upgrade-guide) |
| `v12.0.9` | 在 Edge 运行时强制使用绝对 URL ([PR](https://github.com/vercel/next.js/pull/33410))    |
| `v12.0.0` | 添加了中间件（Beta）                                                                       |