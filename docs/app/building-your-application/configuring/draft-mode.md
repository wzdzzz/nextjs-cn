---
title: 草稿模式
description: Next.js 提供了草稿模式，可以在静态和动态页面之间切换。你可以在这里学习如何与应用路由一起使用。
---
#  草稿模式
静态渲染在页面从无头 CMS 获取数据时非常有用。然而，当你在无头 CMS 上撰写草稿并希望立即在页面上查看草稿时，这种方式就不太理想了。你希望 Next.js 在 **请求时** 而不是构建时渲染这些页面，并获取草稿内容而不是发布内容。你希望 Next.js 仅在这种特定情况下切换到 [动态渲染](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)。

Next.js 有一个名为 **草稿模式** 的功能，可以解决这个问题。以下是如何使用它的说明。

## 第 1 步：创建并访问路由处理器

首先，创建一个 [路由处理器](/docs/app/building-your-application/routing/route-handlers)。它的名字可以是任何你想要的，例如 `app/api/draft/route.ts`。

然后，从 `next/headers` 导入 `draftMode` 并调用 `enable()` 方法。

```ts filename="app/api/draft/route.ts" switcher
// 启用草稿模式的路由处理器
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  draftMode().enable()
  return new Response('草稿模式已启用')
}
```

```js filename="app/api/draft/route.js" switcher
// 启用草稿模式的路由处理器
import { draftMode } from 'next/headers'

export async function GET(request) {
  draftMode().enable()
  return new Response('草稿模式已启用')
}
```

这将设置一个 **cookie** 以启用草稿模式。包含此 cookie 的后续请求将触发 **草稿模式**，改变静态生成页面的行为（稍后会有更多说明）。

你可以通过访问 `/api/draft` 并查看浏览器的开发者工具来手动测试这一点。注意响应头中的 `Set-Cookie` 与名为 `__prerender_bypass` 的 cookie。

### 安全地从你的无头 CMS 访问它

在实践中，你希望从你的无头 CMS 安全地调用这个路由处理器。具体步骤将根据你使用的无头 CMS 而有所不同，但这里有一些你可以采取的常见步骤。

这些步骤假设你使用的无头 CMS 支持设置 **自定义草稿 URL**。如果它不支持，你仍然可以使用这种方法来保护你的草稿 URL，但你需要手动构建和访问草稿 URL。

**首先**，你应该使用你选择的令牌生成器创建一个 **秘密令牌字符串**。这个秘密只有你的 Next.js 应用程序和你的无头 CMS 知道。这个秘密可以防止没有访问你 CMS 的人访问草稿 URL。

**其次**，如果你的无头 CMS 支持设置自定义草稿 URL，请将以下内容指定为草稿 URL。这假设你的路由处理器位于 `app/api/draft/route.ts`


```bash filename="终端"
https://<你的站点>/api/draft?secret=<令牌>&slug=<path>

```

- `<你的站点>` 应该是你的部署域名。
- `<令牌>` 应该替换为你生成的秘密令牌。
- `<path>` 应该是你想要查看的页面的路径。如果你想查看 `/posts/foo`，那么你应该使用 `&slug=/posts/foo`。

你的无头 CMS 可能允许你在草稿 URL 中包含一个变量，以便 `<path>` 可以根据 CMS 的数据动态设置，如下所示：`&slug=/posts/{entry.fields.slug}`

**最后**，在路由处理器中：

- 检查秘密是否匹配并且 `slug` 参数是否存在（如果不存在，请求应该失败）。
- 调用 `draftMode.enable()` 来设置 cookie。
- 然后重定向浏览器到 `slug` 指定的路径。
# route.ts

```typescript
// 带有密钥和别名的路由处理器
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  // 解析查询字符串参数
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // 检查密钥和next参数
  // 此密钥应该只有此路由处理器和CMS知道
  if (secret !== 'MY_SECRET_TOKEN' || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  // 从无头CMS获取数据以检查提供的`slug`是否存在
  // getPostBySlug将实现所需的无头CMS获取逻辑
  const post = await getPostBySlug(slug)

  // 如果别名不存在，则阻止启用草稿模式
  if (!post) {
    return new Response('Invalid slug', { status: 401 })
  }

  // 通过设置cookie启用草稿模式
  draftMode().enable()

  // 重定向到获取的帖子的路径
  // 我们不重定向到searchParams.slug，因为这可能会导致开放重定向漏洞
  redirect(post.slug)
}
```

