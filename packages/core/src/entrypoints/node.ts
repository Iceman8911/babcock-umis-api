import * as features from "../features/index";
import NodeHTMLParser from "../html-parsing/node";
import UmisApiStudentClient from "../models/classes/umis-api-client";
import type { ScrapedPersonalDetailsOutput } from "../models/schemas/personal-details";
import type { Result } from "../models/types/result";

export class NodeUmisApiStudentClient extends UmisApiStudentClient {
	override async getPersonalDetails(): Promise<
		Result<ScrapedPersonalDetailsOutput, string>
	> {
		return features.getPersonalDetails({
			cookie: await this._getCookie(),
			parserConstructor: NodeHTMLParser,
		});
	}
}
