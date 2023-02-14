import client from '../database';

export interface productOrder {
    product_id: number;
    quantity: number;
}

export interface order {
    products: productOrder[];
    user_id: number;
    status: boolean;
}

export interface Order extends order {
    id: number;
}

export class OrderStore {
    async getOrder(): Promise<Order[]> {
        try {
            // Establish a connection to the database
            const conn = await client.connect();

            // SQL query to retrieve all orders from the "orders" table
            const sql = 'SELECT * FROM orders';
            const { rows } = await conn.query(sql);

            // SQL query to retrieve the products associated with each order
            const productOrdersSql = 'SELECT product_id, quantity FROM order_products WHERE order_id=($1)';
            const orders = [];

            // For each order retrieved from the "orders" table, retrieve its associated products
            // and add them to the order object.
            for (const order of rows) {
                const { rows: productOrderRows } = await conn.query(productOrdersSql, [order.id]);
                orders.push({
                    ...order,
                    products: productOrderRows,
                });
            }

            // Release the connection to the database
            conn.release();

            // Return the array of orders
            return orders;
        } catch (err) {
            // If an error occurs, throw a new error with a descriptive message
            throw new Error(`Could not get orders. ${err}`);
        }
    }


    // This function creates a new order by inserting data into the 'orders' and 'order_products' tables.
    async create(order: order): Promise<Order> {
        // Destructure the order object to extract the product, status, and user_id values.
        const { products, status, user_id } = order;

        try {
            // SQL query to insert data into the 'orders' table and return the inserted order.
            const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
            const conn = await client.connect();
            const { rows } = await conn.query(sql, [user_id, status]);
            const order = rows[0];

            // SQL query to insert data into the 'order_products' table and return the inserted product orders.
            const productOrdersSql =
                'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity';
            const productOrders = [];

            // Iterate over the products and insert each one into the 'order_products' table.
            for (const product of products) {
                const { product_id, quantity } = product;
                const { rows } = await conn.query(productOrdersSql, [order.id, product_id, quantity]);
                productOrders.push(rows[0]);
            }

            // Release the database connection.
            conn.release();

            // Return the newly created order along with the product orders.
            return {
                ...order,
                products: productOrders,
            };
        } catch (err) {
            // Handle errors by throwing a new error with a custom message.
            throw new Error(`Could not add new order for user ${user_id}. ${err}`);
        }
    }



    async read(id: number): Promise<Order> {
        // Define the SQL statement for fetching the order data from the database
        const sql = 'SELECT * FROM orders WHERE id=$1';

        try {
            // Establish a database connection
            const conn = await client.connect();

            // Execute the SQL statement and retrieve the rows from the result
            const { rows } = await conn.query(sql, [id]);

            // Check if there are no rows returned, meaning the order does not exist
            if (!rows.length) {
                throw new Error(`Order with id ${id} not found.`);
            }

            // Assign the first row of the result to the order variable
            const order = rows[0];

            // Define the SQL statement for fetching the order products data
            const productOrdersSql = 'SELECT product_id, quantity FROM order_products WHERE order_id=$1';

            // Execute the SQL statement and retrieve the rows from the result
            const { rows: productOrderRows } = await conn.query(productOrdersSql, [id]);

            // Release the database connection
            conn.release();

            // Return the order with its associated products
            return {
                ...order,
                products: productOrderRows,
            };
        } catch (err) {
            // Throw an error if something went wrong during the process
            throw new Error(`Error fetching order with id ${id}. ${err}`);
        }
    }


    async update(id: number, orderData: order): Promise<Order> {
        try {
            const { products, status, user_id } = orderData;
            // Connect to database
            const conn = await client.connect();
            // Execute the first query to update the status of the order
            const updateOrderSql = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
            const { rows: updatedOrderRows } = await conn.query(updateOrderSql, [status, id]);
            // Retrieve the updated order from the returned rows
            const updatedOrder = updatedOrderRows[0];
            // Execute the second query to update the product order details for the current order
            const updateProductOrderSql = 'UPDATE order_products SET product_id = $1, quantity = $2 WHERE order_id = $3 RETURNING product_id, quantity';
            const productOrders = [];
            for (const product of products) {
                const { rows: updatedProductOrderRows } = await conn.query(updateProductOrderSql, [
                    product.product_id,
                    product.quantity,
                    updatedOrder.id,
                ]);
                productOrders.push(updatedProductOrderRows[0]);
            }
            // Release the database connection
            conn.release();
            // Return the updated order along with the updated product orders
            return {
                ...updatedOrder,
                products: productOrders,
            };
        } catch (err) {
            throw new Error(`Could not update order for user ${orderData.user_id}. ${err}`);
        }
    }


    async deleteOrder(id: number): Promise<Order> {
        try {
            // Establish a connection to the database
            const conn = await client.connect();

            // Delete all the products associated with the order
            const productOrdersSql = 'DELETE FROM order_products WHERE order_id=($1)';
            await conn.query(productOrdersSql, [id]);

            // Delete the order from the orders table
            const sql = 'DELETE FROM orders WHERE id=($1)';
            const { rows } = await conn.query(sql, [id]);
            const order = rows[0];

            // Release the database connection
            conn.release();

            // Return the deleted order
            return order;
        } catch (err) {
            // Throw an error if the order could not be deleted
            throw new Error(`Could not delete order ${id}. ${err}`);
        }
    }
}
