import * as v from "valibot";
import { normalizeStringToCapitalCase } from "../utils/string";
import { ParseBooleanSchema, ParseIntegerSchema } from "./coercion";
import { MatricNumberSchema } from "./credentials";
import { EmailSchema } from "./email";
import { UniversityLevelSchema } from "./university-level";

// Need to normalize strings to capital case before piping this for safety
const ScrapedPersonalDetailsSchema = v.tuple([
	v.literal("Matric No."),
	MatricNumberSchema,
	v.literal("Student Name"),
	v.string(),
	v.literal("Programme"),
	v.string(),
	v.literal("Department"),
	v.string(),
	v.literal("Entry Level"),
	UniversityLevelSchema,
	v.literal("Study Level"),
	UniversityLevelSchema,
	v.literal("Religion"),
	v.string(),
	v.literal("Denomination"),
	v.string(),
	v.literal("Gender"),
	/** Could be "M" or "F" */
	v.string(),
	v.literal("Marital Status"),
	/** Could be "S" */
	v.string(),
	v.literal("Nationality"),
	v.string(),
	v.literal("Address"),
	v.string(),
	v.literal("Town"),
	v.string(),
	v.literal("Country"),
	v.string(),
	v.literal("On Probation"),
	ParseBooleanSchema,
	v.literal("Off Campus"),
	ParseBooleanSchema,
	v.literal("School Details"),
	/** TODO: It could be "CES" so see if I can make it a more specific union */
	v.string(),
	v.literal("Department Details"),
	/** TODO: It could be "SENG" so see if I can make it a more specific union */
	v.string(),
	v.literal("Account Number"),
	v.string(),
	v.literal("Etranzact Card Number"),
	ParseIntegerSchema,
	v.literal("Email"),
	EmailSchema,
]);

export const PersonalDetailsSchema = v.pipe(
	v.array(v.string()),

	v.transform(
		(arr) =>
			arr.map((item, index) =>
				index % 2 === 0 ? normalizeStringToCapitalCase(item) : item,
			) as unknown,
	),

	ScrapedPersonalDetailsSchema,

	v.transform((tuple) => {
		return {
			address: tuple[23],
			country: tuple[27],
			denomination: tuple[15],
			department: tuple[7],
			departmentDetails: tuple[35],
			email: tuple[41],
			entryLevel: tuple[9],
			etranzactCardNo: tuple[39],
			gender: tuple[17],
			maritalStatus: tuple[19],
			matricNo: tuple[1],
			name: tuple[3],
			nationality: tuple[21],
			offCampus: tuple[31],
			onProbation: tuple[29],
			programme: tuple[5],
			religion: tuple[13],
			schoolDetails: tuple[33],
			studyLevel: tuple[11],
			town: tuple[25],
		};
	}),
	v.readonly(),
);
export type PersonalDetailsInput = v.InferInput<typeof PersonalDetailsSchema>;
export type PersonalDetailsOutput = v.InferOutput<typeof PersonalDetailsSchema>;
