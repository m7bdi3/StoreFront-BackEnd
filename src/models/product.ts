import client from '../database';

// Define the interface for a product
export interface Product {
    id: number;
    name: string;
    price: number;
}

// Extend the Product interface to include an ID field
export interface ProductId extends Product {
    id: number;
}

// Define the ProductStore class to handle product data operations
export class ProductStore {
    // Get a list of all products
    async index(): Promise<ProductId[]> {
        try {
            // Connect to the database
            const conn = await client.connect();
            // Define the SQL query to select all products
            const sql = 'SELECT * FROM products';
            // Execute the query and get the returned rows
            const { rows } = await conn.query(sql);
            // Release the connection to the database
            conn.release();
            // Return the rows
            return rows;
        } catch (err) {
            // Throw an error if there was a problem getting the products
            throw new Error(`Could not get products. ${err}`);
        }
    }

    // Create a new product
    async create(product: Product): Promise<ProductId> {
        // Destructure the product object to get its name and price
        const { name, price } = product;
        try {
            // Define the SQL query to insert a new product
            const sql =
                'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
            // Connect to the database
            const conn = await client.connect();
            // Execute the query and get the returned rows
            const { rows } = await conn.query(sql, [name, price]);
            // Release the connection to the database
            conn.release();
            // Return the first row of the returned rows
            return rows[0];
        } catch (err) {
            // Throw an error if there was a problem adding the new product
            throw new Error(`Could not add new product ${name}. ${err}`);
        }
    }

    // Read a specific product by its ID
    async read(id: number): Promise<ProductId> {
        try {
            // Define the SQL query to select a product by its ID
            const sql = 'SELECT * FROM products WHERE id=($1)';
            // Connect to the database
            const conn = await client.connect();
            // Execute the query and get the returned rows
            const { rows } = await conn.query(sql, [id]);
            // Release the connection to the database
            conn.release();
            // Return the first row of the returned rows
            return rows[0];
        } catch (err) {
            // Throw an error if there was a problem finding the product
            throw new Error(`Could not find product ${id}. ${err}`);
        }
    }

    // Update a specific product by its ID
    async update(id: number, productData: Product): Promise<ProductId> {
        // Destructure the productData object to get its name and price
        const { name: newName, price } = productData;

        try {
            // destructuring productData into newName and price
            const { name: newName, price } = productData;
            // SQL statement to update product data
            const sql =
                'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *';
            const conn = await client.connect();
            // execute the update query with newName, price, and id as parameters
            const { rows } = await conn.query(sql, [newName, price, id]);
            // release the connection
            conn.release();
            // return the updated product data
            return rows[0];
        } catch (err) {
            // throw error if updating the product data fails
            throw new Error(`Could not update product ${name}. ${err}`);
        }
    }

    // delete the product with the given product id
    async deleteProduct(id: number): Promise<ProductId> {
        try {
            // SQL statement to delete product data
            const sql = 'DELETE FROM products WHERE id=($1)';
            const conn = await client.connect();
            // execute the delete query with id as a parameter
            const { rows } = await conn.query(sql, [id]);
            // release the connection
            conn.release();
            // return the deleted product data
            return rows[0];
        } catch (err) {
            // throw error if deleting the product data fails
            throw new Error(`Could not delete product ${id}. ${err}`);
        }
    }
}            