---
title: generateViewport
description: generateViewport 函数的 API 参考。
related:
  title: Next Steps
  description: 查看所有元数据 API 选项。
  links:
    - app/api-reference/file-conventions/metadata
    - app/building-your-application/optimizing/metadata
---

您可以使用静态的 `viewport` 对象或动态的 `generateViewport` 函数来自定义页面的初始视口。

> **须知**：
>
> - `viewport` 对象和 `generateViewport` 函数的导出在 **仅支持在服务器组件中**。
> - 您不能从同一路由段导出 `viewport` 对象和 `generateViewport` 函数。
> - 如果您是从迁移 `metadata` 导出过来的，可以使用 [metadata-to-viewport-export codemod](/docs/app/building-your-application/upgrading/codemods#metadata-to-viewport-export) 来更新您的更改。

## `viewport` 对象

要定义视口选项，从 `layout.jsx` 或 `page.jsx` 文件中导出一个 `viewport` 对象。

```tsx filename="layout.tsx | page.tsx" switcher
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}

export default function Page() {}
```

```jsx filename="layout.jsx | page.jsx" switcher
export const viewport = {
  themeColor: 'black',
}

export default function Page() {}
```

## `generateViewport` 函数

`generateViewport` 应该返回一个包含一个或多个视口字段的 [`Viewport` 对象](#viewport-fields)。

```tsx filename="layout.tsx | page.tsx" switcher
export function generateViewport({ params }) {
  return {
    themeColor: '...',
  }
}
```

```jsx filename="layout.js | page.js" switcher
export function generateViewport({ params }) {
  return {
    themeColor: '...',
  }
}
```

> **须知**：
>
> - 如果视口不依赖于运行时信息，应该使用静态的 [`viewport` 对象](#the-viewport-object) 而不是 `generateViewport`。
## 视口字段

### `themeColor`

了解更多关于 [`theme-color`](https://developer.mozilla.org/docs/Web/HTML/Element/meta/name/theme-color)。

**简单的主题颜色**

```tsx filename="layout.tsx | page.tsx" switcher
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}
```

```jsx filename="layout.jsx | page.jsx" switcher
export const viewport = {
  themeColor: 'black',
}
```

```html filename="<head> output" hideLineNumbers
<meta name="theme-color" content="black" />
```

**带媒体属性的主题颜色**

```tsx filename="layout.tsx | page.tsx" switcher
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
```

```jsx filename="layout.jsx | page.jsx" switcher
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
```

```html filename="<head> output" hideLineNumbers
<meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
```

### `width`, `initialScale`, `maximumScale` 和 `userScalable`

> **须知**：`视口` meta 标签会自动设置，通常不需要手动配置，因为默认设置已经足够。但是，为了完整性，这里提供了相关信息。

```tsx filename="layout.tsx | page.tsx" switcher
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // 也支持较少使用的
  // interactiveWidget: 'resizes-visual',
}
```

```jsx filename="layout.jsx | page.jsx" switcher
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // 也支持较少使用的
  // interactiveWidget: 'resizes-visual',
}
```

```html filename="<head> output" hideLineNumbers
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
/>
```

### `colorScheme`

了解更多关于 [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#:~:text=color%2Dscheme%3A%20specifies,of%20the%20following%3A)。

```tsx filename="layout.tsx | page.tsx" switcher
import type { Viewport } from 'next'

export const viewport: Viewport = {
  colorScheme: 'dark',
}
```

```jsx filename="layout.jsx | page.jsx" switcher
export const viewport = {
  colorScheme: 'dark',
}
```

```html filename="<head> output" hideLineNumbers
<meta name="color-scheme" content="dark" />
```

## 类型

你可以通过使用 `Viewport` 类型为你的视口对象添加类型安全性。如果你在 IDE 中使用了 [内置的 TypeScript 插件](/docs/app/building-your-application/configuring/typescript)，你不需要手动添加类型，但你仍然可以明确地添加它。

### `viewport` 对象

```tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}
```

### `generateViewport` 函数

#### 普通函数

```tsx
import type { Viewport } from 'next'

export function generateViewport(): Viewport {
  return {
    themeColor: 'black',
  }
}
```

#### 带有 segment props 的函数

```tsx
import type { Viewport } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateViewport({ params, searchParams }: Props): Viewport {
  return {
    themeColor: 'black',
  }
}

export default function Page({ params, searchParams }: Props) {}
```

#### JavaScript 项目

对于 JavaScript 
## 版本历史

| 版本   | 变更                                       |
| --------- | --------------------------------------------- |
| `v14.0.0` | 引入了 `viewport` 和 `generateViewport`。 |