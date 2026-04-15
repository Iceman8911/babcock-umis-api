import { type DefineConfigItem, defineConfig } from "bunup";
import upxInit from "upx";

const compressor = upxInit({ best: true });

const SHARED_CONFIG = {
	clean: false,
	dts: {
		inferTypes: true,
	},
	entry: "src/index.ts",
	minify: true,
	outDir: "dist",
	plugins: [
		{
			hooks: {
				async onBuildDone({ files, options: { name: outputName } }) {
					await Promise.all(
						files.map(({ fullPath, kind }) => {
							if (kind !== "executable") return "";

							const splitFullPath = fullPath.split("/");
							const lastStr = splitFullPath[splitFullPath.length - 1] ?? "";

							return compressor(fullPath)
								.output(
									`/${splitFullPath
										.toSpliced(
											splitFullPath.length - 1,
											1,
											outputName ?? lastStr,
										)
										.join("/")}-compressed`,
								)
								.start()
								.then(({ fileSize, name, ratio }) => {
									console.log(
										"Compressed ",
										fullPath,
										" to ",
										name,
										" with a ratio of ",
										ratio,
										"% (",
										fileSize.before,
										" to ",
										fileSize.after,
										")",
									);

									return Bun.file(fullPath).delete();
								});
						}),
					);
				},
			},
		},
	],
	target: "bun",
} as const satisfies DefineConfigItem;

export default defineConfig([
	{
		...SHARED_CONFIG,
		clean: true,
		name: "bun-script",
		packages: "bundle",
		plugins: [],
	},
	{ ...SHARED_CONFIG, compile: true, name: "bun-linux-arm64" },
	// { ...SHARED_CONFIG, compile: "bun-linux-arm64", name: "bun-linux-arm64" },
	// { ...SHARED_CONFIG, compile: "bun-linux-x64", name: "bun-linux-x64" },
	// { ...SHARED_CONFIG, compile: "bun-linux-aarch64", name: "bun-linux-aarch64" },

	// { ...SHARED_CONFIG, compile: "bun-darwin-arm64", name: "bun-darwin-arm64" },
	// { ...SHARED_CONFIG, compile: "bun-darwin-x64", name: "bun-darwin-x64" },
	// {
	// 	...SHARED_CONFIG,
	// 	compile: "bun-darwin-aarch64",
	// 	name: "bun-darwin-aarch64",
	// },

	// { ...SHARED_CONFIG, compile: "bun-windows-arm64", name: "bun-windows-arm64" },
	// { ...SHARED_CONFIG, compile: "bun-windows-x64", name: "bun-windows-x64" },
	// {
	// 	...SHARED_CONFIG,
	// 	compile: "bun-windows-aarch64",
	// 	name: "bun-windows-aarch64",
	// },
]);
