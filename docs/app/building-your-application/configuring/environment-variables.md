---
title: 环境变量
description: 学习如何在您的 Next.js 应用程序中添加和访问环境变量。
---

# 环境变量
<details>
  <summary>示例</summary>

- [环境变量](https://github.com/vercel/next.js/tree/canary/examples/environment-variables)

</details>

Next.js 内置了对环境变量的支持，允许您执行以下操作：

- [使用 `.env` 加载环境变量](#加载环境变量)
- [通过前缀 `NEXT_PUBLIC_` 将环境变量捆绑到浏览器](#为浏览器捆绑环境变量)
## 加载环境变量

Next.js 内置了从 `.env*` 文件加载环境变量到 `process.env` 的支持。

```txt filename=".env"
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

<PagesOnly>

这会自动将 `process.env.DB_HOST`、`process.env.DB_USER` 和 `process.env.DB_PASS` 加载到 Node.js 环境中，允许您在 [Next.js 数据获取方法](/docs/pages/building-your-application/data-fetching) 和 [API 路由](/docs/pages/building-your-application/routing/api-routes) 中使用它们。

例如，使用 [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)：

```js filename="pages/index.js"
export async function getStaticProps() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

</PagesOnly>

<AppOnly>

> **注意**：Next.js 还支持在 `.env*` 文件中使用多行变量：
>
> ```bash
> # .env
>
> # 你可以使用换行符书写
> PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
> ...
> Kh9NV...
> ...
> -----END DSA PRIVATE KEY-----"
>
> # 或者在双引号内部使用 `\n`
> PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END DSA PRIVATE KEY-----\n"
> ```

> **注意**：如果您正在使用 `/src` 文件夹，请记住 Next.js 将 **仅** 从父文件夹加载 .env 文件，**不** 从 `/src` 文件夹加载。
> 这会自动将 `process.env.DB_HOST`、`process.env.DB_USER` 和 `process.env.DB_PASS` 加载到 Node.js 环境中，允许您在 [路由处理器](/docs/app/building-your-application/routing/route-handlers) 中使用它们。

例如：

```js filename="app/api/route.js"
export async function GET() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

</AppOnly>

### 使用 `@next/env` 加载环境变量

如果您需要在 Next.js 运行时之外加载环境变量，例如在 ORM 或测试运行器的根配置文件中，您可以使用 `@next/env` 包。

这个包是 Next.js 内部用来从 `.env*` 文件加载环境变量的。

要使用它，安装该包并使用 `loadEnvConfig` 函数来加载环境变量：

```bash
npm install @next/env
```

```tsx filename="envConfig.ts" switcher
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)
```

```jsx filename="envConfig.js" switcher
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)
```

然后，您可以在需要的地方导入配置。例如：

```tsx filename="orm.config.ts" switcher
import './envConfig.ts'

export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
})
```

```jsx filename="orm.config.js" switcher
import './envConfig.js'

export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
})
```

### 引用其他变量

Next.js 会自动展开在 `.env*` 文件中使用 `$` 引用其他变量的变量，例如 `$VARIABLE`。这允许您引用其他密钥。例如：

```txt filename=".env"
TWITTER_USER=nextjs
TWITTER_URL=https://twitter.com/$TWITTER_USER
```

在上面的例子中，`process.env.TWITTER_URL` 将被设置为 `https://twitter.com/nextjs`。

> **须知**：如果您需要在实际值中使用带有 `$` 的变量，它需要被转义，例如 `\$`。
## 为浏览器打包环境变量

非 `NEXT_PUBLIC_` 环境变量仅在 Node.js 环境中可用，这意味着它们对浏览器（客户端在不同的 _环境_ 中运行）是不可见的。

为了使环境变量的值在浏览器中可访问，Next.js 可以在构建时将值“内联”到传递给客户端的 js 包中，将所有对 `process.env.[variable]` 的引用替换为硬编码值。要告诉它这样做，只需将变量前缀为 `NEXT_PUBLIC_`。例如：

```txt filename="终端"
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

这将告诉 Next.js 将 Node.js 环境中对 `process.env.NEXT_PUBLIC_ANALYTICS_ID` 的所有引用替换为运行 `next build` 时环境的值，允许您在代码的任何地方使用它。它将被内联到发送到浏览器的任何 JavaScript 中。

> **注意**：构建后，您的应用程序将不再响应这些环境变量的更改。例如，如果您使用 Heroku 流水线将在一个环境中构建的 slugs 推广到另一个环境，或者如果您构建并部署单个 Docker 镜像到多个环境，所有 `NEXT_PUBLIC_` 变量将被冻结为构建时评估的值，因此这些值需要在构建项目时适当设置。如果您需要访问运行时环境值，您必须设置自己的 API 以提供它们给客户端（无论是按需还是初始化期间）。

```js filename="pages/index.js"
import setupAnalyticsService from '../lib/my-analytics-service'

// 'NEXT_PUBLIC_ANALYTICS_ID' 可以在这里使用，因为它被 'NEXT_PUBLIC_' 前缀。
// 它将在构建时转换为 `setupAnalyticsService('abcdefghijk')`。
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)

function HomePage() {
  return <h1>Hello World</h1>
}

export default HomePage
```

请注意，动态查找将不会被内联，例如：

```js
// 这将不会被内联，因为它使用了一个变量
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[varName])

