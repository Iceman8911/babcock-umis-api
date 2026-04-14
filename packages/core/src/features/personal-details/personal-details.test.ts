import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { ScrapedPersonalDetailsSchema } from "./schema";

describe("PersonalDetailsSchema", () => {
	it("should parse a realistic personal details row array", () => {
		const input = [
			"Matric No.",
			"22/0039",
			"Student Name",
			"OKOROCHA, CONRAD MADUAWUCHI",
			"Programme",
			"Software Engineering",
			"Department",
			"Software Engineering",
			"Entry Level",
			"100",
			"Study Level",
			"400",
			"Religion",
			"Christian",
			"Denomination",
			"Roman Catholic",
			"Gender",
			"M",
			"Marital Status",
			"S",
			"Nationality",
			"Nigeria",
			"Address",
			"House No. 14, Brig. Gen. A. A. Yakubu Close, PDP Wing, First Gate, Army Estate, Kurudu, Abuja, FCT, Nigeria",
			"Town",
			"Eziala Nguru",
			"Country",
			"Nigeria",
			"On Probation",
			"No",
			"Off Campus",
			"No",
			"School Details",
			"CES",
			"Department Details",
			"SENG",
			"Account Number",
			"S220039",
			"ETranzact Card Number",
			"7079896992195687",
			"Email",
			"chrishconmedical@gmail.com",
		];

		const result = v.parse(ScrapedPersonalDetailsSchema, input);

		expect(result.matricNo).toBe("22/0039");
		expect(result.name).toBe("OKOROCHA, CONRAD MADUAWUCHI");
		expect(result.etranzactCardNo).toBe(7079896992195687);
		expect(result.email).toBe("chrishconmedical@gmail.com");
	});

	it("should accept alternate label casing and variants", () => {
		const input = [
			"Matric No.",
			"22/0039",
			"Student Name",
			"OKOROCHA, CONRAD MADUAWUCHI",
			"Programme",
			"Software Engineering",
			"Department",
			"Software Engineering",
			"Entry Level",
			"100",
			"Study Level",
			"400",
			"Religion",
			"Christian",
			"Denomination",
			"Roman Catholic",
			"Gender",
			"M",
			"Marital Status",
			"S",
			"Nationality",
			"Nigeria",
			"Address",
			"House No. 14, Brig. Gen. A. A. Yakubu Close, PDP Wing, First Gate, Army Estate, Kurudu, Abuja, FCT, Nigeria",
			"Town",
			"Eziala Nguru",
			"Country",
			"Nigeria",
			"On Probation",
			"No",
			"Off Campus",
			"No",
			"School Details",
			"CES",
			"Department Details",
			"SENG",
			"Account Number",
			"S220039",
			"Etranzact Card Number",
			"7079896992195687",
			"EMail",
			"chrishconmedical@gmail.com",
		];

		const result = v.parse(ScrapedPersonalDetailsSchema, input);

		expect(result.etranzactCardNo).toBe(7079896992195687);
		expect(result.email).toBe("chrishconmedical@gmail.com");
	});

	it("should reject invalid personal detail arrays", () => {
		const input = ["Matric No.", "22/0039", "Student Name", "OKOROCHA"]; // missing required fields
		expect(v.safeParse(ScrapedPersonalDetailsSchema, input).success).toBe(
			false,
		);
	});
});
