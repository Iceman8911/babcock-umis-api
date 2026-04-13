import * as v from "valibot";

export const GradeSchema = v.fallback(
	v.picklist(["A", "B", "C", "D", "E", "F", "FA"]),
	"FA",
);
export type GradeOutput = v.InferOutput<typeof GradeSchema>;
