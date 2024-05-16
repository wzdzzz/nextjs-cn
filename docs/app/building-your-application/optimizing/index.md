---
title: 优化
nav_title: 优化
description: 优化您的Next.js应用程序，以获得最佳性能和用户体验。
---

# 优化

Next.js提供了多种内置优化，旨在提高应用程序的速度和[核心网络指标](https://web.dev/vitals/)。本指南将介绍您可以利用的优化，以增强您的用户体验。

## 内置组件

内置组件抽象了实现常见UI优化的复杂性。这些组件包括：

- **Images**：建立在原生`<img>`元素上。图片组件通过延迟加载和根据设备大小自动调整图片大小来优化图片性能。
- **Link**：建立在原生`<a>`标签上。链接组件在后台预加载页面，以实现更快更平滑的页面过渡。
- **Scripts**：建立在原生`<script>`标签上。脚本组件使您能够控制第三方脚本的加载和执行。

## 元数据

元数据有助于搜索引擎更好地理解您的内容（这可能导致更好的SEO），并允许您自定义内容在社交媒体上的呈现方式，帮助您在各个平台上创建更具吸引力和一致性的用户体验。

<AppOnly>

Next.js中的元数据API允许您修改页面的`<head>`元素。您可以通过两种方式配置元数据：

- **基于配置的元数据**：在`layout.js`或`page.js`文件中导出一个[静态`metadata`对象](/docs/app/api-reference/functions/generate-metadata#metadata-object)或一个动态的[`generateMetadata`函数](/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)。
- **基于文件的元数据**：向路由段添加静态或动态生成的特殊文件。

此外，您可以使用[`imageResponse`](/docs/app/api-reference/functions/image-response)构造函数，使用JSX和CSS创建动态开放图形图像。

</AppOnly>

<PagesOnly>

Next.js中的Head组件允许您修改页面的`<head>`。在[Head组件](/docs/pages/api-reference/components/head)文档中了解更多。

</PagesOnly>

## 静态资源

Next.js的`/public`文件夹可用于提供静态资源，如图片、字体和其他文件。`/public`内的文件也可以被CDN提供商缓存，以便高效传递。

## 分析和监控

对于大型应用程序，Next.js与流行的分析和监控工具集成，帮助您了解应用程序的性能。在<PagesOnly>[分析](/docs/app/building-your-application/optimizing/analytics)，</PagesOnly> [OpenTelemetry](/docs/pages/building-your-application/optimizing/open-telemetry)<PagesOnly>,</PagesOnly>和[工具](/docs/pages/building-your-application/optimizing/instrumentation)指南中了解更多。