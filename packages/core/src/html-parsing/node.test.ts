import { beforeEach, describe, expect, it } from "bun:test";
import { _SAMPLE_HTML_RESPONSE } from "./_shared";
import NodeHTMLParser from "./node";

let testHtmlResponse = _SAMPLE_HTML_RESPONSE.clone();

beforeEach(() => {
	testHtmlResponse = _SAMPLE_HTML_RESPONSE.clone();
});

describe(NodeHTMLParser.name, () => {
	it("should extract the text content of html", async () => {
		const parser = await NodeHTMLParser.init(testHtmlResponse);

		let firstParagraphContent = "";

		await parser
			.onOne("p", (text) => {
				firstParagraphContent = text;
			})
			.process();

		expect(firstParagraphContent).toBe(
			"This domain is for use in documentation examples without needing permission. Avoid use in operations.",
		);
	});

	it("should extract the <h1> heading text", async () => {
		const parser = await NodeHTMLParser.init(testHtmlResponse);

		let heading = "";
		await parser
			.onOne("h1", (text) => {
				heading = text;
			})
			.process();

		expect(heading).toBe("Example Domain");
	});

	it("should extract all <p> paragraph texts", async () => {
		const parser = await NodeHTMLParser.init(testHtmlResponse);

		let paragraphs: string[] = [];
		await parser
			.onAll("p", (texts) => {
				paragraphs = texts.slice();
			})
			.process();

		expect(paragraphs).toEqual([
			"This domain is for use in documentation examples without needing permission. Avoid use in operations.",
			"Learn more",
		]);
	});

	it("should extract the <a> anchor text inside <p>", async () => {
		const parser = await NodeHTMLParser.init(testHtmlResponse);

		let anchorText = "";
		await parser
			.onOne("a", (text) => {
				anchorText = text;
			})
			.process();

		expect(anchorText).toBe("Learn more");
	});

	it("should extract all <li> list item texts", async () => {
		const parser = await NodeHTMLParser.init(testHtmlResponse);

		let items: string[] = [];
		await parser
			.onAll("li", (texts) => {
				items = texts.slice();
			})
			.process();

		expect(items).toEqual(["First item", "Second item", "Third item"]);
	});

	it("should extract <label> and <button> text in the form", async () => {
		const parser = await NodeHTMLParser.init(testHtmlResponse);

		let labelText = "";
		let buttonText = "";
		await parser
			.onOne("label", (text) => {
				labelText = text;
			})
			.onOne("button", (text) => {
				buttonText = text;
			})
			.process();

		expect(labelText).toBe("Input:");
		expect(buttonText).toBe("Submit");
	});

	it("should return undefined or empty for non-existent selector", async () => {
		const parser = await NodeHTMLParser.init(testHtmlResponse);

		let result = "not-called";
		await parser
			.onOne(".does-not-exist", (text) => {
				result = text;
			})
			.process();

		// Callback should not be called, so result remains unchanged
		expect(result).toBe("not-called");
	});

	it("should not extract <img> alt text since only textContent is supported", async () => {
		const parser = await NodeHTMLParser.init(testHtmlResponse);

		let imgText = "not-called";
		await parser
			.onOne("img", (text) => {
				imgText = text;
			})
			.process();

		// <img> has no textContent, so callback should not be called
		expect(imgText).toBe("not-called");
	});
});
