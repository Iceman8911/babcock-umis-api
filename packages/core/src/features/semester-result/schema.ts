import * as v from "valibot";
import { UmisStudentsPagePrefix } from "../../constants/umis-pages";
import { ParseFloatSchema, ParseIntegerSchema } from "../shared/coercion";
import { NormalizeJsonArrayResponseSchema } from "../shared/json-response-normalizer";
import {
	type UniversityLevelOutput,
	UniversityLevelSchema,
} from "../shared/university-level";

type PositiveIntegersLessThan10 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Year = `20${PositiveIntegersLessThan10}${PositiveIntegersLessThan10}`;
type YearWithSessionDenominator = `${Year}.${1 | 2 | 3}`;

type Session = `${Year}/${YearWithSessionDenominator}`;

/** Matches <a href='?view=19:0:0&data=431025'>2022/2023.1</a>, and captures `2022/2023.1` */
const SESSION_REGEX = /<a.*>(\d+\/\d+\.?\d?)/;

export type ResolvedAllSemesterResultsSummary = ReadonlyArray<
	Readonly<{
		/** Cummulative credit hours for the semester and previous ones. */
		cummCreditHours: number;

		/** Cummulative gpa for the semester and previous ones. */
		cummGpa: number;

		/** Study level for the semester */
		studyLevel: UniversityLevelOutput;

		/** Gpa for the semester */
		gpa: number;

		/** Link to results for the courses of the semester */
		link: string;

		/** Credit hours for the semester */
		creditHours: number;

		/** University session */
		session: Session;
	}>
>;

export const FetchedAllSemesterResultsSummarySchema: v.GenericSchema<
	unknown,
	ResolvedAllSemesterResultsSummary
> = v.pipe(
	NormalizeJsonArrayResponseSchema,

	v.array(
		v.object({
			/** A query string to be concatenated to the base url to link to the page containing the course scores. */
			cl: v.string(),
			credit: ParseIntegerSchema,
			cummcredit: ParseIntegerSchema,

			cummgpa: ParseFloatSchema,
			gpa: ParseFloatSchema,
			/** Random Id */
			kf: ParseIntegerSchema,
			/** Serialized DOM link. Also contains the session (2023/2024). */
			quarterid: v.pipe(v.string(), v.regex(SESSION_REGEX)),
			studylevel: UniversityLevelSchema,
		}),
	),

	v.transform((arr) =>
		arr.map(
			({ cl, credit, cummcredit, cummgpa, gpa, studylevel, quarterid }) => {
				const transformed: ResolvedAllSemesterResultsSummary[number] = {
					creditHours: credit,
					cummCreditHours: cummcredit,
					cummGpa: cummgpa,
					gpa,
					link: `${UmisStudentsPagePrefix}${cl}`,
					// Casting is safe here since `quaterid` is valdiated beforehand
					session: quarterid.match(SESSION_REGEX)?.[1] as Session,
					studyLevel: studylevel,
				};

				return transformed;
			},
		),
	),
);
