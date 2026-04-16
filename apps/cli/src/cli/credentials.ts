import {
	type MatricNumberOutput,
	MatricNumberSchema,
} from "@babcock-umis-api/core";
import type { Command } from "commander";
import prompts from "prompts";
import * as v from "valibot";
import { getEnv } from "../shared/env";
import { cliPasswordOption, cliUsernameOption } from "./common";
import { CliSharedOptionsSchema } from "./schema";

export { cliPasswordOption, cliUsernameOption };

interface Credentials {
	readonly pass: string;
	readonly user: MatricNumberOutput;
}

/** Prioritises command args but falls back to env variables, and then manual prompting */
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
