import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { UniversityLevelSchema } from "./university-level";

describe("UniversityLevelSchema", () => {
	it("should accept allowed level values", () => {
		expect(v.parse(UniversityLevelSchema, 100)).toBe(100);
		expect(v.parse(UniversityLevelSchema, "400")).toBe(400);
		expect(v.parse(UniversityLevelSchema, "600")).toBe(600);
	});

	it("should reject out-of-range values", () => {
		expect(v.safeParse(UniversityLevelSchema, 50).success).toBe(false);
		expect(v.safeParse(UniversityLevelSchema, 700).success).toBe(false);
	});

	it("should reject decimal and invalid inputs", () => {
		expect(v.safeParse(UniversityLevelSchema, 100.5).success).toBe(false);
		expect(v.safeParse(UniversityLevelSchema, "first").success).toBe(false);
	});
});
