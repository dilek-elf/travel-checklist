# Testing the Travel Checklist API with Postman

## Before testing

Start the backend from the `backend` folder:

```bash
npm run dev
```

Keep that terminal running while using Postman.

## Import the collection

1. Open Postman.
2. Select **Import**.
3. Choose `travel-checklist.postman_collection.json` from this folder.
4. Open the imported **Travel Checklist API** collection.

## Run the requests

For user-registration testing, expand **Registration tests** and send its four
requests in order:

1. Register a user.
2. Reject an invalid email.
3. Reject a short password.
4. Reject a duplicate email.

The first request creates a unique test email automatically. The last request
reuses that email to confirm that duplicate accounts are rejected.

Next, expand **Login tests** and send its four requests in order. These requests
confirm successful login, an incorrect password, an unknown email, and invalid
input. Successful login saves the returned JWT in the `authToken` collection
variable for later protected-route testing.

Then send **Reject a trip request without a JWT**. It should return `401
Unauthorized`. The numbered trip requests include `Bearer {{authToken}}`, so
they use the JWT saved by the successful login request.

Send the requests in their numbered order, starting with **1. Check API
health**. The collection automatically remembers the JWT, created `tripId`, and
created `itemId`, so you do not need to copy them manually.

The numbered requests test the complete flow: create, search, read, update, and
delete a trip; add, filter, pack, and delete a checklist item; and send the JWT
on every protected request.

To test the deployed backend, change the `baseUrl` collection variable to the
Render HTTPS URL without a final slash. No individual request URLs need to be
edited.

Every request includes a small test. After sending a request, open Postman's
test results to see whether it passed.
