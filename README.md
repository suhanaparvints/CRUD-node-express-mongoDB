# CRUD Node, Express, and MongoDB API

A lightweight REST API for registering and logging in users and managing user records with Node.js, Express, and MongoDB's official Node.js driver. This project uses **plain MongoDB queries**—it does not use Mongoose.

## Overview

- User registration with Joi validation and bcrypt password hashing
- User login with JWT generation
- Admin credential check using environment variables
- User and admin route groups
- MongoDB CRUD operations
- CORS, Helmet security headers, and Morgan request logging

## Tech stack

- Node.js and Express 5
- MongoDB Node.js Driver
- JSON Web Token (`jsonwebtoken`)
- bcrypt
- Joi
- dotenv, CORS, Helmet, and Morgan

## Project structure

```text
server/
├── src/
│   ├── config/
│   │   ├── collection.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── validators/
│   │   ├── authValidators.js
│   │   ├── userFieldValidators.js
│   │   └── userValidators.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

## Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas connection URI

## Installation

Run these commands from the `server` directory:

```bash
npm install
```

Create a `.env` file in the `server` directory as described below, then start the API:

```bash
npm run dev
```

For a regular start without Nodemon:

```bash
npm start
```

The API uses `http://localhost:3000` by default. Set `PORT` to change the port.

## Environment configuration

Create a `.env` file in the project root (`server/`):

```dotenv
PORT=3000
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=replace_with_a_secure_password
MONGODB_URI=mongodb://127.0.0.1:27017
DATABASE=CRUD1
JWT_SECRET=replace_with_a_long_random_secret
```

| Variable         | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `PORT`           | HTTP port; defaults to `3000`                  |
| `ADMIN_USERNAME` | Username checked by the admin login endpoint   |
| `ADMIN_PASSWORD` | Password checked by the admin login endpoint   |
| `MONGODB_URI`    | MongoDB connection URI                         |
| `DATABASE`       | MongoDB database name                          |
| `JWT_SECRET`     | Secret used to sign and verify user-login JWTs |

Keep `.env` private and do not commit real credentials or secrets.

## API endpoints

Base URL for local development: `http://localhost:3000`

| Method   | Endpoint               | Access    | Description                                             |
| -------- | ---------------------- | --------- | ------------------------------------------------------- |
| `GET`    | `/health`              | Public    | Check server status                                     |
| `POST`   | `/api/auth/register`   | Public    | Register a user                                         |
| `POST`   | `/api/admin/login`     | Public    | Check configured admin credentials                      |
| `POST`   | `/api/users/login`     | Public    | Log in as a user and receive a JWT                      |
| `GET`    | `/api/admin/users`     | Admin JWT | List users                                              |
| `PATCH`  | `/api/users/:id`       | Valid JWT | Update a user's name                                    |
| `PUT`    | `/api/users/:id`       | Valid JWT | Update a user's name, age, address, email, and password |
| `PUT`    | `/api/admin/users/:id` | Admin JWT | Update a user's name, age, address, email, and password |
| `DELETE` | `/api/admin/users/:id` | Admin JWT | Delete a user                                           |

Use a MongoDB document's `_id` for `:id` in these paths. It should be a 24-character hexadecimal ObjectId.

## Testing in Postman

For JSON requests, select **Body → raw → JSON** and set `Content-Type: application/json`. For protected routes, select **Authorization → Bearer Token** and paste the JWT returned by user login. The header form is:

```http
Authorization: Bearer <jwt-token>
```

### 1. Health check

```http
GET http://localhost:3000/health
```

Expected response (`200 OK`):

```json
{
  "status": "OK",
  "message": "The server is running"
}
```

### 2. Register a user

```http
POST http://localhost:3000/api/auth/register
```

Body:

```json
{
  "name": "Jane Doe",
  "age": 30,
  "email": "jane@example.com",
  "address": "123 Main Street",
  "password": "Abcdef1@",
  "role": "user"
}
```

`name`, `email`, and `password` are required. `age`, `address`, and `role` are optional. The role, when provided, must be `admin` or `user`. Passwords must contain an uppercase letter, a lowercase letter, a number, and a special character from `@$!%*?&`, and must be at least 6 characters long. The name must be 3–50 characters and contain only letters and spaces.

Expected successful response (`200 OK`):

```json
{
  "status": "ok",
  "message": "successfully registered"
}
```

Use an email address that is not already registered when trying the request again.

### 3. Admin login

```http
POST http://localhost:3000/api/admin/login
```

Body (values must match `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env`):

```json
{
  "username": "admin@example.com",
  "password": "replace_with_a_secure_password"
}
```

This endpoint currently returns a success message but **does not return a JWT**. See [Authentication limitations](#authentication-limitations) before using protected admin routes.

### 4. User login

```http
POST http://localhost:3000/api/users/login
```

Body:

```json
{
  "email": "jane@example.com",
  "password": "Abcdef1@"
}
```

Expected successful response (`200 OK`):

```json
{
  "status": "OK",
  "message": "login successfully",
  "token": "<jwt-token>"
}
```

Copy `token` to use as the Bearer Token for the protected requests below.

### 5. List all users

```http
GET http://localhost:3000/api/admin/users
```

Set Authorization to **Bearer Token** with the token from user login. The response has a `data` array of user documents. Currently, the handler's MongoDB projection is misspelled, so the response may include password hashes; do not expose this endpoint publicly until corrected.

### 6. Update a user's name

Replace `:id` with the user's MongoDB `_id`:

```http
PATCH http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

Set Authorization to **Bearer Token**. Body:

```json
{
  "name": "Jane Smith"
}
```

### 7. Update a user record

Either route below accepts the same required body:

```http
PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

or:

```http
PUT http://localhost:3000/api/admin/users/507f1f77bcf86cd799439011
```

Set Authorization to **Bearer Token**. Body:

```json
{
  "name": "Jane Smith",
  "age": 31,
  "email": "jane.smith@example.com",
  "address": "456 New Street",
  "password": "NewPassword1@"
}
```

The API currently stores the password from this update request without hashing it. Avoid changing passwords through this route until that is fixed.

### 8. Delete a user

```http
DELETE http://localhost:3000/api/admin/users/507f1f77bcf86cd799439011
```

Set Authorization to **Bearer Token**. The current validator also requires a JSON body containing the ID:

```json
{
  "id": "507f1f77bcf86cd799439011"
}
```

Use the same MongoDB `_id` in the path and body.

## Authentication limitations

- User login currently places the `Admin` role in every generated JWT, irrespective of the registered user's role. Consequently, a user-login token currently passes the admin middleware check.
- Admin login checks the configured credentials but does not issue a JWT. It cannot by itself authenticate calls to admin-protected routes.
- User-protected update routes accept any valid JWT and do not check that the caller owns the requested record.
- The user-list handler currently uses the wrong MongoDB projection option and may return password hashes.
- Full user updates save the supplied password as plain text instead of hashing it.

These behaviors are documented so requests can be tried in Postman, not as a recommendation for production. Do not treat the current role checks as a security boundary or expose this API with real user data until these issues are fixed.

## Validation

Joi validates registration and user update request bodies. Update route IDs are checked as 24-character hexadecimal strings. Validation errors return `400 Bad Request` with a `details` array.

## Development scripts

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the API with Nodemon         |
| `npm start`            | Start the API with Node.js         |
| `npm run format`       | Format project files with Prettier |
| `npm run format:check` | Check formatting with Prettier     |

## License

This project uses the ISC license declared in `package.json`.
