import { type HTMLElement as ParsedHTMLElement, parse } from "node-html-parser";
import HTMLParser from "../models/html-parser";

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
		for (const { cb, css, isOne } of this.cbs) {
			if (isOne) {
				const possibleText = this.#pseudoDom
					.querySelector(css)
					?.textContent.trim();

				if (possibleText) cb(possibleText);
			} else {
				const possibleTexts: string[] = [];

				for (const ele of this.#pseudoDom.querySelectorAll(css)) {
					const trimmed = ele.textContent.trim();

					if (trimmed) possibleTexts.push(trimmed);
				}

				cb(possibleTexts);
			}
		}
	}
}
