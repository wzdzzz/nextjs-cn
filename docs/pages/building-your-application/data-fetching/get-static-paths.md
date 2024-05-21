# getStaticPaths

动态路由页面使用 `getStaticProps` 时，需要定义一个静态生成路径的列表。

当你从一个使用动态路由的页面导出一个名为 `getStaticPaths`（静态网站生成）的函数时，Next.js 会静态预渲染 `getStaticPaths` 指定的所有路径。

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
      }, // 详见下方 "paths" 部分
    ],
    fallback: true, // false 或 "blocking"
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
      }, // 详见下方 "paths" 部分
    ],
    fallback: true, // false 或 "blocking"
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

[`getStaticPaths` API 参考](/docs/pages/api-reference/functions/get-static-paths) 涵盖了所有可以与 `getStaticPaths` 一起使用的参数和属性。

## 何时使用 getStaticPaths？

如果你正在静态预渲染使用动态路由的页面，请使用 `getStaticPaths`：

- 数据来自无头 CMS
- 数据来自数据库
- 数据来自文件系统
- 数据可以被公开缓存（非用户特定）
- 页面必须预渲染（用于 SEO）并且非常快 — `getStaticProps` 生成 `HTML` 和 `JSON` 文件，两者都可以被 CDN 缓存以提高性能

## getStaticPaths 何时运行

`getStaticPaths` 仅在生产环境中构建时运行，不会在运行时调用。你可以使用 [这个工具](https://next-code-elimination.vercel.app/) 验证 `getStaticPaths` 内部编写的代码是否从客户端捆绑包中移除。

### getStaticProps 与 getStaticPaths 的关系如何运行

- 在构建期间，`getStaticProps` 会为 `next build` 返回的任何 `paths` 运行
- 使用 `fallback: true` 时，`getStaticProps` 会在后台运行
- 使用 `fallback: blocking` 时，`getStaticProps` 会在初始渲染前被调用

## 在哪里可以使用 getStaticPaths

- `getStaticPaths` **必须** 与 `getStaticProps` 一起使用
- 你**不能**将 `getStaticPaths` 与 [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props) 一起使用
- 你可以从一个也使用 `getStaticProps` 的 [动态路由](/docs/pages/building-your-application/routing/dynamic-routes) 中导出 `getStaticPaths`
- 你**不能**从非页面文件（例如你的 `components` 文件夹）中导出 `getStaticPaths`
- 你必须将 `getStaticPaths` 作为独立函数导出，而不是页面组件的属性

## 在开发中的每个请求上运行

在开发中（`next dev`），`getStaticPaths` 会在每个请求上被调用。
## 按需生成路径

`getStaticPaths` 允许你在构建期间控制生成哪些页面，而不是使用 [`fallback`](/docs/pages/api-reference/functions/get-static-paths#fallback-blocking) 按需生成。在构建期间生成更多页面会导致构建速度变慢。

你可以通过为 `paths` 返回一个空数组来推迟按需生成所有页面。这在将你的 Next.js 应用程序部署到多个环境时特别有用。例如，你可以通过为预览（而不是生产构建）按需生成所有页面来实现更快的构建。这对于拥有数百/数千个静态页面的网站很有帮助。

```jsx filename="pages/posts/[id].js"
export async function getStaticPaths() {
  // 当为 true（在预览环境）时不要
  // 预渲染任何静态页面
  // （构建更快，但初始页面加载速度较慢）
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  // 调用外部 API 端点以获取帖子
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 根据帖子获取我们想要预渲染的路径
  // 在生产环境中，预渲染所有页面
  // （构建更慢，但初始页面加载速度更快）
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // { fallback: false } 表示其他路由应该返回 404
  return { paths, fallback: false }
}
```