---
title: Markdown 和 MDX
nav_title: MDX
description: 学习如何配置 MDX 并在你的 Next.js 应用中使用它。
---

# Markdown 和 MDX
[Markdown](https://daringfireball.net/projects/markdown/syntax) 是一种轻量级的标记语言，用于格式化文本。它允许你使用纯文本语法编写，并将其转换为结构上有效的 HTML。它通常用于在网站和博客上编写内容。

你这样写...

```md
我 **喜欢** 使用 [Next.js](https://nextjs.org/)
```

输出：

```html
<p>我 <strong>喜欢</strong> 使用 <a href="https://nextjs.org/">Next.js</a></p>
```

[MDX](https://mdxjs.com/) 是 Markdown 的超集，它允许你直接在 Markdown 文件中编写 [JSX](https://react.dev/learn/writing-markup-with-jsx)。这是一种强大的方式，可以在你的内容中添加动态交互性，并嵌入 React 组件。

Next.js 可以支持你的应用内部的本地 MDX 内容，以及在服务器上动态获取的远程 MDX 文件。Next.js 插件处理将 Markdown 和 React 组件转换为 HTML，包括支持在服务器组件中使用（应用路由中的默认设置）。

> **须知**：查看 [Portfolio Starter Kit](https://vercel.com/templates/next.js/portfolio-starter-kit) 模板，以获取一个完整的工作示例。

## 安装依赖

`@next/mdx` 包及相关包件用于配置 Next.js，以便它可以处理 Markdown 和 MDX。**它从本地文件中获取数据**，允许你直接在 `/pages` 或 `/app` 目录中创建带有 `.md` 或 `.mdx` 扩展名的页面。

安装这些包以使用 Next.js 渲染 MDX：

```bash filename="终端"
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

## 配置 `next.config.mjs`

更新项目根目录下的 `next.config.mjs` 文件，以配置它使用 MDX：

```js filename="next.config.mjs"
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置 `pageExtensions` 以包含 Markdown 和 MDX 文件
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // 可选地，在下面添加任何其他 Next.js 配置
}

const withMDX = createMDX({
  // 在此处添加 Markdown 插件，根据需要
})

// 将 MDX 配置与 Next.js 配置合并
export default withMDX(nextConfig)
```

这允许 `.md` 和 `.mdx` 文件在你的应用中充当页面、路由或导入。

## 添加 `mdx-components.tsx` 文件

在项目的根目录创建一个 `mdx-components.tsx`（或 `.js`）文件，以定义全局 MDX 组件。例如，在 `pages` 或 `app` 的同一级别，或者如果适用的话，在 `src` 内部。

```tsx filename="mdx-components.tsx" switcher
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

```js filename="mdx-components.js" switcher
export function useMDXComponents(components) {
  return {
    ...components,
  }
}
```

> **须知**：
>
> - `mdx-components.tsx` **必需** 用于在应用路由中使用 `@next/mdx`，没有它将无法工作。
> - 了解更多关于 [`mdx-components.tsx` 文件约定](/docs/app/api-reference/file-conventions/mdx-components)。
> - 学习如何 [使用自定义样式和组件](#using-custom-styles-and-components)。
## 渲染 MDX

您可以使用 Next.js 的基于文件的路由或将 MDX 文件导入到其他页面中来渲染 MDX。

### 使用基于文件的路由

当使用基于文件的路由时，您可以像使用任何其他页面一样使用 MDX 页面。

<AppOnly>

在 App Router 应用程序中，包括能够使用 [元数据](/docs/app/building-your-application/optimizing/metadata)。

在 `/app` 目录内创建一个新的 MDX 页面：

```txt
  我的项目
  ├── app
  │   └── mdx-page
  │       └── page.(mdx/md)
  |── mdx-components.(tsx/js)
  └── package.json
```

</AppOnly>

<PagesOnly>

在 `/pages` 目录内创建一个新的 MDX 页面：

```txt
  我的项目
  |── mdx-components.(tsx/js)
  ├── pages
  │   └── mdx-page.(mdx/md)
  └── package.json
```

</PagesOnly>

您可以在这些文件中使用 MDX，甚至可以直接在您的 MDX 页面中导入 React 组件：

```mdx
import { MyComponent } from 'my-component'

# 欢迎来到我的 MDX 页面！

这是一些 **粗体** 和 _斜体_ 文本。

这是 markdown 中的列表：

- 一
- 二
- 三

查看我的 React 组件：

<MyComponent />
```

导航到 `/mdx-page` 路由应该会显示您渲染的 MDX 页面。

### 使用导入

<AppOnly>

在 `/app` 目录内创建一个新页面，并在您喜欢的任何位置创建一个 MDX 文件：

```txt
  我的项目
  ├── app
  │   └── mdx-page
  │       └── page.(tsx/js)
  ├── markdown
  │   └── welcome.(mdx/md)
  |── mdx-components.(tsx/js)
  └── package.json
```

</AppOnly>

<PagesOnly>

在 `/pages` 目录内创建一个新页面，并在您喜欢的任何位置创建一个 MDX 文件：

```txt
  我的项目
  ├── pages
  │   └── mdx-page.(tsx/js)
  ├── markdown
  │   └── welcome.(mdx/md)
  |── mdx-components.(tsx/js)
  └── package.json
```

</PagesOnly>

您可以在这些文件中使用 MDX，甚至可以直接在您的 MDX 页面中导入 React 组件：

```mdx filename="markdown/welcome.mdx" switcher
import { MyComponent } from 'my-component'

# 欢迎来到我的 MDX 页面！

这是一些 **粗体** 和 _斜体_ 文本。

这是 markdown 中的列表：

- 一
- 二
- 三

查看我的 React 组件：

<MyComponent />
```

在页面内导入 MDX 文件以显示内容：

<AppOnly>

```tsx filename="app/mdx-page/page.tsx" switcher
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

```jsx filename="app/mdx-page/page.js" switcher
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

</AppOnly>

<PagesOnly>

```tsx filename="pages/mdx-page.tsx" switcher
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

```jsx filename="pages/mdx-page.js" switcher
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

</PagesOnly>

导航到 `/mdx-page` 路由应该会显示您渲染的 MDX 页面。

## 使用自定义样式和组件

Markdown 在渲染时会映射到原生 HTML 元素。例如，编写以下 markdown：

```md

## 这是一个标题

这是 markdown 中的列表：

- 一
- 二
- 三
```

生成以下 HTML：

```html
<h2>这是一个标题</h2>

<p>这是 markdown 中的列表：</p>

<ul>
  <li>一</li>
  <li>二</li>
  <li>三</li>
</ul>
```

要为您的 markdown 设置样式，您可以提供映射到生成的 HTML 元素的自定义组件。样式和组件可以全局、本地实现，也可以使用共享布局。
### 全局样式和组件

在 `mdx-components.tsx` 中添加样式和组件将影响应用程序中所有的 MDX 文件。

```tsx filename="mdx-components.tsx" switcher
import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'

// 此文件允许您提供自定义的 React 组件
// 以在 MDX 文件中使用。您可以导入和使用任何
// 您想要的 React 组件，包括内联样式，
// 来自其他库的组件等。

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 允许自定义内置组件，例如添加样式。
    h1: ({ children }) => (
      <h1 style={{ color: 'red', fontSize: '48px' }}>{children}</h1>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    ...components,
  }
}
```

```js filename="mdx-components.js" switcher
import Image from 'next/image'

// 此文件允许您提供自定义的 React 组件
// 以在 MDX 文件中使用。您可以导入和使用任何
// 您想要的 React 组件，包括内联样式，
// 来自其他库的组件等。

export function useMDXComponents(components) {
  return {
    // 允许自定义内置组件，例如添加样式。
    h1: ({ children }) => (
      <h1 style={{ color: 'red', fontSize: '48px' }}>{children}</h1>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...props}
      />
    ),
    ...components,
  }
}
```

### 局部样式和组件

您可以通过将它们传递给导入的 MDX 组件来为特定页面应用局部样式和组件。这些将与 [全局样式和组件](#全局样式和组件) 合并并覆盖。

<AppOnly>

```tsx filename="app/mdx-page/page.tsx" switcher
import Welcome from '@/markdown/welcome.mdx'

function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}

const overrideComponents = {
  h1: CustomH1,
}

export default function Page() {
  return <Welcome components={overrideComponents} />
}
```

```jsx filename="app/mdx-page/page.js" switcher
import Welcome from '@/markdown/welcome.mdx'

function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}

const overrideComponents = {
  h1: CustomH1,
}

export default function Page() {
  return <Welcome components={overrideComponents} />
}
```

</AppOnly>

<PagesOnly>

```tsx filename="pages/mdx-page.tsx" switcher
import Welcome from '@/markdown/welcome.mdx'

function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}

const overrideComponents = {
  h1: CustomH1,
}

export default function Page() {
  return <Welcome components={overrideComponents} />
}
```

```jsx filename="pages/mdx-page.js" switcher
import Welcome from '@/markdown/welcome.mdx'

function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}

const overrideComponents = {
  h1: CustomH1,
}

export default function Page() {
  return <Welcome components={overrideComponents} />
}
```

</PagesOnly>
### 共享布局

<AppOnly>

要在MDX页面之间共享布局，可以使用应用路由的[内置布局支持](/docs/app/building-your-application/routing/layouts-and-templates#layouts)。

```tsx filename="app/mdx-page/layout.tsx" switcher
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // 在此处创建任何共享布局或样式
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

```jsx filename="app/mdx-page/layout.js" switcher
export default function MdxLayout({ children }) {
  // 在此处创建任何共享布局或样式
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

</AppOnly>

<PagesOnly>

要围绕MDX页面共享布局，创建一个布局组件：

```tsx filename="components/mdx-layout.tsx" switcher
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // 在此处创建任何共享布局或样式
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

```jsx filename="components/mdx-layout.js" switcher
export default function MdxLayout({ children }) {
  // 在此处创建任何共享布局或样式
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

然后，将布局组件导入到MDX页面中，将MDX内容包装在布局中，并导出它：

```mdx
import MdxLayout from '../components/mdx-layout'

# 欢迎来到我的MDX页面！

export default function MDXPage({ children }) {
  return <MdxLayout>{children}</MdxLayout>

}
```

</PagesOnly>

须知：在上述代码示例中，`tsx`和`jsx`文件的扩展名表明它们是使用TypeScript或JavaScript编写的React组件。`switcher`属性可能是用于在不同代码版本之间切换的标记。`filename`属性提供了文件的名称和位置。`children`属性是一个React节点，表示子组件或元素，它们将被渲染在布局组件内部。`style`属性用于设置布局的样式，这里设置文本颜色为蓝色。
### 使用 Tailwind typography 插件

如果您正在使用 [Tailwind](https://tailwindcss.com) 来为您的应用程序设置样式，使用 [`@tailwindcss/typography` 插件](https://tailwindcss.com/docs/plugins#typography) 将允许您在 Markdown 文件中重用您的 Tailwind 配置和样式。

该插件添加了一组 `prose` 类，可以用来为来自 Markdown 等来源的内容块添加排版样式。

[安装 Tailwind typography](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#installation) 并使用 [共享布局](#shared-layouts) 来添加您想要的 `prose`。

<AppOnly>

```tsx filename="app/mdx-page/layout.tsx" switcher
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // 在此处创建任何共享布局或样式
  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      {children}
    </div>
  )
}
```

```jsx filename="app/mdx-page/layout.js" switcher
export default function MdxLayout({ children }) {
  // 在此处创建任何共享布局或样式
  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      {children}
    </div>
  )
}
```

</AppOnly>

<PagesOnly>

要围绕 MDX 页面共享布局，请创建一个布局组件：

```tsx filename="components/mdx-layout.tsx" switcher
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // 在此处创建任何共享布局或样式
  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      {children}
    </div>
  )
}
```

```jsx filename="components/mdx-layout.js" switcher
export default function MdxLayout({ children }) {
  // 在此处创建任何共享布局或样式
  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      {children}
    </div>
  )
}
```

然后，将布局组件导入到 MDX 页面中，将 MDX 内容包装在布局中，并导出它：

```mdx
import MdxLayout from '../components/mdx-layout'

# 欢迎来到我的 MDX 页面！

export default function MDXPage({ children }) {
  return <MdxLayout>{children}</MdxLayout>

}
```

</PagesOnly >

须知：在使用 Tailwind typography 插件时，确保您的项目配置正确，以便插件能够正确地应用样式。
## Frontmatter

Frontmatter 是一种类似于 YAML 的键值对配对，可以用来存储关于页面的数据。`@next/mdx` 默认**不支持**frontmatter，尽管有许多方法可以将 frontmatter 添加到您的 MDX 内容中，例如：

- [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter)
- [remark-mdx-frontmatter](https://github.com/remcohaszing/remark-mdx-frontmatter)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)

`@next/mdx` **允许**您像使用任何其他 JavaScript 组件一样使用导出：

```mdx filename="content/blog-post.mdx" switcher
export const metadata = {
  author: 'John Doe',
}

# 博客文章
```

现在可以在 MDX 文件外部引用元数据：

<AppOnly>

```tsx filename="app/blog/page.tsx" switcher
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log('metadata': metadata)
  //=> { author: 'John Doe' }
  return <BlogPost />
}
```

```jsx filename="app/blog/page.js" switcher
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log('metadata': metadata)
  //=> { author: 'John Doe' }
  return <BlogPost />
}
```

</AppOnly>

<PagesOnly>

```tsx filename="pages/blog.tsx" switcher
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log('metadata': metadata)
  //=> { author: 'John Doe' }
  return <BlogPost />
}
```

```jsx filename="pages/blog.js" switcher
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log('metadata': metadata)
  //=> { author: 'John Doe' }
  return <BlogPost />
}
```

</PagesOnly>

一个常见的用例是当您想要迭代一个 MDX 集合并提取数据时。例如，从所有博客文章创建一个博客索引页面。您可以使用像 [Node 的 `fs` 模块](https://nodejs.org/api/fs.html) 或 [globby](https://www.npmjs.com/package/globby) 这样的包来读取帖子目录并提取元数据。

> **须知**：
>
> - 使用 `fs`、`globby` 等只能在服务器端使用。
> - 查看 [Portfolio Starter Kit](https://vercel.com/templates/next.js/portfolio-starter-kit) 模板以获取完整的工作示例。

## Remark 和 Rehype 插件

您可以选择性地提供 `remark` 和 `rehype` 插件来转换 MDX 内容。

例如，您可以使用 `remark-gfm` 来支持 GitHub 风格的 Markdown。

由于 `remark` 和 `rehype` 生态系统仅支持 ESM，您需要使用 `next.config.mjs` 作为配置文件。

```js filename="next.config.mjs"
import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置 `pageExtensions` 以包含 MDX 文件
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // 可选地，在下面添加任何其他 Next.js 配置
}

const withMDX = createMDX({
  // 在此处添加 Markdown 插件，根据需要
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

// 将 MDX 和 Next.js 配置相互包装
export default withMDX(nextConfig)
```
## 远程 MDX

如果您的 MDX 文件或内容位于**其他地方**，您可以在服务器上动态获取它。这对于存储在单独的本地文件夹、CMS、数据库或任何其他地方的内容非常有用。一个流行的社区包是 [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote#react-server-components-rsc--nextjs-app-directory-support)。

> **须知**：请谨慎操作。MDX 编译成 JavaScript 并在服务器上执行。您应该只从可信来源获取 MDX 内容，否则这可能导致远程代码执行（RCE）。

以下示例使用 `next-mdx-remote`：

<AppOnly>

```tsx filename="app/mdx-page-remote/page.tsx" switcher
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function RemoteMdxPage() {
  // MDX 文本 - 可以来自本地文件、数据库、CMS、fetch，任何地方...
  const res = await fetch('https://...')
  const markdown = await res.text()
  return <MDXRemote source={markdown} />
}
```

```jsx filename="app/mdx-page-remote/page.js" switcher
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function RemoteMdxPage() {
  // MDX 文本 - 可以来自本地文件、数据库、CMS、fetch，任何地方...
  const res = await fetch('https://...')
  const markdown = await res.text()
  return <MDXRemote source={markdown} />
}
```

</AppOnly>

<PagesOnly>

```tsx filename="pages/mdx-page-remote.tsx" switcher
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

interface Props {
  mdxSource: MDXRemoteSerializeResult
}

export default function RemoteMdxPage({ mdxSource }: Props) {
  return <MDXRemote {...mdxSource} />
}

export async function getStaticProps() {
  // MDX 文本 - 可以来自本地文件、数据库、CMS、fetch，任何地方...
  const res = await fetch('https:...')
  const mdxText = await res.text()
  const mdxSource = await serialize(mdxText)
  return { props: { mdxSource } }
}
```

```jsx filename="pages/mdx-page-remote.js" switcher
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'

export default function RemoteMdxPage({ mdxSource }) {
  return <MDXRemote {...mdxSource} />
}

export async function getStaticProps() {
  // MDX 文本 - 可以来自本地文件、数据库、CMS、fetch，任何地方...
  const res = await fetch('https:...')
  const mdxText = await res.text()
  const mdxSource = await serialize(mdxText)
  return { props: { mdxSource } }
}
```

</PagesOnly>

访问 `/mdx-page-remote` 路由应该会显示您渲染的 MDX。
## 深入探索：如何将 Markdown 转换为 HTML？

React 本身不理解 Markdown。Markdown 纯文本首先需要被转换为 HTML。这可以通过 `remark` 和 `rehype` 来实现。

`remark` 是围绕 Markdown 的工具生态系统。`rehype` 也是一样，但它是针对 HTML 的。例如，以下代码片段将 Markdown 转换为 HTML：

```js
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

main()

async function main() {
  const file = await unified()
    .use(remarkParse) // 转换为 Markdown AST
    .use(remarkRehype) // 转换为 HTML AST
    .use(rehypeSanitize) // 清理 HTML 输入
    .use(rehypeStringify) // 将 AST 转换为序列化 HTML
    .process('Hello, Next.js!')

  console.log(String(file)) // <p>Hello, Next.js!</p>
}
```

`remark` 和 `rehype` 生态系统包含用于 [语法高亮](https://github.com/atomiks/rehype-pretty-code)、[链接标题](https://github.com/rehypejs/rehype-autolink-headings)、[生成目录](https://github.com/remarkjs/remark-toc) 等的插件。

当使用上面展示的 `@next/mdx` 时，你**不需要**直接使用 `remark` 或 `rehype`，因为这些操作已经为你处理了。我们在这里描述它是为了更深入地理解 `@next/mdx` 包在底层做了什么。

## 使用基于 Rust 的 MDX 编译器（实验性）

Next.js 支持一个用 Rust 编写的新 MDX 编译器。这个编译器仍然是实验性的，不建议在生产环境中使用。要使用这个新编译器，你需要在 `next.config.js` 中配置它，当你将它传递给 `withMDX` 时：

```js filename="next.config.js"
module.exports = withMDX({
  experimental: {
    mdxRs: true,
  },
})
```

`mdxRs` 也接受一个对象来配置如何转换 mdx 文件。

```js filename="next.config.js"
module.exports = withMDX({
  experimental: {
    mdxRs: {
      jsxRuntime?: string            // 自定义 jsx 运行时
      jsxImportSource?: string       // 自定义 jsx 导入源，
      mdxType?: 'gfm' | 'commonmark' // 配置将使用哪种 mdx 语法进行解析和转换
    },
  },
})
```

## 有帮助的链接

- [MDX](https://mdxjs.com)
- [`@next/mdx`](https://www.npmjs.com/package/@next/mdx)
- [remark](https://github.com/remarkjs/remark)
- [rehype](https://github.com/rehypejs/rehype)
- [Markdoc](https://markdoc.dev/docs/nextjs)