import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type HTMLParser from "../models/html-parser";
import { _SAMPLE_HTML_RESPONSE } from "./_shared";

/**
 * Shared test suite for HTML parsers.
 * @param parserName - Name of the parser (for describe block)
 * @param parserFactory - Function that returns a Promise of a parser instance given a Response
 * @param options - Optional setup/teardown hooks
 */
export function runHTMLParserSharedTests(
	parserName: string,
	parserFactory: (htmlRes: Response) => Promise<HTMLParser>,
	options?: {
		beforeEachHook?: () => void | Promise<void>;
		afterEachHook?: () => void | Promise<void>;
	},
): void {
	let testHtmlResponse = _SAMPLE_HTML_RESPONSE.clone();

	beforeEach(() => {
		testHtmlResponse = _SAMPLE_HTML_RESPONSE.clone();
		if (options?.beforeEachHook) {
			return options.beforeEachHook();
		}
	});

	if (options?.afterEachHook) {
		afterEach(options.afterEachHook);
	}

	describe(parserName, () => {
		it("should extract the text content of html", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let firstParagraphContent = "";

			await parser
				.onOne("p", (text: string) => {
					firstParagraphContent = text;
				})
				.process();

			expect(firstParagraphContent).toBe(
				"This domain is for use in documentation examples without needing permission. Avoid use in operations.",
			);
		});

		it("should extract the <h1> heading text", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let heading = "";
			await parser
				.onOne("h1", (text: string) => {
					heading = text;
				})
				.process();

			expect(heading).toBe("Example Domain");
		});

		it("should extract all <p> paragraph texts", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let paragraphs: string[] = [];
			await parser
				.onAll("p", (texts: ReadonlyArray<string>) => {
					paragraphs = texts.slice();
				})
				.process();

			expect(paragraphs).toEqual([
				"This domain is for use in documentation examples without needing permission. Avoid use in operations.",
				"Learn more",
				"Nested",
			]);
		});

		it("should extract the <a> anchor text inside <p>", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let anchorText = "";
			await parser
				.onOne("a", (text: string) => {
					anchorText = text;
				})
				.process();

			expect(anchorText).toBe("Learn more");
		});

		it("should extract all <li> list item texts", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let items: string[] = [];
			await parser
				.onAll("li", (texts: ReadonlyArray<string>) => {
					items = texts.slice();
				})
				.process();

			expect(items).toEqual(["First item", "Second item", "Third item"]);
		});

		it("should extract <label> and <button> text in the form", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let labelText = "";
			let buttonText = "";
			await parser
				.onOne("label", (text: string) => {
					labelText = text;
				})
				.onOne("button", (text: string) => {
					buttonText = text;
				})
				.process();

			expect(labelText).toBe("Input:");
			expect(buttonText).toBe("Submit");
		});

		it("should return undefined or empty for non-existent selector", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let result = "not-called";
			await parser
				.onOne(".does-not-exist", (text: string) => {
					result = text;
				})
				.process();

			// Callback should not be called, so result remains unchanged
			expect(result).toBe("not-called");
		});

		it("should not extract <img> alt text since only textContent is supported", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let imgText = "not-called";
			await parser
				.onOne("img", (text: string) => {
					imgText = text;
				})
				.process();

			// <img> has no textContent, so callback should not be called
			expect(imgText).toBe("not-called");
		});

		it("should extract the textContent of a parent <div> (which consists of its descendants)", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let divText = "";
			await parser
				.onOne("div#foo", (text) => {
					divText = text;
				})
				.process();

			expect(divText).not.toBeEmpty();
			expect(divText).toInclude("Top-Level");
			expect(divText).toInclude("Nested");
			expect(divText).toInclude("Another Nested");
		});

		it("should extract the textContent of all 4 <div>s even though some are nested", async () => {
			const parser = await parserFactory(testHtmlResponse);

			let divTexts: string[] = [];
			await parser
				.onAll("div", (texts) => {
					divTexts = [...texts];
				})
				.process();

			const valsToCheck = ["Top-Level", "Nested", "Another Nested"] as const;

			expect(divTexts).not.toBeEmpty();
			expect(divTexts).toHaveLength(4);
			expect(
				divTexts.filter((text) =>
					valsToCheck.some((val) => text.includes(val)),
				),
			).toHaveLength(4);
		});
	});
}
