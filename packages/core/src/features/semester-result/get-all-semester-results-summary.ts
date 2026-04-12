import { getFetchHeaders } from "../../constants/fetch";
import { UmisPage } from "../../constants/umis-pages";
import { fetchUmisJsonForPage } from "../../utils/umis-json";
import type { UmisDataGetterFunction } from "../shared/_shared";
import {
	FetchedAllSemesterResultsSummarySchema,
	type ResolvedAllSemesterResultsSummary,
} from "./schema";

export const getAllSemesterResultsSummary: UmisDataGetterFunction<
	ResolvedAllSemesterResultsSummary
> = async ({ cookie, mocks }) => {
	const fetcher = mocks?.fetch ?? fetch;

	const allSemesterResultsPageRes = await fetcher(UmisPage.SemesterResults, {
		headers: getFetchHeaders({
			cookie,
			referrer: UmisPage.SemesterResults,
			type: "get",
		}),
	});

	if (!allSemesterResultsPageRes.ok)
		return {
			err: `Failed to fetch all semester results page: ${allSemesterResultsPageRes.status} ${allSemesterResultsPageRes.statusText}`,
			success: false,
		};

	const parsedJsonResult = await fetchUmisJsonForPage(
		cookie,
		FetchedAllSemesterResultsSummarySchema,
		{ fetch: fetcher },
	);

	if (parsedJsonResult.success)
		return { success: true, val: parsedJsonResult.output };

	// Since the initial html doesn't have the required data :p
	return {
		err: `Failed to parse semester results JSON data: ${parsedJsonResult.issues}`,
		success: false,
	};
};
