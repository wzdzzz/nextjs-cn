# 页面

创建你在Next.js中的第一个页面。

相关链接：
- app/building-your-application/routing/layouts-and-templates
- app/building-your-application/routing/linking-and-navigating

页面是针对路由**唯一**的UI。你可以通过从`page.js`文件默认导出一个组件来定义一个页面。

例如，要创建你的`index`页面，在`app`目录中添加`page.js`文件：

![page.js特殊文件](https://nextjs.org/_next/image?url=/docs/light/page-special-file.png&w=3840&q=75)

```tsx filename="app/page.tsx" switcher
// `app/page.tsx` 是 `/` URL的UI
export default function Page() {
  return <h1>Hello, Home page!</h1>
}
```

```jsx filename="app/page.js" switcher
// `app/page.js` 是 `/` URL的UI
export default function Page() {
  return <h1>Hello, Home page!</h1>
}
```

然后，要创建更多页面，创建一个新文件夹并在其中添加`page.js`文件。例如，要为`/dashboard`路由创建页面，创建一个名为`dashboard`的新文件夹，并在其中添加`page.js`文件：

```tsx filename="app/dashboard/page.tsx" switcher
// `app/dashboard/page.tsx` 是 `/dashboard` URL的UI
export default function Page() {
  return <h1>Hello, Dashboard Page!</h1>
}
```

```jsx filename="app/dashboard/page.js" switcher
// `app/dashboard/page.js` 是 `/dashboard` URL的UI
export default function Page() {
  return <h1>Hello, Dashboard Page!</h1>
}
```

> **须知**：
>
> - 页面可以使用`.js`、`.jsx`或`.tsx`文件扩展名。
> - 页面始终是[路由子树](/docs/app/building-your-application/routing#terminology)的[叶子](/docs/app/building-your-application/routing#terminology)。
> - 需要`page.js`文件才能使路由段公开可访问。
> - 页面默认是[服务器组件](/docs/app/building-your-application/rendering/server-components)，但可以设置为[客户端组件](/docs/app/building-your-application/rendering/client-components)。
> - 页面可以获取数据。查看[数据获取](/docs/app/building-your-application/data-fetching)部分了解更多信息。