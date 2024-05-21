# Draft Mode

Next.js 拥有草稿模式，可以在静态和动态页面之间切换。您可以了解如何通过页面路由来实现这一点。

在[页面文档](/docs/pages/building-your-application/routing/pages-and-layouts)和[数据获取文档](/docs/pages/building-your-application/data-fetching)中，我们讨论了如何使用 `getStaticProps` 和 `getStaticPaths` 在构建时预渲染页面（**静态生成**）。

静态生成对于您的页面从无头CMS获取数据非常有用。然而，当您在无头CMS上撰写草稿并希望立即在页面上查看草稿时，这并不理想。您希望Next.js在请求时而不是构建时渲染这些页面，并获取草稿内容而不是发布的内容。您希望Next.js仅在特定情况下绕过静态生成。

Next.js有一个名为**草稿模式**的功能，可以解决这个问题。以下是如何使用它的说明。
# Step 1: 创建和访问 API 路由

> 如果您不熟悉 Next.js 的 API 路由，请先查看 [API Routes documentation](/docs/pages/building-your-application/routing/api-routes)。

首先，创建一个 **API 路由**。它可以有任何名称 - 例如 `pages/api/draft.ts`

在这个 API 路由中，您需要在响应对象上调用 `setDraftMode`。

```js
export default function handler(req, res) {
  // ...
  res.setDraftMode({ enable: true })
  // ...
}
```

这将设置一个 **cookie** 以启用草稿模式。包含此 cookie 的后续请求将触发 **草稿模式**，改变静态生成页面的行为（稍后详细介绍）。

您可以通过创建如下的 API 路由并手动从浏览器访问它来手动测试：

```ts filename="pages/api/draft.ts"
// 一个简单的示例，用于从浏览器手动测试。
export default function handler(req, res) {
  res.setDraftMode({ enable: true })
  res.end('草稿模式已启用')
}
```

如果您打开浏览器的开发者工具并访问 `/api/draft`，您将注意到一个名为 `__prerender_bypass` 的 `Set-Cookie` 响应头。

### 安全地从无头 CMS 访问它

在实践中，您希望从您的无头 CMS 安全地调用这个 API 路由。具体步骤将根据您的无头 CMS 而变化，但这里有一些您可以采取的常见步骤。

这些步骤假设您使用的无头 CMS 支持设置 **自定义草稿 URL**。如果它不支持，您仍然可以使用此方法来保护您的草稿 URL，但您需要手动构建和访问草稿 URL。

**首先**，您应该使用您选择的令牌生成器创建一个 **秘密令牌字符串**。这个秘密只有您的 Next.js 应用程序和您的无头 CMS 知道。这个秘密可以防止没有访问您 CMS 的人访问草稿 URL。

**其次**，如果您的无头 CMS 支持设置自定义草稿 URL，请将以下内容指定为草稿 URL。这假设您的草稿 API 路由位于 `pages/api/draft.ts`。

```bash filename="Terminal"
https://<your-site>/api/draft?secret=<token>&slug=<path>
```

- `<your-site>` 应该是您的部署域名。
- `<token>` 应该替换为您生成的秘密令牌。
- `<path>` 应该是您想要查看的页面的路径。如果您想要查看 `/posts/foo`，则应该使用 `&slug=/posts/foo`。

您的无头 CMS 可能允许您在草稿 URL 中包含一个变量，以便 `<path>` 可以根据 CMS 的数据动态设置，如下所示：`&slug=/posts/{entry.fields.slug}`

**最后**，在草稿 API 路由中：

