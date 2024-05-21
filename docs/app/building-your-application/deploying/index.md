---
title: 部署
description: 学习如何将您的 Next.js 应用程序部署到生产环境，无论是托管还是自托管。
---

# 部署
恭喜，是时候将您的应用部署到生产环境了。

您可以部署 [托管的 Next.js 与 Vercel](#托管的-Nextjs-与-Vercel)，或在 Node.js 服务器、Docker 镜像甚至静态 HTML 文件上自托管。使用 `next start` 部署时，支持所有 Next.js 功能。

## 生产构建

运行 `next build` 会为您的应用程序生成一个针对生产环境优化的版本。根据您的页面创建 HTML、CSS 和 JavaScript 文件。JavaScript 代码会通过 [Next.js 编译器](/docs/architecture/nextjs-compiler)进行 **编译**，浏览器捆绑包会进行 **压缩**，以帮助实现最佳性能并支持 [所有现代浏览器](/docs/architecture/supported-browsers)。

Next.js 产生了一个由托管和自托管 Next.js 使用的标准部署输出。这确保了两种部署方法都支持所有功能。在下一个主要版本中，我们将把这个输出转换为我们的 [构建输出 API 规范](https://vercel.com/docs/build-output-api/v3?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)。

## 托管的 Next.js 与 Vercel

[Vercel](https://vercel.com/docs/frameworks/nextjs?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)，Next.js 的创建者和维护者，为您的 Next.js 应用程序提供托管基础设施和开发者体验平台。

在 Vercel 上部署是零配置的，并且为全球的可扩展性、可用性和性能提供了额外的增强。然而，当自托管时，仍然支持所有 Next.js 功能。

了解更多关于 [Vercel 上的 Next.js](https://vercel.com/docs/frameworks/nextjs?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 或 [免费部署一个模板](https://vercel.com/templates/next.js?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) 来尝试它。
## 自托管

Next.js 可以通过三种不同的方式进行自托管：

- [Node.js 服务器](#nodejs-server)
- [Docker 容器](#docker-image)
- [静态导出](#static-html-export)

### Node.js 服务器

Next.js 可以部署到任何支持 Node.js 的托管提供商。确保你的 `package.json` 有 `"build"` 和 `"start"` 脚本：

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

然后，运行 `npm run build` 来构建你的应用程序。最后，运行 `npm run start` 来启动 Node.js 服务器。这个服务器支持所有 Next.js 特性。

### Docker 镜像

Next.js 可以部署到任何支持 [Docker](https://www.docker.com/) 容器的托管提供商。你可以在部署到像 [Kubernetes](https://kubernetes.io/) 这样的容器编排器或在任何云提供商的容器内运行时使用这种方法。

1. 在你的机器上 [安装 Docker](https://docs.docker.com/get-docker/)
2. [克隆我们的示例](https://github.com/vercel/next.js/tree/canary/examples/with-docker)（或 [多环境示例](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env)）
3. 构建你的容器：`docker build -t nextjs-docker .`
4. 运行你的容器：`docker run -p 3000:3000 nextjs-docker`

通过 Docker 的 Next.js 支持所有 Next.js 特性。

### 静态 HTML 导出

Next.js 允许以静态站点或单页应用程序 (SPA) 的形式启动，然后稍后可以选择升级以使用需要服务器的功能。

由于 Next.js 支持这种 [静态导出](/docs/app/building-your-application/deploying/static-exports)，它可以部署和托管在任何能够提供 HTML/CSS/JS 静态资源的 Web 服务器上。这包括像 AWS S3、Nginx 或 Apache 这样的工具。

作为 [静态导出](/docs/app/building-your-application/deploying/static-exports) 运行时不支持需要服务器的 Next.js 特性。[了解更多](/docs/app/building-your-application/deploying/static-exports#unsupported-features)。

> **须知：**
>
> - [服务器组件](/docs/app/building-your-application/rendering/server-components) 支持静态导出。

## 特性

### 图像优化

通过 `next/image` 的 [图像优化](/docs/app/building-your-application/optimizing/images) 在使用 `next start` 部署时无需配置即可自托管。如果你希望有一个单独的服务来优化图像，你可以 [配置一个图像加载器](/docs/app/building-your-application/optimizing/images#loaders)。

图像优化可以通过在 `next.config.js` 中定义自定义图像加载器与 [静态导出](/docs/app/building-your-application/deploying/static-exports#image-optimization) 一起使用。请注意，图像是在运行时优化的，而不是在构建期间。

> **须知：**
>
> - 当自托管时，考虑安装 `sharp` 以在生产环境中获得更高效的 [图像优化](/docs/pages/building-your-application/optimizing/images)，通过在项目目录中运行 `npm install sharp`。在 Linux 平台上，`sharp` 可能需要 [额外配置](https://sharp.pixelplumbing.com/install#linux-memory-allocator) 以防止内存使用过多。
> - 了解更多关于优化图像的 [缓存行为](/docs/app/api-reference/components/image#caching-behavior) 以及如何配置 TTL。
> - 如果你更喜欢，你还可以 [禁用图像优化](/docs/app/api-reference/components/image#unoptimized) 并仍然保留使用 `next/image` 的其他好处。例如，如果你自己单独优化图像。
### 中间件

[中间件](/docs/app/building-your-application/routing/middleware) 在使用 `next start` 部署时无需配置即可自托管。由于它需要访问传入的请求，因此在使用 [静态导出](/docs/app/building-your-application/deploying/static-exports) 时不支持中间件。

中间件使用一个 [运行时](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)，这是所有可用 Node.js API 的子集，以帮助确保低延迟，因为它可能会在应用程序的每个路由或资产之前运行。这个运行时不需要在“边缘”运行，可以在单区域服务器上工作。要在多个区域运行中间件，需要额外的配置和基础设施。

如果您想要添加逻辑（或使用需要所有 Node.js API 的外部包），您可能能够将这个逻辑移动到 [布局](/docs/app/building-your-application/routing/layouts-and-templates#layouts) 中作为 [服务器组件](/docs/app/building-your-application/rendering/server-components)。例如，检查 [headers](/docs/app/api-reference/functions/headers) 和 [重定向](/docs/app/api-reference/functions/redirect)。您也可以使用 headers、cookies 或查询参数通过 `next.config.js` 来 [重定向](/docs/app/api-reference/next-config-js/redirects#header-cookie-and-query-matching) 或 [重写](/docs/app/api-reference/next-config-js/rewrites#header-cookie-and-query-matching)。如果这不起作用，您还可以使用 [自定义服务器](/docs/pages/building-your-application/configuring/custom-server)。

### 环境变量

Next.js 可以支持构建时和运行时环境变量。

**默认情况下，环境变量仅在服务器上可用**。要将环境变量暴露给浏览器，它必须以 `NEXT_PUBLIC_` 为前缀。然而，这些公共环境变量将在 `next build` 期间内联到 JavaScript 包中。

要读取运行时环境变量，我们建议使用 `getServerSideProps` 或 [逐步采用 App Router](/docs/app/building-your-application/upgrading/app-router-migration)。通过 App Router，我们可以在动态渲染期间安全地在服务器上读取环境变量。这允许您使用一个单一的 Docker 镜像，该镜像可以在具有不同值的多个环境中提升。

```jsx
import { unstable_noStore as noStore } from 'next/cache';

export default function Component() {
  noStore();
  // cookies(), headers(), 和其他动态函数
  // 也会选择动态渲染，使
  // 这个环境变量在运行时评估
  const value = process.env.MY_VALUE
  ...
}
```

> **须知：**
>
> - 您可以使用 [`register` 函数](/docs/app/building-your-application/optimizing/instrumentation) 在服务器启动时运行代码。
> - 我们不推荐使用 [runtimeConfig](/docs/pages/api-reference/next-config-js/runtime-configuration) 选项，因为这与独立输出模式不兼容。相反，我们建议 [逐步采用](/docs/app/building-your-application/upgrading/app-router-migration) App Router。

### 缓存和 ISR

Next.js 可以缓存响应、生成的静态页面、构建输出以及其他静态资源，如图像、字体和脚本。

使用增量静态再生（ISR）或 App Router 中的较新函数缓存和重新验证页面使用 **相同的共享缓存**。默认情况下，此缓存存储在 Next.js 服务器上的文件系统（磁盘）上。**这在使用 Pages 和 App Router 自托管时自动工作**。

如果您想要将缓存页面和数据持久化到持久存储中，或者在 Next.js 应用程序的多个容器或实例之间共享缓存，可以配置 Next.js 缓存位置。
# 自动缓存

- Next.js 为真正不可变资源设置了 `Cache-Control` 头部为 `public, max-age=31536000, immutable`。这个设置不能被覆盖。这些不可变的文件在文件名中包含一个 SHA 哈希，因此可以安全地无限期缓存。例如，[静态图片导入](/docs/app/building-your-application/optimizing/images#local-images)。你可以为图片[配置 TTL](/docs/app/api-reference/components/image#caching-behavior)。
- 增量静态生成（ISR）设置了 `Cache-Control` 头部为 `s-maxage: <revalidate in getStaticProps>, stale-while-revalidate`。这个重新验证时间在你的 [`getStaticProps` 函数](/docs/pages/building-your-application/data-fetching/get-static-props) 中以秒为单位定义。如果你设置 `revalidate: false`，它将默认为一年的缓存持续时间。
- 动态渲染的页面设置了 `Cache-Control` 头部为 `private, no-cache, no-store, max-age=0, must-revalidate`，以防止用户特定数据被缓存。这适用于 App Router 和 Pages Router。这也包括了 [草稿模式](/docs/app/building-your-application/configuring/draft-mode)。

# 静态资源

如果你想在不同的域或 CDN 上托管静态资源，你可以在 `next.config.js` 中使用 `assetPrefix` [配置](/docs/app/api-reference/next-config-js/assetPrefix)。Next.js 在检索 JavaScript 或 CSS 文件时将使用这个资源前缀。将资源分离到不同的域确实有一个缺点，那就是在 DNS 和 TLS 解析上花费的额外时间。

[了解更多关于 `assetPrefix`](/docs/app/api-reference/next-config-js/assetPrefix)。

# 配置缓存

默认情况下，生成的缓存资产将存储在内存中（默认为 50mb）和磁盘上。如果你使用像 Kubernetes 这样的容器编排平台托管 Next.js，每个 pod 都会有一个缓存副本。为了防止默认情况下 pod 之间不共享缓存而显示过期数据，你可以配置 Next.js 缓存以提供缓存处理器并禁用内存缓存。

当你自托管时，要配置 ISR/Data 缓存位置，你可以在 `next.config.js` 文件中配置自定义处理器：

```jsx filename="next.config.js"
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // 禁用默认内存缓存
}
```

然后，在项目根目录创建 `cache-handler.js`，例如：

```jsx filename="cache-handler.js"
const cache = new Map()

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
  }

  async get(key) {
    // 这可以存储在任何地方，比如持久化存储
    return cache.get(key)
  }

  async set(key, data, ctx) {
    // 这可以存储在任何地方，比如持久化存储
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    })
  }

  async revalidateTag(tag) {
    // 遍历缓存中的所有条目
    for (let [key, value] of cache) {
      // 如果值的标签包含指定的标签，删除该条目
      if (value.tags.includes(tag)) {
        cache.delete(key)
      }
    }
  }
}
```

使用自定义缓存处理器将允许你确保所有托管你的 Next.js 应用程序的 pod 之间的一致性。例如，你可以将缓存值保存在任何地方，比如 [Redis](https://github.com/vercel/next.js/tree/canary/examples/cache-handler-redis) 或 AWS S3。

> **须知：**
>
> - `revalidatePath` 是缓存标签上的一个便利层。调用 `revalidatePath` 将使用提供的页面的特殊默认标签调用 `revalidateTag` 函数。
### 构建缓存

Next.js 在 `next build` 过程中生成一个 ID，以识别正在提供的应用程序版本。相同的构建应该用于启动多个容器。

如果您在环境的每个阶段都进行重建，您将需要生成一个一致的构建 ID，在容器之间使用。在 `next.config.js` 中使用 `generateBuildId` 命令：

```jsx filename="next.config.js"
module.exports = {
  generateBuildId: async () => {
    // 这可以是任何东西，使用最新的 git 哈希值
    return process.env.GIT_HASH
  },
}
```

### 版本偏差

Next.js 将自动缓解大多数 [版本偏差](https://www.industrialempathy.com/posts/version-skew/) 的实例，并在检测到时自动重新加载应用程序以获取新资产。例如，如果 `deploymentId` 存在不匹配，页面之间的转换将执行硬导航，而不是使用预取值。

当应用程序重新加载时，如果它没有设计为在页面导航之间持久化，则可能会丢失应用程序状态。例如，使用 URL 状态或本地存储将在页面刷新后持久化状态。然而，像 `useState` 这样的组件状态在这样的导航中会丢失。

Vercel 为 Next.js 应用程序提供额外的 [偏差保护](https://vercel.com/docs/deployments/skew-protection?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)，以确保即使在新版本部署后，旧版本仍然可以访问来自先前版本的资产和功能。

您可以在 `next.config.js` 文件中手动配置 `deploymentId` 属性，以确保每个请求使用 `?dpl` 查询字符串或 `x-deployment-id` 标头。

<AppOnly>


### 流式传输和 Suspense

Next.js 应用路由支持 [流式响应](/docs/app/building-your-application/routing/loading-ui-and-streaming) 当自托管时。如果您使用 Nginx 或类似的代理，您将需要配置它以禁用缓冲以启用流式传输。

例如，您可以通过将 `X-Accel-Buffering` 设置为 `no` 来在 Nginx 中禁用缓冲：

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ]
  },
}
```

</AppOnly>

<PagesOnly>


# 手动优雅关闭

当自托管时，您可能希望在服务器在 `SIGTERM` 或 `SIGINT` 信号上关闭时运行代码。

您可以将环境变量 `NEXT_MANUAL_SIG_HANDLE` 设置为 `true`，然后在 `_document.js` 文件内为该信号注册一个处理程序。您需要直接在 `package.json` 脚本中注册环境变量，而不是在 `.env` 文件中。

> **须知**：在 `next dev` 中不可用手动信号处理。

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "NEXT_MANUAL_SIG_HANDLE=true next start"
  }
}
```

```js filename="pages/_document.js"
if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM: cleaning up')
    process.exit(0)
  })
  process.on('SIGINT', () => {
    console.log('Received SIGINT: cleaning up')
    process.exit(0)
  })
}
```

</PagesOnly>