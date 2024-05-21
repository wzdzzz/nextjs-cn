# pageExtensions

须知：Next.js 在解析页面路由中的页面时，默认使用以下扩展名的文件：`.tsx`、`.ts`、`.jsx`、`.js`。您可以修改此设置以允许其他扩展名，如 Markdown (`.md`、`.mdx`)。

```js filename="next.config.js"
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}

module.exports = withMDX(nextConfig)
```

您可以扩展 Next.js 使用的默认页面扩展名 (`.tsx`、`.ts`、`.jsx`、`.js`)。在 `next.config.js` 中，添加 `pageExtensions` 配置：

```js filename="next.config.js"
module.exports = {
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
}
```

更改这些值将影响所有 Next.js 页面，包括以下页面：

- [`middleware.js`](/docs/pages/building-your-application/routing/middleware)
- [`instrumentation.js`](/docs/pages/building-your-application/optimizing/instrumentation)
- `pages/_document.js`
- `pages/_app.js`
- `pages/api/`

例如，如果您将 `.ts` 页面扩展名重新配置为 `.page.ts`，则需要将 `middleware.page.ts`、`instrumentation.page.ts`、`_app.page.ts` 等页面重命名。

## 在 `pages` 目录中包含非页面文件

您可以将测试文件或其他组件使用的文件与 `pages` 目录中的页面文件放在一起。在 `next.config.js` 中，添加 `pageExtensions` 配置：

```js filename="next.config.js"
module.exports = {
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
}
```

然后，将您的页面文件重命名为包含 `.page` 的文件扩展名（例如，将 `MyPage.tsx` 重命名为 `MyPage.page.tsx`）。确保您重命名了所有 Next.js 页面，包括上面提到的文件。