# route.js

```javascript
// 带有密钥和别名的路由处理器
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request) {
  // 解析查询字符串参数
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // 检查密钥和next参数
  // 此密钥应该只有此路由处理器和CMS知道
  if (secret !== 'MY_SECRET_TOKEN' || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  // 从无头CMS获取数据以检查提供的`slug`是否存在
  // getPostBySlug将实现所需的无头CMS获取逻辑
  const post = await getPostBySlug(slug)

  // 如果别名不存在，则阻止启用草稿模式
  if (!post) {
    return new Response('Invalid slug', { status: 401 })
  }

  // 通过设置cookie启用草稿模式
  draftMode().enable()

  // 重定向到获取的帖子的路径
  // 我们不重定向到searchParams.slug，因为这可能会导致开放重定向漏洞
  redirect(post.slug)
}

```

如果成功，那么浏览器将被重定向到您想要查看的带有草稿模式cookie的路径。
## 步骤 2：更新页面

下一步是更新您的页面以检查 `draftMode().isEnabled` 的值。

如果您请求一个设置了 cookie 的页面，那么数据将在 **请求时** 获取（而不是在构建时）。

此外，`isEnabled` 的值将为 `true`。

```tsx filename="app/page.tsx" switcher
// 页面获取数据
import { draftMode } from 'next/headers'

async function getData() {
  const { isEnabled } = draftMode()

  const url = isEnabled
    ? 'https://draft.example.com'
    : 'https://production.example.com'

  const res = await fetch(url)

  return res.json()
}

export default async function Page() {
  const { title, desc } = await getData()

  return (
    <main>
      <h1>{title}</h1>
      <p>{desc}</p>
    </main>
  )
}
```

```jsx filename="app/page.js" switcher
// 页面获取数据
import { draftMode } from 'next/headers'

async function getData() {
  const { isEnabled } = draftMode()

  const url = isEnabled
    ? 'https://draft.example.com'
    : 'https://production.example.com'

  const res = await fetch(url)

  return res.json()
}

export default async function Page() {
  const { title, desc } = await getData()

  return (
    <main>
      <h1>{title}</h1>
      <p>{desc}</p>
    </main>
  )
}
```

就是这样！如果您通过无头 CMS 或手动访问草稿路由处理程序（带有 `secret` 和 `slug`），现在应该能够看到草稿内容。如果您更新草稿而没有发布，您应该能够查看草稿。

将此设置为您的无头 CMS 上的草稿 URL 或手动访问，您应该能够看到草稿。

```bash filename="终端"
https://<your-site>/api/draft?secret=<token>&slug=<path>
```

## 更多细节

### 清除草稿模式 cookie

默认情况下，草稿模式会话在浏览器关闭时结束。

要手动清除草稿模式 cookie，请创建一个调用 `draftMode().disable()` 的路由处理程序：

```ts filename="app/api/disable-draft/route.ts" switcher
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  draftMode().disable()
  return new Response('草稿模式已禁用')
}
```

```js filename="app/api/disable-draft/route.js" switcher
import { draftMode } from 'next/headers'

export async function GET(request) {
  draftMode().disable()
  return new Response('草稿模式已禁用')
}
```

然后，发送请求到 `/api/disable-draft` 以调用路由处理程序。如果使用 [`next/link`](/docs/app/api-reference/components/link) 调用此路由，您必须传递 `prefetch={false}` 以防止在预取时意外删除 cookie。

### 每次 `next build` 唯一

每次运行 `next build` 时，都会生成一个新的绕过 cookie 值。

这确保了绕过 cookie 不能被猜测。

> **须知**：要在 HTTP 上本地测试草稿模式，您的浏览器需要允许第三方 cookie 和本地存储访问。