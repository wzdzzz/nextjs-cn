# Debugging

本文档解释了如何使用[VS Code调试器](https://code.visualstudio.com/docs/editor/debugging)或[Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)，通过完整的源代码映射支持来调试您的Next.js前端和后端代码。

任何可以附加到Node.js的调试器也可以用来调试Next.js应用程序。您可以在Node.js的[调试入门指南](https://nodejs.org/en/docs/guides/debugging-getting-started/)中找到更多详细信息。

## 使用VS Code进行调试

在项目的根目录下创建一个名为`.vscode/launch.json`的文件，内容如下：

```json filename="launch.json"
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithEdge",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}
```

如果您使用的是Yarn，可以将`npm run dev`替换为`yarn dev`；如果使用的是pnpm，则替换为`pnpm dev`。

如果您的应用程序启动端口号不是默认的，[更改端口号](/docs/pages/api-reference/next-cli#development)，请将`http://localhost:3000`中的`3000`替换为您实际使用的端口号。

如果您不是从根目录运行Next.js（例如，如果您正在使用Turborepo），那么您需要在服务器端和全栈调试任务中添加`cwd`。例如，`"cwd": "${workspaceFolder}/apps/web"`。

现在，转到调试面板（在Windows/Linux上按`Ctrl+Shift+D`，在macOS上按`⇧+⌘+D`），选择一个启动配置，然后按`F5`或从命令面板选择**调试：开始调试**以开始您的调试会话。

## 在Jetbrains WebStorm中使用调试器

点击列出运行时配置的下拉菜单，然后点击`Edit Configurations...`。创建一个以`http://localhost:3000`为URL的`Javascript Debug`调试配置。根据个人喜好进行自定义（例如，调试浏览器，存储为项目文件），然后点击`OK`。运行此调试配置，所选浏览器应该会自动打开。此时，您应该有两个处于调试模式的应用程序：NextJS节点应用程序和客户端/浏览器应用程序。
## 使用 Chrome DevTools 调试

### 客户端代码

像平常一样通过运行 `next dev`、`npm run dev` 或 `yarn dev` 启动开发服务器。一旦服务器启动，打开 Chrome 浏览器访问 `http://localhost:3000`（或您的备用 URL）。接下来，打开 Chrome 的开发者工具（在 Windows/Linux 上按 `Ctrl+Shift+J`，在 macOS 上按 `⌥+⌘+I`），然后转到 **Sources** 标签页。

现在，每当您的客户端代码到达一个 [`debugger`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/debugger) 语句时，代码执行将暂停，该文件将出现在调试区域。您也可以按 `Ctrl+P`（在 Windows/Linux 上）或 `⌘+P`（在 macOS 上）来搜索文件并手动设置断点。请注意，在这里搜索时，您的源文件路径将以 `webpack://_N_E/./` 开始。

### 服务器端代码

要使用 Chrome DevTools 调试服务器端 Next.js 代码，您需要将 [`--inspect`](https://nodejs.org/api/cli.html#cli_inspect_host_port) 标志传递给底层的 Node.js 进程：

```bash filename="终端"
NODE_OPTIONS='--inspect' next dev
```

如果您使用的是 `npm run dev` 或 `yarn dev`，则应该更新 `package.json` 中的 `dev` 脚本：

```json filename="package.json"
{
  "scripts": {
    "dev": "NODE_OPTIONS='--inspect' next dev"
  }
}
```

使用 `--inspect` 标志启动 Next.js 开发服务器看起来像这样：

```bash filename="终端"
Debugger listening on ws://127.0.0.1:9229/0cf90313-350d-4466-a748-cd60f4e47c95
For help, see: https://nodejs.org/en/docs/inspector
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

> 请注意，运行 `NODE_OPTIONS='--inspect' npm run dev` 或 `NODE_OPTIONS='--inspect' yarn dev` 是不会工作的。这将尝试在同一端口上启动多个调试器：一个用于 npm/yarn 进程，一个用于 Next.js。然后您将在控制台中得到一个错误，如 `Starting inspector on 127.0.0.1:9229 failed: address already in use`。

一旦服务器启动，打开 Chrome 的新标签页并访问 `chrome://inspect`，在 **Remote Target** 部分您应该能看到您的 Next.js 应用程序。点击应用程序下的 **inspect** 以打开一个单独的 DevTools 窗口，然后转到 **Sources** 标签页。

在这里调试服务器端代码的工作方式与使用 Chrome DevTools 调试客户端代码类似，只是当您在这里使用 `Ctrl+P` 或 `⌘+P` 搜索文件时，您的源文件路径将以 `webpack://{application-name}/./` 开始（其中 `{application-name}` 将替换为您的 `package.json` 文件中应用程序的名称）。

### 在 Windows 上调试

Windows 用户在使用 `NODE_OPTIONS='--inspect'` 时可能会遇到问题，因为该语法在 Windows 平台上不受支持。要解决这个问题，安装 [`cross-env`](https://www.npmjs.com/package/cross-env) 包作为开发依赖项（使用 `npm` 和 `yarn` 的 `-D`），并将 `dev` 脚本替换为以下内容。

```json filename="package.json"
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS='--inspect' next dev"
  }
}
```

`cross-env` 将设置 `NODE_OPTIONS` 环境变量，无论您在哪个平台上（包括 Mac、Linux 和 Windows），并允许您在不同设备和操作系统上一致地进行调试。

> **须知**：确保在您的机器上禁用 Windows Defender。这个外部服务将检查 _每个读取的文件_，据报道，这会大大增加 `next dev` 的 Fast Refresh 时间。这是一个已知问题，与 Next.js 无关，但它确实影响了 Next.js 的开发。

## 更多信息

要了解更多关于如何使用 JavaScript 调试器的信息，请查看以下文档：

- [Node.js debugging in VS Code: Breakpoints](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_breakpoints)
- [Chrome DevTools: Debug JavaScript](https://developers.google.com/web/tools/chrome-devtools/javascript)