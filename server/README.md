Setup

- Copy `server/.env.example` to `server/.env` and fill values for `DB_USER`, `PASSWORD`, and `DATABASE`.
- Create tables by running the SQL in `server/sql/schema.sql` against your MySQL instance.
- Install server dependencies in `server`:
  - `npm install`
  - `npm install mysql2 bcryptjs`
- Start the API: `npm run dev` (or `npm start`).

Notes

- Env variable naming is standardized to `DB_USER` for the database user. `dbService.js` and `dbUserService.js` both respect `DB_USER`, with safe fallbacks.
- The legacy endpoints operate on the `names` table. The new `/register` and `/login` endpoints operate on the `Users` table.
