import { getPersonalDetails as _getPersonalDetails } from "../features/index";
import NodeHTMLParser from "../html-parsing/node";

export const getPersonalDetails = (
	credentials: Parameters<typeof _getPersonalDetails>[0],
) => _getPersonalDetails(credentials, NodeHTMLParser);

export { attemptStudentLogin, doesStudentExist } from "../features/index";
