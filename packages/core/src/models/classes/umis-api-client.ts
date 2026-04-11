/** biome-ignore-all lint/complexity/noThisInStatic: <I use `this` to refer to any implementation's constructor, rather than the class itself> */
import { attemptStudentLogin, isStudentValid } from "../../features";
import type { VerifiedStudentResponseOutput } from "../schemas/check-user";
import type { StudentCredentialsInput } from "../schemas/credentials";
import type { PersonalDetailsOutput } from "../schemas/personal-details";
import type { Result } from "../types/result";

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

	abstract getPersonalDetails(): Promise<Result<PersonalDetailsOutput, string>>;
}
