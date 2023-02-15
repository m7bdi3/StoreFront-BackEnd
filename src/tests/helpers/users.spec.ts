import supertest from 'supertest';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { userAuth } from '../../models/user';
import { app } from '../../server';
const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;
describe('User Handler', () => {
    const userData: userAuth = {
        username: 'ChrisAnne',
        firstname: 'Chris',
        lastname: 'Anne',
        password: 'password123',
    };
    let token: string, userId: number;
    beforeAll(async () => {
        const res = await supertest(app)
            .post('/users/create')
            .send(userData);

        token = res.body;
        const { user } = jwt.verify(token, SECRET) as JwtPayload;
        userId = user.id;
    });
    it('should create a user', async () => {
        const res = await supertest(app)
            .post('/users/create')
            .send(userData);

        expect(res.status).toBe(200);
    });
    it('should get the index of users', async () => {
        const res = await supertest(app)
            .get('/users')
            .set('Authorization', 'bearer ' + token);

        expect(res.status).toBe(200);
    });
    it('should get a single user by id', async () => {
        const res = await supertest(app)
            .get(`/users/${userId}`)
            .set('Authorization', 'bearer ' + token);

        expect(res.status).toBe(200);
    });
    it('should update a user', async () => {
        const newUserData: userAuth = {
            ...userData,
            firstname: 'Chris',
            lastname: 'Anne',
        };
        const res = await supertest(app)
            .put(`/users/${userId}`)
            .send(newUserData)
            .set('Authorization', 'bearer ' + token);

        expect(res.status).toBe(200);
    });
    it('should authenticate a user with correct credentials', async () => {
        const res = await supertest(app)
            .post('/users/authenticate')
            .send({
                username: userData.username,
                password: userData.password,
            })
            .set('Authorization', 'bearer ' + token);

        expect(res.status).toBe(200);
    });
    it('should not authenticate a user with incorrect credentials', async () => {
        const res = await supertest(app)
            .post('/users/authenticate')
            .send({
                username: userData.username,
                password: 'incorrect_password',
            })
            .set('Authorization', 'bearer ' + token);

        expect(res.status).toBe(401);
    });
});