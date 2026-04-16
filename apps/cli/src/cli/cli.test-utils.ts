export const spawnCli = async (...args: string[]) => {
	const cliRoot = process.cwd();

	const proc = Bun.spawn({
		cmd: [process.execPath, "src/index.ts", ...args],
		cwd: cliRoot,
		stderr: "pipe",
		stdout: "pipe",
	});

	const stdout = await new Response(proc.stdout).text();
	const stderr = await new Response(proc.stderr).text();
	await proc.exited;

	return {
		exitCode: proc.exitCode,
		stderr,
		stdout,
	};
};
