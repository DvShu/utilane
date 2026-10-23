# utilane/node API 参考

[English](../../api/node.md) | 简体中文

<!-- 由贡献者与 AI 编码助手随源码变更维护。 -->

环境：Node.js 专用。返回[文档目录](../index.md)。

以下表格列出此入口可导入的名称；标为类型的名称请使用 `import type`。表外的辅助声明和父类不代表公共导出。默认值与运行时限制见分类指南及源码。

| 导出                   | 类别 | 说明                             |
| ---------------------- | ---- | -------------------------------- |
| `AESAlgorithmName`     | 类型 | 见下方类型声明与分类指南         |
| `aesDecrypt`           | 值   | 见下方类型声明与分类指南         |
| `AESDecryptOptions`    | 类型 | 见下方类型声明与分类指南         |
| `aesEncrypt`           | 值   | 见下方类型声明与分类指南         |
| `AESEncryptOptions`    | 类型 | 见下方类型声明与分类指南         |
| `exec`                 | 值   | 执行命令                         |
| `generateAESKey`       | 值   | 见下方类型声明与分类指南         |
| `generateIV`           | 值   | 见下方类型声明与分类指南         |
| `generateRSAKeyPair`   | 值   | 生成 RSA 密钥对                  |
| `hash`                 | 值   | 计算数据的哈希摘要               |
| `HashAlgorithmName`    | 类型 | 见下方类型声明与分类指南         |
| `hashDigest`           | 值   | 见下方类型声明与分类指南         |
| `HashOptions`          | 类型 | 见下方类型声明与分类指南         |
| `hmacHash`             | 值   | 使用 HMAC 算法对消息进行哈希处理 |
| `HmacOptions`          | 类型 | 见下方类型声明与分类指南         |
| `KeyPairOptions`       | 类型 | 见下方类型声明与分类指南         |
| `read`                 | 值   | 读取文件内容                     |
| `rsaDecrypt`           | 值   | 见下方类型声明与分类指南         |
| `rsaEncrypt`           | 值   | 见下方类型声明与分类指南         |
| `SHAHashAlgorithmName` | 类型 | 见下方类型声明与分类指南         |
| `spawn`                | 值   | 执行命令并返回执行结果的Promise  |
| `statTag`              | 值   | 根据文件的 stat 获取文件的 etag  |
| `write`                | 值   | 写入 JSON 格式的数据到文件       |

## 完整类型声明

以下声明参考包含重载、返回值和辅助类型，需随源码变更维护。发布包中的 .d.ts 由 tsdown 生成。相对导入描述声明关系，不是额外公共包路径。

```typescript
import { SpawnOptionsWithoutStdio } from "node:child_process";
type HashAlgorithmName = "md5" | SHAHashAlgorithmName;
type SHAHashAlgorithmName = "sha1" | "sha256" | "sha512";
type AESAlgorithmName = "aes-128-cbc" | "aes-192-cbc" | "aes-256-cbc";
interface HashOptions {
    algorithm?: HashAlgorithmName;
    upper?: boolean;
}
interface HmacOptions {
    algorithm?: SHAHashAlgorithmName;
    upper?: boolean;
}
interface AESEncryptOptions {
    algorithm?: AESAlgorithmName;
    upper?: boolean;
}
interface AESDecryptOptions {
    algorithm?: AESAlgorithmName;
    encoding?: "hex" | "base64";
}
interface KeyPairOptions {
    modulusLength?: 2048 | 3072 | 4096;
}
declare function hash(data: string, options?: HashOptions): string;
declare function hashDigest(data: string, options?: HashOptions): string;
declare function hmacHash(message: string, key: string, options?: HmacOptions): string;
declare function generateRSAKeyPair(options?: KeyPairOptions): Promise<[
    string,
    string
]>;
declare function aesEncrypt(key: string, input: string, options?: AESEncryptOptions): [
    string,
    string
];
declare function aesDecrypt(input: string, key: string | Buffer, iv?: string | Buffer, options?: AESDecryptOptions): string;
declare function rsaEncrypt(input: string, publicKey: string, encoding?: BufferEncoding): string;
declare function rsaDecrypt(encryptedData: string, privateKey: string, encoding?: BufferEncoding): string;
declare function generateAESKey(bits?: 128 | 192 | 256): string;
declare function generateIV(): string;
declare function read<T>(filepath: string, defaultValue?: T): Promise<T>;
declare function write(file: string, data: any, opts?: {
    json: boolean;
    format: boolean;
}): Promise<void>;
declare function statTag(filePath: string): Promise<string>;
declare function exec(command: string, args?: string[]): Promise<{
    stdout: string;
    stderr: string;
}>;
declare function exec(command: string, options?: SpawnOptions): Promise<{
    stdout: string;
    stderr: string;
}>;
declare function exec(command: string, args?: string[], options?: SpawnOptions): Promise<{
    stdout: string;
    stderr: string;
}>;
type SpawnOptions = SpawnOptionsWithoutStdio & {
    shell?: "powershell";
};
declare function spawn(command: string, args?: string[], options?: SpawnOptions): Promise<{
    stdout: string;
    stderr: string;
}>;
export { AESAlgorithmName, AESDecryptOptions, AESEncryptOptions, HashAlgorithmName, HashOptions, HmacOptions, KeyPairOptions, SHAHashAlgorithmName, aesDecrypt, aesEncrypt, exec, generateAESKey, generateIV, generateRSAKeyPair, hash, hashDigest, hmacHash, read, rsaDecrypt, rsaEncrypt, spawn, statTag, write };
```
