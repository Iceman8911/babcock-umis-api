import { describe, expect, it } from "bun:test";
import { spawnCli } from "./cli.test-utils";

describe("school-info command", () => {
	it("shows help text", async () => {
		const { stdout, exitCode } = await spawnCli("school-info", "--help");

		expect(exitCode).toBe(0);
		expect(stdout).toContain("fetch UMIS school information");
		expect(stdout).toContain("UMIS username");
	});
});
