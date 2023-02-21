import request from 'supertest';
import app from '../server';

describe('Order routes', () => {
  it('GET /orders should return a 200 status code', async () => {
    const response = await request(app).get('/orders');
    expect(response.status).toEqual(200);
  });

  it('POST /orders/create should return a 401 status code if no token is provided', async () => {
    const response = await request(app).post('/orders/create');
    expect(response.status).toEqual(401);
  });

  // Add more tests for order routes here...
});

describe('Product routes', () => {
  it('GET /products should return a 200 status code', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toEqual(200);
  });

  it('POST /products/create should return a 401 status code if no token is provided', async () => {
    const response = await request(app).post('/products/create');
    expect(response.status).toEqual(401);
  });

  // Add more tests for product routes here...
});

describe('User routes', () => {
  it('GET /users should return a 200 status code', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toEqual(200);
  });

  it('POST /users/create should return a 200 status code', async () => {
    const response = await request(app).post('/users/create').send({
      username: 'testuser',
      password: 'testpassword',
    });
    expect(response.status).toEqual(200);
  });

  // Add more tests for user routes here...
});
