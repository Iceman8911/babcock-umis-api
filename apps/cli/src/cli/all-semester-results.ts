import { Command } from "commander";
import { createStudentClient } from "./client-factory";
import { addCommonOptions, getCliOptions } from "./common";
import { cliGetCredentials } from "./credentials";
import { handleCliResult } from "./result";

export const cliAllSemesterResultsCommand = addCommonOptions(
	new Command("all-semester-results")
		.description("fetch all UMIS semester results for the current student")
		.action(async function () {
			const creds = await cliGetCredentials(this);
			const { client, format } = getCliOptions(this);
			const result = await createStudentClient(
				creds,
				client,
			).getAllSemesterResults();
			handleCliResult(result, format);
		}),
);
