---
title: 平行路由
description: 同时在同一个视图中渲染一个或多个页面，这些页面可以独立导航。适用于高度动态的应用程序的模式。
related:
  links:
    - app/api-reference/file-conventions/default
---

平行路由允许你在同一个布局中同时或有条件地渲染一个或多个页面。它们对于应用程序中高度动态的部分非常有用，例如仪表板和社交网站上的动态。

例如，考虑一个仪表板，你可以使用平行路由同时渲染 `team` 和 `analytics` 页面：

![Parallel Routes Diagram](/docs/light/parallel-routes.png)

## 插槽

平行路由是使用命名的**插槽**创建的。插槽使用 `@folder` 约定定义。例如，以下文件结构定义了两个插槽：`@analytics` 和 `@team`：

![Parallel Routes File-system Structure](/docs/light/parallel-routes-file-system.png)

插槽作为属性传递给共享的父级布局。对于上面的例子，`app/layout.js` 中的组件现在接受 `@analytics` 和 `@team` 插槽属性，并可以并行渲染它们以及 `children` 属性：

```tsx filename="app/layout.tsx" switcher
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function Layout({ children, team, analytics }) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

然而，插槽**不是**[路由段](/docs/app/building-your-application/routing#route-segments)，也不影响 URL 结构。例如，对于 `/@analytics/views`，URL 将是 `/views`，因为 `@analytics` 是一个插槽。

> **须知**：
>
> - `children` 属性是一个隐式插槽，不需要映射到文件夹。这意味着 `app/page.js` 等同于 `app/@children/page.js`。

## 活动状态和导航

默认情况下，Next.js 会跟踪每个插槽的活动_状态_（或子页面）。然而，在插槽内渲染的内容将取决于导航的类型：

- [**软导航**](/docs/app/building-your-application/routing/linking-and-navigating#5-soft-navigation)：在客户端导航期间，Next.js 将执行[部分渲染](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，在保持其他插槽的活动子页面的同时，更改插槽内的子页面，即使它们与当前 URL 不匹配。
- **硬导航**：在完整页面加载（浏览器刷新）后，Next.js 无法确定当前 URL 不匹配的插槽的活动状态。相反，它将为不匹配的插槽渲染一个 [`default.js`](#defaultjs) 文件，或者如果不存在 `default.js`，则渲染 `404`。

> **须知**：
>
> - 不匹配路由的 `404` 有助于确保你不会意外地在不打算使用的页面上渲染平行路由。

### `default.js`

你可以定义一个 `default.js` 文件，以在初始加载或完整页面重新加载期间作为不匹配插槽的回退渲染。

考虑以下文件夹结构。`@team` 插槽有一个 `/settings` 页面，但 `@analytics` 没有。

![Parallel Routes unmatched routes](/docs/light/parallel-routes-unmatched-routes.png)

当导航到 `/settings` 时，`@team` 插槽将渲染 `/settings` 页面，同时保持 `@analytics` 插槽当前活动的页面。

在刷新时，Next.js 将为 `@analytics` 渲染一个 `default.js`。如果 `default.js` 不存在，它将渲染 `404`。如果指定的路由不存在，则会渲染一个 `404` 页面。

此外，由于 `children` 是一个隐式插槽，当 Next.js 无法恢复父页面的活动状态时，你还需要创建一个 `default.js` 文件来为 `children` 渲染一个备用内容。

### `useSelectedLayoutSegment(s)`

[`useSelectedLayoutSegment`](/docs/app/api-reference/functions/use-selected-layout-segment) 和 [`useSelectedLayoutSegments`](/docs/app/api-reference/functions/use-selected-layout-segments) 都接受一个 `parallelRoutesKey` 参数，该参数允许你在插槽内读取活动路由段。

```tsx filename="app/layout.tsx" switcher
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // ...
}
```

```jsx filename="app/layout.js" switcher
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // ...
}
```

当用户导航到 `app/@auth/login`（或在 URL 栏中为 `/login`）时，`loginSegment` 将等于字符串 `"login"`。

## 示例

### 条件路由

你可以使用并行路由根据某些条件（如用户角色）有条件地渲染路由。例如，为 `/admin` 或 `/user` 角色渲染不同的仪表板页面：

<Image
  alt="条件路由图示"
  srcLight="/docs/light/conditional-routes-ui.png"
  srcDark="/docs/dark/conditional-routes-ui.png"
  width="1600"
  height="898"
/>

```tsx filename="app/dashboard/layout.tsx" switcher
import { checkUserRole } from '@/lib/auth'

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkUserRole()
  return <>{role === 'admin' ? admin : user}</>
}
```

```jsx filename="app/dashboard/layout.js" switcher
import { checkUserRole } from '@/lib/auth'

