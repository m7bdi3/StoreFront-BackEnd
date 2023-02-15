/* eslint-disable @typescript-eslint/ban-ts-comment */
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const Secret = require('jsonwebtoken');
const { OrderStore } = require('../../models/order');
const app = require('../../server');
const server = require('../../server')
const request = supertest(app);

describe('Order Handler', () => {
    let token: string;
    const secret = 'secret-key';
    beforeAll(() => {
        spyOn(OrderStore.prototype, 'create').and.returnValue(
            Promise.resolve({
                id: 1,
                products: [
                    {
                        product_id: 5,
                        quantity: 5,
                    },
                ],
                user_id: 3,
                status: true,
            })
        );

        spyOn(OrderStore.prototype, 'update').and.returnValue(
            Promise.resolve({
                id: 2,
                products: [
                    {
                        product_id: 5,
                        quantity: 5,
                    },
                ],
                user_id: 3,
                status: false,
            })
        );
    });

    beforeEach(() => {
        const userData = {
            username: 'ChrisAnne',
            firstname: 'Chris',
            lastname: 'Anne',
            password: 'password123',
        };
        token = jwt.sign(userData, secret);
    });

    it('should create an order', async () => {
        const res = await request(server)
            .post('/orders/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                products: [
                    {
                        product_id: 5,
                        quantity: 5,
                    },
                ],
                user_id: 3,
                status: true,
            });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            id: 1,
            products: [
                {
                    product_id: 5,
                    quantity: 5,
                },
            ],
            user_id: 3,
            status: true,
        });
    });

    it('should get all orders', async () => {
        const res = await request(server)
            .get('/orders')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toEqual(200);
    });

    it('should get an order by id', async () => {
        const res = await request(server)
            .get(`/orders/1`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toEqual(200);
    });

    it('should delete an order by id', async () => {
        const res = await request(server)
            .delete(`/orders/2`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toEqual(200);
    });
});

describe('JSON Web Token', () => {
    it('should encode and decode JWT successfully', () => {
        const secret: typeof Secret = 'secret-key';
        const payload = {
            username: 'ChrisAnne',
            firstname: 'Chris',
            lastname: 'Anne',
        };
        const token = jwt.sign(payload, secret);
        const decoded = jwt.verify(token, secret) as any;

        expect(decoded.username).toEqual(payload.username);
        expect(decoded.firstname).toEqual(payload.firstname);
        expect(decoded.lastname).toEqual(payload.lastname);
    });
});
