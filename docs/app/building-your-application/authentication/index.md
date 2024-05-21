---
title: 认证
description: 学习如何在您的Next.js应用中实现认证。
---
# 认证 
理解认证对于保护应用数据至关重要。本页将指导您使用React和Next.js的功能来实现认证。

开始之前，有助于将过程分解为三个概念：

1. **[认证](#认证)**：验证用户是否是他们自称的身份。它要求用户用他们拥有的东西（如用户名和密码）来证明他们的身份。
2. **[会话管理](#会话管理)**：在请求之间跟踪用户的认证状态。
3. **[授权](#授权)**：决定用户可以访问哪些路由和数据。

下图显示了使用React和Next.js功能进行认证流程的图示：

<img
  alt="显示React和Next.js功能进行认证流程的图示"
  src="https://nextjs.org/_next/image?url=/docs/light/authentication-overview.png&w=3840&q=75"
  srcDark="/docs/dark/authentication-overview.png"
  width="1600"
  height="1383"
/>

本页的示例将介绍基本的用户名和密码认证，以教育为目的。虽然您可以实现自定义认证解决方案，但为了提高安全性和简化操作，我们建议使用认证库。这些库提供了内置的认证、会话管理和授权解决方案，以及社交登录、多因素认证和基于角色的访问控制等其他功能。您可以在[认证库](#认证库)部分找到列表。

## 认证

<AppOnly>

### 注册和登录功能

您可以使用[`<form>`](https://react.dev/reference/react-dom/components/form)元素与React的[服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)、[`useFormStatus()`](https://react.dev/reference/react-dom/hooks/useFormStatus)和[`useActionState()`](https://react.dev/reference/react/useActionState)来捕获用户凭据、验证表单字段，并调用您的认证提供商的API或数据库。

由于服务器操作总是在服务器上执行，它们为处理认证逻辑提供了一个安全的环境。

以下是实现注册/登录功能的步骤：

#### 1. 捕获用户凭据

为了捕获用户凭据，创建一个表单，该表单在提交时调用服务器操作。例如，一个注册表单接受用户的姓名、电子邮件和密码：

```tsx filename="app/ui/signup-form.tsx" switcher
import { signup } from '@/app/actions/auth'

export function SignupForm() {
  return (
    <form action={signup}>
      <div>
        <label htmlFor="name">姓名</label>
        <input id="name" name="name" placeholder="姓名" />
      </div>
      <div>
        <label htmlFor="email">电子邮件</label>
        <input id="email" name="email" type="email" placeholder="电子邮件" />
      </div>
      <div>
        <label htmlFor="password">密码</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">注册</button>
    </form>
  )
}
```

```jsx filename="app/ui/signup-form.js" switcher
import { signup } from '@/app/actions/auth'

export function SignupForm() {
  return (
    <form action={signup}>
      <div>
        <label htmlFor="name">姓名</label>
        <input id="name" name="name" placeholder="姓名" />
      </div>
      <div>
        <label htmlFor="email">电子邮件</label>
        <input id="email" name="email" type="email" placeholder="电子邮件" />
      </div>
      <div>
        <label htmlFor="password">密码</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">注册</button>
    </form>
  )
}
```

```tsx filename="app/actions/auth.tsx" switcher
export async function signup(formData: FormData) {}
```

```jsx filename="app/actions/auth.js" switcher
export async function signup(formData) {}
```
### 2. 在服务器上验证表单字段

使用服务器操作来在服务器上验证表单字段。如果您的认证提供者不提供表单验证，您可以使用像 [Zod](https://zod.dev/) 或 [Yup](https://github.com/jquense/yup) 这样的模式验证库。

以 Zod 为例，您可以定义一个表单模式并附上适当的错误消息：

```ts filename="app/lib/definitions.ts" switcher
import { z } from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: '姓名至少需要2个字符。' })
    .trim(),
  email: z.string().email({ message: '请输入有效的电子邮件。' }).trim(),
  password: z
    .string()
    .min(8, { message: '至少需要8个字符。' })
    .regex(/[a-zA-Z]/, { message: '至少包含一个字母。' })
    .regex(/[0-9]/, { message: '至少包含一个数字。' })
    .regex(/[^a-zA-Z0-9]/, {
      message: '至少包含一个特殊字符。',
    })
    .trim(),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

```


```js filename="app/lib/definitions.js" switcher
import { z } from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: '姓名至少需要2个字符。' })
    .trim(),
  email: z.string().email({ message: '请输入有效的电子邮件。' }).trim(),
  password: z
    .string()
    .min(8, { message: '至少需要8个字符。' })
    .regex(/[a-zA-Z]/, { message: '至少包含一个字母。' })
    .regex(/[0-9]/, { message: '至少包含一个数字。' })
    .regex(/[^a-zA-Z0-9]/, {
      message: '至少包含一个特殊字符。',
    })
    .trim(),
})

```

为了防止对您的认证提供者的 API 或数据库进行不必要的调用，如果任何表单字段与定义的模式不匹配，您可以在服务器操作中 `return` 提前退出。

```ts filename="app/actions/auth.ts" switcher
import { SignupFormSchema, FormState } from '@/app/lib/definitions'

export async function signup(state: FormState, formData) {
  // 验证表单字段
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // 如果任何表单字段无效，提前返回
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 调用提供者或数据库创建用户...
}

```


```js filename="app/actions/auth.js" switcher
import { SignupFormSchema } from '@/app/lib/definitions'

export async function signup(state, formData) {
  // 验证表单字段
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // 如果任何表单字段无效，提前返回
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 调用提供者或数据库创建用户...
}

```

回到您的 `<SignupForm />` 中，您可以使用 React 的 `useActionState()` 钩子向用户显示验证错误：
# AppOnly

```tsx filename="app/ui/signup-form.tsx" switcher highlight={7,15,21,27-36}
'use client'

import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'

export function SignupForm() {
  const [state, action] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">姓名</label>
        <input id="name" name="name" placeholder="姓名" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">邮箱</label>
        <input id="email" name="email" placeholder="邮箱" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">密码</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>密码必须：</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <SignupButton />
    </form>
  )
}
```


```jsx filename="app/ui/signup-form.js" switcher highlight={7,15,21,27-36}
'use client'

import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'

export function SignupForm() {
  const [state, action] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">姓名</label>
        <input id="name" name="name" placeholder="John Doe" />
      </div>
      {state.errors.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">邮箱</label>
        <input id="email" name="email" placeholder="john@example.com" />
      </div>
      {state.errors.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">密码</label>
        <input id="password" name="password" type="password" />
      </div>
      {state.errors.password && (
        <div>
          <p>密码必须：</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <SignupButton />
    </form>
  )
}

```

您还可以使用 `useFormStatus()` 钩子来处理表单提交时的等待状态：

```tsx filename="app/ui/signup-form.tsx" highlight={6} switcher
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

export function SignupButton() {
  const { pending } = useFormStatus()

  return (
    <button aria-disabled={pending} type="submit">
      {pending ? '提交中...' : '注册'}
    </button>
  )
}

```


```jsx filename="app/ui/signup-form.js"  highlight={6} switcher
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

export function SignupButton() {
  const { pending } = useFormStatus()

  return (
    <button aria-disabled={pending} type="submit">
      {pending ? '提交中...' : '注册'}
    </button>
  )
}

```

> **须知：** `useFormStatus()` 必须在 `<form>` 内部渲染的组件中调用。更多信息请参见 [React Docs](https://react.dev/reference/react-dom/hooks/useFormStatus#usage)。

#### 3. 创建用户或检查用户凭据

验证表单字段后，您可以通过调用您的身份验证提供程序的 API 或数据库来创建一个新用户账户或检查用户是否存在。

从前面的示例继续：
### auth.tsx

```tsx
export async function signup(state: FormState, formData: FormData) {
  // 1. 验证表单字段
  // ...

  // 2. 准备插入数据库的数据
  const { name, email, password } = validatedFields.data
  // 例如，在存储之前对用户的密码进行哈希处理
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. 将用户插入数据库或调用身份验证库的API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: '创建您的账户时发生了错误。',
    }
  }

  // TODO:
  // 4. 创建用户会话
  // 5. 重定向用户
}
```

### auth.js

```jsx
export async function signup(state, formData) {
  // 1. 验证表单字段
  // ...

  // 2. 准备插入数据库的数据
  const { name, email, password } = validatedFields.data
  // 例如，在存储之前对用户的密码进行哈希处理
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. 将用户插入数据库或调用库的API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: '创建您的账户时发生了错误。',
    }
  }

  // TODO:
  // 4. 创建用户会话
  // 5. 重定向用户
}

```

成功创建用户账户或验证用户凭据后，您可以创建会话来管理用户的身份验证状态。根据您的会话管理策略，会话可以存储在cookie或数据库中，或两者兼有。请继续阅读[会话管理](#会话管理)部分以了解更多信息。

> **须知：**
>
> - 上面的示例是冗长的，因为它为了教育目的分解了身份验证步骤。这突出了实现自己的安全解决方案可能很快就会变得复杂。考虑使用[身份验证库](#auth-libraries)来简化流程。
> - 为了改善用户体验，您可能希望在注册流程的早期检查重复的电子邮件或用户名。例如，当用户输入用户名或输入字段失去焦点时。这可以帮助防止不必要的表单提交并为用户提供即时反馈。您可以使用[use-debounce](https://www.npmjs.com/package/use-debounce)等库来防抖请求，以管理这些检查的频率。

</AppOnly>

<PagesOnly>

以下是实现注册和/或登录表单的步骤：

1. 用户通过表单提交他们的凭据。
2. 表单发送一个由API路由处理的请求。
3. 成功验证后，流程完成，表明用户已成功认证。
4. 如果验证失败，将显示错误消息。

考虑一个登录表单，用户可以在其中输入他们的凭据：

```
# 登录页面

```tsx filename="pages/login.tsx" switcher
import { FormEvent } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      router.push('/profile')
    } else {
      // 处理错误
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">登录</button>
    </form>
  )
}
```


```jsx filename="pages/login.jsx" switcher
import { FormEvent } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      router.push('/profile')
    } else {
      // 处理错误
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">登录</button>
    </form>
  )
}

```

上面的表单有两个输入字段，用于捕获用户的电子邮件和密码。提交时，它会触发一个函数，该函数向 API 路由（`/api/auth/login`）发送 POST 请求。

然后，你可以在 API 路由中调用你的认证提供者的 API 来处理认证：

```ts filename="pages/api/auth/login.ts" switcher
import { NextApiRequest, NextApiResponse } from 'next'
import { signIn } from '@/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body
    await signIn('credentials', { email, password })

    res.status(200).json({ success: true })
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res.status(401).json({ error: '无效的凭证。' })
    } else {
      res.status(500).json({ error: '出了点问题。' })
    }
  }
}

```


```js filename="pages/api/auth/login.js" switcher
import { signIn } from '@/auth'

export default async function handler(req, res) {
  try {
    const { email, password } = req.body
    await signIn('credentials', { email, password })

    res.status(200).json({ success: true })
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res.status(401).json({ error: '无效的凭证。' })
    } else {
      res.status(500).json({ error: '出了点问题。' })
    }
  }
}

```

</PagesOnly>
## 会话管理

会话管理确保用户的认证状态在请求之间得以保持。它涉及创建、存储、刷新和删除会话或令牌。

有两种类型的会话：

1. [**无状态**](#无状态会话)：会话数据（或令牌）存储在浏览器的cookie中。cookie随每个请求一起发送，允许在服务器上验证会话。这种方法更简单，但如果不正确实现，可能不太安全。
2. [**数据库**](#数据库会话)：会话数据存储在数据库中，用户的浏览器只接收加密的会话ID。这种方法更安全，但可能更复杂，并且使用更多的服务器资源。

> **须知：** 尽管您可以使用任一方法，或两种都用，我们建议使用会话管理库，如[iron-session](https://github.com/vvo/iron-session)或[Jose](https://github.com/panva/jose)。

### 无状态会话

<AppOnly>

要创建和管理无状态会话，您需要遵循以下几个步骤：

1. 生成一个密钥，该密钥将用于签署您的会话，并将其存储为[环境变量](/docs/app/building-your-application/configuring/environment-variables)。
2. 使用会话管理库编写加密/解密会话数据的逻辑。
3. 使用Next.js的[`cookies()`](/docs/app/api-reference/functions/cookies) API管理cookie。

除了上述内容，考虑添加功能以在用户返回应用程序时[更新（或刷新）](#更新或刷新会话)会话，并在用户注销时[删除](#删除会话)会话。

> **须知：** 检查您的[认证库](#认证库)是否包含会话管理。

#### 1. 生成密钥

有几种方法可以生成用于签署会话的密钥。例如，您可以选择在终端中使用`openssl`命令：

```bash filename="terminal"
openssl rand -base64 32
```

此命令生成一个32个字符的随机字符串，您可以将其用作密钥，并存储在您的[环境变量文件](/docs/app/building-your-application/configuring/environment-variables)中：

```bash filename=".env"
SESSION_SECRET=your_secret_key
```

然后，您可以在会话管理逻辑中引用此密钥：

```js filename="app/lib/session.js"
const secretKey = process.env.SESSION_SECRET
```
# 加密和解密会话

接下来，您可以使用您喜欢的[会话管理库](#会话管理库)来加密和解密会话。继续前面的示例，我们将使用[Jose](https://www.npmjs.com/package/jose)（与[Edge Runtime](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)兼容）和React的[`server-only`](https://www.npmjs.com/package/server-only)包，以确保您的会话管理逻辑仅在服务器上执行。

```tsx filename="app/lib/session.ts" switcher
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/app/lib/definitions'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}
```

```jsx filename="app/lib/session.js" switcher
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}
```

> **技巧**：
>
> - 有效载荷应包含**最少**、唯一的用户数据，这些数据将在后续请求中使用，例如用户的ID、角色等。它不应包含个人身份信息，如电话号码、电子邮件地址、信用卡信息等，或敏感数据，如密码。
### 设置cookies（推荐选项）

要将会话存储在cookie中，请使用Next.js的[`cookies()`](/docs/app/api-reference/functions/cookies) API。cookie应该在服务器上设置，并包含以下推荐选项：

- **HttpOnly**：防止客户端JavaScript访问cookie。
- **Secure**：使用https发送cookie。
- **SameSite**：指定cookie是否可以随跨站点请求发送。
- **Max-Age或Expires**：在一定时间后删除cookie。
- **Path**：为cookie定义URL路径。

有关这些选项的更多信息，请参阅[MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)。

```ts filename="app/lib/session.ts" switcher
import 'server-only'
import { cookies } from 'next/headers'

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

```js filename="app/lib/session.js" switcher
import 'server-only'
import { cookies } from 'next/headers'

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

回到您的服务器操作中，您可以调用`createSession()`函数，并使用[`redirect()`](/docs/app/building-your-application/routing/redirecting) API将用户重定向到适当的页面：

```ts filename="app/actions/auth.ts" switcher
import { createSession } from '@/app/lib/session'

export async function signup(state: FormState, formData: FormData) {
  // 之前的步骤：
  // 1. 验证表单字段
  // 2. 准备插入数据库的数据
  // 3. 将用户插入数据库或调用库API

  // 当前步骤：
  // 4. 创建用户会话
  await createSession(user.id)
  // 5. 重定向用户
  redirect('/profile')
}
```

```js filename="app/actions/auth.js" switcher
import { createSession } from '@/app/lib/session'

export async function signup(state, formData) {
  // 之前的步骤：
  // 1. 验证表单字段
  // 2. 准备插入数据库的数据
  // 3. 将用户插入数据库或调用库API

  // 当前步骤：
  // 4. 创建用户会话
  await createSession(user.id)
  // 5. 重定向用户
  redirect('/profile')
}
```

> **小贴士**：
>
> - **应将cookie设置在服务器上**，以防止客户端篡改。
> - 🎥 观看：了解更多关于无状态会话和使用Next.js进行身份验证的信息 → [YouTube（11分钟）](https://www.youtube.com/watch?v=DJvM2lSPn6w)。
# 更新（或刷新）会话

您还可以延长会话的过期时间。这对于在用户再次访问应用程序后保持用户登录状态非常有用。例如：

```ts filename="app/lib/session.ts" switcher
import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export async function updateSession() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}
```

```js filename="app/lib/session.js" switcher
import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export async function updateSession() {
  const session = cookies().get('session').value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}
