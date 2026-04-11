import { describe, expect, it } from "bun:test";
import { ENVIRONMENT_VARIABLES } from "../constants/env";
import { isStudentValid } from "./check-user";

describe(isStudentValid.name, () => {
	it("should return successful output for valid students", async () => {
		const result = await isStudentValid(
			ENVIRONMENT_VARIABLES.CORRECT_UMIS_MATRIC_NO,
		);

		if (!result.success)
			throw Error(`Expected success but got error: ${result.err}`);

		expect(result.success).toBe(true);

		expect(result.success).toBeDefined();
	});

	it("should return null for non-existing students", async () => {
		const result = await isStudentValid(
			ENVIRONMENT_VARIABLES.WRONG_UMIS_MATRIC_NO,
		);

		if (result.success) throw Error("Expected failure but got success");

		expect(result.success).toBe(false);

		expect(result.err).toBeDefined();
	});
});
