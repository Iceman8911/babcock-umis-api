import * as v from "valibot";
import { UmisStudentsPagePrefix } from "../../constants/umis-pages";
import type { Session } from "../shared/_shared";
import { ParseIntegerSchema } from "../shared/coercion";
import { type GpaOutput, GpaSchema } from "../shared/gpa";
import { type GradeOutput, GradeSchema } from "../shared/grade";
import { NormalizeJsonArrayResponseSchema } from "../shared/json-response-normalizer";
import {
	type UniversityCreditOutput,
	UniversityCreditSchema,
} from "../shared/university-credit";
import {
	type UniversityLevelOutput,
	UniversityLevelSchema,
} from "../shared/university-level";

/** Matches <a href='?view=19:0:0&data=431025'>2022/2023.1</a>, and captures `2022/2023.1` */
const SESSION_REGEX = /<a.*>(\d+\/\d+\.?\d?)/;

export type ResolvedSemesterResultSummaries = ReadonlyArray<
	Readonly<{
		/** Cummulative credit hours for the semester and previous ones. */
		cummCreditHours: number;

		/** Cummulative gpa for the semester and previous ones. */
		cummGpa: GpaOutput;

		/** Study level for the semester */
		studyLevel: UniversityLevelOutput;

		/** Gpa for the semester */
		gpa: GpaOutput;

		/** Link to results for the courses of the semester */
		link: string;

		/** Credit hours for the semester */
		creditHours: number;

		/** University session */
		session: Session;
	}>
>;

export const FetchedSemesterResultSummariesSchema: v.GenericSchema<
	unknown,
	ResolvedSemesterResultSummaries
> = v.pipe(
	NormalizeJsonArrayResponseSchema,

	v.array(
		v.pipe(
			v.object({
				/** A query string to be concatenated to the base url to link to the page containing the course scores. */
				cl: v.string(),
				credit: ParseIntegerSchema,
				cummcredit: ParseIntegerSchema,

				cummgpa: GpaSchema,
				gpa: GpaSchema,
				/** Random Id */
				kf: ParseIntegerSchema,
				/** Serialized DOM link. Also contains the session (2023/2024). */
				quarterid: v.pipe(v.string(), v.regex(SESSION_REGEX)),
				studylevel: UniversityLevelSchema,
			}),

			v.transform(
				({ cl, credit, cummcredit, cummgpa, gpa, studylevel, quarterid }) => {
					const transformed: ResolvedSemesterResultSummaries[number] = {
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
	),
);

const IntegerAtMost100Schema = v.pipe(v.number(), v.integer(), v.maxValue(100));

export type ResolvedSingleSemesterResults = ReadonlyArray<
	Readonly<{
		grade: GradeOutput;

		/** Amount of gpa to add. It's always equal to `grade` * `credit`. */
		gpa: number;

		/** Score between 0 and 100 */
		score: number;

		/** Fixed amount of credits for the course e.g. 0, 1, 2, 3, 6, etc */
		credit: UniversityCreditOutput;

		course: {
			/** Course code e.g. `GEDS101` */
			code: string;

			/** Full course name e.g. `Philosophy of Christian Education` */
			title: string;
		};
	}>
>;

export const FetchedSingleSemesterResultsSchema: v.GenericSchema<
	unknown,
	ResolvedSingleSemesterResults
> = v.pipe(
	NormalizeJsonArrayResponseSchema,

	v.array(
		v.pipe(
			v.object({
				courseid: v.string(),
				coursetitle: v.string(),
				credit: v.pipe(ParseIntegerSchema, UniversityCreditSchema),
				finalmarks: v.pipe(ParseIntegerSchema, IntegerAtMost100Schema),
				gpa: ParseIntegerSchema,
				gradeid: GradeSchema,
			}),

			v.transform(
				({ courseid, coursetitle, credit, finalmarks, gpa, gradeid }) => {
					const transformed: ResolvedSingleSemesterResults[number] = {
						course: {
							code: courseid,
							title: coursetitle,
						},
						credit,
						gpa,
						grade: gradeid,
						score: finalmarks,
					};

					return transformed;
				},
			),
		),
	),
);
