import { Command } from "commander";
import {
	createStudentClient,
	invokeGetSingleSemesterResults,
} from "./client-factory";
import { addCommonOptions, getCliOptions } from "./common";
import { cliGetCredentials } from "./credentials";
import { handleCliResult } from "./result";

export const cliSemesterResultCommand = addCommonOptions(
	new Command("semester-result")
		.description("fetch a specific UMIS semester result by link or session")
		.option("--link <url>", "direct UMIS semester result page link")
		.option("--session <session>", "UMIS session identifier, e.g. 2022/2023.S")
		.action(async function () {
			const creds = await cliGetCredentials(this);
			const { client, format } = getCliOptions(this);
			const { link, session } = this.opts() as {
				link?: string;
				session?: string;
			};

			if (!link && !session) {
				console.error("Error: specify either --link or --session");
				process.exit(1);
			}

			const clientInstance = createStudentClient(creds, client);

			const result = await invokeGetSingleSemesterResults(clientInstance, {
				link,
				session,
			});
			handleCliResult(result, format);
		}),
);
