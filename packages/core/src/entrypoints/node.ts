import UmisApiStudentClient from "../features/api-client/umis-api-client";
import * as features from "../features/index";
import NodeHTMLParser from "../features/parsers/node-html-parser";
import type { ScrapedPersonalDetailsOutput } from "../features/personal-details/schema";
import type { ResolvedSchoolInfo } from "../features/school-info/schema";
import type { Result } from "../models/types/result";

export class NodeUmisApiStudentClient extends UmisApiStudentClient {
	override async getPersonalInfo(): Promise<
		Result<ScrapedPersonalDetailsOutput, string>
	> {
		return features.getPersonalDetails({
			cookie: await this._getCookie(),
			parserConstructor: NodeHTMLParser,
		});
	}

	override async getSchoolInfo(): Promise<
		Result<ResolvedSchoolInfo[], string>
	> {
		return features.getSchoolDetails({
			cookie: await this._getCookie(),
			parserConstructor: NodeHTMLParser,
		});
	}
}
