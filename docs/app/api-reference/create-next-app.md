# create-next-app

`create-next-app` 是一个命令行工具，它可以帮助您快速开始构建一个新的 Next.js 应用程序，所有设置都为您配置好了。

您可以使用默认的 Next.js 模板创建新应用程序，或者使用 [官方 Next.js 示例](https://github.com/vercel/next.js/tree/canary/examples) 中的一个。

### 交互式

您可以通过运行以下命令以交互式方式创建新项目：

```bash filename="终端"
npx create-next-app@latest
```

```bash filename="终端"
yarn create next-app
```

```bash filename="终端"
pnpm create next-app
```

```bash filename="终端"
bun create next-app
```

然后，系统会提示您回答以下问题：

```txt filename="终端"
项目名称是什么？ my-app
是否使用 TypeScript？ 否 / 是
是否使用 ESLint？ 否 / 是
是否使用 Tailwind CSS？ 否 / 是
是否使用 `src/` 目录？ 否 / 是
是否使用 App Router？（推荐） 否 / 是
是否自定义默认导入别名 (@/*)？ 否 / 是
```

回答完这些问题后，将根据您的答案创建一个新项目，并配置正确的设置。

### 非交互式

您还可以通过传递命令行参数以非交互式方式设置新项目。

此外，您可以通过在默认选项前加上 `--no-` 来否定默认选项（例如 `--no-eslint`）。

查看 `create-next-app --help`：

```bash filename="终端"
用法：create-next-app <项目目录> [选项]

选项：
  -V, --version                        输出版本号
  --ts, --typescript

    初始化为 TypeScript 项目。（默认）

  --js, --javascript

    初始化为 JavaScript 项目。

  --tailwind

    带有 Tailwind CSS 配置初始化。（默认）

  --eslint

    带有 ESLint 配置初始化。

  --app

    作为 App Router 项目初始化。

  --src-dir

    在 `src/` 目录内初始化。

  --import-alias <要配置的别名>

    指定要使用的导入别名（默认 "@/*"）。

  --empty

    初始化一个空项目。

  --use-npm

    明确告诉 CLI 使用 npm 初始化应用程序

  --use-pnpm

    明确告诉 CLI 使用 pnpm 初始化应用程序

  --use-yarn

    明确告诉 CLI 使用 Yarn 初始化应用程序

  --use-bun

    明确告诉 CLI 使用 Bun 初始化应用程序

  -e, --example [名称]|[github-url]

    使用示例初始化应用程序。您可以使用官方 Next.js 仓库中的示例名称
    或公共 GitHub URL。URL 可以使用任何分支和/或子目录

  --example-path <示例路径>

    在极少数情况下，您的 GitHub URL 可能包含带有
    斜杠的分支名称（例如 bug/fix-1）和示例的路径（例如 foo/bar）。
    在这种情况下，您必须单独指定示例的路径：
    --example-path foo/bar

  --reset-preferences

    明确告诉 CLI 重置任何存储的偏好设置

  --skip-install

    明确告诉 CLI 跳过安装包

  -h, --help                           输出使用信息
```
### 使用 Create Next App 的理由

`create-next-app` 允许您在几秒钟内创建一个新的 Next.js 应用程序。它由 Next.js 的创建者官方维护，并包括许多好处：

- **交互式体验**：运行 `npx create-next-app@latest`（不带任何参数）会启动一个交互式体验，引导您完成项目的设置。
- **零依赖**：初始化一个项目的速度可以快至一秒钟。Create Next App 没有依赖。
- **离线支持**：Create Next App 将自动检测您是否处于离线状态，并使用您的本地包缓存引导您的项目。
- **支持示例**：Create Next App 可以使用 Next.js 示例集合中的示例（例如 `npx create-next-app --example api-routes`）或任何公共 GitHub 存储库来引导您的应用程序。
- **经过测试**：该包是 Next.js 单存储库的一部分，并使用与 Next.js 本身相同的集成测试套件进行测试，确保它与每个版本正常工作。