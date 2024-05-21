# typedRoutes (experimental)

## typedRoutes
启用对静态类型链接的实验性支持。

此特性需要在您的项目中使用App Router以及TypeScript。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
```