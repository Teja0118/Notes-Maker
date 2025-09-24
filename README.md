# Notes Maker

full-stack notes application (React client + Express/Postgres server).

This README explains how to set up and run the project on Windows (PowerShell).

## Prerequisites

- Node.js (LTS recommended, e.g. 18.x or 20.x)
- npm (bundled with Node.js)
- PostgreSQL (server running locally or remotely)
- (Windows only) Build tools if native modules fail (Visual Studio Build Tools / C++ tools) — required in some setups for `bcrypt`.
- (optional) Git and GitHub CLI `gh` for repo management

## Project layout

Root folder contains `client/` (React app) and `server/` (Express API).

- `client/` — React app (Create React App). Start with `npm start` and runs on http://localhost:3000.
- `server/` — Node.js Express API. Starts on port 5000 by default.

## Environment variables

Server reads DB credentials from environment variables. Do NOT commit real secrets. Create `server/.env` (ignored by `.gitignore`) or set environment variables in your system.

Example `server/.env.example` (create this file based on the values below but DO NOT store real passwords in VCS):

```
DB_USER=
DB_HOST=localhost
DB_NAME=notes
DB_PASSWORD=
DB_PORT=5432
```

The repository currently uses these names in `server/server.js` via `process.env`.

## Database schema

Recommended schema (use `psql` or a DB client to run the statements):

```sql
-- users table (id is canonical PK)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  usertype VARCHAR(50)
);

-- note table referencing users.username (this repo uses username in notes),
-- but referencing users.id is recommended for new designs.
CREATE TABLE note (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  username VARCHAR(255) REFERENCES users(username)
);
```

Notes:
- If you want to reference `users.id` instead, create `note.user_id INTEGER REFERENCES users(id)`.
- If `users` already exists and you want `username` as the FK target, ensure `username` has a `UNIQUE` constraint.

## Setup steps (Windows PowerShell)

1. Install dependencies for server and client.

```powershell
# From project root
cd 'D:\Projects\Notes Maker\server'

npm install

cd ..\client
npm install
```

2. Create the database and tables (example using the default `postgres` superuser).

```powershell
# Open psql prompt (you may need to add PostgreSQL to PATH or run psql from the install directory)
psql -U postgres -d postgres

# inside psql, create DB and run schema
CREATE DATABASE notes;
\c notes
-- then paste and run the CREATE TABLE statements from the Database schema section above
```

3. Create `server/.env` (do not commit this file) and set credentials matching your DB.

Example `server/.env` format (no quotes):

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=notes
DB_PASSWORD=YourStrongPasswordHere
DB_PORT=5432
```

4. Start the server and client (two shells):

```powershell
# Shell 1: start server
cd 'D:\Projects\Notes Maker\server'

npm run start

# Shell 2: start client
cd 'D:\Projects\Notes Maker\client'

npm start
```

The client uses `proxy` (see `client/package.json`) to forward API calls to `http://localhost:5000`.

## Troubleshooting

- Server fails to start (common reasons):
  - PostgreSQL not running or credentials in `server/.env` are incorrect — check connection and `pg` logs.
  - `bcrypt` installation or runtime errors on Windows — install Visual Studio Build Tools (C++). Alternatively you can replace `bcrypt` with `bcryptjs` (code change required).
  - Port conflicts: make sure ports 3000 (client) and 5000 (server) are free or change ports.

- Database FK error: "there is no unique constraint matching given keys for referenced table \"users\"" — add `UNIQUE` to `users.username` or reference `users.id` instead. See Database schema section.

## Helpful commands

- Create an `.env.example` file to track required env vars without secrets.
- Add `.gitignore` entries:
```
node_modules/
.env
*.log
.vscode/
```

## Version control & GitHub

- Do NOT commit `server/.env` or other secret files. Add them to `.gitignore`.
- Create a `README.md` (this file) and a `LICENSE` before making the initial public repo.

