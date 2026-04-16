import { describe, expect, it } from "bun:test";
import { spawnCli } from "./cli.test-utils";

describe("check-listings command", () => {
	it("shows help text", async () => {
		const { stdout, exitCode } = await spawnCli("check-listings", "--help");

		expect(exitCode).toBe(0);
		expect(stdout).toContain("run UMIS listing checks");
		expect(stdout).toContain("UMIS username");
	});
});
