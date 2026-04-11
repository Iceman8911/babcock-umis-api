# @packages/core

Exposes functions to query the umis api. Currently only supports fetching student data since I don;t have a reliable way to test other groups.

# How does it work?

Scrapes babcock umis portal for data. It needs 3 core inputs to work:

- Student username (aka your matric number)
- Student password
- A randomly generated session id cookie

Without the session id, all requests will redirect to the login page (which itself returns a temporary session id). Using the temp id gotten from the login page, a request can be made to the security check endpoint with the username + password as well as the temporary cookie id. If all goes well, a more "permanent" session id cookie is returned which can be used to make requests to the various endpoints to fetch data.

Now you might be me initally and consider scraping all the pages, however that's more work than a way I found recently. Apparently, when you fetch a specific umis page (e.g personal details, courses, semester results) with the session cookie, additionally fetching `https://umis.babcock.edu.ng/babcock/jsondata` with the same cookie provides the raw json used to populate the ui! So no need for menial scraping.
