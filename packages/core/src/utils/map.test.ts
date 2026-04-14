/**
 * Tests for getOrInsert.
 * Compatible with Jest and Bun's test runner.
 * Requires test globals: describe, it, expect.
 */

import { describe, expect, it } from "bun:test";
import { getOrInsert } from "./map";

describe(getOrInsert.name, () => {
	it("returns the existing value if the key is present (string key)", () => {
		const map = new Map<string, number>([["a", 42]]);
		const result = getOrInsert(map, "a", 100);
		expect(result).toBe(42);
		expect(map.size).toBe(1);
		expect(map.get("a")).toBe(42);
	});

	it("inserts and returns the default value if the key is absent (string key)", () => {
		const map = new Map<string, number>();
		const result = getOrInsert(map, "b", 99);
		expect(result).toBe(99);
		expect(map.size).toBe(1);
		expect(map.get("b")).toBe(99);
	});

	it("returns the existing value if the key is present (number key)", () => {
		const map = new Map<number, string>([[1, "foo"]]);
		const result = getOrInsert(map, 1, "bar");
		expect(result).toBe("foo");
		expect(map.size).toBe(1);
		expect(map.get(1)).toBe("foo");
	});

	it("inserts and returns the default value if the key is absent (number key)", () => {
		const map = new Map<number, string>();
		const result = getOrInsert(map, 2, "baz");
		expect(result).toBe("baz");
		expect(map.size).toBe(1);
		expect(map.get(2)).toBe("baz");
	});

	it("does not overwrite an existing value", () => {
		const map = new Map<string, string>([["x", "original"]]);
		getOrInsert(map, "x", "should-not-insert");
		expect(map.get("x")).toBe("original");
		expect(map.size).toBe(1);
	});

	it("inserts undefined as a default value if key is absent", () => {
		const map = new Map<string, undefined>();
		const result = getOrInsert(map, "undef", undefined);
		expect(result).toBeUndefined();
		expect(map.has("undef")).toBe(true);
		expect(map.get("undef")).toBeUndefined();
	});

	it("inserts null as a default value if key is absent", () => {
		const map = new Map<string, null>();
		const result = getOrInsert(map, "nullKey", null);
		expect(result).toBeNull();
		expect(map.has("nullKey")).toBe(true);
		expect(map.get("nullKey")).toBeNull();
	});

	it("does not mutate the map if the key is present", () => {
		const map = new Map<string, number>([["present", 1]]);
		const sizeBefore = map.size;
		getOrInsert(map, "present", 2);
		expect(map.size).toBe(sizeBefore);
		expect(map.get("present")).toBe(1);
	});

	it("mutates the map only when the key is absent", () => {
		const map = new Map<string, number>();
		const sizeBefore = map.size;
		getOrInsert(map, "missing", 123);
		expect(map.size).toBe(sizeBefore + 1);
		expect(map.get("missing")).toBe(123);
	});

	it("works with object keys", () => {
		const key1 = { id: 1 };
		const key2 = { id: 2 };
		const map = new Map<object, string>([[key1, "one"]]);
		expect(getOrInsert(map, key1, "should-not-insert")).toBe("one");
		expect(getOrInsert(map, key2, "two")).toBe("two");
		expect(map.get(key2)).toBe("two");
	});

	it("handles boolean keys", () => {
		const map = new Map<boolean, string>([[true, "yes"]]);
		expect(getOrInsert(map, true, "no")).toBe("yes");
		expect(getOrInsert(map, false, "no")).toBe("no");
		expect(map.get(false)).toBe("no");
	});

	it("does not treat 0 and -0 as different keys", () => {
		const map = new Map<number, string>([[0, "zero"]]);
		expect(getOrInsert(map, -0, "minus-zero")).toBe("zero");
		expect(map.size).toBe(1);
	});

	it("does not treat NaN as different keys", () => {
		const map = new Map<number, string>([[NaN, "not-a-number"]]);
		expect(getOrInsert(map, NaN, "should-not-insert")).toBe("not-a-number");
		expect(map.size).toBe(1);
	});
});
