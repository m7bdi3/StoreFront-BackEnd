import bcrypt from 'bcrypt';
import client from '../database';

// Define the shape of a user authentication object
export interface UserAuth {
    firstname: string;
    lastname: string;
    username: string;
    password_digest: string;
}

// Define the shape of a user object
export interface User extends UserAuth {
    password_digest: string;
    id: number;
}

// Create a class that encapsulates user operations
export class UserStore {
    create(user: UserAuth): User {
        throw new Error('Method not implemented.');
    }
    getUser(): UserAuth[] | PromiseLike<UserAuth[]> {
        throw new Error('Method not implemented.');
    }
    read(id: number): User | PromiseLike<User> {
        throw new Error('Method not implemented.');
    }
    update(id: number, updatedUser: { firstname: string; lastname: string; username: string; }): User | PromiseLike<User> {
        throw new Error('Method not implemented.');
    }
    
    // Retrieve all users
    async getAllUsers(): Promise<User[]> {
        const conn = await client.connect();
        const sql = 'SELECT * FROM users';
        const { rows } = await conn.query(sql);
        conn.release();
        return rows;
    }


    // Create a new user
    async createUser(userAuth: UserAuth): Promise<User> {
        const { firstname, lastname, username, password_digest } = userAuth;
        const hash = bcrypt.hashSync(
            password_digest + process.env.BCRYPT_PASSWORD,
            parseInt(process.env.SALT_ROUNDS as string, 10)
        );
        const conn = await client.connect();
        const sql = 'INSERT INTO users (firstname, lastname, username, password_digest) VALUES ($1, $2, $3, $4) RETURNING *';
        const { rows } = await conn.query(sql, [firstname, lastname, username, hash]);
        conn.release();
        return rows[0];
    }

    // Retrieve a user by ID
    async getUserById(id: number): Promise<User> {
        const conn = await client.connect();
        const sql = 'SELECT * FROM users WHERE id=($1)';
        const { rows } = await conn.query(sql, [id]);
        conn.release();
        return rows[0];
    }

    // Update a user's details by ID
    async updateUser(id: number, newUser: UserAuth): Promise<User> {
        const conn = await client.connect();
        const sql = 'UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *';
        const { rows } = await conn.query(sql, [newUser.firstname, newUser.lastname, id]);
        conn.release();
        return rows[0];
    }

    // Delete a user by ID
    async deleteUser(id: number): Promise<boolean> {
        const conn = await client.connect();
        const sql = 'DELETE FROM users WHERE id=($1)';
        await conn.query(sql, [id]);
        conn.release();
        return true;
    }


    // Authenticate a user by username and password
    async authenticate(username: string, password_digest: string): Promise<User | null> {
        const conn = await client.connect();
        const sql = 'SELECT password_digest FROM users WHERE username=($1)';
        const { rows } = await conn.query(sql, [username]);
        if (rows.length > 0) {
            const user = rows[0];
            if (bcrypt.compareSync(password_digest + process.env.BCRYPT_PASSWORD, user.password_digest)) {
                return user;
            }
        }
        conn.release();
        return null;
    }
}
