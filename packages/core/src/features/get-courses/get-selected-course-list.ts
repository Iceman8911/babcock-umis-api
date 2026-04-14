import { getFetchHeaders } from "../../constants/fetch";
import { UmisPage } from "../../constants/umis-pages";
import { fetchUmisJsonForPage } from "../../utils/umis-json";
import type { StaticUmisGetter } from "../shared/_shared";
import {
	FetchedSelectedCourseListSchema,
	type ResolvedSelectedCourseList,
} from "./schema";

export const getSelectedCourseList: StaticUmisGetter<
	ResolvedSelectedCourseList
> = async ({ cookie, mocks }) => {
	const fetcher = mocks?.fetch ?? fetch;

	const selectedCourseListPageRes = await fetcher(UmisPage.SelectedCourseList, {
		headers: getFetchHeaders({
			cookie,
			referrer: UmisPage.SelectedCourseList,
			type: "get",
		}),
	});

	if (!selectedCourseListPageRes.ok)
		return {
			err: `Failed to fetch selected course list page: ${selectedCourseListPageRes.status} ${selectedCourseListPageRes.statusText}`,
			success: false,
		};

	const parsedJsonResult = await fetchUmisJsonForPage(
		cookie,
		FetchedSelectedCourseListSchema,
		{ fetch: fetcher },
	);

	if (parsedJsonResult.success)
		return { success: true, val: parsedJsonResult.output };

	return {
		err: `Failed to parse selected course list JSON data: ${parsedJsonResult.issues}`,
		success: false,
	};
};
