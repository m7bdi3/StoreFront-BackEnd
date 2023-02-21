
import client from '../database';

export interface ProductOrder {
    product_id: number;
    quantity: number;
}

export interface Order {
    products: ProductOrder[];
    user_id: number;
    status: boolean;
}

export interface OrderDB extends Order {
    id: number;
}

export class OrderStore {
    async getOrders(): Promise<OrderDB[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders';
            const { rows } = await conn.query(sql);
            const productOrdersSql =
                'SELECT product_id, quantity FROM order_products WHERE order_id=($1)';
            const orders = [];
            for (const order of rows) {
                const { rows: productOrderRows } = await conn.query(
                    productOrdersSql,
                    [order.id]
                );
                orders.push({
                    ...order,
                    products: productOrderRows,
                });
            }
            conn.release();
            return orders;
        } catch (err) {
            throw new Error(`Could not get orders.${err}`);
        }
    }

    async createOrder(order: Order): Promise<OrderDB> {
        const { products, status, user_id } = order;
        try {
            const sql =
                'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
            const conn = await client.connect();
            const { rows } = await conn.query(sql, [user_id, status]);
            const newOrder = rows[0];
            const productOrdersSql =
                'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id, product_id, quantity';
            const productOrders = [];
            for (const product of products) {
                const { product_id, quantity } = product;
                const { rows } = await conn.query(productOrdersSql, [
                    newOrder.id,
                    product_id,
                    quantity,
                ]);
                productOrders.push(rows[0]);
            }
            conn.release();
            return {
                ...newOrder,
                products: productOrders,
            };
        } catch (err) {
            throw new Error(`Could not add new order for user ${user_id}. ${err}`);
        }
    }

    async readOrder(id: number): Promise<OrderDB> {
        const sql = 'SELECT * FROM orders WHERE id=$1';
        try {
            const conn = await client.connect();
            const { rows } = await conn.query(sql, [id]);
            if (!rows.length) {
                throw new Error(`Order with id ${id} not found.`);
            }
            const order = rows[0];
            const productOrdersSql =
                'SELECT product_id, quantity FROM order_products WHERE order_id=$1';
            const { rows: productOrderRows } = await conn.query(productOrdersSql, [
                id,
            ]);
            conn.release();
            return {
                ...order,
                products: productOrderRows,
            };
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`);
        }
    }


    async updateOrder(id: number, order: Order): Promise<OrderDB> {
        const { products, status, user_id } = order;
        try {
          const sql = 'UPDATE orders SET user_id = $1, status = $2 WHERE id = $3 RETURNING *';
          const conn = await client.connect();
          const { rows } = await conn.query(sql, [user_id, status, id]);
          const updatedOrder = rows[0];
    
          // Delete all product orders for the current order
          const deleteSql = 'DELETE FROM order_products WHERE order_id = $1';
          await conn.query(deleteSql, [id]);
    
          // Insert new product orders for the current order
          const insertSql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING product_id, quantity';
          const productOrders = [];
          for (const product of products) {
            const { product_id, quantity } = product;
            const { rows } = await conn.query(insertSql, [id, product_id, quantity]);
            productOrders.push(rows[0]);
          }
    
          conn.release();
          return {
            ...updatedOrder,
            products: productOrders,
          };
        } catch (err) {
          throw new Error(`Could not update order with id ${id}. ${err}`);
        }
      }

    async deleteOrder(id: number): Promise<void> {
        const sql = 'DELETE FROM orders WHERE id = $1';
        try {
            const conn = await client.connect();
            await conn.query(sql, [id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not delete order with id ${id}. ${err}`);
        }
    }
}