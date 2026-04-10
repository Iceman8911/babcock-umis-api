import { BasicEnumBuilder } from "better-ts-enum/basic-enum";

/** All the recorded umis page urls */
const aStudents = <T extends string>(view: T) =>
	`a_students.jsp?view=${view}:0` as const;

export const UmisPage = BasicEnumBuilder.new({
	prefix: "https://umis.babcock.edu.ng/babcock/",
})
	.$("SecurityCheck", "j_security_check")
	.$("CheckUser", "user_checks")
	.$("Login", aStudents("112"))
	.$("Dashboard", aStudents("1"))
	.$("SchoolInfo", aStudents("10"))
	.$("PersonalDetails", aStudents("112"))

	// Academic details
	.$("SemesterResults", aStudents("19"))
	.$("UnofficialTranscript", aStudents("21"))
	.$("RepeatedCourses", aStudents("91"))
	.$("CheckListing", aStudents("26"))
	.$("PostQuery", aStudents("32"))

	// Registration
	.$("CommenceRegistration", aStudents("22"))
	.$("SelectCourses", aStudents("24"))
	.$("SelectMealType", aStudents("100"))
	.$("SelectResidence", aStudents("23"))
	.$("WorshipCenter", aStudents("49"))
	.$("SelectedCourseList", aStudents("27"))
	.$("SelectedTimetable", aStudents("28"))
	.$("OutstandingCourses", aStudents("103"))
	.$("SubmitRegistration", aStudents("29"))

	// Finance
	.$("FinanceStatement", "a_statement.jsp?view=33:0")
	.$("SelectPayments", aStudents("102"))
	.$("CurrentCharges", aStudents("33"))
	.$("CheckFinanceStatus", aStudents("39"))
	.$("CheckRegistrationStatus", aStudents("30"))
	.$("FinanceClearance", aStudents("40"))
	.$("PrintCourseForm", aStudents("50"))
	.$("PayForPreviousSemester", aStudents("44"))
	.build();
export type UmisPage = typeof UmisPage.$.infer.values;
