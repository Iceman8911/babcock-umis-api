import * as v from "valibot";

export const OutputFormatSchema = v.picklist([
	"json",
	"table",
	"yaml",
] as const);
export type OutputFormat = v.InferOutput<typeof OutputFormatSchema>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const printTable = (data: unknown): void => {
	if (Array.isArray(data) || isRecord(data)) {
		console.table(
			data as Record<string, unknown> | Array<Record<string, unknown>>,
		);
		return;
	}

	console.log(data);
};

const yamlScalar = (value: unknown): string => {
	if (value === null || value === undefined) return "null";
	if (typeof value === "string") {
		return JSON.stringify(value);
	}

	return String(value);
};

const yamlStringify = (value: unknown, indent = ""): string => {
	if (Array.isArray(value)) {
		if (value.length === 0) return "[]";
		return value
			.map((item) => {
				const formatted = yamlStringify(item, `${indent}  `);
				return formatted.includes("\n")
					? `${indent}-\n${formatted}`
					: `${indent}- ${formatted}`;
			})
			.join("\n");
	}

	if (isRecord(value)) {
		const keys = Object.keys(value);
		if (keys.length === 0) return "{}";

		return keys
			.map((key) => {
				const formatted = yamlStringify(value[key], `${indent}  `);
				if (formatted.includes("\n")) {
					return `${indent}${key}:\n${formatted}`;
				}
				return `${indent}${key}: ${formatted}`;
			})
			.join("\n");
	}

	return yamlScalar(value);
};

export const printOutput = (data: unknown, format: OutputFormat): void => {
	// Runtime-validate format choice via valibot
	const validated = v.parse(OutputFormatSchema, format) as OutputFormat;

	switch (validated) {
		case "json":
			console.log(JSON.stringify(data, null, 2));
			return;
		case "yaml":
			console.log(yamlStringify(data));
			return;
		case "table":
			printTable(data);
			return;
		default:
			console.log(JSON.stringify(data, null, 2));
	}
};
