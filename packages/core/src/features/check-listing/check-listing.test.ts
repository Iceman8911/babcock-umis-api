import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { UmisStudentsPagePrefix } from "../../constants/umis-pages";
import { attemptStudentLogin } from "../login";
import { CORRECT_LOGIN_PAYLOAD } from "../shared/_shared.test";
import checkListings from "./check-listing";
import { FetchedCheckListingsSchema } from "./schema";

describe("FetchedCheckListingsSchema", () => {
	it("should parse and transform fetched check listing entries", () => {
		const fetched = [
			{
				CL: "?view=26:0:0&data=GEDS001",
				courseid: "<a href='?view=26:0:0&data=GEDS001'>GEDS001</a>",
				coursepased: "Yes",
				coursetitle: "Citizenship Orientation",
				credithours: "0",
				elective: "No",
				KF: "GEDS001",
				yeartaken: "0",
			},
		];

		const parsed = v.parse(FetchedCheckListingsSchema, fetched);

		expect(parsed).toBeInstanceOf(Array);
		expect(parsed[0]).toEqual({
			code: "GEDS001",
			credits: 0,
			elective: false,
			link: `${UmisStudentsPagePrefix}?view=26:0:0&data=GEDS001`,
			passed: true,
			title: "Citizenship Orientation",
			yearTaken: 0,
		});
	});

	it("should reject invalid shapes", () => {
		const bad = [{ coursetitle: "Nope" }];

		expect(v.safeParse(FetchedCheckListingsSchema, bad).success).toBe(false);
	});

	it("should fetch real check listings with valid UMIS credentials", async () => {
		const loginResponse = await attemptStudentLogin(CORRECT_LOGIN_PAYLOAD);
		expect(loginResponse.success).toBeTrue();

		if (!loginResponse.success)
			throw new Error(`Login failed with error: ${loginResponse.err}`);

		const result = await checkListings({
			cookie: loginResponse.val.JSESSIONID,
		});

		expect(result.success).toBeTrue();

		if (!result.success) throw new Error(result.err);

		expect(result.val.length).toBeGreaterThan(0);
	});
});
