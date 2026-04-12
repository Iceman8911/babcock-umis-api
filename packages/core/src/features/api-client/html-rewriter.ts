import type { Result } from "../../models/types/result";
import * as features from "../index";
import HTMLRewriterHTMLParser from "../parsers/html-rewriter";
import type { ScrapedPersonalDetailsOutput } from "../personal-details/schema";
import type { ResolvedSchoolInfo } from "../school-info/schema";
import type { ResolvedAllSemesterResults } from "../semester-result/schema";
import UmisApiStudentClient from "./umis-api-client";

export class HtmlRewriterUmisApiStudentClient extends UmisApiStudentClient {
	override async getPersonalInfo(): Promise<
		Result<ScrapedPersonalDetailsOutput, string>
	> {
		return features.getPersonalDetails({
			cookie: await this._getCookie(),
			parserConstructor: HTMLRewriterHTMLParser,
		});
	}

	override async getSchoolInfo(): Promise<
		Result<ResolvedSchoolInfo[], string>
	> {
		return features.getSchoolDetails({
			cookie: await this._getCookie(),
			parserConstructor: HTMLRewriterHTMLParser,
		});
	}
	override async getAllSemesterResults(): Promise<
		Result<ResolvedAllSemesterResults, string>
	> {
		return features.getAllSemesterResults({
			cookie: await this._getCookie(),
			parserConstructor: HTMLRewriterHTMLParser,
		});
	}
}
