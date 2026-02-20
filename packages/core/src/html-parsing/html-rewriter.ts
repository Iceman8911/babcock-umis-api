import HTMLParser, {
	type OnAllTextCb,
	type OnTextCb,
} from "../models/html-parser";
import { getOrInsert } from "../utils/map";

interface OnTextCbTrackingData {
	/** Combined text to pass to the callback */
	text: string;

	/** Amount of times a matched element for this callback's css selector is matched */
	count: number;
}

interface OnAllTextCbTrackingData {
	/** Combined text strings to pass to the callback */
	allText: string[];

	/** Stack of indices for currently-open matching elements (supports nesting) */
	stack: number[];
}

export default class HTMLRewriterHTMLParser extends HTMLParser {
	#htmlResponse: Response;
	#htmlRewriter: HTMLRewriter;
	#onTextCbTrackingMap = new Map<OnTextCb, OnTextCbTrackingData>();
	#onAllTextCbTrackingMap = new Map<OnAllTextCb, OnAllTextCbTrackingData>();

	constructor(res: Response) {
		super();

		this.#htmlResponse = res;
		this.#htmlRewriter = new HTMLRewriter();
	}

	static override async init(
		htmlRes: Response,
	): Promise<HTMLRewriterHTMLParser> {
		return new HTMLRewriterHTMLParser(htmlRes);
	}

	#getValInOnTextCbTrackingMap(cb: OnTextCb): OnTextCbTrackingData {
		return getOrInsert(this.#onTextCbTrackingMap, cb, { count: 0, text: "" });
	}

	#getValInOnAllTextCbTrackingMap(cb: OnAllTextCb): OnAllTextCbTrackingData {
		return getOrInsert(this.#onAllTextCbTrackingMap, cb, {
			allText: [],
			stack: [],
		});
	}

	#modifyOnTextCbMap(
		cbKey: OnTextCb,
		cbMod: (cb: OnTextCbTrackingData) => OnTextCbTrackingData,
	) {
		const oldVal = this.#getValInOnTextCbTrackingMap(cbKey);

		this.#onTextCbTrackingMap.set(cbKey, cbMod(oldVal));
	}

	#modifyOnAllTextCbMap(
		cb: OnAllTextCb,
		cbMod: (cb: OnAllTextCbTrackingData) => OnAllTextCbTrackingData,
	) {
		const oldVal = this.#getValInOnAllTextCbTrackingMap(cb);

		this.#onAllTextCbTrackingMap.set(cb, cbMod(oldVal));
	}

	override async process(): Promise<void> {
		let htmlRewriter = this.#htmlRewriter;
		const self = this;

		// The text we want is the text content of the entire element so we initially setup handlers to concatenate all the text we need.
		// For "onAll" we need to support nested matches and self-closing elements, so we maintain a stack of open matches per callback.
		for (const { cb, css, isOne } of this.cbs) {
			if (isOne) {
				htmlRewriter = htmlRewriter.on(css, {
					element(el) {
						if (el.selfClosing) {
							// Void tag, no textContent expected — mark as seen so text chunks won't be captured
							self.#modifyOnTextCbMap(cb, (prev) => {
								prev.count++;
								return prev;
							});
						} else {
							// Ensure we only finalize (mark seen) when the element's end tag is reached
							el.onEndTag(() => {
								self.#modifyOnTextCbMap(cb, (prev) => {
									prev.count++;
									return prev;
								});
							});
						}
					},
					text({ text }) {
						// If we've already seen/finished the first matching element, ignore further chunks
						if (self.#getValInOnTextCbTrackingMap(cb).count > 0) return;

						self.#modifyOnTextCbMap(cb, (prev) => {
							prev.text += text;
							return prev;
						});
					},
				});
			} else {
				// onAll: maintain a stack of open matches so nested elements are handled independently.
				htmlRewriter = htmlRewriter.on(css, {
					element(el) {
						// Create a new slot for this matching element and push its index on the stack
						self.#modifyOnAllTextCbMap(cb, (prev) => {
							const newIndex = prev.allText.length;
							prev.allText.push("");
							prev.stack.push(newIndex);
							return prev;
						});

						if (el.selfClosing) {
							// Self-closing: no text chunks will arrive; pop immediately to close this match.
							self.#modifyOnAllTextCbMap(cb, (prev) => {
								prev.stack.pop();
								return prev;
							});
						} else {
							// Pop the stack when the end tag arrives, ensuring any nested matches that opened after this one are already closed.
							el.onEndTag(() => {
								self.#modifyOnAllTextCbMap(cb, (prev) => {
									prev.stack.pop();
									return prev;
								});
							});
						}
					},
					text({ text }) {
						// Append incoming chunk to all currently-open matching elements so ancestor matches include descendant text
						self.#modifyOnAllTextCbMap(cb, (prev) => {
							const stack = prev.stack;
							if (stack.length) {
								for (const idx of stack) {
									prev.allText[idx] = `${prev.allText[idx] || ""}${text}`;
								}
							}
							return prev;
						});
					},
				});
			}
		}

		// Run the transformation which will invoke the handlers and collect text chunks
		htmlRewriter.transform(this.#htmlResponse);

		const promises: Promise<void>[] = [];

		// Call onOne callbacks with the concatenated text (normalize is applied earlier)
		for (const [cb, { text }] of this.#onTextCbTrackingMap) {
			if (text.length) promises.push(Promise.resolve(cb(text)));
		}

		// Call onAll callbacks with collected texts; only invoke when at least one non-empty item exists.
		for (const [cb, { allText }] of this.#onAllTextCbTrackingMap) {
			const nonEmpty = allText.filter(Boolean);
			if (nonEmpty.length) promises.push(Promise.resolve(cb(nonEmpty)));
		}

		await Promise.all(promises);
	}
}
