# getStaticPaths

当从使用[动态路由](/docs/pages/building-your-application/routing/dynamic-routes)的页面导出一个名为`getStaticPaths`的函数时，Next.js将静态预渲染`getStaticPaths`指定的所有路径。

```tsx filename="pages/repo/[name].tsx" switcher
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
        },
      }, // 见下面的“paths”部分
    ],
    fallback: true, // false或“blocking”
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetStaticProps<{
  repo: Repo
}>

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count
}
```

```jsx filename="pages/repo/[name].js" switcher
export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
        },
      }, // 见下面的“paths”部分
    ],
    fallback: true, // false或“blocking”
  }
}

export async function getStaticProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}

export default function Page({ repo }) {
  return repo.stargazers_count
}
```


## getStaticPaths 返回值

`getStaticPaths`函数应该返回一个对象，具有以下**必需**属性：

### `paths`

`paths`键决定了将预渲染哪些路径。例如，假设您有一个使用[动态路由](/docs/pages/building-your-application/routing/dynamic-routes)的页面，名为`pages/posts/[id].js`。如果您从这个页面导出`getStaticPaths`并为`paths`返回以下内容：

```js
return {
  paths: [
    { params: { id: '1' }},
    {
      params: { id: '2' },
      // 配置了i18n时，也可以返回路径的locale
      locale: "en",
    },
  ],
  fallback: ...
}
```

然后，在`next build`期间，Next.js将使用`pages/posts/[id].js`中的页面组件静态生成`/posts/1`和`/posts/2`。

每个`params`对象的值必须与页面名称中使用的参数匹配：

- 如果页面名称是`pages/posts/[postId]/[commentId]`，则`params`应包含`postId`和`commentId`。
- 如果页面名称使用[通配符路由](/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments)，如`pages/[...slug]`，则`params`应包含`slug`（这是一个数组）。如果这个数组是`['hello', 'world']`，那么Next.js将静态生成`/hello/world`页面。
- 如果页面使用[可选的通配符路由](/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-segments)，可以使用`null`、`[]`、`undefined`或`false`来呈现最顶层的路由。例如，如果您为`pages/[[...slug]]`提供`slug: false`，Next.js将静态生成`/`页面。

`params`字符串是**大小写敏感**的，最好规范化以确保路径正确生成。例如，如果返回的参数是`WoRLD`，它只会在实际访问的路径是`WoRLD`时匹配，而不是`world`或`World`。

在`params`对象之外，当[配置了i18n](/docs/pages/building-your-application/routing/internationalization)时，可以返回一个`locale`字段，该字段配置了正在生成的路径的语言环境。
### `fallback: false`

如果 `fallback` 设置为 `false`，则 `getStaticPaths` 未返回的任何路径都将导致 **404 页面**。

当运行 `next build` 时，Next.js 会检查 `getStaticPaths` 是否返回了 `fallback: false`，然后它将仅构建 `getStaticPaths` 返回的路径。如果您需要创建的路径数量较少，或者新页面数据不经常添加，此选项非常有用。如果您需要添加更多路径，并且您已经设置了 `fallback: false`，则需要再次运行 `next build`，以便可以生成新路径。

以下示例预先渲染了每个页面一个博客帖子，称为 `pages/posts/[id].js`。博客帖子的列表将从一个 CMS 获取并由 `getStaticPaths` 返回。然后，对于每个页面，它使用 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 从 CMS 获取帖子数据。

```jsx filename="pages/posts/[id].js"
function Post({ post }) {
  // 渲染帖子...
}

// 此函数在构建时调用
export async function getStaticPaths() {
  // 调用外部 API 端点获取帖子
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 根据帖子获取我们要预先渲染的路径
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // 我们将在构建时仅预先渲染这些路径。
  // { fallback: false } 表示其他路由应该 404。
  return { paths, fallback: false }
}

// 这也会在构建时调用
export async function getStaticProps({ params }) {
  // params 包含帖子 `id`。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // 通过 props 将帖子数据传递给页面
  return { props: { post } }
}

export default Post
```
# `fallback: true`

<details>
  <summary>Examples</summary>

