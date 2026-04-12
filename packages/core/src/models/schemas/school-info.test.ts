import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { UmisStudentsPagePrefix } from "../../constants/umis-pages";
import { FetchedSchoolInfoSchema } from "./school-info";

describe("FetchedSchoolInfoSchema", () => {
	it("should parse and transform fetched school info correctly", () => {
		const fetched = [
			{
				CL: "?view=10:0:0&data=SENG",
				KF: "SENG",
				schoolid: "SENG",
				schoolname: "School of Engineering",
			},
		];

		const parsed = v.parse(FetchedSchoolInfoSchema, fetched);

		expect(parsed).toBeInstanceOf(Array);
		expect(parsed[0].shortName).toBe("SENG");
		expect(parsed[0].fullName).toBe("School of Engineering");
		expect(parsed[0].link).toBe(`${UmisStudentsPagePrefix}${fetched[0].CL}`);
	});

	it("should reject invalid shapes", () => {
		const bad = [{ missing: "fields" }];

		expect(v.safeParse(FetchedSchoolInfoSchema, bad).success).toBe(false);
	});
});
