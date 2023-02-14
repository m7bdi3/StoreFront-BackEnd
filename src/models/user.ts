import bcrypt from 'bcrypt';
import client from '../database';

// Define interfaces for user and userAuth objects
export interface user {
    firstname: string;
    lastname: string;
}

export interface userAuth {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}

// Extend the userAuth interface with an additional `id` field
export interface User extends userAuth {
    id: number;
}

// Class that stores user data and implements methods to interact with the database
export class store {
    // Get a list of all users
    async getUser(): Promise<User[]> {
        try {
            // Connect to the database
            const conn = await client.connect();

            // Query all users from the 'users' table
            const sql = 'SELECT * FROM users';
            const { rows } = await conn.query(sql);

            // Release the database connection
            conn.release();

            // Return the list of users
            return rows;
        } catch (err) {
            // Throw an error if there is a problem connecting to the database or querying for users
            throw new Error(`Can't retrieve user: ${err}`);
        }
    }

    // Create a new user
    async create(userAuth: userAuth): Promise<User> {
        const { firstname, lastname, username, password } = userAuth;
        try {
            // Hash the password using bcrypt
            const hash = bcrypt.hashSync(
                password + process.env.BCRYPT_PASSWORD,
                parseInt(process.env.SALT_ROUNDS as string, 10)
            );

            // Connect to the database
            const conn = await client.connect();

            // Insert the new user into the 'users' table and return the inserted user
            const sql = 'INSERT INTO users (firstname, lastname, username, password_digest) VALUES ($1, $2, $3, $4) RETURNING *';
            const { rows } = await conn.query(sql, [firstname, lastname, username, hash]);

            // Release the database connection
            conn.release();

            // Return the inserted user
            return rows[0];
        } catch (err) {
            // Throw an error if there is a problem connecting to the database or inserting the user
            throw new Error(`Couldn't add new user: ${firstname} ${lastname}. Error: ${err}`);
        }
    }
    // Read the user with the given id
    async read(id: number): Promise<User> {
        try {
            // Connect to the database
            const conn = await client.connect();
            // Query the user with the given id from the 'users' table
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const { rows } = await conn.query(sql, [id]);

            // Release the database connection
            conn.release();

            // Return the found user
            return rows[0];
        } catch (err) {
            // Throw an error if the user cannot be found
            throw new Error(`Could not find user ${id}. ${err}`);
        }
    }
    // Update the user with the given id
    async update(id: number, newUser: user): Promise<User> {
        try {
            // Connect to the database
            const conn = await client.connect();
            // Update the user in the 'users' table with the new user data
            const sql = 'UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *';
            const { rows } = await conn.query(sql, [
                newUser.firstname,
                newUser.lastname,
                id,
            ]);

            // Release the database connection
            conn.release();

            // Return the updated user
            return rows[0];
        } catch (err) {
            // Throw an error if the user cannot be updated
            throw new Error(
                `Could not update user ${newUser.firstname} ${newUser.lastname}. ${err}`
            );
        }
    }
    // Delete the user with the given id
    async deleteUser(id: number): Promise<boolean> {
        try {
            // Connect to the database
            const conn = await client.connect();
            // Delete the user from the 'users' table
            const sql = 'DELETE FROM users WHERE id=($1)';
            await conn.query(sql, [id]);

            // Release the database connection
            conn.release();

            // Return true if the user was deleted successfully
            return true;
        } catch (err) {
            // Throw an error if the user cannot be deleted
            throw new Error(`Could not delete user ${id}. ${err}`);
        }
    }
    // Authenticate a user with the given username and password
    async authenticate(username: string, password: string): Promise<User | null> {
        try {
            // Connect to the database
            const conn = await client.connect();
            // Query the user with the given username from the 'users' table
            const sql = 'SELECT password_digest FROM users WHERE username=($1)';
            const { rows } = await conn.query(sql, [username]);

            // If the user was found
            if (rows.length > 0) {
                const user = rows[0];

                // Compare the given password with the hashed password in the database
                if (bcrypt.compareSync(password + process.env.BCRYPT_PASSWORD, user.password_digest)) {
                    // Return the user if the password matches
                    return user;
                }
            }

            // Release the database connection
            conn.release();

            // Return null if the user wasn't found
            return null;
        } catch (err) {
            // Throw an error if the user cannot be deleted
            throw new Error(`Could not delete user ${username}. ${err}`);
        }
    }
}
