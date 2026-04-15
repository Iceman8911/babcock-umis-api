import * as v from "valibot";
import { getFetchHeaders } from "../constants/fetch";
import { UmisPage } from "../constants/umis-pages";
import type { Mocks } from "../features/shared/mocks";

/** Calls the JSON umis endpoint which will return data depending on what `UmisPage` was fetched right before this function was called. */
export const fetchUmisJsonForPage = async <TSchema extends v.GenericSchema>(
	cookie: string,
	schema: TSchema,
	mocks?: Mocks,
): Promise<v.SafeParseResult<TSchema>> => {
	const fetcher = mocks?.fetch ?? globalThis.fetch;
	const jsonResponse = await fetcher(UmisPage.Json, {
		headers: getFetchHeaders({ cookie, type: "get" }),
	});

	const parsedJsonResult = v.safeParse(schema, await jsonResponse.json());

	return parsedJsonResult;
};
