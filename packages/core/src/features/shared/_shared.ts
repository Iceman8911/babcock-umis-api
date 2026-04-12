import type { Mocks } from "../../models/types/mocks";
import type HTMLParser from "../parsers/html-parser";

/** For any feature function that simply fetches data */
export interface GetterArgs {
	cookie: string;
	mocks?: Mocks;
	parserConstructor?: typeof HTMLParser;
}
