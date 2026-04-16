import { describe, expect, it } from "bun:test";
import { spawnCli } from "./cli.test-utils";

describe("personal-details command", () => {
	it("shows help text", async () => {
		const { stdout, exitCode } = await spawnCli("personal-details", "--help");

		expect(exitCode).toBe(0);
		expect(stdout).toContain("fetch UMIS personal details");
		expect(stdout).toContain("UMIS username");
	});
});
