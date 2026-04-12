import type { Result } from "../../models/types/result";
import * as features from "../index";
import NodeHTMLParser from "../parsers/node-html-parser";
import type { ScrapedPersonalDetailsOutput } from "../personal-details/schema";
import type { ResolvedSchoolInfo } from "../school-info/schema";
import type { ResolvedAllSemesterResultsSummary } from "../semester-result/schema";
import UmisApiStudentClient from "./umis-api-client";

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

	override async getAllSemesterResultsSummary(): Promise<
		Result<ResolvedAllSemesterResultsSummary, string>
	> {
		return features.getAllSemesterResultsSummary({
			cookie: await this._getCookie(),
			parserConstructor: NodeHTMLParser,
		});
	}
}
