# Server Actions and Mutations

Server Actions 是在服务器上执行的**异步函数**。它们可以用于服务器和客户端组件，处理 Next.js 应用程序中的表单提交和数据变更。

> **🎥 观看:** 了解更多关于使用 Server Actions 处理表单和变更的信息 → [YouTube (10分钟)](https://youtu.be/dDpZfOQBMaU?si=cJZHlUu_jFhCzHUg)。

## 惯例

Server Action 可以使用 React 的 [`"use server"`](https://react.dev/reference/react/use-server) 指令来定义。您可以将该指令放在 `async` 函数的顶部，以将该函数标记为 Server Action，或者放在一个单独文件的顶部，以将该文件的所有导出标记为 Server Actions。

### 服务器组件

服务器组件可以使用内联函数级别或模块级别 `"use server"` 指令。要内联一个 Server Action，请在函数体的顶部添加 `"use server"`：

```tsx filename="app/page.tsx" switcher
// 服务器组件
export default function Page() {
  // Server Action
  async function create() {
    'use server'

    // ...
  }

  return (
    // ...
  )
}
```

```jsx filename="app/page.jsx" switcher
// 服务器组件
export default function Page() {
  // Server Action
  async function create() {
    'use server'

    // ...
  }

  return (
    // ...
  )
}
```

### 客户端组件

客户端组件只能导入使用模块级别 `"use server"` 指令的动作。

要在客户端组件中调用 Server Action，请创建一个新文件，并在文件顶部添加 `"use server"` 指令。文件内的所有函数都将被标记为可以在客户端和服务器组件中重用的 Server Actions：

```tsx filename="app/actions.ts" switcher
'use server'

export async function create() {
  // ...
}
```

```js filename="app/actions.js" switcher
'use server'

export async function create() {
  // ...
}
```

```tsx filename="app/ui/button.tsx" switcher
import { create } from '@/app/actions'

export function Button() {
  return (
    // ...
  )
}
```

```jsx filename="app/ui/button.js" switcher
import { create } from '@/app/actions'

export function Button() {
  return (
    // ...
  )
}
```

您也可以将 Server Action 作为属性传递给客户端组件：

```jsx
<ClientComponent updateItem={updateItem} />
```

```jsx filename="app/client-component.jsx"
'use client'

export default function ClientComponent({ updateItem }) {
  return <form action={updateItem}>{/* ... */}</form>
}
```
# Behavior

- 服务器操作可以通过在[`<form>`元素](#forms)中使用`action`属性来调用：
  - 服务器组件默认支持渐进增强，这意味着即使JavaScript尚未加载或被禁用，表单也会被提交。
  - 在客户端组件中，调用服务器操作的表单将在JavaScript尚未加载时排队提交，优先考虑客户端水合。
  - 水合后，浏览器在表单提交时不会刷新。
- 服务器操作不仅限于`<form>`，还可以从事件处理程序、`useEffect`、第三方库和其他表单元素如`<button>`中调用。
- 服务器操作与Next.js的[caching和revalidation](/docs/app/building-your-application/caching)架构集成。当操作被调用时，Next.js可以在单个服务器往返中返回更新后的UI和新数据。
- 在幕后，操作使用`POST`方法，并且只有这个HTTP方法可以调用它们。
- 服务器操作的参数和返回值必须能够被React序列化。请参阅React文档以获取[可序列化参数和值](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values)的列表。
- 服务器操作是函数。这意味着它们可以在应用程序的任何地方重用。
- 服务器操作从它们使用的页面或布局继承[runtime](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)。
- 服务器操作从它们使用的页面或布局继承[Route Segment Config](/docs/app/api-reference/file-conventions/route-segment-config)，包括`maxDuration`等字段。

# Examples

### Forms

React扩展了HTML [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form)元素，允许使用`action`属性调用服务器操作。

在表单中调用时，操作会自动接收[`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData)对象。您不需要使用React `useState`来管理字段，相反，您可以使用原生的[`FormData`方法](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods)提取数据：

```tsx filename="app/invoices/page.tsx" switcher
export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate cache
  }

  return <form action={createInvoice}>...</form>
}
```

```jsx filename="app/invoices/page.jsx" switcher
export default function Page() {
  async function createInvoice(formData) {
    'use server'

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate cache
  }

  return <form action={createInvoice}>...</form>
}
```

> **须知：**
>
> - 示例：[带有加载和错误状态的表单](https://github.com/vercel/next.js/tree/canary/examples/next-forms)
> - 当处理具有许多字段的表单时，您可能需要考虑使用JavaScript的[`entries()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries)方法与[`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)。例如：`const rawFormData = Object.fromEntries(formData)`。需要注意的一点是`formData`将包括额外的`$ACTION_`属性。
> - 请参阅[React `<form>`文档](https://react.dev/reference/react-dom/components/form#handle-form-submission-with-a-server-action)了解更多。
# Passing Additional Arguments

您可以使用JavaScript的`bind`方法向服务器操作传递额外的参数。

```tsx filename="app/client-component.tsx" highlight={6} switcher
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">更新用户名称</button>
    </form>
  )
}
```

```jsx filename="app/client-component.js" highlight={6} switcher
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">更新用户名称</button>
    </form>
  )
}
```

服务器操作将接收`userId`参数，以及表单数据：

```js filename="app/actions.js"
'use server'

