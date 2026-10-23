import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { Base32, Base62 } from "../lib/index.js";

test("Base32 matches RFC 4648 section 10 vectors", () => {
  const codec = new Base32();
  for (const [plain, encoded] of [
    ["", ""],
    ["f", "MY======"],
    ["fo", "MZXQ===="],
    ["foo", "MZXW6==="],
    ["foob", "MZXW6YQ="],
    ["fooba", "MZXW6YTB"],
    ["foobar", "MZXW6YTBOI======"],
  ]) {
    assert.equal(codec.encode(plain), encoded);
    assert.equal(codec.decode(encoded), plain);
  }
});

test("Base32 preserves binary data, including leading zeros", () => {
  // Expose protected byte methods through a test subclass.
  class ByteCodec extends Base32 {
    encodeBytes(bytes) {
      return this.encodeFromBytes(bytes);
    }
    decodeBytes(text) {
      return this.decodeToBytes(text);
    }
  }
  const codec = new ByteCodec();
  for (let length = 0; length <= 256; length++) {
    const bytes = new Uint8Array(randomBytes(length));
    if (length > 0) bytes[0] = 0;
    assert.deepEqual(codec.decodeBytes(codec.encodeBytes(bytes)), bytes);
  }
  assert.equal(codec.encodeBytes(new Uint8Array([0])), "AA======");
  assert.deepEqual(codec.decodeBytes("AAAQ===="), new Uint8Array([0, 1]));
});

test("Base32 rejects malformed input and nonzero padding bits", () => {
  const codec = new Base32();
  for (const invalid of [
    "MY",
    "my======",
    "MY=====",
    "MY=======",
    "MY======\n",
    "M0======",
    "M1======",
    "M8======",
    "M=Y=====",
    "========",
    "A=======",
    "AAA=====",
    "AAAAAA==",
    "MY======MY======",
    "MZ======",
    "MZXR====",
    "MZXW7===",
    "MZXW6YR=",
  ]) {
    assert.throws(() => codec.decode(invalid), TypeError, invalid);
  }
});

test("Base32 reuses UTF-8 and big-endian integer interfaces", () => {
  const codec = new Base32();
  assert.equal(codec.decode(codec.encode("你好 🌍")), "你好 🌍");
  assert.equal(codec.encodeFromInt(102n), "MY======");
  assert.equal(codec.encodeFromInt(0n), "AA======");
  for (const value of [0n, 1n, 255n, 256n, 2n ** 128n - 1n]) {
    assert.equal(codec.decodeToInt(codec.encode(value)), value);
  }
  assert.throws(() => codec.encode(-1n), RangeError);
});

test("Base62 retains its alphabet and conversion behavior", () => {
  const codec = new Base62();
  for (const [value, encoded] of [
    [0n, "0"],
    [61n, "z"],
    [62n, "10"],
    [3843n, "zz"],
  ]) {
    assert.equal(codec.encode(value), encoded);
    assert.equal(codec.decodeToInt(encoded), value);
  }
  for (const value of ["", "hello", "你好", "\0\0hello"]) {
    assert.equal(codec.decode(codec.encode(value)), value);
  }
});
