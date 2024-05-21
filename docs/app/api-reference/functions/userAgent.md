# userAgent

须知：本文档的内容在应用和页面路由器之间共享。你可以使用 `<PagesOnly>内容</PagesOnly>` 组件来添加特定于页面路由器的内容。任何共享的内容都不应被包裹在组件中。

`userAgent` 助手扩展了 [Web Request API](https://developer.mozilla.org/docs/Web/API/Request)，增加了额外的属性和方法，以便与请求中的用户代理对象进行交互。

```ts filename="middleware.ts" switcher
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const { device } = userAgent(request)
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
  url.searchParams.set('viewport', viewport)
  return NextResponse.rewrite(url)
}
```

```js filename="middleware.js" switcher
import { NextResponse, userAgent } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl
  const { device } = userAgent(request)
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
  url.searchParams.set('viewport', viewport)
  return NextResponse.rewrite(url)
}
```

## `isBot`

一个布尔值，指示请求是否来自已知的机器人。

## `browser`

一个包含请求中使用的浏览器信息的对象。

- `name`: 表示浏览器名称的字符串，如果无法识别则为 `undefined`。
- `version`: 表示浏览器版本的字符串，如果无法识别则为 `undefined`。

## `device`

一个包含请求中使用的设备信息的对象。

- `model`: 表示设备型号的字符串，如果无法识别则为 `undefined`。
- `type`: 表示设备类型的字符串，如 `console`, `mobile`, `tablet`, `smarttv`, `wearable`, `embedded` 或 `undefined`。
- `vendor`: 表示设备供应商的字符串，如果无法识别则为 `undefined`。

## `engine`

一个包含浏览器引擎信息的对象。

- `name`: 表示引擎名称的字符串。可能的值包括：`Amaya`, `Blink`, `EdgeHTML`, `Flow`, `Gecko`, `Goanna`, `iCab`, `KHTML`, `Links`, `Lynx`, `NetFront`, `NetSurf`, `Presto`, `Tasman`, `Trident`, `w3m`, `WebKit` 或 `undefined`。
- `version`: 表示引擎版本的字符串，如果无法识别则为 `undefined`。

## `os`

一个包含操作系统信息的对象。

- `name`: 表示操作系统名称的字符串，如果无法识别则为 `undefined`。
- `version`: 表示操作系统版本的字符串，如果无法识别则为 `undefined`。

## `cpu`

一个包含 CPU 架构信息的对象。

- `architecture`: 表示 CPU 架构的字符串。可能的值包括：`68k`, `amd64`, `arm`, `arm64`, `armhf`, `avr`, `ia32`, `ia64`, `irix`, `irix64`, `mips`, `mips64`, `pa-risc`, `ppc`, `sparc`, `sparc64` 或 `undefined`。