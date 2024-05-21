# 定义路由

了解如何在Next.js中创建您的第一条路由。

## 创建路由

Next.js 使用基于文件系统的路由器，其中**文件夹**用于定义路由。

每个文件夹代表一个[**路由段**](/docs/app/building-your-application/routing#route-segments)，映射到一个**URL**段。要创建[嵌套路由](/docs/app/building-your-application/routing#nested-routes)，您可以将文件夹相互嵌套。

![路由段到路径段](https://nextjs.org/_next/image?url=/docs/light/route-segments-to-path-segments.png&w=3840&q=75)

一个特殊的[`page.js`文件](/docs/app/building-your-application/routing/pages)用于使路由段公开可访问。

![定义路由](https://nextjs.org/_next/image?url=/docs/light/defining-routes.png&w=3840&q=75)

在这个例子中，`/dashboard/analytics` URL路径不是公开可访问的，因为它没有相应的`page.js`文件。这个文件夹可以用来存储组件、样式表、图像或其他共同定位的文件。

> **须知**：`.js`、`.jsx`或`.tsx`文件扩展名可以用于特殊文件。

## 创建UI

使用[特殊文件约定](/docs/app/building-your-application/routing#file-conventions)为每个路由段创建UI。最常见的是[页面](/docs/app/building-your-application/routing/pages)用于显示特定于路由的UI，以及[布局](/docs/app/building-your-application/routing/layouts-and-templates#layouts)用于显示跨多个路由共享的UI。

例如，要创建您的第一个页面，请在`app`目录中添加一个`page.js`文件，并导出一个React组件：

```tsx filename="app/page.tsx" switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

```jsx filename="app/page.js" switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```