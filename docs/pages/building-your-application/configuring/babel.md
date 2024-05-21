---
title: Babel
description: 通过您自己的配置扩展 Next.js 添加的 babel 预设。
---

<details>
  <summary>示例</summary>

- [自定义 Babel 配置](https://github.com/vercel/next.js/tree/canary/examples/with-custom-babel-config)

</details>

Next.js 为您的应用包含了 `next/babel` 预设，它包含了编译 React 应用程序和服务器端代码所需的一切。但如果您想要扩展默认的 Babel 配置，这也是可能的。

## 添加预设和插件

首先，您只需要在项目的根目录中定义一个 `.babelrc` 文件（或 `babel.config.js`）。如果找到了这样的文件，它将被视为 _真实来源_，因此它需要定义 Next.js 所需的内容，即 `next/babel` 预设。

这是一个 `.babelrc` 文件的示例：

```json filename=".babelrc"
{
  "presets": ["next/babel"],
  "plugins": []
}
```

您可以[查看此文件](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/babel/preset.ts)，了解 `next/babel` 包含的预设。

要添加预设/插件 **而不配置它们**，可以这样做：

```json filename=".babelrc"
{
  "presets": ["next/babel"],
  "plugins": ["@babel/plugin-proposal-do-expressions"]
}
```

## 自定义预设和插件

要添加预设/插件 **并进行自定义配置**，请像这样在 `next/babel` 预设上进行操作：

```json filename=".babelrc"
{
  "presets": [
    [
      "next/babel",
      {
        "preset-env": {},
        "transform-runtime": {},
        "styled-jsx": {},
        "class-properties": {}
      }
    ]
  ],
  "plugins": []
}
```

要了解每个配置的可用选项，请访问 Babel 的[文档](https://babeljs.io/docs/)网站。

> **须知**：
>
> - Next.js 使用 [**当前** Node.js 版本](https://github.com/nodejs/release#release-schedule) 进行服务器端编译。
> - `"preset-env"` 上的 `modules` 选项应保持为 `false`，否则 webpack 代码分割将被关闭。