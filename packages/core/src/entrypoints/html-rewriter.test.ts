import { describe, expect, it } from "bun:test";
import { CORRECT_LOGIN_PAYLOAD } from "../features/shared/_shared.test";
import { HtmlRewriterUmisApiStudentClient } from "./html-rewriter";

describe("HtmlRewriterUmisApiStudentClient", () => {
	it(
		"should validate the student and fetch personal details using the HTMLRewriter parser",
		async () => {
			const client = new HtmlRewriterUmisApiStudentClient(
				CORRECT_LOGIN_PAYLOAD,
			);

			const validityResult = await client.isStudentValid();
			expect(validityResult.success).toBeTrue();

			const personalDetailsResult = await client.getPersonalDetails();
			expect(personalDetailsResult.success).toBeTrue();

			if (!personalDetailsResult.success) {
				throw Error(personalDetailsResult.err);
			}

			expect(personalDetailsResult.val).toBeDefined();
			expect(personalDetailsResult.val.matricNo).toBe(
				CORRECT_LOGIN_PAYLOAD.user,
			);
			expect(typeof personalDetailsResult.val.name).toBe("string");
		},
		{ timeout: 20000 },
	);
});
