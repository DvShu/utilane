# 贡献与发布指南

[English](CONTRIBUTING.md) | 简体中文

## 环境与验证

建议 Node.js 22.18+ 或更新版本，使用 pnpm 和已提交的 pnpm-lock.yaml。

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm docs:check
```

test 先构建再运行 Node 测试。docs:check 构建 JS 和 .d.ts，然后检查本地文件链接、中英文页面配对和独立 ts 示例的类型，不改写 Markdown。示例逐块检查，需独立导入所需 API。检查不执行示例、不比较 API 参考与源码签名、不证明翻译准确，也不检查远程 URL 和 Markdown 锚点。

## 代码检查与格式化

使用 Oxlint 检查源码、脚本、测试及构建配置，使用 Oxfmt 格式化支持的工程文件。配置为 .oxlintrc.json 和 .oxfmtrc.json。正确性诊断及未使用变量视为错误，警告也会导致 lint 失败。有意保留的未使用变量以下划线开头，或直接省略未使用的 catch 参数。

```sh
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
```

lint:fix 应用安全修复，完成后检查改动；format 写入格式调整，format:check 只报告差异。采用两空格、双引号、分号、尾逗号及 LF，保留 Markdown 段落换行，不格式化嵌入示例。排除 lib、node_modules、压缩包及 pnpm-lock.yaml。这两个工具仅作为开发依赖。参考 [Oxlint 配置](https://oxc.rs/docs/guide/usage/linter/config)和 [Oxfmt 配置](https://oxc.rs/docs/guide/usage/formatter/config)。

## 目录与职责

- src：源码；index.ts、browser.ts、node.ts 为公共入口。
- tests：有意义的行为、边界和异常测试。
- docs：英文指南和 API 参考；docs/zh-CN：中文对应版本。全部 Markdown（包括两个 api/ 目录）由贡献者和 AI 直接维护。
- scripts/check-docs.mjs：只读文档校验脚本。
- lib：tsdown 生成的 JS 和 .d.ts，不手改、不提交。

公开 API 使用中文 TSDoc / JSDoc，说明用途、参数、默认值、返回值、异常和示例，标识符及标准标签保持原样。中英文 API 描述直接写入对应参考页面，不再维护额外的描述映射。签名需对照源码和构建 .d.ts 检查；辅助类型和父类不一定是公共导出。

保持 ESM、按名称导出和 sideEffects: false 声明准确。避免模块初始化时访问 DOM，不从根入口引入 Node 内置模块。不要未经核验就添加 PURE 标记。

## 文档语言

默认英文：README.md、CONTRIBUTING.md、CHANGELOG.md、docs/_.md 和 docs/api/_.md。中文版本位于根目录 *.zh-CN.md 和 docs/zh-CN/。维护双向语言链接及语义一致性。llms.txt 默认指向英文，也提供中文入口。文档翻译不改变现有运行时消息。

独立且可执行的示例使用 ts 代码块并导入真实公共 API，校验脚本会检查其类型。声明参考或不能独立执行的片段使用 typescript 代码块，不作为独立示例编译，需由维护者检查其准确性。

## AI 辅助开发流程

遵循 [AGENTS.md](AGENTS.md)，每次公开 API 变更都包含文档工作，不需要额外提醒：

1. 实现 API，按需公开导出，编写中文注释。
2. 直接更新中英文 API 参考，包括导出表、描述、签名、重载及相关辅助类型。
3. 更新双语模块指南，说明行为、默认值、异常和示例。新增模块需更新双语目录及 llms.txt；影响快速上手时同步更新双语 README。
4. 更新双语变更记录和相关测试。
5. 先运行 `npm run format`，再运行 lint、格式检查、类型检查、测试和 `npm run docs:check`，检查双语内容完整且一致。

AI 编写 Markdown 和翻译，tsdown 生成发布类型声明，校验脚本只检查文档，不生成或翻译内容。

## GitHub 提交

仓库为 [DvShu/utilane](https://github.com/DvShu/utilane)。提交源码、测试、全部 Markdown 文档及锁文件；不要提交 node_modules、lib、日志、密钥或 .env。保持包元数据与实际仓库一致。

PR 描述说明行为、兼容性影响和验证结果。接口或格式变化同步更新双语变更记录。

## npm 发布

1. Utilane 作为独立包准备首次发布，初始版本为 1.0.0；后续按实际变更确定版本。
2. 检查双语变更记录、README、指南及 API 参考，执行上述校验。
3. 运行 `npm pack --dry-run`，再运行 `npm pack` 检查实际压缩包。
4. 确认三个 JS 入口、对应 .d.ts、双语 README 和 LICENSE 齐全，详细 Markdown 文档留在仓库。
5. 由维护者使用正确账号执行 `npm publish`，再建立版本标签和 GitHub Release。

prepack 自动执行 lint、格式检查、类型检查、测试（包含构建）及只读文档校验。不要使用 --ignore-scripts 绕过检查。pack 只在本地打包，publish 才会发布；工程不自动推送或发布。
