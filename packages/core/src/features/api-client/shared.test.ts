import { expect, it } from "bun:test";
import { CORRECT_LOGIN_PAYLOAD } from "../shared/_shared.test";
import type UmisApiStudentClient from "./umis-api-client";

export const _sharedEntrypointTests = (
	getClient: () => UmisApiStudentClient,
) => {
	it("should validate the student", async () => {
		const validityResult = await getClient().isStudentValid();
		expect(validityResult.success).toBeTrue();
	});

	it("should fetch personal details", async () => {
		const personalDetailsResult = await getClient().getPersonalInfo();
		expect(personalDetailsResult.success).toBeTrue();

		if (!personalDetailsResult.success) {
			throw Error(personalDetailsResult.err);
		}

		expect(personalDetailsResult.val).toBeDefined();
		expect(personalDetailsResult.val.matricNo).toBe(CORRECT_LOGIN_PAYLOAD.user);
		expect(typeof personalDetailsResult.val.name).toBe("string");
	});

	it("should fetch the school info", async () => {
		const personalDetailsResult = await getClient().getSchoolInfo();
		expect(personalDetailsResult.success).toBeTrue();

		if (!personalDetailsResult.success) {
			throw Error(personalDetailsResult.err);
		}

		expect(personalDetailsResult.val.length).toBeGreaterThan(0);
	});

	it("should fetch all semseter results", async () => {
		const personalDetailsResult =
			await getClient().getAllSemesterResultsSummary();
		expect(personalDetailsResult.success).toBeTrue();

		if (!personalDetailsResult.success) {
			throw Error(personalDetailsResult.err);
		}

		expect(personalDetailsResult.val.length).toBeGreaterThan(0);
	});
};
