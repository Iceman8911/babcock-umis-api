import { describe, expect, it } from "bun:test";
import { ENVIRONMENT_VARIABLES } from "../constants/env";
import type { StudentCredentialsInput } from "../models/credentials";
import { attemptStudentLogin } from "./login";

const CORRECT_LOGIN_PAYLOAD = {
	pass: ENVIRONMENT_VARIABLES.CORRECT_UMIS_PASSWORD,
	user: ENVIRONMENT_VARIABLES.CORRECT_UMIS_MATRIC_NO,
} as const satisfies StudentCredentialsInput;

const WRONG_LOGIN_PAYLOAD = {
	pass: ENVIRONMENT_VARIABLES.WRONG_UMIS_PASSWORD,
	user: ENVIRONMENT_VARIABLES.WRONG_UMIS_MATRIC_NO,
} as const satisfies StudentCredentialsInput;

describe(attemptStudentLogin.name, () => {
	it("should successfully log in an existing user", async () => {
		const result = await attemptStudentLogin(CORRECT_LOGIN_PAYLOAD);

		expect(result).not.toBeNull();
	});

	it("should fail to log in a non-existing user", async () => {
		const result = await attemptStudentLogin(WRONG_LOGIN_PAYLOAD);

		expect(result).toBeNull();
	});
});
