/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OrderData, OrderStore } from '../../models/order';
import { UserCredentials } from '../../models/user';
import { ProductData  } from '../../models/product';
import jwt, { Secret } from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('Handler The Order', () => {
    let theToken: string;

    beforeAll(async () => {
        const dataOfTheUser: UserCredentials = {
            username: 'jackjones',
            firstname: 'jack',
            lastname: 'jones',
            password: 'password123',
        };

        const productData: ProductData = {
            name: 'CPU',
            price: 234,
        };

        const { body: userBody } = await request.post('/usersroutes/create').send(dataOfTheUser);
        theToken = userBody;

        spyOn(OrderStore.prototype, 'create').and.returnValue(Promise.resolve({
            id: 1,
            products: [{
                product_id: 5,
                quantity: 5,
            }],
            user_id: 3,
            status: true,
        })
        );

        spyOn(OrderStore.prototype, 'update').and.returnValue(Promise.resolve({
            id: 2,
            products: [{
                product_id: 5,
                quantity: 5,
            }],
            user_id: 3,
            status: false,
        })
        );
    });

    it('Creating Order End-Point', async () => {
        const res = await request
            .post('/ordersroutes/create').set('Authorization', 'Bearer ' + theToken).send({
                id: 1,
                products: [{
                    product_id: 5,
                    quantity: 5,
                }],
                user_id: 3,
                status: true,
            });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            id: 1,
            products: [{
                product_id: 5,
                quantity: 5,
            }],
            user_id: 3,
            status: true,
        });
    });

    it('Get The Index End-Point', async () => {
        request.get('/ordersroutes').set('Authorization', 'bearer ' + theToken).then((res) => {
            expect(res.status).toBe(200);
        });
    });

    it('Get The Read End-Point', async () => {
        request.get(`/ordersroutes/1`).set('Authorization', 'bearer ' + theToken).then((res) => {
            expect(res.status).toBe(200);
        });
    });

    it('Get The Delete End-Point', async () => {
        request.delete(`/ordersroutes/2`).set('Authorization', 'bearer ' + theToken).then((res) => {
            expect(res.status).toBe(200);
        });
    });
});
