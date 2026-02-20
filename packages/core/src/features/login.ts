import * as v from "valibot";
import { SHARED_FETCH_HEADERS } from "../constants/fetch";
import { UmisPage } from "../constants/umis-pages";
import {
	type UserLoginCookieOutput,
	UserLoginCookieSchema,
} from "../models/cookie";
import {
	type StudentCredentialsInput,
	StudentCredentialsSchema,
} from "../models/credentials";

/** Returns the cookies if the user is logged in, else `null` */
export async function attemptStudentLogin(
	credentials: StudentCredentialsInput,
): Promise<UserLoginCookieOutput | null> {
	const parsedCredentials = v.parse(StudentCredentialsSchema, credentials);

	const request = new Request(UmisPage.SECURITY_CHECK, {
		body: new URLSearchParams(parsedCredentials),
		credentials: "include",
		headers: {
			...SHARED_FETCH_HEADERS,
			"Content-Type": "application/x-www-form-urlencoded",
			Referer: UmisPage.DASHBOARD,
		},
		method: "POST",
	});

	const res = await fetch(request);

	return res.ok
		? v.parse(UserLoginCookieSchema, res.headers.get("set-cookie"))
		: null;
}
