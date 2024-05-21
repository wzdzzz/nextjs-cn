# Preview Mode

须知：此特性已被 [Draft Mode](/docs/pages/building-your-application/configuring/draft-mode) 替代。

<details>
  <summary>示例</summary>

- [WordPress 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress) ([演示](https://next-blog-wordpress.vercel.app))
- [DatoCMS 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-datocms) ([演示](https://next-blog-datocms.vercel.app/))
- [TakeShape 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-takeshape) ([演示](https://next-blog-takeshape.vercel.app/))
- [Sanity 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-sanity) ([演示](https://next-blog-sanity.vercel.app/))
- [Prismic 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-prismic) ([演示](https://next-blog-prismic.vercel.app/))
- [Contentful 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-contentful) ([演示](https://next-blog-contentful.vercel.app/))
- [Strapi 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-strapi) ([演示](https://next-blog-strapi.vercel.app/))
- [Prepr 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-prepr) ([演示](https://next-blog-prepr.vercel.app/))
- [Agility CMS 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-agilitycms) ([演示](https://next-blog-agilitycms.vercel.app/))
- [Cosmic 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-cosmic) ([演示](https://next-blog-cosmic.vercel.app/))
- [ButterCMS 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-buttercms) ([演示](https://next-blog-buttercms.vercel.app/))
- [Storyblok 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-storyblok) ([演示](https://next-blog-storyblok.vercel.app/))
- [GraphCMS 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-graphcms) ([演示](https://next-blog-graphcms.vercel.app/))
- [Kontent 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-kontent-ai) ([演示](https://next-blog-kontent.vercel.app//))
- [Umbraco Heartcore 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-umbraco-heartcore) ([演示](https://next-blog-umbraco-heartcore.vercel.app/))
- [Plasmic 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-plasmic) ([演示](https://nextjs-plasmic-example.vercel.app/))
- [Enterspeed 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-enterspeed) ([演示](https://next-blog-demo.enterspeed.com/))
- [Makeswift 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-makeswift) ([演示](https://nextjs-makeswift-example.vercel.app/))

</details>

在 [页面文档](/docs/pages/building-your-application/routing/pages-and-layouts) 和 [数据获取文档](/docs/pages/building-your-application/data-fetching) 中，我们讨论了如何使用 `getStaticProps` 和 `getStaticPaths` 在构建时预渲染页面（**静态生成**）。

静态生成对于从无头 CMS 获取数据的页面非常有用。然而，当你在无头 CMS 上撰写草稿并希望立即在页面上**预览**草稿时，这并不理想。你希望 Next.js 在**请求时**而不是构建时呈现这些页面，并获取草稿内容而不是发布内容。你希望 Next.js 仅在特定情况下绕过静态生成。

Next.js 有一个名为 **预览模式** 的特性，可以解决这个问题。以下是如何使用它的说明。
## 步骤 1：创建并访问预览 API 路由

> 如果您不熟悉 Next.js API 路由，请先查看 [API Routes 文档](/docs/pages/building-your-application/routing/api-routes)。

首先，创建一个 **预览 API 路由**。它可以有任何名称 - 例如 `pages/api/preview.js`（如果使用 TypeScript，则为 `.ts`）。

在这个 API 路由中，您需要在响应对象上调用 `setPreviewData`。`setPreviewData` 的参数应该是一个对象，这个对象可以被 `getStaticProps` 使用（稍后会详细介绍）。目前，我们将使用 `{}`。

```js
export default function handler(req, res) {
  // ...
  res.setPreviewData({})
  // ...
}
```

`res.setPreviewData` 在浏览器上设置了一些 **cookie**，这将开启预览模式。包含这些 cookie 的任何对 Next.js 的请求都将被视为 **预览模式**，静态生成页面的行为将会改变（稍后详细介绍）。

您可以通过创建如下的 API 路由并手动从浏览器访问它来手动测试：

```js filename="pages/api/preview.js"
// 简单示例，用于从浏览器手动测试。
export default function handler(req, res) {
  res.setPreviewData({})
  res.end('Preview mode enabled')
}
```

如果您打开浏览器的开发者工具并访问 `/api/preview`，您将注意到在这个请求上将设置 `__prerender_bypass` 和 `__next_preview_data` cookie。
### 从无头CMS安全访问

在实践中，您可能希望从您的无头CMS中安全地调用这个API路由。具体步骤将根据您使用的无头CMS而变化，但这里有一些您可以采取的常见步骤。

这些步骤假设您使用的无头CMS支持设置**自定义预览URL**。如果不支持，您仍然可以使用此方法来保护您的预览URL，但您需要手动构建和访问预览URL。

**首先**，您应该使用您选择的令牌生成器创建一个**秘密令牌字符串**。这个秘密只有您的Next.js应用和您的无头CMS知道。这个秘密可以防止没有访问您CMS权限的人访问预览URL。

**其次**，如果您的无头CMS支持设置自定义预览URL，请将以下内容指定为预览URL。这假设您的预览API路由位于`pages/api/preview.js`。

```bash filename="终端"
https://<您的站点>/api/preview?secret=<令牌>&slug=<path>
```

- `<您的站点>`应该是您的部署域名。
- `<令牌>`应该替换为您生成的秘密令牌。
- `<path>`应该是您想要预览的页面的路径。如果您想要预览`/posts/foo`，则应该使用`&slug=/posts/foo`。

您的无头CMS可能允许您在预览URL中包含一个变量，以便`<path>`可以根据CMS的数据动态设置，如下所示：`&slug=/posts/{entry.fields.slug}`

**最后**，在预览API路由中：

- 检查秘密是否匹配并且`slug`参数存在（如果不存在，请求应该失败）。
-
- 调用`res.setPreviewData`。
- 然后重定向浏览器到`slug`指定的路径。（以下示例使用了[307重定向](https://developer.mozilla.org/docs/Web/HTTP/Status/307)）。

```js
export default async (req, res) => {
  // 检查秘密和下一个参数
  // 这个秘密应该只有这个API路由和CMS知道
  if (req.query.secret !== 'MY_SECRET_TOKEN' || !req.query.slug) {
    return res.status(401).json({ message: '无效的令牌' })
  }

  // 从无头CMS获取以检查提供的`slug`是否存在
  // getPostBySlug将实现所需的获取逻辑到无头CMS
  const post = await getPostBySlug(req.query.slug)

  // 如果slug不存在，防止启用预览模式
  if (!post) {
    return res.status(401).json({ message: '无效的slug' })
  }

  // 通过设置cookie启用预览模式
  res.setPreviewData({})

  // 重定向到获取的帖子的路径
  // 我们不重定向到req.query.slug，因为这可能会导致开放重定向漏洞
  res.redirect(post.slug)
}
```

如果成功，浏览器将被重定向到您想要预览的路径，同时设置了预览模式的cookie。
## 第二步：更新 `getStaticProps`

下一步是更新 `getStaticProps` 以支持预览模式。

如果您请求一个设置了预览模式 cookie 的页面（通过 `res.setPreviewData`），那么 `getStaticProps` 将在 **请求时** 被调用（而不是在构建时）。

此外，它将与一个 `context` 对象一起被调用，其中：

- `context.preview` 将为 `true`。
- `context.previewData` 将与用于 `setPreviewData` 的参数相同。

```js
export async function getStaticProps(context) {
  // 如果您请求此页面时设置了预览模式 cookie：
  //
  // - context.preview 将为 true
  // - context.previewData 将与
  //   `setPreviewData` 使用的参数相同。
}
```

我们在预览 API 路由中使用了 `res.setPreviewData({})`，所以 `context.previewData` 将是 `{}`。如果需要，您可以使用它将会话信息从预览 API 路由传递到 `getStaticProps`。

如果您还使用了 `getStaticPaths`，那么 `context.params` 也将可用。

### 获取预览数据

您可以更新 `getStaticProps` 以根据 `context.preview` 和/或 `context.previewData` 获取不同的数据。

例如，您的无头 CMS 可能有一个用于草稿文章的不同 API 端点。如果是这样，您可以使用 `context.preview` 来修改 API 端点 URL，如下所示：

```js
export async function getStaticProps(context) {
  // 如果 context.preview 为 true，则将 "/preview" 附加到 API 端点
  // 以请求草稿数据而不是发布数据。这将根据您使用的无头 CMS 而变化。
  const res = await fetch(`https://.../${context.preview ? 'preview' : ''}`)
  // ...
}
```

就是这样！如果您从无头 CMS 或手动访问预览 API 路由（带有 `secret` 和 `slug`），现在您应该能够看到预览内容。如果您更新了草稿而没有发布，您应该能够预览草稿。

将此设置为您的无头 CMS 上的预览 URL 或手动访问，您应该能够看到预览。

```bash filename="终端"
https://<您的网站>/api/preview?secret=<token>&slug=<path>
```
# More Details

> **须知**：在渲染过程中，`next/router` 暴露了一个 `isPreview` 标志，查看 [router object docs](/docs/pages/api-reference/functions/use-router#router-object) 以获取更多信息。

### 指定预览模式持续时间

`setPreviewData` 接受一个可选的第二个参数，它应该是一个选项对象。它接受以下键：

- `maxAge`：指定预览会话持续的秒数。
- `path`：指定 cookie 应该应用的路径。默认为 `/`，为所有路径启用预览模式。

```js
setPreviewData(data, {
  maxAge: 60 * 60, // 预览模式 cookie 1 小时后过期
  path: '/about', // 预览模式 cookie 应用于 /about 路径
})
```

### 清除预览模式 cookie

默认情况下，预览模式 cookie 没有设置过期日期，因此当浏览器关闭时预览会话结束。

要手动清除预览模式 cookie，请创建一个调用 `clearPreviewData()` 的 API 路由：

```js filename="pages/api/clear-preview-mode-cookies.js"
export default function handler(req, res) {
  res.clearPreviewData({})
}
```

然后，发送请求到 `/api/clear-preview-mode-cookies` 以调用 API 路由。如果使用 [`next/link`](/docs/pages/api-reference/components/link) 调用此路由，您必须传递 `prefetch={false}` 以防止在链接预获取期间调用 `clearPreviewData`。

如果在 `setPreviewData` 调用中指定了路径，则必须将相同的路径传递给 `clearPreviewData`：

```js filename="pages/api/clear-preview-mode-cookies.js"
export default function handler(req, res) {
  const { path } = req.query

  res.clearPreviewData({ path })
}
```

### `previewData` 大小限制

您可以将一个对象传递给 `setPreviewData` 并在 `getStaticProps` 中使用它。然而，由于数据将存储在 cookie 中，因此有大小限制。目前，预览数据限制为 2KB。

### 与 `getServerSideProps` 配合使用

预览模式也适用于 `getServerSideProps`。它还将在包含 `preview` 和 `previewData` 的 `context` 对象上可用。

> **须知**：使用预览模式时，您不应设置 `Cache-Control` 标头，因为它不能被绕过。相反，我们建议使用 [ISR](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)。

### 与 API 路由配合使用

API 路由将在请求对象下访问 `preview` 和 `previewData`。例如：

```js
export default function myApiRoute(req, res) {
  const isPreview = req.preview
  const previewData = req.previewData
  // ...
}
```

### 每次 `next build` 唯一

当完成 `next build` 时，绕过 cookie 的值和用于加密 `previewData` 的私钥都会更改。
这确保了无法猜测绕过 cookie。

> **须知**：要在 HTTP 上本地测试预览模式，您的浏览器需要允许第三方 cookie 和本地存储访问。