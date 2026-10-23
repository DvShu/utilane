import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { ShortUUID } from "utilane";

function formatUuid(hex) {
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

test("ShortUUID restores every possible number of leading zero hex digits", () => {
  const codec = new ShortUUID();
  for (let zeros = 1; zeros <= 31; zeros++) {
    const hex = "0".repeat(zeros) + "1".repeat(32 - zeros);
    const uuid = formatUuid(hex);
    assert.deepEqual(codec.decode(codec.encode(uuid)), { uuidInt: BigInt(`0x${hex}`), uuid });
  }
  assert.equal(codec.decode("1").uuid, "00000000-0000-0000-0000-000000000001");
});

test("ShortUUID represents the nil UUID with the alphabet's zero character", () => {
  const codec = new ShortUUID();
  const uuid = "00000000-0000-0000-0000-000000000000";
  assert.equal(codec.encode(uuid), "0");
  assert.deepEqual(codec.decode("0"), { uuidInt: 0n, uuid });
});

test("ShortUUID preserves ordinary, maximum, and random UUIDs", () => {
  const codec = new ShortUUID();
  for (const uuid of [
    "550e8400-e29b-41d4-a716-446655440000",
    "ffffffff-ffff-ffff-ffff-ffffffffffff",
    ...Array.from({ length: 100 }, () => randomUUID()),
  ]) {
    assert.equal(codec.decode(codec.encode(uuid)).uuid, uuid);
  }
  const uuid = "ABCDEF00-1234-5678-9ABC-DEF012345678";
  assert.equal(codec.decode(codec.encode(uuid)).uuid, uuid.toLowerCase());
});

test("ShortUUID supports leading zeros with custom constructor and method alphabets", () => {
  const alphabet = "fedcba9876543210";
  const configured = new ShortUUID(alphabet);
  const defaultCodec = new ShortUUID();
  for (const uuid of [
    "00000000-0000-0000-0000-000000000000",
    "00000000-0000-0000-0000-000000000001",
    "00abcdef-1234-5678-9abc-def012345678",
  ]) {
    assert.equal(configured.decode(configured.encode(uuid)).uuid, uuid);
    assert.equal(defaultCodec.decode(defaultCodec.encode(uuid, alphabet), alphabet).uuid, uuid);
  }
  assert.equal(configured.encode("00000000-0000-0000-0000-000000000000"), "f");
});

test("ShortUUID still rejects decoded integers above 128 bits and invalid characters", () => {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const codec = new ShortUUID(alphabet);
  assert.throws(() => codec.decode((1n << 128n).toString(36)), /Invalid UUID/);
  assert.throws(() => codec.decode("!"), /not found in alphabet/);
});
