import * as v from "valibot";
import { EnvSchema } from "./schema";

export const getEnv = () => v.parse(EnvSchema, process.env);
