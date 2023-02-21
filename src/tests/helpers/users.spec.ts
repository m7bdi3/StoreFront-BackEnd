import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';

import { UserAuth } from '../../models/user';
import app from '../../server';

const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

describe('User Handler', () => {
  const userData: UserAuth = {
    username: 'ChrisAnne',
    firstname: 'Chris',
    lastname: 'Anne',
    password_digest: 'password123',
  };

  let token: string,
    userId = 1;

  it('should gets the create endpoint', async (done) => {
    const res = await request.post('/users/create').send(userData);

    const { body, status } = res;
    token = body.token; // only set the token string
    console.log(token)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token, SECRET);
    userId = user.id;

    expect(status).toBe(200);
    done();
  });

  it('should gets the index endpoint', async (done) => {
    const res = await request.get('/users').set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('should get the read endpoint', async (done) => {
    const res = await request.get(`/users/${userId}`).set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('should get the update endpoint', async (done) => {
    const newUserData: UserAuth = {
      ...userData,
      firstname: 'Chris',
      lastname: 'Anne',
    };

    const res = await request
      .put(`/users/${userId}`)
      .send(newUserData)
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('should get the auth endpoint', async (done) => {
    const res = await request
      .post('/users/authenticate')
      .send({
        username: userData.username,
        password: userData.password_digest,
      })
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('should get the auth endpoint with wrong password', async (done) => {
    const res = await request
      .post('/users/authenticate')
      .send({
        username: userData.username,
        password: 'trtdtxcfcf',
      })
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(401);
    done();
  });

  it('should get the delete endpoint', async (done) => {
    const res = await request.delete(`/users/${userId}`).set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
    done();
  });
});
