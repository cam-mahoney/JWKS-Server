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

## AI Use
Throughout the development of this JWKS server, I utilized Gemini (AI) as a comprehensive collaborator for architectural guidance, debugging, and quality assurance. My process involved iterative prompting to implement the core requirements, such as RSA key pair generation with unique 'kid' identifiers and the logic for the /auth endpoint's 'expired' query parameter. I used the AI to help troubleshoot environment-specific issues, including configuring the .eslintrc.json for ES Modules and resolving case-sensitivity errors in my file structure. I prompted the AI to help identify missing logical branches in my Jest suite, specifically for handling 404 and 405 status codes. While the AI assisted in generating initial code structures and refining my linter setup, I manually verified all logic against the project rubric and ensured the final server functioned correctly against the required blackbox testing client.
