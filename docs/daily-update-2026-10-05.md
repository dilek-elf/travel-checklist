# Daily Project Update — 5 October 2026

**Project:** Travel Checklist Backend  
**Student:** Dilek

## Morning plan and risk assessment

### Top three tasks

1. Create a login endpoint and compare the submitted password with the saved
   password hash.
2. Return a one-hour JSON Web Token after a successful login.
3. Test the login cases with Postman and update the project documentation.

### Most obvious obstacle or risk

- Login and JWT creation have several connected steps, so an error in one step
  could make the complete login flow fail.

### How I planned to reduce the risk

- Follow the course examples and use only bcryptjs and jsonwebtoken.
- Build and test password checking before adding the JWT.
- Test both successful and unsuccessful login requests.

## Progress update

### Tasks completed

1. Added `POST /api/auth/login` with Zod validation.
2. Added bcryptjs password comparison without exposing password information.
3. Added safe `401 Unauthorized` responses for incorrect passwords and unknown
   email addresses.
4. Added a signed JWT with the user ID and a one-hour expiration time.
5. Kept the JWT secret in the ignored environment file and added only a safe
   placeholder to the example configuration.
6. Added successful and unsuccessful login cases to the Postman collection.
7. Updated the README, backend plan, and testing instructions.
8. Added JWT authentication middleware for protected routes.
9. Protected the trip routes and connected new trips to the logged-in user.
10. Limited trip lists and nested checklist access to the trip owner.
11. Tested missing tokens, invalid tokens, owned trips, and access from a second
    user.

### Obstacles encountered and solutions

- Login needed to work before JWT creation could be tested. I separated the
  work into two small steps and verified password comparison first.
- The JWT secret must not be stored in GitHub. I generated it only in the local
  `.env` file and documented a placeholder in `.env.example`.
- The trip routes previously did not know which user was making the request. I
  added authentication middleware that verifies the token and provides the user
  ID to the controllers.

### Biggest lesson learned

- Password verification confirms who the user is, while the JWT gives the user
  proof of that successful login. Middleware checks that proof before allowing
  access to private routes.

### Top priority for the next project day

- Protect standalone checklist item update and delete routes with ownership
  checks, then connect authentication to the frontend.
