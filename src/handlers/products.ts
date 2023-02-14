import { Application, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyToken } from './helpers';

// Initialize the product store
const productStore = new ProductStore();

// Get all products route
const getAllProduct = async (req: Request, res: Response) => {
    try {
        // Get all the products from the product store
        const products: Product[] = await productStore.index();

        // Return the list of products as the response
        res.json(products);
    } catch (err) {
        // If there's an error, return a 400 Bad Request with the error message
        res.status(400).json(err);
    }
};

// Create product route
const create = async (req: Request, res: Response) => {
    try {
        // Extract the product name and price from the request body
        const name = req.body.name as unknown as string;
        const price = req.body.price as unknown as number;

        // Check if the name and price are present
        if (!name || !price) {
            // If either the name or price is missing, return a 400 Bad Request with an error message
            res.status(400);
            res.send('Some required parameters are missing! eg. :name, :price');
            return false;
        }
        // Create the product
        const product: Product = await productStore.create({
            name, price,
            id: 0
        });

        // Return the created product as the response
        res.json({
            product,
        });
    } catch (err) {
        // If there's an error, return a 400 Bad Request with the error message
        res.status(400).json(err);
    }
};

// Read product route
const read = async (req: Request, res: Response) => {
    try {
        // Extract the product id from the request parameters
        const id = req.params.id as unknown as number;

        // Check if the id is present
        if (!id) {
            // If the id is missing, return a 400 Bad Request with an error message
            res.status(400);
            res.send('Missing required parameter :id.');
            return false;
        }
        // Read the product with the given id
        const product: Product = await productStore.read(id);

        // Return the product as the response
        res.json(product);
    } catch (err) {
        // If there's an error, return a 400 Bad Request with the error message
        res.status(400).json(err);
    }
};


const update = async (req: Request, res: Response) => {
    try {
        // Extract the product id, name, and price from the request
        const id = req.params.id as unknown as number;
        const name = req.body.name as unknown as string;
        const price = req.body.price as unknown as number;

        // If any of the required parameters are missing, return a 400 response with an error message
        if (!name || !price || !id) {
            res.status(400);
            res.send('Some required parameters are missing! eg. :name, :price, :id');
            return false;
        }

        // Update the product in the product store
        const product: Product = await productStore.update(id, {
            name,
            price,
            id: 0
        });

        // Return the updated product in the response
        res.json(product);
    } catch (err) {
        // If an error occurred, return a 400 response with the error
        res.status(400).json(err);
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        // Extract the product id from the request
        const id = req.params.id as unknown as number;

        // If the id is missing, return a 400 response with an error message
        if (!id) {
            res.status(400);
            res.send('Missing required parameter :id.');
            return false;
        }

        // Delete the product from the product store
        await productStore.deleteProduct(id);

        // Return a success message
        res.send(`Product with id ${id} successfully deleted.`);
    } catch (err) {
        // If an error occurred, return a 400 response with the error
        res.status(400);
        res.json(err);
    }
};

// Define the product routes for the Express app
export default function productRoutes(app: Application) {
    app.get('/products', getAllProduct);
    app.post('/products/create', verifyToken, create);
    app.get('/products/:id', read);
    app.put('/products/:id', verifyToken, update);
    app.delete('/products/:id', verifyToken, deleteProduct);
}
