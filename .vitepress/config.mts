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
      level: [2, 3, 4, 5, 6]
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
    
    sidebar:
      [
        {
          "text": "Getting Started",
          "link": "/docs/getting-started/",
          "items": [
            {
              "text": "Installation",
              "link": "/docs/getting-started/installation"
            },
            {
              "text": "Project Structure",
              "link": "/docs/getting-started/project-structure"
            }
          ]
        },
        {
          "text": "App",
          "link": "/docs/app/",
          "items": [
            {
              "text": "Building Your Application",
              "link": "/docs/app/building-your-application/",
              "items": [
                {
                  "text": "Routing",
                  "collapsed": true,
                  "link": "/docs/app/building-your-application/routing/",
                  "items": [
                    {
                      "text": "Defining Routes",
                      "link": "/docs/app/building-your-application/routing/defining-routes"
                    },
                    {
                      "text": "Pages",
                      "link": "/docs/app/building-your-application/routing/pages"
                    },
                    {
                      "text": "Layouts And Templates",
                      "link": "/docs/app/building-your-application/routing/layouts-and-templates"
                    },
                    {
                      "text": "Linking And Navigating",
                      "link": "/docs/app/building-your-application/routing/linking-and-navigating"
                    },
                    {
                      "text": "Error Handling",
                      "link": "/docs/app/building-your-application/routing/error-handling"
                    },
                    {
                      "text": "Loading Ui And Streaming",
                      "link": "/docs/app/building-your-application/routing/loading-ui-and-streaming"
                    },
                    {
                      "text": "Redirecting",
                      "link": "/docs/app/building-your-application/routing/redirecting"
                    },
                    {
                      "text": "Route Groups",
                      "link": "/docs/app/building-your-application/routing/route-groups"
                    },
                    {
                      "text": "Colocation",
                      "link": "/docs/app/building-your-application/routing/colocation"
                    },
                    {
                      "text": "Dynamic Routes",
                      "link": "/docs/app/building-your-application/routing/dynamic-routes"
                    },
                    {
                      "text": "Parallel Routes",
                      "link": "/docs/app/building-your-application/routing/parallel-routes"
                    },
                    {
                      "text": "Intercepting Routes",
                      "link": "/docs/app/building-your-application/routing/intercepting-routes"
                    },
                    {
                      "text": "Route Handlers",
                      "link": "/docs/app/building-your-application/routing/route-handlers"
                    },
                    {
                      "text": "Middleware",
                      "link": "/docs/app/building-your-application/routing/middleware"
                    },
                    {
                      "text": "Internationalization",
                      "link": "/docs/app/building-your-application/routing/internationalization"
                    }
                  ]
                },
                {
                  "text": "Data Fetching",
                  "collapsed": true,
                  "link": "/docs/app/building-your-application/data-fetching/",
                  "items": [
                    {
                      "text": "Fetching Caching And Revalidating",
                      "link": "/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating"
                    },
                    {
                      "text": "Server Actions And Mutations",
                      "link": "/docs/app/building-your-application/data-fetching/server-actions-and-mutations"
                    },
                    {
                      "text": "Patterns",
                      "link": "/docs/app/building-your-application/data-fetching/patterns"
                    }
                  ]
                },
                {
                  "text": "Rendering",
                  "collapsed": true,
                  "link": "/docs/app/building-your-application/rendering/",
                  "items": [
                    {
                      "text": "Server Components",
                      "link": "/docs/app/building-your-application/rendering/server-components"
                    },
                    {
                      "text": "Client Components",
                      "link": "/docs/app/building-your-application/rendering/client-components"
                    },
                    {
                      "text": "Composition Patterns",
                      "link": "/docs/app/building-your-application/rendering/composition-patterns"
                    },
                    {
                      "text": "Edge And Nodejs Runtimes",
                      "link": "/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes"
                    }
                  ]
                },
                {
                  "text": "Caching",
                  "collapsed": true,
                  "link": "/docs/app/building-your-application/caching/",
                  "items": []
                },
                {
                  "text": "Styling",
                  "collapsed": true,
                  "link": "/docs/app/building-your-application/styling/",
                  "items": [
                    {
                      "text": "Css Modules",
                      "link": "/docs/app/building-your-application/styling/css-modules"
                    },
                    {
                      "text": "Tailwind Css",
                      "link": "/docs/app/building-your-application/styling/tailwind-css"
                    },
                    {
                      "text": "Css In Js",
                      "link": "/docs/app/building-your-application/styling/css-in-js"
                    },
                    {
                      "text": "Sass",
                      "link": "/docs/app/building-your-application/styling/sass"
                    }
                  ]
                },
                {
                  "text": "Optimizing",
                  "collapsed": true,
                  "link": "/docs/app/building-your-application/optimizing/",
                  "items": [
                    {
                      "text": "Images",
                      "link": "/docs/app/building-your-application/optimizing/images"
                    },
                    {
                      "text": "Videos",
                      "link": "/docs/app/building-your-application/optimizing/videos"
                    },
                    {
                      "text": "Fonts",
                      "link": "/docs/app/building-your-application/optimizing/fonts"
                    },
                    {
                      "text": "Metadata",
                      "link": "/docs/app/building-your-application/optimizing/metadata"
                    },
                    {
                      "text": "Scripts",
                      "link": "/docs/app/building-your-application/optimizing/scripts"
                    },
                    {
                      "text": "Bundle Analyzer",
                      "link": "/docs/app/building-your-application/optimizing/bundle-analyzer"
                    },
                    {
                      "text": "Lazy Loading",
                      "link": "/docs/app/building-your-application/optimizing/lazy-loading"
                    },
                    {
                      "text": "Analytics",
                      "link": "/docs/app/building-your-application/optimizing/analytics"
                    },
                    {
                      "text": "Instrumentation",
                      "link": "/docs/app/building-your-application/optimizing/instrumentation"
                    },
                    {
                      "text": "Open Telemetry",
                      "link": "/docs/app/building-your-application/optimizing/open-telemetry"
                    },
                    {
                      "text": "Static Assets",
                      "link": "/docs/app/building-your-application/optimizing/static-assets"
                    },
                    {
                      "text": "Third Party Libraries",
                      "link": "/docs/app/building-your-application/optimizing/third-party-libraries"
                    },
                    {
                      "text": "Memory Usage",
                      "link": "/docs/app/building-your-application/optimizing/memory-usage"
                    }
                  ]
                },
                {
                  "text": "Configuring",
                  "link": "/docs/app/building-your-application/configuring/",
                  "items": [
                    {
                      "text": "Typescript",
                      "link": "/docs/app/building-your-application/configuring/typescript"
                    },
                    {
                      "text": "Eslint",
                      "link": "/docs/app/building-your-application/configuring/eslint"
                    },
                    {
                      "text": "Environment Variables",
                      "link": "/docs/app/building-your-application/configuring/environment-variables"
                    },
                    {
                      "text": "Absolute Imports And Module Aliases",
                      "link": "/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases"
                    },
                    {
                      "text": "Mdx",
                      "link": "/docs/app/building-your-application/configuring/mdx"
                    },
                    {
                      "text": "Src Directory",
                      "link": "/docs/app/building-your-application/configuring/src-directory"
                    },
                    {
                      "text": "Draft Mode",
                      "link": "/docs/app/building-your-application/configuring/draft-mode"
                    },
                    {
                      "text": "Content Security Policy",
                      "link": "/docs/app/building-your-application/configuring/content-security-policy"
                    }
                  ]
                },
                {
                  "text": "Testing",
                  "link": "/docs/app/building-your-application/testing/",
                  "items": [
                    {
                      "text": "Vitest",
                      "link": "/docs/app/building-your-application/testing/vitest"
                    },
                    {
                      "text": "Jest",
                      "link": "/docs/app/building-your-application/testing/jest"
                    },
                    {
                      "text": "Playwright",
                      "link": "/docs/app/building-your-application/testing/playwright"
                    },
                    {
                      "text": "Cypress",
                      "link": "/docs/app/building-your-application/testing/cypress"
                    }
                  ]
                },
                {
                  "text": "Authentication",
                  "link": "/docs/app/building-your-application/authentication/",
                  "items": []
                },
                {
                  "text": "Deploying",
                  "link": "/docs/app/building-your-application/deploying/",
                  "items": [
                    {
                      "text": "Production Checklist",
                      "link": "/docs/app/building-your-application/deploying/production-checklist"
                    },
                    {
                      "text": "Static Exports",
                      "link": "/docs/app/building-your-application/deploying/static-exports"
                    }
                  ]
                },
                {
                  "text": "Upgrading",
                  "link": "/docs/app/building-your-application/upgrading/",
                  "items": [
                    {
                      "text": "Codemods",
                      "link": "/docs/app/building-your-application/upgrading/codemods"
                    },
                    {
                      "text": "App Router Migration",
                      "link": "/docs/app/building-your-application/upgrading/app-router-migration"
                    },
                    {
                      "text": "Version 14",
                      "link": "/docs/app/building-your-application/upgrading/version-14"
                    },
                    {
                      "text": "From Vite",
                      "link": "/docs/app/building-your-application/upgrading/from-vite"
                    },
                    {
                      "text": "From Create React App",
                      "link": "/docs/app/building-your-application/upgrading/from-create-react-app"
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
                  "items": [
                    {
                      "text": "Font",
                      "link": "/docs/app/api-reference/components/font"
                    },
                    {
                      "text": "Image",
                      "link": "/docs/app/api-reference/components/image"
                    },
                    {
                      "text": "Link",
                      "link": "/docs/app/api-reference/components/link"
                    },
                    {
                      "text": "Script",
                      "link": "/docs/app/api-reference/components/script"
                    }
                  ]
                },
                {
                  "text": "File Conventions",
                  "link": "/docs/app/api-reference/file-conventions/",
                  "items": [
                    {
                      "text": "Metadata",
                      "link": "/docs/app/api-reference/file-conventions/metadata/",
                      "items": [
                        {
                          "text": "App Icons",
                          "link": "/docs/app/api-reference/file-conventions/metadata/app-icons"
                        },
                        {
                          "text": "Manifest",
                          "link": "/docs/app/api-reference/file-conventions/metadata/manifest"
                        },
                        {
                          "text": "Opengraph Image",
                          "link": "/docs/app/api-reference/file-conventions/metadata/opengraph-image"
                        },
                        {
                          "text": "Robots",
                          "link": "/docs/app/api-reference/file-conventions/metadata/robots"
                        },
                        {
                          "text": "Sitemap",
                          "link": "/docs/app/api-reference/file-conventions/metadata/sitemap"
                        }
                      ]
                    },
                    {
                      "text": "Default",
                      "link": "/docs/app/api-reference/file-conventions/default"
                    },
                    {
                      "text": "Error",
                      "link": "/docs/app/api-reference/file-conventions/error"
                    },
                    {
                      "text": "Instrumentation",
                      "link": "/docs/app/api-reference/file-conventions/instrumentation"
                    },
                    {
                      "text": "Layout",
                      "link": "/docs/app/api-reference/file-conventions/layout"
                    },
                    {
                      "text": "Loading",
                      "link": "/docs/app/api-reference/file-conventions/loading"
                    },
                    {
                      "text": "Mdx Components",
                      "link": "/docs/app/api-reference/file-conventions/mdx-components"
                    },
                    {
                      "text": "Middleware",
                      "link": "/docs/app/api-reference/file-conventions/middleware"
                    },
                    {
                      "text": "Not Found",
                      "link": "/docs/app/api-reference/file-conventions/not-found"
                    },
                    {
                      "text": "Page",
                      "link": "/docs/app/api-reference/file-conventions/page"
                    },
                    {
                      "text": "Route Segment Config",
                      "link": "/docs/app/api-reference/file-conventions/route-segment-config"
                    },
                    {
                      "text": "Route",
                      "link": "/docs/app/api-reference/file-conventions/route"
                    },
                    {
                      "text": "Template",
                      "link": "/docs/app/api-reference/file-conventions/template"
                    }
                  ]
                },
                {
                  "text": "Functions",
                  "link": "/docs/app/api-reference/functions/",
                  "items": [
                    {
                      "text": "Cookies",
                      "link": "/docs/app/api-reference/functions/cookies"
                    },
                    {
                      "text": "Draft Mode",
                      "link": "/docs/app/api-reference/functions/draft-mode"
                    },
                    {
                      "text": "Fetch",
                      "link": "/docs/app/api-reference/functions/fetch"
                    },
                    {
                      "text": "Generate Image Metadata",
                      "link": "/docs/app/api-reference/functions/generate-image-metadata"
                    },
                    {
                      "text": "Generate Metadata",
                      "link": "/docs/app/api-reference/functions/generate-metadata"
                    },
                    {
                      "text": "Generate Sitemaps",
                      "link": "/docs/app/api-reference/functions/generate-sitemaps"
                    },
                    {
                      "text": "Generate Static Params",
                      "link": "/docs/app/api-reference/functions/generate-static-params"
                    },
                    {
                      "text": "Generate Viewport",
                      "link": "/docs/app/api-reference/functions/generate-viewport"
                    },
                    {
                      "text": "Headers",
                      "link": "/docs/app/api-reference/functions/headers"
                    },
                    {
                      "text": "Image Response",
                      "link": "/docs/app/api-reference/functions/image-response"
                    },
                    {
                      "text": "Next Request",
                      "link": "/docs/app/api-reference/functions/next-request"
                    },
                    {
                      "text": "Next Response",
                      "link": "/docs/app/api-reference/functions/next-response"
                    },
                    {
                      "text": "Not Found",
                      "link": "/docs/app/api-reference/functions/not-found"
                    },
                    {
                      "text": "PermanentRedirect",
                      "link": "/docs/app/api-reference/functions/permanentRedirect"
                    },
                    {
                      "text": "Redirect",
                      "link": "/docs/app/api-reference/functions/redirect"
                    },
                    {
                      "text": "RevalidatePath",
                      "link": "/docs/app/api-reference/functions/revalidatePath"
                    },
                    {
                      "text": "RevalidateTag",
                      "link": "/docs/app/api-reference/functions/revalidateTag"
                    },
                    {
                      "text": "Unstable_cache",
                      "link": "/docs/app/api-reference/functions/unstable_cache"
                    },
                    {
                      "text": "Unstable_noStore",
                      "link": "/docs/app/api-reference/functions/unstable_noStore"
                    },
                    {
                      "text": "Use Params",
                      "link": "/docs/app/api-reference/functions/use-params"
                    },
                    {
                      "text": "Use Pathname",
                      "link": "/docs/app/api-reference/functions/use-pathname"
                    },
                    {
                      "text": "Use Report Web Vitals",
                      "link": "/docs/app/api-reference/functions/use-report-web-vitals"
                    },
                    {
                      "text": "Use Router",
                      "link": "/docs/app/api-reference/functions/use-router"
                    },
                    {
                      "text": "Use Search Params",
                      "link": "/docs/app/api-reference/functions/use-search-params"
                    },
                    {
                      "text": "Use Selected Layout Segment",
                      "link": "/docs/app/api-reference/functions/use-selected-layout-segment"
                    },
                    {
                      "text": "Use Selected Layout Segments",
                      "link": "/docs/app/api-reference/functions/use-selected-layout-segments"
                    },
                    {
                      "text": "UserAgent",
                      "link": "/docs/app/api-reference/functions/userAgent"
                    }
                  ]
                },
                {
                  "text": "Next Config Js",
                  "link": "/docs/app/api-reference/next-config-js/",
                  "items": [
                    {
                      "text": "AppDir",
                      "link": "/docs/app/api-reference/next-config-js/appDir"
                    },
                    {
                      "text": "AssetPrefix",
                      "link": "/docs/app/api-reference/next-config-js/assetPrefix"
                    },
                    {
                      "text": "BasePath",
                      "link": "/docs/app/api-reference/next-config-js/basePath"
                    },
                    {
                      "text": "Compress",
                      "link": "/docs/app/api-reference/next-config-js/compress"
                    },
                    {
                      "text": "CrossOrigin",
                      "link": "/docs/app/api-reference/next-config-js/crossOrigin"
                    },
                    {
                      "text": "DevIndicators",
                      "link": "/docs/app/api-reference/next-config-js/devIndicators"
                    },
                    {
                      "text": "DistDir",
                      "link": "/docs/app/api-reference/next-config-js/distDir"
                    },
                    {
                      "text": "Env",
                      "link": "/docs/app/api-reference/next-config-js/env"
                    },
                    {
                      "text": "Eslint",
                      "link": "/docs/app/api-reference/next-config-js/eslint"
                    },
                    {
                      "text": "ExportPathMap",
                      "link": "/docs/app/api-reference/next-config-js/exportPathMap"
                    },
                    {
                      "text": "GenerateBuildId",
                      "link": "/docs/app/api-reference/next-config-js/generateBuildId"
                    },
                    {
                      "text": "GenerateEtags",
                      "link": "/docs/app/api-reference/next-config-js/generateEtags"
                    },
                    {
                      "text": "Headers",
                      "link": "/docs/app/api-reference/next-config-js/headers"
                    },
                    {
                      "text": "HttpAgentOptions",
                      "link": "/docs/app/api-reference/next-config-js/httpAgentOptions"
                    },
                    {
                      "text": "Images",
                      "link": "/docs/app/api-reference/next-config-js/images"
                    },
                    {
                      "text": "IncrementalCacheHandlerPath",
                      "link": "/docs/app/api-reference/next-config-js/incrementalCacheHandlerPath"
                    },
                    {
                      "text": "InstrumentationHook",
                      "link": "/docs/app/api-reference/next-config-js/instrumentationHook"
                    },
                    {
                      "text": "Logging",
                      "link": "/docs/app/api-reference/next-config-js/logging"
                    },
                    {
                      "text": "MdxRs",
                      "link": "/docs/app/api-reference/next-config-js/mdxRs"
                    },
                    {
                      "text": "OnDemandEntries",
                      "link": "/docs/app/api-reference/next-config-js/onDemandEntries"
                    },
                    {
                      "text": "OptimizePackageImports",
                      "link": "/docs/app/api-reference/next-config-js/optimizePackageImports"
                    },
                    {
                      "text": "Output",
                      "link": "/docs/app/api-reference/next-config-js/output"
                    },
                    {
                      "text": "PageExtensions",
                      "link": "/docs/app/api-reference/next-config-js/pageExtensions"
                    },
                    {
                      "text": "Partial Prerendering",
                      "link": "/docs/app/api-reference/next-config-js/partial-prerendering"
                    },
                    {
                      "text": "PoweredByHeader",
                      "link": "/docs/app/api-reference/next-config-js/poweredByHeader"
                    },
                    {
                      "text": "ProductionBrowserSourceMaps",
                      "link": "/docs/app/api-reference/next-config-js/productionBrowserSourceMaps"
                    },
                    {
                      "text": "ReactStrictMode",
                      "link": "/docs/app/api-reference/next-config-js/reactStrictMode"
                    },
                    {
                      "text": "Redirects",
                      "link": "/docs/app/api-reference/next-config-js/redirects"
                    },
                    {
                      "text": "Rewrites",
                      "link": "/docs/app/api-reference/next-config-js/rewrites"
                    },
                    {
                      "text": "ServerActions",
                      "link": "/docs/app/api-reference/next-config-js/serverActions"
                    },
                    {
                      "text": "ServerExternalPackages",
                      "link": "/docs/app/api-reference/next-config-js/serverExternalPackages"
                    },
                    {
                      "text": "StaleTimes",
                      "link": "/docs/app/api-reference/next-config-js/staleTimes"
                    },
                    {
                      "text": "TrailingSlash",
                      "link": "/docs/app/api-reference/next-config-js/trailingSlash"
                    },
                    {
                      "text": "TranspilePackages",
                      "link": "/docs/app/api-reference/next-config-js/transpilePackages"
                    },
                    {
                      "text": "Turbo",
                      "link": "/docs/app/api-reference/next-config-js/turbo"
                    },
                    {
                      "text": "TypedRoutes",
                      "link": "/docs/app/api-reference/next-config-js/typedRoutes"
                    },
                    {
                      "text": "Typescript",
                      "link": "/docs/app/api-reference/next-config-js/typescript"
                    },
                    {
                      "text": "UrlImports",
                      "link": "/docs/app/api-reference/next-config-js/urlImports"
                    },
                    {
                      "text": "WebVitalsAttribution",
                      "link": "/docs/app/api-reference/next-config-js/webVitalsAttribution"
                    },
                    {
                      "text": "Webpack",
                      "link": "/docs/app/api-reference/next-config-js/webpack"
                    }
                  ]
                },
                {
                  "text": "Create Next App",
                  "link": "/docs/app/api-reference/create-next-app"
                },
                {
                  "text": "Edge",
                  "link": "/docs/app/api-reference/edge"
                },
                {
                  "text": "Next Cli",
                  "link": "/docs/app/api-reference/next-cli"
                }
              ]
            }
          ]
        },
        {
          "text": "Pages",
          "link": "/docs/pages/",
          "items": [
            {
              "text": "Building Your Application",
              "link": "/docs/pages/building-your-application/",
              "items": [
                {
                  "text": "Routing",
                  "link": "/docs/pages/building-your-application/routing/",
                  "items": [
                    {
                      "text": "Pages And Layouts",
                      "link": "/docs/pages/building-your-application/routing/pages-and-layouts"
                    },
                    {
                      "text": "Dynamic Routes",
                      "link": "/docs/pages/building-your-application/routing/dynamic-routes"
                    },
                    {
                      "text": "Linking And Navigating",
                      "link": "/docs/pages/building-your-application/routing/linking-and-navigating"
                    },
                    {
                      "text": "Redirecting",
                      "link": "/docs/pages/building-your-application/routing/redirecting"
                    },
                    {
                      "text": "Custom App",
                      "link": "/docs/pages/building-your-application/routing/custom-app"
                    },
                    {
                      "text": "Custom Document",
                      "link": "/docs/pages/building-your-application/routing/custom-document"
                    },
                    {
                      "text": "Api Routes",
                      "link": "/docs/pages/building-your-application/routing/api-routes"
                    },
                    {
                      "text": "Custom Error",
                      "link": "/docs/pages/building-your-application/routing/custom-error"
                    },
                    {
                      "text": "Internationalization",
                      "link": "/docs/pages/building-your-application/routing/internationalization"
                    },
                    {
                      "text": "Middleware",
                      "link": "/docs/pages/building-your-application/routing/middleware"
                    }
                  ]
                },
                {
                  "text": "Rendering",
                  "link": "/docs/pages/building-your-application/rendering/",
                  "items": [
                    {
                      "text": "Server Side Rendering",
                      "link": "/docs/pages/building-your-application/rendering/server-side-rendering"
                    },
                    {
                      "text": "Static Site Generation",
                      "link": "/docs/pages/building-your-application/rendering/static-site-generation"
                    },
                    {
                      "text": "Automatic Static Optimization",
                      "link": "/docs/pages/building-your-application/rendering/automatic-static-optimization"
                    },
                    {
                      "text": "Client Side Rendering",
                      "link": "/docs/pages/building-your-application/rendering/client-side-rendering"
                    },
                    {
                      "text": "Edge And Nodejs Runtimes",
                      "link": "/docs/pages/building-your-application/rendering/edge-and-nodejs-runtimes"
                    }
                  ]
                },
                {
                  "text": "Data Fetching",
                  "link": "/docs/pages/building-your-application/data-fetching/",
                  "items": [
                    {
                      "text": "Get Static Props",
                      "link": "/docs/pages/building-your-application/data-fetching/get-static-props"
                    },
                    {
                      "text": "Get Static Paths",
                      "link": "/docs/pages/building-your-application/data-fetching/get-static-paths"
                    },
                    {
                      "text": "Forms And Mutations",
                      "link": "/docs/pages/building-your-application/data-fetching/forms-and-mutations"
                    },
                    {
                      "text": "Get Server Side Props",
                      "link": "/docs/pages/building-your-application/data-fetching/get-server-side-props"
                    },
                    {
                      "text": "Incremental Static Regeneration",
                      "link": "/docs/pages/building-your-application/data-fetching/incremental-static-regeneration"
                    },
                    {
                      "text": "Client Side",
                      "link": "/docs/pages/building-your-application/data-fetching/client-side"
                    }
                  ]
                },
                {
                  "text": "Styling",
                  "link": "/docs/pages/building-your-application/styling/",
                  "items": [
                    {
                      "text": "Css Modules",
                      "link": "/docs/pages/building-your-application/styling/css-modules"
                    },
                    {
                      "text": "Tailwind Css",
                      "link": "/docs/pages/building-your-application/styling/tailwind-css"
                    },
                    {
                      "text": "Css In Js",
                      "link": "/docs/pages/building-your-application/styling/css-in-js"
                    },
                    {
                      "text": "Sass",
                      "link": "/docs/pages/building-your-application/styling/sass"
                    }
                  ]
                },
                {
                  "text": "Optimizing",
                  "link": "/docs/pages/building-your-application/optimizing/",
                  "items": [
                    {
                      "text": "Images",
                      "link": "/docs/pages/building-your-application/optimizing/images"
                    },
                    {
                      "text": "Fonts",
                      "link": "/docs/pages/building-your-application/optimizing/fonts"
                    },
                    {
                      "text": "Scripts",
                      "link": "/docs/pages/building-your-application/optimizing/scripts"
                    },
                    {
                      "text": "Static Assets",
                      "link": "/docs/pages/building-your-application/optimizing/static-assets"
                    },
                    {
                      "text": "Bundle Analyzer",
                      "link": "/docs/pages/building-your-application/optimizing/bundle-analyzer"
                    },
                    {
                      "text": "Analytics",
                      "link": "/docs/pages/building-your-application/optimizing/analytics"
                    },
                    {
                      "text": "Lazy Loading",
                      "link": "/docs/pages/building-your-application/optimizing/lazy-loading"
                    },
                    {
                      "text": "Instrumentation",
                      "link": "/docs/pages/building-your-application/optimizing/instrumentation"
                    },
                    {
                      "text": "Open Telemetry",
                      "link": "/docs/pages/building-your-application/optimizing/open-telemetry"
                    },
                    {
                      "text": "Third Party Libraries",
                      "link": "/docs/pages/building-your-application/optimizing/third-party-libraries"
                    }
                  ]
                },
                {
                  "text": "Configuring",
                  "link": "/docs/pages/building-your-application/configuring/",
                  "items": [
                    {
                      "text": "Typescript",
                      "link": "/docs/pages/building-your-application/configuring/typescript"
                    },
                    {
                      "text": "Eslint",
                      "link": "/docs/pages/building-your-application/configuring/eslint"
                    },
                    {
                      "text": "Environment Variables",
                      "link": "/docs/pages/building-your-application/configuring/environment-variables"
                    },
                    {
                      "text": "Absolute Imports And Module Aliases",
                      "link": "/docs/pages/building-your-application/configuring/absolute-imports-and-module-aliases"
                    },
                    {
                      "text": "Src Directory",
                      "link": "/docs/pages/building-your-application/configuring/src-directory"
                    },
                    {
                      "text": "Mdx",
                      "link": "/docs/pages/building-your-application/configuring/mdx"
                    },
                    {
                      "text": "Amp",
                      "link": "/docs/pages/building-your-application/configuring/amp"
                    },
                    {
                      "text": "Babel",
                      "link": "/docs/pages/building-your-application/configuring/babel"
                    },
                    {
                      "text": "Post Css",
                      "link": "/docs/pages/building-your-application/configuring/post-css"
                    },
                    {
                      "text": "Custom Server",
                      "link": "/docs/pages/building-your-application/configuring/custom-server"
                    },
                    {
                      "text": "Draft Mode",
                      "link": "/docs/pages/building-your-application/configuring/draft-mode"
                    },
                    {
                      "text": "Error Handling",
                      "link": "/docs/pages/building-your-application/configuring/error-handling"
                    },
                    {
                      "text": "Debugging",
                      "link": "/docs/pages/building-your-application/configuring/debugging"
                    },
                    {
                      "text": "Preview Mode",
                      "link": "/docs/pages/building-your-application/configuring/preview-mode"
                    },
                    {
                      "text": "Content Security Policy",
                      "link": "/docs/pages/building-your-application/configuring/content-security-policy"
                    }
                  ]
                },
                {
                  "text": "Testing",
                  "link": "/docs/pages/building-your-application/testing/",
                  "items": [
                    {
                      "text": "Vitest",
                      "link": "/docs/pages/building-your-application/testing/vitest"
                    },
                    {
                      "text": "Jest",
                      "link": "/docs/pages/building-your-application/testing/jest"
                    },
                    {
                      "text": "Playwright",
                      "link": "/docs/pages/building-your-application/testing/playwright"
                    },
                    {
                      "text": "Cypress",
                      "link": "/docs/pages/building-your-application/testing/cypress"
                    }
                  ]
                },
                {
                  "text": "Authentication",
                  "link": "/docs/pages/building-your-application/authentication/",
                  "items": []
                },
                {
                  "text": "Deploying",
                  "link": "/docs/pages/building-your-application/deploying/",
                  "items": [
                    {
                      "text": "Production Checklist",
                      "link": "/docs/pages/building-your-application/deploying/production-checklist"
                    },
                    {
                      "text": "Static Exports",
                      "link": "/docs/pages/building-your-application/deploying/static-exports"
                    },
                    {
                      "text": "Multi Zones",
                      "link": "/docs/pages/building-your-application/deploying/multi-zones"
                    },
                    {
                      "text": "Ci Build Caching",
                      "link": "/docs/pages/building-your-application/deploying/ci-build-caching"
                    }
                  ]
                },
                {
                  "text": "Upgrading",
                  "link": "/docs/pages/building-your-application/upgrading/",
                  "items": [
                    {
                      "text": "Codemods",
                      "link": "/docs/pages/building-your-application/upgrading/codemods"
                    },
                    {
                      "text": "App Router Migration",
                      "link": "/docs/pages/building-your-application/upgrading/app-router-migration"
                    },
                    {
                      "text": "From Vite",
                      "link": "/docs/pages/building-your-application/upgrading/from-vite"
                    },
                    {
                      "text": "From Create React App",
                      "link": "/docs/pages/building-your-application/upgrading/from-create-react-app"
                    },
                    {
                      "text": "Version 14",
                      "link": "/docs/pages/building-your-application/upgrading/version-14"
                    },
                    {
                      "text": "Version 13",
                      "link": "/docs/pages/building-your-application/upgrading/version-13"
                    },
                    {
                      "text": "Version 12",
                      "link": "/docs/pages/building-your-application/upgrading/version-12"
                    },
                    {
                      "text": "Version 11",
                      "link": "/docs/pages/building-your-application/upgrading/version-11"
                    },
                    {
                      "text": "Version 10",
                      "link": "/docs/pages/building-your-application/upgrading/version-10"
                    },
                    {
                      "text": "Version 9",
                      "link": "/docs/pages/building-your-application/upgrading/version-9"
                    }
                  ]
                }
              ]
            },
            {
              "text": "Api Reference",
              "link": "/docs/pages/api-reference/",
              "items": [
                {
                  "text": "Components",
                  "link": "/docs/pages/api-reference/components/",
                  "items": [
                    {
                      "text": "Font",
                      "link": "/docs/pages/api-reference/components/font"
                    },
                    {
                      "text": "Head",
                      "link": "/docs/pages/api-reference/components/head"
                    },
                    {
                      "text": "Image Legacy",
                      "link": "/docs/pages/api-reference/components/image-legacy"
                    },
                    {
                      "text": "Image",
                      "link": "/docs/pages/api-reference/components/image"
                    },
                    {
                      "text": "Link",
                      "link": "/docs/pages/api-reference/components/link"
                    },
                    {
                      "text": "Script",
                      "link": "/docs/pages/api-reference/components/script"
                    }
                  ]
                },
                {
                  "text": "Functions",
                  "link": "/docs/pages/api-reference/functions/",
                  "items": [
                    {
                      "text": "Get Initial Props",
                      "link": "/docs/pages/api-reference/functions/get-initial-props"
                    },
                    {
                      "text": "Get Server Side Props",
                      "link": "/docs/pages/api-reference/functions/get-server-side-props"
                    },
                    {
                      "text": "Get Static Paths",
                      "link": "/docs/pages/api-reference/functions/get-static-paths"
                    },
                    {
                      "text": "Get Static Props",
                      "link": "/docs/pages/api-reference/functions/get-static-props"
                    },
                    {
                      "text": "Next Request",
                      "link": "/docs/pages/api-reference/functions/next-request"
                    },
                    {
                      "text": "Next Response",
                      "link": "/docs/pages/api-reference/functions/next-response"
                    },
                    {
                      "text": "Use Amp",
                      "link": "/docs/pages/api-reference/functions/use-amp"
                    },
                    {
                      "text": "Use Report Web Vitals",
                      "link": "/docs/pages/api-reference/functions/use-report-web-vitals"
                    },
                    {
                      "text": "Use Router",
                      "link": "/docs/pages/api-reference/functions/use-router"
                    },
                    {
                      "text": "UserAgent",
                      "link": "/docs/pages/api-reference/functions/userAgent"
                    }
                  ]
                },
                {
                  "text": "Next Config Js",
                  "link": "/docs/pages/api-reference/next-config-js/",
                  "items": [
                    {
                      "text": "AssetPrefix",
                      "link": "/docs/pages/api-reference/next-config-js/assetPrefix"
                    },
                    {
                      "text": "BasePath",
                      "link": "/docs/pages/api-reference/next-config-js/basePath"
                    },
                    {
                      "text": "BundlePagesRouterDependencies",
                      "link": "/docs/pages/api-reference/next-config-js/bundlePagesRouterDependencies"
                    },
                    {
                      "text": "Compress",
                      "link": "/docs/pages/api-reference/next-config-js/compress"
                    },
                    {
                      "text": "CrossOrigin",
                      "link": "/docs/pages/api-reference/next-config-js/crossOrigin"
                    },
                    {
                      "text": "DevIndicators",
                      "link": "/docs/pages/api-reference/next-config-js/devIndicators"
                    },
                    {
                      "text": "DistDir",
                      "link": "/docs/pages/api-reference/next-config-js/distDir"
                    },
                    {
                      "text": "Env",
                      "link": "/docs/pages/api-reference/next-config-js/env"
                    },
                    {
                      "text": "Eslint",
                      "link": "/docs/pages/api-reference/next-config-js/eslint"
                    },
                    {
                      "text": "ExportPathMap",
                      "link": "/docs/pages/api-reference/next-config-js/exportPathMap"
                    },
                    {
                      "text": "GenerateBuildId",
                      "link": "/docs/pages/api-reference/next-config-js/generateBuildId"
                    },
                    {
                      "text": "GenerateEtags",
                      "link": "/docs/pages/api-reference/next-config-js/generateEtags"
                    },
                    {
                      "text": "Headers",
                      "link": "/docs/pages/api-reference/next-config-js/headers"
                    },
                    {
                      "text": "HttpAgentOptions",
                      "link": "/docs/pages/api-reference/next-config-js/httpAgentOptions"
                    },
                    {
                      "text": "Images",
                      "link": "/docs/pages/api-reference/next-config-js/images"
                    },
                    {
                      "text": "InstrumentationHook",
                      "link": "/docs/pages/api-reference/next-config-js/instrumentationHook"
                    },
                    {
                      "text": "OnDemandEntries",
                      "link": "/docs/pages/api-reference/next-config-js/onDemandEntries"
                    },
                    {
                      "text": "OptimizePackageImports",
                      "link": "/docs/pages/api-reference/next-config-js/optimizePackageImports"
                    },
                    {
                      "text": "Output",
                      "link": "/docs/pages/api-reference/next-config-js/output"
                    },
                    {
                      "text": "PageExtensions",
                      "link": "/docs/pages/api-reference/next-config-js/pageExtensions"
                    },
                    {
                      "text": "PoweredByHeader",
                      "link": "/docs/pages/api-reference/next-config-js/poweredByHeader"
                    },
                    {
                      "text": "ProductionBrowserSourceMaps",
                      "link": "/docs/pages/api-reference/next-config-js/productionBrowserSourceMaps"
                    },
                    {
                      "text": "ReactStrictMode",
                      "link": "/docs/pages/api-reference/next-config-js/reactStrictMode"
                    },
                    {
                      "text": "Redirects",
                      "link": "/docs/pages/api-reference/next-config-js/redirects"
                    },
                    {
                      "text": "Rewrites",
                      "link": "/docs/pages/api-reference/next-config-js/rewrites"
                    },
                    {
                      "text": "Runtime Configuration",
                      "link": "/docs/pages/api-reference/next-config-js/runtime-configuration"
                    },
                    {
                      "text": "ServerExternalPackages",
                      "link": "/docs/pages/api-reference/next-config-js/serverExternalPackages"
                    },
                    {
                      "text": "TrailingSlash",
                      "link": "/docs/pages/api-reference/next-config-js/trailingSlash"
                    },
                    {
                      "text": "TranspilePackages",
                      "link": "/docs/pages/api-reference/next-config-js/transpilePackages"
                    },
                    {
                      "text": "Turbo",
                      "link": "/docs/pages/api-reference/next-config-js/turbo"
                    },
                    {
                      "text": "Typescript",
                      "link": "/docs/pages/api-reference/next-config-js/typescript"
                    },
                    {
                      "text": "UrlImports",
                      "link": "/docs/pages/api-reference/next-config-js/urlImports"
                    },
                    {
                      "text": "WebVitalsAttribution",
                      "link": "/docs/pages/api-reference/next-config-js/webVitalsAttribution"
                    },
                    {
                      "text": "Webpack",
                      "link": "/docs/pages/api-reference/next-config-js/webpack"
                    }
                  ]
                },
                {
                  "text": "Create Next App",
                  "link": "/docs/pages/api-reference/create-next-app"
                },
                {
                  "text": "Next Cli",
                  "link": "/docs/pages/api-reference/next-cli"
                },
                {
                  "text": "Edge",
                  "link": "/docs/pages/api-reference/edge"
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
              "link": "/docs/architecture/accessibility"
            },
            {
              "text": "Fast Refresh",
              "link": "/docs/architecture/fast-refresh"
            },
            {
              "text": "Nextjs Compiler",
              "link": "/docs/architecture/nextjs-compiler"
            },
            {
              "text": "Supported Browsers",
              "link": "/docs/architecture/supported-browsers"
            },
            {
              "text": "Turbopack",
              "link": "/docs/architecture/turbopack"
            }
          ]
        },
        {
          "text": "Community",
          "link": "/docs/community/",
          "items": [
            {
              "text": "Contribution Guide",
              "link": "/docs/community/contribution-guide"
            }
          ]
        }
      ],
   

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
