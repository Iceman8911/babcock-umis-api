import { getFetchHeaders } from "../../constants/fetch";
import { UmisPage } from "../../constants/umis-pages";
import { fetchUmisJsonForPage } from "../../utils/umis-json";
import type { StaticUmisGetter } from "../shared/_shared";
import {
	FetchedCheckListingsSchema,
	type ResolvedCheckListings,
} from "./schema";

export const checkListings: StaticUmisGetter<ResolvedCheckListings> = async ({
	cookie,
	mocks,
}) => {
	const fetcher = mocks?.fetch ?? fetch;

	const checkListingPageRes = await fetcher(UmisPage.CheckListing, {
		headers: getFetchHeaders({
			cookie,
			referrer: UmisPage.CheckListing,
			type: "get",
		}),
	});

	if (!checkListingPageRes.ok)
		return {
			err: `Failed to fetch check listing page: ${checkListingPageRes.status} ${checkListingPageRes.statusText}`,
			success: false,
		};

	const parsedJsonResult = await fetchUmisJsonForPage(
		cookie,
		FetchedCheckListingsSchema,
		{ fetch: fetcher },
	);

	if (parsedJsonResult.success)
		return { success: true, val: parsedJsonResult.output };

	return {
		err: `Failed to parse check listing JSON data: ${parsedJsonResult.issues}`,
		success: false,
	};
};

export default checkListings;
