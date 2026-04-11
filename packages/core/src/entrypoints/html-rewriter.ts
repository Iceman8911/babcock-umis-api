import { getPersonalDetails as _getPersonalDetails } from "../features/index";
import HTMLRewriterHTMLParser from "../html-parsing/html-rewriter";

export const getPersonalDetails = (
	credentials: Parameters<typeof _getPersonalDetails>[0],
) => _getPersonalDetails(credentials, HTMLRewriterHTMLParser);

export { attemptStudentLogin, doesStudentExist } from "../features/index";
