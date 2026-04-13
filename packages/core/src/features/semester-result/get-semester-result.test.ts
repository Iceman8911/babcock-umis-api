import { beforeEach, describe, expect, it, vi } from "bun:test";
import { attemptStudentLogin } from "../login";
import { CORRECT_LOGIN_PAYLOAD } from "../shared/_shared.test";
import { getSemesterResultSummaries } from "./get-all-semester-results-summary";
import { getSingleSemesterResults } from "./get-semester-result";

describe(getSingleSemesterResults.name, () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("should fetch a real semester result by link", async () => {
		const loginResult = await attemptStudentLogin(CORRECT_LOGIN_PAYLOAD);
		expect(loginResult.success).toBeTrue();

		if (!loginResult.success) {
			throw new Error(loginResult.err);
		}

		const cookie = loginResult.val.JSESSIONID;
		const summaryResult = await getSemesterResultSummaries({ cookie });
		expect(summaryResult.success).toBeTrue();

		if (!summaryResult.success) {
			throw new Error(summaryResult.err);
		}

		const firstSemester = summaryResult.val[0];
		expect(firstSemester).toBeDefined();

		if (!firstSemester) throw "";

		const result = await getSingleSemesterResults({
			cookie,
			link: firstSemester.link,
		});

		expect(result.success).toBeTrue();

		if (!result.success) {
			throw new Error(result.err);
		}

		expect(result.val.length).toBeGreaterThan(0);
		expect(result.val[0]?.course.code).toBeTruthy();
		expect(result.val[0]?.course.title).toBeTruthy();
	});

	it("should return an error when the semester result page fetch fails", async () => {
		let fetchCalls = 0;
		const fetchSpy = async (_input: RequestInfo) => {
			fetchCalls += 1;
			return new Response("Not found", {
				status: 404,
				statusText: "Not Found",
			});
		};

		const result = await getSingleSemesterResults({
			cookie: "invalid-cookie",
			link: "https://example.com/fail",
			mocks: { fetch: fetchSpy as unknown as typeof globalThis.fetch },
		});

		expect(result.success).toBe(false);

		if (result.success) throw "";
		expect(result.err).toContain("Failed to fetch semester result page");
		expect(fetchCalls).toBe(1);
	});
});
