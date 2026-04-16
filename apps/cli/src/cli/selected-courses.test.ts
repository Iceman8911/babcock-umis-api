import { describe, expect, it } from "bun:test";
import { spawnCli } from "./cli.test-utils";

describe("selected-courses command", () => {
	it("shows help text", async () => {
		const { stdout, exitCode } = await spawnCli("selected-courses", "--help");

		expect(exitCode).toBe(0);
		expect(stdout).toContain("fetch the UMIS selected course list");
		expect(stdout).toContain("UMIS username");
	});
});
