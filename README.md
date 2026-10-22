# CRUD Node, Express, and MongoDB API

A user management REST API built with Node.js, Express, and MongoDB, featuring account registration, JWT-based login, and endpoints to manage user records.

## Features

- User registration with Joi validation and bcrypt password hashing
- Login with JSON Web Token (JWT) authentication
- User listing, name updates, full replacement, and deletion
- MongoDB access using the official Node.js driver

## Requirements

- Node.js and npm
- A running MongoDB instance

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```dotenv
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017
   DATABASE=your_database_name
   JWT_SECRET=use_a_long_random_secret
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   For a regular start, run `npm start`. The API uses port `3000` unless `PORT` is set.

## API endpoints

All endpoints accept and return JSON where applicable. Use the MongoDB document `_id` for `:id` paths. Send the login token in the `Authorization` header as a Bearer token on protected routes.

| Method   | Endpoint             | Description              | Access      |
| -------- | -------------------- | ------------------------ | ----------- |
| `GET`    | `/health`            | Check server status      | Public      |
| `POST`   | `/api/auth/register` | Register a user          | Public      |
| `POST`   | `/api/auth/login`    | Log in and receive a JWT | Public      |
| `GET`    | `/api/users`         | List users               | Admin token |
| `PATCH`  | `/api/users/:id`     | Update a user's name     | Valid JWT   |
| `PUT`    | `/api/users/:id`     | Replace a user's details | Admin token |
| `DELETE` | `/api/users/:id`     | Delete a user            | Admin token |

### Register

`POST /api/auth/register`

Required fields: `name`, `email`, and `password`. `age`, `address`, and `role` are optional.

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "StrongPass1!",
  "age": 30,
  "address": "123 Main Street",
  "role": "user"
}
```

Passwords must be 6–128 characters and contain uppercase and lowercase letters, a number, and a special character.

### Log in

`POST /api/auth/login`

```json
{
  "email": "alex@example.com",
  "password": "StrongPass1!"
}
```

The response includes a `token` for protected endpoints.

### Update a user's name

`PATCH /api/users/:id`

Requires a valid JWT. Body:

```json
{
  "name": "Alex Morgan"
}
```

### Replace a user

`PUT /api/users/:id`

Requires an admin token. All fields are required: `name`, `age`, `address`, `email`, `role`, and `password`. The password is hashed before storage.

### List and delete users

- `GET /api/users` — Requires an admin token; returns users in the `data` array.
- `DELETE /api/users/:id` — Requires an admin token; deletes the user with that MongoDB `_id`.

## Development scripts

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Start the server with Nodemon |
| `npm start`            | Start the server              |
| `npm run format`       | Format files with Prettier    |
| `npm run format:check` | Check formatting              |

## Technology stack

- **Node.js** and **Express 5** — Runtime and API framework
- **MongoDB Node.js Driver** — Database access (no Mongoose)
- **bcrypt** and **jsonwebtoken** — Password hashing and JWT authentication
- **Joi** — Request validation
- **dotenv**, **CORS**, **Helmet**, and **Morgan** — Configuration, cross-origin requests, security headers, and logging

## Project structure

```text
src/
├── config/        # MongoDB setup and collection names
├── controllers/   # Authentication and user request handlers
├── middlewares/   # JWT authentication and request validation
├── routes/        # Auth, user, and admin route modules
├── validators/    # Joi schemas
└── index.js       # Express app setup and server startup
```

## Security

- Keep `.env` private and never commit real credentials or JWT secrets.
- Before deployment, correct the login role assignment: the current login handler issues every token with the `Admin` role.
- Ensure user-list responses exclude password hashes; the current MongoDB query uses `project` instead of the driver's `projection` option.
- The name-update route requires a valid token but does not check whether the user owns the requested record.

## MongoDB note

User records are stored in the `users` collection. The MongoDB driver assigns each document an `_id`; use that value in user update and delete requests.
