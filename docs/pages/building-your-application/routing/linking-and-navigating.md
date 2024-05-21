---
title: 链接和导航
description: 学习 Next.js 中导航的工作原理，以及如何使用 Link 组件和 `useRouter` 钩子。
---

Next.js 路由器允许你在页面之间进行客户端路由转换，类似于单页应用程序。

提供了一个名为 `Link` 的 React 组件来实现这种客户端路由转换。

```jsx
import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link href="/">首页</Link>
      </li>
      <li>
        <Link href="/about">关于我们</Link>
      </li>
      <li>
        <Link href="/blog/hello-world">博客文章</Link>
      </li>
    </ul>
  )
}

export default Home
```

上面的示例使用了多个链接。每个链接将一个路径（`href`）映射到一个已知页面：

- `/` → `pages/index.js`
- `/about` → `pages/about.js`
- `/blog/hello-world` → `pages/blog/[slug].js`

在视口中的任何 `<Link />`（最初或通过滚动）将默认被预取（包括相应的数据），适用于使用 [静态生成](/docs/pages/building-your-application/data-fetching/get-static-props) 的页面。对于 [服务器渲染](/docs/pages/building-your-application/data-fetching/get-server-side-props) 路由，只有在点击 `<Link />` 时才会获取相应的数据。

## 链接到动态路径

你还可以使用插值来创建路径，这在处理 [动态路由段](/docs/pages/building-your-application/routing/dynamic-routes) 时非常有用。例如，要显示作为 prop 传递给组件的帖子列表：

```jsx
import Link from 'next/link'

function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

> 示例中使用了 [`encodeURIComponent`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) 以保持路径的 utf-8 兼容性。

或者，使用 URL 对象：

```jsx
import Link from 'next/link'

function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            href={{
              pathname: '/blog/[slug]',
              query: { slug: post.slug },
            }}
          >
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

现在，我们不再使用插值来创建路径，而是在 `href` 中使用一个 URL 对象，其中：

- `pathname` 是 `pages` 目录中页面的名称。在这种情况下是 `/blog/[slug]`。
- `query` 是包含动态段的对象。在这种情况下是 `slug`。

## 注入路由器

<details>
  <summary>示例</summary>

- [动态路由](https://github.com/vercel/next.js/tree/canary/examples/dynamic-routing)

</details>

要在 React 组件中访问 [`router` 对象](/docs/pages/api-reference/functions/use-router#router-object)，你可以使用 [`useRouter`](/docs/pages/api-reference/functions/use-router) 或 [`withRouter`](/docs/pages/api-reference/functions/use-router#withrouter)。

通常我们推荐使用 [`useRouter`](/docs/pages/api-reference/functions/use-router)。

## 命令式路由

[`next/link`](/docs/pages/api-reference/components/link) 应该能够满足你的大部分路由需求，但你还可以在没有它的情况下进行客户端导航，请参阅 [`next/router`](/docs/pages/api-reference/functions/use-router) 的 [文档](/docs/pages/api-reference/functions/use-router)。

以下示例展示了如何使用 [`useRouter`](/docs/pages/api-reference/functions/use-router) 进行基本的页面导航：

```jsx
import { useRouter } from 'next/router'

export default function ReadMore() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/about')}>
      点击这里了解更多
    </button>
  )
}
```
## 浅层路由

<details>
  <summary>示例</summary>

- [浅层路由](https://github.com/vercel/next.js/tree/canary/examples/with-shallow-routing)

</details>

浅层路由允许您更改URL，而无需再次运行数据获取方法，这包括 [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)、[`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 和 [`getInitialProps`](/docs/pages/api-reference/functions/get-initial-props)。

您将通过 [`router` 对象](/docs/pages/api-reference/functions/use-router#router-object)（由 [`useRouter`](/docs/pages/api-reference/functions/use-router) 或 [`withRouter`](/docs/pages/api-reference/functions/use-router#withrouter) 添加）接收到更新后的 `pathname` 和 `query`，而不会丢失状态。

要启用浅层路由，将 `shallow` 选项设置为 `true`。考虑以下示例：

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// 当前URL是 '/'
function Page() {
  const router = useRouter()

  useEffect(() => {
    // 始终在第一次渲染后进行导航
    router.push('/?counter=10', undefined, { shallow: true })
  }, [])

  useEffect(() => {
    // 计数器改变了！
  }, [router.query.counter])
}

export default Page
```

URL将更新为 `/?counter=10`，页面不会替换，只有路由的状态会改变。

您还可以通过 [`componentDidUpdate`](https://react.dev/reference/react/Component#componentdidupdate) 监听URL变化，如下所示：

```jsx
componentDidUpdate(prevProps) {
  const { pathname, query } = this.props.router
  // 验证属性已更改以避免无限循环
  if (query.counter !== prevProps.router.query.counter) {
    // 根据新的查询获取数据
  }
}
```

### 须知

浅层路由 **仅** 适用于当前页面的URL变化。例如，假设我们有另一个名为 `pages/about.js` 的页面，并且您运行以下代码：

```js
router.push('/?counter=10', '/about?counter=10', { shallow: true })
```

由于这是一个新页面，它将卸载当前页面，加载新页面，并等待数据获取，即使我们请求进行浅层路由。

当浅层路由与中间件一起使用时，它不会像以前没有中间件时那样确保新页面与当前页面匹配。这是因为中间件能够动态重写，并且无法在不进行数据获取的情况下在客户端验证，而数据获取在使用浅层路由时被跳过，因此浅层路由更改必须始终被视为浅层。