import { MatricNumberSchema } from "@babcock-umis-api/core";
import * as v from "valibot";

export const EnvSchema = v.pipe(
	v.partial(
		v.object({
			PASSWORD: v.string(),
			USERNAME: MatricNumberSchema,
		}),
	),
	v.readonly(),
);
export type EnvOutput = v.InferOutput<typeof EnvSchema>;
