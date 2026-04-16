import {
	HtmlRewriterUmisApiStudentClient,
	NodeUmisApiStudentClient,
	type StudentCredentialsInput,
} from "@babcock-umis-api/core";
import * as v from "valibot";
import type { CliClientName } from "./common";
import { SessionSchema } from "./schema";

export const createStudentClient = (
	credentials: StudentCredentialsInput,
	client: CliClientName,
) =>
	client === "node"
		? new NodeUmisApiStudentClient(credentials)
		: new HtmlRewriterUmisApiStudentClient(credentials);

export const invokeGetSingleSemesterResults = async (
	clientInstance: HtmlRewriterUmisApiStudentClient | NodeUmisApiStudentClient,
	opts: { link?: string; session?: string },
) => {
	if (opts.link) {
		return clientInstance.getSingleSemesterResults({
			link: opts.link,
			type: "link",
		});
	}

	const parsed = v.parse(SessionSchema, opts.session);

	return clientInstance.getSingleSemesterResults({
		session: parsed,
		type: "session",
	});
};
