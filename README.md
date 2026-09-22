# Travel Checklist

A responsive full-stack application for organising packing lists for different
trips. Users can create and select trips, then add, pack, and delete checklist
items. The data is stored in a PostgreSQL database.

## Features

- Create trips with a name and destination
- Select a trip and view its own checklist
- Add travel essentials to the selected trip
- Mark items as packed or unpacked
- Delete checklist items
- Keep data after refreshing the page
- Responsive coffee-toned interface for mobile and desktop
- Input validation and helpful API error responses

## Tools Used

| Tool | Purpose in this project |
| --- | --- |
| React | Builds the user interface |
| TypeScript | Adds types to the frontend code |
| Vite | Runs and builds the frontend |
| Tailwind CSS | Styles the application |
| Node.js | Runs the backend JavaScript |
| Express | Creates the backend API |
| PostgreSQL | Stores trips and checklist items |
| Prisma | Connects the backend to PostgreSQL |
| Zod | Validates information sent to the API |
| Postman | Tests the API routes |

## How the Application Works

```text
React frontend
      |
      | HTTP requests
      v
Express API
      |
      | Prisma queries
      v
PostgreSQL database
```

The frontend runs at `http://localhost:5173` and sends requests to the backend
at `http://localhost:3000/api`.

## Requirements

Install these programs before starting:

- Node.js
- npm
- PostgreSQL
- Git

Postman is optional, but it is useful for testing the API.

## Setup

### 1. Download the project

```bash
git clone https://github.com/dilek-elf/travel-checklist.git
cd travel-checklist
```

If the project is already on your computer, open its folder in VS Code instead.

### 2. Install the frontend packages

Run this command in the main project folder:

```bash
npm install
```

### 3. Install the backend packages

```bash
cd backend
npm install
```

### 4. Create the PostgreSQL database

Create a database named `travel_checklist`:

```bash
createdb travel_checklist
```

If this command does not work, create the database with pgAdmin or PostgreSQL's
command-line tool.

### 5. Create the backend environment file

Inside the `backend` folder, copy `.env.example` and name the copy `.env`.

Update `YOUR_USERNAME` with your PostgreSQL username:

```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/travel_checklist?schema=public"
CLIENT_ORIGIN="http://localhost:5173"
RATE_LIMIT_MAX="100"
```

The `.env` file is private and must not be pushed to GitHub.

### 6. Create the database tables

Run this command from the `backend` folder:

```bash
npx prisma migrate dev
```

## Run the Project

The frontend and backend must run at the same time in two VS Code terminals.

### Terminal 1: start the backend

From the `backend` folder:

```bash
npm run dev
```

The backend should display:

```text
Server is running on http://localhost:3000
```

### Terminal 2: start the frontend

From the main `travel-checklist` folder:

```bash
npm run dev
```

Open `http://localhost:5173` in the browser.

## API Routes

All backend routes begin with `http://localhost:3000/api`.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check whether the API is running |
| `GET` | `/trips` | Get all trips |
| `POST` | `/trips` | Create a trip |
| `GET` | `/trips/:tripId/items` | Get one trip's checklist |
| `POST` | `/trips/:tripId/items` | Add an item to a trip |
| `PATCH` | `/items/:id` | Update an item |
| `DELETE` | `/items/:id` | Delete an item |

More API examples are available in
[`docs/backend-plan.md`](docs/backend-plan.md).

## Testing

### Check the frontend code

Run these commands from the main project folder:

```bash
npm run lint
npm run build
```

### Test the API with Postman

Import this collection into Postman:

```text
docs/postman/travel-checklist.postman_collection.json
```

Follow the instructions in
[`docs/postman/README.md`](docs/postman/README.md).

## Database Structure

One trip can have many checklist items. Each checklist item belongs to one trip.

```text
Trip
├── id
├── name
├── destination
└── createdAt
    └── ChecklistItem
        ├── id
        ├── text
        ├── isPacked
        ├── tripId
        └── createdAt
```

## Project Structure

```text
travel-checklist/
├── src/                 Frontend React code
│   ├── api/             Functions that call the backend
│   └── components/      Reusable interface components
├── backend/
│   ├── prisma/          Database schema and migrations
│   └── src/
│       ├── controllers/ Request logic
│       ├── middleware/  Validation and error handling
│       ├── routes/      API addresses
│       └── schemas/     Zod validation rules
└── docs/                Planning and testing documentation
```

## Current Status

The following flows have been tested successfully:

- Creating and switching trips
- Keeping a separate checklist for each trip
- Adding, packing, refreshing, and deleting items
- Saving data in PostgreSQL
- API validation and not-found responses
- Mobile layouts at 320px and 390px widths
- Frontend lint and production build
