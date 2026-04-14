import * as v from "valibot";
import { ParseBooleanSchema, ParseDateSchema } from "../shared/coercion";
import { NormalizeJsonArrayResponseSchema } from "../shared/json-response-normalizer";
import { UniversityCreditSchema } from "../shared/university-credit";
import {
	type UniversityYearOutput,
	UniversityYearSchema,
} from "../shared/university-level";

export type ResolvedSelectedCourseList = ReadonlyArray<
	Readonly<{
		/** Name of lecturer for this course */
		lecturer: string;

		/** When this course was selected */
		selectedOn: Date;

		/** For cases where there are multiple groupings for the same course, e.g. "Group A", "Group B", "General", etc */
		classOption: string;

		/** Whether this course has a gpa assigned to it */
		hasGpa: boolean;

		credit: number;

		/** e.g. "COSC430" */
		code: string;

		/** Full course name / title e.g. "Hands-on JAVA training" */
		title: string;

		/** Year that the course may be taken under normal circumstances. */
		year: UniversityYearOutput;
	}>
>;

export const FetchedSelectedCourseListSchema: v.GenericSchema<
	unknown,
	ResolvedSelectedCourseList
> = v.pipe(
	NormalizeJsonArrayResponseSchema,

	v.array(
		v.pipe(
			v.object({
				classoption: v.string(),
				courseid: v.string(),
				coursetitle: v.string(),
				// KF: v.string(),
				credit: UniversityCreditSchema,
				instructorname: v.string(),
				nogpa: ParseBooleanSchema,
				selectiondate: ParseDateSchema,
				yeartaken: UniversityYearSchema,
			}),

			v.transform(
				({
					classoption,
					courseid,
					coursetitle,
					credit,
					instructorname,
					nogpa,
					selectiondate,
					yeartaken,
				}) => {
					const transformed: ResolvedSelectedCourseList[number] = {
						classOption: classoption,
						code: courseid,
						credit,
						hasGpa: nogpa,
						lecturer: instructorname,
						selectedOn: selectiondate,
						title: coursetitle,
						year: yeartaken,
					};

					return transformed;
				},
			),
		),
	),
);
