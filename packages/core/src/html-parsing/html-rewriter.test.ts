import { runHTMLParserSharedTests } from "./_html-parser.shared-test";
import HTMLRewriterHTMLParser from "./html-rewriter";

runHTMLParserSharedTests(HTMLRewriterHTMLParser.name, (htmlRes) =>
	HTMLRewriterHTMLParser.init(htmlRes),
);
