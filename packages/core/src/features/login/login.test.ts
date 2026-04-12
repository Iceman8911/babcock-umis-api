import { describe, expect, it } from "bun:test";
import {
	CORRECT_LOGIN_PAYLOAD,
	WRONG_LOGIN_PAYLOAD,
} from "../shared/_shared.test";
import { attemptStudentLogin } from "./index";

describe(attemptStudentLogin.name, () => {
	it("should successfully log in an existing user", async () => {
		const result = await attemptStudentLogin(CORRECT_LOGIN_PAYLOAD);

		if (!result.success) throw Error(`Login failed with error: ${result.err}`);

		expect(result.success).toBe(true);

		expect(result.val).toBeDefined();
	});

	it("should fail to log in a non-existing user", async () => {
		const result = await attemptStudentLogin(WRONG_LOGIN_PAYLOAD);

		if (result.success) throw Error("Login should have failed but succeeded");

		expect(result.success).toBe(false);

		expect(result.err).toBeDefined();
	});
});
