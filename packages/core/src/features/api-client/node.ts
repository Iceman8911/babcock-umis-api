import NodeHTMLParser from "../parsers/node-html-parser";
import UmisApiStudentClient from "./umis-api-client";

export class NodeUmisApiStudentClient extends UmisApiStudentClient {
	protected override _parser = NodeHTMLParser;
}
