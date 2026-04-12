import * as v from "valibot";
import { MatricNumberSchema } from "../../models/schemas/credentials";
import { normalizeStringToCapitalCase } from "../../utils/string";
import { ParseBooleanSchema, ParseIntegerSchema } from "../shared/coercion";
import { EmailSchema } from "../shared/email";
import {
	type UniversityLevelOutput,
	UniversityLevelSchema,
} from "./university-level";

interface ResolvedPersonalDetails {
	readonly accountNo: string;
	readonly address: string;
	readonly country: string;
	readonly denomination: string;
	readonly department: string;
	readonly departmentDetails: string;
	readonly email: string;
	/** Level when entering babcock */
	readonly entryLevel: UniversityLevelOutput;
	readonly etranzactCardNo: number;
	readonly gender: string;
	readonly maritalStatus: string;
	readonly matricNo: `${number}/${number}`;
	readonly name: string;
	readonly nationality: string;
	readonly offCampus: boolean;
	readonly onProbation: boolean;
	readonly programme: string;
	readonly religion: string;
	readonly schoolDetails: string;
	readonly studyLevel: UniversityLevelOutput;
	/** Current level */
	readonly town: string;
}

export const ScrapedPersonalDetailsSchema: v.GenericSchema<
	string[],
	ResolvedPersonalDetails
> = v.pipe(
	v.array(v.string()),

	v.transform(
		(arr) =>
			arr.map((item, index) =>
				index % 2 === 0 ? normalizeStringToCapitalCase(item) : item,
			) as unknown,
	),

	v.tuple([
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
	]),

	v.transform((tuple) => {
		return {
			accountNo: tuple[37],
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
export type ScrapedPersonalDetailsInput = v.InferInput<
	typeof ScrapedPersonalDetailsSchema
>;
export type ScrapedPersonalDetailsOutput = v.InferOutput<
	typeof ScrapedPersonalDetailsSchema
>;

export const FetchedPersonalDetailsSchema: v.GenericSchema<
	unknown[],
	ResolvedPersonalDetails
> = v.pipe(
	v.tuple([
		v.object({
			accountnumber: v.string(),
			address: v.string(),
			addresscountry: v.string(),
			CL: v.string(),
			current_study_level: UniversityLevelSchema,
			denominationname: v.string(),
			// TODO: See if I can make this a more specific union type
			departmentid: v.string(),
			departmentname: v.string(),
			email: EmailSchema,
			entry_level: UniversityLevelSchema,
			etranzact_card_no: ParseIntegerSchema,
			/** Looks like a Matric number but I don;t have enough test cases to conclude it */
			KF: v.string(),
			majorname: v.string(),
			maritalstatus: v.string(),
			nationalitycountry: v.string(),
			offcampus: ParseBooleanSchema,
			onprobation: ParseBooleanSchema,
			religionname: v.string(),
			// TODO: See if I can make this a more specific union type
			schoolid: v.string(),
			sex: v.string(),
			/** Matric number */
			studentid: MatricNumberSchema,
			studentname: v.pipe(
				v.string(),
				v.transform(normalizeStringToCapitalCase),
			),
			town: v.string(),
		}),
	]),
	v.transform(
		([
			{
				accountnumber,
				address,
				addresscountry,
				current_study_level,
				denominationname,
				departmentid,
				departmentname,
				email,
				entry_level,
				etranzact_card_no,
				majorname,
				maritalstatus,
				nationalitycountry,
				offcampus,
				onprobation,
				religionname,
				schoolid,
				sex,
				studentid,
				studentname,
				town,
			},
		]) => {
			const transformedObj: ResolvedPersonalDetails = {
				accountNo: accountnumber,
				address,
				country: addresscountry,
				denomination: denominationname,
				department: departmentname,
				departmentDetails: departmentid,
				email,
				entryLevel: entry_level,
				etranzactCardNo: etranzact_card_no,
				gender: sex,
				maritalStatus: maritalstatus,
				matricNo: studentid,
				name: studentname,
				nationality: nationalitycountry,
				offCampus: offcampus,
				onProbation: onprobation,
				programme: majorname,
				religion: religionname,
				schoolDetails: schoolid,
				studyLevel: current_study_level,
				town,
			};

			return transformedObj;
		},
	),
);
export type FetchedPersonalDetailsInput = v.InferInput<
	typeof FetchedPersonalDetailsSchema
>;
export type FetchedPersonalDetailsOutput = v.InferOutput<
	typeof FetchedPersonalDetailsSchema
>;
