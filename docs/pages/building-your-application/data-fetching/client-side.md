---
title: 客户端数据获取
description: 了解客户端数据获取，以及如何使用SWR，这是一个处理缓存、重新验证、焦点跟踪、定时重新获取等功能的React钩子库。
---

客户端数据获取在您的页面不需要SEO索引、不需要预渲染数据，或者页面内容需要频繁更新时非常有用。与服务器端渲染API不同，您可以在组件级别使用客户端数据获取。

如果在页面级别执行，数据将在运行时获取，页面内容将随着数据变化而更新。当在组件级别使用时，数据将在组件挂载时获取，组件内容将随着数据变化而更新。

需要注意的是，使用客户端数据获取可能会影响您的应用程序性能和页面加载速度。这是因为数据获取是在组件或页面挂载时完成的，并且数据不会被缓存。

## 使用useEffect进行客户端数据获取

以下示例展示了如何使用useEffect钩子在客户端获取数据。

```jsx
import { useState, useEffect } from 'react'

function Profile() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profile-data')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  )
}
```

## 使用SWR进行客户端数据获取

Next.js团队创建了一个名为[**SWR**](https://swr.vercel.app/)的React钩子库，用于数据获取。如果您在客户端获取数据，强烈推荐使用它。它处理缓存、重新验证、焦点跟踪、定时重新获取等。

使用与上述相同的示例，我们现在可以使用SWR来获取个人资料数据。SWR将自动为我们缓存数据，并在数据变得过时时重新验证数据。

有关使用SWR的更多信息，请查看[SWR文档](https://swr.vercel.app/docs/getting-started)。

```jsx
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function Profile() {
  const { data, error } = useSWR('/api/profile-data', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  )
}
```