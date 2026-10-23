import {
  createHash,
  createCipheriv,
  randomBytes,
  generateKeyPair,
  createDecipheriv,
  privateDecrypt,
  publicEncrypt,
  createHmac,
  constants,
} from "node:crypto";

// ============ 类型定义 ============
export type HashAlgorithmName = "md5" | SHAHashAlgorithmName;
export type SHAHashAlgorithmName = "sha1" | "sha256" | "sha512";
export type AESAlgorithmName = "aes-128-cbc" | "aes-192-cbc" | "aes-256-cbc";

export interface HashOptions {
  algorithm?: HashAlgorithmName;
  upper?: boolean;
}

export interface HmacOptions {
  algorithm?: SHAHashAlgorithmName;
  upper?: boolean;
}

export interface AESEncryptOptions {
  algorithm?: AESAlgorithmName;
  upper?: boolean;
}

export interface AESDecryptOptions {
  algorithm?: AESAlgorithmName;
  encoding?: "hex" | "base64";
}

export interface KeyPairOptions {
  modulusLength?: 2048 | 3072 | 4096;
}

// ============ 常量定义 ============
const DEFAULT_HASH_ALGORITHM: HashAlgorithmName = "sha256";
const DEFAULT_AES_ALGORITHM: AESAlgorithmName = "aes-256-cbc";
const DEFAULT_ENCODING = "hex" as const;
const IV_LENGTH = 16;
const RSA_MODULUS_LENGTH = 2048;

// ============ 哈希相关函数 ============

/**
 * 计算数据的哈希摘要
 * @example
 * hash("hello world")
 * // "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
 */
export function hash(data: string, options: HashOptions = {}): string {
  const { algorithm = DEFAULT_HASH_ALGORITHM, upper = false } = options;
  const hashed = createHash(algorithm).update(data).digest("hex");
  return upper ? hashed.toUpperCase() : hashed;
}

/**
 * @deprecated 请直接使用 hash 函数
 */
export function hashDigest(data: string, options: HashOptions = {}): string {
  return hash(data, options);
}

/**
 * 使用 HMAC 算法对消息进行哈希处理
 */
export function hmacHash(message: string, key: string, options: HmacOptions = {}): string {
  const { algorithm = DEFAULT_HASH_ALGORITHM as SHAHashAlgorithmName, upper = false } = options;
  const hashed = createHmac(algorithm, key).update(message).digest("hex");
  return upper ? hashed.toUpperCase() : hashed;
}

// ============ 密钥生成相关函数 ============

/**
 * 生成 RSA 密钥对
 */
export async function generateRSAKeyPair(options: KeyPairOptions = {}): Promise<[string, string]> {
  const { modulusLength = RSA_MODULUS_LENGTH } = options;

  return new Promise((resolve, reject) => {
    generateKeyPair(
      "rsa",
      {
        modulusLength,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve([publicKey, privateKey]);
        }
      },
    );
  });
}

// ============ AES 加解密相关函数 ============

export function aesEncrypt(
  key: string,
  input: string,
  options: AESEncryptOptions = {},
): [string, string] {
  const { algorithm = DEFAULT_AES_ALGORITHM, upper = false } = options;

  const requiredKeyLength = parseInt(algorithm.split("-")[1]) / 8;
  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length !== requiredKeyLength) {
    throw new Error(
      `Invalid key length for ${algorithm}: expected ${requiredKeyLength} bytes, got ${keyBuffer.length} bytes`,
    );
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(algorithm, keyBuffer, iv);

  let encryptedData = cipher.update(input, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return [upper ? encryptedData.toUpperCase() : encryptedData, iv.toString("hex")];
}

export function aesDecrypt(
  input: string,
  key: string | Buffer,
  iv?: string | Buffer,
  options: AESDecryptOptions = {},
): string {
  const { algorithm = DEFAULT_AES_ALGORITHM, encoding = DEFAULT_ENCODING } = options;

  const keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key, "hex");

  const requiredKeyLength = parseInt(algorithm.split("-")[1]) / 8;
  if (keyBuffer.length !== requiredKeyLength) {
    throw new Error(
      `Invalid key length for ${algorithm}: expected ${requiredKeyLength} bytes, got ${keyBuffer.length} bytes`,
    );
  }

  const ivBuffer = iv
    ? Buffer.isBuffer(iv)
      ? iv
      : Buffer.from(iv, "hex")
    : Buffer.alloc(IV_LENGTH, 0);

  const decipher = createDecipheriv(algorithm, keyBuffer, ivBuffer);

  let decryptedData = decipher.update(input, encoding, "utf-8");
  decryptedData += decipher.final("utf-8");

  return decryptedData;
}

// ============ RSA 加解密相关函数 ============

export function rsaEncrypt(
  input: string,
  publicKey: string,
  encoding: BufferEncoding = "base64",
): string {
  return publicEncrypt(
    {
      key: publicKey,
      oaepHash: "sha256",
      padding: constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(input, "utf-8"),
  ).toString(encoding);
}

export function rsaDecrypt(
  encryptedData: string,
  privateKey: string,
  encoding: BufferEncoding = "base64",
): string {
  return privateDecrypt(
    {
      key: privateKey,
      oaepHash: "sha256",
      padding: constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(encryptedData, encoding),
  ).toString("utf-8");
}

// ============ 辅助工具函数 ============

export function generateAESKey(bits: 128 | 192 | 256 = 256): string {
  return randomBytes(bits / 8).toString("hex");
}

export function generateIV(): string {
  return randomBytes(IV_LENGTH).toString("hex");
}
