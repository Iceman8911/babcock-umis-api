import { beforeEach, expect, it, vi } from "bun:test";
import { UmisPage } from "../../constants/umis-pages";
import { getSchoolDetails } from "./index";

beforeEach(() => {
	vi.restoreAllMocks();
});

it("should return parsed JSON school info when the JSON endpoint succeeds", async () => {
	const cookie = "json-school-test";

	const jsonPayload = [
		{
			CL: "?view=10:0:0&data=SBS",
			KF: "SBS",
			schoolid: "SBS",
			schoolname: "School of Business",
		},
	];

	const fetchSpy = vi.fn().mockImplementation(async (input) => {
		if (input === UmisPage.SchoolInfo)
			return new Response("<html></html>", {
				headers: { "content-type": "text/html;charset=UTF-8" },
			});

		if (input === UmisPage.Json)
			return new Response(JSON.stringify(jsonPayload), {
				headers: { "content-type": "application/json" },
			});

		throw new Error(`Unexpected request ${input}`);
	});

	const result = await getSchoolDetails({
		cookie,
		mocks: { fetch: fetchSpy as unknown as typeof globalThis.fetch },
	});

	if (!result.success) throw Error(`Expected success but got ${result.err}`);

	expect(result.success).toBeTrue();
	expect(result.val).toBeDefined();
	const schoolInfo = result.val!;
	expect(schoolInfo[0]).toBeDefined();
	const firstSchoolInfo = schoolInfo[0]!;
	expect(firstSchoolInfo.shortName).toBe("SBS");
	expect(firstSchoolInfo.fullName).toBe("School of Business");
	expect(fetchSpy).toHaveBeenCalledTimes(2);
});
