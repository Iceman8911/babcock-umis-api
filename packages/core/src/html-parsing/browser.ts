import { HTMLParser } from "../models/html-parser";

const domParser = new DOMParser();

export default class BrowserHTMLParser extends HTMLParser {
	#dom: Document;

	constructor(dom: Document) {
		super();
		this.#dom = dom;
	}

	static override async init(htmlRes: Response): Promise<HTMLParser> {
		return new BrowserHTMLParser(
			domParser.parseFromString(await htmlRes.text(), "text/html"),
		);
	}

	override onOne(cssSelector: string, cb: (text: string) => void): HTMLParser {
		this.cbs.push({ cb, css: cssSelector, type: "one" });

		return this;
	}

	override onAll(
		cssSelector: string,
		cb: (texts: ReadonlyArray<string>) => void,
	): HTMLParser {
		this.cbs.push({ cb, css: cssSelector, type: "all" });

		return this;
	}

	override async process(): Promise<void> {
		for (const { cb, css, type } of this.cbs) {
			if (type === "one") {
				const possibleText = this.#dom.querySelector(css)?.textContent.trim();

				if (possibleText) cb(possibleText);
			} else {
				const possibleTexts: string[] = [];

				for (const ele of this.#dom.querySelectorAll(css)) {
					const trimmed = ele.textContent.trim();

					if (trimmed) possibleTexts.push(trimmed);
				}

				cb(possibleTexts);
			}
		}
	}
}
