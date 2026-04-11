import * as v from "valibot";

export const EmailSchema = v.pipe(v.string(), v.email());
export type EmailInput = v.InferInput<typeof EmailSchema>;
export type EmailOutput = v.InferOutput<typeof EmailSchema>;