```

> **提示：** 检查您的认证库是否支持刷新令牌，这可以用来延长用户的会话。

# 删除会话

要删除会话，您可以删除cookie：

```ts filename="app/lib/session.ts" switcher
import 'server-only'
import { cookies } from 'next/headers'

export function deleteSession() {
  cookies().delete('session')
}
```

```js filename="app/lib/session.js" switcher
import 'server-only'
import { cookies } from 'next/headers'

export function deleteSession() {
  cookies().delete('session')
}
```

然后，您可以在应用程序中重用`deleteSession()`函数，例如，在注销时：

```ts filename="app/actions/auth.ts" switcher
import { cookies } from 'next/headers'
import { deleteSession } from '@/app/lib/session'

export async function logout() {
  deleteSession()
  redirect('/login')
}
```

```js filename="app/actions/auth.js" switcher
import { cookies } from 'next/headers'
import { deleteSession } from '@/app/lib/session'

export async function logout() {
  deleteSession()
  redirect('/login')
}
```

</AppOnly>

<PagesOnly>


# 设置和删除cookie

您可以使用[API Routes](/docs/pages/building-your-application/routing/api-routes)在服务器上将会话设置为cookie：

```ts filename="pages/api/login.ts" switcher
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { encrypt } from '@/app/lib/session'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionData = req.body
  const encryptedSessionData = encrypt(sessionData)

  const cookie = serialize('session', encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 一周
    path: '/',
  })
  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ message: 'Successfully set cookie!' })
}
```

```js filename="pages/api/login.js" switcher
import { serialize } from 'cookie'
import { encrypt } from '@/app/lib/session'

