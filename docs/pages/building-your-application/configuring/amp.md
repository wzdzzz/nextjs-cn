---
title: AMP
description: 通过最少的配置，且无需离开React环境，您可以开始添加AMP，从而提高页面的性能和速度。
---

<details>
  <summary>示例</summary>
  
- [AMP](https://github.com/vercel/next.js/tree/canary/examples/amp)

</details>

使用Next.js，您可以将任何React页面转换为AMP页面，只需最少的配置，且无需离开React。

您可以在官方 [amp.dev](https://amp.dev/) 网站上阅读更多关于AMP的信息。

## 启用AMP

要为页面启用AMP支持，并了解不同的AMP配置，请阅读 [`next/amp`](/docs/pages/building-your-application/configuring/amp) 的API文档。

## 注意事项

- 目前，只有CSS-in-JS受到支持。[CSS Modules](/docs/pages/building-your-application/styling) 目前不受AMP页面支持。您可以[为Next.js贡献CSS Modules支持](https://github.com/vercel/next.js/issues/10549)。

## 添加AMP组件

AMP社区提供了[许多组件](https://amp.dev/documentation/components/)，以使AMP页面更具交互性。Next.js将自动导入页面上使用的所有组件，无需手动导入AMP组件脚本：

```jsx
export const config = { amp: true }

function MyAmpPage() {
  const date = new Date()

  return (
    <div>
      <p>一些时间：{date.toJSON()}</p>
      <amp-timeago
        width="0"
        height="15"
        datetime={date.toJSON()}
        layout="responsive"
      >
        .
      </amp-timeago>
    </div>
  )
}

export default MyAmpPage
```

上述示例使用了[`amp-timeago`](https://amp.dev/documentation/components/amp-timeago/?format=websites)组件。

默认情况下，总是导入组件的最新版本。如果您想要自定义版本，可以使用`next/head`，如下例所示：

```jsx
import Head from 'next/head'

export const config = { amp: true }

function MyAmpPage() {
  const date = new Date()

  return (
    <div>
      <Head>
        <script
          async
          key="amp-timeago"
          custom-element="amp-timeago"
          src="https://cdn.ampproject.org/v0/amp-timeago-0.1.js"
        />
      </Head>

      <p>一些时间：{date.toJSON()}</p>
      <amp-timeago
        width="0"
        height="15"
        datetime={date.toJSON()}
        layout="responsive"
      >
        .
      </amp-timeago>
    </div>
  )
}

export default MyAmpPage
```
## AMP验证

在开发期间，AMP页面会自动使用[amphtml-validator](https://www.npmjs.com/package/amphtml-validator)进行验证。错误和警告将显示在您启动Next.js的终端中。

页面在[静态HTML导出](/docs/pages/building-your-application/deploying/static-exports)期间也会进行验证，任何警告/错误将打印到终端。任何AMP错误都会导致导出以状态码`1`退出，因为导出的不是有效的AMP。

### 自定义验证器

您可以在`next.config.js`中设置自定义AMP验证器，如下所示：

```js
module.exports = {
  amp: {
    validator: './custom_validator.js',
  },
}
```

### 跳过AMP验证

要关闭AMP验证，请将以下代码添加到`next.config.js`中

```js
experimental: {
  amp: {
    skipValidation: true
  }
}
```

### 静态HTML导出中的AMP

当使用[静态HTML导出](/docs/pages/building-your-application/deploying/static-exports)静态预渲染页面时，Next.js会检测页面是否支持AMP并根据该情况改变导出行为。

例如，混合AMP页面`pages/about.js`将输出：

- `out/about.html` - 带客户端React运行时的HTML页面
- `out/about.amp.html` - AMP页面

如果`pages/about.js`是一个仅AMP页面，那么它将输出：

- `out/about.html` - 优化的AMP页面

Next.js将自动在HTML版本的页面中插入指向您的页面AMP版本的链接，因此您不需要这样做，如下所示：

```jsx
<link rel="amphtml" href="/about.amp.html" />
```

并且您的页面的AMP版本将包含指向HTML页面的链接：

```jsx
<link rel="canonical" href="/about" />
```

当[`trailingSlash`](/docs/pages/api-reference/next-config-js/trailingSlash)启用时，`pages/about.js`的导出页面将是：

- `out/about/index.html` - HTML页面
- `out/about.amp/index.html` - AMP页面

## TypeScript

AMP目前没有为TypeScript内置类型，但它在他们的路线图上([#13791](https://github.com/ampproject/amphtml/issues/13791))。

作为替代方案，您可以在项目中手动创建一个名为`amp.d.ts`的文件，并添加这些[自定义类型](https://stackoverflow.com/a/50601125)。