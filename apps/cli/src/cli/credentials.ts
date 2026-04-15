import {
	type MatricNumberOutput,
	MatricNumberSchema,
} from "@babcock-umis-api/core";
import { type Command, createOption } from "commander";
import prompts from "prompts";
import * as v from "valibot";
import { getEnv } from "../shared/env";
import { CliSharedOptionsSchema } from "./schema";

export const cliUsernameOption = createOption(
	"-u, --username <user>",
	"UMIS username / matric number",
);

export const cliPasswordOption = createOption(
	"-p, --password <pass>",
	"UMIS password (use with caution)",
);

interface Credentials {
	readonly pass: string;
	readonly user: MatricNumberOutput;
}

/** Prioritises command args but falls back to env variables, nd then manual prompting  */
export const cliGetCredentials = async (
	command: Command,
): Promise<Credentials> => {
	let { password, username } = v.parse(CliSharedOptionsSchema, command.opts());

	if (!password || !username) {
		const env = getEnv();

		password = env.PASSWORD;
		username = env.USERNAME;
	}

	while (!username) {
		const response = await prompts({
			message: "Enter UMIS matric number:",
			name: "username",
			type: "text",
			validate: (val) => v.is(MatricNumberSchema, val),
		});

		username = response.username;
	}

	while (!password) {
		const response = await prompts({
			message: "Enter UMIS password:",
			name: "password",
			type: "password",
		});

		password = response.password;
	}

	return { pass: password, user: username };
};
