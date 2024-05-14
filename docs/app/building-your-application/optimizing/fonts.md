---
title: 字体优化
nav_title: 字体
description: 使用内置的 `next/font` 加载器优化您的应用程序的网络字体。
related:
  title: API 参考
  description: 了解更多关于 next/font API 的信息。
  links:
    - app/api-reference/components/font
---

{/* 此文档的内容在应用和页面路由之间共享。您可以使用 `<PagesOnly>Content</PagesOnly>` 组件添加特定于页面路由的内容。任何共享的内容都不应被包装在组件中。 */}

[**`next/font`**](/docs/app/api-reference/components/font) 将自动优化您的字体（包括自定义字体），并消除外部网络请求，以提高隐私和性能。

> **🎥 观看：** 了解更多关于使用 `next/font` 的信息 → [YouTube (6 分钟)](https://www.youtube.com/watch?v=L8_98i_bMMA)。

`next/font` 包括**内置的自动自托管**功能，适用于**任何**字体文件。这意味着您可以利用底层 CSS `size-adjust` 属性，以零布局偏移的方式最优地加载网络字体。

这个新的字体系统还允许您方便地使用所有 Google 字体，同时考虑性能和隐私。CSS 和字体文件在构建时下载，并与您的其他静态资源一起自托管。**浏览器不会向 Google 发送请求。**

## Google 字体

自动自托管任何 Google 字体。字体包含在部署中，并从与您的部署相同的域提供。**浏览器不会向 Google 发送请求。**

通过从 `next/font/google` 作为函数导入您想要使用的字体来开始。我们建议使用 [可变字体](https://fonts.google.com/variablefonts) 以获得最佳性能和灵活性。

<AppOnly>

```tsx filename="app/layout.tsx" switcher
import { Inter } from 'next/font/google'

// 如果加载可变字体，则不需要指定字体粗细
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { Inter } from 'next/font/google'

// 如果加载可变字体，则不需要指定字体粗细
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

如果您不能使用可变字体，您将**需要指定一个粗细**：

```tsx filename="app/layout.tsx" switcher
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

</AppOnly>

<PagesOnly>

要在所有页面中使用字体，请将其添加到 `/pages` 下的 [`_app.js` 文件](/docs/pages/building-your-application/routing/custom-app)，如下所示：

```jsx filename="pages/_app.js"
import { Inter } from 'next/font/google'

// 如果加载可变字体，则不需要指定字体粗细
const inter = Inter({ subsets: ['latin'] })

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

如果您不能使用可变字体，您将**需要指定一个粗细**：

```jsx filename="pages/_app.js"
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={roboto.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

</PagesOnly>```
## 导入 Google 字体

`next/font/google` 提供了一个 API，允许你导入 Google Fonts 字体。以下是如何使用它：

### 基本用法

```jsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <p className={inter.className}>
      Hello World
    </p>
  )
}
```

在上面的示例中，我们导入了 `Inter` 字体，并指定了 `latin` 子集。然后，我们将生成的 `className` 应用到 `<p>` 元素上。

### 指定多个权重和样式

你可以通过使用数组来指定多个权重和/或样式：

```jsx
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})
```

> **小提示**：对于包含多个单词的字体名称，请使用下划线（\_）进行分隔。例如，`Roboto Mono` 应该被导入为 `Roboto_Mono`。

### 在 `<head>` 中应用字体

你还可以在不使用包装器和 `className` 的情况下，通过以下方式将字体注入到 `<head>` 中：

```jsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
```

### 单页使用

要在单个页面上使用字体，请按照以下示例将其添加到特定页面：

```jsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={inter.className}>
      <p>Hello World</p>
    </div>
  )
}
```

### 指定子集

Google 字体会自动进行[子集划分](https://fonts.google.com/knowledge/glossary/subsetting)。这减少了字体文件的大小并提高了性能。你需要定义你想要预加载的子集。如果 [`preload`](/docs/app/api-reference/components/font#preload) 为 `true` 而没有指定任何子集，将会出现警告。

这可以通过将其添加到函数调用中来完成：

```tsx
const inter = Inter({ subsets: ['latin'] })
```

查看 [字体 API 参考](/docs/app/api-reference/components/font) 以获取更多信息。

### 使用多个字体

你可以在你的应用程序中导入和使用多个字体。你可以选择以下两种方法之一。

第一种方法是创建一个实用函数，该函数导出字体，导入它，并在需要的地方应用其 `className`。这确保了只有在渲染时才会预加载字体：

```ts
import { Inter, Roboto_Mono } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})
```

```js
import { Inter, Roboto_Mono } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})
```

```tsx
import { inter } from './fonts'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```jsx
import { inter } from './fonts'

export default function Layout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```tsx
import { roboto_mono } from './fonts'

export default function Page() {
  return (
    <>
      <h1 className={roboto_mono.className}>我的页面</h1>
    </>
  )
}
```

```jsx
import { roboto_mono } from './fonts'

export default function Page() {
  return (
    <>
      <h1 className={roboto_mono.className}>我的页面</h1>
    </>
  )
}
```

```一级标题：使用 Next.js 字体

在上面的例子中，`Inter` 字体将全局应用，而 `Roboto Mono` 可以根据需要导入和应用。

