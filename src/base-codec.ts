/** 通用进制编码解码器，兼容 Node.js 和浏览器环境 */
const BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export class BaseCodec {
  protected readonly alphabet: string;
  protected readonly base: bigint;
  protected readonly name: string;

  constructor(name: string, alphabet: string) {
    this.alphabet = alphabet;
    this.base = BigInt(alphabet.length);
    this.name = name;
  }

  protected intToBytes(value: bigint): Uint8Array {
    if (value < 0n) throw new RangeError("Only supports non-negative integers");
    if (value === 0n) return new Uint8Array([0]);

    const bytes: number[] = [];
    while (value > 0n) {
      bytes.unshift(Number(value & 0xffn));
      value >>= 8n;
    }
    return new Uint8Array(bytes);
  }

  protected bytesToInt(bytes: Uint8Array): bigint {
    let value = 0n;
    for (const byte of bytes) value = (value << 8n) | BigInt(byte);
    return value;
  }

  protected concatBytes(...arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }

  protected bytesToUtf8(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes);
  }

  protected utf8ToBytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  protected bytesToHex(bytes: Uint8Array): string {
    let hex = "";
    for (const byte of bytes) {
      hex += byte.toString(16).padStart(2, "0");
    }
    return hex;
  }

  protected encodeFromBytes(input: Uint8Array): string {
    if (input.length === 0) return "";

    let leadingZeros = 0;
    while (leadingZeros < input.length && input[leadingZeros] === 0) leadingZeros++;

    let value = this.bytesToInt(input);
    let encoded = "";
    while (value > 0n) {
      encoded = this.alphabet.charAt(Number(value % this.base)) + encoded;
      value /= this.base;
    }

    return this.alphabet.charAt(0).repeat(leadingZeros) + encoded;
  }

  protected decodeToBytes(input: string): Uint8Array {
    if (input.length === 0) return new Uint8Array(0);

    let leadingZeros = 0;
    while (leadingZeros < input.length && input.charAt(leadingZeros) === this.alphabet.charAt(0)) {
      leadingZeros++;
    }

    let value = 0n;
    for (const char of input.slice(leadingZeros)) {
      const index = this.alphabet.indexOf(char);
      if (index === -1) throw new TypeError(`Invalid ${this.name} character: ${char}`);
      value = value * this.base + BigInt(index);
    }

    const valueBytes = value === 0n ? new Uint8Array(0) : this.intToBytes(value);
    return this.concatBytes(new Uint8Array(leadingZeros), valueBytes);
  }

  /** 将非负 bigint 转为最短大端字节序列后编码，零表示为单个零字节 */
  encodeFromInt(value: bigint): string {
    return this.encodeFromBytes(this.intToBytes(value));
  }

  /** 先将字符串转换为 UTF-8 字节，再编码 */
  encodeFromStr(value: string): string {
    return this.encodeFromBytes(this.utf8ToBytes(value));
  }

  /** 根据参数类型将 bigint 或字符串编码 */
  encode(value: bigint | string): string {
    return typeof value === "bigint" ? this.encodeFromInt(value) : this.encodeFromStr(value);
  }

  /** 解码为非负 bigint */
  decodeToInt(value: string): bigint {
    return this.bytesToInt(this.decodeToBytes(value));
  }

  /** 解码为 UTF-8 字符串 */
  decodeToStr(value: string): string {
    return this.bytesToUtf8(this.decodeToBytes(value));
  }

  /** 默认解码为 UTF-8 字符串 */
  decode(value: string): string {
    return this.decodeToStr(value);
  }

  /** 将字节数组转换为十六进制字符串 */
  bufferToHex(value: Uint8Array): string {
    return this.bytesToHex(value);
  }
}

/** RFC 4648 Base32：使用大写字符和 = 填充，严格校验解码输入 */
export class Base32 extends BaseCodec {
  constructor() {
    super("Base32", BASE32_ALPHABET);
  }

  protected override encodeFromBytes(input: Uint8Array): string {
    let buffer = 0;
    let bits = 0;
    let encoded = "";

    for (const byte of input) {
      buffer = (buffer << 8) | byte;
      bits += 8;
      while (bits >= 5) {
        bits -= 5;
        encoded += this.alphabet.charAt((buffer >>> bits) & 31);
      }
      buffer &= (1 << bits) - 1;
    }

    if (bits > 0) encoded += this.alphabet.charAt(buffer << (5 - bits));
    return encoded.padEnd(Math.ceil(encoded.length / 8) * 8, "=");
  }

  protected override decodeToBytes(input: string): Uint8Array {
    if (input.length % 8 !== 0 || !/^[A-Z2-7]*={0,6}$/.test(input)) {
      throw new TypeError("Invalid Base32 characters, length or padding");
    }

    const paddingStart = input.indexOf("=");
    const dataLength = paddingStart === -1 ? input.length : paddingStart;
    const paddingLength = input.length - dataLength;
    const expectedPadding = [0, -1, 6, -1, 4, 3, -1, 1][dataLength % 8];
    if (paddingLength !== expectedPadding) throw new TypeError("Invalid Base32 padding");
    const decoded = new Uint8Array(Math.floor((dataLength * 5) / 8));
    let buffer = 0;
    let bits = 0;
    let offset = 0;

    for (let i = 0; i < dataLength; i++) {
      buffer = (buffer << 5) | this.alphabet.indexOf(input.charAt(i));
      bits += 5;
      if (bits >= 8) {
        bits -= 8;
        decoded[offset++] = (buffer >>> bits) & 0xff;
      }
      buffer &= (1 << bits) - 1;
    }

    if (buffer !== 0) throw new TypeError("Invalid Base32 padding bits");
    return decoded;
  }
}

/** 使用 0-9、A-Z、a-z 字符表的 Base62 整数进制编解码器 */
export class Base62 extends BaseCodec {
  constructor() {
    super("Base62", BASE62_ALPHABET);
  }
}
