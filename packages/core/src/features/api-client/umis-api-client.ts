/** biome-ignore-all lint/complexity/noThisInStatic: <I use `this` to refer to any implementation's constructor, rather than the class itself> */

import type { StudentCredentialsInput } from "../../models/schemas/credentials";
import type { Result } from "../../models/types/result";
import { attemptStudentLogin, isStudentValid } from "..";
import type { VerifiedStudentResponseOutput } from "../check-user/schema";
import type { ResolvedPersonalDetails } from "../personal-details/schema";
import type { ResolvedSchoolDetails } from "../school-info/schema";
import type {
	ResolvedSemesterResultSummaries,
	ResolvedSingleSemesterResults,
} from "../semester-result/schema";
import type { ApiClientGetSemesterResultArg } from "./shared";

/** A client for a single student */
export default abstract class UmisApiStudentClient {
	/** Cookie cache that must be refreshed every 15 minutes */
	#cookie: string | null = null;
	#timeSinceLastCookieRefresh = Date.now();

	/** 15 minutes */
	readonly #cookieExpiryMs: number;

	protected readonly _creds: StudentCredentialsInput;

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

	isStudentValid(): Promise<Result<VerifiedStudentResponseOutput, string>> {
		return isStudentValid(this._creds.user);
	}

	/** Returns the public student bio */
	abstract getPersonalDetails(): Promise<
		Result<ResolvedPersonalDetails, string>
	>;

	/** Returns a list of the available schools and links to their umis pages */
	abstract getSchoolDetails(): Promise<Result<ResolvedSchoolDetails, string>>;

	/** Returns a summary of all the semester results for the student. */
	abstract getSemesterResultSummaries(): Promise<
		Result<ResolvedSemesterResultSummaries, string>
	>;

	/** Returns the grades of all the courses within a single semester */
	abstract getSingleSemesterResults(
		arg: ApiClientGetSemesterResultArg,
	): Promise<Result<ResolvedSingleSemesterResults, string>>;

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
