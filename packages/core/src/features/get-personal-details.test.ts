import { describe, expect, it } from "bun:test";
import HTMLRewriterHTMLParser from "../html-parsing/html-rewriter";
import NodeHTMLParser from "../html-parsing/node";
import type HTMLParser from "../models/classes/html-parser";
import { CORRECT_LOGIN_PAYLOAD } from "./_shared.test";
import { getPersonalDetails } from "./get-personal-details";
import { attemptStudentLogin } from "./login";

const runTests = (parserConstructor: typeof HTMLParser) => {
	it("should fetch personal details with valid credentials", async () => {
		const loginResponse = await attemptStudentLogin(CORRECT_LOGIN_PAYLOAD);

		expect(loginResponse.success).toBeTrue();

		if (!loginResponse.success)
			throw Error(`Login failed with error: ${loginResponse.err}`);

		const personalDetailsResult = await getPersonalDetails({
			cookie: loginResponse.val.JSESSIONID,
			parserConstructor,
		});

		if (!personalDetailsResult.success)
			throw Error(
				`Failed to get personal details with error: ${personalDetailsResult.err}`,
			);

		expect(personalDetailsResult.success).toBeTrue();

		expect(personalDetailsResult.val).toBeDefined();
	});
};

describe(`${getPersonalDetails.name} - NODE`, () => runTests(NodeHTMLParser));

describe(`${getPersonalDetails.name} - HTMLRewriter`, () =>
	runTests(HTMLRewriterHTMLParser));
