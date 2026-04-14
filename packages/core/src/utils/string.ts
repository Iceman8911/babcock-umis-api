const WHITESPACE_REGEX = /\s+/g;

export const normalizeStringToCapitalCase = (str: string) =>
	str
		.trim()
		.split(WHITESPACE_REGEX)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
