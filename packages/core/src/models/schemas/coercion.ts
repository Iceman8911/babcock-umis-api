import * as v from "valibot";

export const ParseBooleanSchema = v.pipe(v.unknown(), v.parseBoolean());
export type ParseBooleanInput = v.InferInput<typeof ParseBooleanSchema>;
export type ParseBooleanOutput = v.InferOutput<typeof ParseBooleanSchema>;

export const ParseIntegerSchema = v.pipe(
	v.unknown(),
	v.toNumber(),
	v.integer(),
);
export type ParseIntegerInput = v.InferInput<typeof ParseIntegerSchema>;
export type ParseIntegerOutput = v.InferOutput<typeof ParseIntegerSchema>;
