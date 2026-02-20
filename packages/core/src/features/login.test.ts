import { describe, expect, it } from "bun:test";
import { ENVIRONMENT_VARIABLES } from "../constants/env";
import type { StudentCredentialsInput } from "../models/credentials";
import { attemptStudentLogin } from "./login";

const LOGIN_PAYLOAD = {
	pass: ENVIRONMENT_VARIABLES.UMIS_PASSWORD,
	user: ENVIRONMENT_VARIABLES.UMIS_MATRIC_NO,
} as const satisfies StudentCredentialsInput;

describe(attemptStudentLogin.name, () => {
	it("should successfully log in an existing user", async () => {
		const result = await attemptStudentLogin(LOGIN_PAYLOAD);

		expect(result).not.toBeNull();
	});
});
