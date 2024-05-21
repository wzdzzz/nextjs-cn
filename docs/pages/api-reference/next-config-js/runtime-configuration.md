# Runtime Config

添加客户端和服务器运行时配置到您的Next.js应用。

> **警告：**
>
> - **此功能已被弃用。** 我们建议改用[环境变量](/docs/pages/building-your-application/configuring/environment-variables)，它也支持读取运行时值。
> - 您可以使用[`register`函数](/docs/app/building-your-application/optimizing/instrumentation)在服务器启动时运行代码。
> - 此功能不适用于[自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization)、[输出文件追踪](/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files)或[React服务器组件](/docs/app/building-your-application/rendering/server-components)。

要向您的应用添加运行时配置，请打开`next.config.js`并添加`publicRuntimeConfig`和`serverRuntimeConfig`配置：

```js filename="next.config.js"
module.exports = {
  serverRuntimeConfig: {
    // 仅在服务器端可用
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET, // 传递环境变量
  },
  publicRuntimeConfig: {
    // 将在服务器和客户端都可用
    staticFolder: '/static',
  },
}
```

将任何仅服务器端的运行时配置放在`serverRuntimeConfig`下。

任何客户端和服务器端代码都可以访问的内容应该放在`publicRuntimeConfig`下。

> 依赖于`publicRuntimeConfig`的页面**必须**使用`getInitialProps`或`getServerSideProps`，或者您的应用必须有一个带有`getInitialProps`的[自定义应用](/docs/pages/building-your-application/routing/custom-app)以退出[自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization)。运行时配置将不会对任何页面（或页面中的组件）在未进行服务器端渲染的情况下可用。

要访问应用中的运行时配置，请使用`next/config`，如下所示：

```jsx
import getConfig from 'next/config'
import Image from 'next/image'

// 仅包含serverRuntimeConfig和publicRuntimeConfig
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
// 仅在服务器端可用
console.log(serverRuntimeConfig.mySecret)
// 将在服务器端和客户端都可用
console.log(publicRuntimeConfig.staticFolder)

function MyImage() {
  return (
    <div>
      <Image
        src={`${publicRuntimeConfig.staticFolder}/logo.png`}
        alt="logo"
        layout="fill"
      />
    </div>
  )
}

export default MyImage
```