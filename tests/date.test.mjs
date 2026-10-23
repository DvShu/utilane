import assert from "node:assert/strict";
import test from "node:test";
import { dateOf, endOf, startOf } from "utilane";

test("endOf returns the actual last day of each month", () => {
  for (const year of [1900, 2000, 2023, 2024]) {
    for (let month = 0; month < 12; month++) {
      const input = new Date(year, month, 15, 12, 34, 56, 789);
      const expected = new Date(year, month + 1, 0, 23, 59, 59, 999);
      assert.equal(endOf(input, "month").getTime(), expected.getTime(), `${year}-${month + 1}`);
      assert.equal(dateOf(input, "month", true).getTime(), expected.getTime());
    }
  }
});

test("endOf preserves the requested year and reaches December 31", () => {
  for (const input of [new Date(2024, 1, 29), new Date(2023, 11, 31), new Date(2025, 0, 1)]) {
    const expected = new Date(input.getFullYear(), 11, 31, 23, 59, 59, 999);
    for (const unit of ["year", "Year", "y"]) {
      assert.equal(endOf(input, unit).getTime(), expected.getTime());
      assert.equal(dateOf(input, unit, true).getTime(), expected.getTime());
    }
  }
});

test("date boundaries preserve years below 100, including leap year zero", () => {
  for (const year of [0, 4, 99]) {
    const input = new Date(2024, 1, 15, 12);
    input.setFullYear(year);
    const monthEnd = new Date(input.getTime());
    monthEnd.setMonth(2, 0);
    monthEnd.setHours(23, 59, 59, 999);
    assert.equal(endOf(input, "month").getTime(), monthEnd.getTime());
    const yearEnd = new Date(input.getTime());
    yearEnd.setMonth(11, 31);
    yearEnd.setHours(23, 59, 59, 999);
    assert.equal(endOf(input, "year").getTime(), yearEnd.getTime());
  }
});

test("endOf handles smaller units, aliases, and default day boundaries", () => {
  const input = new Date(2024, 6, 15, 12, 34, 56, 789);
  const cases = [
    [undefined, new Date(2024, 6, 15, 23, 59, 59, 999)],
    ["day", new Date(2024, 6, 15, 23, 59, 59, 999)],
    ["D", new Date(2024, 6, 15, 23, 59, 59, 999)],
    ["m", new Date(2024, 6, 31, 23, 59, 59, 999)],
    ["H", new Date(2024, 6, 15, 12, 59, 59, 999)],
    ["M", new Date(2024, 6, 15, 12, 34, 59, 999)],
    ["s", new Date(2024, 6, 15, 12, 34, 56, 999)],
    ["S", input],
  ];
  for (const [unit, expected] of cases)
    assert.equal(endOf(input, unit).getTime(), expected.getTime());
  assert.throws(() => endOf(input, "invalid"), /Invalid unit/);
  assert.ok(Number.isNaN(endOf(new Date(NaN), "month").getTime()));
});

test("shared dateOf logic keeps startOf correct without mutating input", () => {
  const input = new Date(2024, 1, 29, 12, 34, 56, 789);
  const original = input.getTime();
  assert.equal(startOf(input, "year").getTime(), new Date(2024, 0, 1).getTime());
  assert.equal(startOf(input, "month").getTime(), new Date(2024, 1, 1).getTime());
  assert.equal(startOf(input).getTime(), new Date(2024, 1, 29).getTime());
  endOf(input, "year");
  endOf(input, "month");
  assert.equal(input.getTime(), original);
});
