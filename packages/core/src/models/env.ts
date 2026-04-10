import * as v from "valibot";
import { MatricNumberSchema } from "./credentials";

export const EnvironmentVariablesSchema = v.pipe(
	v.looseObject({
		CORRECT_UMIS_MATRIC_NO: MatricNumberSchema,
		CORRECT_UMIS_PASSWORD: v.string(),

		WRONG_UMIS_MATRIC_NO: MatricNumberSchema,
		WRONG_UMIS_PASSWORD: v.string(),
	}),
	v.readonly(),
);
export type EnvironmentVariablesOutput = v.InferOutput<
	typeof EnvironmentVariablesSchema
>;
