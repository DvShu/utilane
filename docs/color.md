# Colors

English | [简体中文](zh-CN/color.md)

Import from `utilane`. Environment: browser / Node.js. See the [root API](api/index.md) for signatures and object types, and [color.ts](../src/color.ts).

```ts
import { toHex, toRgb, rgbToHex } from "utilane";
toHex("#fff"); // "#fff"; valid hex strings are returned unchanged
toRgb("#ff0000"); // { r: 255, g: 0, b: 0 }
rgbToHex({ r: 255, g: 0, b: 0 }); // "#FF0000"
```

| API                             | Purpose                                                  |
| ------------------------------- | -------------------------------------------------------- |
| `toRgb` / `toHsv`               | Convert to an RGB / HSV object                           |
| `rgbToHex` / `toHex`            | Convert to hex                                           |
| `adjust(color, level?, light?)` | Lighten or darken; level defaults to 1 and light to true |

Supported inputs are defined by ColorType and the parser: hex, RGB strings, and color objects. This is not a complete CSS color parser. Do not assume support for named colors, CSS variables, or every modern CSS color syntax. Invalid inputs throw.
