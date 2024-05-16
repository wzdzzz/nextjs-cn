---
title: Sass
---

# Sass

安装了 `sass` 包之后，Next.js 内置支持使用 `.scss` 和 `.sass` 扩展名与 Sass 集成。您可以通过 CSS 模块和 `.module.scss` 或 `.module.sass` 扩展名使用组件级别的 Sass。

首先，安装 [`sass`](https://github.com/sass/sass)：

```bash filename="终端"
npm install --save-dev sass
```

> **须知**：
>
> Sass 支持 [两种不同的语法](https://sass-lang.com/documentation/syntax)，每种语法都有自己的扩展名。
> `.scss` 扩展名要求您使用 [SCSS 语法](https://sass-lang.com/documentation/syntax#scss)，
> 而 `.sass` 扩展名要求您使用 [缩进语法（"Sass"）](https://sass-lang.com/documentation/syntax#the-indented-syntax)。
>
> 如果您不确定选择哪种，可以从 `.scss` 扩展名开始，它是 CSS 的超集，不需要您学习
> 缩进语法（"Sass"）。

### 自定义 Sass 选项

如果您想要配置 Sass 编译器，请在 `next.config.js` 中使用 `sassOptions`。

```js filename="next.config.js"
const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
```

### Sass 变量

Next.js 支持从 CSS 模块文件中导出的 Sass 变量。

例如，使用导出的 `primaryColor` Sass 变量：

```scss filename="app/variables.module.scss"
$primary-color: #64ff00;

:export {
  primaryColor: $primary-color;
}
```

<App>

```jsx filename="app/page.js"
// 对应根 `/` URL

import variables from './variables.module.scss'

export default function Page() {
  return <h1 style={{ color: variables.primaryColor }}>Hello, Next.js!</h1>
}
```

</App>

<Pages>

```jsx filename="pages/_app.js"
import variables from '../styles/variables.module.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout color={variables.primaryColor}>
      <Component {...pageProps} />
    </Layout>
  )
}
```

</Pages>