---
title: 在 Next.js 中设置 Playwright
nav_title: Playwright
description: 学习如何在 Next.js 中设置 Playwright 进行端到端（E2E）测试。
---
# 在 Next.js 中设置 Playwright
Playwright 是一个测试框架，允许您使用单一 API 自动化 Chromium、Firefox 和 WebKit。您可以用它来编写 **端到端（E2E）** 测试。本指南将向您展示如何在 Next.js 中设置 Playwright 并编写您的第一个测试。

## 快速开始

最快的入门方式是使用 `create-next-app` 与 [with-playwright 示例](https://github.com/vercel/next.js/tree/canary/examples/with-playwright)。这将创建一个完整的 Next.js 项目，并配置了 Playwright。

```bash filename="终端"
npx create-next-app@latest --example with-playwright with-playwright-app
```

## 手动设置

要安装 Playwright，请运行以下命令：

```bash filename="终端"
npm init playwright
# 或
yarn create playwright
# 或
pnpm create playwright
```

这将引导您完成一系列提示，为您的项目设置和配置 Playwright，包括添加一个 `playwright.config.ts` 文件。请参阅 [Playwright 安装指南](https://playwright.dev/docs/intro#installation) 以获取逐步指南。
## 创建你的第一个 Playwright E2E 测试

创建两个新的 Next.js 页面：

<AppOnly>

```tsx filename="app/page.tsx"
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

```tsx filename="app/about/page.tsx"
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

```tsx filename="pages/index.ts"
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

```tsx filename="pages/about.ts"
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

然后，添加一个测试来验证你的导航是否正常工作：

```ts filename="tests/example.spec.ts"
import { test, expect } from '@playwright/test'

test('应该能够导航到关于页面', async ({ page }) => {
  // 从首页开始（baseURL 通过 playwright.config.ts 中的 webServer 设置）
  await page.goto('http://localhost:3000/')
  // 查找一个包含“关于”文本的元素并点击它
  await page.click('text=关于')
  // 新的 URL 应该是“/about”（那里使用了 baseURL）
  await expect(page).toHaveURL('http://localhost:3000/about')
  // 新页面应该包含一个包含“关于”文本的 h1 标签
  await expect(page.locator('h1')).toContainText('关于')
})
```

> **须知**：
>
> 如果你在 `playwright.config.ts` [配置文件](https://playwright.dev/docs/test-configuration)中添加了 [`"baseURL": "http://localhost:3000"`](https://playwright.dev/docs/api/class-testoptions#test-options-base-url)，你可以使用 `page.goto("/")` 代替 `page.goto("http://localhost:3000/")`。

### 运行你的 Playwright 测试

Playwright 将模拟用户使用三个浏览器（Chromium、Firefox 和 Webkit）导航你的应用程序，这需要你的 Next.js 服务器正在运行。我们建议你对生产代码运行测试，以更接近你的应用程序将如何表现。

运行 `npm run build` 和 `npm run start`，然后在另一个终端窗口运行 `npx playwright test` 来运行 Playwright 测试。

> **须知**：或者，你可以使用 [`webServer`](https://playwright.dev/docs/test-webserver/) 特性让 Playwright 启动开发服务器并等待其完全可用。

### 在持续集成（CI）上运行 Playwright

Playwright 默认会在 [无头模式](https://playwright.dev/docs/ci#running-headed) 下运行你的测试。要安装所有 Playwright 依赖项，请运行 `npx playwright install-deps`。

你可以从以下资源了解更多关于 Playwright 和持续集成的信息：

- [Next.js 与 Playwright 示例](https://github.com/vercel/next.js/tree/canary/examples/with-playwright)
- [CI 提供商上的 Playwright](https://playwright.dev/docs/ci)
- [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)