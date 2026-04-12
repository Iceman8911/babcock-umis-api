import * as v from "valibot";
import { UmisStudentsPagePrefix } from "../../constants/umis-pages";

export interface ResolvedSchoolInfo {
	/** E.g Babcock Business School */
	fullName: string;
	link: string;

	/** E.g BBS. Basically the short form of the school name */
	shortName: string;
}

export const FetchedSchoolInfoSchema: v.GenericSchema<
	unknown,
	ResolvedSchoolInfo[]
> = v.pipe(
	v.array(
		v.object({
			/** E.g. "?view=10:0:0&data=BBS" Should be appended to `UmisStudentsPagePrefix` for a valid link */
			CL: v.string(),
			/** E.g BBS. Basically the short form of the school name */
			KF: v.string(),
			/** Actually a serialized DOM link */
			schoolid: v.string(),
			/** E.g Babcock Business School */
			schoolname: v.string(),
		}),
	),

	v.transform((infos) =>
		infos.map(({ CL, KF, schoolname }) => ({
			fullName: schoolname,
			link: `${UmisStudentsPagePrefix}${CL}`,
			shortName: KF,
		})),
	),
);
