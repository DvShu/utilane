import assert from "node:assert/strict";
import test from "node:test";
import { set, get } from "utilane/browser";

function installStorage(t) {
  for (const name of ["sessionStorage", "localStorage"]) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
    const entries = new Map();
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value: {
        getItem: (key) => entries.get(String(key)) ?? null,
        setItem: (key, value) => entries.set(String(key), String(value)),
        removeItem: (key) => entries.delete(String(key)),
        clear: () => entries.clear(),
      },
    });
    t.after(() => {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    });
  }
}

test("Storage preserves stored false, zero, empty string, and null", (t) => {
  installStorage(t);
  for (const storage of ["session", "local"]) {
    for (const value of [false, 0, "", null]) {
      set("value", value, { storage });
      assert.equal(get("value", "fallback", { storage }), value);
      assert.equal(get("value", undefined, { storage }), value);
    }
  }
});

test("Storage preserves falsy defaults and returns null when no default exists", (t) => {
  installStorage(t);
  for (const storage of ["session", "local"]) {
    for (const fallback of [false, 0, "", null]) {
      assert.equal(get("missing", fallback, { storage }), fallback);
    }
    assert.equal(get("missing", undefined, { storage }), null);
    set("undefined", undefined, { storage });
    assert.equal(get("undefined", false, { storage }), false);
    assert.equal(get("undefined", undefined, { storage }), null);
  }
});

test("Storage expiration removes data and respects falsy defaults", (t) => {
  installStorage(t);
  let now = 100_000;
  t.mock.method(Date, "now", () => now);
  for (const fallback of [false, 0, "", null, undefined]) {
    for (const storage of ["session", "local"]) {
      set("expired", "old", { storage, expire: 1 });
      now += 2_000;
      assert.equal(get("expired", fallback, { storage }), fallback === undefined ? null : fallback);
      assert.equal(globalThis[`${storage}Storage`].getItem("expired"), null);
    }
  }
});

test("Storage keeps unexpired falsy values and supports delete after reading", (t) => {
  installStorage(t);
  t.mock.method(Date, "now", () => 100_000);
  for (const storage of ["session", "local"]) {
    set("value", false, { storage, expire: 60 });
    assert.equal(get("value", true, { storage }), false);
    assert.notEqual(globalThis[`${storage}Storage`].getItem("value"), null);
    assert.equal(get("value", true, { storage, delete: true }), false);
    assert.equal(get("value", true, { storage }), true);
  }
});

test("Storage retains object values and keeps session and local data separate", (t) => {
  installStorage(t);
  set("shared", { name: "Ada" });
  set("shared", 0, { storage: "local" });
  assert.deepEqual(get("shared"), { name: "Ada" });
  assert.equal(get("shared", 99, { storage: "local" }), 0);
});