或者，你可以创建一个 [CSS 变量](/docs/app/api-reference/components/font#variable) 并用你首选的 CSS 解决方案使用它：

```tsx filename="app/layout.tsx" switcher
import { Inter, Roboto_Mono } from 'next/font/google'
import styles from './global.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <h1>My App</h1>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <h1>My App</h1>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```css filename="app/global.css"
html {
  font-family: var(--font-inter);
}

h1 {
  font-family: var(--font-roboto-mono);
}
```

在上面的例子中，`Inter` 将全局应用，任何 `<h1>` 标签将使用 `Roboto Mono` 进行样式设置。

> **须知**：谨慎使用多种字体，因为每种新字体都是客户端必须下载的额外资源。

## 本地字体

导入 `next/font/local` 并指定你的本地字体文件的 `src`。我们建议使用 [可变字体](https://fonts.google.com/variablefonts) 以获得最佳性能和灵活性。

```tsx filename="app/layout.tsx" switcher
import localFont from 'next/font/local'

// 字体文件可以与 `app` 一起放置
const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import localFont from 'next/font/local'

// 字体文件可以与 `app` 一起放置
const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

<PagesOnly>

```jsx filename="pages/_app.js"
import localFont from 'next/font/local'

// 字体文件可以与 `pages` 一起放置
const myFont = localFont({ src: './my-font.woff2' })

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={myFont.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

</PagesOnly>

如果你想为单个字体家族使用多个文件，`src` 可以是一个数组：

```js
const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})
```

查看 [字体 API 参考](/docs/app/api-reference/components/font) 以获取更多信息。

## 与 Tailwind CSS 一起使用# 使用 `next/font` 与 Tailwind CSS

通过 CSS 变量，可以使用 `next/font` 与 [Tailwind CSS](https://tailwindcss.com/) 集成。

以下示例中，我们使用了来自 `next/font/google` 的 `Inter` 字体（您可以使用 Google 或本地字体中的任何字体）。使用 `variable` 选项加载您的字体，以定义您的 CSS 变量名称并将其分配给 `inter`。然后，使用 `inter.variable` 将 CSS 变量添加到您的 HTML 文档中。

<AppOnly>

```tsx filename="app/layout.tsx" switcher
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

</AppOnly>

<PagesOnly>

```jsx filename="pages/_app.js"
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  )
}
```

</PagesOnly>

最后，将 CSS 变量添加到您的 [Tailwind CSS 配置](/docs/app/building-your-application/styling/tailwind-css#configuring-tailwind)：

```js filename="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [],
}
```

现在，您可以使用 `font-sans` 和 `font-mono` 实用类将字体应用到您的元素上。

## 预加载

<AppOnly>
当在您网站的页面上调用字体函数时，它不是全局可用的，也不会在所有路由上预加载。相反，字体仅根据使用的文件类型预加载在相关路由上：

- 如果它是 [唯一页面](/docs/app/building-your-application/routing/pages)，它将在该页面的唯一路由上预加载。
- 如果它是 [布局](/docs/app/building-your-application/routing/layouts-and-templates#layouts)，它将在布局包装的所有路由上预加载。
- 如果它是 [根布局](/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)，它将在所有路由上预加载。

</AppOnly>

<PagesOnly>

当在您网站的页面上调用字体函数时，它不是全局可用的，也不会在所有路由上预加载。相反，字体仅根据使用的文件类型预加载在相关路由上：

- 如果它是 [唯一页面](/docs/pages/building-your-application/routing/pages-and-layouts)，它将在该页面的唯一路由上预加载。
- 如果它在 [自定义 App](/docs/pages/building-your-application/routing/custom-app) 中，它将在 `/pages` 下的所有站点路由上预加载。

</PagesOnly>

## 重用字体

每次调用 `localFont` 或 Google 字体函数时，该字体都会作为您应用程序中的一个实例进行托管。因此，如果在多个文件中加载相同的字体函数，将会托管该字体的多个实例。在这种情况下，建议# 使用自定义字体

要在您的应用程序中使用自定义字体，您需要执行以下操作：

- 在一个共享文件中调用字体加载器函数
- 将其导出为常量
- 在您想要使用此字体的每个文件中导入该常量

以下是如何实现的示例：

1. 在一个名为 `font.js` 的共享文件中，调用 `Font.loadAsync` 函数来加载字体：

```javascript
// font.js
export const loadFonts = () => {
  return Font.loadAsync({
    'Roboto': require('./Roboto.ttf'),
    'Roboto_medium': require('./Roboto_medium.ttf'),
  });
};
```

2. 在 `App.js` 或您想要使用字体的任何其他文件中，导入 `loadFonts` 常量：

```javascript
// App.js
import { loadFonts } from './font';

// 在您的组件的 `componentDidMount` 生命周期方法中调用 `loadFonts`
componentDidMount() {
  loadFonts();
}
```

3. 在您的文本组件中，使用 `fontFamily` 属性指定字体名称：

```javascript
<Text style={{ fontFamily: 'Roboto' }}>这段文字使用了自定义字体。</Text>
```

通过这种方式，您可以在应用程序中使用自定义字体。只需确保字体文件位于正确的路径下，并在 `Font.loadAsync` 调用中正确引用它们。