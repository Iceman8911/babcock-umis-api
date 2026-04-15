import { MatricNumberSchema } from "@babcock-umis-api/core";
import * as v from "valibot";

export const CliSharedOptionsSchema = v.pipe(
	v.partial(
		v.object({
			password: v.string(),
			username: MatricNumberSchema,
		}),
	),
	v.readonly(),
);
export type CliSharedOptionsOutput = v.InferOutput<
	typeof CliSharedOptionsSchema
>;
