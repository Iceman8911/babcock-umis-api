interface FetchHeaders {
	cookie?: string;
	referrer?: string;
	type: "post" | "get" | "head";
}

export const getFetchHeaders = ({ type, cookie, referrer }: FetchHeaders) =>
	Object.assign(
		{
			accept: "*/*",
			"accept-encoding": "gzip",
			"accept-language": "en-US,en;q=0.9",
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
			"user-agent":
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0",
		},
		type === "post"
			? { "content-type": "application/x-www-form-urlencoded" }
			: null,
		referrer ? { Referer: referrer } : null,
		cookie ? { cookie: `JSESSIONID=${cookie}` } : null,
	);
