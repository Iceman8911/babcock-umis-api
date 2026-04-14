import * as v from "valibot";

/** To simply turn all the keys to lowercase and maybe some other stuff to make the code more resilent to slight api changes */
export const NormalizeJsonArrayResponseSchema: v.GenericSchema<
	unknown,
	Array<Record<string, unknown>>
> = v.pipe(
	v.array(v.record(v.string(), v.unknown())),

	/** Lowercase the keys */
	v.transform((arr) =>
		arr.map((obj) => {
			const newObj: Record<string, unknown> = {};

			for (const key in obj) {
				// biome-ignore lint/style/noNonNullAssertion: <In a lopp, this will never be undefined>
				newObj[key.toLowerCase()] = obj[key]!;
			}

			return newObj;
		}),
	),
);
