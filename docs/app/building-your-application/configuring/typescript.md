---
title: TypeScript
---
# TypeScript
Next.js 提供了以 TypeScript 为首选的开发体验，用于构建您的 React 应用程序。

它内置了 TypeScript 支持，可以自动安装必要的包并配置适当的设置。

<AppOnly>

以及为您的编辑器提供了一个 [TypeScript 插件](#typescript-plugin)。

> **🎥 观看：** 了解内置的 TypeScript 插件 → [YouTube (3 分钟)](https://www.youtube.com/watch?v=pqMqn9fKEf8)

</AppOnly>


## 新项目

`create-next-app` 默认带有 TypeScript。

```bash filename="终端"
npx create-next-app@latest
```


## 现有项目

通过将文件重命名为 `.ts` / `.tsx` 将 TypeScript 添加到您的项目中。运行 `next dev` 和 `next build` 以自动安装必要的依赖项，并添加一个带有推荐配置选项的 `tsconfig.json` 文件。

如果您已经有 `jsconfig.json` 文件，请将旧的 `jsconfig.json` 中的 `paths` 编译器选项复制到新的 `tsconfig.json` 文件中，并删除旧的 `jsconfig.json` 文件。

<AppOnly>


## TypeScript 插件

Next.js 包含了一个自定义的 TypeScript 插件和类型检查器，VSCode 和其他代码编辑器可以使用它们进行高级类型检查和自动补全。

您可以通过以下步骤在 VS Code 中启用插件：

1. 打开命令面板 (`Ctrl/⌘` + `Shift` + `P`)
2. 搜索 "TypeScript: Select TypeScript Version"
3. 选择 "Use Workspace Version"

<img
  alt="TypeScript 命令面板"
  src="https://nextjs.org/_next/image?url=/docs/light/typescript-command-palette.png&w=3840&q=75"
  srcDark="/docs/dark/typescript-command-palette.png"
  width="1600"
  height="637"
/>

现在，在编辑文件时，将启用自定义插件。运行 `next build` 时，将使用自定义类型检查器。

### 插件特性

TypeScript 插件可以帮助：

- 如果传递了 [segment config options](/docs/app/api-reference/file-conventions/route-segment-config) 的无效值，发出警告。
- 显示可用选项和上下文文档。
- 确保正确使用 `use client` 指令。
- 确保客户端钩子（如 `useState`）仅在客户端组件中使用。

> **须知**：未来将添加更多特性。

</AppOnly>


## 最低 TypeScript 版本

强烈建议至少使用 TypeScript `v4.5.2` 版本，以获得诸如 [import 名称上的类型修饰符](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#type-on-import-names) 和 [性能改进](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#real-path-sync-native) 等语法特性。

<AppOnly>
## 静态类型链接

Next.js 可以静态地对链接进行类型检查，以防止在使用 `next/link` 时出现拼写错误和其他错误，从而提高在页面之间导航时的类型安全性。

要启用此功能，需要启用 `experimental.typedRoutes`，并且项目需要使用 TypeScript。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
```

Next.js 将在 `.next/types` 中生成一个链接定义，其中包含有关应用程序中所有现有路由的信息，TypeScript 随后可以在编辑器中提供有关无效链接的反馈。

目前，实验性支持包括任何字符串字面量，包括动态段。对于非字面量字符串，您当前需要手动将 `href` 强制转换为 `as Route`：

```tsx
import type { Route } from 'next';
import Link from 'next/link'

// 如果 href 是有效路由，则没有 TypeScript 错误
<Link href="/about" />
<Link href="/blog/nextjs" />
<Link href={`/blog/${slug}`} />
<Link href={('/blog' + slug) as Route} />

// 如果 href 不是有效路由，则有 TypeScript 错误
<Link href="/aboot" />
```

要在包装 `next/link` 的自定义组件中接受 `href`，请使用泛型：

```tsx
import type { Route } from 'next'
import Link from 'next/link'

function Card<T extends string>({ href }: { href: Route<T> | URL }) {
  return (
    <Link href={href}>
      <div>我的卡片</div>
    </Link>
  )
}
```

> **它是如何工作的？**
>
> 在运行 `next dev` 或 `next build` 时，Next.js 会在 `.next` 中生成一个隐藏的 `.d.ts` 文件，其中包含有关应用程序中所有现有路由的信息（所有有效的路由作为 `Link` 的 `href` 类型）。这个 `.d.ts` 文件包含在 `tsconfig.json` 中，TypeScript 编译器将检查该 `.d.ts` 并在编辑器中提供有关无效链接的反馈。

## 端到端类型安全性

Next.js 应用路由器具有 **增强的类型安全性**。这包括：

1. **不序列化数据在获取函数和页面之间**：您可以直接在服务器上的组件、布局和页面中进行 `fetch`。这些数据不需要序列化（转换为字符串）就可以传递到客户端以供 React 使用。相反，由于 `app` 默认使用服务器组件，我们可以使用 `Date`、`Map`、`Set` 等值，而无需任何额外步骤。以前，您需要手动使用 Next.js 特定的类型来输入服务器和客户端之间的边界。
2. **组件之间的简化数据流**：通过移除 `_app` 并使用根布局，现在更容易可视化组件和页面之间的数据流。以前，数据在个别 `pages` 和 `_app` 之间流动很难输入，并且可能会引入令人困惑的错误。通过 App Router 中的 [集中式数据获取](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)，这不再是问题。

[Next.js 中的数据获取](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating) 现在提供了尽可能接近端到端类型安全性的功能，而不会对您的数据库或内容提供程序选择进行规定。

我们可以像使用普通 TypeScript 一样对响应数据进行类型定义。例如：

```tsx filename="app/page.tsx"
async function getData() {
  const res = await fetch('https://api.example.com/...')
  // 返回值 *不是* 序列化的
  // 您可以返回 Date, Map, Set 等
  return res.json()
}

export default async function Page() {
  const name = await getData()

  return '...'
}
```

为了实现 **完整的** 端到端类型安全性，这也要求您的数据库或内容提供程序支持 TypeScript。这可以通过使用 [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) 或类型安全查询构建器来实现。
## Async Server Component TypeScript Error

在使用TypeScript的异步服务器组件时，请确保您使用的是TypeScript `5.1.3`或更高版本，以及`@types/react` `18.2.8`或更高版本。

如果您使用的是较旧版本的TypeScript，您可能会看到类型错误 `'Promise<Element>' is not a valid JSX element`。更新到最新版本的TypeScript和`@types/react`应该可以解决这个问题。

## 服务器与客户端组件间的数据传递

通过props在服务器和客户端组件之间传递数据时，数据仍然会被序列化（转换为字符串）以供浏览器使用。然而，它不需要特殊类型。它的类型与在组件之间传递任何其他props的类型相同。

此外，需要序列化的代码更少，因为未渲染的数据不会在服务器和客户端之间传递（它保留在服务器上）。这仅通过支持服务器组件才成为可能。

</AppOnly>

<PagesOnly>


## 静态生成和服务器端渲染

对于[`getStaticProps`](/docs/pages/api-reference/functions/get-static-props)、[`getStaticPaths`](/docs/pages/api-reference/functions/get-static-paths)和[`getServerSideProps`](/docs/pages/api-reference/functions/get-server-side-props)，您可以分别使用`GetStaticProps`、`GetStaticPaths`和`GetServerSideProps`类型：

```tsx filename="pages/blog/[slug].tsx"
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

export const getStaticProps = (async (context) => {
  // ...
}) satisfies GetStaticProps

export const getStaticPaths = (async () => {
  // ...
}) satisfies GetStaticPaths

export const getServerSideProps = (async (context) => {
  // ...
}) satisfies GetServerSideProps
```

> **须知：** `satisfies`是在TypeScript [4.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html)中添加的。我们建议您升级到最新版本的TypeScript。


## API路由

以下是如何使用API路由的内置类型的示例：

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: 'John Doe' })
}
```

您还可以为响应数据设置类型：

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
```


## 自定义`App`

如果您有一个[自定义`App`](/docs/pages/building-your-application/routing/custom-app)，您可以使用内置类型`AppProps`并将文件名更改为`./pages/_app.tsx`，如下所示：

```ts
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

</PagesOnly>


## 路径别名和baseUrl

Next.js自动支持`tsconfig.json`中的`"paths"`和`"baseUrl"`选项。

<AppOnly>

您可以在[模块路径别名文档](/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)上了解更多关于此功能的信息。

</AppOnly>

<PagesOnly>

您可以在[模块路径别名文档](/docs/pages/building-your-application/configuring/absolute-imports-and-module-aliases)上了解更多关于此功能的信息。

</PagesOnly>


## 类型检查next.config.js

`next.config.js`文件必须是一个JavaScript文件，因为它不会被Babel或TypeScript解析，但您可以在IDE中使用JSDoc添加一些类型检查，如下所示：

```js
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  /* 配置选项在这里 */
}

module.exports = nextConfig
```


## 增量类型检查

自`v10.2.1`起，Next.js在您的`tsconfig.json`中启用时支持[增量类型检查](https://www.typescriptlang.org/tsconfig#incremental)，这可以帮助加快大型应用程序中的类型检查速度。
## 忽略 TypeScript 错误

当项目中存在 TypeScript 错误时，Next.js 会使您的 **生产构建** (`next build`) 失败。

如果您希望即使应用程序存在错误，Next.js 也能危险地生成生产代码，您可以禁用内置的类型检查步骤。

如果禁用了，请确保您在构建或部署过程中运行类型检查，否则这可能非常危险。

打开 `next.config.js` 并启用 `typescript` 配置中的 `ignoreBuildErrors` 选项：

```js filename="next.config.js"
module.exports = {
  typescript: {
    // !! 警告 !!
    // 危险地允许即使项目有类型错误，生产构建也能成功完成。
    // !! 警告 !!
    ignoreBuildErrors: true,
  },
}
```

## 自定义类型声明

当您需要声明自定义类型时，可能会想要修改 `next-env.d.ts`。然而，此文件是自动生成的，因此您所做的任何更改都将被覆盖。相反，您应该创建一个新文件，我们称之为 `new-types.d.ts`，并在您的 `tsconfig.json` 中引用它：

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "skipLibCheck": true
    //...已省略...
  },
  "include": [
    "new-types.d.ts",
    "next-env.d.ts",
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

## 版本变更

| 版本   | 变更                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `v13.2.0` | 静态类型链接在 beta 版本中可用。                                                                                        |
| `v12.0.0` | [SWC](/docs/architecture/nextjs-compiler) 现在默认用于编译 TypeScript 和 TSX，以实现更快的构建。                    |
| `v10.2.1` | 当在您的 `tsconfig.json` 中启用时，添加了 [增量类型检查](https://www.typescriptlang.org/tsconfig#incremental) 支持。 |