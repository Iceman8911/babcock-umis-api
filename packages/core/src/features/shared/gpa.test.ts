import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { GpaSchema } from "./gpa";

describe("GpaSchema", () => {
	it("should accept valid gpas", () => {
		const validGpas = [0, 1, 2, 3, 4, 5, 2.1, 4.32, 5.0, 0.0, 0.1] as const;

		validGpas.forEach((gpa) => {
			expect(v.is(GpaSchema, gpa)).toBeTrue();
		});
	});

	it("should coerce negative gpas to 0", () => {
		const negativeGpas = [-1, -89, -21, -0.12, -0.98] as const;

		negativeGpas.forEach((gpa) => {
			expect(v.parse(GpaSchema, gpa)).toBe(0);
		});
	});

	it("should coerce too-large gpas to 5", () => {
		const bigGpas = [12, 323, 12.4, 0o34, 67] as const;

		bigGpas.forEach((gpa) => {
			expect(v.parse(GpaSchema, gpa)).toBe(5);
		});
	});

	it("should approximate decimal gpas, within 0 and 5, with more than 2 decimal places", () => {
		const decimalGpas = [
			1.23123, 4.3123132, 3.11212, 1.21312312312312, 3.45912,
		] as const;

		expect(decimalGpas.map((gpa) => v.parse(GpaSchema, gpa))).toStrictEqual([
			1.23, 4.31, 3.11, 1.21, 3.46,
		]);
	});
});
