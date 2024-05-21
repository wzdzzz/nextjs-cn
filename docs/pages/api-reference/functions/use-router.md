---
title: useRouter
description: 了解更多关于 Next.js Router 的 API，并使用 useRouter 钩子在页面中访问路由器实例。
---

如果你想在应用中的任何函数组件内访问 [`router` 对象](#router-对象)，你可以使用 `useRouter` 钩子，下面是一个示例：

```jsx
import { useRouter } from 'next/router'

function ActiveLink({ children, href }) {
  const router = useRouter()
  const style = {
    marginRight: 10,
    color: router.asPath === href ? 'red' : 'black',
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default ActiveLink
```

> `useRouter` 是一个 [React Hook](https://react.dev/learn#using-hooks)，意味着它不能与类一起使用。你可以使用 [withRouter](#withrouter) 或将你的类包装在函数组件中。

## `router` 对象

以下是 `router` 对象的定义，由 [`useRouter`](#top) 和 [`withRouter`](#withrouter) 返回：

- `pathname`: `String` - 当前路由文件的路径，位于 `/pages` 之后。因此，不包括 `basePath`、`locale` 和尾随斜杠（`trailingSlash: true`）。
- `query`: `Object` - 将查询字符串解析为对象，包括 [动态路由](/docs/pages/building-your-application/routing/dynamic-routes) 参数。如果页面不使用 [服务器端渲染](/docs/pages/building-your-application/data-fetching/get-server-side-props)，则在预渲染期间将是一个空对象。默认为 `{}`
- `asPath`: `String` - 包括搜索参数并尊重 `trailingSlash` 配置的浏览器中显示的路径。不包括 `basePath` 和 `locale`。
- `isFallback`: `boolean` - 当前页面是否处于 [备用模式](/docs/pages/api-reference/functions/get-static-paths#fallback-true)。
- `basePath`: `String` - 激活的 [basePath](/docs/app/api-reference/next-config-js/basePath)（如果启用）。
- `locale`: `String` - 激活的语言环境（如果启用）。
- `locales`: `String[]` - 所有支持的语言环境（如果启用）。
- `defaultLocale`: `String` - 当前默认语言环境（如果启用）。
- `domainLocales`: `Array<{domain, defaultLocale, locales}>` - 任何配置的域名语言环境。
- `isReady`: `boolean` - 路由器字段是否已在客户端更新并准备好使用。只能用于 `useEffect` 方法内部，不能用于服务器上的有条件渲染。有关使用情况的相关文档，请参见 [自动静态优化页面](/docs/pages/building-your-application/rendering/automatic-static-optimization)
- `isPreview`: `boolean` - 应用程序当前是否处于 [预览模式](/docs/pages/building-your-application/configuring/preview-mode)。

> 使用 `asPath` 字段可能会导致客户端和服务器之间的不匹配，如果页面使用服务器端渲染或 [自动静态优化](/docs/pages/building-your-application/rendering/automatic-static-optimization) 进行渲染。在 `isReady` 字段为 `true` 之前，避免使用 `asPath`。

`router` 中包含了以下方法：
### router.push

处理客户端过渡，这种方法适用于[`next/link`](/docs/pages/api-reference/components/link)不足以满足需求的情况。

```js
router.push(url, as, options)
```

- `url`: `UrlObject | String` - 要导航到的URL（有关`UrlObject`属性，请参阅[Node.JS URL模块文档](https://nodejs.org/api/url.html#legacy-urlobject)）。
- `as`: `UrlObject | String` - 可选的路径装饰器，它将显示在浏览器的URL栏中。在Next.js 9.5.3之前，这用于动态路由。
- `options` - 可选对象，包含以下配置选项：
  - `scroll` - 可选布尔值，控制导航后是否滚动到页面顶部。默认为`true`
  - [`shallow`](/docs/pages/building-your-application/routing/linking-and-navigating#shallow-routing): 更新当前页面的路径，而不会重新运行[`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)、[`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)或[`getInitialProps`](/docs/pages/api-reference/functions/get-initial-props)。默认为`false`
  - `locale` - 可选字符串，表示新页面的语言环境

> 对于外部URL，您不需要使用`router.push`。[window.location](https://developer.mozilla.org/docs/Web/API/Window/location)更适合这些情况。

导航到`pages/about.js`，这是一个预定义的路由：

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/about')}>
      点击我
    </button>
  )
}
```

导航到`pages/post/[pid].js`，这是一个动态路由：

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/post/abc')}>
      点击我
    </button>
  )
}
```

将用户重定向到`pages/login.js`，对于[认证](/docs/pages/building-your-application/authentication)后的页面很有用：

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// 在这里，您将获取并返回用户
const useUser = () => ({ user: null, loading: false })

export default function Page() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!(user || loading)) {
      router.push('/login')
    }
  }, [user, loading])

  return <p>正在重定向...</p>
}
```
# Resetting state after navigation

在使用 Next.js 导航到同一页面时，默认情况下页面的状态**不会**重置，因为 React 只有在父组件发生变化时才会卸载。

```jsx filename="pages/[slug].js"
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Page(props) {
  const router = useRouter()
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>页面: {router.query.slug}</h1>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加计数</button>
      <Link href="/one">一</Link> <Link href="/two">二</Link>
    </div>
  )
}
```

在上面的例子中，导航到 `/one` 和 `/two` **不会**重置计数。因为顶层 React 组件 `Page` 是相同的，所以 `useState` 在渲染之间保持不变。

如果你不希望这种行为，你有几个选择：

- 手动确保使用 `useEffect` 更新每个状态。在上面的例子中，可以这样实现：

  ```jsx
  useEffect(() => {
    setCount(0)
  }, [router.query.slug])
  ```

- 使用 React 的 `key` 来[告诉 React 重新挂载组件](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)。对于所有页面，你可以使用自定义应用：

  ```jsx filename="pages/_app.js"
  import { useRouter } from 'next/router'

  export default function MyApp({ Component, pageProps }) {
    const router = useRouter()
    return <Component key={router.asPath} {...pageProps} />
  }
  ```

### With URL object

你可以像使用 [`next/link`](/docs/pages/api-reference/components/link#with-url-object) 一样使用 URL 对象。它适用于 `url` 和 `as` 参数：

```jsx
import { useRouter } from 'next/router'

