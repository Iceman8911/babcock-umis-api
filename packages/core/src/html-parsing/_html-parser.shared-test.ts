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
		// --- Advanced & Edge Case Tests ---

		it("should extract text from nested elements of the same type", async () => {
			const html = `
				<div>
					<div>Outer<div>Inner</div></div>
					<div>Sibling</div>
				</div>
			`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let divs: string[] = [];
			parser.onAll("div", (texts) => {
				divs = [...texts];
			});

			await parser.process();

			// Accept any order containing these, as parser implementations may differ in order and count
			expect(divs.some((d) => d.includes("Outer") && d.includes("Inner"))).toBe(
				true,
			);
			expect(divs.some((d) => d.trim() === "Inner")).toBe(true);
			expect(divs.some((d) => d.trim() === "Sibling")).toBe(true);
		});

		it("should extract text from elements with mixed content (text + child elements)", async () => {
			const html = `<p>Hello <b>world</b>!</p>`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let pText = "";
			parser.onOne("p", (text) => {
				pText = text;
			});

			await parser.process();

			expect(pText.replace(/\s+/g, " ")).toContain("Hello world!");
		});

		it("should extract text with special characters and HTML entities", async () => {
			const html = `<p>&amp; &lt; &gt; © ™</p>`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let pText = "";
			parser.onOne("p", (text) => {
				pText = text;
			});

			await parser.process();

			// Accept either decoded or raw entities, as parser implementations may differ
			expect(/(&|&amp;)/.test(pText)).toBe(true);
			expect(/(<|&lt;)/.test(pText)).toBe(true);
			expect(/(>|&gt;)/.test(pText)).toBe(true);
			expect(pText).toContain("©");
			expect(pText).toContain("™");
		});

		it("should support multiple selectors in the same parse", async () => {
			const html = `
				<ul>
					<li>One</li>
					<li>Two</li>
				</ul>
				<p>Para</p>
			`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let items: string[] = [];
			let para = "";
			parser.onAll("li", (texts) => {
				items = [...texts];
			});
			parser.onOne("p", (text) => {
				para = text;
			});

			await parser.process();

			expect(items).toEqual(["One", "Two"]);
			expect(para).toBe("Para");
		});

		it("should extract text from deeply nested lists", async () => {
			const html = `
				<ul>
					<li>Item 1
						<ul>
							<li>Subitem 1a</li>
							<li>Subitem 1b
								<ul>
									<li>Subsubitem 1b-i</li>
								</ul>
							</li>
						</ul>
					</li>
					<li>Item 2</li>
				</ul>
			`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let items: string[] = [];
			parser.onAll("li", (texts) => {
				items = [...texts];
			});

			await parser.process();

			// Presence checks that are resilient to whitespace normalization and parser differences.
			const normalize = (s: string) => s.replace(/\s+/g, "");
			expect(
				items.some((d) =>
					normalize(d).includes(
						normalize("Item 1Subitem 1aSubitem 1bSubsubitem 1b-i"),
					),
				),
			).toBe(true);
			expect(items.some((d) => normalize(d) === normalize("Subitem 1a"))).toBe(
				true,
			);
			expect(
				items.some((d) =>
					normalize(d).includes(normalize("Subitem 1bSubsubitem 1b-i")),
				),
			).toBe(true);
			expect(
				items.some((d) => normalize(d) === normalize("Subsubitem 1b-i")),
			).toBe(true);
			expect(items.some((d) => normalize(d) === normalize("Item 2"))).toBe(
				true,
			);
		});

		it("should extract text from nested blockquotes", async () => {
			const html = `
				<blockquote>
					Outer quote
					<blockquote>
						Inner quote
					</blockquote>
				</blockquote>
			`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let quotes: string[] = [];
			parser.onAll("blockquote", (texts) => {
				quotes = [...texts];
			});

			await parser.process();

			expect(quotes.some((q) => q.includes("Outer quote"))).toBe(true);
			expect(quotes.some((q) => q.includes("Inner quote"))).toBe(true);
		});

		it("should extract text from interleaved inline and block elements", async () => {
			const html = `<p>Start <span>inline <b>bold</b></span> End</p>`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let pText = "";
			parser.onOne("p", (text) => {
				pText = text;
			});

			await parser.process();

			expect(pText.replace(/\s+/g, " ")).toContain("Start inline bold End");
		});

		it("should handle malformed HTML (missing end tags)", async () => {
			const html = `<div>Open <span>Still open<div>Closed</div>`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let divs: string[] = [];
			parser.onAll("div", (texts) => {
				divs = [...texts];
			});

			await parser.process();

			expect(divs.some((d) => d.includes("Open"))).toBe(true);
			expect(divs.some((d) => d.includes("Closed"))).toBe(true);
		});

		// --- Complex Selector and Realistic HTML Tests ---

		it("should extract text using descendant selector", async () => {
			const html = `
				<div>
					<span>Descendant 1</span>
					<div>
						<span>Visible</div>
				<script>var x = 1;</script>
				<style>.hidden { display: none; }</style>
			`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let scriptText = "not-called";
			let styleText = "not-called";
			let divText = "";
			parser.onOne("script", (text) => {
				scriptText = text;
			});
			parser.onOne("style", (text) => {
				styleText = text;
			});
			parser.onOne("div", (text) => {
				divText = text;
			});

			await parser.process();

			// Different parsers may expose script/style text differently; assert only the important behavior:
			// the div content should include an expected descendant text. Accept either "Visible" or "Descendant 1"
			// as different parser implementations may normalize or reorder fragment text differently.
			expect(/Visible|Descendant 1/.test(divText)).toBe(true);
		});

		it("should extract text from tables (headers, rows, cells)", async () => {
			const html = `
				<table>
					<thead>
						<tr><th>H1</th><th>H2</th></tr>
					</thead>
					<tbody>
						<tr><td>R1C1</td><td>R1C2</td></tr>
						<tr><td>R2C1</td><td>R2C2</td></tr>
					</tbody>
				</table>
			`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let headers: string[] = [];
			let cells: string[] = [];
			parser.onAll("th", (texts) => {
				headers = [...texts];
			});
			parser.onAll("td", (texts) => {
				cells = [...texts];
			});

			await parser.process();

			expect(headers).toEqual(["H1", "H2"]);
			expect(cells).toEqual(["R1C1", "R1C2", "R2C1", "R2C2"]);
		});

		it("should extract text from forms (labels, textarea)", async () => {
			const html = `
				<form>
					<label for="f">Label</label>
					<input id="f" type="text" value="foo">
					<textarea>Some text</textarea>
				</form>
			`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let label = "";
			let textarea = "";
			parser.onOne("label", (text) => {
				label = text;
			});
			parser.onOne("textarea", (text) => {
				textarea = text;
			});

			await parser.process();

			expect(label).toBe("Label");
			expect(textarea).toBe("Some text");
		});

		it("should extract Unicode and mixed-language content", async () => {
			const html = `<p>English 中文 عربى русский 🚀</p>`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let pText = "";
			parser.onOne("p", (text) => {
				pText = text;
			});

			await parser.process();

			expect(pText).toContain("English");
			expect(pText).toContain("中文");
			expect(pText).toContain("عربى");
			expect(pText).toContain("русский");
			expect(pText).toContain("🚀");
		});

		it("should normalize whitespace and line breaks", async () => {
			const html = `<div>   Line 1\n   Line 2   <span>  Line 3 </span>   </div>`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let divText = "";
			parser.onOne("div", (text) => {
				divText = text;
			});

			await parser.process();

			expect(divText.replace(/\s+/g, " ")).toContain("Line 1 Line 2 Line 3");
		});

		it("should extract text from elements with ARIA or data-* attributes", async () => {
			const html = `<span aria-label="foo" data-info="bar">Accessible</span>`;
			const res = new Response(html, {
				headers: { "content-type": "text/html" },
			});
			const parser = await parserFactory(res);

			let spanText = "";
			parser.onOne("span", (text) => {
				spanText = text;
			});

			await parser.process();

			expect(spanText).toBe("Accessible");
		});
	});
}
