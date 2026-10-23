# utilane/node API reference

English | [简体中文](../zh-CN/api/node.md)

<!-- Maintained with source changes by contributors and AI coding agents. -->

Environment: Node.js only. Back to the [documentation index](../index.md).

The table lists names you can import from this entry. Use `import type` for types. Supporting declarations and parent classes are not necessarily public exports. See the guides and source for defaults and runtime limitations.

| Export                 | Kind  | Description                                                    |
| ---------------------- | ----- | -------------------------------------------------------------- |
| `AESAlgorithmName`     | Type  | Supported Node AES algorithm names.                            |
| `aesDecrypt`           | Value | Decrypt AES data; see entry-specific key and argument formats. |
| `AESDecryptOptions`    | Type  | Node AES decryption options.                                   |
| `aesEncrypt`           | Value | Encrypt AES data; see entry-specific key and argument formats. |
| `AESEncryptOptions`    | Type  | Node AES encryption options.                                   |
| `exec`                 | Value | Execute a command with execFile; shell is enabled by default.  |
| `generateAESKey`       | Value | Generate an AES key.                                           |
| `generateIV`           | Value | Generate an initialization vector.                             |
| `generateRSAKeyPair`   | Value | Generate an RSA key pair asynchronously.                       |
| `hash`                 | Value | Compute a digest synchronously with Node Crypto.               |
| `HashAlgorithmName`    | Type  | Supported Node hash algorithm names.                           |
| `hashDigest`           | Value | Deprecated alias of the Node hash function.                    |
| `HashOptions`          | Type  | Node hash options.                                             |
| `hmacHash`             | Value | Compute a keyed digest synchronously with Node Crypto.         |
| `HmacOptions`          | Type  | Node HMAC options.                                             |
| `KeyPairOptions`       | Type  | RSA key pair options.                                          |
| `read`                 | Value | Read text or JSON, with an optional fallback.                  |
| `rsaDecrypt`           | Value | Decrypt RSA data; see entry-specific formats.                  |
| `rsaEncrypt`           | Value | Encrypt RSA data; see entry-specific formats.                  |
| `SHAHashAlgorithmName` | Type  | Supported Node SHA algorithm names.                            |
| `spawn`                | Value | Start a child process and collect its output.                  |
| `statTag`              | Value | Build a file tag from size and modification time.              |
| `write`                | Value | Write data to a file, optionally as formatted JSON.            |

## Complete type declarations

The declaration reference below includes overloads, return types, and supporting types. Maintain it alongside source changes. tsdown generates the distributed .d.ts files. Relative imports describe declaration relationships, not additional public package paths.

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
