---
title: 在 Next.js 中设置 Jest
nav_title: Jest
description: 学习如何在 Next.js 中设置 Jest 进行单元测试和快照测试。
---
#  在 Next.js 中设置 Jest
Jest 和 React Testing Library 经常一起用于**单元测试**和**快照测试**。本指南将向您展示如何在 Next.js 中设置 Jest 并编写您的第一个测试。

> **须知：** 由于 `async` 服务器组件在 React 生态系统中是新事物，Jest 目前还不支持它们。尽管您仍然可以为同步的服务器和客户端组件运行**单元测试**，但我们建议对 `async` 组件使用**端到端测试**。

## 快速入门

您可以使用 `create-next-app` 和 Next.js 的 [with-jest](https://github.com/vercel/next.js/tree/canary/examples/with-jest) 示例快速开始：

```bash filename="终端"
npx create-next-app@latest --example with-jest with-jest-app
```
## 手动设置

自从 [Next.js 12](https://nextjs.org/blog/next-12) 发布以来，Next.js 现在有了 Jest 的内置配置。

要设置 Jest，安装 `jest` 和以下包作为开发依赖：

```bash filename="终端"
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# 或
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# 或
pnpm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

通过运行以下命令生成一个基本的 Jest 配置文件：

```bash filename="终端"
npm init jest@latest
# 或
yarn create jest@latest
# 或
pnpm create jest@latest
```

这将通过一系列提示引导您为项目设置 Jest，包括自动创建一个 `jest.config.ts|js` 文件。

更新您的配置文件以使用 `next/jest`。这个转换器包含了 Jest 与 Next.js 一起工作所需的所有配置选项：

```ts filename="jest.config.ts" switcher
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // 提供您的 Next.js 应用的路径以在测试环境中加载 next.config.js 和 .env 文件
  dir: './',
})

// 添加任何要传递给 Jest 的自定义配置
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // 在每个测试运行之前添加更多的设置选项
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig 以这种方式导出，以确保 next/jest 可以加载 Next.js 配置，该配置是异步的
export default createJestConfig(config)
```

```js filename="jest.config.js" switcher
const nextJest = require('next/jest')

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // 提供您的 Next.js 应用的路径以在测试环境中加载 next.config.js 和 .env 文件
  dir: './',
})

// 添加任何要传递给 Jest 的自定义配置
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // 在每个测试运行之前添加更多的设置选项
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig 以这种方式导出，以确保 next/jest 可以加载 Next.js 配置，该配置是异步的
module.exports = createJestConfig(config)
```

在幕后，`next/jest` 会自动为您配置 Jest，包括：

- 使用 [Next.js 编译器](/docs/architecture/nextjs-compiler) 设置 `transform`
- 自动模拟样式表（`.css`、`.module.css` 以及它们的 scss 变体）、图片导入和 [`next/font`](/docs/pages/building-your-application/optimizing/fonts)
- 将 `.env`（以及所有变体）加载到 `process.env`
- 从测试解析和转换中忽略 `node_modules`
- 从测试解析中忽略 `.next`
- 加载 `next.config.js` 以获取启用 SWC 转换的标志

> **须知**：要直接测试环境变量，请在单独的设置脚本中或在您的 `jest.config.ts` 文件中手动加载它们。有关更多信息，请参见 [测试环境变量](/docs/pages/building-your-application/configuring/environment-variables#test-environment-variables)。

<PagesOnly>

```
## 设置 Jest（使用 Babel）

如果您选择不使用 [Next.js 编译器](/docs/architecture/nextjs-compiler) 而改用 Babel，您将需要手动配置 Jest 并安装 `babel-jest` 和 `identity-obj-proxy` 以及上述包。

以下是为 Next.js 配置 Jest 的推荐选项：

```js filename="jest.config.js"
module.exports = {
  collectCoverage: true,
  // 在 node 14.x 上，覆盖提供程序 v8 提供良好的速度和或多或少良好的报告
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
  ],
  moduleNameMapper: {
    // 处理 CSS 导入（带 CSS 模块）
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // 处理 CSS 导入（不带 CSS 模块）
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // 处理图片导入
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': `<rootDir>/__mocks__/fileMock.js`,

    // 处理模块别名
    '^@/components/(.*)$': '<rootDir>/components/$1',

    // 处理 @next/font
    '@next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
    // 处理 next/font
    'next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
    // 禁用仅服务器端
    'server-only': `<rootDir>/__mocks__/empty.js`,
  },
  // 在每个测试运行之前添加更多设置选项
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    // 使用 babel-jest 与 next/babel 预设一起转译测试
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}
```

