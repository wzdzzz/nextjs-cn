import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "next.js 中文文档",
  description: "next.js 中文文档",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '中文文档', link: '/docs/' },
      { text: '英文文档', link: 'https://nextjs.org/' }
    ],
    outline: {
      label: '页面导航',
      level: [2, 4]
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
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    
    sidebar:
      [
        {
          "text": "Getting Started",
          "link": "/docs/getting-started/",
          "items": [
            {
              "text": "Installation",
              "link": "/docs/getting-started/installation",
            },
            {
              "text": "Project Structure",
              "link": "/docs/getting-started/project-structure",
            }
          ]
        },
        {
          "text": "App Router",
          "link": "/docs/app/",
          "collapsed": false,
          "items": [
            {
              "text": "Building Your Application",
              "link": "/docs/app/building-your-application/",
              "items": [
                {
                  "text": "Routing",
                  "link": "/docs/app/building-your-application/routing/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Defining Routes",
                      "link": "/docs/app/building-your-application/routing/defining-routes",
                      "collapsed": false
                    },
                    {
                      "text": "Pages",
                      "link": "/docs/app/building-your-application/routing/pages",
                      "collapsed": false
                    },
                    {
                      "text": "Layouts And Templates",
                      "link": "/docs/app/building-your-application/routing/layouts-and-templates",
                      "collapsed": false
                    },
                    {
                      "text": "Linking And Navigating",
                      "link": "/docs/app/building-your-application/routing/linking-and-navigating",
                      "collapsed": false
                    },
                    {
                      "text": "Error Handling",
                      "link": "/docs/app/building-your-application/routing/error-handling",
                      "collapsed": false
                    },
                    {
                      "text": "Loading Ui And Streaming",
                      "link": "/docs/app/building-your-application/routing/loading-ui-and-streaming",
                      "collapsed": false
                    },
                    {
                      "text": "Redirecting",
                      "link": "/docs/app/building-your-application/routing/redirecting",
                      "collapsed": false
                    },
                    {
                      "text": "Route Groups",
                      "link": "/docs/app/building-your-application/routing/route-groups",
                      "collapsed": false
                    },
                    {
                      "text": "Colocation",
                      "link": "/docs/app/building-your-application/routing/colocation",
                      "collapsed": false
                    },
                    {
                      "text": "Dynamic Routes",
                      "link": "/docs/app/building-your-application/routing/dynamic-routes",
                      "collapsed": false
                    },
                    {
                      "text": "Parallel Routes",
                      "link": "/docs/app/building-your-application/routing/parallel-routes",
                      "collapsed": false
                    },
                    {
                      "text": "Intercepting Routes",
                      "link": "/docs/app/building-your-application/routing/intercepting-routes",
                      "collapsed": false
                    },
                    {
                      "text": "Route Handlers",
                      "link": "/docs/app/building-your-application/routing/route-handlers",
                      "collapsed": false
                    },
                    {
                      "text": "Middleware",
                      "link": "/docs/app/building-your-application/routing/middleware",
                      "collapsed": false
                    },
                    {
                      "text": "Internationalization",
                      "link": "/docs/app/building-your-application/routing/internationalization",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Data Fetching",
                  "link": "/docs/app/building-your-application/data-fetching/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Fetching Caching And Revalidating",
                      "link": "/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating",
                      "collapsed": false
                    },
                    {
                      "text": "Server Actions And Mutations",
                      "link": "/docs/app/building-your-application/data-fetching/server-actions-and-mutations",
                      "collapsed": false
                    },
                    {
                      "text": "Patterns",
                      "link": "/docs/app/building-your-application/data-fetching/patterns",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Rendering",
                  "link": "/docs/app/building-your-application/rendering/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Server Components",
                      "link": "/docs/app/building-your-application/rendering/server-components",
                      "collapsed": false
                    },
                    {
                      "text": "Client Components",
                      "link": "/docs/app/building-your-application/rendering/client-components",
                      "collapsed": false
                    },
                    {
                      "text": "Composition Patterns",
                      "link": "/docs/app/building-your-application/rendering/composition-patterns",
                      "collapsed": false
                    },
                    {
                      "text": "Edge And Nodejs Runtimes",
                      "link": "/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Caching",
                  "link": "/docs/app/building-your-application/caching/",
                  "collapsed": true,
                  "items": []
                },
                {
                  "text": "Styling",
                  "link": "/docs/app/building-your-application/styling/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Css Modules",
                      "link": "/docs/app/building-your-application/styling/css-modules",
                      "collapsed": false
                    },
                    {
                      "text": "Tailwind Css",
                      "link": "/docs/app/building-your-application/styling/tailwind-css",
                      "collapsed": false
                    },
                    {
                      "text": "Css In Js",
                      "link": "/docs/app/building-your-application/styling/css-in-js",
                      "collapsed": false
                    },
                    {
                      "text": "Sass",
                      "link": "/docs/app/building-your-application/styling/sass",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Optimizing",
                  "link": "/docs/app/building-your-application/optimizing/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Images",
                      "link": "/docs/app/building-your-application/optimizing/images",
                      "collapsed": false
                    },
                    {
                      "text": "Videos",
                      "link": "/docs/app/building-your-application/optimizing/videos",
                      "collapsed": false
                    },
                    {
                      "text": "Fonts",
                      "link": "/docs/app/building-your-application/optimizing/fonts",
                      "collapsed": false
                    },
                    {
                      "text": "Metadata",
                      "link": "/docs/app/building-your-application/optimizing/metadata",
                      "collapsed": false
                    },
                    {
                      "text": "Scripts",
                      "link": "/docs/app/building-your-application/optimizing/scripts",
                      "collapsed": false
                    },
                    {
                      "text": "Bundle Analyzer",
                      "link": "/docs/app/building-your-application/optimizing/bundle-analyzer",
                      "collapsed": false
                    },
                    {
                      "text": "Lazy Loading",
                      "link": "/docs/app/building-your-application/optimizing/lazy-loading",
                      "collapsed": false
                    },
                    {
                      "text": "Analytics",
                      "link": "/docs/app/building-your-application/optimizing/analytics",
                      "collapsed": false
                    },
                    {
                      "text": "Instrumentation",
                      "link": "/docs/app/building-your-application/optimizing/instrumentation",
                      "collapsed": false
                    },
                    {
                      "text": "Open Telemetry",
                      "link": "/docs/app/building-your-application/optimizing/open-telemetry",
                      "collapsed": false
                    },
                    {
                      "text": "Static Assets",
                      "link": "/docs/app/building-your-application/optimizing/static-assets",
                      "collapsed": false
                    },
                    {
                      "text": "Third Party Libraries",
                      "link": "/docs/app/building-your-application/optimizing/third-party-libraries",
                      "collapsed": false
                    },
                    {
                      "text": "Memory Usage",
                      "link": "/docs/app/building-your-application/optimizing/memory-usage",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Configuring",
                  "link": "/docs/app/building-your-application/configuring/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Typescript",
                      "link": "/docs/app/building-your-application/configuring/typescript",
                      "collapsed": false
                    },
                    {
                      "text": "Eslint",
                      "link": "/docs/app/building-your-application/configuring/eslint",
                      "collapsed": false
                    },
                    {
                      "text": "Environment Variables",
                      "link": "/docs/app/building-your-application/configuring/environment-variables",
                      "collapsed": false
                    },
                    {
                      "text": "Absolute Imports And Module Aliases",
                      "link": "/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases",
                      "collapsed": false
                    },
                    {
                      "text": "Mdx",
                      "link": "/docs/app/building-your-application/configuring/mdx",
                      "collapsed": false
                    },
                    {
                      "text": "Src Directory",
                      "link": "/docs/app/building-your-application/configuring/src-directory",
                      "collapsed": false
                    },
                    {
                      "text": "Draft Mode",
                      "link": "/docs/app/building-your-application/configuring/draft-mode",
                      "collapsed": false
                    },
                    {
                      "text": "Content Security Policy",
                      "link": "/docs/app/building-your-application/configuring/content-security-policy",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Testing",
                  "link": "/docs/app/building-your-application/testing/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Vitest",
                      "link": "/docs/app/building-your-application/testing/vitest",
                      "collapsed": false
                    },
                    {
                      "text": "Jest",
                      "link": "/docs/app/building-your-application/testing/jest",
                      "collapsed": false
                    },
                    {
                      "text": "Playwright",
                      "link": "/docs/app/building-your-application/testing/playwright",
                      "collapsed": false
                    },
                    {
                      "text": "Cypress",
                      "link": "/docs/app/building-your-application/testing/cypress",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Authentication",
                  "link": "/docs/app/building-your-application/authentication/",
                  "collapsed": true,
                  "items": []
                },
                {
                  "text": "Deploying",
                  "link": "/docs/app/building-your-application/deploying/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Production Checklist",
                      "link": "/docs/app/building-your-application/deploying/production-checklist",
                      "collapsed": false
                    },
                    {
                      "text": "Static Exports",
                      "link": "/docs/app/building-your-application/deploying/static-exports",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Upgrading",
                  "link": "/docs/app/building-your-application/upgrading/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Codemods",
                      "link": "/docs/app/building-your-application/upgrading/codemods",
                      "collapsed": false
                    },
                    {
                      "text": "App Router Migration",
                      "link": "/docs/app/building-your-application/upgrading/app-router-migration",
                      "collapsed": false
                    },
                    {
                      "text": "Version 14",
                      "link": "/docs/app/building-your-application/upgrading/version-14",
                      "collapsed": false
                    },
                    {
                      "text": "From Vite",
                      "link": "/docs/app/building-your-application/upgrading/from-vite",
                      "collapsed": false
                    },
                    {
                      "text": "From Create React App",
                      "link": "/docs/app/building-your-application/upgrading/from-create-react-app",
                      "collapsed": false
                    }
                  ]
                }
              ]
            },
            {
              "text": "Api Reference",
              "link": "/docs/app/api-reference/",
              "items": [
                {
                  "text": "Components",
                  "link": "/docs/app/api-reference/components/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Font",
                      "link": "/docs/app/api-reference/components/font",
                      "collapsed": false
                    },
                    {
                      "text": "Image",
                      "link": "/docs/app/api-reference/components/image",
                      "collapsed": false
                    },
                    {
                      "text": "Link",
                      "link": "/docs/app/api-reference/components/link",
                      "collapsed": false
                    },
                    {
                      "text": "Script",
                      "link": "/docs/app/api-reference/components/script",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "File Conventions",
                  "link": "/docs/app/api-reference/file-conventions/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Metadata",
                      "link": "/docs/app/api-reference/file-conventions/metadata/",
                      "collapsed": true,
                      "items": [
                        {
                          "text": "App Icons",
                          "link": "/docs/app/api-reference/file-conventions/metadata/app-icons",
                          "collapsed": false
                        },
                        {
                          "text": "Manifest",
                          "link": "/docs/app/api-reference/file-conventions/metadata/manifest",
                          "collapsed": false
                        },
                        {
                          "text": "Opengraph Image",
                          "link": "/docs/app/api-reference/file-conventions/metadata/opengraph-image",
                          "collapsed": false
                        },
                        {
                          "text": "Robots",
                          "link": "/docs/app/api-reference/file-conventions/metadata/robots",
                          "collapsed": false
                        },
                        {
                          "text": "Sitemap",
                          "link": "/docs/app/api-reference/file-conventions/metadata/sitemap",
                          "collapsed": false
                        }
                      ]
                    },
                    {
                      "text": "Default",
                      "link": "/docs/app/api-reference/file-conventions/default",
                      "collapsed": false
                    },
                    {
                      "text": "Error",
                      "link": "/docs/app/api-reference/file-conventions/error",
                      "collapsed": false
                    },
                    {
                      "text": "Instrumentation",
                      "link": "/docs/app/api-reference/file-conventions/instrumentation",
                      "collapsed": false
                    },
                    {
                      "text": "Layout",
                      "link": "/docs/app/api-reference/file-conventions/layout",
                      "collapsed": false
                    },
                    {
                      "text": "Loading",
                      "link": "/docs/app/api-reference/file-conventions/loading",
                      "collapsed": false
                    },
                    {
                      "text": "Mdx Components",
                      "link": "/docs/app/api-reference/file-conventions/mdx-components",
                      "collapsed": false
                    },
                    {
                      "text": "Middleware",
                      "link": "/docs/app/api-reference/file-conventions/middleware",
                      "collapsed": false
                    },
                    {
                      "text": "Not Found",
                      "link": "/docs/app/api-reference/file-conventions/not-found",
                      "collapsed": false
                    },
                    {
                      "text": "Page",
                      "link": "/docs/app/api-reference/file-conventions/page",
                      "collapsed": false
                    },
                    {
                      "text": "Route Segment Config",
                      "link": "/docs/app/api-reference/file-conventions/route-segment-config",
                      "collapsed": false
                    },
                    {
                      "text": "Route",
                      "link": "/docs/app/api-reference/file-conventions/route",
                      "collapsed": false
                    },
                    {
                      "text": "Template",
                      "link": "/docs/app/api-reference/file-conventions/template",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Functions",
                  "link": "/docs/app/api-reference/functions/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Cookies",
                      "link": "/docs/app/api-reference/functions/cookies",
                      "collapsed": false
                    },
                    {
                      "text": "Draft Mode",
                      "link": "/docs/app/api-reference/functions/draft-mode",
                      "collapsed": false
                    },
                    {
                      "text": "Fetch",
                      "link": "/docs/app/api-reference/functions/fetch",
                      "collapsed": false
                    },
                    {
                      "text": "Generate Image Metadata",
                      "link": "/docs/app/api-reference/functions/generate-image-metadata",
                      "collapsed": false
                    },
                    {
                      "text": "Generate Metadata",
                      "link": "/docs/app/api-reference/functions/generate-metadata",
                      "collapsed": false
                    },
                    {
                      "text": "Generate Sitemaps",
                      "link": "/docs/app/api-reference/functions/generate-sitemaps",
                      "collapsed": false
                    },
                    {
                      "text": "Generate Static Params",
                      "link": "/docs/app/api-reference/functions/generate-static-params",
                      "collapsed": false
                    },
                    {
                      "text": "Generate Viewport",
                      "link": "/docs/app/api-reference/functions/generate-viewport",
                      "collapsed": false
                    },
                    {
                      "text": "Headers",
                      "link": "/docs/app/api-reference/functions/headers",
                      "collapsed": false
                    },
                    {
                      "text": "Image Response",
                      "link": "/docs/app/api-reference/functions/image-response",
                      "collapsed": false
                    },
                    {
                      "text": "Next Request",
                      "link": "/docs/app/api-reference/functions/next-request",
                      "collapsed": false
                    },
                    {
                      "text": "Next Response",
                      "link": "/docs/app/api-reference/functions/next-response",
                      "collapsed": false
                    },
                    {
                      "text": "Not Found",
                      "link": "/docs/app/api-reference/functions/not-found",
                      "collapsed": false
                    },
                    {
                      "text": "PermanentRedirect",
                      "link": "/docs/app/api-reference/functions/permanentRedirect",
                      "collapsed": false
                    },
                    {
                      "text": "Redirect",
                      "link": "/docs/app/api-reference/functions/redirect",
                      "collapsed": false
                    },
                    {
                      "text": "RevalidatePath",
                      "link": "/docs/app/api-reference/functions/revalidatePath",
                      "collapsed": false
                    },
                    {
                      "text": "RevalidateTag",
                      "link": "/docs/app/api-reference/functions/revalidateTag",
                      "collapsed": false
                    },
                    {
                      "text": "Unstable_cache",
                      "link": "/docs/app/api-reference/functions/unstable_cache",
                      "collapsed": false
                    },
                    {
                      "text": "Unstable_noStore",
                      "link": "/docs/app/api-reference/functions/unstable_noStore",
                      "collapsed": false
                    },
                    {
                      "text": "Use Params",
                      "link": "/docs/app/api-reference/functions/use-params",
                      "collapsed": false
                    },
                    {
                      "text": "Use Pathname",
                      "link": "/docs/app/api-reference/functions/use-pathname",
                      "collapsed": false
                    },
                    {
                      "text": "Use Report Web Vitals",
                      "link": "/docs/app/api-reference/functions/use-report-web-vitals",
                      "collapsed": false
                    },
                    {
                      "text": "Use Router",
                      "link": "/docs/app/api-reference/functions/use-router",
                      "collapsed": false
                    },
                    {
                      "text": "Use Search Params",
                      "link": "/docs/app/api-reference/functions/use-search-params",
                      "collapsed": false
                    },
                    {
                      "text": "Use Selected Layout Segment",
                      "link": "/docs/app/api-reference/functions/use-selected-layout-segment",
                      "collapsed": false
                    },
                    {
                      "text": "Use Selected Layout Segments",
                      "link": "/docs/app/api-reference/functions/use-selected-layout-segments",
                      "collapsed": false
                    },
                    {
                      "text": "UserAgent",
                      "link": "/docs/app/api-reference/functions/userAgent",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Next Config Js",
                  "link": "/docs/app/api-reference/next-config-js/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "AppDir",
                      "link": "/docs/app/api-reference/next-config-js/appDir",
                      "collapsed": false
                    },
                    {
                      "text": "AssetPrefix",
                      "link": "/docs/app/api-reference/next-config-js/assetPrefix",
                      "collapsed": false
                    },
                    {
                      "text": "BasePath",
                      "link": "/docs/app/api-reference/next-config-js/basePath",
                      "collapsed": false
                    },
                    {
                      "text": "Compress",
                      "link": "/docs/app/api-reference/next-config-js/compress",
                      "collapsed": false
                    },
                    {
                      "text": "CrossOrigin",
                      "link": "/docs/app/api-reference/next-config-js/crossOrigin",
                      "collapsed": false
                    },
                    {
                      "text": "DevIndicators",
                      "link": "/docs/app/api-reference/next-config-js/devIndicators",
                      "collapsed": false
                    },
                    {
                      "text": "DistDir",
                      "link": "/docs/app/api-reference/next-config-js/distDir",
                      "collapsed": false
                    },
                    {
                      "text": "Env",
                      "link": "/docs/app/api-reference/next-config-js/env",
                      "collapsed": false
                    },
                    {
                      "text": "Eslint",
                      "link": "/docs/app/api-reference/next-config-js/eslint",
                      "collapsed": false
                    },
                    {
                      "text": "ExportPathMap",
                      "link": "/docs/app/api-reference/next-config-js/exportPathMap",
                      "collapsed": false
                    },
                    {
                      "text": "GenerateBuildId",
                      "link": "/docs/app/api-reference/next-config-js/generateBuildId",
                      "collapsed": false
                    },
                    {
                      "text": "GenerateEtags",
                      "link": "/docs/app/api-reference/next-config-js/generateEtags",
                      "collapsed": false
                    },
                    {
                      "text": "Headers",
                      "link": "/docs/app/api-reference/next-config-js/headers",
                      "collapsed": false
                    },
                    {
                      "text": "HttpAgentOptions",
                      "link": "/docs/app/api-reference/next-config-js/httpAgentOptions",
                      "collapsed": false
                    },
                    {
                      "text": "Images",
                      "link": "/docs/app/api-reference/next-config-js/images",
                      "collapsed": false
                    },
                    {
                      "text": "IncrementalCacheHandlerPath",
                      "link": "/docs/app/api-reference/next-config-js/incrementalCacheHandlerPath",
                      "collapsed": false
                    },
                    {
                      "text": "InstrumentationHook",
                      "link": "/docs/app/api-reference/next-config-js/instrumentationHook",
                      "collapsed": false
                    },
                    {
                      "text": "Logging",
                      "link": "/docs/app/api-reference/next-config-js/logging",
                      "collapsed": false
                    },
                    {
                      "text": "MdxRs",
                      "link": "/docs/app/api-reference/next-config-js/mdxRs",
                      "collapsed": false
                    },
                    {
                      "text": "OnDemandEntries",
                      "link": "/docs/app/api-reference/next-config-js/onDemandEntries",
                      "collapsed": false
                    },
                    {
                      "text": "OptimizePackageImports",
                      "link": "/docs/app/api-reference/next-config-js/optimizePackageImports",
                      "collapsed": false
                    },
                    {
                      "text": "Output",
                      "link": "/docs/app/api-reference/next-config-js/output",
                      "collapsed": false
                    },
                    {
                      "text": "PageExtensions",
                      "link": "/docs/app/api-reference/next-config-js/pageExtensions",
                      "collapsed": false
                    },
                    {
                      "text": "Partial Prerendering",
                      "link": "/docs/app/api-reference/next-config-js/partial-prerendering",
                      "collapsed": false
                    },
                    {
                      "text": "PoweredByHeader",
                      "link": "/docs/app/api-reference/next-config-js/poweredByHeader",
                      "collapsed": false
                    },
                    {
                      "text": "ProductionBrowserSourceMaps",
                      "link": "/docs/app/api-reference/next-config-js/productionBrowserSourceMaps",
                      "collapsed": false
                    },
                    {
                      "text": "ReactStrictMode",
                      "link": "/docs/app/api-reference/next-config-js/reactStrictMode",
                      "collapsed": false
                    },
                    {
                      "text": "Redirects",
                      "link": "/docs/app/api-reference/next-config-js/redirects",
                      "collapsed": false
                    },
                    {
                      "text": "Rewrites",
                      "link": "/docs/app/api-reference/next-config-js/rewrites",
                      "collapsed": false
                    },
                    {
                      "text": "ServerActions",
                      "link": "/docs/app/api-reference/next-config-js/serverActions",
                      "collapsed": false
                    },
                    {
                      "text": "ServerExternalPackages",
                      "link": "/docs/app/api-reference/next-config-js/serverExternalPackages",
                      "collapsed": false
                    },
                    {
                      "text": "StaleTimes",
                      "link": "/docs/app/api-reference/next-config-js/staleTimes",
                      "collapsed": false
                    },
                    {
                      "text": "TrailingSlash",
                      "link": "/docs/app/api-reference/next-config-js/trailingSlash",
                      "collapsed": false
                    },
                    {
                      "text": "TranspilePackages",
                      "link": "/docs/app/api-reference/next-config-js/transpilePackages",
                      "collapsed": false
                    },
                    {
                      "text": "Turbo",
                      "link": "/docs/app/api-reference/next-config-js/turbo",
                      "collapsed": false
                    },
                    {
                      "text": "TypedRoutes",
                      "link": "/docs/app/api-reference/next-config-js/typedRoutes",
                      "collapsed": false
                    },
                    {
                      "text": "Typescript",
                      "link": "/docs/app/api-reference/next-config-js/typescript",
                      "collapsed": false
                    },
                    {
                      "text": "UrlImports",
                      "link": "/docs/app/api-reference/next-config-js/urlImports",
                      "collapsed": false
                    },
                    {
                      "text": "WebVitalsAttribution",
                      "link": "/docs/app/api-reference/next-config-js/webVitalsAttribution",
                      "collapsed": false
                    },
                    {
                      "text": "Webpack",
                      "link": "/docs/app/api-reference/next-config-js/webpack",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Create Next App",
                  "link": "/docs/app/api-reference/create-next-app",
                  "collapsed": false
                },
                {
                  "text": "Edge",
                  "link": "/docs/app/api-reference/edge",
                  "collapsed": false
                },
                {
                  "text": "Next Cli",
                  "link": "/docs/app/api-reference/next-cli",
                  "collapsed": false
                }
              ]
            }
          ]
        },
        {
          "text": "Pages Router",
          "link": "/docs/pages/",
          "collapsed": true,
          "items": [
            {
              "text": "Building Your Application",
              "link": "/docs/pages/building-your-application/",
              "collapsed": true,
              "items": [
                {
                  "text": "Routing",
                  "link": "/docs/pages/building-your-application/routing/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Pages And Layouts",
                      "link": "/docs/pages/building-your-application/routing/pages-and-layouts",
                      "collapsed": false
                    },
                    {
                      "text": "Dynamic Routes",
                      "link": "/docs/pages/building-your-application/routing/dynamic-routes",
                      "collapsed": false
                    },
                    {
                      "text": "Linking And Navigating",
                      "link": "/docs/pages/building-your-application/routing/linking-and-navigating",
                      "collapsed": false
                    },
                    {
                      "text": "Redirecting",
                      "link": "/docs/pages/building-your-application/routing/redirecting",
                      "collapsed": false
                    },
                    {
                      "text": "Custom App",
                      "link": "/docs/pages/building-your-application/routing/custom-app",
                      "collapsed": false
                    },
                    {
                      "text": "Custom Document",
                      "link": "/docs/pages/building-your-application/routing/custom-document",
                      "collapsed": false
                    },
                    {
                      "text": "Api Routes",
                      "link": "/docs/pages/building-your-application/routing/api-routes",
                      "collapsed": false
                    },
                    {
                      "text": "Custom Error",
                      "link": "/docs/pages/building-your-application/routing/custom-error",
                      "collapsed": false
                    },
                    {
                      "text": "Internationalization",
                      "link": "/docs/pages/building-your-application/routing/internationalization",
                      "collapsed": false
                    },
                    {
                      "text": "Middleware",
                      "link": "/docs/pages/building-your-application/routing/middleware",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Rendering",
                  "link": "/docs/pages/building-your-application/rendering/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Server Side Rendering",
                      "link": "/docs/pages/building-your-application/rendering/server-side-rendering",
                      "collapsed": false
                    },
                    {
                      "text": "Static Site Generation",
                      "link": "/docs/pages/building-your-application/rendering/static-site-generation",
                      "collapsed": false
                    },
                    {
                      "text": "Automatic Static Optimization",
                      "link": "/docs/pages/building-your-application/rendering/automatic-static-optimization",
                      "collapsed": false
                    },
                    {
                      "text": "Client Side Rendering",
                      "link": "/docs/pages/building-your-application/rendering/client-side-rendering",
                      "collapsed": false
                    },
                    {
                      "text": "Edge And Nodejs Runtimes",
                      "link": "/docs/pages/building-your-application/rendering/edge-and-nodejs-runtimes",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Data Fetching",
                  "link": "/docs/pages/building-your-application/data-fetching/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Get Static Props",
                      "link": "/docs/pages/building-your-application/data-fetching/get-static-props",
                      "collapsed": false
                    },
                    {
                      "text": "Get Static Paths",
                      "link": "/docs/pages/building-your-application/data-fetching/get-static-paths",
                      "collapsed": false
                    },
                    {
                      "text": "Forms And Mutations",
                      "link": "/docs/pages/building-your-application/data-fetching/forms-and-mutations",
                      "collapsed": false
                    },
                    {
                      "text": "Get Server Side Props",
                      "link": "/docs/pages/building-your-application/data-fetching/get-server-side-props",
                      "collapsed": false
                    },
                    {
                      "text": "Incremental Static Regeneration",
                      "link": "/docs/pages/building-your-application/data-fetching/incremental-static-regeneration",
                      "collapsed": false
                    },
                    {
                      "text": "Client Side",
                      "link": "/docs/pages/building-your-application/data-fetching/client-side",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Styling",
                  "link": "/docs/pages/building-your-application/styling/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Css Modules",
                      "link": "/docs/pages/building-your-application/styling/css-modules",
                      "collapsed": false
                    },
                    {
                      "text": "Tailwind Css",
                      "link": "/docs/pages/building-your-application/styling/tailwind-css",
                      "collapsed": false
                    },
                    {
                      "text": "Css In Js",
                      "link": "/docs/pages/building-your-application/styling/css-in-js",
                      "collapsed": false
                    },
                    {
                      "text": "Sass",
                      "link": "/docs/pages/building-your-application/styling/sass",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Optimizing",
                  "link": "/docs/pages/building-your-application/optimizing/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Images",
                      "link": "/docs/pages/building-your-application/optimizing/images",
                      "collapsed": false
                    },
                    {
                      "text": "Fonts",
                      "link": "/docs/pages/building-your-application/optimizing/fonts",
                      "collapsed": false
                    },
                    {
                      "text": "Scripts",
                      "link": "/docs/pages/building-your-application/optimizing/scripts",
                      "collapsed": false
                    },
                    {
                      "text": "Static Assets",
                      "link": "/docs/pages/building-your-application/optimizing/static-assets",
                      "collapsed": false
                    },
                    {
                      "text": "Bundle Analyzer",
                      "link": "/docs/pages/building-your-application/optimizing/bundle-analyzer",
                      "collapsed": false
                    },
                    {
                      "text": "Analytics",
                      "link": "/docs/pages/building-your-application/optimizing/analytics",
                      "collapsed": false
                    },
                    {
                      "text": "Lazy Loading",
                      "link": "/docs/pages/building-your-application/optimizing/lazy-loading",
                      "collapsed": false
                    },
                    {
                      "text": "Instrumentation",
                      "link": "/docs/pages/building-your-application/optimizing/instrumentation",
                      "collapsed": false
                    },
                    {
                      "text": "Open Telemetry",
                      "link": "/docs/pages/building-your-application/optimizing/open-telemetry",
                      "collapsed": false
                    },
                    {
                      "text": "Third Party Libraries",
                      "link": "/docs/pages/building-your-application/optimizing/third-party-libraries",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Configuring",
                  "link": "/docs/pages/building-your-application/configuring/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Typescript",
                      "link": "/docs/pages/building-your-application/configuring/typescript",
                      "collapsed": false
                    },
                    {
                      "text": "Eslint",
                      "link": "/docs/pages/building-your-application/configuring/eslint",
                      "collapsed": false
                    },
                    {
                      "text": "Environment Variables",
                      "link": "/docs/pages/building-your-application/configuring/environment-variables",
                      "collapsed": false
                    },
                    {
                      "text": "Absolute Imports And Module Aliases",
                      "link": "/docs/pages/building-your-application/configuring/absolute-imports-and-module-aliases",
                      "collapsed": false
                    },
                    {
                      "text": "Src Directory",
                      "link": "/docs/pages/building-your-application/configuring/src-directory",
                      "collapsed": false
                    },
                    {
                      "text": "Mdx",
                      "link": "/docs/pages/building-your-application/configuring/mdx",
                      "collapsed": false
                    },
                    {
                      "text": "Amp",
                      "link": "/docs/pages/building-your-application/configuring/amp",
                      "collapsed": false
                    },
                    {
                      "text": "Babel",
                      "link": "/docs/pages/building-your-application/configuring/babel",
                      "collapsed": false
                    },
                    {
                      "text": "Post Css",
                      "link": "/docs/pages/building-your-application/configuring/post-css",
                      "collapsed": false
                    },
                    {
                      "text": "Custom Server",
                      "link": "/docs/pages/building-your-application/configuring/custom-server",
                      "collapsed": false
                    },
                    {
                      "text": "Draft Mode",
                      "link": "/docs/pages/building-your-application/configuring/draft-mode",
                      "collapsed": false
                    },
                    {
                      "text": "Error Handling",
                      "link": "/docs/pages/building-your-application/configuring/error-handling",
                      "collapsed": false
                    },
                    {
                      "text": "Debugging",
                      "link": "/docs/pages/building-your-application/configuring/debugging",
                      "collapsed": false
                    },
                    {
                      "text": "Preview Mode",
                      "link": "/docs/pages/building-your-application/configuring/preview-mode",
                      "collapsed": false
                    },
                    {
                      "text": "Content Security Policy",
                      "link": "/docs/pages/building-your-application/configuring/content-security-policy",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Testing",
                  "link": "/docs/pages/building-your-application/testing/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Vitest",
                      "link": "/docs/pages/building-your-application/testing/vitest",
                      "collapsed": false
                    },
                    {
                      "text": "Jest",
                      "link": "/docs/pages/building-your-application/testing/jest",
                      "collapsed": false
                    },
                    {
                      "text": "Playwright",
                      "link": "/docs/pages/building-your-application/testing/playwright",
                      "collapsed": false
                    },
                    {
                      "text": "Cypress",
                      "link": "/docs/pages/building-your-application/testing/cypress",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Authentication",
                  "link": "/docs/pages/building-your-application/authentication/",
                  "collapsed": true,
                  "items": []
                },
                {
                  "text": "Deploying",
                  "link": "/docs/pages/building-your-application/deploying/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Production Checklist",
                      "link": "/docs/pages/building-your-application/deploying/production-checklist",
                      "collapsed": false
                    },
                    {
                      "text": "Static Exports",
                      "link": "/docs/pages/building-your-application/deploying/static-exports",
                      "collapsed": false
                    },
                    {
                      "text": "Multi Zones",
                      "link": "/docs/pages/building-your-application/deploying/multi-zones",
                      "collapsed": false
                    },
                    {
                      "text": "Ci Build Caching",
                      "link": "/docs/pages/building-your-application/deploying/ci-build-caching",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Upgrading",
                  "link": "/docs/pages/building-your-application/upgrading/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Codemods",
                      "link": "/docs/pages/building-your-application/upgrading/codemods",
                      "collapsed": false
                    },
                    {
                      "text": "App Router Migration",
                      "link": "/docs/pages/building-your-application/upgrading/app-router-migration",
                      "collapsed": false
                    },
                    {
                      "text": "From Vite",
                      "link": "/docs/pages/building-your-application/upgrading/from-vite",
                      "collapsed": false
                    },
                    {
                      "text": "From Create React App",
                      "link": "/docs/pages/building-your-application/upgrading/from-create-react-app",
                      "collapsed": false
                    },
                    {
                      "text": "Version 14",
                      "link": "/docs/pages/building-your-application/upgrading/version-14",
                      "collapsed": false
                    },
                    {
                      "text": "Version 13",
                      "link": "/docs/pages/building-your-application/upgrading/version-13",
                      "collapsed": false
                    },
                    {
                      "text": "Version 12",
                      "link": "/docs/pages/building-your-application/upgrading/version-12",
                      "collapsed": false
                    },
                    {
                      "text": "Version 11",
                      "link": "/docs/pages/building-your-application/upgrading/version-11",
                      "collapsed": false
                    },
                    {
                      "text": "Version 10",
                      "link": "/docs/pages/building-your-application/upgrading/version-10",
                      "collapsed": false
                    },
                    {
                      "text": "Version 9",
                      "link": "/docs/pages/building-your-application/upgrading/version-9",
                      "collapsed": false
                    }
                  ]
                }
              ]
            },
            {
              "text": "Api Reference",
              "link": "/docs/pages/api-reference/",
              "collapsed": true,
              "items": [
                {
                  "text": "Components",
                  "link": "/docs/pages/api-reference/components/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Font",
                      "link": "/docs/pages/api-reference/components/font",
                      "collapsed": false
                    },
                    {
                      "text": "Head",
                      "link": "/docs/pages/api-reference/components/head",
                      "collapsed": false
                    },
                    {
                      "text": "Image Legacy",
                      "link": "/docs/pages/api-reference/components/image-legacy",
                      "collapsed": false
                    },
                    {
                      "text": "Image",
                      "link": "/docs/pages/api-reference/components/image",
                      "collapsed": false
                    },
                    {
                      "text": "Link",
                      "link": "/docs/pages/api-reference/components/link",
                      "collapsed": false
                    },
                    {
                      "text": "Script",
                      "link": "/docs/pages/api-reference/components/script",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Functions",
                  "link": "/docs/pages/api-reference/functions/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Get Initial Props",
                      "link": "/docs/pages/api-reference/functions/get-initial-props",
                      "collapsed": false
                    },
                    {
                      "text": "Get Server Side Props",
                      "link": "/docs/pages/api-reference/functions/get-server-side-props",
                      "collapsed": false
                    },
                    {
                      "text": "Get Static Paths",
                      "link": "/docs/pages/api-reference/functions/get-static-paths",
                      "collapsed": false
                    },
                    {
                      "text": "Get Static Props",
                      "link": "/docs/pages/api-reference/functions/get-static-props",
                      "collapsed": false
                    },
                    {
                      "text": "Next Request",
                      "link": "/docs/pages/api-reference/functions/next-request",
                      "collapsed": false
                    },
                    {
                      "text": "Next Response",
                      "link": "/docs/pages/api-reference/functions/next-response",
                      "collapsed": false
                    },
                    {
                      "text": "Use Amp",
                      "link": "/docs/pages/api-reference/functions/use-amp",
                      "collapsed": false
                    },
                    {
                      "text": "Use Report Web Vitals",
                      "link": "/docs/pages/api-reference/functions/use-report-web-vitals",
                      "collapsed": false
                    },
                    {
                      "text": "Use Router",
                      "link": "/docs/pages/api-reference/functions/use-router",
                      "collapsed": false
                    },
                    {
                      "text": "UserAgent",
                      "link": "/docs/pages/api-reference/functions/userAgent",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Next Config Js",
                  "link": "/docs/pages/api-reference/next-config-js/",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "AssetPrefix",
                      "link": "/docs/pages/api-reference/next-config-js/assetPrefix",
                      "collapsed": false
                    },
                    {
                      "text": "BasePath",
                      "link": "/docs/pages/api-reference/next-config-js/basePath",
                      "collapsed": false
                    },
                    {
                      "text": "BundlePagesRouterDependencies",
                      "link": "/docs/pages/api-reference/next-config-js/bundlePagesRouterDependencies",
                      "collapsed": false
                    },
                    {
                      "text": "Compress",
                      "link": "/docs/pages/api-reference/next-config-js/compress",
                      "collapsed": false
                    },
                    {
                      "text": "CrossOrigin",
                      "link": "/docs/pages/api-reference/next-config-js/crossOrigin",
                      "collapsed": false
                    },
                    {
                      "text": "DevIndicators",
                      "link": "/docs/pages/api-reference/next-config-js/devIndicators",
                      "collapsed": false
                    },
                    {
                      "text": "DistDir",
                      "link": "/docs/pages/api-reference/next-config-js/distDir",
                      "collapsed": false
                    },
                    {
                      "text": "Env",
                      "link": "/docs/pages/api-reference/next-config-js/env",
                      "collapsed": false
                    },
                    {
                      "text": "Eslint",
                      "link": "/docs/pages/api-reference/next-config-js/eslint",
                      "collapsed": false
                    },
                    {
                      "text": "ExportPathMap",
                      "link": "/docs/pages/api-reference/next-config-js/exportPathMap",
                      "collapsed": false
                    },
                    {
                      "text": "GenerateBuildId",
                      "link": "/docs/pages/api-reference/next-config-js/generateBuildId",
                      "collapsed": false
                    },
                    {
                      "text": "GenerateEtags",
                      "link": "/docs/pages/api-reference/next-config-js/generateEtags",
                      "collapsed": false
                    },
                    {
                      "text": "Headers",
                      "link": "/docs/pages/api-reference/next-config-js/headers",
                      "collapsed": false
                    },
                    {
                      "text": "HttpAgentOptions",
                      "link": "/docs/pages/api-reference/next-config-js/httpAgentOptions",
                      "collapsed": false
                    },
                    {
                      "text": "Images",
                      "link": "/docs/pages/api-reference/next-config-js/images",
                      "collapsed": false
                    },
                    {
                      "text": "InstrumentationHook",
                      "link": "/docs/pages/api-reference/next-config-js/instrumentationHook",
                      "collapsed": false
                    },
                    {
                      "text": "OnDemandEntries",
                      "link": "/docs/pages/api-reference/next-config-js/onDemandEntries",
                      "collapsed": false
                    },
                    {
                      "text": "OptimizePackageImports",
                      "link": "/docs/pages/api-reference/next-config-js/optimizePackageImports",
                      "collapsed": false
                    },
                    {
                      "text": "Output",
                      "link": "/docs/pages/api-reference/next-config-js/output",
                      "collapsed": false
                    },
                    {
                      "text": "PageExtensions",
                      "link": "/docs/pages/api-reference/next-config-js/pageExtensions",
                      "collapsed": false
                    },
                    {
                      "text": "PoweredByHeader",
                      "link": "/docs/pages/api-reference/next-config-js/poweredByHeader",
                      "collapsed": false
                    },
                    {
                      "text": "ProductionBrowserSourceMaps",
                      "link": "/docs/pages/api-reference/next-config-js/productionBrowserSourceMaps",
                      "collapsed": false
                    },
                    {
                      "text": "ReactStrictMode",
                      "link": "/docs/pages/api-reference/next-config-js/reactStrictMode",
                      "collapsed": false
                    },
                    {
                      "text": "Redirects",
                      "link": "/docs/pages/api-reference/next-config-js/redirects",
                      "collapsed": false
                    },
                    {
                      "text": "Rewrites",
                      "link": "/docs/pages/api-reference/next-config-js/rewrites",
                      "collapsed": false
                    },
                    {
                      "text": "Runtime Configuration",
                      "link": "/docs/pages/api-reference/next-config-js/runtime-configuration",
                      "collapsed": false
                    },
                    {
                      "text": "ServerExternalPackages",
                      "link": "/docs/pages/api-reference/next-config-js/serverExternalPackages",
                      "collapsed": false
                    },
                    {
                      "text": "TrailingSlash",
                      "link": "/docs/pages/api-reference/next-config-js/trailingSlash",
                      "collapsed": false
                    },
                    {
                      "text": "TranspilePackages",
                      "link": "/docs/pages/api-reference/next-config-js/transpilePackages",
                      "collapsed": false
                    },
                    {
                      "text": "Turbo",
                      "link": "/docs/pages/api-reference/next-config-js/turbo",
                      "collapsed": false
                    },
                    {
                      "text": "Typescript",
                      "link": "/docs/pages/api-reference/next-config-js/typescript",
                      "collapsed": false
                    },
                    {
                      "text": "UrlImports",
                      "link": "/docs/pages/api-reference/next-config-js/urlImports",
                      "collapsed": false
                    },
                    {
                      "text": "WebVitalsAttribution",
                      "link": "/docs/pages/api-reference/next-config-js/webVitalsAttribution",
                      "collapsed": false
                    },
                    {
                      "text": "Webpack",
                      "link": "/docs/pages/api-reference/next-config-js/webpack",
                      "collapsed": false
                    }
                  ]
                },
                {
                  "text": "Create Next App",
                  "link": "/docs/pages/api-reference/create-next-app",
                  "collapsed": false
                },
                {
                  "text": "Next Cli",
                  "link": "/docs/pages/api-reference/next-cli",
                  "collapsed": false
                },
                {
                  "text": "Edge",
                  "link": "/docs/pages/api-reference/edge",
                  "collapsed": false
                }
              ]
            }
          ]
        },
        {
          "text": "Architecture",
          "link": "/docs/architecture/",
          "items": [
            {
              "text": "Accessibility",
              "link": "/docs/architecture/accessibility",
            },
            {
              "text": "Fast Refresh",
              "link": "/docs/architecture/fast-refresh",
            },
            {
              "text": "Nextjs Compiler",
              "link": "/docs/architecture/nextjs-compiler",
            },
            {
              "text": "Supported Browsers",
              "link": "/docs/architecture/supported-browsers",
            },
            {
              "text": "Turbopack",
              "link": "/docs/architecture/turbopack",
            }
          ]
        },
        {
          "text": "Community",
          "link": "/docs/community/",
          "items": [
            {
              "text": "Contribution Guide",
              "link": "/docs/community/contribution-guide",
            }
          ]
        }
      ],
  }
})
