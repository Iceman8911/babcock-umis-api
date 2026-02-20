import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { MatricNumberSchema, StudentCredentialsSchema } from "./credentials";

describe("MatricNumberSchema", () => {
	it("parses valid matric numbers", () => {
		const input = "22/0039";
		const output = v.parse(MatricNumberSchema, input);
		expect(output).toBe(input);
	});

	it("throws on invalid matric numbers", () => {
		const invalids = ["2/0039", "22-0039", "22/039", "", "22/abcd"];
		for (const s of invalids) {
			expect(() => v.parse(MatricNumberSchema, s)).toThrow();
		}
	});

	it("safeParse returns success true for valid and false for invalid", () => {
		const ok = v.safeParse(MatricNumberSchema, "21/4321");
		expect(ok.success).toBe(true);
		if (ok.success) expect(ok.output).toBe("21/4321");

		const bad = v.safeParse(MatricNumberSchema, "210/4321");
		expect(bad.success).toBe(false);
	});

	it("is acts as a runtime check/type guard", () => {
		expect(v.is(MatricNumberSchema, "00/0000")).toBe(true);
		expect(v.is(MatricNumberSchema, "00/000")).toBe(false);
		expect(v.is(MatricNumberSchema, 123)).toBe(false);
	});
});

describe("StudentCredentialsSchema", () => {
	it("parses and transforms valid credentials to login payload", () => {
		const input = { pass: "hunter2", user: "22/0039" };
		const output = v.parse(StudentCredentialsSchema, input);
		expect(output).toEqual({ j_password: "hunter2", j_username: "22/0039" });
	});

	it("throws when user matric number is invalid", () => {
		expect(() =>
			v.parse(StudentCredentialsSchema, { pass: "x", user: "2/0039" }),
		).toThrow();
	});

	it("safeParse returns false for invalid credentials and true for valid", () => {
		const ok = v.safeParse(StudentCredentialsSchema, {
			pass: "pw",
			user: "21/4321",
		});
		expect(ok.success).toBe(true);
		if (ok.success)
			expect(ok.output).toEqual({ j_password: "pw", j_username: "21/4321" });

		const bad = v.safeParse(StudentCredentialsSchema, {
			pass: "pw",
			user: "210/4321",
		});
		expect(bad.success).toBe(false);
	});

	it("is returns true for valid input and false for invalid", () => {
		expect(v.is(StudentCredentialsSchema, { pass: "p", user: "00/0000" })).toBe(
			true,
		);
		expect(v.is(StudentCredentialsSchema, { pass: "p", user: "00-0000" })).toBe(
			false,
		);
	});
});
