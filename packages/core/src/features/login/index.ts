import * as v from "valibot";
import { getFetchHeaders } from "../../constants/fetch";
import { UmisPage } from "../../constants/umis-pages";
import {
	type StudentCredentialsInput,
	StudentCredentialsSchema,
} from "../../models/schemas/credentials";
import type { Result } from "../../models/types/result";
import { getErrorMessage } from "../../utils/error";
import {
	type UserLoginCookieOutput,
	UserLoginCookieSchema,
} from "../auth/schemas/cookie";
import { isStudentValid } from "../check-user";

/** Returns the cookies if the user is logged in.
 *
 * Flow:
 *
 * Get cookie from login page -> Use cookie and credentials to attempt login -> If login is successful, return the cookies from the response
 */
export async function attemptStudentLogin(
	credentials: Readonly<StudentCredentialsInput>,
): Promise<Result<UserLoginCookieOutput, string>> {
	try {
		const parsedCredentials = v.parse(StudentCredentialsSchema, credentials);

		const studentExistenceResult = await isStudentValid(
			parsedCredentials.j_username,
		);

		if (!studentExistenceResult.success) return studentExistenceResult;

		// Fetch the login page to get the JSESSIONID cookie, which is required for the login request
		const loginPageResponse = await fetch(UmisPage.Login, {
			headers: getFetchHeaders({ type: "get" }),
			method: "GET",
		});

		if (!loginPageResponse.ok)
			return {
				err: `Failed to fetch login page: ${loginPageResponse.status} ${loginPageResponse.statusText}`,
				success: false,
			};

		const loginPageSetCookie = loginPageResponse.headers.get("set-cookie");

		if (!loginPageSetCookie)
			return {
				err: "Login page did not return an initial session cookie",
				success: false,
			};

		const loginPageCookies = v.parse(UserLoginCookieSchema, loginPageSetCookie);

		// This should return a redirect to the authenticated dashboard
		const { status, headers } = await fetch(UmisPage.SecurityCheck, {
			body: new URLSearchParams(parsedCredentials),
			headers: getFetchHeaders({
				cookie: loginPageCookies.JSESSIONID,
				referrer: UmisPage.Login,
				type: "post",
			}),
			method: "POST",
			redirect: "manual",
		});

		if (!(status >= 300 && status < 400)) {
			return {
				err: `Invalid credentials or cookie; expected redirect but got ${status}`,
				success: false,
			};
		}

		const authenticatedCookie = headers.get("set-cookie");

		if (!authenticatedCookie)
			return {
				err: "Login succeeded but authenticated cookie was not returned",
				success: false,
			};

		return {
			success: true,
			val: v.parse(UserLoginCookieSchema, authenticatedCookie),
		};
	} catch (e) {
		return { err: getErrorMessage(e), success: false };
	}
}
