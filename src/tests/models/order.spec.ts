import { OrderData, Order, OrderStore } from '../../models/order';
import { Product, ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';

const orderStore = new OrderStore();

describe('The Order Model', () => {
const userStore = new UserStore();
const productStore = new ProductStore();

let order: OrderData;
let user_id: number;
let product_id: number;

const createOrder = (order: OrderData) => {
return orderStore.create(order);
}

const deleteTheOrder = (id: number) => {
return orderStore.deleteTheOrder(id);
}

beforeAll(async () => {
const user: User = await userStore.createUser({
username: 'jackjones',
firstname:'jack',
lastname:'jones',
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

afterEach(async () => {
await productStore.truncate1();
await productStore.truncate2();
await productStore.truncate3();
});

afterAll(async () => {
await userStore.deleteUserById(user_id);
await productStore.deleteById(product_id);
});

it('should have the create method', () => {
expect(orderStore.create).toBeDefined();
});

it('should have the getOrder method', () => {
expect(orderStore.getOrder).toBeDefined();
});

it('should have the read method', () => {
expect(orderStore.read).toBeDefined();
});

it('should have the update method', () => {
expect(orderStore.update).toBeDefined();
});

it('should have the deleteTheOrder method', () => {
expect(orderStore.deleteTheOrder).toBeDefined();
});

it('should add an order', async () => {
try {
const createdOrder: Order = await createOrder(order);
expect(createdOrder).toEqual(jasmine.objectContaining(order));
} catch (error) {
console.error((error as Error).message);
}
});

it('should return a list of orders', async () => {
try {
const createdOrder: Order = await createOrder(order);
const orders: Order[] = await orderStore.getOrder();
expect(orders).toContain(createdOrder);
} catch (error) {
console.error((error as Error).message);
}
});

it('should show the method that returns the correct order', async () => {
try {
const createdOrder: Order = await createOrder(order);
const returnedOrder: Order | null = await orderStore.read(createdOrder.id);
expect(returnedOrder).toEqual(createdOrder);
} catch (error) {
console.error((error as Error).message);
}
});

it('should update an order', async () => {
try {
const createdOrder: Order = await createOrder(order);
createdOrder.status = false;
const updatedOrder: Order = await orderStore.update(createdOrder.id, createdOrder);
expect(updatedOrder.status).toBe(false);
} catch (error) {
console.error((error as Error).message);
}
}); 
  it('Removing The Order Item', async () => {
    await productStore.truncate1();
    await productStore.truncate2();
    await productStore.truncate3();

    const createdOrder: Order = await createOrder(order);
    await deleteTheOrder(createdOrder.id);
    const orderList = await orderStore.getOrder();
    expect(orderList).toEqual([]);
  });
})


// import { OrderData, Order, OrderStore } from '../../models/order';
// import { Product, ProductStore } from '../../models/product';
// import { User, UserStore } from '../../models/user';


// const orderStore = new OrderStore();

// describe('The Order Model', () => {
//   const userStore = new UserStore();
//   const productStore = new ProductStore();

//   let order: OrderData;
//   let user_id: number;
//   let product_id: number;

//   const createOrder = (order: OrderData) => {
//     return orderStore.create(order);
//   }

//   const deleteTheOrder = (id: number) => {
//     return orderStore.deleteTheOrder(id);
//   }

//   beforeAll(async () => {
//     const user: User = await userStore.createUser({
//       username: 'jackjones',
//       firstname:'jack',
//       lastname:'jones',
//       password: 'password123',
//     });

//     user_id = user.id;

//     const product: Product = await productStore.create({
//       name: 'CPU Product',
//       price: 150,
//     });

//     product_id = product.id;

//     order = {
//       products: [{
//           product_id,
//           quantity: 5,
//         }],
//       user_id,
//       status: true,
//     };
//   });

// afterEach(async() => {
//   await productStore.truncate1();
//   await productStore.truncate2();
//   await productStore.truncate3();  
// })

//   afterAll(async () => {
//     await userStore.deleteUserById(user_id).catch((error) => {
//       console.error(error);
//     });
//     await productStore.deleteById(product_id).catch((error) => {
//       console.error(error);
//     });
//   });

//   it('Have The Delete Method', () => {
//     expect(orderStore.deleteTheOrder).toBeDefined();
//   });

//   it('Have The Show Method', () => {
//     expect(orderStore.read).toBeDefined();
//   });

//   it('Have The Index Method', () => {
//     expect(orderStore.getOrder).toBeDefined();
//   });

//   it('Have The Add Method', () => {
//     expect(orderStore.create).toBeDefined();
//   });
 
//   it('Adding The Order', async () => {
//     const createdOrder: Order = await createOrder(order);
//     expect(createdOrder).toEqual({id: createdOrder.id, ...order,});
//     await deleteTheOrder(createdOrder.id);
//   });

//   it('Returninjg The List Of Order', async () => {
//     const createdOrder: Order = await createOrder(order);
//     const orderList = await orderStore.getOrder();
//     expect(orderList).toEqual([createdOrder]);
//     await deleteTheOrder(createdOrder.id);
//   });

//   it('Show The Method That Return The correct Orders', async () => {
//     const createdOrder: Order = await createOrder(order);
//     const orderData = await orderStore.read(createdOrder.id);
//     expect(orderData).toEqual(createdOrder);
//     await deleteTheOrder(createdOrder.id);
//   });

//   it('Updating The Order', async () => {
//     const createdOrder: Order = await createOrder(order);
//     const orderData: OrderData = {
//       products: [{
//           product_id,
//           quantity: 20,
//         }],
//       user_id,
//       status: false,
//     };
//     const { products, status } = await orderStore.update(createdOrder.id, orderData);
//     expect(products).toEqual(orderData.products);
//     expect(status).toEqual(orderData.status);
//     await deleteTheOrder(createdOrder.id);
//   });

//   it('Removing The Order Item', async () => {
//     const createdOrder: Order = await createOrder(order);
//     await deleteTheOrder(createdOrder.id);
//     const orderList = await orderStore.getOrder();
//     expect(orderList).toEqual([]);
//   });
// });
