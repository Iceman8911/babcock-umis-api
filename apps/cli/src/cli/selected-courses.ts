import { Command } from "commander";
import { createStudentClient } from "./client-factory";
import { addCommonOptions, getCliOptions } from "./common";
import { cliGetCredentials } from "./credentials";
import { handleCliResult } from "./result";

export const cliSelectedCoursesCommand = addCommonOptions(
	new Command("selected-courses")
		.description("fetch the UMIS selected course list")
		.action(async function () {
			const creds = await cliGetCredentials(this);
			const { client, format } = getCliOptions(this);
			const result = await createStudentClient(
				creds,
				client,
			).getSelectedCourseList();
			handleCliResult(result, format);
		}),
);
