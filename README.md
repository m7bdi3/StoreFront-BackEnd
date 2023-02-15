# udacity-build-a-storefront-backend

Build a JavaScript API based on a set of requirements given by stakeholders. The project involves designing the database, tables, and columns to meet the requirements. The database schema and API route information can be found in the REQUIREMENTS.md file.

## Installation Instructions

To install all necessary packages, simply run `yarn` or `npm install` at the root directory of the repository.

Here is a list of the packages used in this project and their installation commands:

- Express: 
  `npm i -S express`
  `npm i -D @types/express`
- TypeScript: 
  `npm i -D typescript`
- db-migrate: 
  `npm install -g db-migrate`
- n: 
  `npm install -g n`
- rimraf: 
  `npm install --save rimraf`
- cors: 
  `npm install --save cors`
- bcrypt: 
  `npm -i bcrypt`
  `npm -i -D @types/bcrypt`
- Morgan: 
  `npm install --save morgan`
  `npm -i -D @types/morgan`
- nodemon: 
  `npm i nodemon`
- jsonwebtoken: 
  `npm install jsonwebtoken --sav`
  `npm -i -D @types/jsonwebtoken`
- Jasmine: 
  `npm install jasmine @types/jasmine @ert78gb/jasmine-ts ts-node --save-dev`
- Supertest: 
  `npm i supertest`
  `npm i --save-dev @types/supertest`

## Setting up the Database
Instructions: 
Open a terminal or command prompt.
- Switch to the postgres user by running the command:
su postgres
- Start the psql command-line interface by running:
psql postgres
- Create a new database user and database by running the following SQL commands:
CREATE USER full_stack_user WITH PASSWORD 'password123';
CREATE DATABASE full_stack_dev;
- Connect to the new database by running:
\c full_stack_dev
Grant all privileges on the new database to the user by running:
GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;
- Test that the database is working by running the command:
\dt
- If the database is working correctly, this command should output "No relations found."

- To set up the database, follow these steps:

1. Start the Docker container with `docker-compose up`
2. Run `npm install` to install all dependencies
3. Use `db-migrate up` to set up the database and access it at `http://127.0.0.1:5432`
4. Run `npm run build` to build the app

## Environmental Variables

Environmental variables must be set in a `.env` file. The following variables must be set:

PORT=127.0.0.1
POSTGRES_HOST="localhost"
POSTGRES_USER="###"
POSTGRES_PASSWORD="###"
POSTGRES_DB="storefront"
POSTGRES_TEST_DB="storefront"
TOKEN_KEY=###
ENV=test
BCRYPT_PASSWORD=###
SALT_ROUNDS="10"

Note that the above values are used for development and testing but not in production.

## Starting the App

To start the app, run `yarn watch` or `npm run start`. The server will be accessible at `http://127.0.0.1:3000` and the database at `port 5432`.

## Endpoints

All endpoints and their uses are described in the REQUIREMENTS.md file.

## Token and Authentication

Tokens are passed through the HTTP
