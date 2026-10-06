# Backend Deployment Guide

The Travel Checklist application uses three hosted services:

- **Neon** hosts the PostgreSQL database.
- **Render** runs the Node.js and Express API.
- **Netlify** hosts the React and Vite frontend.

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
| `CLIENT_ORIGIN` | `https://dilek-travel-checklist.netlify.app` |

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
https://travel-checklist-api.onrender.com/api/health
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

## 4. Deploy the frontend

1. Connect the GitHub repository to Netlify.
2. Use `npm run build` as the build command.
3. Use `dist` as the publish directory.
4. Add this Netlify environment variable:

```text
VITE_API_URL=https://travel-checklist-api.onrender.com/api
```

5. Set `CLIENT_ORIGIN` in Render to the Netlify HTTPS address.

The deployed frontend is available at:

```text
https://dilek-travel-checklist.netlify.app
```

## Deployment checklist

- [x] Automated backend tests pass.
- [x] Frontend lint and build pass.
- [x] `.env` and `.env.test` are not tracked by Git.
- [x] Neon connection string is stored only as a Render environment variable.
- [x] The Render deployment succeeds.
- [x] The Netlify deployment succeeds.
- [x] The HTTPS health endpoint returns `200 OK`.
- [x] Registration and login work on the live API.
- [x] Protected requests reject missing tokens.
- [x] Trip and checklist CRUD work on the live API.
- [x] The frontend and backend URLs are added to the README.
