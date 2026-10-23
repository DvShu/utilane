# Hashing and encryption

English | [简体中文](zh-CN/crypto.md)

The two entry points expose different crypto interfaces. See the [root API](api/index.md) and [Node API](api/node.md) for full signatures.

## Root entry: Web Crypto

```ts
import { hash, sha, hmacHash, bufferToHex } from "utilane";
const digest = await hash("hello");
const same = await sha("hello", false, "SHA-256");
const mac = await hmacHash("hello", "secret", "SHA-256");
bufferToHex(new Uint8Array([0, 255])); // "00ff"
```

`hash`(message, upper?, algorithm?) and sha return Promises, defaulting to SHA-256 and lowercase hex. Hmac`hash`(message, secret, algorithm?, upper?) defaults to SHA-256. The runtime must provide Web Crypto; browsers normally require HTTPS or another secure context.

The entry also exports aesEncrypt, aesDecrypt, rsaEncrypt, and rsaDecrypt. Key formats, output encodings, and return structures are defined in the declarations and [crypto.ts](../src/crypto.ts). Do not use the Node interface's argument order. Unsupported algorithms, invalid keys, or malformed input can reject async calls; handle these errors.

## Node entry: Node Crypto

```ts
import { hash, hmacHash } from "utilane/node";
const digest = hash("hello", { algorithm: "sha256", upper: false });
const mac = hmacHash("hello", "secret", { algorithm: "sha256" });
```

Node `hash` and hmacHash return strings synchronously, accept options objects, and use lowercase algorithm names. `hashDigest` is a deprecated alias of hash.

This entry also provides generateRSAKeyPair, generateAESKey, generateIV, and AES / RSA encryption and decryption. `generateRSAKeyPair` returns a Promise; see the API for the other return types. Implementation: [crypto_node.ts](../src/crypto_node.ts).

Hashes are not reversible encryption. Functions with the same name in different entries do not guarantee compatible arguments, key formats, or data envelopes. Agree on those formats before exchanging encrypted data.
