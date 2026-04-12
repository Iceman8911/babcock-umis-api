import * as v from "valibot";
import { getFetchHeaders } from "../constants/fetch";
import { UmisPage } from "../constants/umis-pages";

/** Calls the JSON umis endpoint which will return data depending on what `UmisPage` was fetched right before this function was called. */
export const fetchUmisJsonForPage = async <TSchema extends v.GenericSchema>(
	cookie: string,
	schema: TSchema,
): Promise<v.SafeParseResult<TSchema>> => {
	const jsonResponse = await fetch(UmisPage.Json, {
		headers: getFetchHeaders({ cookie, type: "get" }),
	});

	const parsedJsonResult = v.safeParse(schema, await jsonResponse.json());

	return parsedJsonResult;
};
