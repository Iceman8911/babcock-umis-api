import type { OutputFormat } from "./output";
import { printOutput } from "./output";

type CliResult<T> = { success: true; val: T } | { success: false; err: string };

export const handleCliResult = <T>(
	result: CliResult<T>,
	format: OutputFormat,
): void => {
	if (!result.success) {
		console.error(result.err);
		process.exit(1);
	}

	printOutput(result.val, format);
};
