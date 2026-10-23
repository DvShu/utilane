# 字符串、数字与通用工具

[English](../common.md) | 简体中文

入口：`utilane`。环境：浏览器 / Node.js。完整签名见[根入口 API](api/index.md)，实现见 [common.ts](../../src/common.ts)。

```ts
import { isBlank, isNumeric, shieldMobile, random, round } from "utilane";
isBlank("  "); // true
isBlank("  ", false); // false
isNumeric("-12.5"); // true
shieldMobile("13812345678"); // "138****5678"
random(8); // 长度为 8 的随机字符串
random({ min: 1, max: 10 }); // 整数，包含 1，不包含 10
round(1.234, 2); // 1.23
```

| 功能         | API                                                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 判断         | `isBlank`、`isNumeric`、`isBoolean`                                                                                                             |
| 脱敏         | `shieldMobile`、`shieldString`、`shieldWithLimit`、`smartSummary`、`shieldEmail`、`shieldIdCard`、`shieldBankCard`、`shieldName`、`smartShield` |
| 随机         | `random`                                                                                                                                        |
| 数值         | `formatMoney`、`round`                                                                                                                          |
| 字符串与对象 | `snakeCaseStyle`、`reverseStr`、`getJSONValue`、`formatData`                                                                                    |

`isBlank` 对 null / undefined 返回 true，不是通用空对象判断器。`isNumeric` 默认允许符号和小数，通过 `isPositive`、`isFloat` 调整。`isBoolean` 判断字符串是否为 `"true"` 或 `"false"`。

`random` 使用 Math.random，不适合生成密钥或安全令牌。范围模式默认 `isInteger: true`、`hasEnd: false`；字符串模式必须提供长度。

`formatMoney` 使用 `Intl.NumberFormat("zh-CN")`，固定两位小数，遵循 Intl 的舍入规则，不是截断函数。复杂脱敏与数据转换选项见 API 声明和源码，避免根据名称猜测参数顺序。
