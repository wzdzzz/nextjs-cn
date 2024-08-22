# 重定向

了解在Next.js中处理重定向的不同方法。本页面将介绍每个可用选项、用例以及如何管理大量的重定向。

<AppOnly>

| API                                                            | 目的                                               | 位置                                             | 状态码                                |
| -------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| [`redirect`](#redirect-function)                               | 在突变或事件后重定向用户                         | 服务器组件、服务器操作、路由处理器               | 307（临时）或303（服务器操作）         |
| [`permanentRedirect`](#permanentredirect-function)             | 在突变或事件后重定向用户                         | 服务器组件、服务器操作、路由处理器               | 308（永久）                            |
| [`useRouter`](#userouter-hook)                                 | 执行客户端导航                                   | 客户端组件中的事件处理器                         | N/A                                    |
| [`redirects` in `next.config.js`](#redirects-in-nextconfigjs)  | 基于路径重定向传入请求                           | `next.config.js` 文件                             | 307（临时）或308（永久）               |
| [`NextResponse.redirect`](#nextresponseredirect-in-middleware) | 基于条件重定向传入请求                           | 中间件                                            | 任意                                   |
</AppOnly>
<PagesOnly>

| API                                                            | 目的                                               | 位置                 | 状态码                                |
| -------------------------------------------------------------- | ------------------------------------------------- | --------------------- | ---------------------------------- |
| [`useRouter`](#userouter-hook)                                 | 执行客户端导航                                   | 组件                  | N/A                                |
| [`redirects` in `next.config.js`](#redirects-in-nextconfigjs)  | 基于路径重定向传入请求                           | `next.config.js` 文件 | 307（临时）或308（永久）             |
| [`NextResponse.redirect`](#nextresponseredirect-in-middleware) | 基于条件重定向传入请求                           | 中间件                | 任意                                |
</PagesOnly>
<AppOnly>

（注：原文中AppOnly标签后没有提供进一步的内容，因此此处不进行翻译。）
## `redirect` 函数

`redirect` 函数允许您将用户重定向到另一个URL。您可以在 [Server Components](/docs/app/building-your-application/rendering/server-components)、[Route Handlers](/docs/app/building-your-application/routing/route-handlers) 和 [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中调用 `redirect`。

`redirect` 通常在执行完一个突变或事件后使用。例如，创建一个帖子：

```tsx filename="app/actions.tsx" switcher
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(id: string) {
  try {
    // 调用数据库
  } catch (error) {
    // 处理错误
  }

  revalidatePath('/posts') // 更新缓存的帖子
  redirect(`/post/${id}`) // 导航到新帖子页面
}
```

```jsx filename="app/actions.js" switcher
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(id) {
  try {
    // 调用数据库
  } catch (error) {
    // 处理错误
  }

  revalidatePath('/posts') // 更新缓存的帖子
  redirect(`/post/${id}`) // 导航到新帖子页面
}
```

> **须知**：
>
> - `redirect` 默认返回一个 307（临时重定向）状态码。当在 Server Action 中使用时，它返回一个 303（查看其他），通常用于将用户重定向到 POST 请求结果的成功页面。
> - `redirect` 内部抛出一个错误，所以它应该在 `try/catch` 块之外调用。
> - `redirect` 可以在客户端组件的渲染过程中调用，但不能在事件处理程序中调用。您可以改用 [`useRouter` 钩子](#userouter-hook)。
> - `redirect` 还接受绝对URL，并可用于重定向到外部链接。
> - 如果您希望在渲染过程之前进行重定向，请使用 [`next.config.js`](#redirects-in-nextconfigjs) 或 [Middleware](#nextresponseredirect-in-middleware)。

有关更多信息，请查看 [`redirect` API 参考](/docs/app/api-reference/functions/redirect)。
## `permanentRedirect` 函数

`permanentRedirect` 函数允许您**永久性**地将用户重定向到另一个URL。您可以在[Server Components](/docs/app/building-your-application/rendering/server-components)、[Route Handlers](/docs/app/building-your-application/routing/route-handlers)和[Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)中调用 `permanentRedirect`。

`permanentRedirect` 通常在变更实体的标准URL后使用，例如在用户更改用户名后更新其个人资料URL：

```tsx filename="app/actions.ts" switcher
'use server'

import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function updateUsername(username: string, formData: FormData) {
  try {
    // 调用数据库
  } catch (error) {
    // 处理错误
  }

  revalidateTag('username') // 更新所有对用户名的引用
  permanentRedirect(`/profile/${username}`) // 导航到新的用户个人资料
}
```

```jsx filename="app/actions.js" switcher
'use server'

import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function updateUsername(username, formData) {
  try {
    // 调用数据库
  } catch (error) {
    // 处理错误
  }

  revalidateTag('username') // 更新所有对用户名的引用
  permanentRedirect(`/profile/${username}`) // 导航到新的用户个人资料
}
```

> **须知**：
>
> - `permanentRedirect` 默认返回 308（永久重定向）状态码。
> - `permanentRedirect` 也接受绝对URL，并且可以用于重定向到外部链接。
> - 如果您希望在渲染过程之前进行重定向，请使用 [`next.config.js`](#redirects-in-nextconfigjs) 或 [Middleware](#nextresponseredirect-in-middleware)。

请参阅 [`permanentRedirect` API 参考](/docs/app/api-reference/functions/permanentRedirect) 以获取更多信息。

</AppOnly>

## `useRouter()` 钩子

<AppOnly>

如果您需要在客户端组件中的事件处理器内进行重定向，您可以使用 `useRouter` 钩子的 `push` 方法。例如：

```tsx filename="app/page.tsx" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      仪表盘
    </button>
  )
}
```

```jsx filename="app/page.js" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      仪表盘
    </button>
  )
}
```

</AppOnly>

<PagesOnly>

如果您需要在组件内进行重定向，您可以使用 `useRouter` 钩子的 `push` 方法。例如：

```tsx filename="app/page.tsx" switcher
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      仪表盘
    </button>
  )
}
```

```jsx filename="app/page.js" switcher
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      仪表盘
    </button>
  )
}
```

</PagesOnly>

> **须知**：
>
> - 如果您不需要以编程方式导航用户，您应该使用 [`<Link>`](/docs/app/api-reference/components/link) 组件。

<AppOnly>

请参阅 [`useRouter` API 参考](/docs/app/api-reference/functions/use-router) 以获取更多信息。

</AppOnly>

<PagesOnly>

请参阅 [`useRouter` API 参考](/docs/pages/api-reference/functions/use-router) 以获取更多信息。

</PagesOnly>
## `next.config.js` 中的 `redirects`

`next.config.js` 文件中的 `redirects` 选项允许您将传入的请求路径重定向到不同的目标路径。当您更改页面的URL结构或事先知道一系列重定向时，这非常有用。

`redirects` 支持 [路径](/docs/app/api-reference/next-config-js/redirects#path-matching)、[标头、Cookie 和查询匹配](/docs/app/api-reference/next-config-js/redirects#header-cookie-and-query-matching)，为您提供了根据传入请求重定向用户的灵活性。

要使用 `redirects`，请将其选项添加到您的 `next.config.js` 文件中：

```js filename="next.config.js"
module.exports = {
  async redirects() {
    return [
      // 基本重定向
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      // 通配符路径匹配
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  }
}
```

有关更多信息，请参见 [`redirects` API 参考](/docs/app/api-reference/next-config-js/redirects)。

> **须知**：
>
> - `redirects` 可以使用 `permanent` 选项返回 307（临时重定向）或 308（永久重定向）状态码。
> - `redirects` 在平台上可能有限制。例如，在 Vercel 上，重定向的数量限制为 1,024。要管理大量重定向（1000+），请考虑使用 [中间件](/docs/app/building-your-application/routing/middleware) 创建自定义解决方案。请参阅 [大规模管理重定向](#大规模管理重定向-高级) 以获取更多信息。
> - `redirects` 在中间件之前运行。

## 中间件中的 `NextResponse.redirect`

中间件允许您在请求完成之前运行代码。然后，根据传入的请求，使用 `NextResponse.redirect` 重定向到不同的 URL。如果您想根据条件（例如身份验证、会话管理等）重定向用户，或者有 [大量重定向](#大规模管理重定向-高级)，这非常有用。

例如，如果用户未经身份验证，则将其重定向到 `/login` 页面：

```tsx filename="middleware.ts" switcher
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'

export function middleware(request: NextRequest) {
  const isAuthenticated = authenticate(request)

  // 如果用户已通过身份验证，则继续正常操作
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // 如果未经身份验证，则重定向到登录页面
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'
import { authenticate } from 'auth-provider'

export function middleware(request) {
  const isAuthenticated = authenticate(request)

  // 如果用户已通过身份验证，则继续正常操作
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // 如果未经身份验证，则重定向到登录页面
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

> **须知**：
>
> - 中间件在 `next.config.js` 中的 `redirects` 之后和渲染之前运行。

有关更多信息，请参见 [中间件](/docs/app/building-your-application/routing/middleware) 文档。

## 大规模管理重定向（高级）

要管理大量重定向（1000+），您可能需要考虑使用中间件创建自定义解决方案。这允许您以编程方式处理重定向，而无需重新部署应用程序。

为此，您需要考虑：

1. 创建和存储重定向映射。
2. 优化数据查找性能。

> **Next.js 示例**：请参阅我们的 [带有 Bloom 过滤器的中间件](https://redirects-bloom-filter.vercel.app/) 示例，了解以下建议的实现。
### 创建和存储重定向映射

重定向映射是一个重定向列表，您可以将其存储在数据库中（通常是键值存储）或JSON文件中。

考虑以下数据结构：

```json
{
  "/old": {
    "destination": "/new",
    "permanent": true
  },
  "/blog/post-old": {
    "destination": "/blog/post-new",
    "permanent": true
  }
}
```

在[中间件](/docs/app/building-your-application/routing/middleware)中，您可以从数据库（如Vercel的[Edge Config](https://vercel.com/docs/storage/edge-config/get-started?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)或[Redis](https://vercel.com/docs/storage/vercel-kv?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)）中读取，并根据传入的请求重定向用户：

```tsx filename="middleware.ts" switcher
import { NextResponse, NextRequest } from 'next/server'
import { get } from '@vercel/edge-config'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)

  if (redirectData && typeof redirectData === 'string') {
    const redirectEntry: RedirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }

  // 未找到重定向，继续不重定向
  return NextResponse.next()
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)

  if (redirectData) {
    const redirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }

  // 未找到重定向，继续不重定向
  return NextResponse.next()
}
```

### 优化数据查找性能

对每个传入的请求读取大型数据集可能会很慢且成本高昂。您可以通过以下两种方式优化数据查找性能：

- 使用针对快速读取进行优化的数据库，例如[Vercel Edge Config](https://vercel.com/docs/storage/edge-config/get-started?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)或[Redis](https://vercel.com/docs/storage/vercel-kv?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)。
- 使用诸如[布隆过滤器](https://en.wikipedia.org/wiki/Bloom_filter)之类的数据查找策略，以高效地检查重定向是否存在，**然后再读取较大的重定向文件或数据库**。

考虑到前面的示例，您可以将生成的布隆过滤器文件导入到中间件中，然后，检查传入请求的路径名是否存在于布隆过滤器中。

如果存在，将请求转发到<AppOnly>[路由处理器](/docs/app/building-your-application/routing/route-handlers)</AppOnly> <PagesOnly>[API路由](/docs/pages/building-your-application/routing/api-routes)</PagesOnly>，它将检查实际文件并将用户重定向到适当的URL。这避免了将大型重定向文件导入中间件，这可能会减慢每个传入请求的速度。

须知：
>
> - 要生成布隆过滤器，您可以使用像[`bloom-filters`](https://www.npmjs.com/package/bloom-filters)这样的库。
> - 您应该验证对路由处理器发出的请求，以防止恶意请求。