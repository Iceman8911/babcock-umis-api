import HTMLParser from "../models/html-parser";

const domParser = new DOMParser();

export default class BrowserHTMLParser extends HTMLParser {
	#dom: Document;

	constructor(dom: Document) {
		super();
		this.#dom = dom;
	}

	static override async init(htmlRes: Response): Promise<BrowserHTMLParser> {
		return new BrowserHTMLParser(
			domParser.parseFromString(await htmlRes.text(), "text/html"),
		);
	}

	override async process(): Promise<void> {
		await Promise.all(
			this.cbs.map(async ({ cb, css, isOne }) => {
				if (isOne) {
					const possibleText = this.#dom.querySelector(css)?.textContent.trim();

					if (possibleText) return cb(possibleText);
				} else {
					const possibleTexts: string[] = [];

					for (const ele of this.#dom.querySelectorAll(css)) {
						const trimmed = ele.textContent.trim();

						if (trimmed) possibleTexts.push(trimmed);
					}

					return cb(possibleTexts);
				}
			}),
		);
	}
}
