import * as v from "valibot";

export const EnvSchema = v.partial(
	v.object({
		UMIS_PASSWORD: v.string(),
		UMIS_USERNAME: v.string(),
	}),
);