export async function updateUser(userId, formData) {
  // ...
}
```

> **须知**：
>
> - 另一种方法是将参数作为表单中的隐藏输入字段传递（例如`<input type="hidden" name="userId" value={userId} />`）。但是，该值将是渲染的HTML的一部分，并且不会被编码。
> - `.bind`在服务器和客户端组件中均有效。它还支持渐进式增强。

# Pending states

您可以使用React的[`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)钩子，在表单提交时显示待处理状态。

- `useFormStatus`返回特定`<form>`的状态，因此**必须定义为`<form>`元素的子元素**。
- `useFormStatus`是一个React钩子，因此必须在客户端组件中使用。

```tsx filename="app/submit-button.tsx" switcher
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      添加
    </button>
  )
}
```

```jsx filename="app/submit-button.jsx" switcher
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      添加
    </button>
  )
}
```

然后，`<SubmitButton />`可以嵌套在任何表单中：

```tsx filename="app/page.tsx" switcher
import { SubmitButton } from '@/app/submit-button'
import { createItem } from '@/app/actions'

// 服务器组件
export default async function Home() {
  return (
    <form action={createItem}>
      <input type="text" name="field-name" />
      <SubmitButton />
    </form>
  )
}
```

```jsx filename="app/page.jsx" switcher
import { SubmitButton } from '@/app/submit-button'
import { createItem } from '@/app/actions'

// 服务器组件
export default async function Home() {
  return (
    <form action={createItem}>
      <input type="text" name="field-name" />
      <SubmitButton />
    </form>
  )
}
```
# Server-side validation and error handling

我们建议使用HTML验证，如`required`和`type="email"`，进行基本的客户端表单验证。

