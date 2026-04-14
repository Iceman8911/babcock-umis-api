import { describe } from "bun:test";
import { CORRECT_LOGIN_PAYLOAD } from "../shared/_shared.test";
import { HtmlRewriterUmisApiStudentClient } from "./html-rewriter";
import { _sharedEntrypointTests } from "./shared.test";

describe(HtmlRewriterUmisApiStudentClient.name, () => {
	_sharedEntrypointTests(
		() => new HtmlRewriterUmisApiStudentClient(CORRECT_LOGIN_PAYLOAD),
	);
});
