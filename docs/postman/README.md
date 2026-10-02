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

Send the requests in their numbered order, starting with **1. Check API
health**. The collection automatically remembers the created `tripId` and
`itemId`, so you do not need to copy database IDs manually.

The trip and item requests will be updated when login and protected routes are
implemented. During the authentication stage, use the health and registration
requests.

Every request includes a small test. After sending a request, open Postman's
test results to see whether it passed.
