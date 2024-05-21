# useAmp

启用页面中的AMP，并控制Next.js以AMP配置向页面添加AMP的方式。

<details>
  <summary>示例</summary>

- [AMP](https://github.com/vercel/next.js/tree/canary/examples/amp)

</details>

> AMP支持是我们的高级功能之一，你可以[在这里阅读更多关于AMP的信息](/docs/pages/building-your-application/configuring/amp)。

要启用AMP，请向你的页面添加以下配置：

```jsx filename="pages/index.js"
export const config = { amp: true }
```

`amp`配置接受以下值：

- `true` - 页面将是仅AMP的
- `'hybrid'` - 页面将有两个版本，一个带有AMP，另一个带有HTML

要了解更多关于`amp`配置的信息，请阅读下面的部分。

## AMP首页面

查看以下示例：

```jsx filename="pages/about.js"
export const config = { amp: true }

function About(props) {
  return <h3>我的AMP关于页面！</h3>
}

export default About
```

上面的页面是一个仅AMP的页面，这意味着：

- 页面没有Next.js或React客户端运行时
- 页面自动使用[AMP优化器](https://github.com/ampproject/amp-toolbox/tree/master/packages/optimizer)进行优化，这是一个应用与AMP缓存相同的转换的优化器（通过高达42%的性能提升）
- 页面有一个用户可访问的（优化过的）页面版本和一个搜索引擎可索引的（未优化过的）页面版本

## 混合AMP页面

查看以下示例：

```jsx filename="pages/about.js"
import { useAmp } from 'next/amp'

export const config = { amp: 'hybrid' }

function About(props) {
  const isAmp = useAmp()

  return (
    <div>
      <h3>我的AMP关于页面！</h3>
      {isAmp ? (
        <amp-img
          width="300"
          height="300"
          src="/my-img.jpg"
          alt="一个很酷的图片"
          layout="responsive"
        />
      ) : (
        <img width="300" height="300" src="/my-img.jpg" alt="一个很酷的图片" />
      )}
    </div>
  )
}

export default About
```

上面的页面是一个混合AMP页面，这意味着：

- 页面以传统的HTML（默认）和AMP HTML（通过在URL中添加`?amp=1`）进行渲染
- 页面的AMP版本只应用了有效的优化，通过AMP优化器进行应用，以便它可以被搜索引擎索引

页面使用`useAmp`来区分模式，它是一个[React Hook](https://react.dev/reference/react)，如果页面正在使用AMP，则返回`true`，否则返回`false`。