export default function Layout({ user, admin }) {
  const role = checkUserRole()
  return <>{role === 'admin' ? admin : user}</>
}
```

### 标签组

你可以在插槽内添加一个 `layout`，使用户可以独立地导航插槽。这对于创建标签非常有用。

例如，`@analytics` 插槽有两个子页面：`/page-views` 和 `/visitors`。

<Image
  alt="带有两个子页面和布局的分析插槽"
  srcLight="/docs/light/parallel-routes-tab-groups.png"
  srcDark="/docs/dark/parallel-routes-tab-groups.png"
  width="1600"
  height="768"
/>

在 `@analytics` 内部，创建一个 [`layout`](/docs/app/building-your-application/routing/layouts-and-templates) 文件，以便在两个页面之间共享标签：

```tsx filename="app/@analytics/layout.tsx" switcher
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/page-views">页面浏览量</Link>
        <Link href="/visitors">访问者</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}
```

```jsx filename="app/@analytics/layout.js" switcher
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/page-views">页面浏览量</Link>
        <Link href="/visitors">访问者</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}
```

### 模态框

并行路由可以与 [拦截路由](/docs/app/building-your-application/routing/intercepting-routes) 结合使用，以创建模态框。这允许你解决构建模态框时的常见挑战，例如：

- 通过 URL **共享模态框内容**。
- 在页面刷新时**保留上下文**，而不是关闭模态框。
- 在后退导航时**关闭模态框**，而不是转到上一个路由。
- 在前进导航时**重新打开模态框**。

考虑以下 UI 模式，用户可以从布局中打开一个登录模态框### 平行路由认证模态框

使用客户端导航，或访问单独的 `/login` 页面：

<Image
  alt="平行路由图"
  srcLight="/docs/light/parallel-routes-auth-modal.png"
  srcDark="/docs/dark/parallel-routes-auth-modal.png"
  width="1600"
  height="687"
/>

要实现这种模式，首先创建一个 `/login` 路由，渲染您的**主**登录页面。

<Image
  alt="平行路由图"
  srcLight="/docs/light/parallel-routes-modal-login-page.png"
  srcDark="/docs/dark/parallel-routes-modal-login-page.png"
  width="1600"
  height="768"
/>

```tsx filename="app/login/page.tsx" switcher
import { Login } from '@/app/ui/login'

export default function Page() {
  return <Login />
}
```

```jsx filename="app/login/page.js" switcher
import { Login } from '@/app/ui/login'

