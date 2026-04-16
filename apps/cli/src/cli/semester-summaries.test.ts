import { describe, expect, it } from "bun:test";
import { spawnCli } from "./cli.test-utils";

describe("semester-summaries command", () => {
	it("shows help text", async () => {
		const { stdout, exitCode } = await spawnCli("semester-summaries", "--help");

		expect(exitCode).toBe(0);
		expect(stdout).toContain("fetch UMIS semester result summaries");
		expect(stdout).toContain("UMIS username");
	});
});
