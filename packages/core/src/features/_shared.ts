import type HTMLParser from "../models/classes/html-parser";
import type { Mocks } from "../models/types/mocks";

/** For any feature function that simply fetches data */
export interface GetterArgs {
	cookie: string;
	mocks?: Mocks;
	parserConstructor: typeof HTMLParser;
}
