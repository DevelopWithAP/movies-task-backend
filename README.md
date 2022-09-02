## My Movies Back End

## Aim
The Aim of this project was to implement a RESTful Back End service using `NestJS`.

## Technologies
* `Guards` for secure route handling.
* `Pipes` for secure input data transformation and validation.
* `JWT` for user authentication.
* `Prisma` for interfacing with the `Postgres` database.

## Installation

### General
Navigate to the root folder of the project and run `npm install` to install all dependencies.

### Database
1. Install `Prisma` by running `npm install prisma --save-dev` from the root of the project.
2. Create a `.env` file of the following structure
```
DATABASE_URL="postgresql://postgres:letmein@localhost:5432/mydb?schema=public"

JWT_TOKEN='your own generated token'
```
3. With `Docker` installed run: `docker compose up task-db -s -f -v` to start the `Postgres` image.

## Scripts
* `npm run db:dev:restart` will stop the currently running `Docker` container, delete all current database entries, re-spawn the container and re-deploy the database migrations.
* `npm run start:dev` will start the development server.

## RESTful routes

### Authentication
#### Sign Up
* URL: `http://localhost:4000/auth/signup`
* ACCEPTS: `POST`
* EXAMPLE REQUEST:
```
POST URL
BODY: {
  "email": "myEmail@mail.com",
  "password": "mypassword"
}
```
* EXAMPLE RESPONSE:
```
Status: 201 Created
""access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoic2ltYmFAZ21haWwuY29tIiwiaWF0IjoxNjYyMTI0ODczLCJleHAiOjE2NjIxMzIwNzN9.CZ1kDB19w0SmzXiIydsEtbMdOisYqWxnZ6Mu6nyYIPY"

```
* EXAMPLE REQUEST:
```
POST URL
BODY: {
  "email": "myMalformedEmail"
  "password": "mypassword"
}
```
* EXAMPLE RESPONSE:
```
Status: 401 Bad Request
{
  "statusCode": 400,
  "message": [
    "email must be an email"
  ],
  "error": "Bad Request"
}

```

### Login
* URL: `http://localhost:4000/auth/login`
* ACCEPTS: `POST`
* EXAMPLE REQUEST:
```
POST URL
BODY: {
  "email": "myEmail@mail.com",
  "password": "mypassword"
}
```
* EXAMPLE RESPONSE:
```
Status: 200 OK
""access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoic2ltYmFAZ21haWwuY29tIiwiaWF0IjoxNjYyMTI0ODczLCJleHAiOjE2NjIxMzIwNzN9.CZ1kDB19w0SmzXiIydsEtbMdOisYqWxnZ6Mu6nyYIPY"

```

* EXAMPLE REQUEST:
```
POST URL
BODY: {
  "email": "myMalformedEmail"
  "password": "mypassword"
}
```
* EXAMPLE RESPONSE:
```
Status: 400 Bad Request
{
  "statusCode": 400,
  "message": [
    "email must be an email"
  ],
  "error": "Bad Request"
}

```

### User
#### Authenticated users only
* URL: `http://localhost:4000/users/personal`
* ACCEPTS: `GET`
* EXAMPLE REQUEST:
```
GET URL
BODY: {
  "email": "myEmail@mail.com",
  "password": "mypassword"
}
HEADERS: {
'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoic2ltYmFAZ21haWwuY29tIiwiaWF0IjoxNjYyMTI0ODczLCJleHAiOjE2NjIxMzIwNzN9.CZ1kDB19w0SmzXiIydsEtbMdOisYqWxnZ6Mu6nyYIPY'
}
```
* EXAMPLE RESPONSE:
```
Status: 200 OK
{
  "id": 12,
  "email": "myEmail@gmail.com",
  "createdAt": "2022-09-02T13:21:13.102Z"
}
```

* EXAMPLE REQUEST:
```
GET URL
BODY: {
  "email": "myMalformedEmail"
  "password": "mypassword"
}
HEADERS: {
  'Authorization': 'Bearer a non-valid token'
}
```
* EXAMPLE RESPONSE:
```
Status: 401 Unauthorized
{
  "statusCode": 400,
  "message": "unauthorized"
}

```
