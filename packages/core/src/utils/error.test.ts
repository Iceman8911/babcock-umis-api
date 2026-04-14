import { describe, expect, it } from "bun:test";
import { getErrorMessage } from "./error";

describe(getErrorMessage.name, () => {
	it("returns the error message for Error instances", () => {
		const error = new Error("something went wrong");
		expect(getErrorMessage(error)).toBe("something went wrong");
	});

	it("returns the message from an Error subclass", () => {
		class CustomError extends Error {}
		const error = new CustomError("custom failure");
		expect(getErrorMessage(error)).toBe("custom failure");
	});

	it("stringifies non-Error values", () => {
		expect(getErrorMessage("plain string")).toBe("plain string");
		expect(getErrorMessage(123)).toBe("123");
		expect(getErrorMessage(true)).toBe("true");
		expect(getErrorMessage({ value: "test" })).toBe("[object Object]");
	});
});
