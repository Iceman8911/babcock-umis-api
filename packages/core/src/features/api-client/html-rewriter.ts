import type { Result } from "../../models/types/result";
import * as features from "../index";
import HTMLRewriterHTMLParser from "../parsers/html-rewriter";
import type { ScrapedPersonalDetailsOutput } from "../personal-details/schema";
import type { ResolvedSchoolDetails } from "../school-info/schema";
import type {
	ResolvedSemesterResultSummaries,
	ResolvedSingleSemesterResults,
} from "../semester-result/schema";
import type { ApiClientGetSemesterResultArg } from "./shared";
import UmisApiStudentClient from "./umis-api-client";

export class HtmlRewriterUmisApiStudentClient extends UmisApiStudentClient {
	override async getPersonalDetails(): Promise<
		Result<ScrapedPersonalDetailsOutput, string>
	> {
		return features.getPersonalDetails({
			cookie: await this._getCookie(),
			parserConstructor: HTMLRewriterHTMLParser,
		});
	}

	override async getSchoolDetails(): Promise<
		Result<ResolvedSchoolDetails, string>
	> {
		return features.getSchoolDetails({
			cookie: await this._getCookie(),
			parserConstructor: HTMLRewriterHTMLParser,
		});
	}
	override async getSemesterResultSummaries(): Promise<
		Result<ResolvedSemesterResultSummaries, string>
	> {
		return features.getSemesterResultSummaries({
			cookie: await this._getCookie(),
			parserConstructor: HTMLRewriterHTMLParser,
		});
	}

	override async getSingleSemesterResults(
		arg: ApiClientGetSemesterResultArg,
	): Promise<Result<ResolvedSingleSemesterResults, string>> {
		let link: string;

		if (arg.type === "link") {
			link = arg.link;
		} else {
			const allSemesterResults = await this.getSemesterResultSummaries();

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

		return features.getSingleSemesterResults({
			cookie: await this._getCookie(),
			link,
			parserConstructor: HTMLRewriterHTMLParser,
		});
	}
}
