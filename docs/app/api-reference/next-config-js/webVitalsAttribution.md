---
title: webVitalsAttribution
description: 学习如何使用webVitalsAttribution选项来确定Web Vitals问题来源。
---



在调试与Web Vitals相关的问题时，如果能够确定问题的源头，通常会很有帮助。
例如，在累积布局偏移（CLS）的情况下，我们可能想要知道当发生最大单一布局偏移时，第一个发生偏移的元素是什么。
或者，在最大内容绘制（LCP）的情况下，我们可能想要识别与页面的LCP对应的元素。
如果LCP元素是一张图片，知道图片资源的URL可以帮助我们定位需要优化的资产。

确定对Web Vitals得分贡献最大的因素，即[归因](https://github.com/GoogleChrome/web-vitals/blob/4ca38ae64b8d1e899028c692f94d4c56acfc996c/README.md#attribution)，
允许我们获得更深入的信息，如[PerformanceEventTiming](https://developer.mozilla.org/docs/Web/API/PerformanceEventTiming)、[PerformanceNavigationTiming](https://developer.mozilla.org/docs/Web/API/PerformanceNavigationTiming)和[PerformanceResourceTiming](https://developer.mozilla.org/docs/Web/API/PerformanceResourceTiming)的条目。

在Next.js中，默认情况下归因是禁用的，但可以通过在`next.config.js`中指定以下内容来**每个指标**启用。

```js filename="next.config.js"
experimental: {
  webVitalsAttribution: ['CLS', 'LCP']
}
```

有效的归因值是所有在[`NextWebVitalsMetric`](https://github.com/vercel/next.js/blob/442378d21dd56d6e769863eb8c2cb521a463a2e0/packages/next/shared/lib/utils.ts#L43)类型中指定的`web-vitals`指标。