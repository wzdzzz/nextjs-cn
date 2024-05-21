---
title: NextRequest
description: NextRequest的API参考。
---



NextRequest通过额外的便利方法扩展了[Web Request API](https://developer.mozilla.org/docs/Web/API/Request)。

## `cookies`

读取或修改请求的[`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)头部。

### `set(name, value)`

给定一个名称，为请求设置一个具有给定值的cookie。

```ts
// 给定传入请求 /home
// 设置一个cookie以隐藏横幅
// 请求将具有一个`Set-Cookie:show-banner=false;path=/home`头部
request.cookies.set('show-banner', 'false')
```

### `get(name)`

给定一个cookie名称，返回cookie的值。如果找不到cookie，则返回`undefined`。如果找到多个cookie，则返回第一个。

```ts
// 给定传入请求 /home
// { name: 'show-banner', value: 'false', Path: '/home' }
request.cookies.get('show-banner')
```

### `getAll()`

给定一个cookie名称，返回cookie的值。如果没有给出名称，则返回请求上的所有cookie。

```ts
// 给定传入请求 /home
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
request.cookies.getAll('experiments')
// 或者，获取请求的所有cookie
request.cookies.getAll()
```

### `delete(name)`

给定一个cookie名称，从请求中删除cookie。

```ts
// 删除返回true，如果没有删除则返回false
request.cookies.delete('experiments')
```

### `has(name)`

给定一个cookie名称，如果请求上存在cookie，则返回`true`。

```ts
// 如果存在cookie则返回true，否则返回false
request.cookies.has('experiments')
```

### `clear()`

从请求中移除`Set-Cookie`头部。

```ts
request.cookies.clear()
```
## `nextUrl`

扩展了原生 [`URL`](https://developer.mozilla.org/docs/Web/API/URL) API，增加了额外的便利方法，包括特定于 Next.js 的属性。

```ts
// 给定请求到 /home，pathname 是 /home
request.nextUrl.pathname
// 给定请求到 /home?name=lee，searchParams 是 { 'name': 'lee' }
request.nextUrl.searchParams
```

以下是可用的选项：

<PagesOnly>

| 属性          | 类型                      | 描述                                                                                                                     |
| ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `basePath`        | `string`                  | URL 的 [基础路径](/docs/pages/api-reference/next-config-js/basePath)。                                                  |
| `buildId`         | `string` \| `undefined`   | Next.js 应用程序的构建标识符。可以被 [自定义](/docs/pages/api-reference/next-config-js/generateBuildId)。 |
| `defaultLocale`   | `string` \| `undefined`   | [国际化](/docs/pages/building-your-application/routing/internationalization)的默认区域设置。              |
| `domainLocale`    |                           |                                                                                                                                 |
| - `defaultLocale` | `string`                  | 域内默认的区域设置。                                                                                             |
| - `domain`        | `string`                  | 与特定区域设置关联的域。                                                                                   |
| - `http`          | `boolean` \| `undefined`  | 指示域是否使用 HTTP。                                                                                          |
| `locales`         | `string[]` \| `undefined` | 可用区域设置的数组。                                                                                                  |
| `locale`          | `string` \| `undefined`   | 当前活动的区域设置。                                                                                                    |
| `url`             | `URL`                     | URL 对象。                                                                                                                 |

</PagesOnly>

<AppOnly>

| 属性       | 类型                    | 描述                                                                                                                   |
| -------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `basePath`     | `string`                | URL 的 [基础路径](/docs/app/api-reference/next-config-js/basePath)。                                                  |
| `buildId`      | `string` \| `undefined` | Next.js 应用程序的构建标识符。可以被 [自定义](/docs/app/api-reference/next-config-js/generateBuildId)。 |
| `pathname`     | `string`                | URL 的路径名。                                                                                                      |
| `searchParams` | `Object`                | URL 的搜索参数。                                                                                             |

> **须知：** 页面路由器中的国际化属性在应用路由器中不可用。了解更多关于 [应用路由器的国际化](/docs/app/building-your-application/routing/internationalization)。

</AppOnly>
## `ip`

`ip` 属性是一个字符串，包含了请求的 IP 地址。这个值可以由你的托管平台选择性提供。

> **须知：** 在 [Vercel](https://vercel.com/docs/frameworks/nextjs?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 上，这个值默认提供。在其他平台上，你可以使用 [`X-Forwarded-For`](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-For) 头部来提供 IP 地址。

```ts
// Vercel 提供
request.ip
// 自托管
request.headers.get('X-Forwarded-For')
```

## `geo`

`geo` 属性是一个对象，包含了请求的地理信息。这个值可以由你的托管平台选择性提供。

> **须知：** 在 [Vercel](https://vercel.com/docs/frameworks/nextjs?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 上，这个值默认提供。在其他平台上，你可以使用 [`X-Forwarded-For`](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-For) 头部来提供 IP 地址，然后使用 [第三方服务](https://ip-api.com/) 查询地理信息。

```ts
// Vercel 提供
request.geo.city
request.geo.country
request.geo.region
request.geo.latitude
request.geo.longitude

// 自托管
function getGeo(request) {
  let ip = request.headers.get('X-Forwarded-For')
  // 使用第三方服务查询地理信息
}
```