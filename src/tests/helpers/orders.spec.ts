import supertest from 'supertest';
import { OrderStore } from '../../models/order';
import { Product } from '../../models/product';
import { UserAuth } from '../../models/user';
import app from '../../server';

export const createTestRequest = () => supertest(app);
const request = createTestRequest();

describe('Order Handler', () => {
    let token: string;

    beforeAll(async () => {
        const userData: UserAuth = {
            username: 'ChrisAnne',
            firstname: 'Chris',
            lastname: 'Anne',
            password_digest: 'password123',
        };

        const productData: Product = {
            name: 'Shoes',
            price: 234,
        };

        const { body: userBody } = await request.post('/users/create').send(userData);
        token = userBody;

        spyOn(OrderStore.prototype, 'createOrder').and.returnValue(
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

        spyOn(OrderStore.prototype, 'updateOrder').and.returnValue(
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

    it('should create order endpoint', async (done) => {
        const res = await request
            .post('/orders/create')
            .set('Authorization', 'Bearer ' + token)
            .send({
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

        expect(res.status).toBe(200);
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
        done();
    });

    it('gets the index endpoint', async (done) => {
        request
            .get('/orders')
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('should gets the read endpoint', async (done) => {
        request
            .get(`/orders/1`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });

    it('should gets the delete endpoint', async (done) => {
        request
            .delete(`/orders/2`)
            .set('Authorization', 'bearer ' + token)
            .then((res) => {
                expect(res.status).toBe(200);
                done();
            });
    });
});