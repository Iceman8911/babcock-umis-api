import { type HTMLElement as ParsedHTMLElement, parse } from "node-html-parser";
import HTMLParser from "./html-parser";

export default class NodeHTMLParser extends HTMLParser {
	#pseudoDom: ParsedHTMLElement;

	constructor(psuedoDom: ParsedHTMLElement) {
		super();

		this.#pseudoDom = psuedoDom;
	}

	static override async init(htmlRes: Response): Promise<NodeHTMLParser> {
		const root = parse(await htmlRes.text());

		return new NodeHTMLParser(root);
	}

	override async process(): Promise<void> {
		await Promise.all(
			this.cbs.map(async ({ cb, css, isOne }) => {
				if (isOne) {
					const possibleText = this.#pseudoDom
						.querySelector(css)
						?.textContent.trim();

					if (possibleText) return cb(possibleText);
				} else {
					const possibleTexts: string[] = [];

					for (const ele of this.#pseudoDom.querySelectorAll(css)) {
						const trimmed = ele.textContent.trim();

						if (trimmed) possibleTexts.push(trimmed);
					}

					return cb(possibleTexts);
				}
			}),
		);
	}
}
