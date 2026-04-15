import { program } from "commander";
import packageJson from "../../package.json";
import { cliCheckUserCommand } from "./check-user";

const { description, name, version } = packageJson;

await program
	.name(name)
	.description(
		`${description}.\n\nFor each command, the username and password options can be cleanly substituted via the env variables USERNAME and PASSWORD.`,
	)
	.version(version)
	.addCommand(cliCheckUserCommand)
	.parseAsync();
