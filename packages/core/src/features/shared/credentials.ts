import * as v from "valibot";
import { MATRIC_NUMBER_REGEX } from "../../constants/regex";

export const MatricNumberSchema = v.pipe(
	v.string(),
	v.regex(MATRIC_NUMBER_REGEX),
	v.transform((str) => str as `${number}/${number}`),
	v.readonly(),
);
export type MatricNumberInput = v.InferInput<typeof MatricNumberSchema>;
export type MatricNumberOutput = v.InferOutput<typeof MatricNumberSchema>;

export const StudentCredentialsSchema = v.pipe(
	v.object({
		/** Password */
		pass: v.string(),
		/** Matric number as username */
		user: MatricNumberSchema,
	}),
	v.transform(({ pass, user }) => {
		const payload = {
			j_password: pass,
			j_username: user,
		};

		return payload;
	}),
	v.readonly(),
);
export type StudentCredentialsInput = v.InferInput<
	typeof StudentCredentialsSchema
>;
export type StudentCredentialsOutput = v.InferOutput<
	typeof StudentCredentialsSchema
>;
