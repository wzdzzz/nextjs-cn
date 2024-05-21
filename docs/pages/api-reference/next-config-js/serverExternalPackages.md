# serverExternalPackages

`serverExternalPackages` 允许您选择性地从 `bundlePagesRouterDependencies` 启用的依赖打包中排除特定的依赖。

这些页面随后将使用原生的 Node.js `require` 来解析依赖。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@acme/ui'],
}

module.exports = nextConfig
```

Next.js 包含了一个[简短的流行包列表](https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/server-external-packages.json)，这些包目前正在进行兼容性工作，并且已经自动被排除在外：

- `@appsignal/nodejs`
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-presigned-post`
- `@blockfrost/blockfrost-js`
- `@highlight-run/node`
- `@jpg-store/lucid-cardano`
- `@libsql/client`
- `@mikro-orm/core`
- `@mikro-orm/knex`
- `@node-rs/argon2`
- `@node-rs/bcrypt`
- `@prisma/client`
- `@react-pdf/renderer`
- `@sentry/profiling-node`
- `@swc/core`
- `argon2`
- `autoprefixer`
- `aws-crt`
- `bcrypt`
- `better-sqlite3`
- `canvas`
- `cpu-features`
- `cypress`
- `eslint`
- `express`
- `firebase-admin`
- `isolated-vm`
- `jest`
- `jsdom`
- `libsql`
- `mdx-bundler`
- `mongodb`
- `mongoose`
- `next-mdx-remote`
- `next-seo`
- `node-pty`
- `node-web-audio-api`
- `oslo`
- `pg`
- `playwright`
- `postcss`
- `prettier`
- `prisma`
- `puppeteer-core`
- `puppeteer`
- `rimraf`
- `sharp`
- `shiki`
- `sqlite3`
- `tailwindcss`
- `ts-node`
- `typescript`
- `vscode-oniguruma`
- `undici`
- `webpack`
- `websocket`
- `zeromq`