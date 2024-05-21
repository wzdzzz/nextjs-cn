# 文档贡献指南

欢迎来到Next.js文档贡献指南！我们很高兴你来到这里。

本页面提供了如何编辑Next.js文档的说明。我们的目标是确保社区中的每个人都感到有能力贡献和改进我们的文档。

## 为什么要贡献？

开源工作永无止境，文档工作也是如此。为文档贡献是初学者参与开源的好方式，也是经验丰富的开发人员澄清更复杂主题的同时与社区分享知识的方式。

通过为Next.js文档贡献，你正在帮助我们为所有开发人员构建更强大的学习资源。无论你发现了一个错别字、一个令人困惑的部分，还是你意识到缺少某个特定主题，你的贡献都是受欢迎和受赞赏的。

## 如何贡献

文档内容可以在[Next.js仓库](https://github.com/vercel/next.js/tree/canary/docs)中找到。要贡献，你可以直接在GitHub上编辑文件，或者克隆仓库并在本地编辑文件。

### GitHub工作流程

如果你对GitHub不熟悉，我们建议你阅读[GitHub开源指南](https://opensource.guide/how-to-contribute/#opening-a-pull-request)，了解如何分叉仓库、创建分支和提交拉取请求。

> **须知**：底层文档代码位于一个私有代码库中，该代码库与Next.js公共仓库同步。这意味着你无法在本地预览文档。然而，在合并拉取请求后，你将在[nextjs.org](https://nextjs.org/docs)上看到你的更改。

### 编写MDX

文档是用[MDX](https://mdxjs.com/)编写的，这是一种支持JSX语法的markdown格式。这允许我们在文档中嵌入React组件。有关markdown语法的快速概览，请参见[GitHub Markdown指南](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)。

### VSCode

#### 本地预览更改

VSCode具有内置的markdown预览器，你可以使用它在本地查看你的编辑。要为MDX文件启用预览器，你需要在用户设置中添加一个配置选项。

打开命令面板（在Mac上为`⌘ + ⇧ + P`，在Windows上为`Ctrl + Shift + P`），并搜索`Preferences: Open User Settings (JSON)`。

然后，将以下行添加到你的`settings.json`文件中：

```json filename="settings.json"
{
  "files.associations": {
    "*.mdx": "markdown"
  }
}
```

接下来，再次打开命令面板，并搜索`Markdown: Preview File`或`Markdown: Open Preview to the Side`。这将打开一个预览窗口，你可以在其中查看你格式化后的更改。

#### 扩展

我们还推荐VSCode用户使用以下扩展：

- [MDX](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx)：MDX的Intellisense和语法高亮。
- [Grammarly](https://marketplace.visualstudio.com/items?itemName=znck.grammarly)：语法和拼写检查器。
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)：在保存时格式化MDX文件。

### 审核流程

一旦你提交了你的贡献，Next.js或开发体验团队将审查你的更改，提供反馈，并在准备好时合并拉取请求。

如果你有任何问题或需要在你的PR评论中进一步的帮助，请告诉我们。感谢你对Next.js文档的贡献，并成为我们社区的一部分！

> **提示**：在提交你的PR之前运行`pnpm prettier-fix`来运行Prettier。
# 文件结构

文档使用**文件系统路由**。在[`/docs`](https://github.com/vercel/next.js/tree/canary/docs)中的每个文件夹和文件都代表一个路由段。这些段用于生成URL路径、导航和面包屑。

文件结构反映了您在网站上看到的导航，并且默认情况下，导航项是按字母顺序排序的。然而，我们可以通过在文件夹或文件名前添加两位数编号（`00-`）来改变这些项的顺序。

例如，在[函数API参考](/docs/app/api-reference/functions)中，页面是按字母顺序排序的，因为这使得开发人员更容易找到特定的函数：

```txt
03-functions
├── cookies.mdx
├── draft-mode.mdx
├── fetch.mdx
└── ...
```

但在[路由部分](/docs/app/building-your-application/routing)中，文件名前缀为两位数，按照开发人员应该学习这些概念的顺序排序：

```txt
02-routing
├── 01-defining-routes.mdx
├── 02-pages-and-layouts.mdx
├── 03-linking-and-navigating.mdx
└── ...
```

要快速找到页面，您可以使用`⌘ + P`（Mac）或`Ctrl + P`（Windows）在VSCode中打开搜索栏。然后，输入您要查找的页面的slug。例如`defining-routes`

> **为什么不使用清单？**
>
> 我们考虑过使用清单文件（另一种流行的生成文档导航的方法），但我们发现清单很快就会与文件脱节。文件系统路由迫使我们思考文档的结构，感觉更符合Next.js的风格。

# 元数据

每个页面在文件顶部都有一个元数据块，由三个破折号分隔。

### 必填字段

以下是**必填**字段：

| 字段         | 描述                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| `title`       | 页面的`<h1>`标题，用于SEO和OG图片。                         |
| `description` | 页面的描述，用于`<meta name="description">`标签进行SEO。 |

```yaml filename="required-fields.mdx"
---
title: 页面标题
description: 页面描述
---
```

将页面标题限制在2-3个词（例如优化图片）和描述限制在1-2句话（例如了解如何在Next.js中优化图片）是一个好的实践。

### 可选字段

以下是**可选**字段：

| 字段       | 描述                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nav_title` | 覆盖导航中的页面标题。当页面标题太长不适合时很有用。如果没有提供，将使用`title`字段。 |
| `source`    | 将内容拉入共享页面。见[共享页面](#shared-pages)。                                                                               |
| `related`   | 文档底部的相关页面列表。这些将自动转换为卡片。见[相关链接](#related-links)。         |

```yaml filename="optional-fields.mdx"
---
nav_title: 导航项标题
source: app/building-your-application/optimizing/images
related:
  description: 查看图片组件API参考。
  links:
    - app/api-reference/components/image
---
```
# `App` 和 `Pages` 文档

由于 **App Router** 和 **Pages Router** 中的大部分功能完全不同，它们的文档分别放在不同的部分（`02-app` 和 `03-pages`）。然而，它们之间也有一些共同的功能。

### 共享页面

为了避免内容重复以及内容不同步的风险，我们使用 `source` 字段从一个页面拉取内容到另一个页面。例如，`<Link>` 组件在 **App** 和 **Pages** 中的行为几乎相同。我们不需要重复内容，而是可以从 `app/.../link.mdx` 拉取内容到 `pages/.../link.mdx`：

```mdx filename="app/.../link.mdx"
---
title: <Link>
description: <Link> 组件的 API 参考。
---

这份 API 参考将帮助您了解如何使用 Link 组件的属性和配置选项。
```

```mdx filename="pages/.../link.mdx"
---
title: <Link>
description: <Link> 组件的 API 参考。
source: app/api-reference/components/link
---

{/* 不要编辑此页面。 */}
{/* 此页面的内容是从上面的源拉取的。 */}
```

因此，我们可以在一个地方编辑内容，并在两个部分中反映出来。

### 共享内容

在共享页面中，有时可能会有特定于 **App Router** 或 **Pages Router** 的内容。例如，`<Link>` 组件有一个 `shallow` 属性，仅在 **Pages** 中可用，而在 **App** 中不可用。

为了确保内容只在正确的路由器中显示，我们可以将内容块包装在 `<AppOnly>` 或 `<PagesOnly>` 组件中：

```mdx filename="app/.../link.mdx"
这部分内容在 App 和 Pages 之间共享。

<PagesOnly>

这部分内容只会在 Pages 文档中显示。

</PagesOnly>

这部分内容在 App 和 Pages 之间共享。
```

您可能会使用这些组件来展示示例和代码块。
# Code Blocks

代码块应包含一个可复制粘贴的最小工作示例。这意味着代码应该能够在没有任何额外配置的情况下运行。

例如，如果您要展示如何使用`<Link>`组件，您应该包括`import`语句和`<Link>`组件本身。

```tsx filename="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return <Link href="/about">About</Link>
}
```

在提交之前，始终在本地运行示例。这将确保代码是最新的并且可以正常工作。

### 语言和文件名

代码块应该有一个标题，包括语言和`filename`。添加一个`filename`属性以呈现一个特殊的终端图标，帮助用户定位在哪里输入命令。例如：

````mdx filename="code-example.mdx"
```bash filename="Terminal"
npx create-next-app
```
````

文档中的大多数示例都是用`tsx`和`jsx`编写的，还有一些是用`bash`编写的。但是，您可以使用任何支持的语言，这是[完整列表](https://github.com/shikijs/shiki/blob/main/docs/languages.md#all-languages)。

编写JavaScript代码块时，我们使用以下语言和扩展名组合。

|                                | 语言   | 扩展名    |
| ------------------------------ | ------ | --------- |
| 包含JSX代码的JavaScript文件   | ```jsx | .js       |
| 不包含JSX的JavaScript文件     | ```js  | .js       |
| 包含JSX的TypeScript文件       | ```tsx | .tsx      |
| 不包含JSX的TypeScript文件     | ```ts  | .ts       |

### TS和JS切换器

添加一个语言切换器，在TypeScript和JavaScript之间切换。代码块应该是TypeScript优先，并提供JavaScript版本以适应用户。

目前，我们先后编写TS和JS示例，并使用`switcher`属性将它们链接起来：

````mdx filename="code-example.mdx"
```tsx filename="app/page.tsx" switcher

```

```jsx filename="app/page.js" switcher

```
````

> **须知**：我们计划将来自动将TypeScript代码片段编译为JavaScript。与此同时，您可以使用[transform.tools](https://transform.tools/typescript-to-javascript)。

### 行高亮

可以高亮显示代码行。当您想要引起对代码的特定部分的注意时，这非常有用。您可以通过将数字传递给`highlight`属性来高亮显示行。

**单行**：`highlight={1}`

```tsx filename="app/page.tsx" {1}
import Link from 'next/link'

export default function Page() {
  return <Link href="/about">About</Link>
}
```

**多行**：`highlight={1,3}`

```tsx filename="app/page.tsx" highlight={1,3}
import Link from 'next/link'

export default function Page() {
  return <Link href="/about">About</Link>
}
```

**行范围**：`highlight={1-5}`

```tsx filename="app/page.tsx" highlight={1-5}
import Link from 'next/link'

export default function Page() {
  return <Link href="/about">About</Link>
}
```

# Icons

以下是文档中可用的图标：

```mdx filename="mdx-icon.mdx"
<Check size={18} />
<Cross size={18} />
```

**输出：**

<Check size={18} />
<Cross size={18} />

我们不在文档中使用表情符号。

# Notes

对于重要但不关键的信息，请使用注释。注释是添加信息的好方法，不会分散用户对主要内容的注意力。

```mdx filename="notes.mdx"
> **Good to know**: This is a single line note.

> **Good to know**:
>
> - We also use this format for multi-line notes.
> - There are sometimes multiple items worth knowing or keeping in mind.
```

**输出：**

> **须知**：这是单行注释。

> **须知**：
>
> - 我们还使用这种格式进行多行注释。
> - 有时有多个项目值得了解或记住。
# Related Links

## 相关链接

相关链接通过添加到逻辑下一步的链接来指导用户的学习旅程。

- 链接将在页面主要内容下的卡片中显示。
- 对于具有子页面的页面，链接将自动生成。例如，[优化](/docs/app/building-your-application/optimizing)部分有指向其所有子页面的链接。

使用页面元数据中的`related`字段创建相关链接。

```yaml filename="example.mdx"
---
related:
  description: 学习如何快速开始使用您的第一个应用程序。
  links:
    - app/building-your-application/routing/defining-routes
    - app/building-your-application/data-fetching
    - app/api-reference/file-conventions/page
---
```

### 嵌套字段

| 字段         | 必需？ | 描述                                                                                                                  |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `title`      | 可选   | 卡片列表的标题。默认为**下一步**。                                                                                         |
| `description`| 可选   | 卡片列表的描述。                                                                                                       |
| `links`      | 必需   | 指向其他文档页面的链接列表。每个列表项应该是一个相对URL路径（不带前导斜杠）例如`app/api-reference/file-conventions/page` |

## Diagrams

## 图表

图表是解释复杂概念的好方法。我们使用[Figma](https://www.figma.com/)创建图表，遵循Vercel的设计指南。

图表目前位于我们私有Next.js站点的`/public`文件夹中。如果您想更新或添加图表，请打开一个[GitHub issue](https://github.com/vercel/next.js/issues/new?assignees=&labels=template%3A+documentation&projects=&template=4.docs_request.yml&title=Docs%3A+)与您的想法。

## Custom Components and HTML

## 自定义组件和HTML

这些是文档中可用的React组件：`<Image />` (next/image), `<PagesOnly />`, `<AppOnly />`, `<Cross />`, 和 `<Check />`。我们不允许在文档中使用除了`<details>`标签之外的原始HTML。

如果您有新组件的想法，请打开一个[GitHub issue](https://github.com/vercel/next.js/issues/new/choose)。
# Style Guide

### 页面模板

虽然我们没有严格的页面模板，但你会看到文档中反复出现的页面部分：

- **概述：** 页面的第一段应该告诉用户这个功能是什么以及它的用途。然后是最小工作示例或其API引用。
- **约定：** 如果功能有约定，应该在这里解释。
- **示例**：展示该功能如何与不同的用例一起使用。
- **API表格**：API页面应该在页面顶部有一个概述表，并有跳转到各节的链接（如果可能的话）。
- **下一步（相关链接）**：添加相关页面的链接，以指导用户的学习旅程。

根据需要随意添加这些部分。

### 页面类型

文档页面也分为两类：概念性和参考性。

- **概念性** 页面用于解释一个概念或功能。它们通常比参考页面更长，包含更多信息。在Next.js文档中，概念页面位于**构建你的应用**部分。
- **参考** 页面用于解释特定的API。它们通常更短，更专注。在Next.js文档中，参考页面位于**API参考**部分。

> **须知**：根据你正在贡献的页面，你可能需要遵循不同的声音和风格。例如，概念页面更具指导性，使用“你”这个词来称呼用户。参考页面更技术性，它们使用更多命令性的词语，如“创建、更新、接受”，并且倾向于省略“你”这个词。

### 语气

以下是一些指导方针，以保持文档的一致风格和语气：

- 写出清晰、简洁的句子。避免离题。
  - 如果你发现自己使用了很多逗号，考虑将句子拆分成多个句子或使用列表。
  - 用更简单的词替换复杂的词。例如，使用“use”而不是“utilize”。
- 注意使用“this”这个词。它可能是模糊和令人困惑的，如果不清楚，不要害怕重复句子的主语。
  - 例如，“Next.js uses React”而不是“Next.js uses this”。
- 使用主动语态而不是被动语态。主动句更容易阅读。
  - 例如，“Next.js uses React”而不是“React is used by Next.js”。如果你发现自己使用了“was”和“by”这样的词，你可能正在使用被动语态。
- 避免使用“easy”、“quick”、“simple”、“just”等词语。这是主观的，可能会让用户感到沮丧。
- 避免使用否定词，如“don't”、“can't”、“won't”等。这可能会让读者感到沮丧。
  - 例如，“你可以使用`Link`组件在页面之间创建链接”而不是“不要使用`<a>`标签在页面之间创建链接”。
- 使用第二人称（你/你的）。这更个人化，更有吸引力。
- 使用性别中立的语言。在提到受众时，使用“developers”、“users”或“readers”。
- 如果添加代码示例，请确保它们格式正确且可工作。

虽然这些指导方针不是详尽无遗的，但它们应该可以帮助你开始。如果你想深入了解技术写作，请查看[Google技术写作课程](https://developers.google.com/tech-writing/overview)。

---

感谢你对文档的贡献，成为Next.js社区的一部分！