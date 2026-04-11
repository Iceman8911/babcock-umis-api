import { defineConfig } from "bunup";

export default defineConfig({
	dts: {
		inferTypes: true,
	},
	entry: "src/entrypoints/*.ts",
	exports: true,
	format: ["esm", "cjs"],
});
