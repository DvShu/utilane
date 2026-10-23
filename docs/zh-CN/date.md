# 日期

[English](../date.md) | 简体中文

入口：`utilane`。环境：浏览器 / Node.js。签名见[根入口 API](api/index.md)，实现见 [date.ts](../../src/date.ts)。

```ts
import { format, parse, add, timestamp } from "utilane";
format(new Date(2026, 9, 23, 14, 5, 6)); // "2026-10-23 14:05:06"
add("2026-10-23", 1, "day", "yyyy-mm-dd"); // "2026-10-24"
parse(1700000000).getTime(); // 1700000000000
timestamp(new Date(1700000000000)); // 1700000000
```

| API                            | 返回值 / 用途                          |
| ------------------------------ | -------------------------------------- |
| `format(date?, pattern?)`      | 字符串；默认格式 `yyyy-mm-dd HH:MM:ss` |
| `parse(date?)`                 | Date；不传或传 null 时使用当前时间     |
| `dateOf(date?, unit?, isEnd?)` | 设置日期边界                           |
| `startOf` / `endOf`            | Date；默认按天取边界                   |
| `timestamp(date?, pre?)`       | 数字；默认秒，传 `"ms"` 返回毫秒       |
| `add(date, num, unit, fmt?)`   | 不传 fmt 返回 Date，传 fmt 返回字符串  |

格式区分大小写：`mm` 为月、`MM` 为分钟、`HH` 为 24 小时、`S` 为三位毫秒。单位别名中 `m` 为月、`M` 为分钟、`d` 为天。

基于原生 Date，无时区字符串通常按本地时区处理，不是独立时区库。数字输入小于等于 `9999999999` 时按秒处理，否则按毫秒处理。非法单位会抛错；非法日期可能产生 Invalid Date。

月边界按实际月份天数和闰年计算，年边界保留输入年份并结束于 12 月 31 日。结束边界取本地时区所选单位的最后一毫秒；函数返回新的 Date，不修改输入日期。

```ts
import { endOf, format } from "utilane";
format(endOf(new Date(2024, 1, 15), "month"), "yyyy-mm-dd HH:MM:ss.S");
// "2024-02-29 23:59:59.999"
format(endOf(new Date(2024, 1, 15), "year"), "yyyy-mm-dd HH:MM:ss.S");
// "2024-12-31 23:59:59.999"
```