export default function ReadMore({ post }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        router.push({
          pathname: '/post/[pid]',
          query: { pid: post.id },
        })
      }}
    >
      点击这里阅读更多
    </button>
  )
}
```


### router.replace

类似于 [`next/link`](/docs/pages/api-reference/components/link) 中的 `replace` 属性，`router.replace` 将防止在 `history` 栈中添加新的 URL 条目。

```js
router.replace(url, as, options)
```

- `router.replace` 的 API 与 [`router.push`](#routerpush) 的 API 完全相同。

请看以下示例：

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.replace('/home')}>
      点击我
    </button>
  )
}
```
### router.prefetch

为更快的客户端过渡预取页面。此方法仅在没有使用 [`next/link`](/docs/pages/api-reference/components/link) 的导航中有用，因为 `next/link` 会自动处理预取页面。

> 这是一个仅在生产环境中使用的特性。Next.js 在开发环境中不会预取页面。

```js
router.prefetch(url, as, options)
```

- `url` - 要预取的URL，包括显式路由（例如 `/dashboard`）和动态路由（例如 `/product/[id]`）
- `as` - `url` 的可选修饰符。在 Next.js 9.5.3 之前，这被用来预取动态路由。
- `options` - 可选对象，包含以下允许的字段：
  - `locale` - 允许提供与活动区域设置不同的区域设置。如果为 `false`，则 `url` 必须包含区域设置，因为不会使用活动区域设置。

假设您有一个登录页面，登录后将用户重定向到仪表板。在这种情况下，我们可以预取仪表板以实现更快的过渡，如下例所示：

```jsx
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        /* 表单数据 */
      }),
    }).then((res) => {
      // 快速客户端过渡到已经预取的仪表板页面
      if (res.ok) router.push('/dashboard')
    })
  }, [])

  useEffect(() => {
    // 预取仪表板页面
    router.prefetch('/dashboard')
  }, [router])

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单字段 */}
      <button type="submit">登录</button>
    </form>
  )
}
```

### router.beforePopState

在某些情况下（例如，如果使用 [自定义服务器](/docs/pages/building-your-application/configuring/custom-server)），您可能希望监听 [popstate](https://developer.mozilla.org/docs/Web/Events/popstate) 并在路由器处理它之前执行某些操作。

```js
router.beforePopState(cb)
```

- `cb` - 在传入的 `popstate` 事件上运行的函数。该函数接收事件的状态作为对象，具有以下属性：
  - `url`: `String` - 新状态的路由。这通常是 `page` 的名称
  - `as`: `String` - 浏览器中显示的URL
  - `options`: `Object` - [router.push](#routerpush) 发送的额外选项

如果 `cb` 返回 `false`，则 Next.js 路由器将不处理 `popstate`，您将负责在该情况下处理它。请参阅 [禁用文件系统路由](/docs/pages/building-your-application/configuring/custom-server#disabling-file-system-routing)。

您可以使用 `beforePopState` 来操作请求，或强制 SSR 刷新，如下例所示：

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      // 我只想允许这两个路由！
      if (as !== '/' && as !== '/other') {
        // 让 SSR 将错误的路由渲染为 404。
        window.location.href = as
        return false
      }

      return true
    })
  }, [router])

  return <p>欢迎来到页面</p>
}
```


### router.back

在历史记录中后退。等同于点击浏览器的后退按钮。它执行 `window.history.back()`。

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.back()}>
      点击这里返回
    </button>
  )
}
```
### router.reload

