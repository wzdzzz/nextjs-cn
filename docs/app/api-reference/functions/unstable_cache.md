---
title: unstable_cache
description: unstable_cache函数的API参考。
---

`unstable_cache`允许你缓存昂贵操作的结果，比如数据库查询，并在多个请求中重用它们。

```jsx
import { getUser } from './data';
import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (id) => getUser(id),
  ['my-app-user']
);

export default async function Component({ userID }) {
  const user = await getCachedUser(userID);
  ...
}
```

> **须知**：
>
> - 在缓存范围内访问动态数据源，如`headers`或`cookies`，是不支持的。如果你需要在缓存函数内部使用这些数据，请在缓存函数外部使用`headers`，并将所需的动态数据作为参数传递进去。
> - 这个API使用了Next.js内置的[数据缓存](/docs/app/building-your-application/caching#data-cache)来跨请求和部署持久化结果。

> **警告**：这个API是不稳定的，将来可能会改变。随着这个API的稳定，我们将提供迁移文档和代码修改工具，如果需要的话。

## 参数

```jsx
const data = unstable_cache(fetchData, keyParts, options)()
```

- `fetchData`：这是一个异步函数，用于获取你想要缓存的数据。它必须是一个返回`Promise`的函数。
- `keyParts`：这是一个数组，用于标识缓存的键。它必须包含全局唯一的值，这些值共同标识被缓存数据的键。缓存键还包括传递给函数的参数。
- `options`：这是一个控制缓存行为的对象。它可以包含以下属性：
  - `tags`：一个标签数组，可以用来控制缓存失效。
  - `revalidate`：缓存应该重新验证的秒数。省略或传递`false`以无限期地缓存，或直到调用匹配的`revalidateTag()`或`revalidatePath()`方法。

## 返回

`unstable_cache`返回一个函数，当调用时，返回一个解析为缓存数据的Promise。如果数据不在缓存中，将调用提供的函数，其结果将被缓存并返回。

## 版本历史

| 版本   | 变化                      |
| --------- | ---------------------------- |
| `v14.0.0` | 引入了`unstable_cache`。 |