export default function Page() {
  return <Login />
}
```

然后，在 `@auth` 插槽内，添加一个 [`default.js`](/docs/app/api-reference/file-conventions/default) 文件，返回 `null`。这确保了当模态框未激活时，不会渲染模态框。

```tsx filename="app/@auth/default.tsx" switcher
export default function Default() {
  return null
}
```

```jsx filename="app/@auth/default.js" switcher
export default function Default() {
  return null
}
```

在您的 `@auth` 插槽内，通过更新 `/(.)login` 文件夹来拦截 `/login` 路由。将 `<Modal>` 组件及其子组件导入到 `/(.)login/page.tsx` 文件中：

```tsx filename="app/@auth/(.)login/page.tsx" switcher
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  )
}
```

```jsx filename="app/@auth/(.)login/page.js" switcher
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  )
}
```

> **须知：**
>
> - 用于拦截路由的约定，例如 `(.)`，取决于您的文件系统结构。参见 [拦截路由约定](/docs/app/building-your-application/routing/intercepting-routes#convention)。
> - 通过将 `<Modal>` 功能与模态框内容 (`<Login>`) 分开，您可以确保模态框内的任何内容，例如 [表单](/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms)，都是服务器组件。有关更多信息，请参见 [交错客户端和服务器组件](/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props)。

#### 打开模态框

现在，您可以利用 Next.js 路由器打开和关闭模态框。这确保了当模态框打开时，URL 会正确更新，并且在前进和后退导航时也是如此。

要打开模态框，将 `@auth` 插槽作为属性传递给父布局，并将其与 `children` 属性一起渲染。

```tsx filename="app/layout.tsx" switcher
import Link from 'next/link'

export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        <Link href="/login">打开模态框</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

```jsx filename="app/layout.js" switcher
import Link from 'next/link'

export default function Layout({ auth, children }) {
  return (
    <>
      <nav>
        <Link href="/login">打开模态框</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

当用户点击 `<Link>` 时，将打开模态框，而不是导航到 `/login` 页面。然而，在刷新或初始加载时，导航到 `/login` 将使用户进入主登录页面。

#### 关闭模态框

您可以通过调用 `router.back()` 或使用 `Link` 组件来关闭模态框。

```tsx filename="app/ui/modal.tsx" switcher
'use client'

import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.Rea```jsx filename="app/ui/modal.js" switcher
import { useRouter } from 'next/navigation'

export function Modal({ children }) {
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => {
          router.back()
        }}
      >
        关闭模态框
      </button>
      <div>{children}</div>
    </>
  )
}
```

```jsx filename="app/ui/modal.js" switcher
'use client'

import { useRouter } from 'next/navigation'

export function Modal({ children }) {
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => {
          router.back()
        }}
      >
        关闭模态框
      </button>
      <div>{children}</div>
    </>
  )
}
```

当使用 `Link` 组件从不应该再渲染 `@auth` 插槽的页面导航离开时，我们使用一个通配符路由返回 `null`。

```tsx filename="app/ui/modal.tsx" switcher
import Link from 'next/link'

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href="/">关闭模态框</Link>
      <div>{children}</div>
    </>
  )
}
```

```jsx filename="app/ui/modal.js" switcher
import Link from 'next/link'

export function Modal({ children }) {
  return (
    <>
      <Link href="/">关闭模态框</Link>
      <div>{children}</div>
    </>
  )
}
```

```tsx filename="app/@auth/[...catchAll]/page.tsx" switcher
export default function CatchAll() {
  return null
}
```

```jsx filename="app/@auth/[...catchAll]/page.js" switcher
export default function CatchAll() {
  return null
}
```

> **须知：**
>
> - 我们使用 `@auth` 插槽中的通配符路由来关闭模态框，因为如[活动状态和导航](#active-state-and-navigation)中所述的行为。由于客户端导航到不再匹配插槽的路由将保持可见，我们需要将插槽匹配到返回 `null` 的路由以关闭模态框。
> - 其他示例可能包括在画廊中打开照片模态框，同时拥有一个专门的 `/photo/[id]` 页面，或者在侧边模态框中打开购物车。
> - [查看](https://github.com/vercel-labs/nextgram)带有拦截和并行路由的模态框示例。

### 加载和错误界面

并行路由可以独立流式传输，允许你为每个路由定义独立的错误和加载状态：

<Image
  alt="并行路由允许自定义错误和加载状态"
  srcLight="/docs/light/parallel-routes-cinematic-universe.png"
  srcDark="/docs/dark/parallel-routes-cinematic-universe.png"
  width="1600"
  height="1218"
/>

有关更多信息，请查看 [加载界面](/docs/app/building-your-application/routing/loading-ui-and-streaming) 和 [错误处理](/docs/app/building-your-application/routing/error-handling) 文档。