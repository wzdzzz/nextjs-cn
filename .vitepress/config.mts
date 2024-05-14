import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "next.js 中文文档",
  description: "next.js 中文文档",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/' }
    ],
    outline: {
      label: '页面导航',
      level: [2, 3, 4]
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    
    sidebar: [
      {
        text: 'Getting Started',
        link: '/docs/',
        items: [
         {
           text: 'Installation',
           link: '/docs/getting-started/installation'
         },
         {
           text: 'Project Structure',
           link: '/docs/getting-started/project-structure'
         }]
      },
      {
        text: 'Build Your Application',
        link: '/docs/app/building-your-application/',
        items: [
          {
            text: 'Routing',
            collapsed: false,
            link: '/docs/app/building-your-application/routing/',
            items: [
              {
                text: 'Defining Routes',
                link: '/docs/app/building-your-application/routing/defining-routes',
              },
              {
                text: 'Pages',
                link: '/docs/app/building-your-application/routing/pages',
              },
              {
                text: 'Layouts And Templates',
                link: '/docs/app/building-your-application/routing/layouts-and-templates',
              },
              {
                text: 'Linking And Navigating',
                link: '/docs/app/building-your-application/routing/linking-and-navigating',
              },
              {
                text: 'Error Handling',
                link: '/docs/app/building-your-application/routing/error-handling',
              },
              {
                text: 'Loading UI And Streaming',
                link: '/docs/app/building-your-application/routing/loading-ui-and-streaming',
              },
              {
                text: 'Redirecting',
                link: '/docs/app/building-your-application/routing/redirecting',
              },
              {
                text: 'Route Groups',
                link: '/docs/app/building-your-application/routing/route-groups',
              },
               {
                text: 'Colocation',
                link: '/docs/app/building-your-application/routing/colocation',
              },
               {
                text: 'Dynamic Routes',
                link: '/docs/app/building-your-application/routing/dynamic-routes',
              },
               {
                text: 'Parallel Routes',
                link: '/docs/app/building-your-application/routing/parallel-routes',
              },
               {
                text: 'Intercepting Routes',
                link: '/docs/app/building-your-application/routing/intercepting-routes',
              },
               {
                text: 'Route Handlers',
                link: '/docs/app/building-your-application/routing/route-handlers',
              },
               {
                text: 'Middleware',
                link: '/docs/app/building-your-application/routing/middleware',
              },
               {
                text: 'Internationalization',
                link: '/docs/app/building-your-application/routing/internationalization',
              },
            ]
          },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