export default function handler(req, res) {
  const sessionData = req.body
  const encryptedSessionData = encrypt(sessionData)

  const cookie = serialize('session', encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 一周
    path: '/',
  })
  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ message: 'Successfully set cookie!' })
}
```

</PagesOnly>


须知：在处理会话和cookie时，请确保您的应用程序遵循最佳安全实践，例如使用HTTPS和设置适当的cookie属性。
### 数据库会话

要创建和管理数据库会话，您需要按照以下步骤操作：

1. 在数据库中创建一个表来存储会话和数据（或者检查您的认证库是否处理了这一点）。
2. 实现插入、更新和删除会话的功能。
3. 在将会话ID存储到用户浏览器之前进行加密，并确保数据库和cookie保持同步（这是可选的，但建议用于[中间件](#使用中间件进行乐观检查-可选)中的乐观认证检查）。

<AppOnly>

例如：

```ts filename="app/lib/session.ts" switcher
import cookies from 'next/headers'
import { db } from '@/app/lib/db'
import { encrypt } from '@/app/lib/session'

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. 在数据库中创建会话
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // 返回会话ID
    .returning({ id: sessions.id })

  const sessionId = data[0].id

  // 2. 加密会话ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. 为了乐观认证检查，将会话存储在cookie中
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

```js filename="app/lib/session.js" switcher
import cookies from 'next/headers'
import { db } from '@/app/lib/db'
import { encrypt } from '@/app/lib/session'

export async function createSession(id) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. 在数据库中创建会话
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // 返回会话ID
    .returning({ id: sessions.id })

  const sessionId = data[0].id

  // 2. 加密会话ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. 为了乐观认证检查，将会话存储在cookie中
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

> **技巧**：
>
> - 为了更快的数据检索，考虑使用像[Vercel Redis](https://vercel.com/docs/storage/vercel-kv)这样的数据库。不过，您也可以将会话数据保留在主数据库中，并组合数据请求以减少查询次数。
> - 您可以选择使用数据库会话来处理更高级的用例，例如跟踪用户上次登录的时间，或活动设备的数量，或允许用户从所有设备注销。

实现会话管理后，您需要添加授权逻辑来控制用户在应用程序中的访问权限和操作。请继续阅读[授权](#授权)部分以了解更多。

</AppOnly>

<PagesOnly>

**在服务器上创建会话**：

```ts filename="pages/api/create-session.ts" switcher
import db from '../../lib/db'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = req.body
    const sessionId = generateSessionId()
    await db.insertSession({
      sessionId,
      userId: user.id,
      createdAt: new Date(),
    })

    res.status(200).json({ sessionId })
  } catch (error) {
    res.status(500).json({ error: '内部服务器错误' })
  }
}
```

```js filename="pages/api/create-session.js" switcher
import db from '../../lib/db'

