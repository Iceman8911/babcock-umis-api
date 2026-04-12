import { runHTMLParserSharedTests } from "./_html-parser.shared-test";
import NodeHTMLParser from "./node-html-parser";

runHTMLParserSharedTests(NodeHTMLParser.name, (htmlRes) =>
	NodeHTMLParser.init(htmlRes),
);
