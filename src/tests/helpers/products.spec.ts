import supertest from 'supertest';
import jwt, { Secret, VerifyErrors, JwtPayload } from 'jsonwebtoken';
import { Product } from '../../models/product';
import { userAuth } from '../../models/user';
import { app } from '../../server';

const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

describe('Product Handler', () => {
  const product: Product = {
    name: 'Basil Barramunda',
    price: 29,
    id: 0
  };

  const user: userAuth = {
    username: 'ChrisAnne',
    firstname: 'Chris',
    lastname: 'Anne',
    password: 'password123',
  };

  let token: string, userId: number;

  beforeAll(async () => {
    const { body } = await request.post('/users/create').send(user).catch((err) => {
      throw err;
    });
    token = body;
    try {
      const decoded = jwt.verify(body, SECRET) as JwtPayload;
      userId = decoded.user.id;
    } catch (err) {
      console.log(err)
    }
  });

  afterAll(async () => {
    await request.delete(`/users/${userId}`).set('Authorization', 'bearer ' + token).catch((err) => {
      throw err;
    });
  });

  it('should create a product', async (done) => {
    const res = await request
      .post('/products/create')
      .send(product)
      .set('Authorization', 'bearer ' + token)
      .catch((err) => {
        throw err;
      });

    expect(res.status).toBe(200);
    done();
  });

  it('should get all products', async (done) => {
    const res = await request.get('/products').catch((err) => {
      throw err;
    });
    expect(res.status).toBe(200);
    done();
  });

  it('should get a single product', async (done) => {
    const res = await request.get(`/products/1`).catch((err) => {
      throw err;
    });
    expect(res.status).toBe(200);
    done();
  });

  it('should update a product', async (done) => {
    const newProductData: Product = {
      ...product,
      name: 'Shoes',
      price: 234,
    };
    const res = await request
      .put(`/products/1`)
      .send(newProductData)
      .set('Authorization', 'bearer ' + token)
      .catch((err) => {
        throw err;
      });

    expect(res.status).toBe(200);
    done();
  });

  it('should delete a product', async (done) => {
    const res = await request.delete(`/products/1`).set('Authorization', 'bearer ' + token).catch((err) => {
      throw err;
    });
    expect(res.status).toBe(200);
    done();
  });
});
