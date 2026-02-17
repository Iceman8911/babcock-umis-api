import { runHTMLParserSharedTests } from "./_html-parser.shared-test";
import NodeHTMLParser from "./node";

runHTMLParserSharedTests(NodeHTMLParser.name, (htmlRes) =>
	NodeHTMLParser.init(htmlRes),
);
