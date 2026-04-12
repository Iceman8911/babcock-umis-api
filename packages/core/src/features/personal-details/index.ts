import * as v from "valibot";
import { getFetchHeaders } from "../../constants/fetch";
import { UmisPage } from "../../constants/umis-pages";
import { getErrorMessage } from "../../utils/error";
import { fetchUmisJsonForPage } from "../../utils/umis-json";
import type { StaticUmisGetter } from "../shared/_shared";
import {
	FetchedPersonalDetailsSchema,
	type ResolvedPersonalDetails,
	type ScrapedPersonalDetailsInput,
	ScrapedPersonalDetailsSchema,
} from "./schema";

export const getPersonalDetails: StaticUmisGetter<
	ResolvedPersonalDetails
> = async ({ parserConstructor, cookie, mocks }) => {
	try {
		const fetcher = mocks?.fetch ?? globalThis.fetch;
		const personalDetailsResponse = await fetcher(UmisPage.PersonalDetails, {
			headers: getFetchHeaders({
				cookie,
				referrer: UmisPage.PersonalDetails,
				type: "get",
			}),
		});

		if (!personalDetailsResponse.ok)
			return {
				err: `Failed to fetch personal details page: ${personalDetailsResponse.status} ${personalDetailsResponse.statusText}`,
				success: false,
			};

		// Try the json method first. Since we've requested the personal details page, the data here should the same as the one we will get from scraping the HTML.
		const parsedJsonResult = await fetchUmisJsonForPage(
			cookie,
			FetchedPersonalDetailsSchema,
			{ fetch: fetcher },
		);

		if (parsedJsonResult.success)
			return { success: true, val: parsedJsonResult.output };

		console.log(
			"Failed to parse JSON response, falling back to HTML parsing. Error:",
			parsedJsonResult.issues,
		);

		// Fallback to html parsing
		const personalDetailsHtml = await personalDetailsResponse.text();

		if (!parserConstructor) throw Error("Parser constructor must be provided");
		const parser = await parserConstructor.init(
			new Response(personalDetailsHtml, {
				headers: { "content-type": "text/html;charset=UTF-8" },
			}),
		);

		const elements: ScrapedPersonalDetailsInput = [];

		parser.onAll("td", (texts) => {
			for (const text of texts) {
				// Skip empty strings
				if (text) elements.push(text);
			}
		});

		await parser.process();

		return {
			success: true,
			val: v.parse(ScrapedPersonalDetailsSchema, elements),
		};
	} catch (e) {
		return { err: getErrorMessage(e), success: false };
	}
};
