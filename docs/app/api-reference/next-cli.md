---
title: Next.js 命令行界面
description: 了解 Next.js 命令行界面如何允许您开发、构建和启动您的应用程序等。
---

# Next.js 命令行界面

Next.js 命令行界面允许您开发、构建、启动您的应用程序等。

要获取可用的 CLI 命令列表，请在项目目录中运行以下命令：

```bash filename="终端"
next -h
```

输出应该看起来像这样：

```bash filename="终端"
Usage next [options] [command]

The Next.js CLI allows you to develop, build, start your application, and more.

Options:
  -v, --version                输出 Next.js 版本。
  -h, --help                   显示此消息。

Commands:
  build [directory] [options]  创建您的应用程序的优化生产构建。
                               输出显示有关每条路由的信息。
  dev [directory] [options]    以开发模式启动 Next.js，具有热代码重载、错误报告等功能。
  info [options]               打印有关当前系统的相关信息，这些信息可以用来报告 Next.js 的错误。
  lint [directory] [options]   为 `/src`、`/app`、`/pages`、`/components` 和 `/lib` 目录中的所有文件运行 ESLint。如果应用程序中尚未配置 ESLint，它还提供了一个引导式设置来安装任何所需的依赖项。
  start [directory] [options]  以生产模式启动 Next.js。应先使用 `next build` 编译应用程序。
  telemetry [options]          允许您启用或禁用 Next.js 的完全匿名遥测收集。
```

