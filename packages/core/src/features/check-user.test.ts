import { describe, expect, it } from "bun:test";
import { ENVIRONMENT_VARIABLES } from "../constants/env";
import { doesStudentExist } from "./check-user";

describe(doesStudentExist.name, () => {
	it("should return successful output for valid students", async () => {
		const possibleStudentInfo = await doesStudentExist(
			ENVIRONMENT_VARIABLES.CORRECT_UMIS_MATRIC_NO,
		);

		expect(possibleStudentInfo).not.toBeNull();
	});

	it("should return null for non-existing students", async () => {
		const possibleStudentInfo = await doesStudentExist(
			ENVIRONMENT_VARIABLES.WRONG_UMIS_MATRIC_NO,
		);

		expect(possibleStudentInfo).toBeNull();
	});
});
