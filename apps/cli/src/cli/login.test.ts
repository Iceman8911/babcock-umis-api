import { describe, expect, it } from "bun:test";
import { spawnCli } from "./cli.test-utils";

describe("login command", () => {
	it("shows help text", async () => {
		const { stdout, exitCode } = await spawnCli("login", "--help");

		expect(exitCode).toBe(0);
		expect(stdout).toContain("attempts UMIS login");
		expect(stdout).toContain("UMIS password");
	});
});
