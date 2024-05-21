# 支持的浏览器

Next.js支持**现代浏览器**，无需任何配置。

- Chrome 64+
- Edge 79+
- Firefox 67+
- Opera 51+
- Safari 12+

## Browserslist

如果你想针对特定的浏览器或特性，Next.js支持在`package.json`文件中配置[Browserslist](https://browsersl.ist)。Next.js默认使用以下Browserslist配置：

```json filename="package.json"
{
  "browserslist": [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
  ]
}
```

## Polyfills

我们注入了[广泛使用的polyfills](https://github.com/vercel/next.js/blob/canary/packages/next-polyfill-nomodule/src/index.js)，包括：

- [**fetch()**](https://developer.mozilla.org/docs/Web/API/Fetch_API) — 替代：`whatwg-fetch`和`unfetch`。
- [**URL**](https://developer.mozilla.org/docs/Web/API/URL) — 替代：[`url`包（Node.js API）](https://nodejs.org/api/url.html)。
- [**Object.assign()**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) — 替代：`object-assign`、`object.assign`和`core-js/object/assign`。

如果你的任何依赖项包括这些polyfills，它们将自动从生产构建中消除，以避免重复。

此外，为了减少捆绑包大小，Next.js将只为需要它们的浏览器加载这些polyfills。全球大部分网络流量将不会下载这些polyfills。

### 自定义Polyfills

如果你自己的代码或任何外部npm依赖项需要目标浏览器（如IE 11）不支持的特性，你需要自己添加polyfills。

在这种情况下，你应该在[自定义`<App>`](/docs/pages/building-your-application/routing/custom-app)或单个组件中添加对**特定polyfill**的顶层导入。

## JavaScript语言特性

Next.js允许你开箱即用地使用最新的JavaScript特性。除了[ES6特性](https://github.com/lukehoban/es6features)外，Next.js还支持：

- [Async/await](https://github.com/tc39/ecmascript-asyncawait)（ES2017）
- [对象剩余/扩展属性](https://github.com/tc39/proposal-object-rest-spread)（ES2018）
- [动态`import()`](https://github.com/tc39/proposal-dynamic-import)（ES2020）
- [可选链](https://github.com/tc39/proposal-optional-chaining)（ES2020）
- [空值合并](https://github.com/tc39/proposal-nullish-coalescing)（ES2020）
- [类字段](https://github.com/tc39/proposal-class-fields)和[静态属性](https://github.com/tc39/proposal-static-class-features)（ES2022）
- 等等！

### TypeScript特性

Next.js内置了TypeScript支持。[在这里了解更多](/docs/pages/building-your-application/configuring/typescript)。

### 自定义Babel配置（高级）

你可以自定义babel配置。[在这里了解更多](/docs/pages/building-your-application/configuring/babel)。