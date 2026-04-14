import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import {
	ParseBooleanSchema,
	ParseDateSchema,
	ParseFloatSchema,
	ParseIntegerSchema,
} from "./coercion";

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

describe("ParseFloatSchema", () => {
	it("should parse floats and integers from number and string", () => {
		expect(v.parse(ParseFloatSchema, 100.31)).toBe(100.31);
		expect(v.parse(ParseFloatSchema, "400.24")).toBe(400.24);
		expect(v.parse(ParseFloatSchema, "40")).toBe(40);
	});

	it("should reject non-number values", () => {
		expect(v.safeParse(ParseFloatSchema, {}).success).toBe(false);
		expect(v.safeParse(ParseFloatSchema, "1d00.5").success).toBe(false);
		expect(v.safeParse(ParseFloatSchema, "abc").success).toBe(false);
		expect(v.safeParse(ParseFloatSchema, NaN).success).toBe(false);
	});
});

describe("ParseDateSchema", () => {
	it("should parse date-coercable values", () => {
		expect(v.parse(ParseDateSchema, "2025-12-31 14:46:28.246756")).toBeDate();
		expect(
			v.parse(ParseDateSchema, "2025-12-31 14:46:28.246756").getTime(),
		).not.toBeNaN();

		// expect(v.parse(ParseDateSchema, "2025-12-31 14:46:28.246756")).toBeDate();
		// expect(
		// 	v.parse(ParseDateSchema, "2025-12-31 14:46:28.246756").getTime(),
		// ).not.toBeNaN();

		// expect(v.parse(ParseDateSchema, "2025-12-31 14:46:28.246756")).toBeDate();
		// expect(
		// 	v.parse(ParseDateSchema, "2025-12-31 14:46:28.246756").getTime(),
		// ).not.toBeNaN();
	});
});
