---
title: optimizePackageImports
description: Next.js 配置选项 optimizePackageImports 的 API 参考
---



一些包可以导出数百或数千个模块，这可能会在开发和生产中引起性能问题。

将一个包添加到 `experimental.optimizePackageImports` 将只加载您实际使用的模块，同时仍然为您提供使用许多命名导出编写导入语句的便利。

```js filename="next.config.js"
module.exports = {
  experimental: {
    optimizePackageImports: ['package-name'],
  },
}
```

以下库默认进行了优化：

- `lucide-react`
- `date-fns`
- `lodash-es`
- `ramda`
- `antd`
- `react-bootstrap`
- `ahooks`
- `@ant-design/icons`
- `@headlessui/react`
- `@headlessui-float/react`
- `@heroicons/react/20/solid`
- `@heroicons/react/24/solid`
- `@heroicons/react/24/outline`
- `@visx/visx`
- `@tremor/react`
- `rxjs`
- `@mui/material`
- `@mui/icons-material`
- `recharts`
- `react-use`
- `@material-ui/core`
- `@material-ui/icons`
- `@tabler/icons-react`
- `mui-core`
- `react-icons/*`