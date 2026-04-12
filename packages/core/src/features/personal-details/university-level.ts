import * as v from "valibot";

export const UniversityLevelSchema = v.pipe(
	v.union([v.string(), v.number()]),
	v.toNumber(),
	v.picklist([100, 200, 300, 400, 500, 600]),
);
export type UniversityLevelInput = v.InferInput<typeof UniversityLevelSchema>;
export type UniversityLevelOutput = v.InferOutput<typeof UniversityLevelSchema>;
