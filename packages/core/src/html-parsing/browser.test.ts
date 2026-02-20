import { afterAll } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { runHTMLParserSharedTests } from "./_html-parser.shared-test";

// Ensure DOM APIs are available for BrowserHTMLParser
GlobalRegistrator.register();

const { default: BrowserHTMLParser } = await import("./browser");

runHTMLParserSharedTests(BrowserHTMLParser.name, (htmlRes) =>
	BrowserHTMLParser.init(htmlRes),
);

afterAll(() => GlobalRegistrator.unregister());
