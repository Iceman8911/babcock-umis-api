import { HtmlRewriterUmisApiStudentClient } from "@babcock-umis-api/core";
import { Command } from "commander";
import {
	cliGetCredentials,
	cliPasswordOption,
	cliUsernameOption,
} from "./credentials";

export const cliCheckUserCommand = new Command("check-user")
	.description("retrieves data about the user if they're registered on umis.")
	.addOption(cliPasswordOption)
	.addOption(cliUsernameOption)
	.action(async function () {
		const creds = await cliGetCredentials(this);

		const client = new HtmlRewriterUmisApiStudentClient(creds);

		console.log(await client.isStudentValid());
	});
