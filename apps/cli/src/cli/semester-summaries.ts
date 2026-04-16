import { Command } from "commander";
import { createStudentClient } from "./client-factory";
import { addCommonOptions, getCliOptions } from "./common";
import { cliGetCredentials } from "./credentials";
import { handleCliResult } from "./result";

export const cliSemesterSummariesCommand = addCommonOptions(
	new Command("semester-summaries")
		.description("fetch UMIS semester result summaries")
		.action(async function () {
			const creds = await cliGetCredentials(this);
			const { client, format } = getCliOptions(this);
			const result = await createStudentClient(
				creds,
				client,
			).getSemesterResultSummaries();
			handleCliResult(result, format);
		}),
);
