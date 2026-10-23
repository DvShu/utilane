# Base32 and Base62

English | [简体中文](zh-CN/base-codec.md)

Import from `utilane`. Environment: browser / Node.js with BigInt, TextEncoder, and TextDecoder. See the [root API](api/index.md) and [base-codec.ts](../src/base-codec.ts).

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

| Method                   | Input              | Result               |
| ------------------------ | ------------------ | -------------------- |
| `encode`                 | string or bigint   | Encoded string       |
| `encodeFromStr`          | UTF-8 string       | Encoded string       |
| `encodeFromInt`          | Nonnegative bigint | Encoded string       |
| `decode` / `decodeToStr` | Encoded string     | UTF-8 string         |
| `decodeToInt`            | Encoded string     | Nonnegative bigint   |
| `bufferToHex`            | Uint8Array         | Lowercase hex string |

Strings are converted to UTF-8. Integers use their shortest big-endian byte sequence; zero is one zero byte. Negative integers throw RangeError. Empty strings encode/decode as empty strings, while decoding empty input to an integer returns 0n. The default TextDecoder may insert replacement characters for invalid UTF-8.

Byte conversion methods and the BaseCodec parent are not public root exports. Do not import them through package internals.

## Base32

Uses the RFC 4648 alphabet ABCDEFGHIJKLMNOPQRSTUVWXYZ234567, five-bit groups, and required = padding. Decoding accepts only uppercase standard characters and correct padding. Lowercase, missing padding, whitespace, invalid lengths, and nonzero pad bits throw TypeError.

`encodeFromInt(102n)` encodes the byte 0x66, rather than formatting 102 directly in radix 32.

## Base62

Uses 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz. Bytes are treated as a big-endian integer, with a 0 character preserving each leading zero byte. There is no = padding. Cross-language interchange must agree on alphabet order, UTF-8, and leading-zero handling. Invalid characters throw TypeError.

Both formats are reversible encodings, not encryption.
