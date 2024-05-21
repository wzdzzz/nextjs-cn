---
title: 表单和变异
nav_title: 表单和变异
description: 学习如何在 Next.js 中处理表单提交和数据变异。
---

表单使您能够在 Web 应用程序中创建和更新数据。Next.js 提供了一种强大的方式，使用 **API Routes** 来处理表单提交和数据变异。

> **须知：**
>
> - 我们很快将推荐[逐步采用](/docs/app/building-your-application/upgrading/app-router-migration)App Router，并使用[Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)来处理表单提交和数据变异。Server Actions 允许您定义可以从组件直接调用的异步服务器函数，无需手动创建 API Route。
> - API Routes [不指定 CORS 标头](https://developer.mozilla.org/docs/Web/HTTP/CORS)，这意味着它们默认情况下仅允许同源请求。
> - 由于 API Routes 在服务器上运行，我们可以通过[环境变量](/docs/pages/building-your-application/configuring/environment-variables)使用敏感值（如 API 密钥），而不会暴露给客户端。这对您的应用程序的安全性至关重要。

## 示例

### 仅限服务器的表单

使用 Pages Router，您需要手动创建 API 端点来安全地处理服务器上的数据变异。

```ts filename="pages/api/submit.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const id = await createItem(data)
  res.status(200).json({ id })
}
```

```js filename="pages/api/submit.js" switcher
export default function handler(req, res) {
  const data = req.body
  const id = await createItem(data)
  res.status(200).json({ id })
}
```

然后，使用事件处理器从客户端调用 API Route：

```tsx filename="pages/index.tsx" switcher
import { FormEvent } from 'react'

export default function Page() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    })

    // 如有必要，处理响应
    const data = await response.json()
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">提交</button>
    </form>
  )
}
```

```jsx filename="pages/index.jsx" switcher
export default function Page() {
  async function onSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    })

    // 如有必要，处理响应
    const data = await response.json()
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">提交</button>
    </form>
  )
}
```
## 表单验证

我们建议使用 HTML 验证，如 `required` 和 `type="email"` 进行基本的客户端表单验证。

对于更高级的服务器端验证，您可以使用模式验证库，如 [zod](https://zod.dev/)，在变异数据之前验证表单字段：

```ts filename="pages/api/submit.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schema = z.object({
  // ...
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = schema.parse(req.body)
  // ...
}
```

```js filename="pages/api/submit.js" switcher
import { z } from 'zod'

const schema = z.object({
  // ...
})

export default async function handler(req, res) {
  const parsed = schema.parse(req.body)
  // ...
}
```

### 错误处理

您可以使用 React 状态在表单提交失败时显示错误消息：

```tsx filename="pages/index.tsx" switcher
import React, { useState, FormEvent } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // 在新请求开始时清除之前的错误

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }

      // 如有必要，处理响应
      const data = await response.json()
      // ...
    } catch (error) {
      // 捕获错误消息以显示给用户
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" name="name" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
```

```jsx filename="pages/index.jsx" switcher
import React, { useState } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // 在新请求开始时清除之前的错误

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }

      // 如有必要，处理响应
      const data = await response.json()
      // ...
    } catch (error) {
      // 捕获错误消息以显示给用户
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" name="name" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
```
## 显示加载状态

当表单在服务器上提交时，可以使用React状态来显示加载状态：

```tsx filename="pages/index.tsx" switcher
import React, { useState, FormEvent } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true) // 请求开始时将加载设置为true

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      // 如有必要，处理响应
      const data = await response.json()
      // ...
    } catch (error) {
      // 如有必要，处理错误
      console.error(error)
    } finally {
      setIsLoading(false) // 请求完成时将加载设置为false
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? '加载中...' : '提交'}
      </button>
    </form>
  )
}
```

```jsx filename="pages/index.jsx" switcher
import React, { useState } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true) // 请求开始时将加载设置为true

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      // 如有必要，处理响应
      const data = await response.json()
      // ...
    } catch (error) {
      // 如有必要，处理错误
      console.error(error)
    } finally {
      setIsLoading(false) // 请求完成时将加载设置为false
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? '加载中...' : '提交'}
      </button>
    </form>
  )
}
```

### 重定向

如果你想在变异操作后将用户重定向到不同的路由，你可以使用[`redirect`](/docs/pages/building-your-application/routing/api-routes#response-helpers)到任何绝对或相对URL：

```ts filename="pages/api/submit.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = await addPost()
  res.redirect(307, `/post/${id}`)
}
```

```js filename="pages/api/submit.js" switcher
export default async function handler(req, res) {
  const id = await addPost()
  res.redirect(307, `/post/${id}`)
}
```


### 设置cookies

你可以在API路由中使用响应上的`setHeader`方法来设置cookies：

```ts filename="pages/api/cookie.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Set-Cookie', 'username=lee; Path=/; HttpOnly')
  res.status(200).send('Cookie已设置。')
}
```

```js filename="pages/api/cookie.js" switcher
export default async function handler(req, res) {
  res.setHeader('Set-Cookie', 'username=lee; Path=/; HttpOnly')
  res.status(200).send('Cookie已设置。')
}
```


### 读取cookies

你可以在API路由中使用[`cookies`](/docs/pages/building-your-application/routing/api-routes#request-helpers)请求助手来读取cookies：

```ts filename="pages/api/cookie.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = req.cookies.authorization
  // ...
}
```

```js filename="pages/api/cookie.js" switcher
export default async function handler(req, res) {
  const auth = req.cookies.authorization
  // ...
}
```
### 删除 cookies

您可以在 API 路由中使用响应对象的 `setHeader` 方法来删除 cookies：

```ts filename="pages/api/cookie.ts" switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Set-Cookie', 'username=; Path=/; HttpOnly; Max-Age=0')
  res.status(200).send('Cookie has been deleted.')
}
```

```js filename="pages/api/cookie.js" switcher
export default async function handler(req, res) {
  res.setHeader('Set-Cookie', 'username=; Path=/; HttpOnly; Max-Age=0')
  res.status(200).send('Cookie has been deleted.')
}
```