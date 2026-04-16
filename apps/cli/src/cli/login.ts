import { attemptStudentLogin } from "@babcock-umis-api/core";
import { Command } from "commander";
import { addCommonOptions, getCliOptions } from "./common";
import { cliGetCredentials } from "./credentials";
import { handleCliResult } from "./result";

export const cliLoginCommand = addCommonOptions(
	new Command("login")
		.description("attempts UMIS login and prints the session cookie")
		.action(async function () {
			const creds = await cliGetCredentials(this);
			const { format } = getCliOptions(this);
			const result = await attemptStudentLogin(creds);
			handleCliResult(result, format);
		}),
);
