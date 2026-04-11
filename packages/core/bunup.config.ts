import { defineConfig } from "bunup";

export default defineConfig([
	{
		entry: "src/entrypoints/node.ts",
		exports: true,
		format: ["esm", "cjs"],
		name: "node",
		outDir: "dist/node",
		packages: "bundle",
	},
	{
		clean: false,
		entry: "src/entrypoints/html-rewriter.ts",
		exports: true,
		format: ["esm", "cjs"],
		name: "html-rewriter",
		outDir: "dist/html-rewriter",
		packages: "bundle",
	},
]);
