---
title: unstable_noStore
description: unstable_noStore 函数的 API 参考。
---

`unstable_noStore` 可用于声明式地选择退出静态渲染，并指示特定组件不应被缓存。

```jsx
import { unstable_noStore as noStore } from 'next/cache';

export default async function Component() {
  noStore();
  const result = await db.query(...);
  ...
}
```

> **须知**：
>
> - `unstable_noStore` 等同于在 `fetch` 上使用 `cache: 'no-store'`
> - 相对于 `export const dynamic = 'force-dynamic'`，更推荐使用 `unstable_noStore`，因为它更细粒度，并且可以按组件使用

- 在 [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache) 内部使用 `unstable_noStore` 不会退出静态生成。相反，它将遵循缓存配置来决定是否缓存结果。

## 使用方法

如果你不想向 `fetch` 传递额外的选项，比如 `cache: 'no-store'` 或 `next: { revalidate: 0 }`，你可以使用 `noStore()` 作为这些用例的替代。

```jsx
import { unstable_noStore as noStore } from 'next/cache';

export default async function Component() {
  noStore();
  const result = await db.query(...);
  ...
}
```

## 版本历史

| 版本   | 变更                        |
| --------- | ------------------------------ |
| `v14.0.0` | 引入了 `unstable_noStore`。 |