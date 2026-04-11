import { describe, expect, it } from "bun:test";
import { normalizeStringToCapitalCase } from "./string";

describe("normalizeStringToCapitalCase", () => {
	it("should normalize mixed-case strings", () => {
		expect(normalizeStringToCapitalCase("maTRic no.")).toBe("Matric No.");
		expect(normalizeStringToCapitalCase("software ENGINEERING")).toBe(
			"Software Engineering",
		);
	});

	it("should normalize spacing and capitalization", () => {
		expect(normalizeStringToCapitalCase("  multiple   words  here  ")).toBe(
			"Multiple Words Here",
		);
	});

	it("should preserve punctuation and digits", () => {
		expect(normalizeStringToCapitalCase("eTranzact Card Number 123")).toBe(
			"Etranzact Card Number 123",
		);
	});

	it("should handle empty strings", () => {
		expect(normalizeStringToCapitalCase("")).toBe("");
	});
});
