# 变更记录

[English](CHANGELOG.md) | 简体中文

## Unreleased

### 修复

- 简化文档维护：贡献者和 AI 直接编辑双语 Markdown，发布前使用独立只读脚本校验；移除 Markdown 自动生成流程及额外英文描述映射。
- Storage get 原样保留保存的假值及假值默认值，统一缺失和过期数据的回退处理，保留读取后删除行为，补充 session/local Storage 回归测试。
- ShortUUID 解码时补齐十六进制前导零，全零 UUID 编码为字符表首字符；补充前导零、自定义字符表及 128 位边界回归测试。
- 修正 endOf、dateOf 的月末和年末边界，覆盖闰年；修正与 startOf 共用的年份单位匹配，并保留 0～99 年的真实年份，增加日期边界回归测试。

### 首次发布准备 — 1.0.0

- 接入 Oxlint 和 Oxfmt 配置、lint/修复与格式化/检查命令，并纳入发布前校验。

- 明确 AI 在同一任务直接维护中文源码注释、全部中英文 Markdown 指南及 API 参考，使用只读文档脚本校验。
- 面向浏览器和 Node.js 的 TypeScript / JavaScript ESM 工具库。
- 三个公共入口：utilane、utilane/browser、utilane/node。
- 字符串、数值、数组、日期、颜色、ID、摘要加密、验证器及浏览器 / Node 工具。
- RFC 4648 Base32 和 Base62 编解码。
- 类型声明、按名称导入及 tree-shaking 支持。
- 默认英文及完整中文指南、由 AI 维护的双语 API 参考。
- AI 文档索引、贡献指南和工程维护规则。
- 类型检查、编解码测试、双语文档校验及发布前验证。

当前为 Utilane 首次发布准备，版本号设为 1.0.0。正式发布时再补充实际版本标题和发布日期。