export default async function handler(req, res) {
  try {
    const user = req.body
    const sessionId = generateSessionId()
    await db.insertSession({
      sessionId,
      userId: user.id,
      createdAt: new Date(),
    })

    res.status(200).json({ sessionId })
  } catch (error) {
    res.status(500).json({ error: '内部服务器错误' })
  }
}
```

</PagesOnly>
## 授权

一旦用户通过身份验证并创建会话，您可以实施授权来控制用户在您的应用程序中可以访问和执行的操作。

主要有两种类型的授权检查：

1. **乐观型**：使用存储在cookie中的会话数据检查用户是否有权访问路由或执行操作。这些检查适用于快速操作，例如显示/隐藏UI元素或根据权限或角色重定向用户。
2. **安全型**：使用存储在数据库中的会话数据检查用户是否有权访问路由或执行操作。这些检查更安全，用于需要访问敏感数据或操作。

对于这两种情况，我们建议：

- 创建一个[数据访问层](#创建一个数据访问层-dal)来集中您的授权逻辑
- 使用[数据传输对象（DTO）](#使用数据传输对象-dto)仅返回必要的数据
- 可选地使用[中间件](#乐观型检查与中间件-可选)执行乐观型检查。

### 乐观型检查与中间件（可选）

在某些情况下，您可能希望使用[中间件](/docs/app/building-your-application/routing/middleware)并根据权限重定向用户：

- 执行乐观型检查。由于中间件在每个路由上运行，它是集中重定向逻辑和预先过滤未授权用户的好方法。
- 保护在用户之间共享数据的静态路由（例如付费墙后的内容）。

然而，由于中间件在每个路由上运行，包括[预取](/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)路由，重要的是只从cookie中读取会话（乐观型检查），并避免数据库检查以防止性能问题。

例如：

```tsx filename="middleware.ts" switcher
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

