# 无障碍性

Next.js团队致力于使Next.js对所有开发者（及其最终用户）都易于使用。通过默认添加无障碍性特性到Next.js，我们的目标是使网络对每个人都更具包容性。

## 路由公告

当在服务器上渲染的页面之间进行转换时（例如使用`<a href>`标签），屏幕阅读器和其他辅助技术会在页面加载时宣布页面标题，以便用户理解页面已更改。

除了传统的页面导航，Next.js还支持客户端过渡以提高性能（使用`next/link`）。为确保客户端过渡也向辅助技术宣布，Next.js默认包括路由公告器。

Next.js路由公告器通过首先检查`document.title`，然后是`<h1>`元素，最后是URL路径来查找要宣布的页面名称。为了获得最可访问的用户体验，请确保您的应用程序中的每个页面都有一个独特且描述性的标题。

## Linting

Next.js提供了一个[集成的ESLint体验](/docs/pages/building-your-application/configuring/eslint)，包括自定义的Next.js规则。默认情况下，Next.js包括`eslint-plugin-jsx-a11y`以帮助及早捕获无障碍性问题，包括警告：

- [aria-props](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/aria-props.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [aria-proptypes](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/aria-proptypes.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [aria-unsupported-elements](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/aria-unsupported-elements.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [role-has-required-aria-props](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/role-has-required-aria-props.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [role-supports-aria-props](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/role-supports-aria-props.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)

例如，此插件有助于确保您为`img`标签添加替代文本，使用正确的`aria-*`属性，使用正确的`role`属性等。

## 无障碍性资源

- [WebAIM WCAG清单](https://webaim.org/standards/wcag/checklist)
- [WCAG 2.2指南](https://www.w3.org/TR/WCAG22/)
- [The A11y Project](https://www.a11yproject.com/)
- 检查[前景和背景元素之间的颜色对比度](https://developer.mozilla.org/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast)
- 在处理动画时使用[`prefers-reduced-motion`](https://web.dev/prefers-reduced-motion/)