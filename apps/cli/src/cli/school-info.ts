import { Command } from "commander";
import { createStudentClient } from "./client-factory";
import { addCommonOptions, getCliOptions } from "./common";
import { cliGetCredentials } from "./credentials";
import { handleCliResult } from "./result";

export const cliSchoolInfoCommand = addCommonOptions(
	new Command("school-info")
		.description("fetch UMIS school information")
		.action(async function () {
			const creds = await cliGetCredentials(this);
			const { client, format } = getCliOptions(this);
			const result = await createStudentClient(
				creds,
				client,
			).getSchoolDetails();
			handleCliResult(result, format);
		}),
);
