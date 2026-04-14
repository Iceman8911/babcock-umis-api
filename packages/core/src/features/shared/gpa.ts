import * as v from "valibot";

// type InferNumberFromTemplateString<TNumericString extends string> =
// 	TNumericString extends `${infer N extends number}` ? N : never;
// type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// type GpaInt = 0 | 1 | 2 | 3 | 4;
// type GpaStr =
// 	| `5`
// 	| `${GpaInt}`
// 	| `${GpaInt}.${Digit}`
// 	| `${GpaInt}.${Digit}${Digit}`;
// type Gpa = InferNumberFromTemplateString<GpaStr>; // number :(

export const GpaSchema = v.fallback(
	v.pipe(
		v.unknown(),
		v.toNumber(),
		v.toMinValue(0),
		v.toMaxValue(5),
		/** Ensure a max of 2 decimal digits */
		v.transform((gpa) => Math.round(gpa * 100) / 100),
	),
	0,
);
export type GpaOutput = v.InferOutput<typeof GpaSchema>;
