interface FetchHeaders {
	cookie?: string;
	type: "post" | "get" | "head";
	referrer?: string;
}

export const getFetchHeaders = ({ type, cookie, referrer }: FetchHeaders) =>
	Object.assign(
		{
			accept: "*/*",
			"accept-language": "en-US,en;q=0.9",
			cookie: `JSESSIONID=${cookie}`,
			Host: "umis.babcock.edu.ng",
			Origin: "https://umis.babcock.edu.ng",
			"save-data": "on",
			"sec-ch-ua":
				'"Not(A:Brand";v="8", "Chromium";v="144", "Microsoft Edge";v="144"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Linux"',
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
		},
		type === "post"
			? { "content-type": "application/x-www-form-urlencoded" }
			: null,
		referrer ? { Referer: referrer } : null,
	);
