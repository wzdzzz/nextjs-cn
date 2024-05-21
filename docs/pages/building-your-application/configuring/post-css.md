---
title: PostCSS
description: 扩展 Next.js 添加的 PostCSS 配置和插件，加入您自己的插件。
---

<details open>
  <summary>示例</summary>

- [Tailwind CSS 示例](https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss)

</details>


## 默认行为

Next.js 使用 PostCSS 编译 CSS，支持其[内置的 CSS 功能](/docs/pages/building-your-application/styling)。

开箱即用，无需配置，Next.js 会使用以下转换编译 CSS：

- [Autoprefixer](https://github.com/postcss/autoprefixer) 自动为 CSS 规则添加供应商前缀（支持到 IE11）。
- [跨浏览器 Flexbox 漏洞](https://github.com/philipwalton/flexbugs) 被修正，以符合 [规范](https://www.w3.org/TR/css-flexbox-1/)。
- 新的 CSS 特性会自动编译以兼容 Internet Explorer 11：
  - [`all` 属性](https://developer.mozilla.org/docs/Web/CSS/all)
  - [断点属性](https://developer.mozilla.org/docs/Web/CSS/break-after)
  - [`font-variant` 属性](https://developer.mozilla.org/docs/Web/CSS/font-variant)
  - [间隙属性](https://developer.mozilla.org/docs/Web/CSS/gap)
  - [媒体查询范围](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries#Syntax_improvements_in_Level_4)

默认情况下，[CSS Grid](https://www.w3.org/TR/css-grid-1/) 和 [自定义属性](https://developer.mozilla.org/docs/Web/CSS/var)（CSS 变量）**不会被编译**以支持 IE11。

要为 IE11 编译 [CSS Grid 布局](https://developer.mozilla.org/docs/Web/CSS/grid)，您可以在 CSS 文件顶部放置以下注释：

```css
/* autoprefixer grid: autoplace */
```

您也可以通过以下配置（已折叠）启用整个项目中 [CSS Grid 布局](https://developer.mozilla.org/docs/Web/CSS/grid) 的 IE11 支持。有关更多信息，请参见下面的[“自定义插件”](#customizing-plugins)。

<details>
  <summary>点击查看启用 CSS Grid 布局的配置</summary>

```json filename="postcss.config.json"
{
  "plugins": [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009",
          "grid": "autoplace"
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ]
  ]
}
```

</details>

CSS 变量不会被编译，因为[无法安全地这样做](https://github.com/MadLittleMods/postcss-css-variables#caveats)。
如果您必须使用变量，可以考虑使用像 [Sass 变量](https://sass-lang.com/documentation/variables) 这样的东西，它们会被 [Sass](https://sass-lang.com/) 编译掉。


## 自定义目标浏览器

Next.js 允许您通过 [Browserslist](https://github.com/browserslist/browserslist) 配置目标浏览器（对于 [Autoprefixer](https://github.com/postcss/autoprefixer) 和编译的 CSS 特性）。

要自定义 browserslist，请在您的 `package.json` 中创建一个 `browserslist` 键，如下所示：

```json filename="package.json"
{
  "browserslist": [">0.3%", "not dead", "not op_mini all"]
}
```

您可以使用 [browsersl.ist](https://browsersl.ist/?q=%3E0.3%25%2C+not+ie+11%2C+not+dead%2C+not+op_mini+all) 工具来可视化您正在针对的浏览器。


## CSS 模块

支持 CSS 模块不需要任何配置。要为文件启用 CSS 模块，将文件重命名为具有 `.module.css` 扩展名。

您可以在此处了解更多关于 [Next.js 的 CSS 模块支持](/docs/pages/building-your-application/styling)。
## 自定义插件

> **警告**：当你定义一个自定义的 PostCSS 配置文件时，Next.js **完全禁用**了[默认行为](#default-behavior)。
> 确保手动配置所有你需要编译的特性，包括[Autoprefixer](https://github.com/postcss/autoprefixer)。
> 你还需要手动安装自定义配置中包含的任何插件，即 `npm install postcss-flexbugs-fixes postcss-preset-env`。

要自定义 PostCSS 配置，请在项目的根目录下创建一个 `postcss.config.json` 文件。

这是 Next.js 使用的默认配置：

```json filename="postcss.config.json"
{
  "plugins": [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009"
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ]
  ]
}
```

> **须知**：Next.js 还允许文件命名为 `.postcssrc.json`，或者从 `package.json` 中的 `postcss` 键读取。

也可以使用 `postcss.config.js` 文件配置 PostCSS，这在你想根据环境条件包含插件时很有用：

```js filename="postcss.config.js"
module.exports = {
  plugins:
    process.env.NODE_ENV === 'production'
      ? [
          'postcss-flexbugs-fixes',
          [
            'postcss-preset-env',
            {
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
              features: {
                'custom-properties': false,
              },
            },
          ],
        ]
      : [
          // 开发环境中无转换
        ],
}
```

> **须知**：Next.js 还允许文件命名为 `.postcssrc.js`。

不要使用 `require()` 导入 PostCSS 插件。插件必须以字符串形式提供。

> **须知**：如果你的 `postcss.config.js` 需要支持同一项目中的其他非 Next.js 工具，你必须使用可互操作的基于对象的格式：
>
> ```js
> module.exports = {
>   plugins: {
>     'postcss-flexbugs-fixes': {},
>     'postcss-preset-env': {
>       autoprefixer: {
>         flexbox: 'no-2009',
>       },
>       stage: 3,
>       features: {
>         'custom-properties': false,
>       },
>     },
>   },
> }
> ```