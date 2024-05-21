---
title: 在 Next.js 中设置 Cypress
nav_title: Cypress
description: 学习如何在 Next.js 中设置 Cypress 进行端到端（E2E）和组件测试。
---
# 在 Next.js 中设置 Cypress
[Cypress](https://www.cypress.io/) 是一个用于**端到端（E2E）**和**组件测试**的测试运行器。本页将向您展示如何在 Next.js 中设置 Cypress 并编写您的第一个测试。

> **警告：**
>
> - 对于**组件测试**，Cypress 当前不支持 [Next.js 版本 14](https://github.com/cypress-io/cypress/issues/28185) 和 `async` 服务器组件。这些问题正在跟踪中。目前，组件测试适用于 Next.js 版本 13，我们建议对 `async` 服务器组件进行 E2E 测试。
> - Cypress 版本低于 13.6.3 不支持 [TypeScript 版本 5](https://github.com/cypress-io/cypress/issues/27731) 与 `moduleResolution:"bundler"`。然而，这个问题已经在 Cypress 版本 13.6.3 及以后的版本中得到了解决。[cypress v13.6.3](https://docs.cypress.io/guides/references/changelog#13-6-3)

<AppOnly>


## 快速开始

您可以使用 `create-next-app` 和 [with-cypress 示例](https://github.com/vercel/next.js/tree/canary/examples/with-cypress) 快速开始。

```bash filename="终端"
npx create-next-app@latest --example with-cypress with-cypress-app
```

</AppOnly>


## 手动设置

要手动设置 Cypress，请将 `cypress` 安装为开发依赖项：

```bash filename="终端"
npm install -D cypress
# 或
yarn add -D cypress
# 或
pnpm install -D cypress
```

将 Cypress 的 `open` 命令添加到 `package.json` 的 scripts 字段：

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "cypress:open": "cypress open"
  }
}
```

首次运行 Cypress 以打开 Cypress 测试套件：

```bash filename="终端"
npm run cypress:open
```

您可以选择配置**E2E 测试**和/或**组件测试**。选择这些选项中的任何一个都将自动在您的项目中创建一个 `cypress.config.js` 文件和一个 `cypress` 文件夹。
## 创建你的第一个 Cypress E2E 测试

确保你的 `cypress.config.js` 文件有以下配置：

```ts filename="cypress.config.ts"
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

```js filename="cypress.config.js"
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

然后，创建两个新的 Next.js 文件：

<AppOnly>

```jsx filename="app/page.js"
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>首页</h1>
      <Link href="/about">关于</Link>
    </div>
  )
}
```

```jsx filename="app/about/page.js"
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>关于</h1>
      <Link href="/">首页</Link>
    </div>
  )
}
```

</AppOnly>

<PagesOnly>

```jsx filename="pages/index.js"
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>首页</h1>
      <Link href="/about">关于</Link>
    </div>
  )
}
```

```jsx filename="pages/about.js"
import Link from 'next/link'

