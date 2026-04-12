import * as v from "valibot";

export const ParseBooleanSchema = v.pipe(v.unknown(), v.parseBoolean());

export const ParseIntegerSchema = v.pipe(
	v.unknown(),
	v.toNumber(),
	v.integer(),
);

export const ParseFloatSchema = v.pipe(v.unknown(), v.toNumber());