对于更高级的服务器端验证，您可以使用像[zod](https://zod.dev/)这样的库，在变异数据之前验证表单字段：

```tsx filename="app/actions.ts" switcher
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})

export default async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  // 如果表单数据无效，则提前返回
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 变异数据
}
```

```jsx filename="app/actions.js" switcher
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})

export default async function createsUser(formData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  // 如果表单数据无效，则提前返回
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 变异数据
}
```

一旦在服务器上验证了字段，您可以在您的操作中返回一个可序列化的对象，并使用React [`useActionState`](https://react.dev/reference/react/useActionState) 钩子向用户显示消息。

- 通过将操作传递给`useActionState`，操作的函数签名将改变，以接收一个新的`prevState`或`initialState`参数作为其第一个参数。
- `useActionState`是一个React钩子，因此必须在客户端组件中使用。

```tsx filename="app/actions.ts" switcher
'use server'

export async function createUser(prevState: any, formData: FormData) {
  // ...
  return {
    message: 'Please enter a valid email',
  }
}
```

```jsx filename="app/actions.js" switcher
'use server'

export async function createUser(prevState, formData) {
  // ...
  return {
    message: 'Please enter a valid email',
  }
}
```

然后，您可以将您的操作传递给`useActionState`钩子，并使用返回的`state`来显示错误消息。

```tsx filename="app/ui/signup.tsx" switcher
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
      <button>Sign up</button>
    </form>
  )
}
```

```jsx filename="app/ui/signup.js" switcher
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
      <button>Sign up</button>
    </form>
  )
}
```

> **须知：**
>
> - 在变异数据之前，您应该始终确保用户也被授权执行该操作。参见[身份验证和授权](#authentication-and-authorization)。
# Optimistic updates

您可以使用React的[`useOptimistic`](https://react.dev/reference/react/useOptimistic)钩子，在服务器操作完成之前乐观地更新UI，而不是等待响应：

```tsx filename="app/page.tsx" switcher
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

type Message = {
  message: string
}

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    string
  >(messages, (state, newMessage) => [...state, { message: newMessage }])

  return (
    <div>
      {optimisticMessages.map((m, k) => (
        <div key={k}>{m.message}</div>
      ))}
      <form
        action={async (formData: FormData) => {
          const message = formData.get('message')
          addOptimisticMessage(message)
          await send(message)
        }}
      >
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

```jsx filename="app/page.jsx" switcher
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

export function Thread({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { message: newMessage }]
  )

  return (
    <div>
      {optimisticMessages.map((m) => (
        <div>{m.message}</div>
      ))}
      <form
        action={async (formData) => {
          const message = formData.get('message')
          addOptimisticMessage(message)
          await send(message)
        }}
      >
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

# Nested elements

您可以在`<form>`内部的嵌套元素中调用服务器操作，例如`<button>`、`<input type="submit">`和`<input type="image">`。这些元素接受`formAction`属性或[事件处理器](#event-handlers)。

这在您想要在表单内调用多个服务器操作的情况下非常有用。例如，除了发布文章外，您可以为保存文章草稿创建一个特定的`<button>`元素。有关更多信息，请参见[React `<form>`文档](https://react.dev/reference/react-dom/components/form#handling-multiple-submission-types)。

# Programmatic form submission

您可以使用[`requestSubmit()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit)方法触发表单提交。例如，当用户按下`⌘` + `Enter`时，您可以监听`onKeyDown`事件：

```tsx filename="app/entry.tsx" switcher
'use client'

export function Entry() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'Enter' || e.key === 'NumpadEnter')
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div>
      <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
    </div>
  )
}
```

```jsx filename="app/entry.jsx" switcher
'use client'

export function Entry() {
  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'Enter' || e.key === 'NumpadEnter')
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div>
      <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
    </div>
  )
}
```

这将触发最近的`<form>`祖先的提交，这将调用服务器操作。
### 非表单元素

虽然在 `<form>` 元素中使用服务器操作很常见，但它们也可以从代码的其他部分调用，例如事件处理器和 `useEffect`。

#### 事件处理器

您可以从事件处理器中调用服务器操作，例如 `onClick`。例如，要增加点赞数：

```tsx filename="app/like-button.tsx" switcher
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>总点赞数：{likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        点赞
      </button>
    </>
  )
}
```

```jsx filename="app/like-button.js" switcher
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>总点赞数：{likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        点赞
      </button>
    </>
  )
}
```

为了改善用户体验，我们建议使用其他 React API，如 [`useOptimistic`](https://react.dev/reference/react/useOptimistic) 和 [`useTransition`](https://react.dev/reference/react/useTransition)，在服务器完成服务器操作执行之前更新 UI，或显示等待状态。

您还可以向表单元素添加事件处理器，例如，保存表单字段 `onChange`：

```tsx filename="app/ui/edit-post.tsx"
'use client'

import { publishPost, saveDraft } from './actions'

export default function EditPost() {
  return (
    <form action={publishPost}>
      <textarea
        name="content"
        onChange={async (e) => {
          await saveDraft(e.target.value)
        }}
      />
      <button type="submit">发布</button>
    </form>
  )
}
```

对于这样的情况，可能会在短时间内触发多个事件，我们建议 **防抖** 以防止不必要的服务器操作调用。

#### `useEffect`

您可以使用 React [`useEffect`](https://react.dev/reference/react/useEffect) 钩子在组件挂载或依赖项更改时调用服务器操作。这对于依赖于全局事件或需要自动触发的更改非常有用。例如，`onKeyDown` 用于应用程序快捷键，无限滚动的交叉观察者钩子，或者当组件挂载时更新浏览量计数：

```tsx filename="app/view-count.tsx" switcher
'use client'

import { incrementViews } from './actions'
import { useState, useEffect } from 'react'

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)

  useEffect(() => {
    const updateViews = async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    }

    updateViews()
  }, [])

  return <p>总浏览量：{views}</p>
}
```

```jsx filename="app/view-count.js" switcher
'use client'

