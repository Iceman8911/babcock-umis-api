import { Command } from "commander";
import { createStudentClient } from "./client-factory";
import { addCommonOptions, getCliOptions } from "./common";
import { cliGetCredentials } from "./credentials";
import { handleCliResult } from "./result";

export const cliCheckListingsCommand = addCommonOptions(
	new Command("check-listings")
		.description("run UMIS listing checks for the current student")
		.action(async function () {
			const creds = await cliGetCredentials(this);
			const { client, format } = getCliOptions(this);
			const result = await createStudentClient(creds, client).checkListings();
			handleCliResult(result, format);
		}),
);