- [静态生成大量页面](https://static-tweet.vercel.app)

</details>

如果 `fallback` 设置为 `true`，则 `getStaticProps` 的行为会以以下方式改变：

- `getStaticPaths` 返回的路径将在构建时通过 `getStaticProps` 渲染为 `HTML`。
- 尚未在构建时生成的路径将**不会**导致404页面。相反，Next.js 将在首次请求此类路径时提供页面的[“fallback”](#fallback-pages)版本。网络爬虫（例如 Google）不会提供 fallback，而是路径将表现为 [`fallback: 'blocking'`](#fallback-blocking)。
- 当通过 `next/link` 或 `next/router`（客户端）导航到带有 `fallback: true` 的页面时，Next.js 将**不会**提供 fallback，而是页面将表现为 [`fallback: 'blocking'`](#fallback-blocking)。
- 在后台，Next.js 将静态生成所请求路径的 `HTML` 和 `JSON`。这包括运行 `getStaticProps`。
- 完成后，浏览器将接收到生成路径的 `JSON`。这将用于自动使用所需属性渲染页面。从用户的角度来看，页面将从 fallback 页面切换到完整页面。
- 同时，Next.js 将此路径添加到预渲染页面列表中。对相同路径的后续请求将提供生成的页面，就像在构建时预渲染的其他页面一样。

> **须知**：在使用 [`output: 'export'`](/docs/pages/building-your-application/deploying/static-exports) 时，不支持 `fallback: true`。

#### 何时使用 `fallback: true`？

如果你的应用有非常多的静态页面依赖于数据（例如非常大的电子商务网站），`fallback: true` 将非常有用。如果你想预渲染所有产品页面，构建将需要很长时间。

相反，你可以静态生成一小部分页面，并为其余页面使用 `fallback: true`。当有人请求尚未生成的页面时，用户将看到带有加载指示器或骨架组件的页面。

不久之后，`getStaticProps` 完成，页面将使用所请求的数据进行渲染。从现在开始，任何请求相同页面的人都将获得静态预渲染的页面。

这确保了用户始终拥有快速的体验，同时保持快速构建和静态生成的好处。

`fallback: true` 不会 _更新_ 生成的页面，有关更新页面的信息，请查看 [增量静态再生](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)。
### `fallback: 'blocking'`

如果 `fallback` 设置为 `'blocking'`，那么 `getStaticPaths` 未返回的新路径将等待 `HTML` 生成，与 SSR 相同（因此称为 _blocking_），然后将其缓存以供将来请求使用，这样每个路径只发生一次。

`getStaticProps` 的行为如下：

- `getStaticPaths` 返回的路径将在构建时由 `getStaticProps` 渲染为 `HTML`。
- 未在构建时生成的路径将**不会**导致 404 页面。相反，Next.js 将在第一次请求时进行 SSR，并返回生成的 `HTML`。
- 完成后，浏览器接收到生成路径的 `HTML`。从用户的角度来看，它将从“浏览器正在请求页面”过渡到“完整页面已加载”。没有加载/回退状态的闪烁。
- 同时，Next.js 将此路径添加到预渲染页面的列表中。对同一路径的后续请求将提供生成的页面，就像在构建时预渲染的其他页面一样。

`fallback: 'blocking'` 默认不会 _更新_ 生成的页面。要更新生成的页面，请结合使用 [增量静态再生](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration) 和 `fallback: 'blocking'`。

> **须知**：当使用 [`output: 'export'`](/docs/pages/building-your-application/deploying/static-exports) 时，不支持 `fallback: 'blocking'`。

### 回退页面

在页面的“回退”版本中：

- 页面的属性将是空的。
- 使用 [router](/docs/pages/api-reference/functions/use-router)，您可以检测是否正在呈现回退，`router.isFallback` 将为 `true`。

以下示例展示了使用 `isFallback` 的方法：

```jsx filename="pages/posts/[id].js"
import { useRouter } from 'next/router'

function Post({ post }) {
  const router = useRouter()

  // 如果页面尚未生成，这将在最初显示
  // 直到 getStaticProps() 完成运行
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // 渲染帖子...
}

// 这个函数在构建时被调用
export async function getStaticPaths() {
  return {
    // 仅在构建时生成 `/posts/1` 和 `/posts/2`
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    // 启用静态生成其他页面
    // 例如：`/posts/3`
    fallback: true,
  }
}

// 这也在构建时被调用
export async function getStaticProps({ params }) {
  // params 包含帖子 `id`。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // 通过属性将帖子数据传递给页面
  return {
    props: { post },
    // 如果有请求进来，每秒钟重新生成帖子最多一次
    revalidate: 1,
  }
}

export default Post
```
## 版本历史

| 版本   | 变更                                                                                                                                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.4.0` | [应用路由](/docs/app/building-your-application/data-fetching) 现在稳定了，简化了数据获取，包括 [`generateStaticParams()`](/docs/app/api-reference/functions/generate-static-params) |
| `v12.2.0` | [按需增量静态再生成](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation) 现在稳定了。                                          |
| `v12.1.0` | [按需增量静态再生成](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation) 添加了（beta）。                                       |
| `v9.5.0`  | 稳定的 [增量静态再生成](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)                                                                               |
| `v9.3.0`  | 引入了 `getStaticPaths`。                                                                                                                                                                                |