import { incrementViews } from './actions'
import { useState, useEffect } from 'react'

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)

  useEffect(() => {
    const updateViews = async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    }

    updateViews()
  }, [])

  return <p>总浏览量：{views}</p>
}
```

请记住考虑 `useEffect` 的 [行为和注意事项](https://react.dev/reference/react/useEffect#caveats)。
### 错误处理

当抛出一个错误时，它将被最近的 [`error.js`](/docs/app/building-your-application/routing/error-handling) 或 `<Suspense>` 边界在客户端捕获。我们建议使用 `try/catch` 来返回错误，以便由您的UI处理。

例如，您的服务器操作可能会通过返回一个消息来处理创建新项目时的错误：

```ts filename="app/actions.ts" switcher
'use server'

export async function createTodo(prevState: any, formData: FormData) {
  try {
    // 变更数据
  } catch (e) {
    throw new Error('创建任务失败')
  }
}
```

```js filename="app/actions.js" switcher
'use server'

export async function createTodo(prevState, formData) {
  try {
    // 变更数据
  } catch (e) {
    throw new Error('创建任务失败')
  }
}
```

> **须知：**
>
> - 除了抛出错误之外，您还可以返回一个对象由 `useActionState` 处理。请参阅 [服务器端验证和错误处理](#server-side-validation-and-error-handling)。

### 数据重新验证

您可以使用 [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath) API 在服务器操作中重新验证 [Next.js 缓存](/docs/app/building-your-application/caching)：

```ts filename="app/actions.ts" switcher
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidatePath('/posts')
}
```

```js filename="app/actions.js" switcher
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidatePath('/posts')
}
```

或者使用 [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) 通过缓存标签使特定的数据获取失效：

```ts filename="app/actions.ts" switcher
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag('posts')
}
```

```js filename="app/actions.js" switcher
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag('posts')
}
```

### 重定向

如果您希望在服务器操作完成后将用户重定向到不同的路由，您可以使用 [`redirect`](/docs/app/api-reference/functions/redirect) API。`redirect` 需要在 `try/catch` 块之外调用：

```ts filename="app/actions.ts" switcher
'use server'

import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function createPost(id: string) {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag('posts') // 更新缓存的帖子
  redirect(`/post/${id}`) // 导航到新帖子页面
}
```

```js filename="app/actions.js" switcher
'use server'

import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function createPost(id) {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag('posts') // 更新缓存的帖子
  redirect(`/post/${id}`) // 导航到新帖子页面
}
```
# Cookies

您可以使用 [`cookies`](/docs/app/api-reference/functions/cookies) API 在服务器操作中 `get`、`set` 和 `delete` 饼干：

```ts filename="app/actions.ts" switcher
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  // 获取饼干
  const value = cookies().get('name')?.value

  // 设置饼干
  cookies().set('name', 'Delba')

  // 删除饼干
  cookies().delete('name')
}
```

```js filename="app/actions.js" switcher
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  // 获取饼干
  const value = cookies().get('name')?.value

  // 设置饼干
  cookies().set('name', 'Delba')

  // 删除饼干
  cookies().delete('name')
}
```

请参阅 [删除服务器操作中的饼干的附加示例](/docs/app/api-reference/functions/cookies#deleting-cookies)。

# 安全

### 身份验证和授权

您应该像对待面向公众的 API 端点一样对待服务器操作，并确保用户被授权执行该操作。例如：

```tsx filename="app/actions.ts"
'use server'

