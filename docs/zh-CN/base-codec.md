# Base32 / Base62

[English](../base-codec.md) | 简体中文

入口：`utilane`。环境：浏览器 / Node.js，需要 BigInt、TextEncoder 和 TextDecoder。完整签名见[根入口 API](api/index.md)，实现见 [base-codec.ts](../../src/base-codec.ts)。

```ts
import { Base32, Base62 } from "utilane";
const base32 = new Base32();
base32.encode("foo"); // "MZXW6==="
base32.decode("MZXW6==="); // "foo"
base32.encodeFromInt(102n); // "MY======"
base32.decodeToInt("MY======"); // 102n
const base62 = new Base62();
base62.encode(62n); // "10"
base62.decodeToInt("10"); // 62n
```

| 方法                     | 输入             | 返回值             |
| ------------------------ | ---------------- | ------------------ |
| `encode`                 | string 或 bigint | 编码字符串         |
| `encodeFromStr`          | UTF-8 字符串     | 编码字符串         |
| `encodeFromInt`          | 非负 bigint      | 编码字符串         |
| `decode` / `decodeToStr` | 编码字符串       | UTF-8 字符串       |
| `decodeToInt`            | 编码字符串       | 非负 bigint        |
| `bufferToHex`            | Uint8Array       | 小写十六进制字符串 |

字符串先转 UTF-8；整数先转为最短大端字节序列，零为单个零字节，负整数抛 RangeError。空字符串编码、解码仍为空字符串；空编码解码为整数得到 0n。默认 TextDecoder 对无效 UTF-8 可能产生替代字符。

字节编解码方法及 BaseCodec 父类不作为根入口公共 API 导出，不要从包内部路径导入。

## Base32

使用 RFC 4648 字符表 `ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`，按 5 位分组，编码补齐必要的 `=`。解码仅接受大写标准字符和正确填充，拒绝小写、缺失填充、空白、错误长度及非零补位，失败抛 TypeError。

`encodeFromInt(102n)` 是对字节 `0x66` 编码，不是直接将整数表示为 32 进制。

## Base62

字符表为 `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`；字节按大端整数进行进制转换，用字符 `0` 保留前导零字节，不使用 `=`。跨语言交换必须约定字符表顺序、UTF-8 和前导零规则。非法字符抛 TypeError。

两种编码均可逆，不提供加密或保密能力。
