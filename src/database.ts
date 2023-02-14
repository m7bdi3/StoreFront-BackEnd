import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load the environment variables from the .env file using dotenv
dotenv.config();

const {
    POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_TEST_DB, ENV
} = process.env;

// Initialize the client with an empty Pool object
let client: Pool = new Pool({});

// Check the value of the ENV variable
if (ENV === 'test') {
    // If the ENV variable is 'test', initialize the client with the test database configuration
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    });
} else if (ENV === 'dev') {
    // If the ENV variable is 'dev', initialize the client with the development database configuration
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    });
} else {
    console.log('Invalid environment, defaulting to an empty client.');
}

export default client;