import { auth } from './lib'

export function addItem() {
  const { user } = auth()
  if (!user) {
    throw new Error('您必须登录才能执行此操作')
  }

  // ...
}
```

### 闭包和加密

在组件内定义服务器操作会创建一个 [闭包](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)，其中操作可以访问外部函数的作用域。例如，`publish` 操作可以访问 `publishVersion` 变量：

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  const publishVersion = await getLatestVersion();

  async function publish() {
    "use server";
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('自按下发布按钮以来，版本已更改');
    }
    ...
  }

  return (
    <form>
      <button formAction={publish}>发布</button>
    </form>
  );
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  const publishVersion = await getLatestVersion();

  async function publish() {
    "use server";
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('自按下发布按钮以来，版本已更改');
    }
    ...
  }

  return (
    <form>
      <button formAction={publish}>发布</button>
    </form>
  );
}
```

当您需要在呈现时捕获数据的 _快照_（例如 `publishVersion`），以便在操作被调用时稍后使用时，闭包非常有用。

然而，要使这种情况发生，捕获的变量会被发送到客户端，并在操作被调用时返回到服务器。为了防止敏感数据暴露给客户端，Next.js 自动加密闭包变量。每次构建 Next.js 应用程序时，都会为每个操作生成一个新的私钥。这意味着操作只能针对特定构建进行调用。

> **须知：** 我们不推荐仅依赖加密来防止客户端暴露敏感值。相反，您应该使用 [React 污染 API](/docs/app/building-your-application/data-fetching/patterns#preventing-sensitive-data-from-being-exposed-to-the-client) 来主动防止将特定数据发送到客户端。
### 重写加密密钥（高级）

当您在多个服务器上自托管您的Next.js应用程序时，每个服务器实例最终可能会有不同的加密密钥，这可能导致潜在的不一致性。

为了缓解这个问题，您可以使用环境变量 `process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` 来重写加密密钥。指定此变量确保您的加密密钥在构建之间保持持久，并且所有服务器实例使用相同的密钥。

这是一个高级用例，其中在多个部署中保持一致的加密行为对您的应用程序至关重要。您应该考虑标准的安全实践，例如密钥轮换和签名。

> **须知：** 部署到Vercel的Next.js应用程序会自动处理这个问题。

### 允许的来源（高级）

由于服务器操作可以在 `<form>` 元素中被调用，这使它们容易受到 [CSRF攻击](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)。

在幕后，服务器操作使用 `POST` 方法，并且只允许使用此HTTP方法来调用它们。这防止了现代浏览器中的大多数CSRF漏洞，特别是使用[SameSite cookies](https://web.dev/articles/samesite-cookies-explained)作为默认设置。

作为额外的保护，Next.js中的服务器操作还比较 [Origin header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) 与 [Host header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)（或 `X-Forwarded-Host`）。如果这些不匹配，请求将被中止。换句话说，服务器操作只能在托管它的页面的相同主机上被调用。

对于使用反向代理或多层后端架构的大型应用程序（其中服务器API与生产域不同），建议使用配置选项 [`serverActions.allowedOrigins`](/docs/app/api-reference/next-config-js/serverActions) 指定一个安全来源列表。该选项接受一个字符串数组。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

了解更多关于 [安全性和服务器操作](https://nextjs.org/blog/security-nextjs-server-components-actions)。

## 附加资源

有关服务器操作的更多信息，请查看以下React文档：

- [`"use server"`](https://react.dev/reference/react/use-server)
- [`<form>`](https://react.dev/reference/react-dom/components/form)
- [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [`useActionState`](https://react.dev/reference/react/useActionState)
- [`useOptimistic`](https://react.dev/reference/react/useOptimistic)