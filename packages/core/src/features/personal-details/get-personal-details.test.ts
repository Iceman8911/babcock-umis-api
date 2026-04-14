import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { UmisPage } from "../../constants/umis-pages";
import { attemptStudentLogin } from "../login";
import type HTMLParser from "../parsers/html-parser";
import HTMLRewriterHTMLParser from "../parsers/html-rewriter";
import NodeHTMLParser from "../parsers/node-html-parser";
import { CORRECT_LOGIN_PAYLOAD } from "../shared/_shared.test";
import { getPersonalDetails } from "./index";

class FakeHTMLParser {
	static async init(response: Response) {
		return new FakeHTMLParser(await response.text());
	}

	callback?: (texts: string[]) => void;

	constructor(private html: string) {}

	onAll(_tag: string, callback: (texts: string[]) => void) {
		this.callback = callback;
	}

	async process() {
		this.callback?.([
			"Matric No.",
			"21/1234",
			"Student Name",
			"Jane Doe",
			"Programme",
			"Computer Science",
			"Department",
			"SENG",
			"Entry Level",
			"100",
			"Study Level",
			"200",
			"Religion",
			"None",
			"Denomination",
			"None",
			"Gender",
			"F",
			"Marital Status",
			"Single",
			"Nationality",
			"Nigeria",
			"Address",
			"123 Babcock Rd",
			"Town",
			"Ilishan",
			"Country",
			"Nigeria",
			"On Probation",
			"false",
			"Off Campus",
			"false",
			"School Details",
			"SENG",
			"Department Details",
			"SENG",
			"Account Number",
			"A-1234",
			"Etranzact Card Number",
			"56789",
			"Email",
			"student@example.com",
		]);
	}
}

beforeEach(() => {
	vi.restoreAllMocks();
});

it("should return parsed JSON personal details when the JSON endpoint succeeds", async () => {
	const cookie = "json-test-session";
	const jsonPayload = {
		accountnumber: "A-123",
		address: "1 Test Ave",
		addresscountry: "NG",
		CL: "X",
		current_study_level: 100,
		denominationname: "None",
		departmentid: "CS",
		departmentname: "Computer Science",
		email: "student@example.com",
		entry_level: 100,
		etranzact_card_no: 12345,
		KF: "KF123",
		majorname: "Computer Science",
		maritalstatus: "Single",
		nationalitycountry: "Nigeria",
		offcampus: false,
		onprobation: false,
		religionname: "None",
		schoolid: "SENG",
		sex: "F",
		studentid: "21/1234",
		studentname: "john doe",
		town: "Ilishan",
	};

	const fetchSpy = vi.fn().mockImplementation(async (input) => {
		if (input === UmisPage.PersonalDetails)
			return new Response("<html></html>", {
				headers: { "content-type": "text/html;charset=UTF-8" },
			});

		if (input === UmisPage.Json)
			return new Response(JSON.stringify([jsonPayload]), {
				headers: { "content-type": "application/json" },
			});

		throw new Error(`Unexpected request ${input}`);
	});

	const personalDetailsResult = await getPersonalDetails({
		cookie,
		mocks: { fetch: fetchSpy as unknown as typeof globalThis.fetch },
		parserConstructor: NodeHTMLParser,
	});

	if (!personalDetailsResult.success)
		throw Error(
			`Expected JSON fetch success but got ${personalDetailsResult.err}`,
		);

	expect(personalDetailsResult.success).toBeTrue();
	expect(personalDetailsResult.val.accountNo).toBe(jsonPayload.accountnumber);
	expect(personalDetailsResult.val.name).toBe("John Doe");
	expect(fetchSpy).toHaveBeenCalledTimes(2);
});

it("should fall back to HTML parsing when JSON fetching parses incorrectly", async () => {
	const cookie = "fallback-test-session";

	const fetchSpy = vi.fn().mockImplementation(async (input) => {
		if (input === UmisPage.PersonalDetails)
			return new Response("<html></html>", {
				headers: { "content-type": "text/html;charset=UTF-8" },
			});

		if (input === UmisPage.Json)
			return new Response(JSON.stringify({ missing: "fields" }), {
				headers: { "content-type": "application/json" },
			});

		throw new Error(`Unexpected request ${input}`);
	});

	const personalDetailsResult = await getPersonalDetails({
		cookie,
		mocks: { fetch: fetchSpy as unknown as typeof globalThis.fetch },
		parserConstructor: FakeHTMLParser as unknown as typeof HTMLParser,
	});

	if (!personalDetailsResult.success)
		throw Error(
			`Expected fallback HTML parsing success but got ${personalDetailsResult.err}`,
		);

	expect(personalDetailsResult.success).toBeTrue();
	expect(personalDetailsResult.val.name).toBe("Jane Doe");
	expect(personalDetailsResult.val.programme).toBe("Computer Science");
	expect(fetchSpy).toHaveBeenCalledTimes(2);
});

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
