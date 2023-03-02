import { ProductData , Product, ProductStore } from '../../models/product';

const productStore = new ProductStore();

describe('Model of Product', () => {
    const product: ProductData  = {
        name: 'RAM',
        price: 2000,
    };

    async function createProduct(product: ProductData ) {
        return productStore.create(product);
    }

    async function deleteTheProduct(id: number) {
        return productStore.deleteById(id);
    }

    beforeAll(async () => {
        await productStore.truncate1();
        await productStore.truncate2();
        await productStore.truncate3();

    })

    afterAll(async () => {
        await productStore.truncate1();
        await productStore.truncate2();
        await productStore.truncate3();

    })

    beforeEach(async () => {
        await productStore.truncate1();
        await productStore.truncate2();
        await productStore.truncate3();

    })

    it('Have The Index Method', () => {
        expect(productStore.getAll).toBeDefined();
    });

    it('Have The Show Method', () => {
        expect(productStore.getById).toBeDefined();
    });

    it('Have The add Method', () => {
        expect(productStore.create).toBeDefined();
    });

    it('Have The Delete Method', () => {
        expect(productStore.deleteById).toBeDefined();
    });

    it('Adding The Product', async () => {
        const createdProduct: Product = await createProduct(product);
        expect(createdProduct).toEqual({
            id: createdProduct.id,
            ...product
        });
        await deleteTheProduct(createdProduct.id);
    });

    it('Returning The List Of The Product', async () => {

        const createdProduct: Product = await createProduct(product);
        const productData = await productStore.getById(createdProduct.id);
        const productList = await productStore.getAll();
        expect(productList).toContain({
            id: 1,
            name: 'RAM',
            price: 2000,
        });
    });

    it('Returning The Correct Product', async () => {
        const createdProduct: Product = await createProduct(product);
        const productData = await productStore.getById(createdProduct.id);
        expect(productData).toEqual(createdProduct);
        await deleteTheProduct(createdProduct.id);
    });

    it('Updating The Product', async () => {
        const createdProduct: Product = await createProduct(product);
        const newProduct: ProductData  = {
            name: 'New Product List',
            price: 2423,
        };
        const { name, price } = await productStore.updateById(createdProduct.id, newProduct);
        expect(name).toEqual(newProduct.name);
        expect(price).toEqual(newProduct.price);
        await deleteTheProduct(createdProduct.id);
    });

    it('should remove the product', async () => {
        const createdProduct: Product = await createProduct(product);
        expect(createdProduct).toEqual({
            id: createdProduct.id,
            name: 'RAM',
            price: 2000,
        });
    });
});