// 这将不会被内联，因为它使用了一个变量
const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)
```

### 运行时环境变量

Next.js 可以支持构建时和运行时环境变量。

**默认情况下，环境变量仅在服务器上可用**。要将环境变量暴露给浏览器，它必须以 `NEXT_PUBLIC_` 为前缀。然而，这些公共环境变量将在 `next build` 期间被内联到 JavaScript 包中。

要读取运行时环境变量，我们建议使用 `getServerSideProps` 或 [逐步采用 App Router](/docs/app/building-your-application/upgrading/app-router-migration)。通过 App Router，我们可以在动态渲染期间安全地读取服务器上的环境变量。这允许您使用一个可以在整个环境中推广的不同值的单一 Docker 镜像。

```jsx
import { unstable_noStore as noStore } from 'next/cache'

export default function Component() {
  noStore()
  // cookies(), headers(), 和其他动态函数
  // 也将选择动态渲染，这意味着
  // 这个环境变量在运行时被评估
  const value = process.env.MY_VALUE
  // ...
}
```

**须知：**

- 您可以使用 [`register` 函数](/docs/app/building-your-application/optimizing/instrumentation) 在服务器启动时运行代码。
- 我们不建议使用 [runtimeConfig](/docs/pages/api-reference/next-config-js/runtime-configuration) 选项，因为这不适用于独立输出模式。相反，我们建议 [逐步采用](/docs/app/building-your-application/upgrading/app-router-migration) App Router。
## 默认环境变量

通常，只需要 `.env*` 文件。然而，有时您可能想要为 `development`（`next dev`）或 `production`（`next start`）环境添加一些默认值。

Next.js 允许您在 `.env`（所有环境）、`.env.development`（开发环境）和 `.env.production`（生产环境）中设置默认值。

> **须知**：`.env`、`.env.development` 和 `.env.production` 文件应该包含在您的仓库中，因为它们定义了默认值。所有 `.env` 文件默认在 `.gitignore` 中被排除，允许您选择将这些值提交到您的仓库。

## Vercel 上的环境变量

当您将 Next.js 应用程序部署到 [Vercel](https://vercel.com) 时，可以在 [项目设置](https://vercel.com/docs/projects/environment-variables?utm_medium=docs&utm_source=next-site&utm_campaign=next-website) 中配置环境变量。

所有类型的环境变量都应在那里配置。即使是开发中使用的环境变量，也可以在之后 [下载到您的本地设备](https://vercel.com/docs/concepts/projects/environment-variables#development-environment-variables?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)。

如果您已配置了 [开发环境变量](https://vercel.com/docs/concepts/projects/environment-variables#development-environment-variables?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)，您可以使用以下命令将它们拉取到 `.env.local` 中，以便在本地机器上使用：

```bash filename="终端"
vercel env pull
```

> **须知**：当您将 Next.js 应用程序部署到 [Vercel](https://vercel.com) 时，除非它们的名称以 `NEXT_PUBLIC_` 为前缀，否则 `.env*` 文件中的环境变量将不会在 Edge 运行时中提供。我们强烈建议您在 [项目设置](https://vercel.com/docs/projects/environment-variables?utm_medium=docs&utm_source=next-site&utm_campaign=next-website) 中管理您的环境变量，从那里所有环境变量都是可用的。

## 测试环境变量

除了 `development` 和 `production` 环境，还有第三种选择：`test`。与为开发或生产环境设置默认值的方式相同，您可以使用 `.env.test` 文件为 `testing` 环境设置默认值（尽管这不如前两个常见）。Next.js 在 `testing` 环境中不会从 `.env.development` 或 `.env.production` 加载环境变量。

当您使用像 `jest` 或 `cypress` 这样的工具运行测试时，这非常有用，因为您需要为测试目的设置特定的环境变量。如果 `NODE_ENV` 设置为 `test`，则将加载测试默认值，尽管您通常不需要手动这样做，因为测试工具会为您处理。

`test` 环境与 `development` 和 `production` 环境之间有一个小区别，您需要记住：`.env.local` 不会被加载，因为您希望测试为每个人产生相同的结果。这样，每次测试执行都将通过忽略您的 `.env.local`（旨在覆盖默认设置）使用相同的环境默认值。

> **须知**：与默认环境变量类似，`.env.test` 文件应包含在您的仓库中，但 `.env.test.local` 不应该包含，因为 `.env*.local` 旨在通过 `.gitignore` 被忽略。

在运行单元测试时，您可以通过利用 `@next/env` 包中的 `loadEnvConfig` 函数，确保以 Next.js 的方式加载您的环境变量。

```js
// 下面的内容可以在 Jest 全局设置文件或类似测试设置中使用
import { loadEnvConfig } from '@next/env'

export default async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}
```
## 环境变量加载顺序

环境变量的查找顺序如下，一旦找到变量即停止查找。

1. `process.env`
1. `.env.$(NODE_ENV).local`
1. `.env.local`（当`NODE_ENV`为`test`时不检查。）
1. `.env.$(NODE_ENV)`
1. `.env`

例如，如果`NODE_ENV`是`development`，并且你在`.env.development.local`和`.env`中都定义了一个变量，那么将使用`.env.development.local`中的值。

> **须知**：`NODE_ENV`的允许值为`production`、`development`和`test`。

## 须知

- 如果你正在使用[`/src`目录](/docs/app/building-your-application/configuring/src-directory)，`.env.*`文件应保持在项目的根目录中。
- 如果环境变量`NODE_ENV`未分配，Next.js在运行`next dev`命令时会自动分配`development`，或者对于所有其他命令分配`production`。

## 版本历史

| 版本  | 变更                                       |
| -------- | --------------------------------------------- |
| `v9.4.0` | 支持`.env`和引入`NEXT_PUBLIC_`。 |