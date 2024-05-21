---
title: NextResponse
description: NextResponse的API参考文档。
---



NextResponse在[Web Response API](https://developer.mozilla.org/docs/Web/API/Response)的基础上扩展了额外的便利方法。

## `cookies`

读取或修改响应的[`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)头部。

### `set(name, value)`

给定一个名称，为响应设置一个具有给定值的cookie。

```ts
// 给定传入请求 /home
let response = NextResponse.next()
// 设置一个cookie以隐藏横幅
response.cookies.set('show-banner', 'false')
// 响应将具有一个`Set-Cookie:show-banner=false;path=/home`头部
return response
```

### `get(name)`

给定一个cookie名称，返回cookie的值。如果未找到cookie，则返回`undefined`。如果找到多个cookie，则返回第一个。

```ts
// 给定传入请求 /home
let response = NextResponse.next()
// { name: 'show-banner', value: 'false', Path: '/home' }
response.cookies.get('show-banner')
```

### `getAll()`

给定一个cookie名称，返回cookie的值。如果没有指定名称，则返回响应上的所有cookie。

```ts
// 给定传入请求 /home
let response = NextResponse.next()
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
response.cookies.getAll('experiments')
// 或者，获取响应的所有cookie
response.cookies.getAll()
```

### `delete(name)`

给定一个cookie名称，从响应中删除cookie。

```ts
// 给定传入请求 /home
let response = NextResponse.next()
// 返回已删除的true，如果没有删除则返回false
response.cookies.delete('experiments')
```

## `json()`

生成一个具有给定JSON正文的响应。

```ts filename="app/api/route.ts" switcher
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
```

```js filename="app/api/route.js" switcher
import { NextResponse } from 'next/server'

export async function GET(request) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
```

## `redirect()`

生成一个重定向到[URL](https://developer.mozilla.org/docs/Web/API/URL)的响应。

```ts
import { NextResponse } from 'next/server'

return NextResponse.redirect(new URL('/new', request.url))
```

可以在`NextResponse.redirect()`方法中使用之前创建和修改[URL](https://developer.mozilla.org/docs/Web/API/URL)。例如，您可以使用`request.nextUrl`属性获取当前URL，然后修改它以重定向到不同的URL。

```ts
import { NextResponse } from 'next/server'

// 给定一个传入请求...
const loginUrl = new URL('/login', request.url)
// 在/login URL上添加`?from=/incoming-url`
loginUrl.searchParams.set('from', request.nextUrl.pathname)
// 然后重定向到新的URL
return NextResponse.redirect(loginUrl)
```

## `rewrite()`

生成一个重写（代理）给定[URL](https://developer.mozilla.org/docs/Web/API/URL)的响应，同时保留原始URL。

```ts
import { NextResponse } from 'next/server'

// 传入请求：/about，浏览器显示 /about
// 重写请求：/proxy，浏览器显示 /about
return NextResponse.rewrite(new URL('/proxy', request.url))
```
## next()

`next()` 方法对于中间件非常有用，因为它允许您提前返回并继续路由。

```ts
import { NextResponse } from 'next/server'

return NextResponse.next()
```

您还可以在生成响应时转发 `headers`：

```ts
import { NextResponse } from 'next/server'

// 给定一个传入请求...
const newHeaders = new Headers(request.headers)
// 添加一个新头
newHeaders.set('x-version', '123')
// 并使用新头生成响应
return NextResponse.next({
  request: {
    // 新的请求头
    headers: newHeaders,
  },
})
```