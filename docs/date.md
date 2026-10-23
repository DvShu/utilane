# Dates

English | [简体中文](zh-CN/date.md)

Import from `utilane`. Environment: browser / Node.js. See the [root API](api/index.md) and [date.ts](../src/date.ts).

```ts
import { format, parse, add, timestamp } from "utilane";
format(new Date(2026, 9, 23, 14, 5, 6)); // "2026-10-23 14:05:06"
add("2026-10-23", 1, "day", "yyyy-mm-dd"); // "2026-10-24"
parse(1700000000).getTime(); // 1700000000000
timestamp(new Date(1700000000000)); // 1700000000
```

| API                            | Result / purpose                                         |
| ------------------------------ | -------------------------------------------------------- |
| `format(date?, pattern?)`      | String; default pattern: yyyy-mm-dd HH:MM:ss             |
| `parse(date?)`                 | Date; omitted or null input means now                    |
| `dateOf(date?, unit?, isEnd?)` | Set a date boundary                                      |
| `startOf` / `endOf`            | Date; day boundary by default                            |
| `timestamp(date?, pre?)`       | Number; seconds by default, pass `"ms"` for milliseconds |
| `add(date, num, unit, fmt?)`   | Date without fmt, formatted string with fmt              |

Tokens are case-sensitive: mm means month, MM means minute, HH means 24-hour time, and S means three-digit milliseconds. Unit aliases include m for month, M for minute, and d for day.

These tools use native Date. Strings without a timezone are generally interpreted in local time; this is not a timezone library. Numeric inputs at or below 9999999999 are treated as seconds; larger numbers as milliseconds. Invalid units throw; invalid dates can produce Invalid Date.

Month boundaries account for month length and leap years. Year boundaries preserve the input year and end on December 31. Ending boundaries use the final millisecond of the selected unit in local time; these functions return a new Date without changing the input.

```ts
import { endOf, format } from "utilane";
format(endOf(new Date(2024, 1, 15), "month"), "yyyy-mm-dd HH:MM:ss.S");
// "2024-02-29 23:59:59.999"
format(endOf(new Date(2024, 1, 15), "year"), "yyyy-mm-dd HH:MM:ss.S");
// "2024-12-31 23:59:59.999"
```
