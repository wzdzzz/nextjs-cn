# Fast Refresh

Fast Refresh是Next.js的一个特性，它可以在您对React组件进行编辑时提供即时反馈。Fast Refresh默认在所有**9.4或更新版本**的Next.js应用程序中启用。使用Next.js Fast Refresh，大多数编辑应该在一秒钟内可见，**而不会丢失组件状态**。

## 工作原理

- 如果您编辑的文件**仅导出React组件**，Fast Refresh将仅更新该文件的代码，并重新渲染您的组件。您可以编辑该文件中的任何内容，包括样式、渲染逻辑、事件处理程序或效果。
- 如果您编辑的文件包含**不是React组件**的导出，Fast Refresh将重新运行该文件以及导入它的其他文件。因此，如果`Button.js`和`Modal.js`都导入了`theme.js`，编辑`theme.js`将更新这两个组件。
- 最后，如果您**编辑的文件**被**React树之外的文件导入**，Fast Refresh**将退回到执行完整重新加载**。您可能有一个文件渲染了一个React组件，但也导出了一个被**非React组件**导入的值。例如，您的组件还导出了一个常量，一个非React实用程序文件导入了它。在这种情况下，考虑将常量迁移到一个单独的文件中，并将其导入到这两个文件中。这将重新启用Fast Refresh的工作。其他情况通常可以通过类似的方式解决。

## 错误弹性

### 语法错误

如果在开发过程中您犯了一个语法错误，您可以修复它并再次保存文件。错误将自动消失，因此您不需要重新加载应用程序。**您不会丢失组件状态**。

### 运行时错误

如果您犯了一个错误，导致组件内部出现运行时错误，您将看到一个上下文覆盖层。修复错误将自动关闭覆盖层，而无需重新加载应用程序。

如果错误没有发生在渲染过程中，组件状态将被保留。如果错误确实发生在渲染过程中，React将使用更新后的代码重新挂载您的应用程序。

如果您的应用程序中有[错误边界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)（这是生产中优雅失败的好主意），它们将在渲染错误后的下一次编辑时重试渲染。这意味着拥有一个错误边界可以防止您总是被重置为根应用程序状态。然而，请记住，错误边界不应该**太细粒度**。它们由React在生产中使用，并且应该始终被有意识地设计。

## 限制

Fast Refresh尝试保留您正在编辑的组件中的本地React状态，但只有在安全的情况下才会这样做。以下是您可能看到每次编辑文件时本地状态被重置的一些原因：

- 对于类组件，本地状态不会被保留（只有函数组件和Hooks保留状态）。
- 您正在编辑的文件可能除了React组件之外还有**其他**导出。
- 有时，一个文件可能会导出调用高阶组件的结果，如`HOC(WrappedComponent)`。如果返回的组件是一个类，其状态将被重置。
- 匿名箭头函数如`export default () => <div />;`会导致Fast Refresh不保留本地组件状态。对于大型代码库，您可以使用我们的[`name-default-component` codemod](/docs/pages/building-your-application/upgrading/codemods#name-default-component)。

随着您的代码库越来越多地转向函数组件和Hooks，您可以期望在更多情况下保留状态。

## Tips

- Fast Refresh 默认会保留函数组件（和 Hooks）中的 React 本地状态。
- 有时，您可能想要 _强制_ 重置状态，并重新挂载组件。例如，如果您正在调整仅在挂载时发生的动画，这将非常方便。为此，您可以在正在编辑的文件中的任何位置添加 `// @refresh reset`。此指令仅限于该文件，并指示 Fast Refresh 在每次编辑时重新挂载该文件中定义的组件。
- 您可以在开发期间编辑的组件中放入 `console.log` 或 `debugger;`。
- 请记住，导入是区分大小写的。当您的导入与实际文件名不匹配时，快速和完整刷新都可能失败。
  例如，`'./header'` 与 `'./Header'`。

## Fast Refresh and Hooks

尽可能地，Fast Refresh 尝试在编辑之间保留组件的状态。特别是，`useState` 和 `useRef` 会保留它们的先前值，只要您不更改它们的参数或 Hook 调用的顺序。

具有依赖项的 Hooks—例如 `useEffect`、`useMemo` 和 `useCallback`—在 Fast Refresh 期间将 _始终_ 更新。它们的依赖项列表将在 Fast Refresh 发生时被忽略。

例如，当您将 `useMemo(() => x * 2, [x])` 编辑为 `useMemo(() => x * 10, [x])` 时，即使 `x`（依赖项）没有变化，它也会重新运行。如果 React 不这样做，您的编辑就不会反映在屏幕上！

有时，这可能导致意想不到的结果。例如，即使依赖项列表为空数组的 `useEffect` 在 Fast Refresh 期间仍然会运行一次。

然而，编写能够抵御 `useEffect` 偶尔重新运行的代码，即使没有 Fast Refresh 也是一个好的实践。这将使您更容易在以后引入新的依赖项，并且由 [React Strict Mode](/docs/pages/api-reference/next-config-js/reactStrictMode) 强制执行，我们强烈推荐启用。