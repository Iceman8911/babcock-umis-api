import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { attemptStudentLogin } from "../login";
import { CORRECT_LOGIN_PAYLOAD } from "../shared/_shared.test";
import { getSelectedCourseList } from "./get-selected-course-list";
import { FetchedSelectedCourseListSchema } from "./schema";

describe("FetchedSelectedCourseListSchema", () => {
	it("should parse and transform fetched selected course entries", () => {
		const fetched = [
			{
				classoption: "Group A",
				courseid: "COSC430",
				coursetitle: "Hands-on JAVA training",
				credit: 3,
				instructorname: "Dr Example",
				nogpa: false,
				selectiondate: "2024-01-01",
				yeartaken: 2,
			},
		];

		const parsed = v.parse(FetchedSelectedCourseListSchema, fetched);

		expect(parsed).toBeInstanceOf(Array);
		expect(parsed[0]?.code).toBe("COSC430");
		expect(parsed[0]?.title).toBe("Hands-on JAVA training");
		expect(parsed[0]?.lecturer).toBe("Dr Example");
		expect(parsed[0]?.credit).toBe(3);
		expect(parsed[0]?.classOption).toBe("Group A");
		expect(parsed[0]?.hasGpa).toBe(false);
		expect(parsed[0]?.year).toBe(2);
		expect(parsed[0]?.selectedOn).toBeInstanceOf(Date);
		expect(parsed[0]?.selectedOn.getUTCFullYear()).toBe(2024);
	});

	it("should reject invalid shapes", () => {
		const bad = [{ courseid: "NOPE" }];

		expect(v.safeParse(FetchedSelectedCourseListSchema, bad).success).toBe(
			false,
		);
	});
});

describe("getSelectedCourseList (integration)", () => {
	it("should fetch selected course list with valid UMIS credentials", async () => {
		const loginResponse = await attemptStudentLogin(CORRECT_LOGIN_PAYLOAD);

		expect(loginResponse.success).toBeTrue();

		if (!loginResponse.success)
			throw new Error(`Login failed: ${loginResponse.err}`);

		const result = await getSelectedCourseList({
			cookie: loginResponse.val.JSESSIONID,
		});

		expect(result.success).toBeTrue();

		if (!result.success) throw new Error(result.err);

		expect(result.val.length).toBeGreaterThanOrEqual(0);
	});
});
