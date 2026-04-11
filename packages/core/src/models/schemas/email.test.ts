import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { EmailSchema } from "./email";

describe("EmailSchema", () => {
	it("should parse valid email addresses", () => {
		expect(v.parse(EmailSchema, "test@example.com")).toBe("test@example.com");
		expect(v.parse(EmailSchema, "user.name+tag@sub.domain.co")).toBe(
			"user.name+tag@sub.domain.co",
		);
	});

	it("should reject invalid email addresses", () => {
		expect(v.safeParse(EmailSchema, "missing-at-domain").success).toBe(false);
		expect(v.safeParse(EmailSchema, "user@domain").success).toBe(false);
		expect(v.safeParse(EmailSchema, "@domain.com").success).toBe(false);
		expect(v.safeParse(EmailSchema, "user domain@domain.com").success).toBe(
			false,
		);
	});
});
