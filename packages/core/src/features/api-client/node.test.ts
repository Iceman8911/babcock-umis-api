import { describe } from "bun:test";
import { CORRECT_LOGIN_PAYLOAD } from "../shared/_shared.test";
import { NodeUmisApiStudentClient } from "./node";
import { _sharedEntrypointTests } from "./shared.test";

describe(NodeUmisApiStudentClient.name, () => {
	_sharedEntrypointTests(
		() => new NodeUmisApiStudentClient(CORRECT_LOGIN_PAYLOAD),
	);
});
