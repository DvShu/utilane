# 文档目录

[English](../index.md) | 简体中文

先从 [README](../../README.zh-CN.md) 了解安装和入口，再按场景阅读指南。发布信息见[变更记录](../../CHANGELOG.zh-CN.md)。

| 模块                       | 指南                        | 源码                                                                         | 导入入口          |
| -------------------------- | --------------------------- | ---------------------------------------------------------------------------- | ----------------- |
| 字符串、数字、脱敏         | [common](common.md)         | [common.ts](../../src/common.ts)                                             | `utilane`         |
| 数组与集合                 | [array](array.md)           | [array.ts](../../src/array.ts)                                               | `utilane`         |
| 日期                       | [date](date.md)             | [date.ts](../../src/date.ts)                                                 | `utilane`         |
| 颜色                       | [color](color.md)           | [color.ts](../../src/color.ts)                                               | `utilane`         |
| ID                         | [id](id.md)                 | [id.ts](../../src/id.ts)                                                     | `utilane`         |
| Base 编码                  | [base-codec](base-codec.md) | [base-codec.ts](../../src/base-codec.ts)                                     | `utilane`         |
| Web Crypto / Node Crypto   | [crypto](crypto.md)         | [crypto.ts](../../src/crypto.ts)、[crypto_node.ts](../../src/crypto_node.ts) | 见指南            |
| 验证器                     | [validator](validator.md)   | [validator.ts](../../src/validator.ts)                                       | `utilane`         |
| DOM、复制、缓存、主题、Web | [browser](browser.md)       | [browser.ts](../../src/browser.ts)                                           | `utilane/browser` |
| 文件与子进程               | [node](node.md)             | [node.ts](../../src/node.ts)                                                 | `utilane/node`    |

## 完整 API 参考

- [根入口 API](api/index.md)
- [浏览器 API](api/browser.md)
- [Node.js API](api/node.md)

这些参考列出公共导出、重载、参数、返回值及辅助声明，由贡献者和 AI 随代码变更直接维护 Markdown。发布包中的 .d.ts 由 tsdown 生成。维护时需对照源码和构建声明检查签名，文档校验脚本不比较签名一致性。默认值与行为边界见分类指南及源码。辅助类型和父类不一定是公共导出，以导出表为准。

## AI 读取顺序

使用库：README → 本目录 → 对应指南 → 对应入口 API → 必要时阅读源码和测试。

修改库：先阅读 [AGENTS.md](../../AGENTS.md) 与[贡献指南](../../CONTRIBUTING.zh-CN.md)。不要推测不存在的导入路径，也不要混用两个 `hash` 的参数或返回值。
