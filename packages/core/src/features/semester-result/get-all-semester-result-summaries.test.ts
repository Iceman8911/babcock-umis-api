import { beforeEach, describe, expect, it, vi } from "bun:test";
import { UmisPage, UmisStudentsPagePrefix } from "../../constants/umis-pages";
import { attemptStudentLogin } from "../login";
import { CORRECT_LOGIN_PAYLOAD } from "../shared/_shared.test";
import { getSemesterResultSummaries } from "./get-semester-result-summaries";

const createHtmlResponse = () =>
	new Response("<html></html>", {
		headers: { "content-type": "text/html;charset=UTF-8" },
		status: 200,
	});

const createJsonResponse = (body: unknown) =>
	new Response(JSON.stringify(body), {
		headers: { "content-type": "application/json" },
		status: 200,
	});

describe(getSemesterResultSummaries.name, () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("should return parsed semester results when the initial page and JSON endpoint both succeed", async () => {
		const cookie = "semester-results-success";
		const jsonPayload = [
			{
				cl: "?view=19:0:0&data=431025",
				credit: "12",
				cummcredit: "24",
				cummgpa: "3.55",
				gpa: "3.60",
				kf: "12345",
				quarterid: "<a href='?view=19:0:0&data=431025'>2022/2023.1</a>",
				studylevel: "100",
			},
		];

		const fetchSpy = vi.fn(async (input: RequestInfo) => {
			if (input === UmisPage.SemesterResults) return createHtmlResponse();
			if (input === UmisPage.Json) return createJsonResponse(jsonPayload);
			throw new Error(`Unexpected request ${input}`);
		});

		const result = await getSemesterResultSummaries({
			cookie,
			mocks: { fetch: fetchSpy as unknown as typeof globalThis.fetch },
		});

		expect(result.success).toBe(true);
		if (!result.success) throw new Error("Expected result to succeed");
		expect(result.val).toEqual([
			{
				creditHours: 12,
				cummCreditHours: 24,
				cummGpa: 3.55,
				gpa: 3.6,
				link: `${UmisStudentsPagePrefix}?view=19:0:0&data=431025`,
				session: "2022/2023.1",
				studyLevel: 100,
			},
		]);
		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});

	it("should fetch real semester results summary with valid UMIS credentials", async () => {
		const loginResponse = await attemptStudentLogin(CORRECT_LOGIN_PAYLOAD);
		expect(loginResponse.success).toBeTrue();

		if (!loginResponse.success)
			throw new Error(`Login failed with error: ${loginResponse.err}`);

		const result = await getSemesterResultSummaries({
			cookie: loginResponse.val.JSESSIONID,
		});

		expect(result.success).toBeTrue();
		if (!result.success) throw new Error(result.err);

		expect(result.val.length).toBeGreaterThan(0);
		expect(result.val[0]?.session).toBeTruthy();
		expect(result.val[0]?.link).toContain("?view=");
	});

	it("should return an error when the semester results page returns a non-ok response", async () => {
		const cookie = "semester-results-page-fail";
		const fetchSpy = vi.fn(async (input: RequestInfo) => {
			if (input === UmisPage.SemesterResults)
				return new Response("Not found", {
					status: 404,
					statusText: "Not Found",
				});
			throw new Error(`Unexpected request ${input}`);
		});

		const result = await getSemesterResultSummaries({
			cookie,
			mocks: { fetch: fetchSpy as unknown as typeof globalThis.fetch },
		});

		expect(result.success).toBe(false);

		if (result.success) throw "";

		expect(result.err).toContain("Failed to fetch all semester results page");
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it("should return an error when the JSON endpoint returns invalid semester result data", async () => {
		const cookie = "semester-results-json-fail";
		const fetchSpy = vi.fn(async (input: RequestInfo) => {
			if (input === UmisPage.SemesterResults) return createHtmlResponse();
			if (input === UmisPage.Json)
				return createJsonResponse([{ bad: "payload" }] as unknown);
			throw new Error(`Unexpected request ${input}`);
		});

		const result = await getSemesterResultSummaries({
			cookie,
			mocks: { fetch: fetchSpy as unknown as typeof globalThis.fetch },
		});

		expect(result.success).toBe(false);

		if (result.success) throw "";

		expect(result.err).toContain("Failed to parse semester results JSON data");
		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});
});
