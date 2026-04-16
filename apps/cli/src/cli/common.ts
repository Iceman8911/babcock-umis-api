import { type Command, createOption } from "commander";
import * as v from "valibot";
import type { OutputFormat } from "./output";
import { CliRuntimeOptionsSchema } from "./schema";

export const cliUsernameOption = createOption(
	"-u, --username <user>",
	"UMIS username / matric number",
);

export const cliPasswordOption = createOption(
	"-p, --password <pass>",
	"UMIS password (use with caution)",
);

export const cliClientOption = createOption(
	"-c, --client <client>",
	"UMIS parser implementation",
)
	.default("html-rewriter")
	.choices(["html-rewriter", "node"] as const);

export const cliFormatOption = createOption(
	"-o, --format <format>",
	"output format",
)
	.default("json")
	.choices(["json", "table", "yaml"] as const);

export type CliClientName = "html-rewriter" | "node";

export const addCommonOptions = <T extends Command>(command: T): T =>
	command
		.addOption(cliUsernameOption)
		.addOption(cliPasswordOption)
		.addOption(cliClientOption)
		.addOption(cliFormatOption);

export const getCliOptions = (
	command: Command,
): {
	client: CliClientName;
	format: OutputFormat;
} => {
	const parsed = v.parse(CliRuntimeOptionsSchema, command.opts());

	return {
		client: parsed.client ?? "html-rewriter",
		format: parsed.format ?? "json",
	};
};
