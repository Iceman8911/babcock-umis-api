import { describe, expect, it } from "bun:test";

describe("CLI spawn", () => {
	it("--help prints usage", async () => {
		const proc = Bun.spawn({
			cmd: [process.execPath, "src/index.ts", "--help"],
			cwd: process.cwd(),
			stderr: "pipe",
		});

		const out = await new Response(proc.stdout).text();
		await proc.exited;

		expect(out).toContain("Usage");
	});

	it("check-user --help includes command name", async () => {
		const proc = Bun.spawn({
			cmd: [process.execPath, "src/index.ts", "check-user", "--help"],
			cwd: process.cwd(),
			stderr: "pipe",
		});

		const out = await new Response(proc.stdout).text();
		await proc.exited;

		expect(out).toContain("check-user");
	});
});
