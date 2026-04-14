# @packages/core

A reverse-engineered client for Babcock UMIS student data.

This package exposes a small public API for validating student matric numbers, logging in, and fetching student details from the UMIS portal. It uses the portal's own endpoint flow and the JSON payloads used by the UI when available.

## Public API

The package exports the following functions from the package root:

- `attemptStudentLogin(credentials)`
  - Attempts to log in with a matric number and password.
  - Returns a `Result<UserLoginCookieOutput, string>` containing the session cookies needed for further requests.
- `isStudentValid(matricNo)`
  - Checks if a matric number exists in UMIS.
  - Returns a `Result<VerifiedStudentResponseOutput, string>`.
- `getPersonalDetails({ cookie, parserConstructor, mocks? })`
  - Fetches the student personal details page and resolves the UMIS data.
  - Uses JSON payloads first and falls back to HTML scraping with a parser.
- `getSchoolDetails({ cookie, mocks? })`
  - Fetches the student school information.
- `checkListings({ cookie, mocks? })`
  - Fetches course registration/check listing details.
- `getSelectedCourseList({ cookie, mocks? })`
  - Fetches the selected course list for the student.
- `getSemesterResultSummaries({ cookie, mocks? })`
  - Fetches the list of available semester results links.
- `getSingleSemesterResults({ cookie, link, mocks? })`
  - Fetches detailed results for a specified semester result page link.

All fetch functions return a typed `Result<T, string>` object with `success`, `val`, and `err` fields.

## Example usage

```ts
import {
  attemptStudentLogin,
  isStudentValid,
  getPersonalDetails,
  getSchoolDetails,
  checkListings,
  getSelectedCourseList,
  getSemesterResultSummaries,
  getSingleSemesterResults,
} from "babcock-umis-api";

const credentials = {
  user: "AB123",
  pass: "super-secret-password",
};

async function run() {
  const loginResult = await attemptStudentLogin(credentials);

  if (!loginResult.success) {
    throw new Error(`Login failed: ${loginResult.err}`);
  }

  const sessionCookie = loginResult.val.JSESSIONID;

  const personalDetailsResult = await getPersonalDetails({
    cookie: sessionCookie,
    parserConstructor: /* your parser constructor here */ undefined,
  });

  if (!personalDetailsResult.success) {
    throw new Error(`Failed to fetch personal details: ${personalDetailsResult.err}`);
  }

  console.log("Personal details:", personalDetailsResult.val);

  const schoolResult = await getSchoolDetails({ cookie: sessionCookie });
  console.log("School info:", schoolResult.success ? schoolResult.val : schoolResult.err);

  const selectedCourses = await getSelectedCourseList({ cookie: sessionCookie });
  console.log("Selected courses:", selectedCourses.success ? selectedCourses.val : selectedCourses.err);

  const semesterSummaries = await getSemesterResultSummaries({ cookie: sessionCookie });
  if (semesterSummaries.success) {
    const firstLink = semesterSummaries.val[0]?.link;
    if (firstLink) {
      const results = await getSingleSemesterResults({ cookie: sessionCookie, link: firstLink });
      console.log("Semester results:", results.success ? results.val : results.err);
    }
  }
}
```

## How it works

The package follows the UMIS login flow:

1. Fetch the login page to obtain an initial `JSESSIONID` cookie.
2. Post credentials to the UMIS security check endpoint using that cookie.
3. Receive an authenticated cookie and use it to query UMIS pages.
4. For page data, the package first attempts to resolve the internal JSON payloads used by the UMIS UI.
5. When JSON is unavailable, certain pages fall back to HTML parsing.

## Notes

- This package is designed for student-data endpoints only.
- The public functions are intentionally small wrappers around UMIS fetch flows and return normalized results. 