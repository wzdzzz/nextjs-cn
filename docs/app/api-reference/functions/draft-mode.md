---
title: draftMode
description: draftMode 函数的 API 参考。
---

`draftMode` 函数允许您在 [Server Component](/docs/app/building-your-application/rendering/server-components) 内检测 [Draft Mode](/docs/app/building-your-application/configuring/draft-mode)。

```jsx filename="app/page.js"
import { draftMode } from 'next/headers'

export default function Page() {
  const { isEnabled } = draftMode()
  return (
    <main>
      <h1>我的博客文章</h1>
      <p>草稿模式当前是 {isEnabled ? '启用' : '禁用'}</p>
    </main>
  )
}
```

## 版本历史

| 版本   | 变更                 |
| --------- | ----------------------- |
| `v13.4.0` | 引入了 `draftMode`。 |