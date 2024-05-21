---
title: 客户端渲染 (CSR)
description: 学习如何在 Pages Router 中实现客户端渲染。
related:
  description: 了解 Next.js 中的替代渲染方法。
  links:
    - pages/building-your-application/rendering/server-side-rendering
    - pages/building-your-application/rendering/static-site-generation
    - pages/building-your-application/data-fetching/incremental-static-regeneration
    - app/building-your-application/routing/loading-ui-and-streaming
---

在 React 中使用客户端渲染 (CSR) 时，浏览器会下载一个最小的 HTML 页面和页面所需的 JavaScript。然后使用 JavaScript 更新 DOM 并渲染页面。当应用程序首次加载时，用户可能会注意到在看到完整页面之前有轻微的延迟，这是因为在下载、解析并执行所有 JavaScript 之前，页面并未完全渲染。

页面首次加载后，在同一网站上导航到其他页面通常是更快的，因为只需要获取必要的数据，JavaScript 可以重新渲染页面的部分内容，而不需要完整的页面刷新。

在 Next.js 中，有两种实现客户端渲染的方法：

1. 在页面中使用 React 的 `useEffect()` 钩子，而不是服务器端渲染方法（[`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) 和 [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)）。
2. 使用数据获取库，如 [SWR](https://swr.vercel.app/) 或 [TanStack Query](https://tanstack.com/query/latest/) 在客户端获取数据（推荐）。

以下是在 Next.js 页面中使用 `useEffect()` 的示例：

```jsx filename="pages/index.js"
import React, { useState, useEffect } from 'react'

export function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/data')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    }

    fetchData().catch((e) => {
      // 根据需要处理错误
      console.error('An error occurred while fetching the data: ', e)
    })
  }, [])

  return <p>{data ? `Your data: ${data}` : 'Loading...'}</p>
}

```

在上面的示例中，组件首先渲染 `Loading...`。然后，一旦获取了数据，它就会重新渲染并显示数据。

尽管在 `useEffect` 中获取数据是您可能在旧版 React 应用程序中看到的一种模式，但我们建议使用数据获取库以获得更好的性能、缓存、乐观更新等。以下是使用 [SWR](https://swr.vercel.app/) 在客户端获取数据的最小示例：

```jsx filename="pages/index.js"
import useSWR from 'swr'

export function Page() {
  const { data, error, isLoading } = useSWR(
    'https://api.example.com/data',
    fetcher
  )

  if (error) return <p>Failed to load.</p>
  if (isLoading) return <p>Loading...</p>

  return <p>Your Data: {data}</p>
}
```
# 须知

> **须知**：
>
> 请注意，CSR（客户端渲染）可能会影响SEO（搜索引擎优化）。一些搜索引擎爬虫可能不会执行JavaScript，因此只能看到应用程序的初始空状态或加载状态。对于使用较慢互联网连接或设备的用户体验，这还可能导致性能问题，因为他们需要等待所有JavaScript加载并运行后才能查看完整页面。Next.js提倡采用混合方法，允许您使用[服务器端渲染](/docs/pages/building-your-application/rendering/server-side-rendering)、[静态网站生成](/docs/pages/building-your-application/rendering/static-site-generation)和客户端渲染的组合，**根据应用程序中每个页面的需求**。在App Router中，您还可以使用[使用Suspense加载UI](/docs/app/building-your-application/routing/loading-ui-and-streaming)，在页面渲染时显示加载指示器。