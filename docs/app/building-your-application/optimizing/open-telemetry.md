---
title: OpenTelemetry
---

# OpenTelemetry

> **须知**：此功能为 **实验性**，您需要通过在 `next.config.js` 中提供 `experimental.instrumentationHook = true;` 来明确选择加入。

可观测性对于理解和优化您的 Next.js 应用程序的行为和性能至关重要。

随着应用程序变得更加复杂，识别和诊断可能出现的问题变得越来越困难。通过利用可观测性工具，如日志记录和指标，开发人员可以深入了解其应用程序的行为，并确定优化领域。有了可观测性，开发人员可以主动解决在问题变成重大问题之前的问题，并提供更好的用户体验。因此，强烈建议在您的 Next.js 应用程序中使用可观测性，以提高性能，优化资源并增强用户体验。

我们建议使用 OpenTelemetry 来为您的应用程序添加可观测性。
它是一种平台无关的方式来为您的应用程序添加可观测性，允许您在不更改代码的情况下更改您的可观测性提供商。
有关 OpenTelemetry 以及其工作原理的更多信息，请阅读 [官方 OpenTelemetry 文档](https://opentelemetry.io/docs/)。

本文档使用诸如 _Span_、_Trace_ 或 _Exporter_ 等术语，所有这些都可以 [在 OpenTelemetry 可观测性入门文档中找到](https://opentelemetry.io/docs/concepts/observability-primer/)。

Next.js 原生支持 OpenTelemetry 可观测性，这意味着我们已经对 Next.js 本身进行了可观测性添加。
当您启用 OpenTelemetry 时，我们将自动使用有用的属性将您的所有代码（如 `getStaticProps`）包装在 _spans_ 中。

## 开始使用

OpenTelemetry 是可扩展的，但正确设置可能会相当繁琐。
这就是为什么我们准备了一个包 `@vercel/otel`，帮助您快速开始。
### 使用 `@vercel/otel`

要开始使用，您必须安装 `@vercel/otel`：

```bash filename="终端"
npm install @vercel/otel
```

**App**:

接下来，在项目的**根目录**中创建一个自定义的 [`instrumentation.ts`](/docs/app/building-your-application/optimizing/instrumentation)（或 `.js`）文件（如果使用 `src` 文件夹，则在该文件夹内创建）：

**Pages**:

接下来，在项目的**根目录**中创建一个自定义的 [`instrumentation.ts`](/docs/pages/building-your-application/optimizing/instrumentation)（或 `.js`）文件（如果使用 `src` 文件夹，则在该文件夹内创建）：

```ts filename="your-project/instrumentation.ts" switcher
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'next-app' })
}
```

```js filename="your-project/instrumentation.js" switcher
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'next-app' })
}
```

查看 [`@vercel/otel` 文档](https://www.npmjs.com/package/@vercel/otel) 以获取其他配置选项。

**App**:

> **须知**
>
> - `instrumentation` 文件应该位于项目的根目录，而不是 `app` 或 `pages` 目录内。如果您使用 `src` 文件夹，则将文件放置在 `src` 中，与 `pages` 和 `app` 同级。
> - 如果您使用 [`pageExtensions` 配置选项](/docs/app/api-reference/next-config-js/pageExtensions) 添加后缀，您还需要更新 `instrumentation` 文件名以匹配。
> - 我们创建了一个基本的 [with-opentelemetry](https://github.com/vercel/next.js/tree/canary/examples/with-opentelemetry) 示例，您可以使用。

**Pages**:

> **须知**
>
> - `instrumentation` 文件应该位于项目的根目录，而不是 `app` 或 `pages` 目录内。如果您使用 `src` 文件夹，则将文件放置在 `src` 中，与 `pages` 和 `app` 同级。
> - 如果您使用 [`pageExtensions` 配置选项](/docs/pages/api-reference/next-config-js/pageExtensions) 添加后缀，您还需要更新 `instrumentation` 文件名以匹配。
> - 我们创建了一个基本的 [with-opentelemetry](https://github.com/vercel/next.js/tree/canary/examples/with-opentelemetry) 示例，您可以使用。
### 手动配置OpenTelemetry

`@vercel/otel`包提供了许多配置选项，应该能够满足大多数常见用例。但如果它不符合您的需求，您可以手动配置OpenTelemetry。

首先，您需要安装OpenTelemetry包：

```bash filename="终端"
npm install @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

现在，您可以在`instrumentation.ts`中初始化`NodeSDK`。
与`@vercel/otel`不同，`NodeSDK`与边缘运行时不兼容，因此您需要确保仅在`process.env.NEXT_RUNTIME === 'nodejs'`时才导入它们。我们建议创建一个新文件`instrumentation.node.ts`，仅在使用节点时有条件地导入：

```ts filename="instrumentation.ts" switcher
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node.ts')
  }
}
```

```js filename="instrumentation.js" switcher
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node.js')
  }
}
```

```ts filename="instrumentation.node.ts" switcher
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'next-app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
})
sdk.start()
```

```js filename="instrumentation.node.js" switcher
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'next-app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
})
sdk.start()
```

这样做等同于使用`@vercel/otel`，但可以修改和扩展`@vercel/otel`未公开的一些功能。如果需要边缘运行时支持，您将不得不使用`@vercel/otel`。

### 测试您的仪表化

您需要一个带有兼容后端的OpenTelemetry收集器来本地测试OpenTelemetry跟踪。
我们建议您使用我们的[OpenTelemetry开发环境](https://github.com/vercel/opentelemetry-collector-dev-setup)。

如果一切顺利，您应该能够看到根服务器跨度被标记为`GET /requested/pathname`。
来自该特定跟踪的所有其他跨度都将嵌套在它下面。

Next.js跟踪的跨度比默认发出的跨度多。
要查看更多跨度，您必须设置`NEXT_OTEL_VERBOSE=1`。
## 部署

### 使用 OpenTelemetry 收集器

当您使用 OpenTelemetry 收集器进行部署时，可以使用 `@vercel/otel`。
它在 Vercel 和自托管时都能正常工作。

#### 在 Vercel 上部署

我们确保了在 Vercel 上 OpenTelemetry 可以开箱即用。

按照 [Vercel 文档](https://vercel.com/docs/concepts/observability/otel-overview/quickstart) 将您的项目连接到可观测性提供商。

#### 自托管

部署到其他平台也很简单。您需要启动自己的 OpenTelemetry 收集器来接收和处理来自您的 Next.js 应用的遥测数据。

为此，请按照 [OpenTelemetry 收集器入门指南](https://opentelemetry.io/docs/collector/getting-started/) 操作，该指南将指导您设置收集器并配置它以接收来自您的 Next.js 应用的数据。

一旦您的收集器运行起来，您可以按照他们各自的部署指南将您的 Next.js 应用部署到您选择的平台。

### 自定义导出器

OpenTelemetry 收集器并非必需。您可以使用自定义 OpenTelemetry 导出器与 [`@vercel/otel`](#using-vercelotel) 或 [手动 OpenTelemetry 配置](/docs/pages/building-your-application/optimizing/open-telemetry#manual-opentelemetry-configuration)。

## 自定义 Span

您可以使用 [OpenTelemetry API](https://opentelemetry.io/docs/instrumentation/js/instrumentation) 添加自定义 span。

```bash filename="终端"
npm install @opentelemetry/api
```

以下示例演示了一个函数，该函数获取 GitHub 星标并添加了一个自定义的 `fetchGithubStars` span 来跟踪获取请求的结果：

```ts
import { trace } from '@opentelemetry/api'

