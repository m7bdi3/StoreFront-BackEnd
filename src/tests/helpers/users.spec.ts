import { UserCredentials } from '../../models/user';
import jwt, { Secret } from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../server';

const Secret_Token_Key = process.env.TOKEN_KEY as Secret;
const request = supertest(app);


describe('Handler The User', () => {
    const dataOfUser: UserCredentials = {
        username: 'jackjones',
        firstname: 'jack',
        lastname: 'jones',
        password: 'password123',
    };

    let theToken: string;
    let idOfUser = 1;

    it('Get The Create End-Point', async () => {
        const res = await request.post('/usersroutes/create').send(dataOfUser);
        const { body, status } = res;
        theToken = body;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { user } = jwt.verify(theToken, Secret_Token_Key);
        idOfUser = user.id;
        expect(status).toBe(200);
    });

    // Test the Delete End-Point after the user is created
    it('Get The Delete End-Point', async () => {
        const res = await request.delete(`/usersroutes/${idOfUser}`).set('Authorization', 'bearer ' + theToken);
        expect(res.status).toBe(200);
    });

    it('Get The Index End-Point', async () => {
        const res = await request.get('/usersroutes').set('Authorization', 'bearer ' + theToken);
        expect(res.status).toBe(200);

    });

    it('Get The Read End-Point', async () => {
        const res = await request.get(`/usersroutes/${idOfUser}`).set('Authorization', 'bearer ' + theToken);
        expect(res.status).toBe(200);

    });

    it('Get The Update End-Point', async () => {
        const newdataOfUser: UserCredentials = {
            ...dataOfUser,
            firstname: 'jack',
            lastname: 'jones',
        };
        const res = await request.put(`/usersroutes/${idOfUser}`).send(newdataOfUser).set('Authorization', 'bearer ' + theToken);
        expect(res.status).toBe(200);

    });

    it('Get The Authenticate End-Pont', async () => {
        const res = await request.post('/usersroutes/authenticate').send({
            username: dataOfUser.username,
            password: dataOfUser.password,
        }).set('Authorization', 'bearer ' + theToken);
        expect(res.status).toBe(200);

    });

    it('Get The Authenticate With Wrong Password', async () => {
        const res = await request.post('/usersroutes/authenticate')
            .send({
                username: dataOfUser.username,
                password: 'trtdtxcfcf',
            })
            .set('Authorization', 'bearer ' + theToken);
        expect(res.status).toBe(401);
    });

});
