import * as v from "valibot";
import { ParseIntegerSchema } from "./coercion";

export const UniversityLevelSchema = v.pipe(
	ParseIntegerSchema,
	v.picklist([100, 200, 300, 400, 500, 600]),
);
export type UniversityLevelOutput = v.InferOutput<typeof UniversityLevelSchema>;

export const UniversityYearSchema = v.fallback(
	v.pipe(ParseIntegerSchema, v.picklist([0, 1, 2, 3, 4, 5, 6])),
	0,
);
export type UniversityYearOutput = v.InferOutput<typeof UniversityYearSchema>;
