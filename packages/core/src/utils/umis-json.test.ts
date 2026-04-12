import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { fetchUmisJsonForPage } from "./umis-json";

const createResponse = (body: string) =>
	new Response(body, {
		headers: { "content-type": "application/json" },
	});

const cookie = "test-session";

describe(fetchUmisJsonForPage.name, () => {
	it("should fetch JSON for the current page and parse it with the supplied schema", async () => {
		const expected = {
			accountnumber: "1234",
			address: "1 Test St",
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
			sex: "M",
			studentid: "21/1234",
			studentname: "john doe",
			town: "Ikeja",
		};
		let fetchCalls = 0;
		const fetchSpy = async (input: RequestInfo) => {
			fetchCalls += 1;
			return createResponse(JSON.stringify([expected]));
		};

		const schema = v.tuple([
			v.object({
				accountnumber: v.string(),
				address: v.string(),
				addresscountry: v.string(),
				CL: v.string(),
				current_study_level: v.number(),
				denominationname: v.string(),
				departmentid: v.string(),
				departmentname: v.string(),
				email: v.string(),
				entry_level: v.number(),
				etranzact_card_no: v.number(),
				KF: v.string(),
				majorname: v.string(),
				maritalstatus: v.string(),
				nationalitycountry: v.string(),
				offcampus: v.boolean(),
				onprobation: v.boolean(),
				religionname: v.string(),
				schoolid: v.string(),
				sex: v.string(),
				studentid: v.string(),
				studentname: v.string(),
				town: v.string(),
			}),
		]);

		const result = await fetchUmisJsonForPage(cookie, schema, {
			fetch: fetchSpy as unknown as typeof globalThis.fetch,
		});

		expect(fetchCalls).toBe(1);
		expect(result.success).toBe(true);
		if (!result.success) throw new Error("Expected safe parse success");
		expect(result.output).toEqual([expected]);
	});

	it("should return a failed parse result when the JSON does not match the schema", async () => {
		let fetchCalls = 0;
		const fetchSpy = async (input: RequestInfo) => {
			fetchCalls += 1;
			return createResponse(JSON.stringify([{ bad: "data" }]));
		};

		const schema = v.tuple([v.object({ id: v.number() })]);

		const result = await fetchUmisJsonForPage(cookie, schema, {
			fetch: fetchSpy as unknown as typeof globalThis.fetch,
		});

		expect(fetchCalls).toBe(1);
		expect(result.success).toBe(false);
		expect(result.issues).toBeDefined();
	});
});
