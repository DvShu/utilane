# 摘要与加密

[English](../crypto.md) | 简体中文

本页说明导入入口差异。完整签名见[根入口 API](api/index.md)和 [Node.js API](api/node.md)。

## 通用入口：Web Crypto

```ts
import { hash, sha, hmacHash, bufferToHex } from "utilane";
const digest = await hash("hello");
const same = await sha("hello", false, "SHA-256");
const mac = await hmacHash("hello", "secret", "SHA-256");
bufferToHex(new Uint8Array([0, 255])); // "00ff"
```

`hash(message, upper?, algorithm?)` 和 `sha` 返回 Promise，默认 SHA-256、小写十六进制。`hmacHash(message, secret, algorithm?, upper?)` 默认 SHA-256。运行时需要 Web Crypto；浏览器通常需要 HTTPS 或本地安全上下文。

还导出 `aesEncrypt`、`aesDecrypt`、`rsaEncrypt`、`rsaDecrypt`，密钥、输出编码和返回结构见类型声明与 [crypto.ts](../../src/crypto.ts)。不应按 Node 入口的调用方式使用它们。算法不受支持、密钥错误或输入格式错误时，异步调用可能拒绝，应处理异常。

## Node 入口：Node Crypto

```ts
import { hash, hmacHash } from "utilane/node";
const digest = hash("hello", { algorithm: "sha256", upper: false });
const mac = hmacHash("hello", "secret", { algorithm: "sha256" });
```

Node `hash`、`hmacHash` 同步返回字符串，选项为对象，算法名称使用小写形式。`hashDigest` 是已弃用的 hash 别名。

还提供 `generateRSAKeyPair`、`generateAESKey`、`generateIV` 及 AES / RSA 编解密函数。`generateRSAKeyPair` 返回 Promise，其余返回类型见 API。实现见 [crypto_node.ts](../../src/crypto_node.ts)。

摘要不是可逆加密。两种入口的同名函数不保证参数、密钥格式或输出封装兼容，交换加密数据前需明确约定。
