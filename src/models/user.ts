import client from '../database';
import bcrypt from 'bcrypt';

export interface UserFront {
    firstname: string;
    lastname: string;
}

export interface UserCredentials  {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}
export interface User extends UserCredentials  {
    id: number;
}

export class UserStore {
    async truncate() {
        try {
            // Truncate the "users" table
            const connection = await client.connect();
            const sql = 'TRUNCATE TABLE users RESTART IDENTITY;'
            const { rows } = await connection.query(sql);
            connection.release();
            return rows;
        } catch (err) {
            console.error(err);
        }
    }
    async getUser(): Promise<User[]> {
        try {
            const connection = await client.connect();
            const sql = 'SELECT * FROM users';
            const { rows } = await connection.query(sql);
            connection.release();
            return rows;
        } catch (err) {
            throw new Error(`Can't Get The User, Because: ${err}`);
        }
    }
    async createUser(user: UserCredentials): Promise<User> {
        const { firstname,
            lastname,
            username,
            password
        } = user;
        try {
            const sql = 'INSERT INTO users (firstname, lastname, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
            const hash = bcrypt.hashSync(
                password + process.env.BCRYPT_PASSWORD,
                parseInt(process.env.SALT_ROUNDS as string, 10)
            );
            const connection = await client.connect();
            const { rows } = await connection.query(sql, [firstname, lastname, username, hash]);
            connection.release();
            return rows[0];
        } catch (err) {
            throw new Error(`Can't Add The New User: ${firstname} ${lastname} Because: ${err}`);
        }
    }
    async getUserById(id: number): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const connection = await client.connect();
            const { rows } = await connection.query(sql, [id]);
            connection.release();
            return rows[0];
        } catch (err) {
            throw new Error(`Can't Find The User ID: ${id} Because: ${err}`);
        }
    }
    async getUserByName(username: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE username=($1)';
            const connection = await client.connect();
            const { rows } = await connection.query(sql, [username]);
            connection.release();
            return rows[0];
        } catch (err) {
            throw new Error(`Can't Find The User Username: ${username} Because: ${err}`);
        }
    }
    async updateUser(id: number, newdataOfUser: UserFront): Promise<User> {
        try {
            const sql = 'UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *';
            const connection = await client.connect();
            const { rows } = await connection.query(sql, [
                newdataOfUser.firstname,
                newdataOfUser.lastname,
                id,
            ]);
            connection.release();
            return rows[0];
        } catch (err) {
            throw new Error(
                `Can't Update The User: ${newdataOfUser.firstname} ${newdataOfUser.lastname} Because: ${err}`
            );
        }
    }
    async deleteUserById(id: number): Promise<boolean> {
        try {
            const sql = 'DELETE FROM users WHERE id=($1)';
            const connection = await client.connect();
            await connection.query(sql, [id]);
            connection.release();
            return true;
        } catch (err) {
            throw new Error(`Can't Delete The User ID: ${id} Because: ${err}`);
        }
    }
    async authenticateUser(username: string, password: string): Promise<User | null> {
        try {
            const sql = 'SELECT password_digest FROM users WHERE username=($1)';
            const conn = await client.connect();
            const { rows } = await conn.query(sql, [username]);
            if (rows.length > 0) {
                const user = rows[0];
                if (bcrypt.compareSync(password + process.env.BCRYPT_PASSWORD, user.password_digest)) {
                    return user;
                }
            }
            conn.release();
            return null;
        } catch (err) {
            throw new Error(`Can't Find The User: ${username} Because: ${err}`);
        }
    }
}