- 检查秘密是否匹配并且 `slug` 参数存在（如果不存在，请求应该失败）。
-
- 调用 `res.setDraftMode`。
- 然后重定向浏览器到 `slug` 指定的路径。（以下示例使用了 [307 redirect](https://developer.mozilla.org/docs/Web/HTTP/Status/307)）。

```js
export default async (req, res) => {
  // 检查秘密和下一个参数
  // 这个秘密应该只有这个 API 路由和 CMS 知道
  if (req.query.secret !== 'MY_SECRET_TOKEN' || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // 从无头 CMS 获取数据以检查提供的 `slug` 是否存在
  // getPostBySlug 将实现所需的获取逻辑到无头 CMS
  const post = await getPostBySlug(req.query.slug)

  // 如果 slug 不存在，则防止启用草稿模式
  if (!post) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  // 通过设置 cookie 启用草稿模式
  res.setDraftMode({ enable: true })

  // 重定向到获取的帖子的路径
  // 我们不重定向到 req.query.slug，因为这可能会导致开放重定向漏洞
  res.redirect(post.slug)
}
```

如果成功，那么浏览器将被重定向到您想要查看的路径，并带有草稿模式 cookie。
## 第2步：更新 `getStaticProps`

下一步是更新 `getStaticProps` 以支持草稿模式。

如果您请求一个页面，该页面的 `getStaticProps` 通过 `res.setDraftMode` 设置了 cookie，那么 `getStaticProps` 将在 **请求时** 被调用（而不是在构建时）。

此外，它将带有一个 `context` 对象，其中 `context.draftMode` 将为 `true`。

```js
export async function getStaticProps(context) {
  if (context.draftMode) {
    // 动态数据
  }
}
```

我们在草稿 API 路由中使用了 `res.setDraftMode`，所以 `context.draftMode` 将为 `true`。

如果您还使用了 `getStaticPaths`，那么 `context.params` 也将可用。

### 获取草稿数据

您可以更新 `getStaticProps` 以基于 `context.draftMode` 获取不同的数据。

例如，您的无头 CMS 可能有一个用于草稿文章的不同 API 端点。如果是这样，您可以像下面这样修改 API 端点 URL：

```js
export async function getStaticProps(context) {
  const url = context.draftMode
    ? 'https://draft.example.com'
    : 'https://production.example.com'
  const res = await fetch(url)
  // ...
}
```

就是这样！如果您通过无头 CMS 或手动访问草稿 API 路由（带有 `secret` 和 `slug`），您现在应该能够看到草稿内容。如果您更新草稿而没有发布，您应该能够查看草稿。

将此设置为您的无头 CMS 上的草稿 URL 或手动访问，您应该能够看到草稿。

```bash filename="终端"
https://<您的站点>/api/draft?secret=<令牌>&slug=<path>
```

## 更多细节

### 清除草稿模式 cookie

默认情况下，草稿模式会话在浏览器关闭时结束。

要手动清除草稿模式 cookie，创建一个调用 `setDraftMode({ enable: false })` 的 API 路由：

```ts filename="pages/api/disable-draft.ts"
export default function handler(req, res) {
  res.setDraftMode({ enable: false })
}
```

然后，发送请求到 `/api/disable-draft` 以调用 API 路由。如果使用 [`next/link`](/docs/pages/api-reference/components/link) 调用此路由，您必须传递 `prefetch={false}` 以防止在预获取时意外删除 cookie。

### 与 `getServerSideProps` 兼容

草稿模式与 `getServerSideProps` 兼容，并作为 [`context`](/docs/pages/api-reference/functions/get-server-side-props#context-parameter) 对象中的 `draftMode` 键可用。

> **须知**：使用草稿模式时，您不应设置 `Cache-Control` 标头，因为它无法被绕过。相反，我们建议使用 [ISR](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)。

### 与 API 路由兼容

API 路由将能够在请求对象上访问 `draftMode`。例如：

```js
export default function myApiRoute(req, res) {
  if (req.draftMode) {
    // 获取草稿数据
  }
}
```

### 每次 `next build` 唯一

每次运行 `next build` 时，都会生成一个新的绕过 cookie 值。

这确保了绕过 cookie 不能被猜测。

> **须知**：要在 HTTP 上本地测试草稿模式，您的浏览器需要允许第三方 cookie 和本地存储访问。