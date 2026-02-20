import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { UserLoginCookieSchema } from "./cookie";

const COOKIE =
	"JSESSIONID=8EFA9F7F484CC60BB99BC7E34838B98C; Path=/babcock; Secure; HttpOnly";

describe("User Login Cookie Schema", () => {
	it("should properly parse cookies from a header entry", () => {
		expect(() => v.parse(UserLoginCookieSchema, COOKIE)).not.toThrow();

		expect(v.parse(UserLoginCookieSchema, COOKIE)).toEqual({
			HttpOnly: true,
			JSESSIONID: "8EFA9F7F484CC60BB99BC7E34838B98C",
			Path: "/babcock",
			Secure: true,
		});
	});
});