重新加载当前URL。相当于点击浏览器的刷新按钮。它执行了 `window.location.reload()`。

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.reload()}>
      点击这里重新加载
    </button>
  )
}
```

### router.events

你可以监听 Next.js Router 内部发生的不同事件。以下是支持的事件列表：

- `routeChangeStart(url, { shallow })` - 当路由开始变化时触发
- `routeChangeComplete(url, { shallow })` - 当路由完全变化时触发
- `routeChangeError(err, url, { shallow })` - 当路由变化时出现错误，或者路由加载被取消时触发
  - `err.cancelled` - 指示导航是否被取消
- `beforeHistoryChange(url, { shallow })` - 在改变浏览器历史之前触发
- `hashChangeStart(url, { shallow })` - 当散列将要改变但页面不改变时触发
- `hashChangeComplete(url, { shallow })` - 当散列已经改变但页面不改变时触发

> **须知**：这里的 `url` 是浏览器中显示的 URL，包括 [`basePath`](/docs/app/api-reference/next-config-js/basePath)。

例如，要监听路由器事件 `routeChangeStart`，请打开或创建 `pages/_app.js` 并订阅该事件，如下所示：

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `应用正在改变到 ${url} ${
          shallow ? '有' : '没有'
        } 浅层路由`
      )
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // 如果组件被卸载，使用 `off` 方法从事件中取消订阅：
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  return <Component {...pageProps} />
}
```

> 我们使用 [自定义应用](/docs/pages/building-your-application/routing/custom-app) (`pages/_app.js`) 作为示例来订阅事件，因为它在页面导航时不会被卸载，但你可以在你的应用程序中的任何组件上订阅路由器事件。

路由器事件应该在组件挂载时注册（[useEffect](https://react.dev/reference/react/useEffect) 或 [componentDidMount](https://react.dev/reference/react/Component#componentdidmount) / [componentWillUnmount](https://react.dev/reference/react/Component#componentwillunmount)）或者在事件发生时命令性地注册。

如果路由加载被取消（例如，通过快速连续点击两个链接），`routeChangeError` 将被触发。并且传递的 `err` 将包含一个设置为 `true` 的 `cancelled` 属性，如下例所示：

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeError = (err, url) => {
      if (err.cancelled) {
        console.log(`到 ${url} 的路由被取消了！`)
      }
    }

    router.events.on('routeChangeError', handleRouteChangeError)

    // 如果组件被卸载，使用 `off` 方法从事件中取消订阅：
    return () => {
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [router])

  return <Component {...pageProps} />
}
```
## 潜在的ESLint错误

`router`对象上的某些方法返回一个Promise。如果你启用了ESLint规则[no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises)，请考虑全局禁用它，或者仅禁用受影响的行。

如果你的应用程序需要这个规则，你应该要么使用`void`操作符处理Promise——或者使用一个`async`函数，`await` Promise，然后对函数调用使用`void`操作符。**当方法在`onClick`处理器内部被调用时，这并不适用**。

受影响的方法包括：

- `router.push`
- `router.replace`
- `router.prefetch`

### 潜在的解决方案

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// 在这里你会获取并返回用户信息
const useUser = () => ({ user: null, loading: false })

export default function Page() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    // 在下一行禁用linting - 这是最干净的解决方案
    // eslint-disable-next-line no-floating-promises
    router.push('/login')

    // 使用void操作符处理router.push返回的Promise
    if (!(user || loading)) {
      void router.push('/login')
    }
    // 或者使用一个async函数，await Promise，然后对函数调用使用void操作符
    async function handleRouteChange() {
      if (!(user || loading)) {
        await router.push('/login')
      }
    }
    void handleRouteChange()
  }, [user, loading])

  return <p>正在重定向...</p>
}
```

## withRouter

如果[`useRouter`](#router-object)对你来说不是最佳选择，`withRouter`也可以向任何组件添加相同的[`router`对象](#router-object)。

### 使用方法

```jsx
import { withRouter } from 'next/router'

function Page({ router }) {
  return <p>{router.pathname}</p>
}

export default withRouter(Page)
```

### TypeScript

要在使用`withRouter`的类组件中，组件需要接受一个router属性：

```tsx
import React from 'react'
import { withRouter, NextRouter } from 'next/router'

interface WithRouterProps {
  router: NextRouter
}

interface MyComponentProps extends WithRouterProps {}

class MyComponent extends React.Component<MyComponentProps> {
  render() {
    return <p>{this.props.router.pathname}</p>
  }
}

export default withRouter(MyComponent)
```