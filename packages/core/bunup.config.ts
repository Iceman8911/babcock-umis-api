import { defineConfig } from "bunup";

export default defineConfig({
	dts: {
		inferTypes: true,
	},
	entry: "src/features/index.ts",
	exports: true,
	format: ["esm", "cjs"],
});
