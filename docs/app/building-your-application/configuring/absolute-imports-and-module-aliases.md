---
title: 绝对导入和模块路径别名
description: 配置模块路径别名，允许您重新映射某些导入路径。
---
# 绝对导入和模块路径别名
<details>
  <summary>示例</summary>

- [绝对导入和别名](https://github.com/vercel/next.js/tree/canary/examples/with-absolute-imports)

</details>

Next.js 内置支持 `tsconfig.json` 和 `jsconfig.json` 文件中的 `"paths"` 和 `"baseUrl"` 选项。

这些选项允许您将项目目录别名为绝对路径，使导入模块更加容易。例如：

```tsx
// 之前
import { Button } from '../../../components/button'

// 之后
import { Button } from '@/components/button'
```

> **须知**：`create-next-app` 会提示您为您配置这些选项。

## 绝对导入

`baseUrl` 配置选项允许您直接从项目的根目录导入。

此配置的一个示例：

```json filename="tsconfig.json 或 jsconfig.json"
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

```tsx filename="components/button.tsx" switcher
export default function Button() {
  return <button>点击我</button>
}
```

```jsx filename="components/button.js" switcher
export default function Button() {
  return <button>点击我</button>
}
```

```tsx filename="app/page.tsx" switcher
import Button from 'components/button'

export default function HomePage() {
  return (
    <>
      <h1>你好，世界</h1>
      <Button />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
import Button from 'components/button'

export default function HomePage() {
  return (
    <>
      <h1>你好，世界</h1>
      <Button />
    </>
  )
}
```

## 模块别名

除了配置 `baseUrl` 路径外，您还可以使用 `"paths"` 选项来“别名”模块路径。

例如，以下配置将 `@/components/*` 映射到 `components/*`：

```json filename="tsconfig.json 或 jsconfig.json"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

```tsx filename="components/button.tsx" switcher
export default function Button() {
  return <button>点击我</button>
}
```

```jsx filename="components/button.js" switcher
export default function Button() {
  return <button>点击我</button>
}
```

```tsx filename="app/page.tsx" switcher
import Button from '@/components/button'

export default function HomePage() {
  return (
    <>
      <h1>你好，世界</h1>
      <Button />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
import Button from '@/components/button'

export default function HomePage() {
  return (
    <>
      <h1>你好，世界</h1>
      <Button />
    </>
  )
}
```

每个 `"paths"` 都是相对于 `baseUrl` 位置的。例如：

```json
// tsconfig.json 或 jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

```jsx
// pages/index.js
import Button from '@/components/button'
import '@/styles/styles.css'
import Helper from 'utils/helper'

export default function HomePage() {
  return (
    <Helper>
      <h1>你好，世界</h1>
      <Button />
    </Helper>
  )
}
```