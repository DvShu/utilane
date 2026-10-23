# Utilane

[English](README.md) | 简体中文

[GitHub 仓库](https://github.com/DvShu/utilane) · [问题反馈](https://github.com/DvShu/utilane/issues)

面向浏览器和 Node.js 的 TypeScript / JavaScript ESM 工具库，提供类型声明，支持按需导入和 tree-shaking。

## 安装与使用

```sh
npm install utilane
# 或 pnpm add utilane
```

```ts
import { isBlank, format, Base32 } from "utilane";

isBlank("  "); // true
format(new Date(2026, 9, 23), "yyyy-mm-dd"); // "2026-10-23"
const codec = new Base32();
codec.encode("hello"); // "NBSWY3DP"
codec.decode("NBSWY3DP"); // "hello"
```

本文档介绍 Utilane，发布信息见[变更记录](CHANGELOG.zh-CN.md)。

## 导入入口

| 入口              | 内容                                                        | 环境                                          |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------- |
| `utilane`         | 字符串、数组、日期、颜色、ID、Base 编码、Web Crypto、验证器 | 浏览器 / Node.js，具体 API 需要对应运行时能力 |
| `utilane/browser` | DOM、剪贴板、Storage、主题、表单、URL、防抖节流             | 浏览器                                        |
| `utilane/node`    | Node Crypto、文件、子进程                                   | Node.js                                       |

三个入口各自导出对应工具，浏览器和 Node 入口不包含根入口的全部 API。不支持 `utilane/date`、`utilane/src/*` 等未声明的子路径。

```ts
import { debounce } from "utilane/browser";
const save = debounce(() => console.log("save"), 300);
save();
save.cancel();
```

```ts
import { hash } from "utilane/node";
const digest = hash("hello"); // 同步 SHA-256 十六进制字符串
```

根入口的 `hash` 返回 Promise，参数与 Node 入口不同，详见[加密与摘要](docs/zh-CN/crypto.md)。

## 环境与打包

产物为 ESM，目标 ES2020；需要 BigInt、TextEncoder / TextDecoder 等运行时能力。根入口的摘要和加密需要 `crypto.subtle`，浏览器中通常需要安全上下文。SSR 服务端不要调用依赖 DOM、Storage 的工具。当前不提供独立 CommonJS 产物，统一使用 `import`。

在支持 tree-shaking 的生产打包器中按名称导入，未使用的工具可被移除。包声明了 `sideEffects: false`。将整个命名空间传递出去或动态遍历所有导出可能保留全部工具；类通常保留自身及父类的相关方法。直接在运行时加载 ESM 不会执行摇树优化。

## 文档

- [中文文档目录与完整 API](docs/zh-CN/index.md)
- [English documentation](docs/index.md)
- [贡献与发布指南](CONTRIBUTING.zh-CN.md)
- [变更记录](CHANGELOG.zh-CN.md)
- AI 使用索引：[llms.txt](llms.txt)；AI 修改工程的规则：[AGENTS.md](AGENTS.md)

## 本地开发

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
pnpm test
pnpm docs:check
```

建议开发环境使用 Node.js 22.18+ 或更新版本及 pnpm。源码位于 `src/`，tsdown 将 JS 和 .d.ts 构建到 `lib/`。所有中英文 Markdown 指南和 API 参考由贡献者及 AI 直接维护。`pnpm docs:check` 构建包并检查语言配对、本地文件链接及独立 TypeScript 示例，不改写文档。

发布前运行 `npm pack --dry-run`，会通过 `prepack` 自动执行 lint、格式检查、类型检查、构建、测试和文档校验。使用 `pnpm format` 格式化文件，使用 `pnpm lint:fix` 应用安全 lint 修复；完整流程见贡献指南。

## Base 编码

`Base32` 使用 RFC 4648 标准字符表 `ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`，编码包含必要的 `=` 填充；解码严格校验大写字符、长度、填充和补零位。字符串使用 UTF-8；整数先转换为最短大端字节序列（零为单个零字节），再编码。

`Base62` 使用字符表 `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`，完整规则见 [Base 编码指南](docs/zh-CN/base-codec.md)。

## 许可证

[MIT](LICENSE)
