# Backend Deployment Guide

The Travel Checklist backend uses two hosted services:

- **Neon** hosts the PostgreSQL database.
- **Render** runs the Node.js and Express API.

This keeps the database and API separate, as described in the course deployment
material. MongoDB is not needed because PostgreSQL already stores all related
project data.

## Before deployment

Run the final checks locally:

```bash
cd backend
npm test
npx prisma validate
```

From the main project folder, also run:

```bash
npm run lint
npm run build
```

Never upload `.env` or `.env.test`. These files contain private values and are
ignored by Git.

## 1. Create the hosted PostgreSQL database

1. Sign in to Neon.
2. Create a project named `travel-checklist`.
3. Copy the PostgreSQL connection string.
4. Keep this connection string private. It will become `DATABASE_URL` on
   Render.

No tables need to be created manually. Render runs
`npx prisma migrate deploy` during its build and applies the committed Prisma
migrations to the hosted database.

## 2. Create the hosted API

1. Sign in to Render and connect the GitHub repository.
2. Create a Blueprint from the repository's `render.yaml` file.
3. When Render asks for environment variables, add:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | The private Neon connection string |
| `CLIENT_ORIGIN` | `http://localhost:5173` until the frontend is deployed |

Render generates `JWT_SECRET` automatically from `render.yaml`. The general
request limit is set to 100 requests per 15 minutes.

The deployment configuration tells Render to:

1. work inside the `backend` folder;
2. install packages and generate Prisma Client;
3. apply production database migrations;
4. start the Express server;
5. check `/api/health` to confirm the service is available.

## 3. Verify the live API

Open this address after Render finishes deploying:

```text
https://YOUR-RENDER-URL/api/health
```

The expected response is:

```json
{
  "message": "Travel Checklist API is running"
}
```

In Postman, change the collection variable `baseUrl` from
`http://localhost:3000` to the Render URL without a final slash. Then run the
collection in order to test registration, login, protected trips, and checklist
items against the live HTTPS API.

## 4. After the frontend is deployed

Change `CLIENT_ORIGIN` in Render to the frontend's public HTTPS address. This
allows the browser frontend to call the API while keeping CORS limited to the
intended client.

## Deployment checklist

- [ ] Automated backend tests pass.
- [ ] Frontend lint and build pass.
- [ ] `.env` and `.env.test` are not tracked by Git.
- [ ] Neon connection string is stored only as a Render environment variable.
- [ ] The Render deployment succeeds.
- [ ] The HTTPS health endpoint returns `200 OK`.
- [ ] Registration and login work on the live API.
- [ ] Protected requests reject missing tokens.
- [ ] Trip and checklist CRUD work on the live API.
- [ ] The final backend URL is added to the README.
