---
title: 内容安全策略
description: 学习如何为你的Next.js应用程序设置内容安全策略（CSP）。
related:
  links:
    - app/building-your-application/routing/middleware
    - app/api-reference/functions/headers
---

# 内容安全策略
[内容安全策略（CSP）](https://developer.mozilla.org/docs/Web/HTTP/CSP)对于保护你的Next.js应用程序免受各种安全威胁，如跨站脚本（XSS）、点击劫持和其他代码注入攻击非常重要。

通过使用CSP，开发者可以指定内容源、脚本、样式表、图像、字体、对象、媒体（音频、视频）、iframes等的允许来源。

<details>
  <summary>示例</summary>

- [严格CSP](https://github.com/vercel/next.js/tree/canary/examples/with-strict-csp)

</details>


## 随机数（Nonces）

一个[随机数（nonce）](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/nonce)是为一次性使用而创建的唯一、随机的字符字符串。它与CSP一起使用，可以选择性地允许某些内联脚本或样式执行，绕过严格的CSP指令。

### 为什么使用随机数？

尽管CSP旨在阻止恶意脚本，但在某些合法场景中内联脚本是必要的。在这种情况下，随机数提供了一种允许这些脚本在具有正确随机数的情况下执行的方法。
### 添加中间件中的nonce

【中间件】(/docs/app/building-your-application/routing/middleware) 允许您在页面渲染之前添加头部并生成nonce。

每次查看页面时，都应该生成一个新的nonce。这意味着您**必须使用动态渲染来添加nonce**。

例如：

```ts filename="middleware.ts" switcher
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  // 替换换行字符和空格
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  return response
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'

export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  // 替换换行字符和空格
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  return response
}
```

默认情况下，中间件在所有请求上运行。您可以使用[`matcher`](/docs/app/building-your-application/routing/middleware#matcher)过滤中间件以在特定路径上运行。

我们建议忽略匹配的预取（来自`next/link`）和不需要CSP头部的静态资源。

```ts filename="middleware.ts" switcher
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下以...开头的：
     * - api (API路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (favicon文件)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

```js filename="middleware.js" switcher
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下以...开头的：
     * - api (API路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (favicon文件)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

须知：在实际部署时，确保您的服务器配置正确地将nonce传递给客户端。
## 阅读随机数

现在，你可以使用 [`headers`](/docs/app/api-reference/functions/headers) 从 [Server Component](/docs/app/building-your-application/rendering/server-components) 中读取随机数：

```tsx filename="app/page.tsx" switcher
import { headers } from 'next/headers'
import Script from 'next/script'

export default function Page() {
  const nonce = headers().get('x-nonce')

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js"
      strategy="afterInteractive"
      nonce={nonce}
    />
  )
}
```

```jsx filename="app/page.jsx" switcher
import { headers } from 'next/headers'
import Script from 'next/script'

export default function Page() {
  const nonce = headers().get('x-nonce')

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js"
      strategy="afterInteractive"
      nonce={nonce}
    />
  )
}
```

## 无随机数

对于不需要随机数的应用程序，你可以直接在 [`next.config.js`](/docs/app/api-reference/next-config-js) 文件中设置 CSP 头部：

```js filename="next.config.js"
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

## 版本历史

我们建议使用 `v13.4.20+` 版本的 Next.js 来正确处理和应用随机数。