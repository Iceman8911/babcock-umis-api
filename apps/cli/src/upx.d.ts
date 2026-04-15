declare module "upx" {
	/**
	 * Options that control UPX compression and decompression behavior.
	 */
	export interface UpxOptions {
		/** Use 8-bit size compression instead of 32-bit. */
		"8bit"?: boolean;
		/** Set an 8 MiB memory limit instead of the default 2 MiB. */
		"8mibRam"?: boolean;
		/** Make compressed sys files work on any 8086 CPU. */
		"8086"?: boolean;
		/** Compress with the best ratio, potentially slower for large files. */
		best?: boolean;
		/** Compress with a better ratio than default. */
		better?: boolean;
		/** Try all available compression methods and filters. */
		brute?: boolean;
		/** Decompress the input file instead of compressing it. */
		decompress?: boolean;
		/** Compress faster using less optimal settings. */
		faster?: boolean;
		/** Force compression even on suspicious files. */
		force?: boolean;
		/** List compressed files instead of compressing/decompressing. */
		list?: boolean;
		/** Put no relocations into the exe header (for DOS). */
		noReloc?: boolean;
		/** Copy any extra data attached to the file. */
		overlayCopy?: boolean;
		/** Do not compress a file with an overlay. */
		overlaySkip?: boolean;
		/** Strip any extra data attached to the file. Dangerous for some executables. */
		overlayStrip?: boolean;
		/** Try even more compression variants for maximum compression. */
		ultraBrute?: boolean;
	}

	/**
	 * Result metadata returned by a completed UPX process.
	 */
	export interface UpxStats {
		/** Number of affected files. */
		affected: number;
		/** UPX command executed, typically 'compress' or 'decompress'. */
		cmd: string;
		/** File sizes before and after processing. */
		fileSize: {
			before: string;
			after: string;
		};
		/** Format detected by UPX, e.g. 'win32/pe'. */
		format: string;
		/** Output file name. */
		name: string;
		/** Compression ratio as a string. */
		ratio: string;
	}

	/**
	 * A single UPX process instance.
	 */
	export interface UpxProcess {
		/**
		 * Set the output path for the compressed/decompressed file.
		 * @param outputPath Path to the destination file.
		 */
		output(outputPath: string): UpxProcess;

		/**
		 * Start compression/decompression and return the resulting stats.
		 */
		start(): Promise<UpxStats>;
	}

	/**
	 * The upx factory function returned by importing the module.
	 */
	export type UpxRunner = (path: string) => UpxProcess;

	/**
	 * Create a UPX runner with optional configuration.
	 *
	 * @param opts Configuration options for UPX.
	 * @returns A function that starts a UPX process for a given file path.
	 */
	export default function upx(opts?: UpxOptions): UpxRunner;
}
