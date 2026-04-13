import HTMLRewriterHTMLParser from "../parsers/html-rewriter";
import UmisApiStudentClient from "./umis-api-client";

export class HtmlRewriterUmisApiStudentClient extends UmisApiStudentClient {
	protected override _parser = HTMLRewriterHTMLParser;
}
