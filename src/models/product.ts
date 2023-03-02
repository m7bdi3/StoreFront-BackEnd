import client from '../database';

export interface ProductData {
  name: string;
  price: number;
}

export interface Product extends ProductData {
  id: number;
}

export class ProductStore {

  async truncate1() {
    try {

      const connection = await client.connect();
      const sql1 = 'TRUNCATE TABLE products RESTART IDENTITY CASCADE;'
      const result1 = await connection.query(sql1);
      connection.release();
      return (result1);
    } catch (err) {
      console.error(err);
    }
  }
  async truncate2() {
    try {

      const connection = await client.connect();
      const sql2 = 'TRUNCATE TABLE orders RESTART IDENTITY CASCADE;'
      const result2 = await connection.query(sql2);
      connection.release();
      return (result2);
    } catch (err) {
      console.error(err);
    }
  }
  async truncate3() {
    try {

      const connection = await client.connect();
      const sql3 = 'TRUNCATE TABLE order_products RESTART IDENTITY CASCADE;'
      const result3 = await connection.query(sql3);
      connection.release();
      return (result3);
    } catch (err) {
      console.error(err);
    }
  }
  async getAll(): Promise<Product[]> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM products';
      const { rows } = await connection.query(sql);
      connection.release();
      return rows;
    } catch (err) {
      throw new Error(`Can't Get The Product, Because: ${err}`);
    }
  }
  async create(product: ProductData): Promise<Product> {
    const { name, price } = product;
    try {
      const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
      const conn = await client.connect();
      const { rows } = await conn.query(sql, [name, price]);
      conn.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can't add The Product ${name} Because: ${err}`);
    }
  }
  async getById(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const connection = await client.connect();
      const { rows } = await connection.query(sql, [id]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can't Find The Product ${id} Because: ${err}`);
    }
  }
  async updateById(id: number, productData: ProductData): Promise<Product> {
    const { name: newName, price } = productData;

    try {
      const sql = 'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *';
      const connection = await client.connect();
      const { rows } = await connection.query(sql, [newName, price, id]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can't Update The Product ${name} Because: ${err}`);
    }
  }
  async deleteById(id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      const connection = await client.connect();
      const { rows } = await connection.query(sql, [id]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can't Delete The Product ID: ${id} Because: ${err}`);
    }
  }
}
