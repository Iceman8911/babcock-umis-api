import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { ParseBooleanSchema, ParseIntegerSchema } from "./coercion";

describe("ParseBooleanSchema", () => {
	it("should parse boolean true/false", () => {
		expect(v.parse(ParseBooleanSchema, true)).toBe(true);
		expect(v.parse(ParseBooleanSchema, false)).toBe(false);
	});

	it("should parse string boolean values", () => {
		expect(v.parse(ParseBooleanSchema, "true")).toBe(true);
		expect(v.parse(ParseBooleanSchema, "FALSE")).toBe(false);
	});

	it("should parse common boolean-like values", () => {
		expect(v.parse(ParseBooleanSchema, "yes")).toBe(true);
		expect(v.parse(ParseBooleanSchema, "no")).toBe(false);
		expect(v.parse(ParseBooleanSchema, "TRUE")).toBe(true);
		expect(v.parse(ParseBooleanSchema, "FALSE")).toBe(false);
	});

	it("should reject invalid boolean inputs", () => {
		expect(v.safeParse(ParseBooleanSchema, "maybe").success).toBe(false);
		expect(v.safeParse(ParseBooleanSchema, null).success).toBe(false);
	});
});

describe("ParseIntegerSchema", () => {
	it("should parse integer values from number and string", () => {
		expect(v.parse(ParseIntegerSchema, 100)).toBe(100);
		expect(v.parse(ParseIntegerSchema, "400")).toBe(400);
	});

	it("should reject non-integer values", () => {
		expect(v.safeParse(ParseIntegerSchema, 100.5).success).toBe(false);
		expect(v.safeParse(ParseIntegerSchema, "100.5").success).toBe(false);
		expect(v.safeParse(ParseIntegerSchema, "abc").success).toBe(false);
		expect(v.safeParse(ParseIntegerSchema, NaN).success).toBe(false);
	});
});
