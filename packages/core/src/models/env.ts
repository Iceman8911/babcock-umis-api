import * as v from "valibot";
import { MatricNumberSchema } from "./credentials";

export const EnvironmentVariablesSchema = v.pipe(
	v.object({
		UMIS_MATRIC_NO: MatricNumberSchema,
		UMIS_PASSWORD: v.string(),
	}),
	v.readonly(),
);
export type EnvironmentVariablesOutput = v.InferOutput<
	typeof EnvironmentVariablesSchema
>;
