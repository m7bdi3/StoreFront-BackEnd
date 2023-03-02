import { UserCredentials } from '../../models/user';
import { ProductData  } from '../../models/product';
import jwt, { Secret } from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../server';

const Secret_Token_Key = process.env.TOKEN_KEY as Secret;
const request = supertest(app);

describe('Handler The Product', () => {
  const product: ProductData  = {
    name: 'CPU',
    price: 29,
  };

  let theToken: string;
  let idOfUser: number;

  beforeAll(async () => {
    const dataOfTheUser: UserCredentials = {
      username: 'jackjones',
      firstname:'jack',
      lastname:'jones',
      password: 'password123',
    };

    const { body } = await request.post('/usersroutes/create').send(dataOfTheUser);
    theToken = body;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(body, Secret_Token_Key);
    idOfUser = user.id;
  });

  afterAll(async () => {
    await request.delete(`/users/${idOfUser}`).set('Authorization', 'bearer ' + theToken);
  });

  it('Get The Create End-Point', async () => {
    const res = await request.post('/productsroutes/create').send(product).set('Authorization', 'bearer ' + theToken);
    expect(res.status).toBe(200);
  });

  it('Get The Inxdex End-Point', async () => {
    const res = await request.get('/productsroutes');
    expect(res.status).toBe(200);
  });

  it('Get The Read End-Point', async () => {
    const res = await request.get(`/productsroutes/2`);
    expect(res.status).toBe(200);
  });

  it('Get The Update End-Point', async () => {
    const theNewProduct: ProductData  = {
      ...product,
      name: 'RAM',
      price: 234,
    };
    const res = await request.put(`/productsroutes/1`).send(theNewProduct).set('Authorization', 'bearer ' + theToken);
    expect(res.status).toBe(200);
  });

  it('Get The Delete End-Point', async () => {
    const res = await request.delete(`/productsroutes/2`).set('Authorization', 'bearer ' + theToken);
    expect(res.status).toBe(200);
  });
});
