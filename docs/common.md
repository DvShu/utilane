# Common utilities

English | [简体中文](zh-CN/common.md)

Import from `utilane`. Environment: browser / Node.js. See the [root API](api/index.md) for signatures and [common.ts](../src/common.ts) for implementation.

```ts
import { isBlank, isNumeric, shieldMobile, random, round } from "utilane";
isBlank("  "); // true
isBlank("  ", false); // false
isNumeric("-12.5"); // true
shieldMobile("13812345678"); // "138****5678"
random(8); // Random string of length 8
random({ min: 1, max: 10 }); // Integer from 1 inclusive to 10 exclusive
round(1.234, 2); // 1.23
```

| Purpose             | APIs                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Checks              | `isBlank`, `isNumeric`, `isBoolean`                                                                                                             |
| Masking             | `shieldMobile`, `shieldString`, `shieldWithLimit`, `smartSummary`, `shieldEmail`, `shieldIdCard`, `shieldBankCard`, `shieldName`, `smartShield` |
| Random values       | `random`                                                                                                                                        |
| Numbers             | `formatMoney`, `round`                                                                                                                          |
| Strings and objects | `snakeCaseStyle`, `reverseStr`, `getJSONValue`, `formatData`                                                                                    |

`isBlank` returns true for null / undefined; it is not a general empty-object check. `isNumeric` allows signs and decimals by default; configure isPositive and isFloat as needed. `isBoolean` checks for the strings `"true"` and `"false"`.

`random` uses Math.random and is unsuitable for keys or security tokens. Range mode defaults to isInteger: true and hasEnd: false. String mode requires a length.

`formatMoney` uses Intl.NumberFormat with the zh-CN locale and two fractional digits. It follows Intl rounding behavior, rather than truncating. See the declarations and source for advanced masking and conversion options instead of inferring argument order from names.
