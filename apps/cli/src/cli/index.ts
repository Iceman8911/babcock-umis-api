import { program } from "commander";
import packageJson from "../../package.json";
import { cliAllSemesterResultsCommand } from "./all-semester-results";
import { cliCheckListingsCommand } from "./check-listings";
import { cliCheckUserCommand } from "./check-user";
import { cliLoginCommand } from "./login";
import { cliPersonalDetailsCommand } from "./personal-details";
import { cliSchoolInfoCommand } from "./school-info";
import { cliSelectedCoursesCommand } from "./selected-courses";
import { cliSemesterResultCommand } from "./semester-result";
import { cliSemesterSummariesCommand } from "./semester-summaries";

const { description, name, version } = packageJson;

export async function runCli() {
	await program
		.name(name)
		.description(
			`${description}.\n\nFor each command, the username and password options can be cleanly substituted via the env variables USERNAME and PASSWORD.`,
		)
		.version(version)
		.addCommand(cliCheckUserCommand)
		.addCommand(cliLoginCommand)
		.addCommand(cliPersonalDetailsCommand)
		.addCommand(cliSchoolInfoCommand)
		.addCommand(cliSelectedCoursesCommand)
		.addCommand(cliSemesterSummariesCommand)
		.addCommand(cliSemesterResultCommand)
		.addCommand(cliAllSemesterResultsCommand)
		.addCommand(cliCheckListingsCommand)
		.parseAsync();
}
