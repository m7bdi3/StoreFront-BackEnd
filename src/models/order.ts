import client from '../database';

export interface OrderProduct {
  product_id: number;
  quantity: number;
}

export interface OrderData {
  products: OrderProduct[];
  user_id: number;
  status: boolean;
}

export interface Order extends OrderData {
  id: number;
}

export class OrderStore {
  async getOrder(): Promise<Order[]> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM orders';
      const { rows } = await connection.query(sql);
      const orderProductsSql = 'SELECT product_id, quantity FROM order_products WHERE order_id=($1)';
      const orders = [];
      for (const order of rows) {
        const { rows: orderProductRows } = await connection.query(orderProductsSql, [order.id]);
        orders.push({
          ...order,
          products: orderProductRows,
        });
      }
      connection.release();
      return orders;
    } catch (err) {
      throw new Error(`Can't Get The Order, Because: ${err}`);
    }
  }
  async create(order: OrderData): Promise<Order> {
    const { products, status, user_id } = order;
    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const connection = await client.connect();
      const { rows } = await connection.query(sql, [user_id, status]);
      const order = rows[0];
      const orderProductsSql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity';
      const orderProducts = [];
      for (const product of products) {
        const { product_id, quantity } = product;
        const { rows } = await connection.query(orderProductsSql, [order.id, product_id, quantity]);
        orderProducts.push(rows[0]);
      }
      connection.release();
      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`Can't Add The Order For User: ${user_id} Because: ${err}`);
    }
  }
  async read(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const connection = await client.connect();
      const { rows } = await connection.query(sql, [id]);
      const order = rows[0];
      const orderProductsSql = 'SELECT product_id, quantity FROM order_products WHERE order_id=($1)';
      const { rows: orderProductRows } = await connection.query(orderProductsSql, [id]);
      connection.release();
      return {
        ...order,
        products: orderProductRows,
      };
    } catch (err) {
      throw new Error(`Can't Find The Order ID: ${id} Because: ${err}`);
    }
  }
  async update(id: number, orderData: OrderData): Promise<Order> {
    const { products, status, user_id } = orderData;
    try {
      const sql = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
      const connection = await client.connect();
      const { rows } = await connection.query(sql, [status, id]);
      const order = rows[0];
      const orderProductsSql = 'UPDATE order_products SET product_id = $1, quantity = $2 WHERE order_id = $3 RETURNING product_id, quantity';
      const orderProducts = [];
      for (const product of products) {
        const { rows } = await connection.query(orderProductsSql, [
          product.product_id,
          product.quantity,
          order.id,
        ]);
        orderProducts.push(rows[0]);
      }
      connection.release();
      return {
        ...order,
        products: orderProducts,
      };
    } catch (err) {
      throw new Error(`Can't Update The Order For User: ${user_id} Because: ${err}`);
    }
  }
  async deleteTheOrder(id: number): Promise<Order> {
    try {
      const connection = await client.connect();
      const orderProductsSql = 'DELETE FROM order_products WHERE order_id=($1)';
      await connection.query(orderProductsSql, [id]);
      const sql = 'DELETE FROM orders WHERE id=($1)';
      const { rows } = await connection.query(sql, [id]);
      const order = rows[0];
      connection.release();
      return order;
    } catch (err) {
      throw new Error(`Can't Delete The Order ID: ${id} Because: ${err}`);
    }
  }
}
