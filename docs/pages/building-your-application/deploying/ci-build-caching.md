---
title: 持续集成 (CI) 构建缓存
description: 学习如何配置 CI 以缓存 Next.js 构建
---

为了提高构建性能，Next.js 会将缓存保存到 `.next/cache`，该缓存在构建之间共享。

要在持续集成 (CI) 环境中利用此缓存，您的 CI 工作流程需要配置为在构建之间正确持久化缓存。

> 如果您的 CI 未配置为在构建之间持久化 `.next/cache`，您可能会看到 [No Cache Detected](/docs/messages/no-cache) 错误。

以下是一些常见 CI 提供商的示例缓存配置：

## Vercel

Next.js 缓存自动为您配置。您无需采取任何行动。

## CircleCI

编辑 `.circleci/config.yml` 中的 `save_cache` 步骤以包含 `.next/cache`：

```yaml
steps:
  - save_cache:
      key: dependency-cache-{{ checksum "yarn.lock" }}
      paths:
        - ./node_modules
        - ./.next/cache
```

如果您没有 `save_cache` 键，请按照 CircleCI 的 [文档设置构建缓存](https://circleci.com/docs/2.0/caching/)。

## Travis CI

将以下内容添加或合并到您的 `.travis.yml` 中：

```yaml
cache:
  directories:
    - $HOME/.cache/yarn
    - node_modules
    - .next/cache
```

## GitLab CI

将以下内容添加或合并到您的 `.gitlab-ci.yml` 中：

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .next/cache/
```

## Netlify CI

使用 [Netlify 插件](https://www.netlify.com/products/build/plugins/) 与 [`@netlify/plugin-nextjs`](https://www.npmjs.com/package/@netlify/plugin-nextjs)。

## AWS CodeBuild

将以下内容添加（或合并）到您的 `buildspec.yml` 中：

```yaml
cache:
  paths:
    - 'node_modules/**/*' # 缓存 `node_modules` 以加快 `yarn` 或 `npm i` 的速度
    - '.next/cache/**/*' # 缓存 Next.js 以加快应用程序重建
```

## GitHub Actions

使用 GitHub 的 [actions/cache](https://github.com/actions/cache)，在您的工作流文件中添加以下步骤：

```yaml
uses: actions/cache@v4
with:
  # 有关使用 `yarn` 进行缓存的信息，请参见 https://github.com/actions/cache/blob/main/examples.md#node---yarn 或者您可以利用 actions/setup-node 进行缓存 https://github.com/actions/setup-node
  path: |
    ~/.npm
    ${{ github.workspace }}/.next/cache
  # 当包或源文件更改时生成新的缓存。
  key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
  # 如果源文件更改但包未更改，则从先前的缓存中重建。
  restore-keys: |
    ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

## Bitbucket Pipelines

将以下内容添加或合并到您的 `bitbucket-pipelines.yml` 的顶层（与 `pipelines` 同级）：

```yaml
definitions:
  caches:
    nextcache: .next/cache
```

然后在管道的 `step` 的 `caches` 部分引用它：

```yaml
- step:
    name: your_step_name
    caches:
      - node
      - nextcache
```

## Heroku

使用 Heroku 的 [自定义缓存](https://devcenter.heroku.com/articles/nodejs-support#custom-caching)，在顶层 package.json 中添加一个 `cacheDirectories` 数组：

```javascript
"cacheDirectories": [".next/cache"]
```

## Azure Pipelines

使用 Azure Pipelines 的 [Cache 任务](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/cache)，在执行 `next build` 的任务之前，将以下任务添加到您的管道 yaml 文件中的某个位置：

```yaml
- task: Cache@2
  displayName: 'Cache .next/cache'
  inputs:
    key: next | $(Agent.OS) | yarn.lock
    path: '$(System.DefaultWorkingDirectory)/.next/cache'
```
## Jenkins (Pipeline)

使用 Jenkins 的 [Job Cacher](https://www.jenkins.io/doc/pipeline/steps/jobcacher/) 插件，在您的 `Jenkinsfile` 中通常运行 `next build` 或 `npm install` 的地方添加以下构建步骤：

```yaml
stage("Restore npm packages") {
    steps {
        // 根据 GIT_COMMIT 哈希将锁文件写入缓存
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: "node_modules",
                includes: "**/*",
                cacheValidityDecidingFile: "package-lock.json"
            )
        ]) {
            sh "npm install"
        }
    }
}
stage("Build") {
    steps {
        // 根据 GIT_COMMIT 哈希将锁文件写入缓存
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: ".next/cache",
                includes: "**/*",
                cacheValidityDecidingFile: "next-lock.cache"
            )
        ]) {
            // 即 `next build`
            sh "npm run build"
        }
    }
}
```