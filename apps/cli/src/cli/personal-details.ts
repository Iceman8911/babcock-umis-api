import { Command } from "commander";
import { createStudentClient } from "./client-factory";
import { addCommonOptions, getCliOptions } from "./common";
import { cliGetCredentials } from "./credentials";
import { handleCliResult } from "./result";

export const cliPersonalDetailsCommand = addCommonOptions(
	new Command("personal-details")
		.description("fetch UMIS personal details")
		.action(async function () {
			const creds = await cliGetCredentials(this);
			const { client, format } = getCliOptions(this);
			const result = await createStudentClient(
				creds,
				client,
			).getPersonalDetails();
			handleCliResult(result, format);
		}),
);
