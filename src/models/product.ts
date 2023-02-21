import { Pool, QueryResult } from 'pg';
let product: Product | null = null;

export interface Product {
id?: number;
name: string;
price: number;
}

export interface ProductId extends Product {
id: number;
}

export class ProductStore {
pool: Pool;

constructor() {
this.pool = new Pool();
}

async index(): Promise<ProductId[]> {
try {
const sql = 'SELECT * FROM products';
const client = await this.pool.connect();
const { rows } = await client.query<ProductId>(sql);
client.release();
return rows;
} catch (err) {
throw new Error(`Could not get products. ${err}`);
}
}

async create(product: Product): Promise<ProductId> {
const { name, price } = product;
try {
const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
const client = await this.pool.connect();
const { rows } = await client.query<ProductId>(sql, [name, price]);
client.release();
return rows[0];
} catch (err) {
throw new Error(`Could not add new product ${name}. ${err}`);
}
}

async read(id: number): Promise<ProductId> {
try {
const sql = 'SELECT * FROM products WHERE id=($1)';
const client = await this.pool.connect();
const { rows } = await client.query<ProductId>(sql, [id]);
client.release();
return rows[0];
} catch (err) {
throw new Error(`Could not find product ${id}. ${err}`);
}
}

async update(id: number, productData: Product): Promise<ProductId> {
const { name, price } = productData;
try {
const sql = 'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *';
const client = await this.pool.connect();
const { rows } = await client.query<ProductId>(sql, [name, price, id]);
client.release();
return rows[0];
} catch (err) {
throw new Error(`Could not update product ${id}. ${err}`);
}
}

async deleteProduct(id: number): Promise<ProductId> {
try {
const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
const client = await this.pool.connect();
const { rows } = await client.query<ProductId>(sql, [id]);
client.release();
return rows[0];
} catch (err) {
throw new Error(`Could not delete product ${id}. ${err}`);
}
}

async deleteAllProducts(): Promise<void> {
try {
const sql = 'DELETE FROM products';
const client = await this.pool.connect();
await client.query(sql);
client.release();
} catch (err) {
throw new Error(`Could not delete all products. ${err}`);
}
}
}