// 1. 指定受保护和公共路由
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function middleware(req: NextRequest) {
  // 2. 检查当前路由是受保护还是公共
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. 从cookie解密会话
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  // 5. 如果用户未通过身份验证，则重定向到 /login
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 6. 如果用户已通过身份验证，则重定向到 /dashboard
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware 不应运行的路由
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

```
```markdown
# middleware.js

```js
import { NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

// 1. 指定受保护和公开的路由
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function middleware(req) {
  // 2. 检查当前路由是受保护的还是公开的
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. 从cookie解密会话
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  // 5. 如果用户未认证，则重定向到 /login
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 6. 如果用户已认证，则重定向到 /dashboard
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware 应该不运行的路由
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

须知：虽然 Middleware 对于初始检查很有用，但它不应该是保护数据的唯一防线。大多数安全检查应该尽可能地靠近数据源执行，有关更多信息，请参见[数据访问层](#creating-a-data-access-layer-dal)。

> **技巧**：
>
> - 在 Middleware 中，您也可以使用 `req.cookies.get('session).value` 读取 cookie。
> - Middleware 使用 [Edge Runtime](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)，请检查您的 Auth 库和会话管理库是否兼容。
> - 您可以在 Middleware 中使用 `matcher` 属性来指定 Middleware 应该运行在哪些路由上。尽管对于认证，建议 Middleware 在所有路由上运行。

<AppOnly>
```
### 创建数据访问层 (DAL)

我们建议创建一个DAL来集中管理您的数据请求和授权逻辑。

DAL应该包含一个函数，用于在用户与您的应用程序交互时验证用户的会话。至少，该函数应该检查会话是否有效，然后重定向或返回用户信息，以便进行进一步的请求。

例如，为您的DAL创建一个单独的文件，其中包括一个`verifySession()`函数。然后使用React的[cache](https://react.dev/reference/react/cache) API，在React渲染过程中对函数的返回值进行记忆化：

```tsx filename="app/lib/dal.ts" switcher
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export const verifySession = cache(async () => {
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})
```

```js filename="app/lib/dal.js" switcher
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export const verifySession = cache(async () => {
  const cookie = cookies().get('session').value
  const session = await decrypt(cookie)

  if (!session.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})
```

然后，您可以在数据请求、服务器操作、路由处理程序中调用`verifySession()`函数：

```tsx filename="app/lib/dal.ts" switcher
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // 明确返回您需要的列，而不是整个用户对象
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })

    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

```jsx filename="app/lib/dal.js" switcher
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // 明确返回您需要的列，而不是整个用户对象
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })

    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

> **提示**：
>
> - DAL可用于保护请求时获取的数据。然而，对于在用户之间共享数据的静态路由，数据将在构建时获取，而不是在请求时获取。使用[中间件](#optimistic-checks-with-middleware-optional)来保护静态路由。
> - 对于安全检查，您可以通过将会话ID与数据库进行比较来检查会话是否有效。使用React的[cache](https://react.dev/reference/react/cache)函数，避免在渲染过程中对数据库进行不必要的重复请求。
> - 您可能希望将相关的数据请求整合到一个JavaScript类中，在任何方法之前运行`verifySession()`。
### 使用数据传输对象（DTO）

在检索数据时，建议只返回将在您的应用程序中使用的必要数据，而不是整个对象。例如，如果您正在获取用户数据，您可能只返回用户的ID和名称，而不是可能包含密码、电话号码等的整个用户对象。

然而，如果您无法控制返回的数据结构，或者在团队中工作，您想要避免将整个对象传递给客户端，您可以使用一些策略，例如指定哪些字段可以安全地暴露给客户端。

```tsx filename="app/lib/dto.ts" switcher
import 'server-only'
import { getUser } from '@/app/lib/dal'

function canSeeUsername(viewer: User) {
  return true
}

function canSeePhoneNumber(viewer: User, team: string) {
  return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug: string) {
  const data = await db.query.users.findMany({
    where: eq(users.slug, slug),
    // 在此处返回特定列
  })
  const user = data[0]

  const currentUser = await getUser(user.id)

  // 或者在此处只返回与查询特定的内容
  return {
    username: canSeeUsername(currentUser) ? user.username : null,
    phonenumber: canSeePhoneNumber(currentUser, user.team)
      ? user.phonenumber
      : null,
  }
}
```

```js filename="app/lib/dto.js" switcher
import 'server-only'
import { getUser } from '@/app/lib/dal'

function canSeeUsername(viewer) {
  return true
}

function canSeePhoneNumber(viewer, team) {
  return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug) {
  const data = await db.query.users.findMany({
    where: eq(users.slug, slug),
    // 在此处返回特定列
  })
  const user = data[0]

  const currentUser = await getUser(user.id)

  // 或者在此处只返回与查询特定的内容
  return {
    username: canSeeUsername(currentUser) ? user.username : null,
    phonenumber: canSeePhoneNumber(currentUser, user.team)
      ? user.phonenumber
      : null,
  }
}
```

通过在DAL中集中您的数据请求和授权逻辑，并使用DTO，您可以确保所有数据请求都是安全的和一致的，这使得随着您的应用程序扩展，维护、审计和调试变得更加容易。

> **须知**：
>
> - 您可以有几种不同的方式定义DTO，从使用`toJSON()`到像上面示例中的单独函数，或者JS类。由于这些是JavaScript模式而不是React或Next.js的特性，我们建议您做一些研究，以找到最适合您应用程序的模式。
> - 在我们的[Next.js中的安全性文章](/blog/security-nextjs-server-components-actions)中了解更多关于安全最佳实践的信息。
### 服务器组件

在[服务器组件](/docs/app/building-your-application/rendering/server-components)中进行身份验证检查对于基于角色的访问控制非常有用。例如，可以根据用户的角色有条件地渲染组件：

```tsx filename="app/dashboard/page.tsx" switcher
import { verifySession } from '@/app/lib/dal'

export default function Dashboard() {
  const session = await verifySession()
  const userRole = session?.user?.role // 假设 'role' 是会话对象的一部分

  if (userRole === 'admin') {
    return <AdminDashboard />
  } else if (userRole === 'user') {
    return <UserDashboard />
  } else {
    redirect('/login')
  }
}
```

```jsx filename="app/dashboard/page.jsx" switcher
import { verifySession } from '@/app/lib/dal'

export default function Dashboard() {
  const session = await verifySession()
  const userRole = session.role // 假设 'role' 是会话对象的一部分

  if (userRole === 'admin') {
    return <AdminDashboard />
  } else if (userRole === 'user') {
    return <UserDashboard />
  } else {
    redirect('/login')
  }
}
```

在示例中，我们使用我们的DAL中的`verifySession()`函数来检查'admin'、'user'和未授权角色。这种模式确保每个用户只与适合其角色的组件交互。

### 布局和身份验证检查

由于[部分渲染](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，在做[布局](/docs/app/building-your-application/routing/layouts-and-templates)中的检查时要谨慎，因为这些在导航时不会重新渲染，这意味着用户会话在每次路由更改时都不会被检查。

相反，你应该在接近你的数据源或将被有条件渲染的组件的地方进行检查。

例如，考虑一个共享布局，它获取用户数据并在导航栏中显示用户图像。不要在布局中进行身份验证检查，你应该在布局中获取用户数据（`getUser()`），并在你的DAL中进行身份验证检查。

这保证了在你的应用程序中无论何时调用`getUser()`，都会执行身份验证检查，并防止开发者忘记检查用户是否有权访问数据。

```tsx filename="app/layout.tsx" switcher
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    // ...
  )
}
```

```jsx filename="app/layout.js" switcher
export default async function Layout({ children }) {
  const user = await getUser();

  return (
    // ...
  )
}
```

```ts filename="app/lib/dal.ts" switcher
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  // 从会话中获取用户ID并获取数据
})
```

```js filename="app/lib/dal.js" switcher
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  // 从会话中获取用户ID并获取数据
})
```

> **须知：**
>
> - 在SPA中，如果用户未获授权，`return null`在布局或顶级组件中是一个常见的模式。这种模式并不**推荐**，因为Next.js应用程序有多个入口点，这不会阻止嵌套路由段和服务器操作被访问。
### 服务器操作

将 [服务器操作](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 视为与面向公众的 API 端点相同的安全考虑，并验证用户是否被允许执行变异操作。

以下示例在允许操作继续之前检查用户的角色：

```ts filename="app/lib/actions.ts" switcher
'use server'
import { verifySession } from '@/app/lib/dal'

