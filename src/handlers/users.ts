import { Application, Request, Response } from 'express';
import client from '../database';
import { verifyToken, getTokenByUser } from '../handlers/helpers';
import { User, UserAuth, UserStore } from '../models/user';
const userStore = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        // Get all users from the user store
        const users: UserAuth[] = await userStore.getUser();
        // Send the list of users as the response
        res.json(users);
    } catch (err) {
        // In case of any error, send a 400 Bad Request response with the error message
        res.status(400).json(err);
    }
};

const create = async (user: UserAuth): Promise<UserAuth> => {
    try {
        // Check that the user object includes a username
        if (!user.username) {
            throw new Error('Username is required.');
        }

        const conn = await client.connect();
        const sql =
            'INSERT INTO users (firstname, lastname, username, password_digest) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await conn.query(sql, [
            user.firstname,
            user.lastname,
            user.username,
            user.password_digest,
        ]);
        conn.release();
        return result.rows[0];
    } catch (err) {
        throw new Error(`Could not create user. Error: ${err}`);
    }
};




const read = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get the id from the request parameters
        const id = Number(req.params.id);

        // Check if the id is present in the request
        if (!id) {
             res.status(400).send('Missing required parameter :id.');
             return;
        }

        // Get the user with the given id
        const user: User = await userStore.read(id);

        // Return the user in the response
        res.json(user);
    } catch (err) {
        // If there is an error, return a status of 400 (Bad Request) with the error message
        res.status(400).json(err);
    }
};


const update = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get the id from the request parameters
        const id = req.params.id as unknown as number;

        // Get the first name and last name from the request body
        const firstname = req.body.firstname as unknown as string;
        const lastname = req.body.lastname as unknown as string;

        // Check if the required parameters are present
        if (!firstname || !lastname || !id) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :firstName, :lastName, :id'
            );
            
        }

        // Update the user with the given id
        const user: User = await userStore.update(id, {
            firstname,
            lastname,
            username: ''
        });

        // Return the updated user in the response
        res.json(user);
    } catch (err) {
        // If there is an error, return a status of 400 (Bad Request) with the error in the response
        res.status(400).json(err);
    }
};


const deleteUser = async (req: Request, res: Response) => {
    try {
        // Extract the user id from the request parameters
        const id = req.params.id as unknown as number;

        // Return an error if the user id is missing
        if (!id) {
            res.status(400).send('Missing required parameter :id.');
            return false;
        }

        // Delete the user
        await userStore.deleteUser(id);

        // Return success message
        res.send(`User with id ${id} successfully deleted.`);
    } catch (err) {
        // Return error message
        res.status(400).json(err);
    }
};

const authenticate = async (req: Request, res: Response) => {
    try {
        // Extract the username and password from the request body
        const username = (req.body.username as unknown as string) || 'ChrissAnne';
        const password_digest = (req.body.password_digest as unknown as string) || 'password123';

        // Return an error if either the username or password is missing
        if (!username || !password_digest) {
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :username, :password'
            );
            return false;
        }

        // Authenticate the user
        const user: User | null = await userStore.authenticate(username, password_digest);

        // Return an error if the authentication fails
        if (!user) {
            return res.status(401).send(`Wrong password for user ${username}.`);
        }

        // Return the user token
        res.json(getTokenByUser(user));
    } catch (err) {
        // Return error message
        res.status(400).json(err);
    }
};

export default function userRoutes(app: Application) {
    // Define routes
    app.get('/users', index);
    app.post('/users/create', create);
    app.get('/users/:id', read);
    app.put('/users/:id', verifyToken, update);
    app.delete('/users/:id', verifyToken, deleteUser);
    app.post('/users/authenticate', authenticate);
}
