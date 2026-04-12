import type { Mocks } from "../../models/types/mocks";
import type { Result } from "../../models/types/result";
import type HTMLParser from "../parsers/html-parser";

/** For any feature function that simply fetches data */
interface GetterArgs {
	cookie: string;
	mocks?: Mocks;
	parserConstructor?: typeof HTMLParser;
}

export type UmisDataGetterFunction<TResultType> = (
	arg: GetterArgs,
) => Promise<Result<TResultType, string>>;
