import { describe, expect, it } from "bun:test";
import { spawnCli } from "./cli.test-utils";

describe("semester-result command", () => {
	it("shows help text", async () => {
		const { stdout, exitCode } = await spawnCli("semester-result", "--help");

		expect(exitCode).toBe(0);
		expect(stdout).toContain("fetch a specific UMIS semester result");
		expect(stdout).toContain("--link");
		expect(stdout).toContain("--session");
	});
});
