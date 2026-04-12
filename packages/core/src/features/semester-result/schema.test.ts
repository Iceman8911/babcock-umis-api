import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { UmisStudentsPagePrefix } from "../../constants/umis-pages";
import { FetchedAllSemesterResultsSummarySchema } from "./schema";

describe("FetchedAllSemesterResultsSchema", () => {
	it("should parse and transform fetched semester result entries", () => {
		const fetched = [
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

		const parsed = v.parse(FetchedAllSemesterResultsSummarySchema, fetched);

		expect(parsed).toBeInstanceOf(Array);
		expect(parsed[0]).toBeDefined();
		expect(parsed[0]).toEqual({
			creditHours: 12,
			cummCreditHours: 24,
			cummGpa: 3.55,
			gpa: 3.6,
			link: `${UmisStudentsPagePrefix}?view=19:0:0&data=431025`,
			session: "2022/2023.1",
			studyLevel: 100,
		});
	});

	it("should reject invalid semester result shapes", () => {
		const bad = [{ credit: "12", quarterid: "not-a-link" }];

		expect(
			v.safeParse(FetchedAllSemesterResultsSummarySchema, bad).success,
		).toBe(false);
	});
});
