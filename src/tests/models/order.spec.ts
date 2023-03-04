import { OrderData, Order, OrderStore } from '../../models/order';
import { Product, ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

const createOrder = async (order: OrderData) => {
  const createdOrder = await orderStore.create(order);
  return createdOrder;
};

const deleteTheOrder = async (id: number) => {
  const deletedOrder = await orderStore.deleteTheOrder(id);
  return deletedOrder;
};

describe('The Order Model', () => {
  let order: OrderData;
  let user_id: number;
  let product_id: number;

  beforeAll(async () => {
    const user: User = await userStore.createUser({
      username: 'jackjones',
      firstname: 'jack',
      lastname: 'jones',
      password: 'password123',
    });

    user_id = user.id;

    const product: Product = await productStore.create({
      name: 'CPU Product',
      price: 150,
    });

    product_id = product.id;

    order = {
      products: [{
        product_id,
        quantity: 5,
      }],
      user_id,
      status: true,
    };
  });

  // afterEach(async () => {
  //   await productStore.truncate1();
  //   await productStore.truncate2();
  //   await productStore.truncate3();
  // });

  afterAll(async () => {
    await productStore.truncate1();
    await productStore.truncate2();
    await productStore.truncate3();
    // await userStore.deleteUserById(user_id);
    // await productStore.deleteById(product_id);
  });

  it('Has The Delete Method', () => {
    expect(orderStore.deleteTheOrder).toBeDefined();
  });

  it('Has The Show Method', () => {
    expect(orderStore.read).toBeDefined();
  });

  it('Has The Index Method', () => {
    expect(orderStore.getOrder).toBeDefined();
  });

  it('Has The Add Method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('Adds The Order', async () => {
    const createdOrder: Order = await createOrder(order);
    expect(createdOrder).toEqual({ id: createdOrder.id, ...order, });
    await deleteTheOrder(createdOrder.id);
  });

  it('Returns The List Of Orders', async () => {
    const createdOrder: Order = await createOrder(order);
    const orderList = await orderStore.getOrder();
    expect(orderList).toEqual([createdOrder]);
    await deleteTheOrder(createdOrder.id);
  });

  it('Shows The Method That Returns The Correct Orders', async () => {
    const createdOrder: Order = await createOrder(order);
    const orderData = await orderStore.read(createdOrder.id);
    expect(orderData).toEqual(createdOrder);
    await deleteTheOrder(createdOrder.id);
  });

  it('Updating The Order', async () => {
    const createdOrder: Order = await createOrder(order);
    const orderData: OrderData = {
      products: [{
        product_id,
        quantity: 20,
      }],
      user_id,
      status: false,
    };
    const { products, status } = await orderStore.update(createdOrder.id, orderData);
    expect(products).toEqual(orderData.products);
    expect(status).toEqual(orderData.status);
    await deleteTheOrder(createdOrder.id);
  });

  it('Removing The Order Item', async () => {
    const createdOrder: Order = await createOrder(order);
    await deleteTheOrder(createdOrder.id);
    const orderList = await orderStore.getOrder();
    expect(orderList).toEqual([]);
  });
});
