import * as v from "valibot";
import { MATRIC_NUMBER_REGEX } from "../constants/regex";

export const MatricNumberSchema = v.pipe(
	v.string(),
	v.regex(MATRIC_NUMBER_REGEX),
	v.transform((str) => str as `${number}/${number}`),
);
export type MatricNumberInput = v.InferInput<typeof MatricNumberSchema>;
export type MatricNumberOutput = v.InferOutput<typeof MatricNumberSchema>;
