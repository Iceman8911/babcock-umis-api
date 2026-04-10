import { describe, expect, it } from "bun:test";
import { ENVIRONMENT_VARIABLES } from "../constants/env";
import { doesStudentExist } from "./check-user";

describe(doesStudentExist.name, () => {
	it("should return successful output for valid students", async () => {
		const result = await doesStudentExist(
			ENVIRONMENT_VARIABLES.CORRECT_UMIS_MATRIC_NO,
		);

		expect(result.success).toBe(true);

		if (!result.success)
			throw Error(`Expected success but got error: ${result.err}`);

		expect(result.success).toBeDefined();
	});

	it("should return null for non-existing students", async () => {
		const result = await doesStudentExist(
			ENVIRONMENT_VARIABLES.WRONG_UMIS_MATRIC_NO,
		);

		expect(result.success).toBe(false);

		if (result.success) throw Error("Expected failure but got success");

		expect(result.err).toBeDefined();
	});
});
