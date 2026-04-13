import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import {
	type UniversityCreditOutput,
	UniversityCreditSchema,
} from "./university-credit";

type UniversityCreditOutputTuple = { [K in UniversityCreditOutput]: K };

describe("UniversityCreditSchema", () => {
	it("should accept valid credit values", () => {
		const credits = [
			0, 1, 2, 3, 4, 5, 6,
		] as const satisfies UniversityCreditOutputTuple;

		credits.forEach((credit) => {
			expect(v.is(UniversityCreditSchema, credit)).toBeTrue();
		});
	});

	it("should coerce invalid inputs to 0", () => {
		expect(v.parse(UniversityCreditSchema, 3132)).toBe(0);
		expect(v.parse(UniversityCreditSchema, "3132")).toBe(0);
	});
});