export async function serverAction(formData: FormData) {
  const session = await verifySession()
  const userRole = session?.user?.role

  // 如果用户未授权执行操作，则提前返回
  if (userRole !== 'admin') {
    return null
  }

  // 对授权用户继续执行操作
}
```

```js filename="app/lib/actions.js" switcher
'use server'
import { verifySession } from '@/app/lib/dal'

export async function serverAction() {
  const session = await verifySession()
  const userRole = session.user.role

  // 如果用户未授权执行操作，则提前返回
  if (userRole !== 'admin') {
    return null
  }

  // 对授权用户继续执行操作
}
```

### 路由处理器

将 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 视为与面向公众的 API 端点相同的安全考虑，并验证用户是否被允许访问路由处理器。

例如：

```ts filename="app/api/route.ts" switcher
import { verifySession } from '@/app/lib/dal'

export async function GET() {
  // 用户认证和角色验证
  const session = await verifySession()

  // 检查用户是否已认证
  if (!session) {
    // 用户未认证
    return new Response(null, { status: 401 })
  }

  // 检查用户是否具有 'admin' 角色
  if (session.user.role !== 'admin') {
    // 用户已认证但权限不足
    return new Response(null, { status: 403 })
  }

  // 对授权用户继续操作
}
```

```js filename="app/api/route.js" switcher
import { verifySession } from '@/app/lib/dal'

