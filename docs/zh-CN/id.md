# ID

[English](../id.md) | 简体中文

入口：`utilane`。环境：浏览器 / Node.js。签名见[根入口 API](api/index.md)，实现见 [id.ts](../../src/id.ts)。

```ts
import { SnowflakeID, ShortUUID } from "utilane";
const generator = new SnowflakeID(1);
const id = generator.generate();
const info = generator.parse(id);
const short = new ShortUUID();
const compact = short.encode("550e8400-e29b-41d4-a716-446655440000");
const restored = short.decode(compact).uuid;
```

## SnowflakeID

构造参数依次为机器码、起始时间戳、允许时钟回拨毫秒数，默认分别为 `1`、`1288834974657`、`5`。机器码范围为 0～1023。无效参数、超出允许范围的时钟回拨及非法 ID 会抛错。

`generate()` 返回含版本位的字符串；`parse()` 默认按带版本位解析。不要转为 number，以免丢失精度。同一进程内相同 epoch 和机器码共享状态；跨进程、跨机器仍需分配机器码，默认配置不能保证分布式唯一性。

## ShortUUID

`encode` 将 UUID 转为较短字符串；`decode` 返回 `{ uuidInt, uuid }`。它不负责生成随机 UUID，也不是加密。两端必须使用相同字符表。

解码时会将十六进制补齐为 32 位，恢复前导零，并返回带连字符的小写 UUID。全零 UUID 编码为字符表首字符（默认 `"0"`）。解码时拒绝超过 128 位的数值以及不在所选字符表中的字符。

```ts
import { ShortUUID } from "utilane";
const codec = new ShortUUID();
codec.encode("00000000-0000-0000-0000-000000000001"); // "1"
codec.decode("1").uuid; // "00000000-0000-0000-0000-000000000001"
codec.encode("00000000-0000-0000-0000-000000000000"); // "0"
codec.decode("0").uuid; // "00000000-0000-0000-0000-000000000000"
```
