---
title: 重定向
description: 了解在 Next.js 中处理重定向的不同方式。
related:
  links:
    - app/api-reference/functions/redirect
    - app/api-reference/functions/permanentRedirect
    - app/building-your-application/routing/middleware
    - app/api-reference/next-config-js/redirects
---

在 Next.js 中有几种处理重定向的方法。本页将介绍每个可用选项、用例以及如何管理大量的重定向。

<AppOnly>

| API                                                            | 目的                                             | 位置                                             | 状态码                                 |
| -------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| [`redirect`](#redirect-function)                               | 事件或后端操作后重定向用户                       | 服务器组件、服务器操作、路由处理器               | 307 (临时) 或 303 (服务器操作)         |
| [`permanentRedirect`](#permanentredirect-function)             | 事件或后端操作后永久重定向用户                   | 服务器组件、服务器操作、路由处理器               | 308 (永久)                            |
| [`useRouter`](#userouter-hook)                                 | 执行客户端导航                                   | 客户端组件中的事件处理器                       | N/A                                    |
| [`next.config.js`](#redirects-in-nextconfigjs) 中的 `redirects`  | 根据路径重定向传入请求                           | `next.config.js` 文件                         | 307 (临时) 或 308 (永久)             |
| [`NextResponse.redirect`](#nextresponseredirect-in-middleware) | 根据条件重定向传入请求                           | 中间件                                        | 任意                                    |

</AppOnly>

<PagesOnly>

| API                                                            | 目的                                             | 位置                 | 状态码                        |
| -------------------------------------------------------------- | ------------------------------------------------- | --------------------- | ---------------------------------- |
| [`useRouter`](#userouter-hook)                                 | 执行客户端导航                                   | 组件                  | N/A                                |
| [`next.config.js`](#redirects-in-nextconfigjs) 中的 `redirects`  | 根据路径重定向传入请求                           | `next.config.js` 文件 | 307 (临时) 或 308 (永久)         |
| [`NextResponse.redirect`](#nextresponseredirect-in-middleware) | 根据条件重定向传入请求                           | 中间件                | 任意                                |

</PagesOnly>

<AppOnly>

## `redirect` 函数

`redirect` 函数允许您将用户重定向到另一个 URL。您可以在 [服务器组件](/docs/app/building-your-application/rendering/server-components)、[路由处理器](/docs/app/building-your-application/routing/route-handlers) 和 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中调用 `redirect`。

`redirect` 通常在后端操作或事件后使用。例如，创建一个帖子：

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

```markdown
# `redirect` 函数

`redirect` 函数允许你在 Next.js 应用中重定向到另一个路由。你可以在 [Server Components](/docs/app/building-your-application/rendering/server-components)、[Route Handlers](/docs/app/building-your-application/routing/route-handlers) 和 [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中调用 `redirect`。
```

下面是一个在成功创建帖子后重定向到该帖子页面的示例：

```tsx
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(req, res) {
  const { id } = await createPostInDatabase(req.body)

  if (!id) {
    throw new Error('Failed to create post')
  }

  res.status(307) // 临时重定向状态码
  res.setHeader('Location', `/post/${id}`) // 设置重定向的目标 URL

  // 捕获错误
  .catch(error) {
    // Handle errors
  }

  revalidatePath('/posts') // 更新缓存的帖子
  redirect(`/post/${id}`) // 导航到新帖子页面
}
```

> **小提示**：
>
> - `redirect` 默认返回 307（临时重定向）状态码。当在 Server Action 中使用时，它返回 303（查看其他），这通常用于将 POST 请求的结果重定向到成功页面。
> - `redirect` 在内部抛出一个错误，因此应该在 `try/catch` 块之外调用。
> - `redirect` 可以在客户端组件的渲染过程中调用，但不能在事件处理程序中调用。你可以使用 [`useRouter` 钩子](#userouter-hook) 代替。
> - `redirect` 也可以接受绝对 URL，并用于重定向到外部链接。
> - 如果你想在渲染过程之前重定向，可以使用 [`next.config.js`](#redirects-in-nextconfigjs) 或 [Middleware](#nextresponseredirect-in-middleware)。

有关更多信息，请查看 [`redirect` API 参考](/docs/app/api-reference/functions/redirect)。

# `permanentRedirect` 函数

`permanentRedirect` 函数允许你**永久**地将用户重定向到另一个 URL。你可以在 [Server Components](/docs/app/building-your-application/rendering/server-components)、[Route Handlers](/docs/app/building-your-application/routing/route-handlers) 和 [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 中调用 `permanentRedirect`。

`permanentRedirect` 通常在更改实体的规范 URL 后的突变或事件中使用，例如在用户更改用户名后更新他们的个人资料 URL：

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

  revalidateTag('username') // 更新用户名的所有引用
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

  revalidateTag('username') // 更新用户名的所有引用
  permanentRedirect(`/profile/${username}`) // 导航到新的用户个人资料
}
```

> **小提示**：
>
> - `permanentRedirect` 默认返回 308（永久重定向）状态码。
> - `permanentRedirect` 也可以接受绝对 URL，并用于重定向到外部链接。
> - 如果你想在渲染过程之前重定向，可以使用 [`next.config.js`](#redirects-in-nextconfigjs) 或 [Middleware](#nextresponseredirect-in-middleware)。

有关更多信息，请查看 [`permanentRedirect` API 参考](/docs/app/api-reference/functions/permanentRedirect)。

</AppOnly>

# `useRouter()` 钩子

<AppOnly>

如果你需要在客户端组件的事件处理程序中进行重定向，可以使用 `useRouter` 钩子中的 `push` 方法。例如：

```tsx filename="app/page.tsx" switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
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
      Dashboard
    </button>
  )
}
```

</AppOnly>

<PagesOnly>

如果你需要在组件内部重定向，你可以使用useRouter钩子中的' push '方法。例如:

```tsx filename="app/page.tsx" switcher
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
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
      Dashboard
    </button>
  )
}
```

</PagesOnly>


> **须知**：
>
> - 如果你不需要以编程方式导航用户，你应该使用 [`<Link>`](/docs/app/api-reference/components/link) 组件。

<AppOnly>

查看 [`useRouter` API 参考](/docs/app/api-reference/functions/use-router) 以获取更多信息。

</AppOnly>

<PagesOnly>

查看 [`useRouter` API 参考](/docs/pages/api-reference/functions/use-router) 以获取更多信息。

</PagesOnly>

## `next.config.js` 中的 `redirects`

`next.config.js` 文件中的 `redirects` 选项允许你将传入的请求路径重定向到不同的目标路径。当你更改页面的 URL 结构或已知有一系列重定向时，这非常有用。

`redirects` 支持 [路径](/docs/app/api-reference/next-config-js/redirects#路径匹配)，[头、cookie 和查询匹配](/docs/app/api-reference/next-config-js/redirects#头-cookie 和查询匹配)，让你可以根据传入的请求灵活地重定向用户。

要使用 `redirects`，请将其选项添加到你的 `next.config.js` 文件中：

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
  },
}
```

查看 [`redirects` API 参考](/docs/app/api-reference/next-config-js/redirects) 以获取更多信息。

> **须知**：
>
> - `redirects` 可以返回 307（临时重定向）或 308（永久重定向）状态码，使用 `permanent` 选项。
> - `redirects` 可能在平台上有限制。例如，在 Vercel 上，重定向的数量限制为 1,024。要管理大量重定向（1000+），请考虑使用 [中间件](/docs/app/building-your-application/routing/middleware) 创建自定义解决方案。查看 [大规模管理重定向](#大规模管理重定向-高级) 以获取更多信息。
> - `redirects` 在 **之前运行** Middleware。

## Middleware 中的 `NextResponse.redirect`

Middleware 允许你在请求完成之前运行代码。然后，根据传入的请求，使用 `NextResponse.redirect` 重定向到不同的 URL。如果你想根据条件（例如身份验证、会话管理等）重定向用户，或者有 [大量重定向](#大规模管理重定向-高级)，这非常有用。

例如，如果用户未通过身份验证，则将其重定向到 `/login` 页面：

```tsx filename="middleware.ts" switcher
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'

export function middleware(request: NextRequest) {
  const isAuthenticated = authenticate(request)

  // 如果用户已通过身份验证，则正常继续
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // 如果未通过身份验证，则重定向到登录页面
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

  // 如果用户已通过身份验证，则正常继续
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // 如果未通过身份验证，则重定向到登录页面
  return NextResponse.redirect(new URL('/login', request.url))
}

export const```markdown
# Middleware 配置

config = {
  matcher: '/dashboard/:path*',
}
```

> **须知**：
>
> - Middleware 在 `next.config.js` 中的 `redirects` 之后运行，且在渲染之前。

欲了解更多信息，请查看 [Middleware](/docs/app/building-your-application/routing/middleware) 文档。

## 大规模管理重定向（高级）

要管理大量重定向（1000+），您可能需要使用 Middleware 创建一个自定义解决方案。这允许您以编程方式处理重定向，而无需重新部署应用程序。

为此，您需要考虑：

1. 创建并存储重定向映射。
2. 优化数据查找性能。

> **Next.js 示例**：请查看我们的 [Middleware with Bloom filter](https://redirects-bloom-filter.vercel.app/) 示例，以了解以下建议的实现。

### 1. 创建并存储重定向映射

重定向映射是您可以存储在数据库（通常是键值存储）或 JSON 文件中的重定向列表。

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

在 [Middleware](/docs/app/building-your-application/routing/middleware) 中，您可以从数据库（如 Vercel 的 [Edge Config](https://vercel.com/docs/storage/edge-config/get-started?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 或 [Redis](https://vercel.com/docs/storage/vercel-kv?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)）中读取，并根据传入的请求重定向用户：

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

  // 未找到重定向，继续而不重定向
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

  // 未找到重定向，继续而不重定向
  return NextResponse.next()
}
```

### 2. 优化数据查找性能

对每个传入的请求读取大型数据集可能会很慢且成本高昂。您可以通过以下两种方式优化数据查找性能：

- 使用优化了快速读取的数据库，如 [Vercel Edge Config](https://vercel.com/docs/storage/edge-config/get-started?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 或 [Redis](https://vercel.com/docs/storage/vercel-kv?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)。
- 使用数据查找策略，如 [Bloom 过滤器](https://en.wikipedia.org/wiki/Bloom_filter)，在读取较大的重定向文件或数据库之前，高效地检查重定向是否存在。

考虑到前面的示例，您可以将生成的 Bloom 过滤器文件导入到 Middleware 中，然后检查传入请求的路径名是否存在于 Bloom 过滤器中。

如果存在，将请求转发到 <AppOnly>[Route Handler](/docs/app/building-your-application/routing/route-handlers)</AppOnly> <PagesOnly>[API Routes](/docs/pages/building-your-application/routing/api-routes)</PagesOnly>，它将检查实际文件并重定向。
```# 中间件

将用户引导到适当的 URL。这避免了将一个大型重定向文件导入到中间件中，这可能会减慢每个传入请求的速度。

```tsx filename="middleware.ts" switcher
import { NextResponse, NextRequest } from 'next/server'
import { ScalableBloomFilter } from 'bloom-filters'
import GeneratedBloomFilter from './redirects/bloom-filter.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

// 从生成的 JSON 文件初始化布隆过滤器
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter as any)

export async function middleware(request: NextRequest) {
  // 获取传入请求的路径
  const pathname = request.nextUrl.pathname

  // 检查路径是否在布隆过滤器中
  if (bloomFilter.has(pathname)) {
    // 将路径名转发到路由处理器
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin
    )

    try {
      // 从路由处理器获取重定向数据
      const redirectData = await fetch(api)

      if (redirectData.ok) {
        const redirectEntry: RedirectEntry | undefined =
          await redirectData.json()

        if (redirectEntry) {
          // 确定状态码
          const statusCode = redirectEntry.permanent ? 308 : 307

          // 重定向到目的地
          return NextResponse.redirect(redirectEntry.destination, statusCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 未找到重定向，继续请求而不重定向
  return NextResponse.next()
}
```

```js filename="middleware.js" switcher
import { NextResponse } from 'next/server'
import { ScalableBloomFilter } from 'bloom-filters'
import GeneratedBloomFilter from './redirects/bloom-filter.json'

// 从生成的 JSON 文件初始化布隆过滤器
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter)

export async function middleware(request) {
  // 获取传入请求的路径
  const pathname = request.nextUrl.pathname

  // 检查路径是否在布隆过滤器中
  if (bloomFilter.has(pathname)) {
    // 将路径名转发到路由处理器
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin
    )

    try {
      // 从路由处理器获取重定向数据
      const redirectData = await fetch(api)

      if (redirectData.ok) {
        const redirectEntry = await redirectData.json()

        if (redirectEntry) {
          // 确定状态码
          const statusCode = redirectEntry.permanent ? 308 : 307

          // 重定向到目的地
          return NextResponse.redirect(redirectEntry.destination, statusCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 未找到重定向，继续请求而不重定向
  return NextResponse.next()
}
```

<AppOnly>

然后，在路由处理器中：

```tsx filename="app/redirects/route.ts" switcher
import { NextRequest, NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }

  // 从 redirects.json 文件中获取重定向条目
  const redirect = (redirects as Record<string, RedirectEntry>)[pathname]

  // 考虑布隆过滤器的误报
  if (!redirect) {
    return new Response('No redirect', { status: 400 })
  }

  // 返回重定向条目
  return NextResponse.json(redirect)
}
```

```js filename="app/redirects/route.js" switcher
import { NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

export function GET(request) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }
```# 处理重定向

```jsx
import { NextResponse } from 'next/server';
import { redirects } from '@/app/redirects/redirects.json';

export function handler(req) {
  const pathname = req.nextUrl.searchParams.get('pathname");
  if (!pathname) {
    return new Response('Bad Request', { status: 400 });
  }

  // 从 redirects.json 文件中获取重定向条目
  const redirect = redirects[pathname];

  // 考虑布隆过滤器的误报
  if (!redirect) {
    return new Response('No redirect', { status: 400 });
  }

  // 返回重定向条目
  return NextResponse.json(redirect);
}
```

</AppOnly>

<PagesOnly>

然后在 API 路由中：

```tsx filename="pages/api/redirects.ts" switcher
import { NextApiRequest, NextApiResponse } from 'next';
import redirects from '@/app/redirects/redirects.json';

type RedirectEntry = {
  destination: string;
  permanent: boolean;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathname = req.query.pathname;
  if (!pathname) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  // 从 redirects.json 文件中获取重定向条目
  const redirect = (redirects as Record<string, RedirectEntry>)[pathname];

  // 考虑布隆过滤器的误报
  if (!redirect) {
    return res.status(400).json({ message: 'No redirect' });
  }

  // 返回重定向条目
  return res.json(redirect);
}
```

```js filename="pages/api/redirects.js" switcher
import redirects from '@/app/redirects/redirects.json';

export default function handler(req, res) {
  const pathname = req.query.pathname;
  if (!pathname) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  // 从 redirects.json 文件中获取重定向条目
  const redirect = redirects[pathname];

  // 考虑布隆过滤器的误报
  if (!redirect) {
    return res.status(400).json({ message: 'No redirect' });
  }

  // 返回重定向条目
  return res.json(redirect);
}
```

</PagesOnly>

> **须知：**
>
> - 要生成布隆过滤器，可以使用像 [`bloom-filters`](https://www.npmjs.com/package/bloom-filters) 这样的库。
> - 您应该验证对您的路由处理器的请求，以防止恶意请求。