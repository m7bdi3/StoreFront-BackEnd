import { order, Order, OrderStore } from '../../models/order';
import { User, store } from '../../models/user';
import { Product, ProductStore } from '../../models/product';

const orderStore = new OrderStore();

describe('Order Model', () => {
    const USER = new store();
    const productStore = new ProductStore();

    let order: order, user_id: number, product_id: number;

    function createOrder(order: order) {
        return orderStore.create(order);
    }

    function deleteOrder(id: number) {
        return orderStore.deleteOrder(id);
    }

    beforeAll(async () => {
        const user: User = await USER.create({
            username: 'ChrisAnne',
            firstname: 'Chris',
            lastname: 'Anne',
            password: 'password123',
        });

        user_id = user.id;

        const product: Product = await productStore.create({
            name: 'OrderSpec Product',
            price: 99,
            id: 1
        });

        product_id = product.id;

        order = {
            products: [
                {
                    product_id,
                    quantity: 5,
                },
            ],
            user_id,
            status: true,
        };
    });

    afterAll(async () => {
        await USER.deleteUser(user_id);
        await productStore.deleteProduct(product_id);
    });

    it('should have an index method', () => {
        expect(orderStore.getOrder).toBeDefined();
    });

    it('should have a show method', () => {
        expect(orderStore.read).toBeDefined();
    });

    it('should have a add method', () => {
        expect(orderStore.create).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(orderStore.deleteOrder).toBeDefined();
    });

    it('should add a order', async () => {
        const createdOrder: Order = await createOrder(order);
        expect(createdOrder).toEqual({
            id: createdOrder.id,
            ...order,
        });

        await deleteOrder(createdOrder.id);
    });

    it('should return a list of orders', async () => {
        const createdOrder: Order = await createOrder(order);
        const orderList = await orderStore.getOrder();
        expect(orderList).toEqual([createdOrder]);
        await deleteOrder(createdOrder.id);
    });

    it('show method should return the correct orders', async () => {
        const createdOrder: Order = await createOrder(order);
        const orderData = await orderStore.read(createdOrder.id);
        expect(orderData).toEqual(createdOrder);
        await deleteOrder(createdOrder.id);
    });

    it('should update the order', async () => {
        const createdOrder: Order = await createOrder(order);
        const orderData: order = {
            products: [
                {
                    product_id,
                    quantity: 20,
                },
            ],
            user_id,
            status: false,
        };
        const { products, status } = await orderStore.update(createdOrder.id, orderData);
        expect(products).toEqual(orderData.products);
        expect(status).toEqual(orderData.status);
        await deleteOrder(createdOrder.id);
    });

    it('should remove the order item', async () => {
        const createdOrder: Order = await createOrder(order);
        await deleteOrder(createdOrder.id);
        const orderList = await orderStore.getOrder();
        expect(orderList).toEqual([]);
    });
});