export async function GET() {
  // 用户认证和角色验证
  const session = await verifySession()

  // 检查用户是否已认证
  if (!session) {
    // 用户未认证
    return new Response(null, { status: 401 })
  }

  // 检查用户是否具有 'admin' 角色
  if (session.user.role !== 'admin') {
    // 用户已认证但权限不足
    return new Response(null, { status: 403 })
  }

  // 对授权用户继续操作
}
```

上述示例演示了一个具有两层安全检查的路由处理器。它首先检查会话是否有效，然后验证登录用户是否为 'admin'。
## 上下文提供者

由于[交错](/docs/app/building-your-application/rendering/composition-patterns#interleaving-server-and-client-components)的原因，使用上下文提供者进行身份验证工作。然而，React `context`在服务器组件中不受支持，因此它们只适用于客户端组件。

这样做是可行的，但任何子服务器组件都会首先在服务器上呈现，并且无法访问上下文提供者的会话数据：

```tsx filename="app/layout.ts" switcher
import { ContextProvider } from 'auth-lib'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  )
}
```

```tsx filename="app/ui/profile.ts switcher
"use client";

import { useSession } from "auth-lib";

export default function Profile() {
  const { userId } = useSession();
  const { data } = useSWR(`/api/user/${userId}`, fetcher)

  return (
    // ...
  );
}
```

```jsx filename="app/ui/profile.js switcher
"use client";

