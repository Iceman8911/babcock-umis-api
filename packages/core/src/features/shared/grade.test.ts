import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { type GradeOutput, GradeSchema } from "./grade";

describe("GradeSchema", () => {
	it("should parse valid grades", () => {
		const validGrades = [
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"FA",
		] as const satisfies GradeOutput[];

		validGrades.forEach((grade) => {
			expect(v.is(GradeSchema, grade)).toBeTrue();
		});
	});

	it("should coerce invalid inputs to 'FA'", () => {
		expect(v.parse(GradeSchema, "Wrong")).toBe("FA");
	});
});
