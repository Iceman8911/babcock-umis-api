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
		const personalDetailsResult = await getClient().getPersonalDetails();
		expect(personalDetailsResult.success).toBeTrue();

		if (!personalDetailsResult.success) {
			throw Error(personalDetailsResult.err);
		}

		expect(personalDetailsResult.val).toBeDefined();
		expect(personalDetailsResult.val.matricNo).toBe(CORRECT_LOGIN_PAYLOAD.user);
		expect(typeof personalDetailsResult.val.name).toBe("string");
	});

	it("should fetch the school info", async () => {
		const schoolInfoRes = await getClient().getSchoolDetails();
		expect(schoolInfoRes.success).toBeTrue();

		if (!schoolInfoRes.success) {
			throw Error(schoolInfoRes.err);
		}

		expect(schoolInfoRes.val.length).toBeGreaterThan(0);
	});

	it("should fetch all semester result summaries", async () => {
		const allSemesterResultsSummary =
			await getClient().getSemesterResultSummaries();
		expect(allSemesterResultsSummary.success).toBeTrue();

		if (!allSemesterResultsSummary.success) {
			throw Error(allSemesterResultsSummary.err);
		}

		expect(allSemesterResultsSummary.val.length).toBeGreaterThan(0);
	});

	it("should fetch a semester result by session", async () => {
		const client = getClient();
		const allSemesterResults = await client.getSemesterResultSummaries();
		expect(allSemesterResults.success).toBeTrue();

		if (!allSemesterResults.success) {
			throw new Error(allSemesterResults.err);
		}

		const [firstSemester] = allSemesterResults.val;
		expect(firstSemester).toBeDefined();

		if (!firstSemester) throw "";

		const semesterResult = await client.getSingleSemesterResults({
			session: firstSemester.session,
			type: "session",
		});
		expect(semesterResult.success).toBeTrue();

		if (!semesterResult.success) {
			throw new Error(semesterResult.err);
		}

		expect(semesterResult.val.length).toBeGreaterThan(0);
		expect(semesterResult.val[0]?.course.code).toBeTruthy();
	});

	it("should fetch a semester result by link", async () => {
		const client = getClient();
		const allSemesterResults = await client.getSemesterResultSummaries();
		expect(allSemesterResults.success).toBeTrue();

		if (!allSemesterResults.success) {
			throw new Error(allSemesterResults.err);
		}

		const [firstSemester] = allSemesterResults.val;
		expect(firstSemester).toBeDefined();

		if (!firstSemester) throw "";

		const semesterResult = await client.getSingleSemesterResults({
			link: firstSemester.link,
			type: "link",
		});
		expect(semesterResult.success).toBeTrue();

		if (!semesterResult.success) {
			throw new Error(semesterResult.err);
		}

		expect(semesterResult.val.length).toBeGreaterThan(0);
		expect(semesterResult.val[0]?.course.title).toBeTruthy();
	});

	it("should fetch all course grades from all semesters ", async () => {
		const allSemesterResults = await getClient().getAllSemesterResults();
		expect(allSemesterResults.success).toBeTrue();

		if (!allSemesterResults.success) {
			throw Error(allSemesterResults.err);
		}

		expect(allSemesterResults.val.length).toBeGreaterThan(0);
	});

	it("should fetch all listings", async () => {
		const allListingsRes = await getClient().checkListings();

		expect(allListingsRes.success).toBeTrue();

		if (!allListingsRes.success) throw Error(allListingsRes.err);

		expect(allListingsRes.val.length).toBeGreaterThan(0);
	});
};
