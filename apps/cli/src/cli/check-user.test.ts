import { describe, expect, it } from "bun:test";
import { spawnCli } from "./cli.test-utils";

describe("check-user command", () => {
	it("shows help text", async () => {
		const { stdout, exitCode } = await spawnCli("check-user", "--help");

		expect(exitCode).toBe(0);
		expect(stdout).toContain("check-user");
		expect(stdout).toContain("UMIS username");
	});
});
