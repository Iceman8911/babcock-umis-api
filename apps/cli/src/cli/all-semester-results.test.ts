import { describe, expect, it } from "bun:test";
import { spawnCli } from "./cli.test-utils";

describe("all-semester-results command", () => {
	it("shows help text", async () => {
		const { stdout, exitCode } = await spawnCli(
			"all-semester-results",
			"--help",
		);

		expect(exitCode).toBe(0);
		expect(stdout).toContain("fetch all UMIS semester results");
		expect(stdout).toContain("UMIS username");
	});
});
