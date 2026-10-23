# 颜色

[English](../color.md) | 简体中文

入口：`utilane`。环境：浏览器 / Node.js。签名及对象类型见[根入口 API](api/index.md)，实现见 [color.ts](../../src/color.ts)。

```ts
import { toHex, toRgb, rgbToHex } from "utilane";
toHex("#fff"); // "#fff"，合法十六进制字符串原样返回
toRgb("#ff0000"); // { r: 255, g: 0, b: 0 }
rgbToHex({ r: 255, g: 0, b: 0 }); // "#FF0000"
```

| API                             | 用途                                       |
| ------------------------------- | ------------------------------------------ |
| `toRgb` / `toHsv`               | 转为 RGB / HSV 对象                        |
| `rgbToHex` / `toHex`            | 转为十六进制                               |
| `adjust(color, level?, light?)` | 调浅或调深；默认 level 为 1、light 为 true |

支持输入以 ColorType 和解析器为准，包括十六进制、RGB 字符串及颜色对象。不是完整 CSS 颜色解析器，不应假设支持命名颜色、CSS 变量或所有 CSS 新颜色语法。无法解析的输入会抛错。
