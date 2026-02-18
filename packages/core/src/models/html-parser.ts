export type OnTextCb = (text: string) => void | Promise<void>;
export type OnAllTextCb = (
	texts: ReadonlyArray<string>,
) => void | Promise<void>;
type CbArrayElement = (
	| {
			cb: OnTextCb;
			isOne: true;
	  }
	| { cb: OnAllTextCb; isOne: false }
) & {
	/** Css selector */
	css: string;
};

/** Cleanup redundant spaces and newlines */
function normalizeText(text: string): string {
	return text.replace(/[\n\s]+/g, " ").trim();
}

/** Generic abstract builder interface for running callbacks on found elements / text in a html response */
export default abstract class HTMLParser {
	protected constructor(...args: never[]) {}

	/** Static init method to handle the response inputs */
	static init(_: Response): Promise<HTMLParser> {
		throw Error(`Override this method`);
	}

	protected cbs: Array<CbArrayElement> = [];

	/** Attaches the given callback to be ran when the first element matching the selector is found when the response is processed */
	onOne(cssSelector: string, cb: OnTextCb): HTMLParser {
		const normalizedCb: OnTextCb = (text: string) => cb(normalizeText(text));

		this.cbs.push({ cb: normalizedCb, css: cssSelector, isOne: true });

		return this;
	}

	/** Attaches the given callback to be ran when elements matching the selector is found when the response is processed */
	onAll(cssSelector: string, cb: OnAllTextCb): HTMLParser {
		const normalizedCb: OnAllTextCb = (texts: ReadonlyArray<string>) =>
			cb(texts.map(normalizeText));

		this.cbs.push({ cb: normalizedCb, css: cssSelector, isOne: false });

		return this;
	}

	/** Processes the html response in a single go and runs all attached callbacks when the matching elements are found */
	abstract process(): Promise<void>;
}
