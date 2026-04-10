import * as v from "valibot";
import { getFetchHeaders } from "../constants/fetch";
import { UmisPage } from "../constants/umis-pages";
import {
	type UserLoginCookieOutput,
	UserLoginCookieSchema,
} from "../models/cookie";
import {
	type StudentCredentialsInput,
	StudentCredentialsSchema,
} from "../models/credentials";
import type { Result } from "../models/result.types";
import { getErrorMessage } from "../utils/error";
import { doesStudentExist } from "./check-user";

/** Returns the cookies if the user is logged in*/
export async function attemptStudentLogin(
	credentials: Readonly<StudentCredentialsInput>,
): Promise<Result<UserLoginCookieOutput, string>> {
	try {
		const parsedCredentials = v.parse(StudentCredentialsSchema, credentials);

		const studentExistenceResult = await doesStudentExist(
			parsedCredentials.j_username,
		);

		if (!studentExistenceResult.success) return studentExistenceResult;

		// Fetch the login page to get the JSESSIONID cookie, which is required for the login request
		const loginPageResponse = await fetch(UmisPage.Login, {
			headers: getFetchHeaders({ type: "head" }),
			method: "HEAD",
		});

		const loginPageCookies = v.parse(
			UserLoginCookieSchema,
			loginPageResponse.headers.get("set-cookie"),
		);

		const request = new Request(UmisPage.SecurityCheck, {
			body: new URLSearchParams(parsedCredentials),
			headers: getFetchHeaders({
				cookie: loginPageCookies.JSESSIONID,
				referrer: UmisPage.Dashboard,
				type: "post",
			}),
			method: "POST",
		});

		const res = await fetch(request);

		return res.ok
			? {
					success: true,
					val: v.parse(UserLoginCookieSchema, res.headers.get("set-cookie")),
				}
			: { err: "Login failed", success: false };
	} catch (e) {
		return { err: getErrorMessage(e), success: false };
	}
}
