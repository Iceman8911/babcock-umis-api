// Minimal ambient type definitions to satisfy `bun-types` for TypeScript in this repo.
// This file intentionally keeps definitions tiny — expand as needed.

interface BunSpawnOptions {
	cmd: string[];
	cwd?: string;
	env?: Record<string, string | undefined>;
	stderr?: "pipe" | "inherit" | "null";
	stdout?: "pipe" | "inherit" | "null";
}

declare namespace Bun {
	function spawn(opts: BunSpawnOptions & { stdout?: any; stderr?: any }): {
		stdout: unknown;
		stderr: unknown;
		stdin?: unknown;
		pid: number;
		exitCode?: number | null;
		killed?: boolean;
		exited: Promise<void>;
	};
}

declare var Bun: typeof globalThis & {
	spawn: typeof Bun.spawn;
};

export {};
