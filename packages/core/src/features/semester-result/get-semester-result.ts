import { getFetchHeaders } from "../../constants/fetch";
import { fetchUmisJsonForPage } from "../../utils/umis-json";
import type { DynamicUmisGetter } from "../shared/_shared";
import {
	FetchedSingleSemesterResultsSchema,
	type ResolvedSingleSemesterResults,
} from "./schema";

export const getSingleSemesterResults: DynamicUmisGetter<
	ResolvedSingleSemesterResults
> = async ({ cookie, link, mocks }) => {
	const fetcher = mocks?.fetch ?? fetch;

	const semesterResultPageRes = await fetcher(link, {
		headers: getFetchHeaders({
			cookie,
			referrer: link,
			type: "get",
		}),
	});

	if (!semesterResultPageRes.ok)
		return {
			err: `Failed to fetch semester result page: ${semesterResultPageRes.status} ${semesterResultPageRes.statusText}`,
			success: false,
		};

	const parsedJsonResult = await fetchUmisJsonForPage(
		cookie,
		FetchedSingleSemesterResultsSchema,
		{ fetch: fetcher },
	);

	if (parsedJsonResult.success)
		return { success: true, val: parsedJsonResult.output };

	// Since the initial html doesn't have the required data :p
	return {
		err: `Failed to parse semester result JSON data: ${parsedJsonResult.issues}`,
		success: false,
	};
};
