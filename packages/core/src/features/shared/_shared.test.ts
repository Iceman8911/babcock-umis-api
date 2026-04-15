import { ENVIRONMENT_VARIABLES } from "../../constants/env";
import type { StudentCredentialsInput } from "./credentials";

export const CORRECT_LOGIN_PAYLOAD = {
	pass: ENVIRONMENT_VARIABLES.CORRECT_UMIS_PASSWORD,
	user: ENVIRONMENT_VARIABLES.CORRECT_UMIS_MATRIC_NO,
} as const satisfies StudentCredentialsInput;

export const WRONG_LOGIN_PAYLOAD = {
	pass: ENVIRONMENT_VARIABLES.WRONG_UMIS_PASSWORD,
	user: ENVIRONMENT_VARIABLES.WRONG_UMIS_MATRIC_NO,
} as const satisfies StudentCredentialsInput;
