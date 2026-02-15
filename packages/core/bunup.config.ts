import { defineConfig } from "bunup";

export default defineConfig([
	{
		entry: "src/entrypoints/node.ts",
		format: ["esm", "cjs"],
		name: "node",
	},
	{
		entry: "src/entrypoints/html-rewriter.ts",
		format: ["esm"],
		name: "html-rewriter",
	},
	{
		entry: "src/entrypoints/browser.ts",
		format: ["esm", "iife"],
		name: "browser",
	},
]);
