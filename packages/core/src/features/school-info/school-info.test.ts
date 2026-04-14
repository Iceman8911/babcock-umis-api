import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { UmisStudentsPagePrefix } from "../../constants/umis-pages";
import { FetchedSchoolDetailsSchema } from "./schema";

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

		const parsed = v.parse(FetchedSchoolDetailsSchema, fetched);

		expect(parsed).toBeInstanceOf(Array);
		expect(parsed[0]).toBeDefined();
		const firstParsed = parsed[0]!;
		const firstFetched = fetched[0]!;
		expect(firstParsed.shortName).toBe("SENG");
		expect(firstParsed.fullName).toBe("School of Engineering");
		expect(firstParsed.link).toBe(
			`${UmisStudentsPagePrefix}${firstFetched.CL}`,
		);
	});
	it("should reject invalid shapes", () => {
		const bad = [{ missing: "fields" }];

		expect(v.safeParse(FetchedSchoolDetailsSchema, bad).success).toBe(false);
	});
});
