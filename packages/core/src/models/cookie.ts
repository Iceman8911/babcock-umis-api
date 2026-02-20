import * as v from "valibot";

const JSESSIONID_REGEX = /(?<=JSESSIONID=)\S+(?=;)/;
const PATH_REGEX = /(?<=Path=)\S+(?=;)/;

const UserLoginCookieObjectSchema = v.object({
	HttpOnly: v.boolean(),
	JSESSIONID: v.string(),
	Path: v.string(),
	Secure: v.boolean(),
});

export const UserLoginCookieSchema = v.pipe(
	v.string(),
	v.transform((cookies) => {
		const lowerCaseCookies = cookies.toLowerCase();

		const cleanedcookies = {
			HttpOnly: !!lowerCaseCookies.includes("httponly"),
			JSESSIONID: cookies.match(JSESSIONID_REGEX)?.[0],
			Path: cookies.match(PATH_REGEX)?.[0],
			Secure: !!lowerCaseCookies?.includes("secure"),
		} as const satisfies Partial<
			v.InferOutput<typeof UserLoginCookieObjectSchema>
		>;

		return cleanedcookies;
	}),
	UserLoginCookieObjectSchema,
	v.readonly(),
);
/** "JSESSIONID=8EFA9F7F484CC60BB99BC7E34838B98C; Path=/babcock; Secure; HttpOnly" */
export type UserLoginCookieInput = v.InferInput<typeof UserLoginCookieSchema>;
export type UserLoginCookieOutput = v.InferOutput<typeof UserLoginCookieSchema>;
