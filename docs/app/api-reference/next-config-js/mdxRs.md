# mdxRs

**描述：** 在 App Router 中使用新的 Rust 编译器编译 MDX 文件。

适用于 `@next/mdx`。使用新的 Rust 编译器编译 MDX 文件。

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