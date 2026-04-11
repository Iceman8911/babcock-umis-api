import * as v from "valibot";
import { getFetchHeaders } from "../constants/fetch";
import { UmisPage } from "../constants/umis-pages";
import type HTMLParser from "../models/classes/html-parser";
import type { StudentCredentialsInput } from "../models/schemas/credentials";
import {
	type PersonalDetailsInput,
	type PersonalDetailsOutput,
	PersonalDetailsSchema,
} from "../models/schemas/personal-details";
import type { Result } from "../models/types/result";
import { getErrorMessage } from "../utils/error";
import { attemptStudentLogin } from "./login";

export const getPersonalDetails = async (
	credentials: Readonly<StudentCredentialsInput>,
	parserConstructor: typeof HTMLParser,
): Promise<Result<PersonalDetailsOutput, string>> => {
	try {
		const loggedInResponse = await attemptStudentLogin(credentials);

		if (!loggedInResponse.success) return loggedInResponse;

		const personalDetailsResponse = await fetch(UmisPage.PersonalDetails, {
			headers: getFetchHeaders({
				cookie: loggedInResponse.val.JSESSIONID,
				referrer: UmisPage.PersonalDetails,
				type: "get",
			}),
		});

		if (!personalDetailsResponse.ok)
			return {
				err: `Failed to fetch personal details page: ${personalDetailsResponse.status} ${personalDetailsResponse.statusText}`,
				success: false,
			};

		const personalDetailsHtml = await personalDetailsResponse.text();

		const parser = await parserConstructor.init(
			new Response(personalDetailsHtml, {
				headers: { "content-type": "text/html;charset=UTF-8" },
			}),
		);

		const elements: PersonalDetailsInput = [];

		parser.onAll("td", (texts) => {
			for (const text of texts) {
				// Skip empty strings
				if (text) elements.push(text);
			}
		});

		await parser.process();

		return { success: true, val: v.parse(PersonalDetailsSchema, elements) };
	} catch (e) {
		return { err: getErrorMessage(e), success: false };
	}
};
