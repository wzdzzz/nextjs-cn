---
title: route.js
description: route.js 特殊文件的 API 参考。
---

路由处理器允许您使用 Web [Request](https://developer.mozilla.org/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/docs/Web/API/Response) API 为给定路由创建自定义请求处理器。

## HTTP 方法

一个 **route** 文件允许您为给定路由创建自定义请求处理器。支持以下 [HTTP 方法](https://developer.mozilla.org/docs/Web/HTTP/Methods)：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD` 和 `OPTIONS`。

```ts filename="route.ts" switcher
export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// 如果没有定义 `OPTIONS`，Next.js 将自动实现 `OPTIONS` 并根据路由处理器中定义的其他方法设置适当的响应 `Allow` 标头。
export async function OPTIONS(request: Request) {}
```

```js filename="route.js" switcher
export async function GET(request) {}

export async function HEAD(request) {}

export async function POST(request) {}

export async function PUT(request) {}

export async function DELETE(request) {}

export async function PATCH(request) {}

// 如果没有定义 `OPTIONS`，Next.js 将自动实现 `OPTIONS` 并根据路由处理器中定义的其他方法设置适当的响应 `Allow` 标头。
export async function OPTIONS(request) {}
```

> **须知**：路由处理器只能在 `app` 目录内使用。您**不需要**将 API 路由 (`pages`) 和路由处理器 (`app`) 一起使用，因为路由处理器应该能够处理所有用例。

## 参数

### `request`（可选）

`request` 对象是一个 [NextRequest](/docs/app/api-reference/functions/next-request) 对象，它是 Web [Request](https://developer.mozilla.org/docs/Web/API/Request) API 的扩展。`NextRequest` 为您提供了对传入请求的进一步控制，包括轻松访问 `cookies` 和一个扩展的、解析过的 URL 对象 `nextUrl`。

### `context`（可选）

```ts filename="app/dashboard/[team]/route.ts" switcher
type Params = {
  team: string
}

export async function GET(request: Request, context: { params: Params }) {
  const team = context.params.team // '1'
}

// 根据您的路由参数定义 params 类型（见下表）
```

```js filename="app/dashboard/[team]/route.js" switcher

export async function GET(request, context: { params }) {
  const team = context.params.team // '1'
}

```

`context` 的唯一值是 `params`，它是一个对象，包含当前路由的[动态路由参数](/docs/app/building-your-application/routing/dynamic-routes)。

| 示例                          | URL            | `params`                  |
| -------------------------------- | -------------- | ------------------------- |
| `app/dashboard/[team]/route.js`  | `/dashboard/1` | `{ team: '1' }`           |
| `app/shop/[tag]/[item]/route.js` | `/shop/1/2`    | `{ tag: '1', item: '2' }` |
| `app/blog/[...slug]/route.js`    | `/blog/1/2`    | `{ slug: ['1', '2'] }`    |

## NextResponse

路由处理器可以通过返回一个 `NextResponse` 对象来扩展 Web 响应 API。这允许您轻松设置 cookies、标头、重定向和重写。[查看 API 参考](/docs/app/api-reference/functions/next-response)。

## 版本历史

| 版本   | 变化                        |
| --------- | ------------------------------ |
| `v13.2.0` | 引入了路由处理器。 |