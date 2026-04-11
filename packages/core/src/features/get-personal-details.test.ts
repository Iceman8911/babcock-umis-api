import { describe, expect, it } from "bun:test";
import HTMLRewriterHTMLParser from "../html-parsing/html-rewriter";
import NodeHTMLParser from "../html-parsing/node";
import type HTMLParser from "../models/classes/html-parser";
import { CORRECT_LOGIN_PAYLOAD, WRONG_LOGIN_PAYLOAD } from "./_shared.test";
import { getPersonalDetails } from "./get-personal-details";

const runTests = (parserConstructor: typeof HTMLParser) => {
	it("should fetch personal details with valid credentials", async () => {
		const personalDetailsResult = await getPersonalDetails(
			CORRECT_LOGIN_PAYLOAD,
			parserConstructor,
		);

		if (!personalDetailsResult.success)
			throw Error(
				`Failed to get personal details with error: ${personalDetailsResult.err}`,
			);

		expect(personalDetailsResult.success).toBe(true);

		expect(personalDetailsResult.val).toBeDefined();
	});

	it("should fail to fetch personal details with invalid credentials", async () => {
		const personalDetailsResult = await getPersonalDetails(
			WRONG_LOGIN_PAYLOAD,
			parserConstructor,
		);

		if (personalDetailsResult.success)
			throw Error("Fetching personal details should have failed but succeeded");

		expect(personalDetailsResult.success).toBe(false);

		expect(personalDetailsResult.err).toBeDefined();
	});
};

describe(`${getPersonalDetails.name} - NODE`, () => runTests(NodeHTMLParser));

describe(`${getPersonalDetails.name} - HTMLRewriter`, () =>
	runTests(HTMLRewriterHTMLParser));
