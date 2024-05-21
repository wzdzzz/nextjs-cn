---
title: Favicon、图标和苹果图标
description: Favicon、图标和苹果图标文件约定的API参考。
---
# Favicon、图标和苹果图标
`favicon`、`icon` 或 `apple-icon` 文件约定允许您为应用程序设置图标。

它们对于添加出现在诸如网页浏览器标签、手机主屏幕和搜索引擎结果等位置的应用程序图标非常有用。

有两种设置应用程序图标的方法：

- [使用图像文件（.ico, .jpg, .png）](#image-files-ico-jpg-png)
- [使用代码生成图标（.js, .ts, .tsx）](#generate-icons-using-code-js-ts-tsx)

## 图像文件 (.ico, .jpg, .png)

通过在 `/app` 目录内放置 `favicon`、`icon` 或 `apple-icon` 图像文件来设置应用程序图标。
`favicon` 图像只能位于 `app/` 的顶级。

Next.js 将评估该文件，并自动向您的应用程序的 `<head>` 元素添加适当的标签。

| 文件约定             | 支持的文件类型                    | 有效位置 |
| --------------------------- | --------------------------------------- | --------------- |
| [`favicon`](#favicon)       | `.ico`                                  | `app/`          |
| [`icon`](#icon)             | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg` | `app/**/*`      |
| [`apple-icon`](#apple-icon) | `.jpg`, `.jpeg`, `.png`                 | `app/**/*`      |

### `favicon`

将 `favicon.ico` 图像文件添加到根 `/app` 路由段。

```html filename="<head> output"
<link rel="icon" href="/favicon.ico" sizes="any" />
```

### `icon`

添加一个 `icon.(ico|jpg|jpeg|png|svg)` 图像文件。

```html filename="<head> output"
<link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

### `apple-icon`

添加一个 `apple-icon.(jpg|jpeg|png)` 图像文件。

```html filename="<head> output"
<link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

> **须知**
>
> - 您可以通过在文件名后添加数字后缀来设置多个图标。例如，`icon1.png`，`icon2.png` 等。编号文件将按字典顺序排序。
> - Favicon 只能在根 `/app` 段设置。如果您需要更细粒度的控制，可以使用 [`icon`](#icon)。
> - 适当的 `<link>` 标签和属性，如 `rel`、`href`、`type` 和 `sizes` 由图标类型和评估文件的元数据确定。
>   - 例如，一个 32 乘 32 像素的 `.png` 文件将具有 `type="image/png"` 和 `sizes="32x32"` 属性。
> - 在 `favicon.ico` 输出中添加 `sizes="any"` 是为了[避免浏览器错误](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)，其中 `.ico` 图标优先于 `.svg`。
## 使用代码生成图标 (.js, .ts, .tsx)

除了使用[字面图像文件](#image-files-ico-jpg-png)，您还可以使用代码**程序化生成**图标。

通过创建一个默认导出函数的`icon`或`apple-icon`路由来生成应用程序图标。

| 文件约定 | 支持的文件类型 |
| --------------- | -------------------- |
| `icon`          | `.js`, `.ts`, `.tsx` |
| `apple-icon`    | `.js`, `.ts`, `.tsx` |

生成图标的最简单方法是使用`next/og`中的[`ImageResponse`](/docs/app/api-reference/functions/image-response) API。

```tsx filename="app/icon.tsx" switcher
import { ImageResponse } from 'next/og'

// 图像元数据
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// 图像生成
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX元素
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // ImageResponse选项
    {
      // 为了方便，我们可以重用导出的图标大小元数据
      // 配置来设置ImageResponse的宽度和高度。
      ...size,
    }
  )
}
```

```jsx filename="app/icon.js" switcher
import { ImageResponse } from 'next/og'

// 图像元数据
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// 图像生成
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX元素
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // ImageResponse选项
    {
      // 为了方便，我们可以重用导出的图标大小元数据
      // 配置来设置ImageResponse的宽度和高度。
      ...size,
    }
  )
}
```

```html filename="<head> output"
<link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
```

> **须知**
>
> - 默认情况下，生成的图标是[**静态优化**](/docs/app/building-your-application/rendering/server-components#static-rendering-default)的（在构建时生成并缓存），除非它们使用[动态函数](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)或未缓存的数据。
> - 您可以使用[`generateImageMetadata`](/docs/app/api-reference/functions/generate-image-metadata)在同一文件中生成多个图标。
> - 您不能生成`favicon`图标。请改用[`icon`](#icon)或[favicon.ico](#favicon)文件。

### Props

默认导出的函数接收以下属性：

#### `params`（可选）

包含从根段到`icon`或`apple-icon`共位的[动态路由参数](/docs/app/building-your-application/routing/dynamic-routes)对象的`params`对象。

```tsx filename="app/shop/[slug]/icon.tsx" switcher
export default function Icon({ params }: { params: { slug: string } }) {
  // ...
}
```

```jsx filename="app/shop/[slug]/icon.js" switcher
export default function Icon({ params }) {
  // ...
}
```

| 路由                           | URL         | `params`                  |
| ------------------------------- | ----------- | ------------------------- |
| `app/shop/icon.js`              | `/shop`     | `undefined`               |
| `app/shop/[slug]/icon.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/icon.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |
### 返回值

默认导出的函数应该返回一个 `Blob` | `ArrayBuffer` | `TypedArray` | `DataView` | `ReadableStream` | `Response`。

> **须知**：`ImageResponse` 满足此返回类型。

### 配置导出

你可以通过从 `icon` 或 `apple-icon` 路由导出 `size` 和 `contentType` 变量来选择性地配置图标的元数据。

| 选项                        | 类型                                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`size`](#size)               | `{ width: number; height: number }`                                                                             |
| [`contentType`](#contenttype) | `string` - [图片 MIME 类型](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

#### `size`

```tsx filename="icon.tsx | apple-icon.tsx" switcher
export const size = { width: 32, height: 32 }

export default function Icon() {}
```

```jsx filename="icon.js | apple-icon.js" switcher
export const size = { width: 32, height: 32 }

export default function Icon() {}
```

```html filename="<head> output"
<link rel="icon" sizes="32x32" />
```

#### `contentType`

```tsx filename="icon.tsx | apple-icon.tsx" switcher
export const contentType = 'image/png'

export default function Icon() {}
```

```jsx filename="icon.js | apple-icon.js" switcher
export const contentType = 'image/png'

export default function Icon() {}
```

```html filename="<head> output"
<link rel="icon" type="image/png" />
```

#### 路由段配置

`icon` 和 `apple-icon` 是专门的 [路由处理器](/docs/app/building-your-application/routing/route-handlers)，可以使用与页面和布局相同的 [路由段配置](/docs/app/api-reference/file-conventions/route-segment-config) 选项。

## 版本历史

| 版本   | 变更                                      |
| --------- | -------------------------------------------- |
| `v13.3.0` | 引入 `favicon` `icon` 和 `apple-icon` |