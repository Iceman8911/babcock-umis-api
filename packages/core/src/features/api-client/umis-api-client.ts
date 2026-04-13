/** biome-ignore-all lint/complexity/noThisInStatic: <I use `this` to refer to any implementation's constructor, rather than the class itself> */

import type { StudentCredentialsInput } from "../../models/schemas/credentials";
import type { Result } from "../../models/types/result";
import { checkListings } from "../check-listing";
import type { ResolvedCheckListings } from "../check-listing/schema";
import { isStudentValid } from "../check-user";
import type { VerifiedStudentResponseOutput } from "../check-user/schema";
import { attemptStudentLogin } from "../login";
import type HTMLParser from "../parsers/html-parser";
import { getPersonalDetails } from "../personal-details";
import type { ResolvedPersonalDetails } from "../personal-details/schema";
import { getSchoolDetails } from "../school-info";
import type { ResolvedSchoolDetails } from "../school-info/schema";
import { getSemesterResultSummaries } from "../semester-result/get-semester-result-summaries";
import { getSingleSemesterResults } from "../semester-result/get-single-semester-results";
import type {
	ResolvedSemesterResultSummaries,
	ResolvedSingleSemesterResults,
} from "../semester-result/schema";
import type {
	DynamicUmisGetterProps,
	StaticUmisGetterProps,
} from "../shared/_shared";
import type { ApiClientGetSemesterResultArg } from "./shared";

/** A client for a single student */
export default abstract class UmisApiStudentClient {
	/** Cookie cache that must be refreshed every 15 minutes */
	#cookie: string | null = null;
	#timeSinceLastCookieRefresh = Date.now();

	/** 15 minutes */
	readonly #cookieExpiryMs: number;

	protected readonly _creds: StudentCredentialsInput;

	protected abstract _parser: typeof HTMLParser;

	constructor(
		credentials: StudentCredentialsInput,
		cookieExpiryMs = 1000 * 60 * 15,
	) {
		this._creds = credentials;
		this.#cookieExpiryMs = cookieExpiryMs;
	}

	async #getNewCookie(): Promise<string> {
		const loginRes = await attemptStudentLogin(this._creds);

		if (!loginRes.success) {
			throw Error(loginRes.err);
		}

		return loginRes.val.JSESSIONID;
	}

	protected async _getCookie(): Promise<string> {
		const now = Date.now();

		if (
			!this.#cookie ||
			this.#timeSinceLastCookieRefresh + this.#cookieExpiryMs < now
		) {
			this.#cookie = await this.#getNewCookie();
			this.#timeSinceLastCookieRefresh = now;
		}

		return this.#cookie;
	}

	async #getStaticUmisGetterProps(): Promise<StaticUmisGetterProps> {
		return {
			cookie: await this._getCookie(),
			parserConstructor: this._parser,
		};
	}

	async #getDynamicUmisGetterProps(
		link: string,
	): Promise<DynamicUmisGetterProps> {
		return {
			...(await this.#getStaticUmisGetterProps()),
			link,
		};
	}

	isStudentValid(): Promise<Result<VerifiedStudentResponseOutput, string>> {
		return isStudentValid(this._creds.user);
	}

	/** Returns the public student bio */
	async getPersonalDetails(): Promise<Result<ResolvedPersonalDetails, string>> {
		return getPersonalDetails(await this.#getStaticUmisGetterProps());
	}

	/** Returns a list of the available schools and links to their umis pages */
	async getSchoolDetails(): Promise<Result<ResolvedSchoolDetails, string>> {
		return getSchoolDetails(await this.#getStaticUmisGetterProps());
	}

	/** Returns a summary of all the semester results for the student. */
	async getSemesterResultSummaries(): Promise<
		Result<ResolvedSemesterResultSummaries, string>
	> {
		return getSemesterResultSummaries(await this.#getStaticUmisGetterProps());
	}

	/** Returns the listings for the student. */
	async checkListings(): Promise<Result<ResolvedCheckListings, string>> {
		return checkListings(await this.#getStaticUmisGetterProps());
	}

	/** Returns the grades of all the courses within a single semester */
	async getSingleSemesterResults(
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

		return getSingleSemesterResults(
			await this.#getDynamicUmisGetterProps(link),
		);
	}

	/** Returns the grades of all courses of all the semesters  */
	async getAllSemesterResults(): Promise<
		Result<ResolvedSingleSemesterResults, string>
	> {
		const allSemesterResultsSummaryRes =
			await this.getSemesterResultSummaries();

		if (!allSemesterResultsSummaryRes.success)
			return allSemesterResultsSummaryRes;

		const results: Array<ResolvedSingleSemesterResults[number]> = [];

		/** This has to be done sequentially since a single cookie is shared between all the requests. */
		for (const { link } of allSemesterResultsSummaryRes.val) {
			const semesterResultRes = await this.getSingleSemesterResults({
				link,
				type: "link",
			});

			if (!semesterResultRes.success) return semesterResultRes;

			results.push(...semesterResultRes.val);
		}

		return { success: true, val: results };
	}
}
