import { verifyToken, createToken } from './helpers';
import { Application, Request, Response } from 'express';
import { User, UserStore } from '../models/user';

const userStores = new UserStore();

const authenticate = async (req: Request, res: Response) => {
    try {
        const username = req.body.username || "jackjones";
        const password = req.body.password || "password123";

        if (!username || !password) {
            return res.status(400).send("Username and password are required");
        }

        const user: User | null = await userStores.authenticateUser(username, password);

        if (!user) {
            return res.status(401).send("Incorrect username or password");
        }

        const token = createToken(user);
        return res.status(200).json({ token });
    } catch (err) {
        return res.status(500).send(err);
    }
};


const index = async (_req: Request, res: Response) => {
    try {
        const users: User[] = await userStores.getUser();
        res.json(users);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const deleteTheUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        if (!id) {
            return res.status(400).send(`Couldn't find user with id ${id}`);
        }

        const result = await userStores.deleteUserById(id);
        if (result === false) {
            return res.status(404).send(`User with id ${id} not found`);
        }

        return res.status(200).send(`User with id ${id} has been deleted`);
    } catch (err) {
        res.status(400).json(err);
    }
};


const create = async (req: Request, res: Response) => {
    try {
        const firstname = req.body.firstname as unknown as string;
        const lastname = req.body.lastname as unknown as string;
        const username = req.body.username as unknown as string;
        const password = req.body.password as unknown as string;
        if (!firstname || !lastname || !username || !password) {
            res.status(400).send(`Couldn't Create user ${username}`);
            return false;
        }
        const user: User = await userStores.createUser({
            firstname,
            lastname,
            username,
            password,
        });
        res.json(createToken(user));
        console.log(userStores.getUserByName(user.firstname))
    } catch (err) {
        console.log(err);
        res.status(400);
        res.json(err);
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const firstname = req.body.firstname as unknown as string;
        const lastname = req.body.lastname as unknown as string;
        if (!firstname || !lastname || !id) {
            res.status(400).send(`Couldn't Update user with id: ${id}`);
            return false;
        }
        const user: User = await userStores.updateUser(id, {
            firstname,
            lastname,
        });
        res.json(user);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        if (!id) {
            res.status(400).send(`Couldn't get user with id: ${id}`);
        }
        const user: User = await userStores.getUserById(id);
        res.json(user);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const usersRoutes = (app: Application) => {
    app.delete('/usersroutes/:id', verifyToken, deleteTheUser);
    app.put('/usersroutes/:id', verifyToken, update);
    app.post('/usersroutes/authenticate', authenticate);
    app.get('/usersroutes/:id', getUser);
    app.post('/usersroutes/create', create);
    app.get('/usersroutes', index);
}

export default usersRoutes;