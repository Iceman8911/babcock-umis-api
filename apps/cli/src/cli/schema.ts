import { MatricNumberSchema, type Session } from "@babcock-umis-api/core";
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

export const CliRuntimeOptionsSchema = v.pipe(
	v.partial(
		v.object({
			client: v.picklist(["html-rewriter", "node"] as const),
			format: v.picklist(["json", "table", "yaml"] as const),
		}),
	),
	v.readonly(),
);
export type CliRuntimeOptionsOutput = v.InferOutput<
	typeof CliRuntimeOptionsSchema
>;

export const SessionSchema = v.pipe(
	v.string(),
	v.regex(/^\d{4}\/\d{4}\.[1-3]$/),
	v.transform((str) => str as Session),
);
export type SessionOutput = v.InferOutput<typeof SessionSchema>;
