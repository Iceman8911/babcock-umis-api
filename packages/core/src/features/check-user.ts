import * as v from "valibot";
import { UmisPage } from "../constants/umis-pages";
import {
	type VerifiedStudentResponseOutput,
	VerifiedUserResponseSchema,
} from "../models/schemas/check-user";
import {
	type MatricNumberInput,
	MatricNumberSchema,
} from "../models/schemas/credentials";
import type { Result } from "../models/types/result";
import { getErrorMessage } from "../utils/error";

/** Find out whether the given student exists
 *
 * @param matricNo The user's matric number
 * @returns The student identification data if exisiting
 */
export async function doesStudentExist(
	matricNo: MatricNumberInput,
): Promise<Result<VerifiedStudentResponseOutput, string>> {
	try {
		const url = new URL(UmisPage.CheckUser);
		url.searchParams.append(
			"j_username",
			v.parse(MatricNumberSchema, matricNo),
		);

		const res = await fetch(url);

		const { output, success, issues } = v.safeParse(
			VerifiedUserResponseSchema,
			await res.json(),
		);

		if (success) {
			// The first item the array should be what we want
			const student = output.data[0];

			if (!student) return { err: "Student does not exist", success: false };

			return { success: true, val: student };
		} else {
			return {
				err: `Parsing failed: ${issues.map((e) => e.message).join(", ")}`,
				success: false,
			};
		}
	} catch (e) {
		return { err: getErrorMessage(e), success: false };
	}
}