export default function About() {
  return (
    <div>
      <h1>关于</h1>
      <Link href="/">首页</Link>
    </div>
  )
}
```

</PagesOnly>

添加一个测试来检查你的导航是否正常工作：

```js filename="cypress/e2e/app.cy.js"
describe('导航', () => {
  it('应该能够导航到关于页面', () => {
    // 从首页开始
    cy.visit('http://localhost:3000/')

    // 查找一个包含 "about" 的 href 属性的链接并点击它
    cy.get('a[href*="about"]').click()

    // 新的 URL 应该包含 "/about"
    cy.url().should('include', '/about')

    // 新页面应该包含一个 "关于" 的 h1 标签
    cy.get('h1').contains('关于')
  })
})
```

### 运行 E2E 测试

Cypress 将模拟用户在你的应用程序中导航，这需要你的 Next.js 服务器正在运行。我们建议你针对生产代码运行测试，以更接近你的应用程序将如何表现。

运行 `npm run build && npm run start` 来构建你的 Next.js 应用程序，然后在另一个终端窗口运行 `npm run cypress:open` 来启动 Cypress 并运行你的 E2E 测试套件。

> **须知：**
>
> - 你可以通过在 `cypress.config.js` 配置文件中添加 `baseUrl: 'http://localhost:3000'` 来使用 `cy.visit("/")` 代替 `cy.visit("http://localhost:3000/")`。
> - 或者，你可以安装 `start-server-and-test` 包来与 Cypress 结合运行 Next.js 生产服务器。安装后，在 `package.json` 的 scripts 字段中添加 `"test": "start-server-and-test start http://localhost:3000 cypress"`。记得在新更改后重新构建你的应用程序。
# 创建你的第一个 Cypress 组件测试

组件测试可以构建并挂载一个特定的组件，而无需打包整个应用程序或启动服务器。

在 Cypress 应用程序中选择 **组件测试**，然后选择 **Next.js** 作为你的前端框架。你的项目中将创建一个 `cypress/component` 文件夹，并更新 `cypress.config.js` 文件以启用组件测试。

确保你的 `cypress.config.js` 文件具有以下配置：

```ts filename="cypress.config.ts"
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

```js filename="cypress.config.js"
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

假设与上一节相同的组件，添加一个测试来验证组件是否渲染了预期的输出：

<AppOnly>

```tsx filename="cypress/component/about.cy.tsx"
import Page from '../../app/page'

describe('<Page />', () => {
  it('should render and display expected content', () => {
    // 挂载 React 组件以供首页使用
    cy.mount(<Page />)

    // 新页面应该包含一个带有 "Home" 的 h1
    cy.get('h1').contains('Home')

    // 验证存在一个带有预期 URL 的链接
    // 跟随链接更适合 E2E 测试
    cy.get('a[href="/about"]').should('be.visible')
  })
})
```

</AppOnly>

<PagesOnly>

```jsx filename="cypress/component/about.cy.js"
import AboutPage from '../../pages/about'

describe('<AboutPage />', () => {
  it('should render and display expected content', () => {
    // 挂载 React 组件以供关于页面使用
    cy.mount(<AboutPage />)

    // 新页面应该包含一个带有 "About page" 的 h1
    cy.get('h1').contains('About')

    // 验证存在一个带有预期 URL 的链接
    // *跟随* 链接更适合 E2E 测试
    cy.get('a[href="/"]').should('be.visible')
  })
})
```

</PagesOnly>

> **须知**：
>
> - Cypress 目前不支持 `async` 服务器组件的组件测试。我们建议使用 E2E 测试。
> - 由于组件测试不需要 Next.js 服务器，依赖于服务器可用的功能（如 `<Image />`）可能无法立即工作。

### 运行组件测试

在终端中运行 `npm run cypress:open` 以启动 Cypress 并运行你的组件测试套件。

## 持续集成 (CI)

除了交互式测试，你还可以使用 `cypress run` 命令无头运行 Cypress，这更适合 CI 环境：

```json filename="package.json"
{
  "scripts": {
    //...
    "e2e": "start-server-and-test dev http://localhost:3000 \"cypress open --e2e\"",
    "e2e:headless": "start-server-and-test dev http://localhost:3000 \"cypress run --e2e\"",
    "component": "cypress open --component",
    "component:headless": "cypress run --component"
  }
}
```

你可以从以下资源了解更多关于 Cypress 和持续集成的信息：

- [Next.js with Cypress 示例](https://github.com/vercel/next.js/tree/canary/examples/with-cypress)
- [Cypress 持续集成文档](https://docs.cypress.io/guides/continuous-integration/introduction)
- [Cypress GitHub Actions 指南](https://on.cypress.io/github-actions)
- [官方 Cypress GitHub Action](https://github.com/cypress-io/github-action)
- [Cypress Discord](https://discord.com/invite/cypress)