import { Application, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyToken } from './helpers';

const productStore = new ProductStore();

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products: Product[] = await productStore.index();
        res.json(products);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({ error: 'Missing required parameters: name and price' });
        }

        const product: Product = await productStore.create({ name, price });

        res.status(201).json({ product });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

const readProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }

        const product: Product = await productStore.read(Number(id));

        res.json(product);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};


const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        if (!name || !price || !id) {
            return res.status(400).json({ error: 'Missing required parameters: id, name, and price' });
        }

        const product: Product | null 
            = await productStore.update(Number(id), { id: Number(id), name, price });

        res.json(product);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Missing required parameter: id' });
        }

        await productStore.deleteProduct(Number(id));

        res.json({ message: `Product with id ${id} has been deleted` });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export default function productRoutes(app: Application) {
    app.get('/products', getAllProducts);
    app.post('/products/create', verifyToken, createProduct);
    app.get('/products/:id', readProduct);
    app.put('/products/:id', verifyToken, updateProduct);
    app.delete('/products/:id', verifyToken, deleteProduct);
}
