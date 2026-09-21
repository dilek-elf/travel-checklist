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

Send the requests in their numbered order, starting with **1. Check API
health**. The collection automatically remembers the created `tripId` and
`itemId`, so you do not need to copy database IDs manually.

Every request includes a small test. After sending a request, open Postman's
test results to see whether it passed.
