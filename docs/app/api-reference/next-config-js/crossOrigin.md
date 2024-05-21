---
title: crossOrigin
description: 使用 `crossOrigin` 选项为 `next/script` 生成的 `script` 标签添加一个 `crossOrigin` 标签。
---



使用 `crossOrigin` 选项为 <AppOnly>[`next/script`](/docs/app/building-your-application/optimizing/scripts) 组件</AppOnly> <PagesOnly>[`next/script`](/docs/pages/building-your-application/optimizing/scripts) 和 [`next/head`](/docs/pages/api-reference/components/head) 组件</PagesOnly> 生成的所有 `<script>` 标签添加一个 [`crossOrigin` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)，并定义如何处理跨域请求。

```js filename="next.config.js"
module.exports = {
  crossOrigin: 'anonymous',
}
```

## 选项

- `'anonymous'`: 添加 [`crossOrigin="anonymous"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin#anonymous) 属性。
- `'use-credentials'`: 添加 [`crossOrigin="use-credentials"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin#use-credentials)。