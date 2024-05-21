---
title: mdx-components.js
description: mdx-components.js 文件的 API 参考。
related:
  title: 了解更多关于 MDX 组件
  links:
    - app/building-your-application/configuring/mdx
---

`mdx-components.js|tsx` 文件是使用 [`@next/mdx` 与 App Router](/docs/app/building-your-application/configuring/mdx) 所 **必需** 的，并且没有它将无法工作。此外，您还可以使用它来 [自定义样式](/docs/app/building-your-application/configuring/mdx#using-custom-styles-and-components)。

在项目的根目录中使用文件 `mdx-components.tsx`（或 `.js`）来定义 MDX 组件。例如，与 `pages` 或 `app` 同级，或者如果适用，放在 `src` 目录内。

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

## 导出

### `useMDXComponents` 函数

该文件必须导出一个函数，可以是默认导出或命名为 `useMDXComponents`。

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

## 参数

### `components`

在定义 MDX 组件时，导出函数接受一个参数 `components`。此参数是 `MDXComponents` 的一个实例。

- 键是要覆盖的 HTML 元素的名称。
- 值是用于渲染的组件。

> **须知**：记得传递所有其他没有覆盖的组件（即 `...components`）。

## 版本历史

| 版本   | 变更              |
| --------- | -------------------- |
| `v13.1.2` | 添加了 MDX 组件 |