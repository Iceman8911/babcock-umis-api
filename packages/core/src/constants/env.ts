import * as v from "valibot";
import { EnvironmentVariablesSchema } from "../models/schemas/env";

export const ENVIRONMENT_VARIABLES = v.parse(
	EnvironmentVariablesSchema,
	process.env,
);
