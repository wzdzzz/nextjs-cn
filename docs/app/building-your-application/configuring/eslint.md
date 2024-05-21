---
title: ESLint
description: Next.js 默认提供了一个集成的 ESLint 体验。这些合规规则帮助您以最佳方式使用 Next.js。
---

# ESLint
Next.js 提供了一个开箱即用的集成 [ESLint](https://eslint.org/) 体验。将 `next lint` 作为脚本添加到 `package.json`：

```json filename="package.json"
{
  "scripts": {
    "lint": "next lint"
  }
}
```

然后运行 `npm run lint` 或 `yarn lint`：

```bash filename="Terminal"
yarn lint
```

如果您的应用程序中尚未配置 ESLint，系统将引导您完成安装和配置过程。

```bash filename="Terminal"
yarn lint
```

> 您将看到一个类似的提示：
>
> ? 您想如何配置 ESLint？
>
> ❯ 严格（推荐）
> 基础
> 取消

可以选择以下三种选项之一：

- **严格**：包括 Next.js 的基础 ESLint 配置以及更严格的 [核心 Web 性能指标规则集](#core-web-vitals)。这是为第一次设置 ESLint 的开发人员推荐的配置。

  ```json filename=".eslintrc.json"
  {
    "extends": "next/core-web-vitals"
  }
  ```

- **基础**：包括 Next.js 的基础 ESLint 配置。

  ```json filename=".eslintrc.json"
  {
    "extends": "next"
  }
  ```

- **取消**：不包含任何 ESLint 配置。只有在您计划设置自己的自定义 ESLint 配置时，才选择此选项。

如果选择了这两种配置选项中的任何一种，Next.js 将自动在您的应用程序中安装 `eslint` 和 `eslint-config-next` 作为依赖项，并在项目根目录创建一个包含您所选配置的 `.eslintrc.json` 文件。

现在，您可以随时运行 `next lint` 来运行 ESLint 以捕获错误。一旦设置好 ESLint，它还会在每次构建时自动运行（`next build`）。错误将导致构建失败，而警告则不会。

<AppOnly>

> 如果您不希望在 `next build` 期间运行 ESLint，请参考 [忽略 ESLint](/docs/app/api-reference/next-config-js/eslint) 的文档。

</AppOnly>

<PagesOnly>

> 如果您不希望在 `next build` 期间运行 ESLint，请参考 [忽略 ESLint](/docs/pages/api-reference/next-config-js/eslint) 的文档。

</PagesOnly>

我们建议使用适当的 [集成](https://eslint.org/docs/user-guide/integrations#editors) 在开发期间直接在代码编辑器中查看警告和错误。

## ESLint 配置

默认配置（`eslint-config-next`）包含了在 Next.js 中拥有最佳开箱即用 linting 体验所需的一切。如果您的应用程序中尚未配置 ESLint，我们建议您使用 `next lint` 来设置 ESLint 以及此配置。

> 如果您想在使用 `eslint-config-next` 的同时使用其他 ESLint 配置，请参考 [额外配置](#additional-configurations) 部分，了解如何避免造成任何冲突。

`eslint-config-next` 中使用了以下 ESLint 插件的推荐规则集：

- [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react)
- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next)

这将优先于 `next.config.js` 中的配置。
## ESLint Plugin

Next.js provides an ESLint plugin, [`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next), already bundled within the base configuration that makes it possible to catch common issues and problems in a Next.js application. The full set of rules is as follows:

<Check size={18} /> Enabled in the recommended configuration

|                     | Rule                                                                                                                     | Description                                                                                                      |
| :-----------------: | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| <Check size={18} /> | [@next/next/google-font-display](/docs/messages/google-font-display)                                                     | Enforce font-display behavior with Google Fonts.                                                                 |
| <Check size={18} /> | [@next/next/google-font-preconnect](/docs/messages/google-font-preconnect)                                               | Ensure `preconnect` is used with Google Fonts.                                                                   |
| <Check size={18} /> | [@next/next/inline-script-id](/docs/messages/inline-script-id)                                                           | Enforce `id` attribute on `next/script` components with inline content.                                          |
| <Check size={18} /> | [@next/next/next-script-for-ga](/docs/messages/next-script-for-ga)                                                       | Prefer `next/script` component when using the inline script for Google Analytics.                                |
| <Check size={18} /> | [@next/next/no-assign-module-variable](/docs/messages/no-assign-module-variable)                                         | Prevent assignment to the `module` variable.                                                                     |
| <Check size={18} /> | [@next/next/no-async-client-component](/docs/messages/no-async-client-component)                                         | Prevent client components from being async functions.                                                            |
| <Check size={18} /> | [@next/next/no-before-interactive-script-outside-document](/docs/messages/no-before-interactive-script-outside-document) | Prevent usage of `next/script`'s `beforeInteractive` strategy outside of `pages/_document.js`.                   |
| <Check size={18} /> | [@next/next/no-css-tags](/docs/messages/no-css-tags)                                                                     | Prevent manual stylesheet tags.                                                                                  |
| <Check size={18} /> | [@next/next/no-document-import-in-page](/docs/messages/no-document-import-in-page)                                       | Prevent importing `next/document` outside of `pages/_document.js`.                                               |
| <Check size={18} /> | [@next/next/no-duplicate-head](/docs/messages/no-duplicate-head)                                                         | Prevent duplicate usage of `<Head>` in `pages/_document.js`.                                                     |
| <Check size={18} /> | [@next/next/no-head-element](/docs/messages/no-head-element)                                                             | Prevent usage of `<head>` element.                                                                               |
| <Check size={18} /> | [@next/next/no-head-import-in-document](/docs/messages/no-head-import-in-document)                                       | Prevent usage of `next/head` in `pages/_document.js`.                                                            |
| <Check size={18} /> | [@next/next/no-html-link-for-pages](/docs/messages/no-html-link-for-pages)                                               | Prevent usage of `<a>` elements to navigate to internal Next.js pages.                                           |
| <Check size={18} /> | [@next/next/no-img-element](/docs/messages/no-img-element)                                                               | Prevent usage of `<img>` element due to slower LCP and higher bandwidth.                                         |
| <Check size={18} /> | [@next/next/no-page-custom-font](/docs/messages/no-page-custom-font)                                                     | Prevent page-only custom fonts.                                                                                  |
| <Check size={18} /> | [@next/next/no-script-component-in-head](/docs/messages/no-script-component-in-head)                                     | Prevent usage of `next/script` in `next/head` component.                                                         |
| <Check size={18} /> | [@next/next/no-styled-jsx-in-document](/docs/messages/no-styled-jsx-in-document)                                         | Prevent usage of `styled-jsx` in `pages/_document.js`.                                                           |
| <Check size={18} /> | [@next/next/no-sync-scripts](/docs/messages/no-sync-scripts)                                                             | Prevent synchronous scripts.                                                                                     |
| <Check size={18} /> | [@next/next/no-title-in-document-head](/docs/messages/no-title-in-document-head)                                         | Prevent usage of `<title>` with `Head` component from `next/document`.                                           |
| <Check size={18} /> | @next/next/no-typos                                                                                                      | Prevent common typos in [Next.js's data fetching functions](/docs/pages/building-your-application/data-fetching) |
| <Check size={18} /> | [@next/next/no-unwanted-polyfillio](/docs/messages/no-unwanted-polyfillio)                                               | Prevent duplicate polyfills from Polyfill.io.                                                                    |

If you already have ESLint configured in your application, we recommend extending from this plugin directly instead of including `eslint-config-next` unless a few conditions are met. Refer to the [Recommended Plugin Ruleset](#recommended-plugin-ruleset) to learn more.


### 自定义设置

#### `rootDir`

如果你在一个项目中使用 `eslint-plugin-next`，而 Next.js 并未安装在项目的根目录（例如在 monorepo 中），你可以使用 `.eslintrc` 中的 `settings` 属性来告诉 `eslint-plugin-next` 你的 Next.js 应用在哪里：

```json filename=".eslintrc.json"
{
  "extends": "next",
  "settings": {
    "next": {
      "rootDir": "packages/my-app/"
    }
  }
}
```

`rootDir` 可以是路径（相对或绝对）、一个全局模式（例如 `"packages/*/"`），或者是一个路径和/或全局模式的数组。

## 检查自定义目录和文件

默认情况下，Next.js 会为 `pages/`、`app/`、`components/`、`lib/` 和 `src/` 目录中的所有文件运行 ESLint。然而，你可以在 `next.config.js` 中的 `eslint` 配置的 `dirs` 选项中指定要检查的目录，以用于生产构建：

```js filename="next.config.js"
module.exports = {
  eslint: {
    dirs: ['pages', 'utils'], // 仅在生产构建期间（next build）运行 ESLint，针对 'pages' 和 'utils' 目录
  },
}
```

类似地，`--dir` 和 `--file` 标志可用于 `next lint` 以检查特定的目录和文件：

```bash filename="Terminal"
next lint --dir pages --dir utils --file bar.js
```


## 缓存

<AppOnly>

为了提高性能，默认情况下，由 ESLint 处理的文件信息会被缓存。这存储在 `.next/cache` 或你定义的 [构建目录](/docs/app/api-reference/next-config-js/distDir) 中。如果你包含任何依赖于单个源文件内容之外的 ESLint 规则并需要禁用缓存，请使用 `next lint` 时加上 `--no-cache` 标志。

</AppOnly>

<PagesOnly>

为了提高性能，默认情况下，由 ESLint 处理的文件信息会被缓存。这存储在 `.next/cache` 或你定义的 [构建目录](/docs/pages/api-reference/next-config-js/distDir) 中。如果你包含任何依赖于单个源文件内容之外的 ESLint 规则并需要禁用缓存，请使用 `next lint` 时加上 `--no-cache` 标志。

</PagesOnly>

```bash filename="Terminal"
next lint --no-cache
```


## 禁用规则

如果你想修改或禁用由支持的插件（`react`、`react-hooks`、`next`）提供的任何规则，你可以直接在 `.eslintrc` 中的 `rules` 属性中更改它们：

```json filename=".eslintrc.json"
{
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

### 核心网络指标

当首次运行 `next lint` 并选择 **strict** 选项时，会启用 `next/core-web-vitals` 规则集。

```json filename=".eslintrc.json"
{
  "extends": "next/core-web-vitals"
}
```

`next/core-web-vitals` 更新 `eslint-plugin-next`，以在默认情况下为警告的规则上出现错误，如果它们影响 [核心网络指标](https://web.dev/vitals/)。

> 对于使用 [Create Next App](/docs/app/api-reference/create-next-app) 构建的新应用程序，`next/core-web-vitals` 入口点会自动包含。
## 使用其他工具

### Prettier

ESLint 还包含代码格式化规则，这可能与您现有的 [Prettier](https://prettier.io/) 设置冲突。我们建议您在 ESLint 配置中包含 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)，以便让 ESLint 和 Prettier 协同工作。

首先，安装依赖项：

```bash filename="终端"
npm install --save-dev eslint-config-prettier

yarn add --dev eslint-config-prettier

pnpm add --save-dev eslint-config-prettier

bun add --dev eslint-config-prettier
```

然后，将 `prettier` 添加到您现有的 ESLint 配置中：

```json filename=".eslintrc.json"
{
  "extends": ["next", "prettier"]
}
```

### lint-staged

如果您想使用 `next lint` 与 [lint-staged](https://github.com/okonet/lint-staged) 一起运行，以便在暂存的 git 文件上运行 linter，您需要在项目根目录下的 `.lintstagedrc.js` 文件中添加以下内容，以指定使用 `--file` 标志。

```js filename=".lintstagedrc.js"
const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

## 迁移现有配置

### 推荐的插件规则集

如果您已经在应用程序中配置了 ESLint，并且以下任一条件为真：

- 您已经安装了一个或多个以下插件（无论是单独安装还是通过 `airbnb` 或 `react-app` 等不同配置）：
  - `react`
  - `react-hooks`
  - `jsx-a11y`
  - `import`
- 您定义了特定的 `parserOptions`，这些选项与 Next.js 中 Babel 的配置不同（除非您已经 [自定义了您的 Babel 配置](/docs/pages/building-your-application/configuring/babel)）
- 您已经安装了 `eslint-plugin-import` 并定义了 Node.js 和/或 TypeScript [解析器](https://github.com/benmosher/eslint-plugin-import#resolvers) 以处理导入

那么我们建议您要么删除这些设置，如果您更喜欢这些属性在 [`eslint-config-next`](https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js) 中的配置方式，要么直接从 Next.js ESLint 插件扩展：

```js
module.exports = {
  extends: [
    //...
    'plugin:@next/next/recommended',
  ],
}
```

插件可以在您的项目中正常安装，而无需运行 `next lint`：

```bash filename="终端"
npm install --save-dev @next/eslint-plugin-next

yarn add --dev @next/eslint-plugin-next

pnpm add --save-dev @next/eslint-plugin-next

bun add --dev @next/eslint-plugin-next
```

这消除了由于在多个配置中导入相同的插件或解析器而可能发生的冲突或错误的风险。

### 额外的配置

如果您已经使用单独的 ESLint 配置并希望包含 `eslint-config-next`，请确保在其他配置之后最后扩展它。例如：

```json filename=".eslintrc.json"
{
  "extends": ["eslint:recommended", "next"]
}
```

`next` 配置已经处理了为 `parser`、`plugins` 和 `settings` 属性设置默认值。除非您的用例需要不同的配置，否则无需手动重新声明这些属性。

如果您包含任何其他可共享的配置，**您需要确保这些属性不会被覆盖或修改**。否则，我们建议您删除与 `next` 配置共享行为的任何配置，或如上所述直接从 Next.js ESLint 插件扩展。