# Static Site Generation (SSG)

使用静态网站生成（SSG）在构建时预渲染页面。

<details>
  <summary>示例</summary>

- [WordPress 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress)([演示](https://next-blog-wordpress.vercel.app))
- [使用 markdown 文件的博客启动器](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) ([演示](https://next-blog-starter.vercel.app/))
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
- [Kontent 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-kontent-ai) ([演示](https://next-blog-kontent.vercel.app/))
- [Builder.io 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-builder-io) ([演示](https://cms-builder-io.vercel.app/))
- [TinaCMS 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-tina) ([演示](https://cms-tina-example.vercel.app/))
- [静态推文 (演示)](https://static-tweet.vercel.app/)
- [Enterspeed 示例](https://github.com/vercel/next.js/tree/canary/examples/cms-enterspeed) ([演示](https://next-blog-demo.enterspeed.com/))

</details>

如果页面使用**静态生成**，页面的HTML将在**构建时**生成。这意味着在生产环境中，当你运行`next build`时，页面的HTML会被生成。然后，这个HTML将在每个请求中被重用。它可以被CDN缓存。

在Next.js中，你可以**有或没有数据**地静态生成页面。让我们看看每种情况。

### 无数据的静态生成

默认情况下，Next.js使用静态生成预渲染页面，而不需要获取数据。以下是一个例子：

```jsx
function About() {
  return <div>关于</div>
}

export default About
```

请注意，这个页面不需要获取任何外部数据就可以预渲染。在这种情况下，Next.js在构建时为每个页面生成一个单独的HTML文件。

### 带数据的静态生成

有些页面需要获取外部数据才能进行预渲染。有两种情况，可能
# 场景 1：您的页面内容依赖于外部数据

**示例**：您的博客页面可能需要从一个内容管理系统（CMS）获取博客文章列表。

```jsx
// TODO: 需要通过调用某个 API 端点获取 `posts`
//       才能在预渲染之前获取到这些数据。
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}
```

要在预渲染时获取这些数据，Next.js 允许您从同一个文件中导出一个名为 `getStaticProps` 的异步函数。这个函数在构建时被调用，允许您将获取到的数据传递给页面的 `props` 进行预渲染。

```jsx
export default function Blog({ posts }) {
  // 渲染文章...
}

// 这个函数在构建时被调用
export async function getStaticProps() {
  // 调用外部 API 端点获取文章
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 通过返回 { props: { posts } }，Blog 组件
  // 将在构建时作为属性接收到 `posts`
  return {
    props: {
      posts,
    },
  }
}
```

要了解更多关于 `getStaticProps` 如何工作的信息，请查看 [数据获取文档](/docs/pages/building-your-application/data-fetching/get-static-props)。

# 场景 2：您的页面路径依赖于外部数据

Next.js 允许您创建具有**动态路由**的页面。例如，您可以创建一个名为 `pages/posts/[id].js` 的文件，根据 `id` 显示单个博客文章。这将允许您在访问 `posts/1` 时显示 `id: 1` 的博客文章。

> 要了解更多关于动态路由的信息，请查看 [动态路由文档](/docs/pages/building-your-application/routing/dynamic-routes)。

然而，您想要在构建时预渲染的 `id` 可能取决于外部数据。

**示例**：假设您只向数据库中添加了一篇博客文章（`id: 1`）。在这种情况下，您只想在构建时预渲染 `posts/1`。

稍后，您可能会添加第二篇文章，`id: 2`。然后，您也想要预渲染 `posts/2`。

因此，您的页面**路径**，即在构建时预渲染的路径，取决于外部数据。为了处理这个问题，Next.js 允许您从一个动态页面（在这种情况下是 `pages/posts/[id].js`）导出一个名为 `getStaticPaths` 的异步函数。这个函数在构建时被调用，允许您指定您想要预渲染的路径。

```jsx
// 这个函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 端点获取文章
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 根据文章获取我们想要预渲染的路径
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // 我们将在构建时只预渲染这些路径。
  // { fallback: false } 表示其他路由应该返回 404。
  return { paths, fallback: false }
}
```

同样在 `pages/posts/[id].js` 中，您需要导出 `getStaticProps`，以便您可以获取有关该 `id` 的文章数据并使用它来预渲染页面：

```jsx
export default function Post({ post }) {
  // 渲染文章...
}

export async function getStaticPaths() {
  // ...
}

// 这个也在构建时被调用
export async function getStaticProps({ params }) {
  // params 包含文章的 `id`。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // 通过属性将文章数据传递给页面
  return { props: { post } }
}
```

要了解更多关于 `getStaticPaths` 如何工作的信息，请查看 [数据获取文档](/docs/pages/building-your-application/data-fetching/get-static-paths)。
### 何时使用静态生成？

我们建议尽可能使用**静态生成**（带或不带数据），因为您的页面可以一次性构建并由CDN提供服务，这比每次请求都由服务器渲染页面要快得多。

您可以为许多类型的页面使用静态生成，包括：

- 营销页面
- 博客文章和作品集
- 电子商务产品列表
- 帮助和文档

您应该问自己：“我能否在用户的请求之前预渲染这个页面？”如果答案是肯定的，那么您应该选择静态生成。

另一方面，如果无法在用户的请求之前预渲染页面，则静态生成**不是**一个好主意。也许您的页面显示了经常更新的数据，页面内容在每次请求中都会发生变化。

在这种情况下，您可以执行以下操作之一：

- 使用**客户端数据获取**的静态生成：您可以跳过预渲染页面的某些部分，然后使用客户端JavaScript来填充它们。要了解有关此方法的更多信息，请查看[数据获取文档](/docs/pages/building-your-application/data-fetching/client-side)。
- 使用**服务器端渲染**：Next.js会在每个请求上预渲染页面。由于页面不能由CDN缓存，因此速度会较慢，但预渲染的页面始终是最新的。我们将在下面讨论这种方法。