import { useSession } from "auth-lib";

export default function Profile() {
  const { userId } = useSession();
  const { data } = useSWR(`/api/user/${userId}`, fetcher)

  return (
    // ...
  );
}
```

如果客户端组件（例如，用于客户端数据获取）需要会话数据，请使用React的[`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue) API，以防止敏感的会话数据暴露给客户端。

</AppOnly>

<PagesOnly>

### 创建数据访问层（DAL）

#### 保护API路由

Next.js中的API路由对于处理服务器端逻辑和数据管理至关重要。确保只有授权用户才能访问特定功能至关重要。这通常涉及验证用户的身份验证状态和基于角色的权限。

以下是保护API路由的示例：

```ts filename="pages/api/route.ts" switcher
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req)

  // 检查用户是否已通过身份验证
  if (!session) {
    res.status(401).json({
      error: 'User is not authenticated',
    })
    return
  }

  // 检查用户是否具有'admin'角色
  if (session.user.role !== 'admin') {
    res.status(401).json({
      error: 'Unauthorized access: User does not have admin privileges.',
    })
    return
  }

  // 为授权用户继续路由
  // ... API路由的实现
}
```

```js filename="pages/api/route.js" switcher
export default async function handler(req, res) {
  const session = await getSession(req)

  // 检查用户是否已通过身份验证
  if (!session) {
    res.status(401).json({
      error: 'User is not authenticated',
    })
    return
  }

  // 检查用户是否具有'admin'角色
  if (session.user.role !== 'admin') {
    res.status(401).json({
      error: 'Unauthorized access: User does not have admin privileges.',
    })
    return
  }

  // 为授权用户继续路由
  // ... API路由的实现
}
```

此示例演示了一个具有两层安全检查的API路由，用于身份验证和授权。它首先检查活动会话，然后验证登录用户是否为'admin'。这种方法确保了安全访问，仅限于已认证和授权的用户，维护了请求处理的强安全性。

</PagesOnly>

须知：以上内容为示例，实际使用时应根据具体需求进行调整。
## 资源

既然您已经了解了 Next.js 中的认证，以下是与 Next.js 兼容的库和资源，可帮助您实现安全的认证和会话管理：

### 认证库

- [Auth0](https://auth0.com/docs/quickstart/webapp/nextjs/01-login)
- [Clerk](https://clerk.com/docs/quickstarts/nextjs)
- [Kinde](https://kinde.com/docs/developer-tools/nextjs-sdk)
- [Lucia](https://lucia-auth.com/getting-started/nextjs-app)
- [NextAuth.js](https://authjs.dev/getting-started/installation?framework=next.js)
- [Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Stytch](https://stytch.com/docs/guides/quickstarts/nextjs)
- [WorkOS](https://workos.com/docs/user-management)

### 会话管理库

- [Iron Session](https://github.com/vvo/iron-session)
- [Jose](https://github.com/panva/jose)

## 进一步阅读

要继续了解认证和安全性，请查看以下资源：

- [如何在 Next.js 中考虑安全性](/blog/security-nextjs-server-components-actions)
- [理解 XSS 攻击](https://vercel.com/guides/understanding-xss-attacks)
- [理解 CSRF 攻击](https://vercel.com/guides/understanding-csrf-attacks)
- [哥本哈根书](https://thecopenhagenbook.com/)