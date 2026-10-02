# Daily Project Update — 2 October 2026

**Project:** Travel Checklist Backend  
**Student:** Dilek

## Morning plan and risk assessment

### Top three tasks

1. Build the user-registration endpoint with validation, password hashing, and
   PostgreSQL storage.
2. Test successful and unsuccessful registration cases with Postman.
3. Document the endpoint, testing steps, completed work, and next priority.

### Most obvious obstacle or risk

- Authentication is new and includes several connected steps. A mistake could
  store an unsafe password or make it difficult to identify which step failed.

### How I planned to reduce the risk

- Follow only the course material and use the same tools: Express, Zod,
  bcryptjs, Prisma, PostgreSQL, and Postman.
- Complete one task at a time and test each result before continuing.
- Confirm that the API response never contains the password or password hash.

## Progress update

### Tasks completed

1. Added `POST /api/auth/register` with Zod email and password validation.
2. Added bcryptjs password hashing and stored only the password hash through
   Prisma.
3. Added duplicate-email handling with a `409 Conflict` response.
4. Tested successful registration, invalid email, short password, and duplicate
   email behavior.
5. Confirmed that the database does not contain the plain password and that the
   API response does not expose password information.
6. Added repeatable registration requests to the Postman collection and updated
   the project documentation.

### Obstacles encountered and solutions

- The automatic backend watch mode reached the macOS open-file limit. I used
  the normal start command for testing, which does not watch every file.
- The first email-validation order checked the email before trimming spaces. I
  changed the schema so it trims and normalizes the email before validation.
- A Postman request initially contained malformed JSON, and the edited URL was
  not committed. I corrected the JSON, committed the registration URL, and
  repeated the request successfully.

### Biggest lesson learned

- Registration has three separate responsibilities: validate the input, hash
  the password, and store only safe user data. Testing both successful and
  unsuccessful requests helps confirm that every responsibility works.

### Top priority for tomorrow

- Implement user login using bcryptjs password comparison and a JSON Web Token,
  following the course JWT material one small step at a time.
