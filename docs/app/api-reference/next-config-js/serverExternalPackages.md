---
title: serverExternalPackages
description: 从 Server Components 打包中排除特定依赖，并使用原生 Node.js `require`。
---

在 [Server Components](/docs/app/building-your-application/rendering/server-components) 和 [Route Handlers](/docs/app/building-your-application/routing/route-handlers) 中使用的依赖会自动被 Next.js 打包。

如果某个依赖使用了 Node.js 特定的特性，你可以选择从 Server Components 打包中排除特定的依赖，并使用原生的 Node.js `require`。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@acme/ui'],
}

module.exports = nextConfig
```

Next.js 包含了一个 [流行包的简短列表](https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/server-external-packages.json)，这些包目前正在进行兼容性工作，并且已经自动被排除在外：

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