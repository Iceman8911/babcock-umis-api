import { describe, expect, it, vi } from "bun:test";

const mockAttemptStudentLogin = vi
	.fn()
	.mockResolvedValueOnce({
		success: true,
		val: { JSESSIONID: "first-cookie" },
	})
	.mockResolvedValueOnce({
		success: true,
		val: { JSESSIONID: "second-cookie" },
	})
	.mockResolvedValueOnce({
		success: true,
		val: { JSESSIONID: "third-cookie" },
	});

vi.mock("../../features", () => ({
	attemptStudentLogin: mockAttemptStudentLogin,
	isStudentValid: vi.fn(async () => ({ success: true, val: true })),
}));

const { default: UmisApiStudentClient } = await import("./umis-api-client");

describe("UmisApiStudentClient cache refresh", () => {
	class TestUmisApiStudentClient extends UmisApiStudentClient {
		async getPersonalInfo(): Promise<never> {
			throw new Error("Not used in cache refresh tests");
		}

		public async getCookie() {
			return this._getCookie();
		}
	}

	it("should reuse the cached cookie before expiry and refresh after expiry", async () => {
		const client = new TestUmisApiStudentClient(
			{
				pass: "password",
				user: "matric-no",
			},
			1,
		);

		const firstCookie = await client.getCookie();
		expect(firstCookie).toBe("first-cookie");
		expect(mockAttemptStudentLogin).toHaveBeenCalledTimes(1);

		const secondCookie = await client.getCookie();
		expect(secondCookie).toBe("first-cookie");
		expect(mockAttemptStudentLogin).toHaveBeenCalledTimes(1);

		await new Promise((resolve) => setTimeout(resolve, 20));

		const thirdCookie = await client.getCookie();
		expect(thirdCookie).toBe("second-cookie");
		expect(mockAttemptStudentLogin).toHaveBeenCalledTimes(2);

		await new Promise((resolve) => setTimeout(resolve, 20));

		const fourthCookie = await client.getCookie();
		expect(fourthCookie).toBe("third-cookie");
		expect(mockAttemptStudentLogin).toHaveBeenCalledTimes(3);
	});
});
