import { getFetchHeaders } from "../constants/fetch";
import { UmisPage } from "../constants/umis-pages";
import { FetchedSchoolInfoSchema } from "../models/schemas/school-info";
import { fetchUmisJsonForPage } from "../utils/umis-json";
import type { GetterArgs } from "./_shared";

export const getSchoolDetails = async ({ cookie, mocks }: GetterArgs) => {
	const fetcher = mocks?.fetch ?? globalThis.fetch;

	const schoolInfoPageRes = await fetcher(UmisPage.SchoolInfo, {
		headers: getFetchHeaders({
			cookie,
			referrer: UmisPage.SchoolInfo,
			type: "get",
		}),
	});

	if (!schoolInfoPageRes.ok)
		return {
			err: `Failed to fetch school info page: ${schoolInfoPageRes.status} ${schoolInfoPageRes.statusText}`,
			success: false,
		};

	const parsedJsonResult = await fetchUmisJsonForPage(
		cookie,
		FetchedSchoolInfoSchema,
		{ fetch: fetcher },
	);

	if (parsedJsonResult.success)
		return { success: true, val: parsedJsonResult.output };

	// Since the initial html doesn't have the required data :p
	return {
		err: `Failed to parse school info JSON data: ${parsedJsonResult.issues}`,
		success: false,
	};
};
