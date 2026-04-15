import * as v from "valibot";
import { EnvironmentVariablesSchema } from "../features/shared/env";

export const ENVIRONMENT_VARIABLES = v.parse(
	EnvironmentVariablesSchema,
	process.env,
);
