# IDs

English | [简体中文](zh-CN/id.md)

Import from `utilane`. Environment: browser / Node.js. See the [root API](api/index.md) and [id.ts](../src/id.ts).

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

Constructor arguments are machine ID, epoch timestamp, and allowed clock rollback in milliseconds. Defaults are 1, 1288834974657, and 5. Machine IDs range from 0 to 1023. Invalid arguments, excessive clock rollback, and invalid IDs throw.

`generate` returns a string including a version digit; parse expects that digit by default. Do not convert IDs to number: precision can be lost. Instances with the same epoch and machine ID share state within a process. Assign machine IDs across processes and machines; defaults do not guarantee distributed uniqueness.

## ShortUUID

`encode` converts a UUID to a shorter string; decode returns { uuidInt, uuid }. This does not generate random UUIDs or encrypt data. Both ends must use the same alphabet.

Decoding restores leading zeros to 32 hex digits and returns a lowercase UUID with hyphens. The nil (all-zero) UUID encodes to the first character of the alphabet (`"0"` by default). Values above 128 bits and characters outside the selected alphabet are rejected during decoding.

```ts
import { ShortUUID } from "utilane";
const codec = new ShortUUID();
codec.encode("00000000-0000-0000-0000-000000000001"); // "1"
codec.decode("1").uuid; // "00000000-0000-0000-0000-000000000001"
codec.encode("00000000-0000-0000-0000-000000000000"); // "0"
codec.decode("0").uuid; // "00000000-0000-0000-0000-000000000000"
```
