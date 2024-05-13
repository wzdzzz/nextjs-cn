import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Blog",
  description: "A Blog site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/' }
    ],

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