您可以在 [Jest 文档](https://jestjs.io/docs/configuration) 中了解更多关于每个配置选项的信息。我们还建议您查看 [`next/jest` 配置](https://github.com/vercel/next.js/blob/e02fe314dcd0ae614c65b505c6daafbdeebb920e/packages/next/src/build/jest/jest.ts) 以了解 Next.js 如何配置 Jest。

### 处理样式表和图片导入

样式表和图片在测试中不使用，但导入它们可能会导致错误，因此需要将它们模拟。

在 `__mocks__` 目录中创建上面配置中引用的模拟文件 - `fileMock.js` 和 `styleMock.js`：

```js filename="__mocks__/fileMock.js"
module.exports = 'test-file-stub'
```

```js filename="__mocks__/styleMock.js"
module.exports = {}
```

有关处理静态资产的更多信息，请参阅 [Jest 文档](https://jestjs.io/docs/webpack#handling-static-assets)。

## 处理字体

要处理字体，在 `__mocks__` 目录中创建 `nextFontMock.js` 文件，并添加以下配置：

```js filename="__mocks__/nextFontMock.js"
module.exports = new Proxy(
  {},
  {
    get: function getter() {
      return () => ({
        className: 'className',
        variable: 'variable',
        style: { fontFamily: 'fontFamily' },
      })
    },
  }
)
```

</PagesOnly>
## 可选：处理绝对导入和模块路径别名

如果您的项目使用了[模块路径别名](/docs/pages/building-your-application/configuring/absolute-imports-and-module-aliases)，您将需要配置 Jest 以通过将 `jsconfig.json` 文件中的 `paths` 选项与 `jest.config.js` 文件中的 `moduleNameMapper` 选项匹配来解析导入。例如：

```json filename="tsconfig.json 或 jsconfig.json"
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "baseUrl": "./",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

```js filename="jest.config.js"
moduleNameMapper: {
  // ...
  '^@/components/(.*)$': '<rootDir>/components/$1',
}
```

## 可选：使用自定义匹配器扩展 Jest

`@testing-library/jest-dom` 包含了一组方便的[自定义匹配器](https://github.com/testing-library/jest-dom#custom-matchers)，例如 `.toBeInTheDocument()`，这使得编写测试更加容易。您可以通过向 Jest 配置文件添加以下选项，为每个测试导入自定义匹配器：

```ts filename="jest.config.ts" switcher
setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
```

```js filename="jest.config.js" switcher
setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
```

然后，在 `jest.setup.ts` 中，添加以下导入：

```ts filename="jest.setup.ts" switcher
import '@testing-library/jest-dom'
```

```js filename="jest.setup.js" switcher
import '@testing-library/jest-dom'
```

> **须知：** [`extend-expect` 在 `v6.0` 中已被移除](https://github.com/testing-library/jest-dom/releases/tag/v6.0.0)，因此如果您使用的是 `@testing-library/jest-dom` 6 之前的版本，您将需要导入 `@testing-library/jest-dom/extend-expect` 替代。

如果您需要在每个测试之前添加更多的设置选项，您可以将它们添加到上面的 `jest.setup.js` 文件中。
## 在 `package.json` 中添加测试脚本

最后，将 Jest `test` 脚本添加到您的 `package.json` 文件中：

```json filename="package.json" highlight={6-7}
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

`jest --watch` 将在文件更改时重新运行测试。有关更多 Jest CLI 选项，请参考 [Jest 文档](https://jestjs.io/docs/cli#reference)。

### 创建您的第一个测试：

您的项目现在已准备好运行测试。在项目的根目录中创建一个名为 `__tests__` 的文件夹。

<PagesOnly>

例如，我们可以添加一个测试来检查 `<Home />` 组件是否成功渲染了一个标题：

```jsx filename="pages/index.js
export default function Home() {
  return <h1>Home</h1>
}
```

```jsx filename="__tests__/index.test.js"
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })
})
```

</PagesOnly>

<AppOnly>

例如，我们可以添加一个测试来检查 `<Page />` 组件是否成功渲染了一个标题：

```jsx filename="app/page.js
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

```jsx filename="__tests__/page.test.jsx"
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })
})
```

</AppOnly>

可选地，添加一个 [快照测试](https://jestjs.io/docs/snapshot-testing) 以跟踪组件中的任何意外更改：

<PagesOnly>

```jsx filename="__tests__/snapshot.js"
import { render } from '@testing-library/react'
import Home from '../pages/index'

it('renders homepage unchanged', () => {
  const { container } = render(<Home />)
  expect(container).toMatchSnapshot()
})
```

> **须知**：测试文件不应包含在 Pages Router 内部，因为 Pages Router 内部的任何文件都被视为路由。

</PagesOnly>

<AppOnly>

```jsx filename="__tests__/snapshot.js"
import { render } from '@testing-library/react'
import Page from '../app/page'

it('renders homepage unchanged', () => {
  const { container } = render(<Page />)
  expect(container).toMatchSnapshot()
})
```

</AppOnly>

## 运行您的测试

然后，运行以下命令来运行您的测试：

```bash filename="Terminal"
npm run test
# 或
yarn test
# 或
pnpm test
```


## 其他资源

如需进一步阅读，您可能会发现以下资源有帮助：

- [Next.js 与 Jest 示例](https://github.com/vercel/next.js/tree/canary/examples/with-jest)
- [Jest 文档](https://jestjs.io/docs/getting-started)
- [React Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Playground](https://testing-playground.com/) - 使用良好的测试实践来匹配元素。