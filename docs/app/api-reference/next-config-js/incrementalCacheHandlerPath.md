# Custom Next.js Cache Handler

在 Next.js 中，页面和应用程序路由的[默认缓存处理器](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)使用文件系统缓存。这不需要任何配置，但是您可以通过在 `next.config.js` 中使用 `cacheHandler` 字段来自定义缓存处理器。

```js filename="next.config.js"
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // 禁用默认的内存缓存
}
```

查看[自定义缓存处理器](/docs/app/building-your-application/deploying#configuring-caching)的示例，并了解更多关于实现的信息。

## API 参考

缓存处理器可以实现以下方法：`get`、`set` 和 `revalidateTag`。

### `get()`

| 参数    | 类型     | 描述                           |
| ------- | -------- | ------------------------------ |
| `key`   | `string` | 缓存值的键。                  |

返回缓存的值，如果没有找到则返回 `null`。

### `set()`

| 参数    | 类型           | 描述                             |
| ------- | -------------- | -------------------------------- |
| `key`   | `string`       | 存储数据的键。                 |
| `data`  | 数据或 `null`  | 要缓存的数据。                 |
| `ctx`   | `{ tags: [] }` | 提供的缓存标签。               |

返回 `Promise<void>`。

### `revalidateTag()`

| 参数    | 类型     | 描述                           |
| ------- | -------- | ------------------------------ |
| `tag`   | `string` | 要重新验证的缓存标签。      |

返回 `Promise<void>`。了解更多关于[重新验证数据](/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)或 [`revalidateTag()`](/docs/app/api-reference/functions/revalidateTag) 函数的信息。

**须知：**

- `revalidatePath` 是缓存标签之上的便利层。调用 `revalidatePath` 将调用您的 `revalidateTag` 函数，然后您可以选择是否要根据路径标记缓存键。

## 版本历史

| 版本     | 变更                                                                   |
| -------- | ---------------------------------------------------------------------- |
| `v14.1.0` | `cacheHandler` 重命名后稳定。                                        |
| `v13.4.0` | `incrementalCacheHandlerPath`（实验性）支持 `revalidateTag`。        |
| `v13.4.0` | `incrementalCacheHandlerPath`（实验性）支持独立输出。             |
| `v12.2.0` | 添加了 `incrementalCacheHandlerPath`（实验性）。                      |