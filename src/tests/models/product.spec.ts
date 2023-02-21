import { Product, ProductId, ProductStore } from '../../models/product';

describe('Product Model', () => {
  const productStore = new ProductStore();

  beforeAll(async () => {
    await productStore.deleteAllProducts();
  });

  afterAll(async () => {
    await productStore.deleteAllProducts();
  });

  describe('create', () => {
    it('creates a new product', async () => {
      const newProduct = await productStore.create({
        name: 'new product',
        price: 50,
      });
      expect(newProduct).toContain('id');
      expect(newProduct.name).toEqual('new product');
      expect(newProduct.price).toEqual(50);
    });
  });

  describe('index', () => {
    it('lists all products', async () => {
      const products = await productStore.index();
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('read', () => {
    it('gets a product by id', async () => {
      const newProduct = await productStore.create({
        name: 'new product',
        price: 50,
      });
      const product = await productStore.read(newProduct.id!);
      expect(product).toContain('id');
      expect(product.name).toEqual('new product');
      expect(product.price).toEqual(50);
    });
  });

  describe('update', () => {
    it('updates a product by id', async () => {
      const newProduct = await productStore.create({
        name: 'new product',
        price: 50,
      });
      const updatedProduct: ProductId  = await productStore.update(newProduct.id!, {
        name: 'updated product',
        price: 100,
      });
      expect(updatedProduct).toContain('id');
      expect(updatedProduct.name).toEqual('updated product');
      expect(updatedProduct.price).toEqual(100);
    });

    it('returns null if product is not found', async () => {
      const updatedProduct = await productStore.update(-1, {
        name: 'updated product',
        price: 100,
      });
      expect(updatedProduct).toBeNull();
    });
  });

  describe('delete', () => {
    it('deletes a product by id', async () => {
      const newProduct = await productStore.create({
        name: 'new product',
        price: 50,
      });
      const deletedProduct = await productStore.deleteProduct(newProduct.id!);
      expect(deletedProduct).toContain('id');
      expect(deletedProduct.name).toEqual('new product');
      expect(deletedProduct.price).toEqual(50);
      const product = await productStore.read(newProduct.id!);
      expect(product).toBeNull();
    });
  });

  describe('deleteAllProducts', () => {
    it('deletes all products', async () => {
      const newProduct1 = await productStore.create({
        name: 'new product 1',
        price: 50,
      });
      const newProduct2 = await productStore.create({
        name: 'new product 2',
        price: 100,
      });
      await productStore.deleteAllProducts();
      const products = await productStore.index();
      expect(products.length).toEqual(0);
    });
  });
});
