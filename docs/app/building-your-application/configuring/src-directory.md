---
title: src 目录
description: 将页面保存在 `src` 目录下，作为根 `pages` 目录的替代方案。
related:
  links:
    - app/building-your-application/routing/colocation
---

# src 目录
作为在项目根目录中拥有特殊的 Next.js `app` 或 `pages` 目录的替代方案，Next.js 还支持将应用程序代码放置在 `src` 目录下的常见模式。

这将应用程序代码与主要位于项目根目录的大部分项目配置文件分离，这是一些个人和团队的偏好。

要使用 `src` 目录，请将 `app` 路由器文件夹或 `pages` 路由器文件夹移动到 `src/app` 或 `src/pages`。

<img
  alt="一个带有 `src` 目录的示例文件夹结构"
  src="https://nextjs.org/_next/image?url=/docs/light/project-organization-src-directory.png&w=3840&q=75"
  srcDark="/docs/dark/project-organization-src-directory.png"
  width="1600"
  height="687"
/>

> **须知**
>
> - `/public` 目录应保持在项目的根目录。
> - 像 `package.json`、`next.config.js` 和 `tsconfig.json` 这样的配置文件应保持在项目的根目录。
> - `.env.*` 文件应保持在项目的根目录。
> - 如果根目录中存在 `app` 或 `pages`，则 `src/app` 或 `src/pages` 将被忽略。
> - 如果你使用 `src`，你可能会将其他应用程序文件夹（如 `/components` 或 `/lib`）也移动过去。
> - 如果你使用 Middleware，请确保将其放置在 `src` 目录内。
> - 如果你使用 Tailwind CSS，则需要在 [内容部分](https://tailwindcss.com/docs/content-configuration) 的 `tailwind.config.js` 文件中添加 `/src` 前缀。
> - 如果你使用 TypeScript 路径导入，如 `@/*`，则应更新 `tsconfig.json` 中的 `paths` 对象以包含 `src/`。