# JWKS Server – Project 1

## Overview

This project implements a JSON Web Key Set (JWKS) server using Node.js and Express.

It provides:

A JWKS endpoint exposing valid public keys

An authentication endpoint that returns signed JWTs

Support for expired JWT generation

Proper HTTP method enforcement and status codes

Automated test coverage


## Technologies Used

Node.js (ES Modules)

Express

jose (JWT signing)

Jest (testing)

ESLint (linting)


## Installation

Install dependencies:

npm install

Running the Server

Start the server:

npm start

Default address:

http://localhost:8080

To use a custom port:

PORT=3000 npm start

API Endpoints
JWKS Endpoint

GET /.well-known/jwks.json

Returns a JSON Web Key Set containing all valid public keys.

Responses:

200 OK – Returns JWKS JSON

405 Method Not Allowed – For unsupported methods

Authentication Endpoint

POST /auth

Returns a signed JWT.

Query parameter:

/auth?expired=true → returns an expired JWT

Responses:

200 OK – Returns signed JWT

405 Method Not Allowed – For unsupported methods

500 Internal Server Error – If key initialization fails

Status Codes

200 – Success

404 – Not Found

405 – Method Not Allowed

500 – Internal Server Error


## Running Tests

Run test suite:

npm test

Tests validate:

Valid JWT generation

Expired JWT generation

Proper HTTP method enforcement

JWKS key validity


### Test Coverage

Generate coverage report:

npm test -- --coverage

Coverage output is written to the coverage/ directory.


## Linting

Run ESLint:

npx eslint .

The project is configured with ESLint flat config and passes with zero errors.

## Project Structure

.
├── server.js
├── keyStore.js
├── authService.js
├── jwksService.js
├── server.test.js
├── package.json
├── eslint.config.js
└── README.md