您可以将任何 [node 参数](https://nodejs.org/api/cli.html#cli_node_options_options) 传递给 `next` 命令：

```bash filename="终端"
NODE_OPTIONS='--throw-deprecation' next
NODE_OPTIONS='-r esm' next
NODE_OPTIONS='--inspect' next
```

> **须知**：不带有命令运行 `next` 与运行 `next dev` 是相同的。
## 开发

`next dev` 以开发模式启动应用程序，支持热代码重载、错误报告等功能。

要获取 `next dev` 可用选项的列表，请在项目目录中运行以下命令：

```bash filename="终端"
next dev -h
```

输出应如下所示：

```bash filename="终端"
Usage: next dev [directory] [options]

Starts Next.js in development mode with hot-code reloading, error reporting, and more.

Arguments:
  [directory]                              要构建应用程序的目录。
                                           如果没有提供目录，将使用当前目录。

Options:
  --turbo                                  使用 Turbopack (beta) 启动开发模式。
  -p, --port <port>                        指定启动应用程序的端口号。 (默认: 3000, 环境变量: PORT)
  -H, --hostname <hostname>                指定启动应用程序的主机名 (默认: 0.0.0.0)。
  --experimental-https                     使用 HTTPS 启动服务器并生成自签名证书。
  --experimental-https-key, <path>          HTTPS 密钥文件的路径。
  --experimental-https-cert, <path>         HTTPS 证书文件的路径。
  --experimental-https-ca, <path>           HTTPS 证书颁发机构文件的路径。
  --experimental-upload-trace, <traceUrl>  将调试跟踪的子集报告到远程 HTTP URL。包含敏感数据。
  -h, --help                               显示此消息。
```

应用程序将默认在 `http://localhost:3000` 启动。可以使用 `-p` 更改默认端口，如下所示：

```bash filename="终端"
next dev -p 4000
```

或者使用 `PORT` 环境变量：

```bash filename="终端"
PORT=4000 next dev
```

> **须知**：
>
> - `PORT` 不能在 `.env` 中设置，因为在初始化任何其他代码之前就会启动 HTTP 服务器。
> - 如果没有使用 CLI 选项 `--port` 或 `PORT` 环境变量指定端口，Next.js 将自动尝试使用另一个端口，直到端口可用。

您还可以将主机名设置为不同于默认的 `0.0.0.0`，这在使应用程序对网络上的其他设备可用时非常有用。可以使用 `-H` 更改默认主机名，如下所示：

```bash filename="终端"
next dev -H 192.168.1.2
```

### Turbopack

[Turbopack](/docs/architecture/turbopack) (beta) 是我们新的打包器，正在 Next.js 中进行测试和稳定化，有助于加快在您的应用程序上工作时的本地迭代速度。

要在开发模式下使用 Turbopack，请添加 `--turbo` 选项：

```bash filename="终端"
next dev --turbo
```

### 本地开发的 HTTPS

对于某些用例，如 Webhook 或身份验证，可能需要使用 HTTPS 在 `localhost` 上拥有一个安全环境。Next.js 可以按照以下方式使用 `next dev` 生成一个自签名证书：

```bash filename="终端"
next dev --experimental-https
```

您也可以使用 `--experimental-https-key` 和 `--experimental-https-cert` 提供自定义证书和密钥。可选地，您也可以使用 `--experimental-https-ca` 提供自定义 CA 证书。

```bash filename="终端"
next dev --experimental-https --experimental-https-key ./certificates/localhost-key.pem --experimental-https-cert ./certificates/localhost.pem
```

`next dev --experimental-https` 仅用于开发，并使用 `mkcert` 创建一个本地受信任的证书。在生产环境中，请使用来自受信任机构的适当颁发证书。当部署到 Vercel 时，HTTPS 将为您的 Next.js 应用程序 [自动配置](https://vercel.com/docs/security/encryption)。
## 构建

`next build` 创建您的应用程序的优化生产构建。输出显示了有关每个路由的信息：

```bash filename="Terminal"
路由 (app)                               大小     首次加载 JS
┌ ○ /                                     5.3 kB         89.5 kB
├ ○ /_not-found                           885 B          85.1 kB
└ ○ /about                                137 B          84.4 kB
+ 首次加载 JS 由所有路由共享             84.2 kB
  ├ chunks/184-d3bb186aac44da98.js        28.9 kB
  ├ chunks/30b509c0-f3503c24f98f3936.js   53.4 kB
  └ 其他共享块 (总计)


○  (静态) 作为静态内容预渲染
```

- **大小**：客户端导航到页面时下载的资源数量。每个路由的大小仅包括其依赖项。
- **首次加载 JS**：从服务器访问页面时下载的资源数量。所有路由共享的 JS 数量显示为单独的指标。

这两个值都使用 [**gzip 压缩**](/docs/app/api-reference/next-config-js/compress)。首次加载以绿色、黄色或红色表示。目标是绿色，以实现高性能应用程序。

要获取 `next build` 可用选项的列表，请在项目目录中运行以下命令：

```bash filename="Terminal"
next build -h
```

输出应如下所示：

```bash filename="Terminal"
用法：next build [directory] [options]

创建您的应用程序的优化生产构建。输出显示了有关每个路由的信息。

参数：
  [directory]                       要构建的应用程序所在的目录。如果没有
                                    提供，将使用当前目录。

选项：
  -d, --debug                       启用更详细的构建输出。
  --profile                         启用 React 的生产性能分析。
  --no-lint                         禁用 linting。
  --no-mangling                     禁用 mangling。
  --experimental-app-only           仅构建 App Router 路由。
  --experimental-build-mode [mode]  使用实验性构建模式。（选项："compile"
                                    "generate"，默认："default")
  -h, --help                       显示此消息。
```

### 调试

您可以在 `next build` 中使用 `--debug` 标志启用更详细的构建输出。

```bash filename="Terminal"
next build --debug
```

启用此标志后，将显示额外的构建输出，如重写、重定向和标头。

### 代码检查

您可以这样禁用构建的代码检查：

```bash filename="Terminal"
next build --no-lint
```

### 命名混淆

您可以这样禁用构建的 [命名混淆](https://en.wikipedia.org/wiki/Name_mangling)：

```bash filename="Terminal"
next build --no-mangling
```

> **须知**：这可能会影响性能，仅应用于调试目的。

### 分析

您可以在 `next build` 中使用 `--profile` 标志启用 React 的生产性能分析。

```bash filename="Terminal"
next build --profile
```

之后，您可以像在开发中一样使用分析器。
## 生产环境部署

`next start` 命令用于在生产模式下启动应用程序。首先，应该使用 [`next build`](#build) 命令对应用程序进行编译。

要获取 `next start` 命令的可用选项列表，请在项目目录中运行以下命令：

```bash filename="Terminal"
next start -h
```

输出结果应该如下所示：

```bash filename="Terminal"
Usage: next start [directory] [options]

Starts Next.js in production mode. The application should be compiled with `next build`
first.

Arguments:
  [directory]                           A directory on which to start the application.
                                        If no directory is provided, the current
                                        directory will be used.

Options:
  -p, --port <port>                     Specify a port number on which to start the
                                        application. (default: 3000, env: PORT)
  -H, --hostname <hostname>             Specify a hostname on which to start the
                                        application (default: 0.0.0.0).
  --keepAliveTimeout <keepAliveTimeout> Specify the maximum amount of milliseconds to wait
                                        before closing the inactive connections.
  -h, --help                            Displays this message.
```

默认情况下，应用程序将在 `http://localhost:3000` 上启动。可以使用 `-p` 选项更改默认端口，如下所示：

```bash filename="Terminal"
next start -p 4000
```

或者使用 `PORT` 环境变量：

```bash filename="Terminal"
PORT=4000 next start
```

> **须知**：
>
> - `PORT` 不能在 `.env` 文件中设置，因为在初始化任何其他代码之前就会启动 HTTP 服务器。
> - `next start` 不能与 `output: 'standalone'` 或 `output: 'export'` 一起使用。

### 保持连接超时

当在下游代理（例如 AWS ELB/ALB 等负载均衡器）后部署 Next.js 时，重要的是要配置 Next 的底层 HTTP 服务器的 [keep-alive 超时](https://nodejs.org/api/http.html#http_server_keepalivetimeout)，使其比下游代理的超时时间 _更长_。否则，一旦达到给定 TCP 连接的 keep-alive 超时，Node.js 将立即终止该连接，而不会通知下游代理。这将导致每次代理尝试重用 Node.js 已经终止的连接时出现代理错误。

要为生产环境中的 Next.js 服务器配置超时值，请将 `--keepAliveTimeout`（以毫秒为单位）传递给 `next start`，如下所示：

```bash filename="Terminal"
next start --keepAliveTimeout 70000
```
## 信息

`next info` 打印当前系统的相关信息，这些信息可以用来报告 Next.js 的错误。这些信息包括操作系统的平台/架构/版本，二进制文件（Node.js、npm、Yarn、pnpm）以及 npm 包版本（`next`、`react`、`react-dom`）。

要获取 `next info` 可用选项的列表，请在项目目录中运行以下命令：

```bash filename="终端"
next info -h
```

输出应该像这样：

```bash filename="终端"
Usage: next info [options]

Prints relevant details about the current system which can be used to report Next.js bugs.

Options:
  --verbose   Collections additional information for debugging.
  -h, --help  Displays this message.
```

运行 `next info` 将为您提供如下示例的信息：

```bash filename="终端"

Operating System:
  Platform: linux
  Arch: x64
  Version: #22-Ubuntu SMP Fri Nov 5 13:21:36 UTC 2021
  Available memory (MB): 31795
  Available CPU cores: 16
Binaries:
  Node: 16.13.0
  npm: 8.1.0
  Yarn: 1.22.17
  pnpm: 6.24.2
Relevant Packages:
  next: 14.1.1-canary.61 // Latest available version is detected (14.1.1-canary.61).
  react: 18.2.0
  react-dom: 18.2.0
Next.js Config:
  output: N/A

```

然后，这些信息应该被粘贴到 GitHub Issues 中。

您还可以运行 `next info --verbose`，它将打印有关系统和与 `next` 相关的包安装的额外信息。

## 代码检查

`next lint` 为 `pages/`、`app/`、`components/`、`lib/` 和 `src/` 目录中的所有文件运行 ESLint。如果 ESLint 尚未在您的应用程序中配置，它还提供了一个引导式设置来安装任何所需的依赖项。

要获取 `next lint` 可用选项的列表，请在项目目录中运行以下命令：

```bash filename="终端"
next lint -h

```

输出应该像这样：
```Terminal
用法：next lint [directory] [options]

为 `/src`、`/app`、`/pages`、`/components` 和 `/lib` 目录中的所有文件运行 ESLint。如果应用程序中尚未配置 ESLint，它还提供了一个引导式设置来安装任何所需的依赖项。

参数：
  [directory]                                         要检查应用程序的基本目录。
                                                      如果没有提供目录，则将使用当前目录。

选项：
  -d, --dir, <dirs...>                                包含要运行 ESLint 的目录或多个目录。
  --file, <files...>                                  包含要运行 ESLint 的文件或多个文件。
  --ext, [exts...]                                    指定 JavaScript 文件扩展名。（默认：[".js", ".mjs", ".cjs", ".jsx", ".ts", ".mts", ".cts", ".tsx"]）
  -c, --config, <config>                              使用此配置文件，覆盖所有其他配置选项。
  --resolve-plugins-relative-to, <rprt>               指定应从哪个目录解析插件。
  --strict                                            使用 Next.js 严格配置创建 `.eslintrc.json` 文件。
  --rulesdir, <rulesdir...>                            使用此目录（或多个目录）中的额外规则。
  --fix                                               自动生成修复 linting 问题。
  --fix-type <fixType>                                指定要应用的修复类型（例如，问题，建议，布局）。
  --ignore-path <path>                                指定要忽略的文件。
  --no-ignore <path>                                  禁用 `--ignore-path` 选项。
  --quiet                                             仅报告错误。
  --max-warnings [maxWarnings]                        在触发非零退出代码之前指定警告的数量。（默认：-1）
  -o, --output-file, <outputFile>                     指定要写入报告的文件。
  -f, --format, <format>                              使用特定的输出格式。
  --no-inline-config                                  防止注释更改配置或规则。
  --report-unused-disable-directives-severity <level> 指定未使用的 eslint-disable 指令的严重性级别。（选项："error", "off", "warn"）
  --no-cache                                          禁用缓存。
  --cache-location, <cacheLocation>                   指定缓存的位置。
  --cache-strategy, [cacheStrategy]                   指定用于检测缓存中更改文件的策略。（默认："metadata"）
  --error-on-unmatched-pattern                       当任何文件模式未匹配时报告错误。
  -h, --help                                          显示此消息。
```
如果您有其他想要检查的目录，可以使用 `--dir` 标志指定它们：

```bash filename="Terminal"
next lint --dir utils
```

有关其他选项的更多信息，请查看我们的 [ESLint](/docs/app/building-your-application/configuring/eslint) 配置文档。
## 遥测

Next.js 收集了关于一般使用情况的**完全匿名**的遥测数据。
参与这个匿名程序是可选的，如果你不想分享任何信息，可以选择退出。

要获取 `next telemetry` 可用选项的列表，请在项目目录中运行以下命令：

```bash filename="终端"
next telemetry -h
```

输出应该看起来像这样：

```bash filename="终端"
用法：next telemetry [选项]

允许你启用或禁用 Next.js 的完全匿名遥测收集。

选项：
  --enable    启用 Next.js 的遥测收集。
  --disable   禁用 Next.js 的遥测收集。
  -h, --help  显示此消息。

了解更多：https://nextjs.org/telemetry
```

了解更多关于 [遥测](/telemetry/)。