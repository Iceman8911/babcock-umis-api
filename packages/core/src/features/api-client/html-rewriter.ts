import type { Result } from "../../models/types/result";
import * as features from "../index";
import HTMLRewriterHTMLParser from "../parsers/html-rewriter";
import type { ScrapedPersonalDetailsOutput } from "../personal-details/schema";
import type { ResolvedSchoolInfo } from "../school-info/schema";
import type {
	ResolvedAllSemesterResultsSummary,
	ResolvedSemesterResult,
} from "../semester-result/schema";
import type { ApiClientGetSemesterResultArg } from "./shared";
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
	override async getAllSemesterResultsSummary(): Promise<
		Result<ResolvedAllSemesterResultsSummary, string>
	> {
		return features.getAllSemesterResultsSummary({
			cookie: await this._getCookie(),
			parserConstructor: HTMLRewriterHTMLParser,
		});
	}

	override async getSemesterResult(
		arg: ApiClientGetSemesterResultArg,
	): Promise<Result<ResolvedSemesterResult, string>> {
		let link: string;

		if (arg.type === "link") {
			link = arg.link;
		} else {
			const allSemesterResults = await this.getAllSemesterResultsSummary();

			if (!allSemesterResults.success) return allSemesterResults;

			const found = allSemesterResults.val.find(
				(res) => res.session === arg.session,
			);

			if (!found)
				return {
					err: `No semester result found for student ${this._creds.user} in session ${arg.session}`,
					success: false,
				};

			link = found.link;
		}

		return features.getSemesterResult({
			cookie: await this._getCookie(),
			link,
			parserConstructor: HTMLRewriterHTMLParser,
		});
	}
}
