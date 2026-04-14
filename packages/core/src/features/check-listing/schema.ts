import * as v from "valibot";
import { UmisStudentsPagePrefix } from "../../constants/umis-pages";
import { ParseBooleanSchema, ParseIntegerSchema } from "../shared/coercion";
import { NormalizeJsonArrayResponseSchema } from "../shared/json-response-normalizer";
import {
	type UniversityYearOutput,
	UniversityYearSchema,
} from "../shared/university-level";

export type ResolvedCheckListings = ReadonlyArray<
	Readonly<{
		/** Whether the student passed the course */
		passed: boolean;

		/** If the course is an optional elective */
		elective: boolean;

		/** The link to the course's page */
		link: string;

		/** The course's short code e.g. `GEDS001` */
		code: string;

		/** The course's title / full name */
		title: string;

		/** The year this course was / is to be taken e.g 1 -> first year / 100 level, 2 -> 2nd year / 200 level */
		yearTaken: UniversityYearOutput;

		/** The amount of credit hours / credits the course is worth */
		credits: number;
	}>
>;

export const FetchedCheckListingsSchema: v.GenericSchema<
	unknown,
	ResolvedCheckListings
> = v.pipe(
	NormalizeJsonArrayResponseSchema,

	v.array(
		v.pipe(
			v.object({
				cl: v.string(),
				courseid: v.string(),
				coursepased: ParseBooleanSchema,
				coursetitle: v.string(),
				credithours: ParseIntegerSchema,
				elective: ParseBooleanSchema,
				kf: v.string(),
				yeartaken: UniversityYearSchema,
			}),

			v.transform(
				({
					coursepased,
					elective,
					cl,
					kf,
					coursetitle,
					yeartaken,
					credithours,
				}) => {
					const transformed: ResolvedCheckListings[number] = {
						code: kf,
						credits: credithours,
						elective: elective,
						link: `${UmisStudentsPagePrefix}${cl}`,
						passed: coursepased,
						title: coursetitle,
						yearTaken: yeartaken,
					};

					return transformed;
				},
			),
		),
	),
);

export default FetchedCheckListingsSchema;
