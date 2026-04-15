import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { EnvironmentVariablesSchema } from "./env";

describe("Environment Variables", () => {
	it("should successfully parse the env variables", () => {
		expect(() =>
			v.parse(EnvironmentVariablesSchema, process.env),
		).not.toThrow();
	});
});
