import * as v from "valibot";
import { UmisPage } from "../constants/umis-pages";
import {
	type VerifiedStudentResponseOutput,
	VerifiedUserResponseSchema,
} from "../models/check-user";
import {
	type MatricNumberInput,
	MatricNumberSchema,
} from "../models/credentials";

/** FInd out wheter the given student exists
 *
 * @param matricNo The user's matric number
 * @returns The student identification data if exisiting, or `null` otherwise
 */
export async function doesStudentExist(
	matricNo: MatricNumberInput,
): Promise<VerifiedStudentResponseOutput | null> {
	const url = new URL(UmisPage.CHECK_USER);
	url.searchParams.append("j_username", v.parse(MatricNumberSchema, matricNo));

	const res = await fetch(url);

	const { output, success } = v.safeParse(
		VerifiedUserResponseSchema,
		await res.json(),
	);

	if (success) {
		// The first item the array should be what we want
		return output.data[0] ?? null;
	} else {
		return null;
	}
}
