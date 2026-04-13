import * as v from "valibot";

export const UniversityCreditSchema = v.fallback(
	v.picklist([0, 1, 2, 3, 4, 5, 6]),
	0,
);
export type UniversityCreditOutput = v.InferOutput<
	typeof UniversityCreditSchema
>;