export async function fetchGithubStars() {
  return await trace
    .getTracer('nextjs-example')
    .startActiveSpan('fetchGithubStars', async (span) => {
      try {
        return await getValue()
      } finally {
        span.end()
      }
    })
}
```

`register` 函数将在您的代码在新环境中运行之前执行。
您可以开始创建新的 spans，它们应该被正确地添加到导出的 trace 中。

## Next.js 中的默认 Span

Next.js 为您自动配置了几个 span，以便为您提供有关应用程序性能的有用见解。

Span 上的属性遵循 [OpenTelemetry 语义约定](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/)。我们还添加了一些在 `next` 命名空间下的自定义属性：

- `next.span_name` - 重复 span 名称
- `next.span_type` - 每种 span 类型都有唯一的标识符
- `next.route` - 请求的路由模式（例如，`/[param]/user`）。
- `next.rsc` (true/false) - 请求是否为 RSC 请求，例如预取。
- `next.page`
  - 这是应用程序路由器使用的内部值。
  - 您可以将其视为指向特殊文件的路由（如 `page.ts`、`layout.ts`、`loading.ts` 等）
  - 只有与 `next.route` 配对时，它才能用作唯一标识符，因为 `/layout` 可以用来识别 `/(groupA)/layout.ts` 和 `/(groupB)/layout.ts`

### `[http.method] [next.route]`

- `next.span_type`: `BaseServer.handleRequest`

这个 span 代表了每个进入您的 Next.js 应用程序的请求的根 span。它跟踪请求的 HTTP 方法、路由、目标和状态码。

属性：

- [常见 HTTP 属性](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#common-attributes)
  - `http.method`
  - `http.status_code`
- [服务器 HTTP 属性](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#http-server-semantic-conventions)
  - `http.route`
  - `http.target`
- `next.span_name`
- `next.span_type`
- `next.route`
### `渲染路由 (App) [next.route]`

- `next.span_type`: `AppRender.getBodyResult`.

这个span表示在应用路由器中渲染路由的过程。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `获取 [http.method] [http.url]`

- `next.span_type`: `AppRender.fetch`

这个span表示在您的代码中执行的获取请求。

属性：

- [通用HTTP属性](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#common-attributes)
  - `http.method`
- [客户端HTTP属性](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#http-client)
  - `http.url`
  - `net.peer.name`
  - `net.peer.port`（仅在指定时）
- `next.span_name`
- `next.span_type`

可以通过在您的环境变量中设置`NEXT_OTEL_FETCH_DISABLED=1`来关闭这个span。当您想要使用自定义获取工具库时，这很有用。

### `执行API路由 (App) [next.route]`

- `next.span_type`: `AppRouteRouteHandlers.runHandler`.

这个span表示在应用路由器中执行API路由处理器。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `getServerSideProps [next.route]`

- `next.span_type`: `Render.getServerSideProps`.

这个span表示为特定路由执行`getServerSideProps`。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `getStaticProps [next.route]`

- `next.span_type`: `Render.getStaticProps`.

这个span表示为特定路由执行`getStaticProps`。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `渲染路由 (Pages) [next.route]`

- `next.span_type`: `Render.renderDocument`.

这个span表示为特定路由渲染文档的过程。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `生成元数据 [next.page]`

- `next.span_type`: `ResolveMetadata.generateMetadata`.

这个span表示为特定页面生成元数据的过程（单个路由可以有多个这样的span）。

属性：

- `next.span_name`
- `next.span_type`
- `next.page`

### `解析页面组件`

- `next.span_type`: `NextNodeServer.findPageComponents`.

这个span表示为特定页面解析页面组件的过程。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `解析片段模块`

- `next.span_type`: `NextNodeServer.getLayoutOrPageModule`.

这个span表示加载布局或页面的代码模块。

属性：

- `next.span_name`
- `next.span_type`
- `next.segment`

### `开始响应`

- `next.span_type`: `NextNodeServer.startResponse`.

这个零长度的span表示响应中的第一个字节已经被发送的时间。