import * as v from "valibot";
import { EnvironmentVariablesSchema } from "../models/env";

export const ENVIRONMENT_VARIABLES = v.parse(
	EnvironmentVariablesSchema,
	process.env,
);
