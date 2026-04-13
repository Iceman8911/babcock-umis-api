import type { Session } from "../shared/_shared";

export type ApiClientGetSemesterResultArg =
	| { type: "link"; link: string }
	| { type: "session"; session: Session };
